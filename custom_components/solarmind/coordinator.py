"""SolarMind coordinator: the control loop."""

from __future__ import annotations

import logging
import time
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
from .control.peak import PeakTracker, month_key_of
from .drivers import BaseDriver, make_driver, read_float
from .history import HistoryData, LoadSample
from .store import SolarMindStore

_LOGGER = logging.getLogger(__name__)

HISTORY_SAVE_DELAY = 300


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
        self._last_prune_day = ""
        self.live: dict[str, Any] = {"site": {}, "loads": {}}
        self._listeners_ws: set[Any] = set()

    async def async_setup(self) -> None:
        self.history = HistoryData(await self._history_store.async_load())
        rt = self.store.runtime
        self.peak = PeakTracker.from_dict(rt.get("peak"))
        for lid, data in rt.get("loads", {}).items():
            self.runtimes[lid] = LoadRuntime.from_dict(data)
        self._was_night = rt.get("was_night")
        self.rebuild_drivers()

    def rebuild_drivers(self) -> None:
        self.drivers = {cfg["id"]: make_driver(self.hass, cfg) for cfg in self.store.loads}
        for lid in list(self.runtimes):
            if self.store.get_load(lid) is None:
                del self.runtimes[lid]

    async def async_shutdown_save(self) -> None:
        self._persist_runtime()
        await self.store.async_save()
        await self._history_store.async_save(self.history.to_dict())

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
        if is_night and self._was_night is not True:
            for cfg in loads:
                rt = self.runtimes.setdefault(cfg["id"], LoadRuntime())
                rt.night_kwh = 0.0
                rt.night_needed = evaluate_night_need(cfg, states[cfg["id"]], rt, site)
        elif not is_night and self._was_night is True:
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
            result = allocate(site, loads, states, self.runtimes)
            result_decisions = result.decisions
            base_w, surplus_w, headroom = result.base_w, result.surplus_w, result.grid_headroom_w

        # Apply
        if settings.get("enabled", True) and grid is not None:
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
        managed_total = sum(actual_power(c, states[c["id"]], voltage) for c in loads if states[c["id"]].available)
        grid_for_managed = min(managed_total, max(0.0, grid or 0.0))
        solar_frac = 1.0 - (grid_for_managed / managed_total) if managed_total > 0 else 0.0
        samples: dict[str, LoadSample] = {}
        loads_live: dict[str, Any] = {}
        for cfg, dec in zip(loads, result_decisions, strict=True):
            st = states[cfg["id"]]
            rt = self.runtimes.setdefault(cfg["id"], LoadRuntime())
            p = actual_power(cfg, st, voltage) if st.available else 0.0
            solar_p = p * solar_frac
            if dt_s > 0:
                rt.solar_kwh_day += solar_p * dt_s / 3.6e6
                if is_night:
                    rt.night_kwh += p * dt_s / 3.6e6
            value = st.soc if cfg["type"] == LOAD_EV else st.temperature
            samples[cfg["id"]] = LoadSample(
                power_w=p, solar_w=solar_p, on=st.is_on, reason=dec.reason, value=value, plugged=st.plugged, soc=st.soc
            )
            loads_live[cfg["id"]] = {
                "available": st.available,
                "is_on": st.is_on,
                "power_w": round(p, 1),
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
            }
        if grid is not None and dt_s > 0:
            self.history.record(local, dt_s, pv, grid, samples)

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
                "today": day.get("house", {}),
            },
            "loads": loads_live,
            "order": [cfg["id"] for cfg in loads],
        }

        self._persist_runtime()
        self.store.schedule_save(60)
        if self.history.dirty:
            self.history.dirty = False
            self._history_store.async_delay_save(self.history.to_dict, HISTORY_SAVE_DELAY)
        self._notify_ws()
        return self.live

    def _persist_runtime(self) -> None:
        self.store.runtime = {
            "peak": self.peak.to_dict(),
            "was_night": self._was_night,
            "loads": {lid: rt.to_dict() for lid, rt in self.runtimes.items()},
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
