"""SolarMind: solar surplus management for Home Assistant."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel, async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PLATFORMS, VERSION
from .coordinator import SolarMindCoordinator
from .store import SolarMindStore
from .websocket_api import async_register_websocket_commands

_LOGGER = logging.getLogger(__name__)

PANEL_URL = "solarmind"
PANEL_JS = "solarmind-panel.js"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    hass.data.setdefault(DOMAIN, {})
    async_register_websocket_commands(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(DOMAIN, {})
    if not hass.data[DOMAIN].get("ws_registered"):
        async_register_websocket_commands(hass)
    store = SolarMindStore(hass)
    await store.async_load()
    coordinator = SolarMindCoordinator(hass, entry, store)
    await coordinator.async_setup()
    await coordinator.async_config_entry_first_refresh()
    hass.data[DOMAIN]["coordinator"] = coordinator
    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await _async_register_panel(hass)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    coordinator: SolarMindCoordinator | None = hass.data[DOMAIN].get(entry.entry_id)
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if coordinator is not None:
        await coordinator.async_shutdown_save()
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        hass.data[DOMAIN].pop("coordinator", None)
    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    if hass.data.get(DOMAIN, {}).get("panel_registered"):
        async_remove_panel(hass, PANEL_URL)
        hass.data[DOMAIN]["panel_registered"] = False


async def _async_register_panel(hass: HomeAssistant) -> None:
    if hass.data[DOMAIN].get("panel_registered"):
        return
    panel_js = Path(__file__).parent / "frontend" / PANEL_JS
    if not panel_js.exists():
        _LOGGER.warning("SolarMind panel not found at %s", panel_js)
        return
    try:
        await hass.http.async_register_static_paths([StaticPathConfig(f"/{PANEL_URL}/{PANEL_JS}", str(panel_js), False)])
    except RuntimeError:
        _LOGGER.debug("SolarMind static path already registered")
    try:
        async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="SolarMind",
            sidebar_icon="mdi:solar-power-variant",
            frontend_url_path=PANEL_URL,
            require_admin=True,
            config={
                "_panel_custom": {
                    "name": "solarmind-panel",
                    "embed_iframe": False,
                    "trust_external": False,
                    # Version + file time: a new download always busts the browser cache.
                    "module_url": f"/{PANEL_URL}/{PANEL_JS}?v={VERSION}-{int(panel_js.stat().st_mtime)}",
                }
            },
        )
    except ValueError:
        _LOGGER.debug("SolarMind panel already registered")
    hass.data[DOMAIN]["panel_registered"] = True
