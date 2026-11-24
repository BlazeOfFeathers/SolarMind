"""Forecast planning: use the solar still expected today to steer priorities.

Pure Python, no Home Assistant imports.

Two ideas, each switched on in the settings:

* **Car first on a sunny day.** When the sun still to come today (after a
  safety factor and what the house uses itself) is enough to fill the boilers
  later on, the car is moved ahead of the boilers in the priority order. The
  boilers then get the afternoon sun. When the forecast drops below what the
  boilers still need, the normal order comes back.
* **Wait for the sun with the minimum charging power.** In Solar mode the car
  normally always charges at its minimum power, topped up from the grid. When
  enough sun is still expected today, that grid top-up waits for the sun.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..const import LOAD_BATTERY, LOAD_EV, LOAD_SWITCH, MODE_SOLAR, MODE_SOLAR_NIGHT
from .allocator import LoadRuntime, LoadState

HYSTERESIS_KWH = 1.0  # avoid flipping the order back and forth as the forecast updates
DEFAULT_BOILER_KWH = 4.0  # assumed daily need of a boiler without a night threshold


@dataclass
class ForecastPlan:
    remaining_kwh: float | None = None  # sun still expected today (raw forecast)
    usable_kwh: float | None = None  # after the safety factor and the house's own use
    boiler_need_kwh: float = 0.0  # what the boilers still want from the sun today
    ev_first: bool = False
    ev_floor_paused: bool = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "remaining_kwh": None if self.remaining_kwh is None else round(self.remaining_kwh, 2),
            "usable_kwh": None if self.usable_kwh is None else round(self.usable_kwh, 2),
            "boiler_need_kwh": round(self.boiler_need_kwh, 2),
            "ev_first": self.ev_first,
            "ev_floor_paused": self.ev_floor_paused,
        }


def remaining_today(remaining_entity_kwh: float | None, today_kwh: float | None, produced_kwh: float | None) -> float | None:
    """Sun still expected today: the remaining-today sensor, else forecast today minus produced so far."""
    if remaining_entity_kwh is not None:
        return max(0.0, remaining_entity_kwh)
    if today_kwh is not None and produced_kwh is not None:
        return max(0.0, today_kwh - produced_kwh)
    return None


def _solar_mode(cfg: dict[str, Any]) -> bool:
    return cfg.get("enabled", True) and cfg.get("mode") in (MODE_SOLAR, MODE_SOLAR_NIGHT)


def boiler_need_kwh(loads: list[dict[str, Any]], states: dict[str, LoadState], runtimes: dict[str, LoadRuntime]) -> float:
    """Energy the on/off loads in a solar mode still want from the sun today."""
    total = 0.0
    for cfg in loads:
        if cfg["type"] != LOAD_SWITCH or not _solar_mode(cfg):
            continue
        st = states.get(cfg["id"])
        rt = runtimes.get(cfg["id"]) or LoadRuntime()
        if st is None or not st.available or rt.is_full:
            continue
        max_t = cfg.get("max_temperature")
        if max_t is not None and st.temperature is not None and st.temperature >= max_t:
            continue
        want = cfg.get("night_min_solar_kwh") or DEFAULT_BOILER_KWH
        total += max(0.0, float(want) - rt.solar_kwh_day)
    return total


def make_plan(
    settings: dict[str, Any],
    loads: list[dict[str, Any]],
    states: dict[str, LoadState],
    runtimes: dict[str, LoadRuntime],
    remaining_kwh: float | None,
    in_night: bool,
    previous: ForecastPlan | None = None,
) -> ForecastPlan:
    plan = ForecastPlan(remaining_kwh=remaining_kwh, boiler_need_kwh=boiler_need_kwh(loads, states, runtimes))
    if remaining_kwh is None:
        return plan
    factor = max(0.0, float(settings.get("forecast_factor_pct", 80))) / 100
    house = max(0.0, float(settings.get("forecast_house_kwh", 3.0) or 0))
    plan.usable_kwh = max(0.0, remaining_kwh * factor - house)
    if in_night:
        return plan

    has_ev = any(c["type"] == LOAD_EV and _solar_mode(c) for c in loads)
    if settings.get("forecast_ev_priority") and has_ev and plan.boiler_need_kwh > 0:
        margin = -HYSTERESIS_KWH if previous and previous.ev_first else 0.0
        plan.ev_first = plan.usable_kwh >= plan.boiler_need_kwh + margin

    if settings.get("forecast_ev_floor_pause"):
        need = max(0.0, float(settings.get("forecast_ev_floor_kwh", 5.0) or 0))
        margin = -HYSTERESIS_KWH if previous and previous.ev_floor_paused else 0.0
        plan.ev_floor_paused = plan.usable_kwh >= need + margin
    return plan


def apply_order(loads: list[dict[str, Any]], plan: ForecastPlan) -> list[dict[str, Any]]:
    """Priority order for this cycle: with ``ev_first`` the cars in a solar mode go before
    the on/off loads. Batteries and everything else keep their place."""
    if not plan.ev_first:
        return loads
    slots = [i for i, c in enumerate(loads) if c["type"] != LOAD_BATTERY]
    movable = [loads[i] for i in slots]
    cars = [c for c in movable if c["type"] == LOAD_EV and _solar_mode(c)]
    rest = [c for c in movable if not (c["type"] == LOAD_EV and _solar_mode(c))]
    out = list(loads)
    for i, cfg in zip(slots, cars + rest, strict=True):
        out[i] = cfg
    return out
