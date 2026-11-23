"""Master switch and per-load enable switch."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import SolarMindEntity, SolarMindLoadEntity


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    coordinator = hass.data[DOMAIN][entry.entry_id]
    entities: list[SwitchEntity] = [MasterSwitch(coordinator)]
    entities += [LoadEnabledSwitch(coordinator, load) for load in coordinator.store.loads]
    async_add_entities(entities)


class MasterSwitch(SolarMindEntity, SwitchEntity):
    _attr_icon = "mdi:solar-power-variant"

    def __init__(self, coordinator) -> None:
        super().__init__(coordinator, "control_enabled")

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.store.settings.get("enabled", True))

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.coordinator.store.async_update_settings({"enabled": True})
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.store.async_update_settings({"enabled": False})
        await self.coordinator.async_request_refresh()


class LoadEnabledSwitch(SolarMindLoadEntity, SwitchEntity):
    def __init__(self, coordinator, load: dict[str, Any]) -> None:
        super().__init__(coordinator, load, "load_enabled")

    @property
    def is_on(self) -> bool | None:
        cfg = self.cfg
        return bool(cfg.get("enabled", True)) if cfg else None

    async def _set(self, value: bool) -> None:
        cfg = self.cfg
        if cfg is None:
            return
        await self.coordinator.store.async_save_load({**cfg, "enabled": value})
        self.coordinator.rebuild_drivers()
        await self.coordinator.async_request_refresh()

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._set(False)
