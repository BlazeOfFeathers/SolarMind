"""Running / night needed binary sensors."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import SolarMindEntity, SolarMindLoadEntity


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    coordinator = hass.data[DOMAIN][entry.entry_id]
    entities: list[BinarySensorEntity] = [PeakGuardActive(coordinator)]
    entities += [LoadRunning(coordinator, load) for load in coordinator.store.loads]
    async_add_entities(entities)


class LoadRunning(SolarMindLoadEntity, BinarySensorEntity):
    _attr_device_class = BinarySensorDeviceClass.RUNNING

    def __init__(self, coordinator, load: dict[str, Any]) -> None:
        super().__init__(coordinator, load, "running")

    @property
    def is_on(self) -> bool | None:
        live = self.live
        if not live:
            return None
        return bool(live.get("is_on")) and (live.get("power_w") or 0) > 1


class PeakGuardActive(SolarMindEntity, BinarySensorEntity):
    _attr_icon = "mdi:transmission-tower-export"

    def __init__(self, coordinator) -> None:
        super().__init__(coordinator, "peak_guard_active")

    @property
    def is_on(self) -> bool:
        loads = (self.coordinator.data or {}).get("loads", {})
        return any(item.get("reason") == "peak_guard" for item in loads.values())
