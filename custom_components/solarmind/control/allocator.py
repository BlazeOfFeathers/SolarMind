"""Surplus allocation: decides per load whether it runs and at what power.

Pure Python, no Home Assistant imports, so the logic is easy to test.

Model
-----
* ``grid_w`` is the net grid power (+ import, - export).
* ``managed_w`` is what all managed loads draw right now.
* ``base_w = grid_w - managed_w`` is what the house would import without the
  managed loads (negative means solar surplus).
* The surplus (``solar_pool``) is handed out in priority order. Loads that may
  use the grid (always on, night fallback, legionella, min SoC) can also use
  ``grid_headroom``: the import the capacity-tariff peak guard still allows.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any

from ..const import (
    LOAD_EV,
    MODE_OFF,
    MODE_ON,
    MODE_SOLAR_NIGHT,
    R_ALWAYS_ON,
    R_DISABLED,
    R_HOLD_MIN_OFF,
    R_HOLD_MIN_ON,
    R_IDLE,
    R_LEGIONELLA,
    R_MIN_SOC,
    R_MODE_OFF,
    R_NIGHT,
    R_NO_SURPLUS,
    R_NOT_CONNECTED,
    R_PEAK,
    R_SOLAR,
    R_TARGET_REACHED,
    R_UNAVAILABLE,
    R_WAIT_START,
    R_WAIT_STOP,
)

INF = float("inf")
FULL_DETECT_S = 120  # load must draw (almost) nothing this long before we call it full


@dataclass
class LoadState:
    """Live measurements of one load, gathered by the coordinator each cycle."""

    available: bool = True
    is_on: bool = False
    power_w: float | None = None  # measured; None = not measured
    current_a: float | None = None  # EV charging amps currently set
    soc: float | None = None
    temperature: float | None = None
    plugged: bool | None = None  # EV cable connected (None = unknown, assume yes)


@dataclass
class LoadRuntime:
    """State kept between cycles for one load."""

    last_switch_ts: float = 0.0
    pending_on: bool | None = None
    pending_since: float = 0.0
    last_current_change_ts: float = 0.0
    low_power_since: float | None = None
    is_full: bool = False
    solar_kwh_day: float = 0.0  # solar energy since the end of the last night window
    night_kwh: float = 0.0  # energy delivered in the current night window
    night_needed: bool | None = None  # decided once at the start of the night
    last_hot_ts: float = 0.0  # last time the legionella temperature was reached

    def to_dict(self) -> dict[str, Any]:
        return {
            "last_switch_ts": self.last_switch_ts,
            "solar_kwh_day": self.solar_kwh_day,
            "night_kwh": self.night_kwh,
            "night_needed": self.night_needed,
            "last_hot_ts": self.last_hot_ts,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> LoadRuntime:
        rt = cls()
        if not data:
            return rt
        rt.last_switch_ts = float(data.get("last_switch_ts", 0.0))
        rt.solar_kwh_day = float(data.get("solar_kwh_day", 0.0))
        rt.night_kwh = float(data.get("night_kwh", 0.0))
        rt.night_needed = data.get("night_needed")
        rt.last_hot_ts = float(data.get("last_hot_ts", 0.0))
        return rt


@dataclass
class SiteState:
    now: float
    grid_w: float  # + import, - export
    in_night: bool = False
    grid_budget_w: float = INF  # max average import the peak guard allows right now
    forecast_tomorrow_kwh: float | None = None
    voltage: float = 230.0


@dataclass
class Decision:
    load_id: str
    on: bool | None  # None = leave the device alone
    current_a: int | None = None
    reason: str = R_IDLE
    allocated_w: float = 0.0
    wants_grid: bool = False


@dataclass
class AllocationResult:
    decisions: list[Decision] = field(default_factory=list)
    base_w: float = 0.0
    surplus_w: float = 0.0
    grid_headroom_w: float = INF
    solar_left_w: float = 0.0


def actual_power(cfg: dict[str, Any], st: LoadState, voltage: float) -> float:
    """Best estimate of what the load draws now."""
    if not st.is_on:
        return 0.0
    if st.power_w is not None:
        return max(0.0, st.power_w)
    if cfg["type"] == LOAD_EV:
        amps = st.current_a if st.current_a is not None else cfg["ev_min_current"]
        return amps * voltage * cfg["ev_phases"]
    return float(cfg["nominal_power_w"])


def ev_watts_per_amp(cfg: dict[str, Any], voltage: float) -> float:
    return voltage * max(1, int(cfg.get("ev_phases", 1)))


def _update_full(cfg: dict[str, Any], st: LoadState, rt: LoadRuntime, now: float) -> None:
    """A load that is on but draws ~nothing is full (thermostat cut / car at limit)."""
    if not st.is_on or st.power_w is None:
        rt.low_power_since = None
        rt.is_full = False
        return
    if st.power_w < cfg.get("full_threshold_w", 50):
        if rt.low_power_since is None:
            rt.low_power_since = now
        rt.is_full = now - rt.low_power_since >= FULL_DETECT_S
    else:
        rt.low_power_since = None
        rt.is_full = False


def _grid_need(cfg: dict[str, Any], st: LoadState, rt: LoadRuntime, site: SiteState) -> str | None:
    """Return a reason when this load should run regardless of solar, else None."""
    mode = cfg["mode"]
    if mode == MODE_ON:
        return R_ALWAYS_ON
    is_ev = cfg["type"] == LOAD_EV
    if is_ev and cfg.get("ev_min_soc") is not None and st.soc is not None and st.soc < cfg["ev_min_soc"]:
        return R_MIN_SOC
    if (
        not is_ev
        and cfg.get("legionella_enabled")
        and site.in_night
        and st.temperature is not None
        and site.now - rt.last_hot_ts >= cfg.get("legionella_interval_days", 7) * 86400
    ):
        return R_LEGIONELLA
    if mode == MODE_SOLAR_NIGHT and site.in_night and rt.night_needed:
        if is_ev:
            if st.soc is not None:
                if st.soc < cfg.get("ev_target_soc", 80):
                    return R_NIGHT
                return None
        target = cfg.get("night_target_kwh") or 0
        if target and rt.night_kwh >= target:
            return None
        if rt.is_full:
            return None
        return R_NIGHT
    return None


def evaluate_night_need(cfg: dict[str, Any], st: LoadState, rt: LoadRuntime, site: SiteState) -> bool:
    """Decide at the start of the night window whether the night fallback is needed."""
    skip = cfg.get("night_skip_forecast_kwh")
    if skip and site.forecast_tomorrow_kwh is not None and site.forecast_tomorrow_kwh >= skip:
        return False
    if cfg["type"] == LOAD_EV:
        if st.soc is not None:
            return st.soc < cfg.get("ev_target_soc", 80)
        return rt.solar_kwh_day < (cfg.get("night_min_solar_kwh") or 0)
    min_temp = cfg.get("night_min_temperature")
    if min_temp is not None and st.temperature is not None:
        return st.temperature < min_temp
    return rt.solar_kwh_day < (cfg.get("night_min_solar_kwh") or 0)


def allocate(
    site: SiteState,
    loads: list[dict[str, Any]],
    states: dict[str, LoadState],
    runtimes: dict[str, LoadRuntime],
) -> AllocationResult:
    """Run one allocation cycle. ``loads`` must be sorted by priority (first = highest)."""
    v = site.voltage
    managed = 0.0
    for cfg in loads:
        st = states.get(cfg["id"])
        if st and st.available and cfg.get("enabled", True):
            managed += actual_power(cfg, st, v)
    base = site.grid_w - managed
    solar_pool = max(0.0, -base)
    headroom = site.grid_budget_w - max(0.0, base) if site.grid_budget_w != INF else INF
    headroom = max(0.0, headroom)
    result = AllocationResult(base_w=base, surplus_w=solar_pool)

    for cfg in loads:
        lid = cfg["id"]
        st = states.get(lid) or LoadState(available=False)
        rt = runtimes.setdefault(lid, LoadRuntime())

        if not cfg.get("enabled", True):
            result.decisions.append(Decision(lid, None, reason=R_DISABLED))
            continue
        if not st.available:
            result.decisions.append(Decision(lid, None, reason=R_UNAVAILABLE))
            continue

        _update_full(cfg, st, rt, site.now)
        if (
            st.temperature is not None
            and cfg.get("legionella_enabled")
            and st.temperature >= cfg.get("legionella_temperature", 60)
        ):
            rt.last_hot_ts = site.now

        dec = _decide_load(cfg, st, rt, site, solar_pool, headroom)
        # Take what the load will draw from the pools: solar first, then grid.
        used = dec.allocated_w
        from_solar = min(used, solar_pool)
        solar_pool -= from_solar
        if headroom != INF:
            headroom = max(0.0, headroom - (used - from_solar))
        result.decisions.append(dec)

    result.solar_left_w = solar_pool
    result.grid_headroom_w = headroom
    return result


def _decide_load(
    cfg: dict[str, Any],
    st: LoadState,
    rt: LoadRuntime,
    site: SiteState,
    solar_pool: float,
    headroom: float,
) -> Decision:
    lid = cfg["id"]
    is_ev = cfg["type"] == LOAD_EV
    now = site.now
    cur_power = actual_power(cfg, st, site.voltage)

    if cfg["mode"] == MODE_OFF:
        rt.pending_on = None
        return Decision(lid, False, reason=R_MODE_OFF)

    if is_ev and st.plugged is False:
        rt.pending_on = None
        return Decision(lid, False if st.is_on else None, reason=R_NOT_CONNECTED)

    # Boiler at its max temperature: stop (unless legionella needs more).
    max_t = cfg.get("max_temperature")
    grid_reason = _grid_need(cfg, st, rt, site)
    if (
        not is_ev
        and max_t is not None
        and st.temperature is not None
        and st.temperature >= max_t
        and grid_reason != R_LEGIONELLA
    ):
        return _with_timing(cfg, st, rt, now, Decision(lid, False, reason=R_TARGET_REACHED), force=True)

    if grid_reason is not None:
        return _decide_grid(cfg, st, rt, site, solar_pool, headroom, grid_reason, cur_power)
    return _decide_solar(cfg, st, rt, site, solar_pool, headroom, cur_power)


def _decide_grid(
    cfg: dict[str, Any],
    st: LoadState,
    rt: LoadRuntime,
    site: SiteState,
    solar_pool: float,
    headroom: float,
    reason: str,
    cur_power: float,
) -> Decision:
    lid = cfg["id"]
    avail = solar_pool + headroom
    if cfg["type"] == LOAD_EV:
        wpa = ev_watts_per_amp(cfg, site.voltage)
        amps = cfg["ev_max_current"] if avail == INF else min(cfg["ev_max_current"], math.floor(avail / wpa))
        if amps < cfg["ev_min_current"]:
            if not cfg.get("peak_shed", True):
                amps = cfg["ev_min_current"]
            else:
                rt.pending_on = None
                return _with_timing(cfg, st, rt, site.now, Decision(lid, False, reason=R_PEAK), force=True)
        dec = Decision(lid, True, current_a=int(amps), reason=reason, allocated_w=amps * wpa, wants_grid=True)
        return _with_timing(cfg, st, rt, site.now, _rate_limit_current(cfg, st, rt, site.now, dec), grid=True)

    need = cur_power if (st.is_on and st.power_w is not None) else float(cfg["nominal_power_w"])
    if rt.is_full:
        need = cur_power
    if need > avail and cfg.get("peak_shed", True):
        return _with_timing(cfg, st, rt, site.now, Decision(lid, False, reason=R_PEAK), force=True)
    dec = Decision(lid, True, reason=R_TARGET_REACHED if rt.is_full else reason, allocated_w=need, wants_grid=True)
    return _with_timing(cfg, st, rt, site.now, dec, grid=True)


def _decide_solar(
    cfg: dict[str, Any],
    st: LoadState,
    rt: LoadRuntime,
    site: SiteState,
    solar_pool: float,
    headroom: float,
    cur_power: float,
) -> Decision:
    lid = cfg["id"]
    tolerance = min(float(cfg.get("allowed_import_w", 0)), headroom)
    margin = float(cfg.get("start_margin_w", 0))

    if cfg["type"] == LOAD_EV:
        wpa = ev_watts_per_amp(cfg, site.voltage)
        if st.is_on:
            budget = solar_pool + tolerance
        else:
            budget = solar_pool - margin
        amps = min(cfg["ev_max_current"], math.floor(budget / wpa))
        if amps < cfg["ev_min_current"]:
            over_budget = headroom != INF and cur_power - solar_pool > headroom
            reason = R_PEAK if over_budget else R_NO_SURPLUS
            dec = Decision(lid, False, reason=reason)
            return _with_timing(cfg, st, rt, site.now, dec, force=over_budget)
        dec = Decision(lid, True, current_a=int(amps), reason=R_SOLAR, allocated_w=amps * wpa)
        return _with_timing(cfg, st, rt, site.now, _rate_limit_current(cfg, st, rt, site.now, dec))

    nominal = float(cfg["nominal_power_w"])
    if st.is_on:
        need = cur_power
        if rt.is_full:
            # Thermostat cut: stays on (so it can reheat on solar) but reserves nothing.
            return _with_timing(cfg, st, rt, site.now, Decision(lid, True, reason=R_TARGET_REACHED))
        if solar_pool + tolerance >= need:
            return _with_timing(cfg, st, rt, site.now, Decision(lid, True, reason=R_SOLAR, allocated_w=need))
        over_budget = headroom != INF and need - solar_pool > headroom
        dec = Decision(lid, False, reason=R_PEAK if over_budget else R_NO_SURPLUS)
        return _with_timing(cfg, st, rt, site.now, dec, force=over_budget)
    if solar_pool >= nominal + margin:
        return _with_timing(cfg, st, rt, site.now, Decision(lid, True, reason=R_SOLAR, allocated_w=nominal))
    return _with_timing(cfg, st, rt, site.now, Decision(lid, False, reason=R_NO_SURPLUS))


def _rate_limit_current(cfg: dict[str, Any], st: LoadState, rt: LoadRuntime, now: float, dec: Decision) -> Decision:
    """Avoid hammering the car: raise amps at most every N seconds, lower them right away."""
    if not st.is_on or st.current_a is None or dec.current_a is None:
        return dec
    cur = int(round(st.current_a))
    if dec.current_a >= cur and now - rt.last_current_change_ts < cfg.get("ev_current_step_interval_s", 30):
        wpa = dec.allocated_w / dec.current_a if dec.current_a else 0.0
        dec.current_a = cur
        dec.allocated_w = cur * wpa
    return dec


def _with_timing(
    cfg: dict[str, Any],
    st: LoadState,
    rt: LoadRuntime,
    now: float,
    dec: Decision,
    force: bool = False,
    grid: bool = False,
) -> Decision:
    """Apply start/stop delays and minimum on/off times.

    ``force`` skips all delays (peak guard, target reached). ``grid`` skips the
    start delay (no need to wait for a stable surplus) but keeps min off time.
    When a transition is held back, the decision keeps the current state and
    reserves the power the load actually draws.
    """
    want = dec.on
    if want is None or want == st.is_on:
        rt.pending_on = None
        return dec
    if force:
        rt.pending_on = None
        return dec

    since_switch = now - rt.last_switch_ts
    if want:
        if since_switch < cfg.get("min_off_s", 0):
            return _hold(cfg, st, dec, R_HOLD_MIN_OFF)
        delay = 0 if grid else cfg.get("start_delay_s", 0)
        wait_reason = R_WAIT_START
    else:
        if since_switch < cfg.get("min_on_s", 0):
            return _hold(cfg, st, dec, R_HOLD_MIN_ON)
        delay = cfg.get("stop_delay_s", 0)
        wait_reason = R_WAIT_STOP

    if rt.pending_on != want:
        rt.pending_on = want
        rt.pending_since = now
    if now - rt.pending_since < delay:
        return _hold(cfg, st, dec, wait_reason)
    rt.pending_on = None
    return dec


def _hold(cfg: dict[str, Any], st: LoadState, dec: Decision, reason: str) -> Decision:
    """Keep the current state; a running load keeps reserving what it draws."""
    held = Decision(dec.load_id, st.is_on, reason=reason, wants_grid=dec.wants_grid)
    if st.is_on:
        held.current_a = int(round(st.current_a)) if st.current_a is not None else None
        if st.power_w is not None:
            held.allocated_w = max(0.0, st.power_w)
        elif cfg["type"] == LOAD_EV:
            held.allocated_w = (held.current_a or cfg["ev_min_current"]) * 230.0 * cfg.get("ev_phases", 1)
        else:
            held.allocated_w = float(cfg.get("nominal_power_w", 0))
    return held
