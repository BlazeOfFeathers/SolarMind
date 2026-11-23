"""Sensors for SolarMind."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorEntityDescription, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, UnitOfEnergy, UnitOfPower
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, REASONS
from .entity import SolarMindEntity, SolarMindLoadEntity


@dataclass(frozen=True, kw_only=True)
class SMSensorDescription(SensorEntityDescription):
    value: Callable[[dict[str, Any]], Any]


SITE_SENSORS = [
    SMSensorDescription(key="surplus", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        state_class=SensorStateClass.MEASUREMENT, value=lambda s: s.get("surplus_w")),
    SMSensorDescription(key="managed_power", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        state_class=SensorStateClass.MEASUREMENT, value=lambda s: s.get("managed_w")),
    SMSensorDescription(key="quarter_average", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        state_class=SensorStateClass.MEASUREMENT, value=lambda s: s.get("quarter_average_w")),
    SMSensorDescription(key="quarter_projected", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        state_class=SensorStateClass.MEASUREMENT, value=lambda s: s.get("quarter_projected_w")),
    SMSensorDescription(key="month_peak", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        value=lambda s: s.get("month_peak_w")),
    SMSensorDescription(key="peak_limit", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        value=lambda s: s.get("peak_limit_w")),
    SMSensorDescription(key="self_consumption_today", native_unit_of_measurement=PERCENTAGE, suggested_display_precision=0,
                        value=lambda s: _pct(s.get("today", {}), "self_consumption")),
]

LOAD_SENSORS = [
    SMSensorDescription(key="power", device_class=SensorDeviceClass.POWER, native_unit_of_measurement=UnitOfPower.WATT,
                        state_class=SensorStateClass.MEASUREMENT, value=lambda d: d.get("power_w")),
    SMSensorDescription(key="energy_today", device_class=SensorDeviceClass.ENERGY, native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
                        state_class=SensorStateClass.TOTAL_INCREASING, suggested_display_precision=2, value=lambda d: d.get("kwh_today")),
    SMSensorDescription(key="solar_energy_today", device_class=SensorDeviceClass.ENERGY, native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
                        state_class=SensorStateClass.TOTAL_INCREASING, suggested_display_precision=2, value=lambda d: d.get("solar_kwh_today")),
    SMSensorDescription(key="solar_share_today", native_unit_of_measurement=PERCENTAGE, suggested_display_precision=0,
                        value=lambda d: round(100 * d["solar_kwh_today"] / d["kwh_today"]) if d.get("kwh_today") else None),
    SMSensorDescription(key="status", device_class=SensorDeviceClass.ENUM, options=REASONS, value=lambda d: d.get("reason")),
]


def _pct(house: dict[str, Any], key: str) -> float | None:
    pv = house.get("pv_kwh", 0.0)
    if key == "self_consumption" and pv:
        return round(100 * (pv - house.get("export_kwh", 0.0)) / pv, 1)
    return None


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    coordinator = hass.data[DOMAIN][entry.entry_id]
    entities: list[SensorEntity] = [SiteSensor(coordinator, d) for d in SITE_SENSORS]
    for load in coordinator.store.loads:
        entities += [LoadSensor(coordinator, load, d) for d in LOAD_SENSORS]
    async_add_entities(entities)


class SiteSensor(SolarMindEntity, SensorEntity):
    entity_description: SMSensorDescription

    def __init__(self, coordinator, description: SMSensorDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> Any:
        return self.entity_description.value(self.site)


class LoadSensor(SolarMindLoadEntity, SensorEntity):
    entity_description: SMSensorDescription

    def __init__(self, coordinator, load: dict[str, Any], description: SMSensorDescription) -> None:
        super().__init__(coordinator, load, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> Any:
        return self.entity_description.value(self.live)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        if self.entity_description.key != "status":
            return None
        live = self.live
        return {k: live.get(k) for k in ("is_on", "allocated_w", "current_a", "target_current_a", "soc", "temperature",
                                          "plugged", "is_full", "night_needed", "night_kwh", "solar_kwh_day")}
