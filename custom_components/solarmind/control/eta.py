"""Time-to-full estimate for EV loads and battery capacity learning.

Pure Python (no Home Assistant imports) so it is easy to test.
"""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field

CHARGE_EFFICIENCY = 0.9  # AC charging losses (wall -> battery), 1 phase
TAPER_FROM_SOC = 95.0  # above this the car charges slower
TAPER_FACTOR = 1.4  # ... this much slower on that last part
AVG_WINDOW_S = 300  # power is averaged over 5 minutes
MIN_CHARGING_W = 100  # below this the car is not really charging
LEARN_STEP_SOC = 10.0  # learn capacity after every 10 % of SoC gained
LEARN_MIN_KWH = 10.0
LEARN_MAX_KWH = 200.0


@dataclass
class PowerAverager:
    """Time-weighted average of the charging power over the last few minutes."""

    window_s: float = AVG_WINDOW_S
    samples: deque = field(default_factory=deque)  # (ts, power_w)

    def add(self, ts: float, power_w: float) -> None:
        self.samples.append((ts, power_w))
        while self.samples and ts - self.samples[0][0] > self.window_s:
            self.samples.popleft()

    def reset(self) -> None:
        self.samples.clear()

    def average(self) -> float | None:
        if not self.samples:
            return None
        return sum(p for _, p in self.samples) / len(self.samples)


def time_to_soc_s(soc: float, target: float, capacity_kwh: float, power_w: float) -> float | None:
    """Seconds needed to go from ``soc`` to ``target`` % at ``power_w`` (measured at the wall)."""
    if capacity_kwh <= 0 or power_w <= 0:
        return None
    if soc >= target:
        return 0.0
    battery_w = power_w * CHARGE_EFFICIENCY
    normal = max(0.0, min(target, TAPER_FROM_SOC) - soc)
    taper = max(0.0, target - max(soc, TAPER_FROM_SOC))
    kwh = (normal + taper * TAPER_FACTOR) / 100.0 * capacity_kwh
    return kwh * 3.6e6 / battery_w


def capacity_from_car_estimate(
    soc: float | None, limit: float | None, hours: float | None, power_w: float | None
) -> float | None:
    """Battery size implied by the car's own time-to-limit estimate (quick first guess)."""
    if soc is None or limit is None or not hours or not power_w or limit - soc < 3:
        return None
    est = hours * power_w * CHARGE_EFFICIENCY / 1000 / ((limit - soc) / 100)
    return est if LEARN_MIN_KWH <= est <= LEARN_MAX_KWH else None


@dataclass
class CapacityLearner:
    """Learn the usable battery size from energy charged vs. SoC gained."""

    learned_kwh: float | None = None
    anchor_soc: float | None = None
    energy_kwh: float = 0.0  # wall energy since the anchor
    guess_kwh: float | None = None  # first guess from the car's own estimate

    def update(self, soc: float | None, plugged: bool | None, delta_kwh: float) -> None:
        if soc is None or plugged is False:
            self.anchor_soc = None
            self.energy_kwh = 0.0
            return
        if self.anchor_soc is None or soc < self.anchor_soc:
            # Start (again): new session or the car was driven.
            self.anchor_soc = soc
            self.energy_kwh = 0.0
            return
        self.energy_kwh += max(0.0, delta_kwh)
        gained = soc - self.anchor_soc
        if gained >= LEARN_STEP_SOC:
            est = self.energy_kwh * CHARGE_EFFICIENCY / (gained / 100.0)
            if LEARN_MIN_KWH <= est <= LEARN_MAX_KWH:
                self.learned_kwh = est if self.learned_kwh is None else 0.7 * self.learned_kwh + 0.3 * est
            self.anchor_soc = soc
            self.energy_kwh = 0.0

    def to_dict(self) -> dict:
        return {
            "learned_kwh": self.learned_kwh,
            "anchor_soc": self.anchor_soc,
            "energy_kwh": self.energy_kwh,
            "guess_kwh": self.guess_kwh,
        }

    @classmethod
    def from_dict(cls, data: dict | None) -> CapacityLearner:
        data = data or {}
        return cls(data.get("learned_kwh"), data.get("anchor_soc"), float(data.get("energy_kwh") or 0.0), data.get("guess_kwh"))
