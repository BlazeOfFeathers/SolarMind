"""Quarter-hour peak tracking for the Belgian capacity tariff (capaciteitstarief).

The grid operator bills the monthly maximum of the 15-minute average import
power (minimum 2.5 kW). This tracker integrates import power over the running
quarter and tells how much import is still allowed right now so the quarter
average stays under the limit.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

QUARTER_S = 900
MIN_REMAINING_S = 60


def quarter_start(ts: float) -> float:
    return ts - (ts % QUARTER_S)


@dataclass
class PeakTracker:
    quarter_start_ts: float = 0.0
    quarter_energy_wh: float = 0.0
    last_ts: float | None = None
    last_import_w: float = 0.0
    month_key: str = ""
    month_peak_w: float = 0.0
    month_peak_ts: float = 0.0
    finished_quarters: list[tuple[float, float]] = field(default_factory=list)  # (start_ts, avg_w), not persisted

    def update(self, now: float, import_w: float, month_key: str) -> None:
        """Integrate import power (W, >= 0) up to ``now``."""
        import_w = max(0.0, import_w)
        if month_key != self.month_key:
            self.month_key = month_key
            self.month_peak_w = 0.0
            self.month_peak_ts = 0.0
        q = quarter_start(now)
        if self.last_ts is None:
            self.last_ts = now
            self.quarter_start_ts = q
            self.last_import_w = import_w
            return
        if q != self.quarter_start_ts:
            # Close the previous quarter, counting the part up to its end.
            end = self.quarter_start_ts + QUARTER_S
            if self.last_ts < end:
                self.quarter_energy_wh += self.last_import_w * (min(end, now) - self.last_ts) / 3600
            avg = self.quarter_energy_wh * 3600 / QUARTER_S
            self.finished_quarters.append((self.quarter_start_ts, avg))
            if avg > self.month_peak_w:
                self.month_peak_w = avg
                self.month_peak_ts = self.quarter_start_ts
            self.quarter_start_ts = q
            self.quarter_energy_wh = 0.0
            self.last_ts = q
        dt = max(0.0, now - self.last_ts)
        # Hold the previous sample (sensors report stepwise).
        self.quarter_energy_wh += self.last_import_w * dt / 3600
        self.last_ts = now
        self.last_import_w = import_w

    def elapsed_s(self, now: float) -> float:
        return max(0.0, now - self.quarter_start_ts)

    def current_average_w(self, now: float) -> float:
        el = self.elapsed_s(now)
        return self.quarter_energy_wh * 3600 / el if el > 0 else self.last_import_w

    def projected_w(self, now: float) -> float:
        """Quarter average if the present import continues until the end of the quarter."""
        remaining = max(0.0, QUARTER_S - self.elapsed_s(now))
        return (self.quarter_energy_wh + self.last_import_w * remaining / 3600) * 3600 / QUARTER_S

    def limit_w(self, settings: dict[str, Any]) -> float:
        limit = float(settings.get("peak_limit_w", 2500))
        if settings.get("peak_follow_month_max", True):
            limit = max(limit, self.month_peak_w)
        return max(0.0, limit - float(settings.get("peak_margin_w", 0)))

    def budget_w(self, now: float, settings: dict[str, Any]) -> float:
        """Import power allowed from now until the end of the quarter."""
        limit = self.limit_w(settings)
        remaining = max(MIN_REMAINING_S, QUARTER_S - self.elapsed_s(now))
        left_wh = limit * QUARTER_S / 3600 - self.quarter_energy_wh
        return max(0.0, left_wh * 3600 / remaining)

    def pop_finished(self) -> list[tuple[float, float]]:
        done, self.finished_quarters = self.finished_quarters, []
        return done

    def to_dict(self) -> dict[str, Any]:
        return {
            "quarter_start_ts": self.quarter_start_ts,
            "quarter_energy_wh": self.quarter_energy_wh,
            "month_key": self.month_key,
            "month_peak_w": self.month_peak_w,
            "month_peak_ts": self.month_peak_ts,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> PeakTracker:
        t = cls()
        if data:
            t.quarter_start_ts = float(data.get("quarter_start_ts", 0.0))
            t.quarter_energy_wh = float(data.get("quarter_energy_wh", 0.0))
            t.month_key = data.get("month_key", "")
            t.month_peak_w = float(data.get("month_peak_w", 0.0))
            t.month_peak_ts = float(data.get("month_peak_ts", 0.0))
            if t.quarter_start_ts:
                t.last_ts = None  # restart integration; partial quarter energy is kept
        return t

    def resume(self, now: float, import_w: float) -> None:
        """After a restart: keep the stored quarter if we are still in it."""
        q = quarter_start(now)
        if q != self.quarter_start_ts:
            self.quarter_start_ts = q
            self.quarter_energy_wh = 0.0
        self.last_ts = now
        self.last_import_w = max(0.0, import_w)


def month_key_of(dt: datetime) -> str:
    return f"{dt.year:04d}-{dt.month:02d}"
