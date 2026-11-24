"""History and analytics data for SolarMind.

Kept in one JSON document (Home Assistant Store) with three parts:

* ``samples``: one row per minute with PV, grid and per-load power, for the timeline.
* ``days``: daily totals per load and for the house, kept long term.
* ``quarters``: 15-minute average import per day, for the capacity tariff view.
* ``sessions``: EV charging sessions (plug in to plug out).

This module has no Home Assistant imports.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any

SAMPLE_DAYS = 14
DAY_KEEP_DAYS = 800
QUARTER_KEEP_DAYS = 400
SESSION_KEEP = 300


def day_key(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d")


@dataclass
class _LoadAcc:
    energy_ws: float = 0.0
    solar_ws: float = 0.0
    seconds: float = 0.0
    reason: str = "idle"
    on: bool = False
    value: float | None = None  # temperature or SoC


@dataclass
class _MinuteAcc:
    minute_ts: float = 0.0
    seconds: float = 0.0
    pv_ws: float = 0.0
    grid_ws: float = 0.0
    loads: dict[str, _LoadAcc] = field(default_factory=dict)


@dataclass
class LoadSample:
    power_w: float
    solar_w: float
    on: bool
    reason: str
    value: float | None = None
    plugged: bool | None = None
    soc: float | None = None
    discharge_w: float = 0.0  # battery only


class HistoryData:
    def __init__(self, data: dict[str, Any] | None = None) -> None:
        data = data or {}
        self.samples: dict[str, list[list[Any]]] = data.get("samples", {})
        self.days: dict[str, dict[str, Any]] = data.get("days", {})
        self.quarters: dict[str, list[list[float]]] = data.get("quarters", {})
        self.sessions: list[dict[str, Any]] = data.get("sessions", [])
        self.open_sessions: dict[str, dict[str, Any]] = data.get("open_sessions", {})
        self._acc = _MinuteAcc()
        self._last_on: dict[str, bool] = {}
        self.dirty = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "samples": self.samples,
            "days": self.days,
            "quarters": self.quarters,
            "sessions": self.sessions,
            "open_sessions": self.open_sessions,
        }

    # ------------------------------------------------------------------ record

    def record(
        self,
        local_now: datetime,
        dt_s: float,
        pv_w: float | None,
        grid_w: float,
        loads: dict[str, LoadSample],
    ) -> None:
        """Add one control cycle of ``dt_s`` seconds."""
        ts = local_now.timestamp()
        minute = ts - (ts % 60)
        if self._acc.minute_ts and minute != self._acc.minute_ts:
            self._flush(local_now)
        if not self._acc.minute_ts or minute != self._acc.minute_ts:
            self._acc = _MinuteAcc(minute_ts=minute)

        dt_s = max(0.0, min(dt_s, 120.0))
        a = self._acc
        a.seconds += dt_s
        a.pv_ws += (pv_w or 0.0) * dt_s
        a.grid_ws += grid_w * dt_s

        day = self._day(day_key(local_now))
        house = day["house"]
        house["pv_kwh"] += (pv_w or 0.0) * dt_s / 3.6e6
        if grid_w >= 0:
            house["import_kwh"] += grid_w * dt_s / 3.6e6
        else:
            house["export_kwh"] += -grid_w * dt_s / 3.6e6

        for lid, s in loads.items():
            la = a.loads.setdefault(lid, _LoadAcc())
            la.energy_ws += (s.power_w - s.discharge_w) * dt_s
            la.solar_ws += s.solar_w * dt_s
            la.seconds += dt_s
            la.reason = s.reason
            la.on = la.on or s.on
            la.value = s.value

            d = day["loads"].setdefault(lid, _empty_load_day())
            d["kwh"] += s.power_w * dt_s / 3.6e6
            d["solar_kwh"] += s.solar_w * dt_s / 3.6e6
            if s.discharge_w > 0 or "discharge_kwh" in d:
                d["discharge_kwh"] = d.get("discharge_kwh", 0.0) + s.discharge_w * dt_s / 3.6e6
            if s.on and s.power_w > 1:
                d["runtime_s"] += dt_s
            was_on = self._last_on.get(lid)
            if s.on and was_on is False:
                d["starts"] += 1
            self._last_on[lid] = s.on
            if s.value is not None:
                d["max_value"] = s.value if d["max_value"] is None else max(d["max_value"], s.value)
                d["min_value"] = s.value if d["min_value"] is None else min(d["min_value"], s.value)
            d["reasons"][s.reason] = d["reasons"].get(s.reason, 0) + dt_s
            self._track_session(lid, s, ts, dt_s)
        self.dirty = True

    def add_quarters(self, quarters: list[tuple[float, float]], tz_offset_of) -> None:
        """Store finished quarter averages. ``tz_offset_of(ts)`` returns a local datetime."""
        for start, avg in quarters:
            local = tz_offset_of(start)
            key = day_key(local)
            self.quarters.setdefault(key, []).append([start, round(avg, 1)])
            day = self._day(key)
            day["house"]["peak_w"] = max(day["house"]["peak_w"], round(avg, 1))
            self.dirty = True

    def _track_session(self, lid: str, s: LoadSample, ts: float, dt_s: float) -> None:
        if s.plugged is None:
            return
        sess = self.open_sessions.get(lid)
        if s.plugged and sess is None:
            self.open_sessions[lid] = {
                "load_id": lid,
                "start": ts,
                "end": None,
                "kwh": 0.0,
                "solar_kwh": 0.0,
                "soc_start": s.soc,
                "soc_end": s.soc,
            }
        elif s.plugged and sess is not None:
            sess["kwh"] += s.power_w * dt_s / 3.6e6
            sess["solar_kwh"] += s.solar_w * dt_s / 3.6e6
            if s.soc is not None:
                sess["soc_end"] = s.soc
                if sess["soc_start"] is None:
                    sess["soc_start"] = s.soc
        elif not s.plugged and sess is not None:
            sess["end"] = ts
            if sess["kwh"] > 0.05:
                self.sessions.append(sess)
                self.sessions = self.sessions[-SESSION_KEEP:]
            del self.open_sessions[lid]

    def _flush(self, local_now: datetime) -> None:
        a = self._acc
        if a.seconds <= 0:
            return
        start = datetime.fromtimestamp(a.minute_ts, tz=local_now.tzinfo)
        row_loads: dict[str, list[Any]] = {}
        for lid, la in a.loads.items():
            sec = la.seconds or a.seconds
            row_loads[lid] = [
                round(la.energy_ws / sec),
                round(la.solar_ws / sec),
                la.reason,
                1 if la.on else 0,
                None if la.value is None else round(la.value, 1),
            ]
        row = [int(a.minute_ts), round(a.pv_ws / a.seconds), round(a.grid_ws / a.seconds), row_loads]
        self.samples.setdefault(day_key(start), []).append(row)
        self.dirty = True

    def _day(self, key: str) -> dict[str, Any]:
        day = self.days.get(key)
        if day is None:
            day = {
                "house": {"pv_kwh": 0.0, "import_kwh": 0.0, "export_kwh": 0.0, "peak_w": 0.0},
                "loads": {},
            }
            self.days[key] = day
        return day

    # ------------------------------------------------------------------- prune

    def prune(self, local_now: datetime) -> None:
        def cutoff(days: int) -> str:
            return day_key(local_now - timedelta(days=days))

        for store, keep in ((self.samples, SAMPLE_DAYS), (self.days, DAY_KEEP_DAYS), (self.quarters, QUARTER_KEEP_DAYS)):
            limit = cutoff(keep)
            for key in [k for k in store if k < limit]:
                del store[key]
                self.dirty = True

    def remove_load(self, lid: str) -> None:
        for rows in self.samples.values():
            for row in rows:
                row[3].pop(lid, None)
        for day in self.days.values():
            day["loads"].pop(lid, None)
        self.sessions = [s for s in self.sessions if s.get("load_id") != lid]
        self.open_sessions.pop(lid, None)
        self.dirty = True

    # ------------------------------------------------------------------- query

    def timeline(self, start_ts: float, end_ts: float, load_id: str | None = None) -> dict[str, Any]:
        """Minute rows between two timestamps; optionally only one load."""
        out: list[list[Any]] = []
        for key in sorted(self.samples):
            for row in self.samples[key]:
                if start_ts <= row[0] < end_ts:
                    loads = row[3] if load_id is None else {load_id: row[3][load_id]} if load_id in row[3] else {}
                    out.append([row[0], row[1], row[2], loads])
        return {"columns": ["ts", "pv_w", "grid_w", "loads"], "load_columns": ["power_w", "solar_w", "reason", "on", "value"], "rows": out}

    def day_totals(self, start_key: str, end_key: str) -> dict[str, dict[str, Any]]:
        return {k: v for k, v in sorted(self.days.items()) if start_key <= k <= end_key}

    def quarter_rows(self, start_key: str, end_key: str) -> dict[str, list[list[float]]]:
        return {k: v for k, v in sorted(self.quarters.items()) if start_key <= k <= end_key}

    def load_sessions(self, load_id: str | None = None) -> list[dict[str, Any]]:
        sess = [s for s in self.sessions if load_id is None or s.get("load_id") == load_id]
        sess += [s for s in self.open_sessions.values() if load_id is None or s.get("load_id") == load_id]
        return sess


def _empty_load_day() -> dict[str, Any]:
    return {
        "kwh": 0.0,
        "solar_kwh": 0.0,
        "runtime_s": 0.0,
        "starts": 0,
        "max_value": None,
        "min_value": None,
        "reasons": {},
    }


def summarize(days: dict[str, dict[str, Any]], price_import: float, price_export: float) -> dict[str, Any]:
    """Totals over a range of days for the analytics summary."""
    house = {"pv_kwh": 0.0, "import_kwh": 0.0, "export_kwh": 0.0, "peak_w": 0.0}
    loads: dict[str, dict[str, Any]] = {}
    for day in days.values():
        for k in ("pv_kwh", "import_kwh", "export_kwh"):
            house[k] += day["house"].get(k, 0.0)
        house["peak_w"] = max(house["peak_w"], day["house"].get("peak_w", 0.0))
        for lid, d in day["loads"].items():
            t = loads.setdefault(lid, {"kwh": 0.0, "solar_kwh": 0.0, "runtime_s": 0.0, "starts": 0, "reasons": {}})
            t["kwh"] += d["kwh"]
            t["solar_kwh"] += d["solar_kwh"]
            t["runtime_s"] += d["runtime_s"]
            t["starts"] += d["starts"]
            if "discharge_kwh" in d:
                t["discharge_kwh"] = t.get("discharge_kwh", 0.0) + d["discharge_kwh"]
            for r, sec in d.get("reasons", {}).items():
                t["reasons"][r] = t["reasons"].get(r, 0) + sec
    for t in loads.values():
        grid = max(0.0, t["kwh"] - t["solar_kwh"])
        t["grid_kwh"] = grid
        t["solar_share"] = t["solar_kwh"] / t["kwh"] if t["kwh"] > 0 else None
        t["cost"] = grid * price_import + t["solar_kwh"] * price_export  # export income given up
        t["saving"] = t["solar_kwh"] * (price_import - price_export)
        if "discharge_kwh" in t:
            # Battery: what it delivered was not bought, minus what charging it cost
            # (grid at the import price, solar at the export income given up).
            t["saving"] = t["discharge_kwh"] * price_import - t["cost"]
            t["efficiency"] = t["discharge_kwh"] / t["kwh"] if t["kwh"] > 0 else None
    consumption = house["pv_kwh"] - house["export_kwh"] + house["import_kwh"]
    house["consumption_kwh"] = consumption
    house["self_consumption"] = (
        (house["pv_kwh"] - house["export_kwh"]) / house["pv_kwh"] if house["pv_kwh"] > 0 else None
    )
    house["self_sufficiency"] = (
        (consumption - house["import_kwh"]) / consumption if consumption > 0 else None
    )
    return {"house": house, "loads": loads}


def rhythm(samples: dict[str, list[list[Any]]], load_id: str, start_key: str, end_key: str, tz: Any = None) -> list[float]:
    """Average power per hour of day for one load."""
    sums = [0.0] * 24
    counts = [0] * 24
    for key, rows in samples.items():
        if not start_key <= key <= end_key:
            continue
        for row in rows:
            ld = row[3].get(load_id)
            if ld is None:
                continue
            hour = datetime.fromtimestamp(row[0], tz=tz).hour
            sums[hour] += ld[0]
            counts[hour] += 1
    return [round(sums[h] / counts[h]) if counts[h] else 0.0 for h in range(24)]
