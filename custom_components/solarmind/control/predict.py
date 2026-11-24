"""Predictions per quarter hour for the planner: sun, house load and what each load still needs.

Pure Python, no Home Assistant imports.

* **Sun.** Solcast puts its forecast per half hour in the ``detailedForecast`` attribute of
  its today/tomorrow sensors (kW), Open-Meteo Solar Forecast per period in ``watts`` (W) or
  ``wh_period`` (Wh). Without such an attribute the day total (kWh) is spread over the hours
  in the shape of the PV production SolarMind recorded the last days, or a sine between
  sunrise and sunset when there is no history yet.
* **House.** The house load without the managed loads, averaged per hour of day over the
  recorded minutes (the last 14 days), or a fixed value.
* **Boilers.** With a temperature sensor: litres x temperature rise. Without one: the
  energy a boiler takes per day, learned from the days it got full.
"""

from __future__ import annotations

import itertools
import math
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

SLOT_S = 900
WH_PER_L_K = 1.163  # water: 4186 J/(kg K) / 3600
DEFAULT_BASE_W = 300.0
LEARN_ALPHA = 0.3  # weight of a new day in the learned boiler need
MIN_LEARN_KWH = 0.3


def slot_start(ts: float) -> float:
    return ts - (ts % SLOT_S)


# ------------------------------------------------------------------ sun


def _parse_ts(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, datetime):
        return value.timestamp()
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value).timestamp()
        except ValueError:
            return None
    return None


def periods_from_attributes(attrs: dict[str, Any] | None, estimate: str = "pv_estimate") -> list[tuple[float, float, float]]:
    """(start_ts, end_ts, average W) per forecast period found in a sensor's attributes."""
    if not attrs:
        return []
    out: list[tuple[float, float, float]] = []
    for key in ("detailedForecast", "detailed_forecast", "detailedHourly"):
        rows = attrs.get(key)
        if not isinstance(rows, list) or not rows:
            continue
        starts: list[tuple[float, float]] = []
        for row in rows:
            if not isinstance(row, dict):
                continue
            ts = _parse_ts(row.get("period_start") or row.get("period_end"))
            val = row.get(estimate, row.get("pv_estimate"))
            if ts is None or val is None:
                continue
            try:
                starts.append((ts, float(val) * 1000.0))  # kW -> W
            except (TypeError, ValueError):
                continue
        starts.sort()
        if not starts:
            continue
        step = 3600.0 if key == "detailedHourly" else 1800.0
        if len(starts) > 1:
            step = min(b[0] - a[0] for a, b in itertools.pairwise(starts)) or step
        out = [(ts, ts + step, w) for ts, w in starts]
        return out
    for key, factor in (("watts", None), ("wh_period", "wh")):
        data = attrs.get(key)
        if not isinstance(data, dict) or not data:
            continue
        pts = sorted((t, float(v)) for t, v in ((_parse_ts(k), v) for k, v in data.items()) if t is not None)
        if not pts:
            continue
        step = min((b[0] - a[0] for a, b in itertools.pairwise(pts)), default=3600.0) or 3600.0
        if factor == "wh":
            return [(ts, ts + step, wh * 3600.0 / step) for ts, wh in pts]
        # "watts" are instantaneous values at the period start: hold them for the period
        return [(ts, ts + step, w) for ts, w in pts]
    return []


def resample(periods: list[tuple[float, float, float]], slots: list[float]) -> list[float | None]:
    """Average W per slot from forecast periods (None where no period covers the slot)."""
    out: list[float | None] = []
    for s in slots:
        e = s + SLOT_S
        energy = 0.0
        covered = 0.0
        for ps, pe, w in periods:
            lo, hi = max(s, ps), min(e, pe)
            if hi > lo:
                energy += w * (hi - lo)
                covered += hi - lo
        out.append(energy / covered if covered >= SLOT_S * 0.5 else None)
    return out


def pv_shape(samples: dict[str, list[list[Any]]], tz: Any, days: int = 7) -> list[float] | None:
    """Relative PV production per quarter of the day (sums to 1) from recorded minutes."""
    sums = [0.0] * 96
    keys = sorted(samples)[-days:]
    for key in keys:
        for row in samples[key]:
            pv = row[1] or 0
            if pv <= 0:
                continue
            local = datetime.fromtimestamp(row[0], tz=tz)
            sums[(local.hour * 60 + local.minute) // 15] += pv
    total = sum(sums)
    if total <= 0:
        return None
    return [v / total for v in sums]


def sine_shape(sunrise_h: float = 7.5, sunset_h: float = 17.5) -> list[float]:
    vals = []
    for q in range(96):
        h = (q + 0.5) / 4
        vals.append(math.sin(math.pi * (h - sunrise_h) / (sunset_h - sunrise_h)) if sunrise_h < h < sunset_h else 0.0)
    total = sum(vals) or 1.0
    return [v / total for v in vals]


def spread_day(day_kwh: float, day_start: datetime, shape: list[float]) -> list[tuple[float, float, float]]:
    """Periods (one per quarter) for a day total spread in ``shape``."""
    out = []
    for q, share in enumerate(shape):
        if share <= 0:
            continue
        s = (day_start + timedelta(minutes=15 * q)).timestamp()
        out.append((s, s + SLOT_S, day_kwh * 1000.0 * share * 4))
    return out


# ---------------------------------------------------------------- house


def base_profile(samples: dict[str, list[list[Any]]], tz: Any, days: int = 14) -> list[float] | None:
    """Average house load (W) per hour of day, without the managed loads.

    house = pv + grid - managed loads, per recorded minute."""
    sums = [0.0] * 24
    counts = [0] * 24
    for key in sorted(samples)[-days:]:
        for row in samples[key]:
            managed = sum((ld[0] or 0) for ld in row[3].values())
            house = (row[1] or 0) + (row[2] or 0) - managed
            hour = datetime.fromtimestamp(row[0], tz=tz).hour
            sums[hour] += max(0.0, house)
            counts[hour] += 1
    if sum(counts) < 6 * 60:  # less than six hours recorded: not reliable yet
        return None
    overall = sum(sums) / sum(counts)
    return [sums[h] / counts[h] if counts[h] >= 20 else overall for h in range(24)]


# -------------------------------------------------------------- boilers


@dataclass
class BoilerLearner:
    """Learns the energy a boiler without a temperature sensor takes per day.

    A day runs from the end of one night window to the next. The energy it took up to the
    moment it got full is one sample (a lower bound when it never got full is ignored)."""

    learned_kwh: float | None = None
    day_kwh: float = 0.0  # energy (sun + grid) this day
    full_today: bool = False
    samples: int = 0

    def add(self, kwh: float) -> None:
        if not self.full_today:
            self.day_kwh += max(0.0, kwh)

    def got_full(self) -> None:
        if self.full_today:
            return
        self.full_today = True
        if self.day_kwh >= MIN_LEARN_KWH:
            sample = self.day_kwh
            self.learned_kwh = sample if self.learned_kwh is None else (1 - LEARN_ALPHA) * self.learned_kwh + LEARN_ALPHA * sample
            self.samples += 1

    def new_day(self) -> None:
        self.day_kwh = 0.0
        self.full_today = False

    def to_dict(self) -> dict[str, Any]:
        return {"learned_kwh": self.learned_kwh, "day_kwh": self.day_kwh, "full_today": self.full_today, "samples": self.samples}

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> BoilerLearner:
        if not data:
            return cls()
        return cls(
            learned_kwh=data.get("learned_kwh"),
            day_kwh=float(data.get("day_kwh", 0.0)),
            full_today=bool(data.get("full_today", False)),
            samples=int(data.get("samples", 0)),
        )


def boiler_need_from_temperature(cfg: dict[str, Any], temperature: float | None) -> float | None:
    """kWh to heat the boiler from its temperature now to the target, or None without a reading."""
    if temperature is None:
        return None
    target = cfg.get("boiler_target_temperature") or cfg.get("max_temperature") or 60
    litres = float(cfg.get("boiler_volume_l") or 0)
    if litres <= 0:
        return None
    return max(0.0, (float(target) - temperature) * litres * WH_PER_L_K / 1000.0)


def boiler_day_need(cfg: dict[str, Any], learner: BoilerLearner | None, default_kwh: float = 4.0) -> tuple[float, str]:
    """Daily need of a boiler without a reading: set > learned > night threshold > default."""
    if cfg.get("plan_need_kwh"):
        return float(cfg["plan_need_kwh"]), "set"
    if learner and learner.learned_kwh:
        return learner.learned_kwh, "learned"
    if cfg.get("night_min_solar_kwh"):
        return float(cfg["night_min_solar_kwh"]), "night"
    return default_kwh, "default"
