"""Base entities for SolarMind."""

from __future__ import annotations

from typing import Any

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, VERSION
from .coordinator import SolarMindCoordinator


class SolarMindEntity(CoordinatorEntity[SolarMindCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: SolarMindCoordinator, key: str) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"site_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, "site")},
            name="SolarMind",
            manufacturer="SolarMind",
            model="Solar surplus manager",
            sw_version=VERSION,
        )

    @property
    def site(self) -> dict[str, Any]:
        return (self.coordinator.data or {}).get("site", {})


class SolarMindLoadEntity(CoordinatorEntity[SolarMindCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: SolarMindCoordinator, load: dict[str, Any], key: str) -> None:
        super().__init__(coordinator)
        self.load_id = load["id"]
        self._attr_unique_id = f"{load['id']}_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, load["id"])},
            name=load["name"] or "SolarMind load",
            manufacturer="SolarMind",
            model="EV charger" if load["type"] == "ev" else "Switched load",
            via_device=(DOMAIN, "site"),
        )

    @property
    def cfg(self) -> dict[str, Any] | None:
        return self.coordinator.store.get_load(self.load_id)

    @property
    def live(self) -> dict[str, Any]:
        return (self.coordinator.data or {}).get("loads", {}).get(self.load_id, {})

    @property
    def available(self) -> bool:
        return super().available and self.cfg is not None
