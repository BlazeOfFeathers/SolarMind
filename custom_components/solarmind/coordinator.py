"""SolarMind coordinator: the control loop."""

from __future__ import annotations

import logging
import time
from collections import deque
from datetime import datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    GRID_SIGN_EXPORT_POSITIVE,
    HISTORY_STORAGE_KEY,
    LOAD_BATTERY,
    LOAD_EV,
    STORAGE_VERSION,
    UPDATE_INTERVAL,
)
from .control.allocator import (
    INF,
    Decision,
    LoadRuntime,
    LoadState,
    SiteState,
    actual_power,
    allocate,
    evaluate_night_need,
)
from .control.eta import MIN_CHARGING_W, CapacityLearner, PowerAverager, capacity_from_car_estimate, time_to_soc_s
from .control.forecast import ForecastPlan, apply_order, make_plan, remaining_today
from .control.peak import PeakTracker, month_key_of
from .drivers import BaseDriver, make_driver, read_float
from .history import HistoryData, LoadSample
from .notifier import NotificationTracker, async_send, notify_targets
from .planning import PlanningEngine
from .store import SolarMindStore

_LOGGER = logging.getLogger(__name__)

HISTORY_SAVE_DELAY = 300


BASE_AVG_S = 90  # window of the averaged house load used to ride out clouds

def battery_live(cfg: dict[str, Any], st: LoadState, dec: Decision) -> dict[str, Any]:
    """Setpoint and time to full / to the reserve at the present power."""
    cap = float(cfg.get("bat_capacity_kwh") or 0)
    p = st.power_w or 0.0
    out: dict[str, Any] = {
        "setpoint_w": None if dec.setpoint_w is None else round(dec.setpoint_w),
        "capacity_kwh": cap or None,
        "stored_kwh": round(cap * st.soc / 100, 2) if cap and st.soc is not None else None,
        "eta_full_s": None,
        "eta_empty_s": None,
    }
    if not cap or st.soc is None:
        return out
    if p > MIN_CHARGING_W:
        top = float(cfg.get("bat_max_soc", 100))
        out["eta_full_s"] = round(max(0.0, top - st.soc) / 100 * cap * 3.6e6 / p) if st.soc < top else None
    elif p < -MIN_CHARGING_W:
        floor = float(cfg.get("bat_min_soc", 10))
        out["eta_empty_s"] = round(max(0.0, st.soc - floor) / 100 * cap * 3.6e6 / -p) if st.soc > floor else None
    return out


def parse_hhmm(value: str) -> tuple[int, int]:
    try:
        h, m = str(value).split(":")[:2]
        return int(h) % 24, int(m) % 60
    except (ValueError, AttributeError):
        return 0, 0


def in_window(local: datetime, start: str, end: str) -> bool:
    sh, sm = parse_hhmm(start)
    eh, em = parse_hhmm(end)
    cur = local.hour * 60 + local.minute
    s = sh * 60 + sm
    e = eh * 60 + em
    if s == e:
        return False
    if s < e:
        return s <= cur < e
    return cur >= s or cur < e


class SolarMindCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, store: SolarMindStore) -> None:
        super().__init__(hass, _LOGGER, name=DOMAIN, update_interval=timedelta(seconds=UPDATE_INTERVAL))
        self.entry = entry
        self.store = store
        self._history_store: Store[dict] = Store(hass, STORAGE_VERSION, HISTORY_STORAGE_KEY)
        self.history = HistoryData()
        self.drivers: dict[str, BaseDriver] = {}
        self.runtimes: dict[str, LoadRuntime] = {}
        self.peak = PeakTracker()
        self._last_ts: float | None = None
        self._was_night: bool | None = None
        self.plan = ForecastPlan()
        self._last_prune_day = ""
        self.live: dict[str, Any] = {"site": {}, "loads": {}}
        self._listeners_ws: set[Any] = set()
        self._base_hist: deque[tuple[float, float]] = deque()  # (ts, house base W) for cloud bridging
        self.notifier = NotificationTracker(lang="nl" if str(hass.config.language).startswith("nl") else "en")
        self._ev_power: dict[str, PowerAverager] = {}
        self._ev_capacity: dict[str, CapacityLearner] = {}
        self.planning = PlanningEngine(hass)

    async def async_setup(self) -> None:
        self.history = HistoryData(await self._history_store.async_load())
        rt = self.store.runtime
        self.peak = PeakTracker.from_dict(rt.get("peak"))
        for lid, data in rt.get("loads", {}).items():
            self.runtimes[lid] = LoadRuntime.from_dict(data)
        self._was_night = rt.get("was_night")
        for lid, data in rt.get("ev_capacity", {}).items():
            self._ev_capacity[lid] = CapacityLearner.from_dict(data)
        self.planning.load(rt.get("planning"))
        self.rebuild_drivers()

    def rebuild_drivers(self) -> None:
        old = self.drivers
        self.drivers = {cfg["id"]: make_driver(self.hass, cfg) for cfg in self.store.loads}
        for lid, drv in old.items():
            if lid not in self.drivers:
                # A removed battery must not stay in remote control.
                self.hass.async_create_task(drv.async_close())
        for lid in list(self.runtimes):
            if self.store.get_load(lid) is None:
                del self.runtimes[lid]

    async def async_shutdown_save(self) -> None:
        for drv in self.drivers.values():
            await drv.async_close()
        self._persist_runtime()
        await self.store.async_save()
        await self._history_store.async_save(self.history.to_dict())

    async def async_request_refresh(self) -> None:
        """Settings, loads or modes changed: plan again on the next cycle."""
        self.planning.dirty = True
        await super().async_request_refresh()

    def remove_load_history(self, load_id: str) -> None:
        self.history.remove_load(load_id)
        self._history_store.async_delay_save(self.history.to_dict, 5)

    # ------------------------------------------------------------- measuring

    def _read_grid(self) -> float | None:
        s = self.store.settings
        if s.get("grid_mode") == "split":
            imp = read_float(self.hass, s.get("grid_import_entity"), to_watts=True)
            exp = read_float(self.hass, s.get("grid_export_entity"), to_watts=True)
            if imp is None and exp is None:
                return None
            return (imp or 0.0) - (exp or 0.0)
        value = read_float(self.hass, s.get("grid_power_entity"), to_watts=True)
        if value is None:
            return None
        if s.get("grid_sign") == GRID_SIGN_EXPORT_POSITIVE:
            value = -value
        return value

    # ------------------------------------------------------------ the loop

    async def _async_update_data(self) -> dict[str, Any]:
        settings = self.store.settings
        now = time.time()
        local = dt_util.now()
        dt_s = 0.0 if self._last_ts is None else now - self._last_ts
        self._last_ts = now

        grid = self._read_grid()
        pv = read_float(self.hass, settings.get("pv_power_entity"), to_watts=True)
        forecast_tomorrow = read_float(self.hass, settings.get("pv_forecast_tomorrow_entity"))
        voltage = float(settings.get("voltage", 230))

        loads = [cfg for cfg in self.store.loads]
        for cfg in loads:
            if cfg["id"] not in self.drivers or self.drivers[cfg["id"]].cfg is not cfg:
                self.drivers[cfg["id"]] = make_driver(self.hass, cfg)
        states: dict[str, LoadState] = {}
        for cfg in loads:
            try:
                states[cfg["id"]] = await self.drivers[cfg["id"]].async_read()
            except Exception:
                _LOGGER.exception("Reading load %s failed", cfg.get("name"))
                states[cfg["id"]] = LoadState(available=False)

        # Night window transitions
        is_night = in_window(local, settings.get("night_start", "22:00"), settings.get("night_end", "07:00"))
        site = SiteState(
            now=now,
            grid_w=grid if grid is not None else 0.0,
            in_night=is_night,
            forecast_tomorrow_kwh=forecast_tomorrow,
            voltage=voltage,
        )
        day_ended = not is_night and self._was_night is True
        if is_night and self._was_night is not True:
            for cfg in loads:
                rt = self.runtimes.setdefault(cfg["id"], LoadRuntime())
                rt.night_kwh = 0.0
                rt.night_needed = evaluate_night_need(cfg, states[cfg["id"]], rt, site)
        elif day_ended:
            for cfg in loads:
                rt = self.runtimes.setdefault(cfg["id"], LoadRuntime())
                rt.solar_kwh_day = 0.0
                rt.night_needed = None
        elif self._was_night is None and is_night:
            for cfg in loads:
                rt = self.runtimes.setdefault(cfg["id"], LoadRuntime())
                if rt.night_needed is None:
                    rt.night_needed = evaluate_night_need(cfg, states[cfg["id"]], rt, site)
        self._was_night = is_night

        # Capacity tariff peak guard
        import_w = max(0.0, grid or 0.0)
        if self.peak.last_ts is None:
            self.peak.resume(now, import_w)
        self.peak.update(now, import_w, month_key_of(local))
        if settings.get("peak_guard_enabled", True) and grid is not None:
            site.grid_budget_w = self.peak.budget_w(now, settings)
        finished = self.peak.pop_finished()
        if finished:
            self.history.add_quarters(finished, lambda ts: dt_util.as_local(dt_util.utc_from_timestamp(ts)))

        if grid is None:
            # Without a grid measurement we cannot judge surplus: keep everything as it is.
            result_decisions = [Decision(cfg["id"], None, reason="unavailable") for cfg in loads]
            base_w = surplus_w = 0.0
            headroom = INF
        else:
            while self._base_hist and now - self._base_hist[0][0] > BASE_AVG_S:
                self._base_hist.popleft()
            if self._base_hist:
                site.base_avg_w = sum(b for _, b in self._base_hist) / len(self._base_hist)
            house_today = self.history.days.get(local.strftime("%Y-%m-%d"), {}).get("house", {})
            remaining = remaining_today(
                read_float(self.hass, settings.get("pv_forecast_remaining_entity")),
                read_float(self.hass, settings.get("pv_forecast_today_entity")),
                house_today.get("pv_kwh") if settings.get("pv_power_entity") else None,
            )
            self.plan = make_plan(settings, loads, states, self.runtimes, remaining, is_night, self.plan)
            site.ev_floor_paused = self.plan.ev_floor_paused
            order = apply_order(loads, self.plan)
            self._update_planning(now, local, settings, order, states, forecast_tomorrow, house_today, voltage)
            site.plan_grid_w = self.planning.controls(settings, now)
            result = allocate(site, order, states, self.runtimes)
            for dec in result.decisions:
                self.planning.label(dec, now)
            by_id = {d.load_id: d for d in result.decisions}
            result_decisions = [by_id[cfg["id"]] for cfg in loads]
            base_w, surplus_w, headroom = result.base_w, result.surplus_w, result.grid_headroom_w
            self._base_hist.append((now, base_w))

        # A battery SolarMind cannot steer (disabled, no grid reading, master switch off)
        # goes back to the inverter's own control instead of keeping its last setpoint.
        control_on = settings.get("enabled", True) and grid is not None
        for i, cfg in enumerate(loads):
            if cfg["type"] == LOAD_BATTERY and (not control_on or not cfg.get("enabled", True)) and states[cfg["id"]].available:
                result_decisions[i] = Decision(cfg["id"], False, reason=result_decisions[i].reason)
                if not control_on:
                    try:
                        await self.drivers[cfg["id"]].async_apply(states[cfg["id"]], result_decisions[i])
                    except Exception:
                        _LOGGER.exception("Releasing battery %s failed", cfg.get("name"))

        # Apply
        if control_on:
            for cfg, dec in zip(loads, result_decisions, strict=True):
                st = states[cfg["id"]]
                if not st.available:
                    continue
                rt = self.runtimes[cfg["id"]]
                try:
                    if dec.on and dec.current_a is not None and st.current_a is not None and int(round(st.current_a)) != dec.current_a:
                        rt.last_current_change_ts = now
                    if await self.drivers[cfg["id"]].async_apply(st, dec):
                        rt.last_switch_ts = now
                except Exception:
                    _LOGGER.exception("Controlling load %s failed", cfg.get("name"))

        # Energy accounting: managed loads get solar first after the house base load.
        # A discharging battery is not solar: what it delivers counts like grid import.
        powers = {c["id"]: actual_power(c, states[c["id"]], voltage) if states[c["id"]].available else 0.0 for c in loads}
        managed_total = sum(powers.values())
        consumers = sum(max(0.0, p) for p in powers.values())
        discharge_total = sum(-p for p in powers.values() if p < 0)
        grid_for_managed = min(consumers, max(0.0, grid or 0.0) + discharge_total)
        solar_frac = 1.0 - (grid_for_managed / consumers) if consumers > 0 else 0.0
        samples: dict[str, LoadSample] = {}
        loads_live: dict[str, Any] = {}
        for cfg, dec in zip(loads, result_decisions, strict=True):
            st = states[cfg["id"]]
            rt = self.runtimes.setdefault(cfg["id"], LoadRuntime())
            signed_p = powers[cfg["id"]]
            p = max(0.0, signed_p)
            discharge_p = max(0.0, -signed_p)
            solar_p = p * solar_frac
            if dt_s > 0:
                rt.solar_kwh_day += solar_p * dt_s / 3.6e6
                if is_night:
                    rt.night_kwh += p * dt_s / 3.6e6
            value = st.soc if cfg["type"] in (LOAD_EV, LOAD_BATTERY) else st.temperature
            samples[cfg["id"]] = LoadSample(
                power_w=p, solar_w=solar_p, on=st.is_on, reason=dec.reason, value=value, plugged=st.plugged, soc=st.soc,
                discharge_w=discharge_p,
            )
            loads_live[cfg["id"]] = {
                "available": st.available,
                "is_on": st.is_on,
                "power_w": round(signed_p, 1),
                "solar_w": round(solar_p, 1),
                "current_a": st.current_a,
                "target_current_a": dec.current_a,
                "soc": st.soc,
                "temperature": st.temperature,
                "plugged": st.plugged,
                "reason": dec.reason,
                "wants_on": dec.on,
                "allocated_w": round(dec.allocated_w, 1),
                "is_full": rt.is_full,
                "night_needed": rt.night_needed,
                "solar_kwh_day": round(rt.solar_kwh_day, 3),
                "night_kwh": round(rt.night_kwh, 3),
                "last_hot_ts": rt.last_hot_ts or None,
                "car_state": st.car_state,
                "driver_error": getattr(self.drivers.get(cfg["id"]), "last_error", None),
            }
            plan = self.planning.plan
            learner = self.planning.learners.get(cfg["id"])
            loads_live[cfg["id"]]["plan"] = plan.loads.get(cfg["id"]) if plan else None
            loads_live[cfg["id"]]["need_learned_kwh"] = (
                round(learner.learned_kwh, 2) if learner and learner.learned_kwh else None
            )
            if cfg["type"] == LOAD_EV:
                loads_live[cfg["id"]].update(self._ev_eta(cfg, st, p, now, dt_s, voltage))
            elif cfg["type"] == LOAD_BATTERY:
                loads_live[cfg["id"]].update(battery_live(cfg, st, dec))
        if grid is not None and dt_s > 0:
            self.history.record(local, dt_s, pv, grid, samples)
        self.planning.learn(loads, self.runtimes, powers, dt_s, day_ended)

        today = local.strftime("%Y-%m-%d")
        if today != self._last_prune_day:
            self._last_prune_day = today
            self.history.prune(local)
        day = self.history.days.get(today, {"loads": {}, "house": {}})
        for lid, live in loads_live.items():
            d = day["loads"].get(lid, {})
            live["kwh_today"] = round(d.get("kwh", 0.0), 3)
            live["solar_kwh_today"] = round(d.get("solar_kwh", 0.0), 3)
            live["runtime_today_s"] = round(d.get("runtime_s", 0.0))
            if "discharge_kwh" in d:
                live["discharge_kwh_today"] = round(d["discharge_kwh"], 3)

        self.live = {
            "site": {
                "available": grid is not None,
                "enabled": settings.get("enabled", True),
                "grid_w": grid,
                "pv_w": pv,
                "base_w": round(base_w, 1),
                "surplus_w": round(surplus_w, 1),
                "managed_w": round(managed_total, 1),
                "grid_headroom_w": None if headroom == INF else round(headroom, 1),
                "grid_budget_w": None if site.grid_budget_w == INF else round(site.grid_budget_w, 1),
                "in_night": is_night,
                "quarter_average_w": round(self.peak.current_average_w(now), 1),
                "quarter_projected_w": round(self.peak.projected_w(now), 1),
                "peak_limit_w": round(self.peak.limit_w(settings), 1),
                "month_peak_w": round(self.peak.month_peak_w, 1),
                "month_peak_ts": self.peak.month_peak_ts or None,
                "forecast_tomorrow_kwh": forecast_tomorrow,
                "forecast": self.plan.to_dict(),
                "plan": self._plan_live(),
                "today": day.get("house", {}),
            },
            "loads": loads_live,
            "order": [cfg["id"] for cfg in loads],
        }

        self._notify(now, loads, settings)
        self._persist_runtime()
        self.store.schedule_save(60)
        if self.history.dirty:
            self.history.dirty = False
            self._history_store.async_delay_save(self.history.to_dict, HISTORY_SAVE_DELAY)
        self._notify_ws()
        return self.live

    def ev_capacity_kwh(self, cfg: dict[str, Any]) -> float | None:
        learner = self._ev_capacity.get(cfg["id"])
        return cfg.get("ev_battery_kwh") or (learner.learned_kwh or learner.guess_kwh if learner else None)

    def _update_planning(
        self,
        now: float,
        local: datetime,
        settings: dict[str, Any],
        order: list[dict[str, Any]],
        states: dict[str, LoadState],
        forecast_tomorrow: float | None,
        house_today: dict[str, Any],
        voltage: float,
    ) -> None:
        limit = self.peak.limit_w(settings) if settings.get("peak_guard_enabled", True) else None
        try:
            plan = self.planning.update(
                now, local, settings, order, states, self.runtimes,
                {c["id"]: self.ev_capacity_kwh(c) for c in order if c["type"] == LOAD_EV},
                forecast_tomorrow, house_today.get("pv_kwh") if settings.get("pv_power_entity") else None,
                limit, self.history, voltage,
            )
        except Exception:  # noqa: BLE001 - the planner must never stop control
            _LOGGER.exception("SolarMind: planning failed")
            self.planning.plan = None
            return
        if plan is not None and plan.slots:
            self.history.add_prediction(plan.slots[0], plan.pv_w[0], plan.base_w[0])

    def _plan_live(self) -> dict[str, Any] | None:
        plan = self.planning.plan
        if plan is None:
            return None
        return {"created": plan.created, "loads": plan.loads, "pv_source": self.planning.info.get("pv_source")}

    def _ev_eta(self, cfg: dict[str, Any], st: LoadState, power_w: float, now: float, dt_s: float, voltage: float) -> dict[str, Any]:
        """Time to 100 % (and to the car's charge limit) at the current charging power."""
        lid = cfg["id"]
        avg = self._ev_power.setdefault(lid, PowerAverager())
        learner = self._ev_capacity.setdefault(lid, CapacityLearner())
        charging = st.available and st.is_on and power_w >= MIN_CHARGING_W
        if charging:
            avg.add(now, power_w)
        else:
            avg.reset()
        if st.available:
            learner.update(st.soc, st.plugged, power_w * dt_s / 3.6e6 if charging else 0.0)
        capacity = cfg.get("ev_battery_kwh") or learner.learned_kwh
        source = "set" if cfg.get("ev_battery_kwh") else "learned" if capacity else None
        if not capacity and charging:
            # Until we learned it: derive it from the car's own time-to-limit estimate.
            guess = capacity_from_car_estimate(st.soc, st.charge_limit, st.car_time_to_limit_h, avg.average())
            if guess:
                learner.guess_kwh = guess
        if not capacity and learner.guess_kwh:
            capacity, source = learner.guess_kwh, "car"
        out: dict[str, Any] = {
            "battery_kwh": round(capacity, 1) if capacity else None,
            "battery_kwh_source": source,
            "battery_kwh_learned": round(learner.learned_kwh, 1) if learner.learned_kwh else None,
            "charge_limit": st.charge_limit,
            "eta_full_s": None,
            "eta_limit_s": None,
            "eta_estimated": False,
            "eta_source": None,
        }
        if not st.available or st.soc is None or st.plugged is False:
            return out
        limit = st.charge_limit if st.charge_limit is not None and st.soc < st.charge_limit else None
        car_s = st.car_time_to_limit_h * 3600 if charging and limit and st.car_time_to_limit_h else None
        if car_s:
            # The car's own estimate (Tesla) is the most accurate for the part up to its limit.
            out["eta_source"] = "car"
            if limit < 100:
                out["eta_limit_s"] = round(car_s)
                rest = time_to_soc_s(limit, 100.0, capacity, avg.average() or power_w) if capacity else None
                out["eta_full_s"] = None if rest is None else round(car_s + rest)
            else:
                out["eta_full_s"] = round(car_s)
            return out
        if not capacity:
            return out
        out["eta_source"] = "calc"
        power = avg.average() if charging else None
        if power is None:
            # Paused: estimate at the minimum the car would charge with.
            wpa = voltage * max(1, int(cfg.get("ev_phases", 1)))
            min_w = cfg.get("ev_min_power_w") if cfg.get("mode") == "solar" else None
            power = max(float(min_w or 0), cfg.get("ev_min_current", 6) * wpa)
            if cfg.get("mode") == "on":
                power = cfg.get("ev_max_current", 16) * wpa  # "On" charges at full current
            out["eta_estimated"] = True
        full = time_to_soc_s(st.soc, 100.0, capacity, power)
        out["eta_full_s"] = None if full is None else round(full)
        if limit is not None and limit < 100:
            lim = time_to_soc_s(st.soc, limit, capacity, power)
            out["eta_limit_s"] = None if lim is None else round(lim)
        return out

    def _notify(self, now: float, loads: list[dict[str, Any]], settings: dict[str, Any]) -> None:
        try:
            messages = self.notifier.update(now, self.live, loads, settings)
        except Exception:  # noqa: BLE001 - notifications must never break control
            _LOGGER.exception("SolarMind: evaluating notifications failed")
            return
        if messages and notify_targets(settings):
            self.hass.async_create_task(async_send(self.hass, settings, messages))

    def _persist_runtime(self) -> None:
        self.store.runtime = {
            "peak": self.peak.to_dict(),
            "was_night": self._was_night,
            "loads": {lid: rt.to_dict() for lid, rt in self.runtimes.items()},
            "planning": self.planning.to_dict(),
            "ev_capacity": {
                lid: c.to_dict() for lid, c in self._ev_capacity.items() if self.store.get_load(lid) is not None
            },
        }

    # --------------------------------------------------- websocket live feed

    @callback
    def add_ws_listener(self, cb: Any) -> Any:
        self._listeners_ws.add(cb)

        @callback
        def _remove() -> None:
            self._listeners_ws.discard(cb)

        return _remove

    @callback
    def _notify_ws(self) -> None:
        for cb in list(self._listeners_ws):
            try:
                cb(self.live)
            except Exception:
                _LOGGER.debug("Live listener failed", exc_info=True)
