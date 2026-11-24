"""Glue between Home Assistant and the planner: gather predictions, build the plan, steer.

The coordinator calls :meth:`PlanningEngine.update` every cycle. The plan is rebuilt once a
minute (and right away after a setting changed); in between the same plan steers.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant

from .const import (
    LOAD_BATTERY,
    LOAD_EV,
    LOAD_SWITCH,
    MODE_SELF,
    MODE_SOLAR,
    MODE_SOLAR_NIGHT,
    R_NO_SURPLUS,
    R_PLAN_WAIT,
)
from .control.allocator import Decision, LoadRuntime, LoadState
from .control.planner import INF, Plan, PlanLoad, make_plan
from .control.predict import (
    DEFAULT_BASE_W,
    SLOT_S,
    BoilerLearner,
    base_profile,
    boiler_day_need,
    boiler_need_from_temperature,
    periods_from_attributes,
    pv_shape,
    resample,
    sine_shape,
    slot_start,
    spread_day,
)
from .drivers import read_float

_LOGGER = logging.getLogger(__name__)

REBUILD_S = 60
PROFILE_S = 3600


def _hhmm(value: str) -> tuple[int, int]:
    try:
        h, m = str(value).split(":")[:2]
        return int(h) % 24, int(m) % 60
    except (ValueError, AttributeError):
        return 0, 0


def night_windows(local: datetime, start: str, end: str, hours: float) -> list[tuple[float, float]]:
    """Night windows (start_ts, end_ts) overlapping now .. now + hours, the running one included."""
    sh, sm = _hhmm(start)
    eh, em = _hhmm(end)
    out = []
    day0 = local.replace(hour=0, minute=0, second=0, microsecond=0)
    limit = local.timestamp() + hours * 3600
    for d in range(-1, int(hours // 24) + 2):
        day = day0 + timedelta(days=d)
        s = day.replace(hour=sh, minute=sm)
        e = day.replace(hour=eh, minute=em)
        if e <= s:
            e += timedelta(days=1)
        if s == e:
            continue
        if e.timestamp() > local.timestamp() and s.timestamp() < limit:
            out.append((s.timestamp(), e.timestamp()))
    return out


def next_departure(local: datetime, cfg: dict[str, Any], hours: float) -> float | None:
    h, m = _hhmm(cfg.get("ev_departure_time") or "07:00")
    days = cfg.get("ev_departure_days")
    days = list(range(7)) if days is None else [int(d) for d in days]
    for d in range(int(hours // 24) + 2):
        cand = (local + timedelta(days=d)).replace(hour=h, minute=m, second=0, microsecond=0)
        if cand <= local or cand.weekday() not in days:
            continue
        if cand.timestamp() - local.timestamp() > hours * 3600:
            return None
        return cand.timestamp()
    return None


class PlanningEngine:
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.plan: Plan | None = None
        self.learners: dict[str, BoilerLearner] = {}
        self._built_ts = 0.0
        self._profile_ts = 0.0
        self._base: list[float] | None = None
        self._shape: list[float] | None = None
        self.dirty = True  # rebuild on the next cycle
        self.info: dict[str, Any] = {}

    # -------------------------------------------------------------- persist

    def to_dict(self) -> dict[str, Any]:
        return {lid: lr.to_dict() for lid, lr in self.learners.items()}

    def load(self, data: dict[str, Any] | None) -> None:
        self.learners = {lid: BoilerLearner.from_dict(d) for lid, d in (data or {}).items()}

    # -------------------------------------------------------------- learning

    def learn(
        self, loads: list[dict[str, Any]], runtimes: dict[str, LoadRuntime], powers: dict[str, float], dt_s: float, day_ended: bool
    ) -> None:
        """Track per boiler the energy it takes per day (until it gets full)."""
        for cfg in loads:
            if cfg["type"] != LOAD_SWITCH:
                continue
            lr = self.learners.setdefault(cfg["id"], BoilerLearner())
            if day_ended:
                lr.new_day()
            if dt_s > 0:
                lr.add(max(0.0, powers.get(cfg["id"], 0.0)) * dt_s / 3.6e6)
            rt = runtimes.get(cfg["id"])
            if rt is not None and rt.is_full:
                lr.got_full()
        for lid in [k for k in self.learners if not any(c["id"] == k for c in loads)]:
            del self.learners[lid]

    # ------------------------------------------------------------ predicting

    def _profiles(self, now: float, history: Any, tz: Any) -> None:
        if now - self._profile_ts < PROFILE_S and self._profile_ts:
            return
        self._profile_ts = now
        try:
            self._base = base_profile(history.samples, tz)
            self._shape = pv_shape(history.samples, tz)
        except Exception:
            _LOGGER.exception("SolarMind: building the planner profiles failed")
            self._base = self._shape = None

    def _pv_series(self, settings: dict[str, Any], local: datetime, slots: list[float], produced_today: float | None) -> tuple[list[float], str]:
        estimate = settings.get("plan_pv_estimate") or "pv_estimate"
        periods: list[tuple[float, float, float]] = []
        for key in ("pv_forecast_today_entity", "pv_forecast_tomorrow_entity"):
            ent = settings.get(key)
            st = self.hass.states.get(ent) if ent else None
            if st is not None:
                periods += periods_from_attributes(dict(st.attributes), estimate)
        source = "detailed" if periods else "none"
        series = resample(periods, slots) if periods else [None] * len(slots)
        if any(v is None for v in series):
            # Spread the day totals in the shape of the recorded production (or a sine).
            shape = self._shape or sine_shape()
            day0 = local.replace(hour=0, minute=0, second=0, microsecond=0)
            fallback: list[tuple[float, float, float]] = []
            today = read_float(self.hass, settings.get("pv_forecast_today_entity"))
            remaining = read_float(self.hass, settings.get("pv_forecast_remaining_entity"))
            if remaining is None and today is not None and produced_today is not None:
                remaining = max(0.0, today - produced_today)
            if remaining is not None:
                # Only the rest of today, scaled to what is still expected.
                q_now = (local.hour * 60 + local.minute) // 15
                rest = [s if q >= q_now else 0.0 for q, s in enumerate(shape)]
                total = sum(rest)
                if total > 0:
                    fallback += spread_day(remaining, day0, [v / total for v in rest])
            elif today is not None:
                fallback += spread_day(today, day0, shape)
            tomorrow = read_float(self.hass, settings.get("pv_forecast_tomorrow_entity"))
            if tomorrow is not None:
                fallback += spread_day(tomorrow, day0 + timedelta(days=1), shape)
            if fallback:
                source = "detailed+day" if source == "detailed" else "day"
                filled = resample(fallback, slots)
                series = [v if v is not None else (f if f is not None else None) for v, f in zip(series, filled, strict=True)]
        factor = max(0.0, float(settings.get("forecast_factor_pct", 80))) / 100
        return [max(0.0, (v or 0.0) * factor) for v in series], source

    def _base_series(self, settings: dict[str, Any], slots: list[float], tz: Any) -> tuple[list[float], str]:
        if settings.get("plan_learn_base", True) and self._base:
            return [self._base[datetime.fromtimestamp(s, tz=tz).hour] for s in slots], "learned"
        fixed = float(settings.get("plan_base_w") or DEFAULT_BASE_W)
        return [fixed] * len(slots), "fixed"

    # --------------------------------------------------------------- loads

    def _plan_loads(
        self,
        settings: dict[str, Any],
        local: datetime,
        order: list[dict[str, Any]],
        states: dict[str, LoadState],
        runtimes: dict[str, LoadRuntime],
        ev_capacity: dict[str, float | None],
        forecast_tomorrow: float | None,
        horizon_h: float,
        windows: list[tuple[float, float]],
        voltage: float,
    ) -> list[PlanLoad]:
        now = local.timestamp()
        night_end = next((e for _, e in windows), INF)
        # the first night start after that night end (tomorrow evening): sun counts for the battery until then
        evening = next((s for s, _ in windows if s >= night_end), INF)
        tonight = next((s for s, _ in windows), INF)
        out: list[PlanLoad] = []
        for cfg in order:
            st = states.get(cfg["id"])
            if not cfg.get("enabled", True) or st is None or not st.available:
                continue
            mode = cfg.get("mode")
            if mode not in (MODE_SOLAR, MODE_SOLAR_NIGHT, MODE_SELF):
                continue
            rt = runtimes.get(cfg["id"]) or LoadRuntime()
            kind = cfg["type"]
            if kind == LOAD_SWITCH:
                need_t = boiler_need_from_temperature(cfg, st.temperature) if cfg.get("temperature_entity") else None
                lr = self.learners.get(cfg["id"])
                if need_t is not None:
                    need, source = need_t, "temperature"
                else:
                    day_need, source = boiler_day_need(cfg, lr)
                    got = lr.day_kwh if lr else rt.solar_kwh_day + rt.night_kwh
                    need = 0.0 if (lr and lr.full_today) else max(0.0, day_need - got)
                if rt.is_full:
                    need = 0.0
                skip = cfg.get("night_skip_forecast_kwh")
                grid = bool(settings.get("plan_boiler_night", True)) and mode == MODE_SOLAR_NIGHT
                if grid and skip and forecast_tomorrow is not None and forecast_tomorrow >= skip:
                    grid = False
                out.append(PlanLoad(
                    id=cfg["id"], kind=kind, power_w=float(cfg.get("nominal_power_w") or 0), need_kwh=need,
                    solar_until=night_end, grid=grid, grid_until=night_end, grid_windows=windows,
                    tolerance_w=float(cfg.get("allowed_import_w") or 0), goal="night", need_source=source,
                ))
            elif kind == LOAD_EV:
                cap = ev_capacity.get(cfg["id"])
                if st.plugged is False or st.soc is None or not cap:
                    continue
                wpa = voltage * max(1, int(cfg.get("ev_phases", 1)))
                pl = PlanLoad(
                    id=cfg["id"], kind=kind, power_w=cfg["ev_max_current"] * wpa, min_w=cfg["ev_min_current"] * wpa,
                    tolerance_w=float(cfg.get("allowed_import_w") or 0), need_source="soc",
                )
                dep = next_departure(local, cfg, horizon_h) if cfg.get("ev_departure_enabled") else None
                plan_ev = bool(settings.get("plan_ev", True))
                if dep is not None and plan_ev:
                    target = float(cfg.get("ev_departure_soc") or 0)
                    pl.goal, pl.solar_until, pl.grid, pl.grid_until = "departure", dep, True, dep
                else:
                    target = float(cfg.get("ev_target_soc", 80))
                    if st.charge_limit is not None:
                        target = min(target, st.charge_limit)
                    pl.goal, pl.solar_until = "night", night_end
                    if mode == MODE_SOLAR_NIGHT and plan_ev:
                        pl.grid, pl.grid_until, pl.grid_windows = True, night_end, windows
                pl.need_kwh = max(0.0, (target - st.soc) / 100 * cap)
                out.append(pl)
            elif kind == LOAD_BATTERY:
                cap = float(cfg.get("bat_capacity_kwh") or 0)
                if st.soc is None or not cap:
                    continue
                grid = bool(settings.get("plan_battery_night", True)) and mode == MODE_SOLAR_NIGHT
                target = float(cfg.get("bat_target_soc", 80) if grid else cfg.get("bat_max_soc", 100))
                need = max(0.0, (target - st.soc) / 100 * cap)
                out.append(PlanLoad(
                    id=cfg["id"], kind=kind, power_w=float(cfg.get("bat_max_charge_w") or 0), need_kwh=need,
                    solar_until=evening if grid else night_end, grid=grid, grid_until=night_end, grid_windows=windows,
                    goal="battery", need_source="soc",
                ))
                if grid and tonight > now:
                    # Before the night the battery still covers the evening: that comes on top.
                    out[-1].need_kwh = min(
                        cap * max(0.0, target - float(cfg.get("bat_min_soc", 10))) / 100, need + self._evening_kwh(cfg, st, now, tonight)
                    )
        return out

    def _evening_kwh(self, cfg: dict[str, Any], st: LoadState, now: float, until: float) -> float:
        """What the battery is expected to deliver to the house until the night starts."""
        if self.plan is None or cfg.get("mode") == MODE_SOLAR:
            return 0.0
        total = 0.0
        for s, pv, base in zip(self.plan.slots, self.plan.pv_w, self.plan.base_w, strict=False):
            if s + SLOT_S <= now or s >= until:
                continue
            total += min(float(cfg.get("bat_max_discharge_w") or 0), max(0.0, base - pv)) * SLOT_S / 3.6e6
        cap = float(cfg.get("bat_capacity_kwh") or 0)
        usable = max(0.0, (st.soc or 0) - float(cfg.get("bat_min_soc", 10))) / 100 * cap
        return min(total, usable)

    # ------------------------------------------------------------------ run

    def update(
        self,
        now: float,
        local: datetime,
        settings: dict[str, Any],
        order: list[dict[str, Any]],
        states: dict[str, LoadState],
        runtimes: dict[str, LoadRuntime],
        ev_capacity: dict[str, float | None],
        forecast_tomorrow: float | None,
        produced_today: float | None,
        limit_w: float | None,
        history: Any,
        voltage: float,
    ) -> Plan | None:
        if not settings.get("plan_enabled"):
            self.plan = None
            self.info = {}
            return None
        if not self.dirty and self.plan is not None and now - self._built_ts < REBUILD_S and self.plan.index(now) == 0:
            return self.plan
        self.dirty = False
        self._built_ts = now
        tz = local.tzinfo
        self._profiles(now, history, tz)
        horizon_h = max(6.0, min(48.0, float(settings.get("plan_horizon_h") or 36)))
        n = int(horizon_h * 3600 // SLOT_S)
        start = slot_start(now)
        slots = [start + i * SLOT_S for i in range(n)]
        pv, pv_source = self._pv_series(settings, local, slots, produced_today)
        base, base_source = self._base_series(settings, slots, tz)
        windows = night_windows(local, settings.get("night_start", "22:00"), settings.get("night_end", "07:00"), horizon_h)
        loads = self._plan_loads(settings, local, order, states, runtimes, ev_capacity, forecast_tomorrow, horizon_h, windows, voltage)
        spread = bool(settings.get("plan_peak_spread", True))
        self.plan = make_plan(now, pv, base, loads, limit_w=limit_w if spread else None, spread=spread)
        self.info = {
            "pv_source": pv_source,
            "base_source": base_source,
            "nights": windows,
            "learned": {lid: lr.to_dict() for lid, lr in self.learners.items()},
        }
        return self.plan

    def controls(self, settings: dict[str, Any], now: float) -> dict[str, float]:
        """Planned grid power now for every load whose grid use the plan decides."""
        if self.plan is None:
            return {}
        out = {}
        for lid, meta in self.plan.loads.items():
            if lid in self.plan.grid_w and self._steers(settings, meta):
                out[lid] = self.plan.grid_now(lid, now)
        return out

    @staticmethod
    def _steers(settings: dict[str, Any], meta: dict[str, Any]) -> bool:
        key = {LOAD_SWITCH: "plan_boiler_night", LOAD_EV: "plan_ev", LOAD_BATTERY: "plan_battery_night"}.get(meta.get("kind"))
        return bool(key and settings.get(key, True) and meta.get("grid_planned"))

    def label(self, dec: Decision, now: float) -> None:
        """An idle load that has grid energy planned later says so."""
        if self.plan is not None and dec.reason == R_NO_SURPLUS and self.plan.grid_later(dec.load_id, now):
            dec.reason = R_PLAN_WAIT
