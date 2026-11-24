"""Mode select per load."""

from __future__ import annotations

from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import SolarMindLoadEntity
from .store import modes_for


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    coordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(LoadModeSelect(coordinator, load) for load in coordinator.store.loads)


class LoadModeSelect(SolarMindLoadEntity, SelectEntity):
    def __init__(self, coordinator, load: dict[str, Any]) -> None:
        super().__init__(coordinator, load, "mode")
        self._attr_options = modes_for(load)

    @property
    def current_option(self) -> str | None:
        cfg = self.cfg
        return cfg["mode"] if cfg else None

    async def async_select_option(self, option: str) -> None:
        await self.coordinator.store.async_set_mode(self.load_id, option)
        await self.coordinator.async_request_refresh()
