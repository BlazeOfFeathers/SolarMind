"""Predictive planner (MPC): plans the next hours per quarter and re-plans every minute.

Pure Python, no Home Assistant imports.

The idea is the one RoomMind uses for heating: predict, plan a horizon, carry out only
the present step and plan again with fresh measurements. SolarMind keeps its real-time
allocator (every 10 s) as the executor; the planner only tells it, per load, how much
grid power it should take in the present quarter.

1. **Sun pass.** Per quarter the expected surplus (forecast sun minus house load) is
   handed out in priority order, the way the allocator would: an on/off load needs its
   full power, a car at least its minimum current. That gives what each load will get
   from the sun before its deadline.
2. **Grid pass.** What is still missing is placed in the quarters where it is allowed
   (night window, before the departure), lowest import first and, at equal import, as
   late as possible (so a sunnier day than forecast still helps). On/off loads take whole
   quarters at their power; a car or battery gets a level that keeps the quarter average
   as flat and as low as possible (water filling). With the peak guard planning on, no
   quarter goes over the peak limit unless the need cannot be met otherwise.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from ..const import LOAD_EV, LOAD_SWITCH
from .predict import SLOT_S, slot_start

INF = float("inf")


@dataclass
class PlanLoad:
    id: str
    kind: str  # LOAD_SWITCH | LOAD_EV | LOAD_BATTERY
    power_w: float  # on/off: nominal power; car/battery: maximum
    min_w: float = 0.0  # car: power at the minimum current
    need_kwh: float = 0.0
    solar: bool = True  # takes part in the sun pass
    solar_until: float = INF  # sun counts for the need until this time
    grid: bool = False  # the planner schedules grid energy for it
    grid_until: float = INF
    grid_windows: list[tuple[float, float]] = field(default_factory=list)  # empty = any time before grid_until
    tolerance_w: float = 0.0  # import tolerated while running on sun
    goal: str = ""  # night | departure | battery (shown in the panel)
    need_source: str = ""


@dataclass
class Plan:
    created: float = 0.0
    slots: list[float] = field(default_factory=list)
    pv_w: list[float] = field(default_factory=list)
    base_w: list[float] = field(default_factory=list)
    solar_w: dict[str, list[float]] = field(default_factory=dict)
    grid_w: dict[str, list[float]] = field(default_factory=dict)
    import_w: list[float] = field(default_factory=list)
    limit_w: float | None = None
    loads: dict[str, dict[str, Any]] = field(default_factory=dict)

    def index(self, now: float) -> int | None:
        if not self.slots:
            return None
        i = int((slot_start(now) - self.slots[0]) // SLOT_S)
        return i if 0 <= i < len(self.slots) else None

    def grid_now(self, load_id: str, now: float) -> float:
        i = self.index(now)
        g = self.grid_w.get(load_id)
        return g[i] if g is not None and i is not None else 0.0

    def grid_later(self, load_id: str, now: float) -> bool:
        i = self.index(now)
        g = self.grid_w.get(load_id)
        return bool(g) and i is not None and any(v > 0 for v in g[i + 1 :])

    def to_dict(self) -> dict[str, Any]:
        r = lambda vals: [round(v) for v in vals]
        return {
            "created": self.created,
            "slot_s": SLOT_S,
            "slots": self.slots,
            "pv_w": r(self.pv_w),
            "base_w": r(self.base_w),
            "import_w": r(self.import_w),
            "limit_w": None if self.limit_w is None else round(self.limit_w),
            "solar_w": {k: r(v) for k, v in self.solar_w.items()},
            "grid_w": {k: r(v) for k, v in self.grid_w.items()},
            "loads": self.loads,
        }


def _in_windows(s: float, windows: list[tuple[float, float]]) -> bool:
    return not windows or any(ws <= s < we for ws, we in windows)


def make_plan(
    now: float,
    pv_w: list[float],
    base_w: list[float],
    loads: list[PlanLoad],
    limit_w: float | None = None,
    spread: bool = True,
) -> Plan:
    """Plan from the quarter containing ``now``. ``pv_w`` and ``base_w`` hold one value per
    quarter; ``loads`` is in priority order. ``limit_w`` is the quarter peak limit (None: no
    limit). ``spread`` off places grid energy as early as possible at full power."""
    n = min(len(pv_w), len(base_w))
    start = slot_start(now)
    slots = [start + i * SLOT_S for i in range(n)]
    hours = [SLOT_S / 3600.0] * n
    if n:
        hours[0] = max(0.0, start + SLOT_S - now) / 3600.0  # what is left of the present quarter
    plan = Plan(created=now, slots=slots, pv_w=list(pv_w[:n]), base_w=list(base_w[:n]), limit_w=limit_w)

    remaining = {pl.id: max(0.0, pl.need_kwh) for pl in loads}
    for pl in loads:
        plan.solar_w[pl.id] = [0.0] * n
        plan.grid_w[pl.id] = [0.0] * n

    # 1. Sun pass
    for i in range(n):
        surplus = max(0.0, pv_w[i] - base_w[i])
        if hours[i] <= 0:
            continue
        for pl in loads:
            r = remaining[pl.id]
            if not pl.solar or r <= 1e-6 or slots[i] >= pl.solar_until:
                continue
            cap_w = r * 1000.0 / hours[i]
            w = 0.0
            if pl.kind == LOAD_SWITCH:
                if surplus + pl.tolerance_w >= pl.power_w:
                    w = min(pl.power_w, cap_w)
            elif pl.kind == LOAD_EV:
                avail = min(pl.power_w, surplus + pl.tolerance_w)
                if avail >= pl.min_w:
                    w = min(avail, max(cap_w, pl.min_w))
            else:
                w = min(pl.power_w, surplus, cap_w)
            if w <= 0:
                continue
            plan.solar_w[pl.id][i] = w
            surplus = max(0.0, surplus - w)
            remaining[pl.id] = max(0.0, r - w * hours[i] / 1000.0)
    solar_kwh = {pl.id: max(0.0, pl.need_kwh) - remaining[pl.id] for pl in loads}

    # The sun covers the house first and the loads only took surplus: import is house minus sun
    imp = [max(0.0, base_w[i] - pv_w[i]) for i in range(n)]
    limit = INF if limit_w is None or not spread else limit_w

    # 2. Grid pass
    for pl in loads:
        r = remaining[pl.id]
        if not pl.grid or r <= 1e-6:
            continue
        allowed = [i for i in range(n) if hours[i] > 0 and slots[i] < pl.grid_until and _in_windows(slots[i], pl.grid_windows)]
        if not allowed:
            continue
        if pl.kind == LOAD_SWITCH:
            r = _place_blocks(pl, allowed, imp, hours, plan, r, limit, spread)
        else:
            r = _water_fill(pl, allowed, imp, hours, plan, r, limit, spread)
        remaining[pl.id] = r

    plan.import_w = imp
    for pl in loads:
        g = plan.grid_w[pl.id]
        grid_idx = [i for i, v in enumerate(g) if v > 0]
        plan.loads[pl.id] = {
            "kind": pl.kind,
            "goal": pl.goal,
            "grid_planned": pl.grid,
            "need_kwh": round(max(0.0, pl.need_kwh), 2),
            "need_source": pl.need_source,
            "solar_kwh": round(solar_kwh[pl.id], 2),
            "grid_kwh": round(sum(v * hours[i] for i, v in enumerate(g)) / 1000.0, 2),
            "short_kwh": round(remaining[pl.id], 2),
            "deadline": None if pl.grid_until == INF else pl.grid_until,
            "grid_from": slots[grid_idx[0]] if grid_idx else None,
            "grid_to": slots[grid_idx[-1]] + SLOT_S if grid_idx else None,
            "over_limit": limit_w is not None and any(imp[i] > limit_w + 1 for i in grid_idx),
        }
    return plan


def _place_blocks(
    pl: PlanLoad, allowed: list[int], imp: list[float], hours: list[float], plan: Plan, r: float, limit: float, spread: bool
) -> float:
    """Whole quarters at the load's power until the need is covered."""
    if spread:
        order = sorted(allowed, key=lambda i: (imp[i] + pl.power_w > limit, round(imp[i] / 100), -i))
    else:
        order = sorted(allowed)
    for i in order:
        if r <= 1e-6:
            break
        w = max(0.0, pl.power_w - plan.solar_w[pl.id][i])
        if w <= 0:
            continue
        plan.grid_w[pl.id][i] = w
        imp[i] += w
        r = max(0.0, r - w * hours[i] / 1000.0)
    return r


def _water_fill(
    pl: PlanLoad, allowed: list[int], imp: list[float], hours: list[float], plan: Plan, r: float, limit: float, spread: bool
) -> float:
    """Continuous power (car, battery): one import level over the allowed quarters."""
    sol = plan.solar_w[pl.id]
    room = {i: max(0.0, pl.power_w - sol[i]) for i in allowed}

    def alloc(level: float) -> dict[int, float]:
        out = {}
        for i in allowed:
            g = min(room[i], max(0.0, level - imp[i]))
            if g > 0 and sol[i] + g < pl.min_w:
                g = 0.0
            out[i] = g
        return out

    def energy(a: dict[int, float]) -> float:
        return sum(g * hours[i] for i, g in a.items()) / 1000.0

    if not spread:
        a = {}
        for i in sorted(allowed):
            if r - energy(a) <= 1e-6:
                break
            a[i] = room[i] if sol[i] + room[i] >= pl.min_w else 0.0
    else:
        lo, hi = 0.0, max(imp[i] for i in allowed) + pl.power_w + 1
        if energy(alloc(hi)) <= r:
            a = alloc(hi)
        else:
            for _ in range(40):
                mid = (lo + hi) / 2
                if energy(alloc(mid)) >= r:
                    hi = mid
                else:
                    lo = mid
            a = alloc(hi)
    # Trim the surplus energy from the earliest quarters (later ones keep the chance of sun).
    extra = energy(a) - r
    for i in sorted(a):
        if extra <= 1e-6:
            break
        g = a[i]
        if g <= 0:
            continue
        e = g * hours[i] / 1000.0
        if e <= extra:
            a[i] = 0.0
            extra -= e
        else:
            keep = g - extra * 1000.0 / hours[i]
            if sol[i] + keep >= pl.min_w:
                a[i] = keep
                extra = 0.0
    for i, g in a.items():
        if g > 0:
            plan.grid_w[pl.id][i] = g
            imp[i] += g
    return max(0.0, r - energy(a))
