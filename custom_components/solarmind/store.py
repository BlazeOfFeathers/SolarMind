"""Persistent configuration (settings + loads) stored in Home Assistant's .storage."""

from __future__ import annotations

import copy
import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    BATTERY_MODES,
    DEFAULT_LOAD,
    DEFAULT_SETTINGS,
    LOAD_BATTERY,
    LOAD_MODES,
    MODE_SELF,
    STORAGE_KEY,
    STORAGE_VERSION,
)


def modes_for(load: dict[str, Any]) -> list[str]:
    return BATTERY_MODES if load.get("type") == LOAD_BATTERY else LOAD_MODES


def normalize_load(data: dict[str, Any], existing: dict[str, Any] | None = None) -> dict[str, Any]:
    load = copy.deepcopy(existing) if existing else copy.deepcopy(DEFAULT_LOAD)
    if not existing and data.get("type") == LOAD_BATTERY:
        load.update(mode=MODE_SELF, icon="mdi:home-battery")
    for key, value in data.items():
        if key in DEFAULT_LOAD:
            load[key] = value
    if not load.get("id"):
        load["id"] = uuid.uuid4().hex[:10]
    if load["mode"] not in modes_for(load):
        load["mode"] = MODE_SELF if load["type"] == LOAD_BATTERY else DEFAULT_LOAD["mode"]
    return load


class SolarMindStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.settings: dict[str, Any] = copy.deepcopy(DEFAULT_SETTINGS)
        self.loads: list[dict[str, Any]] = []  # order = priority
        self.runtime: dict[str, Any] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.settings = {**copy.deepcopy(DEFAULT_SETTINGS), **data.get("settings", {})}
        self.loads = [normalize_load(item) for item in data.get("loads", [])]
        for item, raw in zip(self.loads, data.get("loads", []), strict=False):
            item["id"] = raw.get("id", item["id"])
        self.runtime = data.get("runtime", {})

    def _data(self) -> dict[str, Any]:
        return {"settings": self.settings, "loads": self.loads, "runtime": self.runtime}

    async def async_save(self) -> None:
        await self._store.async_save(self._data())

    def schedule_save(self, delay: float = 30.0) -> None:
        self._store.async_delay_save(self._data, delay)

    def get_load(self, load_id: str) -> dict[str, Any] | None:
        return next((item for item in self.loads if item["id"] == load_id), None)

    async def async_update_settings(self, changes: dict[str, Any]) -> dict[str, Any]:
        for key, value in changes.items():
            if key in DEFAULT_SETTINGS:
                self.settings[key] = value
        await self.async_save()
        return self.settings

    async def async_save_load(self, data: dict[str, Any]) -> dict[str, Any]:
        existing = self.get_load(data["id"]) if data.get("id") else None
        load = normalize_load(data, existing)
        if existing:
            self.loads[self.loads.index(existing)] = load
        else:
            self.loads.append(load)
        await self.async_save()
        return load

    async def async_delete_load(self, load_id: str) -> bool:
        load = self.get_load(load_id)
        if load is None:
            return False
        self.loads.remove(load)
        self.runtime.get("loads", {}).pop(load_id, None)
        await self.async_save()
        return True

    async def async_reorder(self, order: list[str]) -> None:
        by_id = {item["id"]: item for item in self.loads}
        new = [by_id[i] for i in order if i in by_id]
        new += [item for item in self.loads if item["id"] not in order]
        self.loads = new
        await self.async_save()

    async def async_set_ev_min_power(self, load_id: str, power_w: float | None) -> None:
        load = self.get_load(load_id)
        if load:
            load["ev_min_power_w"] = power_w if power_w and power_w > 0 else None
            await self.async_save()

    async def async_set_mode(self, load_id: str, mode: str) -> None:
        load = self.get_load(load_id)
        if load and mode in modes_for(load):
            load["mode"] = mode
            await self.async_save()
