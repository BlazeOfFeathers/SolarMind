"""Websocket API used by the SolarMind panel."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

from .const import (
    BATTERY_MODES,
    DEFAULT_LOAD,
    DEFAULT_SETTINGS,
    DOMAIN,
    LOAD_MODES,
    LOAD_TYPES,
    MODES,
    REASONS,
    VERSION,
)
from .history import day_key, rhythm, summarize
from .logbuffer import async_get_log_buffer


def _coord(hass: HomeAssistant):
    return hass.data.get(DOMAIN, {}).get("coordinator")


def _not_ready(connection, msg) -> None:
    connection.send_error(msg["id"], "not_ready", "SolarMind is not set up yet")


def _config_payload(coordinator) -> dict[str, Any]:
    return {
        "version": VERSION,
        "settings": coordinator.store.settings,
        "loads": coordinator.store.loads,
        "defaults": {"load": DEFAULT_LOAD, "settings": DEFAULT_SETTINGS},
        "modes": MODES,
        "load_modes": LOAD_MODES,
        "battery_modes": BATTERY_MODES,
        "load_types": LOAD_TYPES,
        "reasons": REASONS,
        "live": coordinator.live,
    }


@websocket_api.websocket_command({vol.Required("type"): "solarmind/config"})
@websocket_api.require_admin
@callback
def ws_config(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    connection.send_result(msg["id"], _config_payload(coordinator))


@websocket_api.websocket_command({vol.Required("type"): "solarmind/subscribe"})
@websocket_api.require_admin
@callback
def ws_subscribe(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)

    @callback
    def _send(live: dict[str, Any]) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], live))

    connection.subscriptions[msg["id"]] = coordinator.add_ws_listener(_send)
    connection.send_result(msg["id"])
    _send(coordinator.live)


@websocket_api.websocket_command(
    {vol.Required("type"): "solarmind/settings/save", vol.Required("settings"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_settings_save(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    settings = await coordinator.store.async_update_settings(msg["settings"])
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], {"settings": settings})


@websocket_api.websocket_command({vol.Required("type"): "solarmind/loads/save", vol.Required("load"): dict})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_load_save(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    data = msg["load"]
    if data.get("type", DEFAULT_LOAD["type"]) not in LOAD_TYPES:
        connection.send_error(msg["id"], "invalid", "Unknown load type")
        return
    existing = coordinator.store.get_load(data["id"]) if data.get("id") else None
    old_name = existing["name"] if existing else None
    load = await coordinator.store.async_save_load(data)
    connection.send_result(msg["id"], {"load": load})
    if existing is None or old_name != load["name"]:
        # New load or renamed: entities change, reload the integration.
        await hass.config_entries.async_reload(coordinator.entry.entry_id)
    else:
        coordinator.rebuild_drivers()
        await coordinator.async_request_refresh()


@websocket_api.websocket_command({vol.Required("type"): "solarmind/loads/delete", vol.Required("load_id"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_load_delete(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    ok = await coordinator.store.async_delete_load(msg["load_id"])
    if ok:
        coordinator.remove_load_history(msg["load_id"])
        from homeassistant.helpers import entity_registry as er

        reg = er.async_get(hass)
        for ent in list(er.async_entries_for_config_entry(reg, coordinator.entry.entry_id)):
            if ent.unique_id.startswith(f"{msg['load_id']}_"):
                reg.async_remove(ent.entity_id)
    connection.send_result(msg["id"], {"deleted": ok})
    if ok:
        await hass.config_entries.async_reload(coordinator.entry.entry_id)


@websocket_api.websocket_command(
    {vol.Required("type"): "solarmind/loads/reorder", vol.Required("order"): [str]}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_load_reorder(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    await coordinator.store.async_reorder(msg["order"])
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], {"order": [item["id"] for item in coordinator.store.loads]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "solarmind/loads/set_mode",
        vol.Required("load_id"): str,
        vol.Required("mode"): vol.In(MODES),  # checked per load type in the store
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_load_set_mode(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    await coordinator.store.async_set_mode(msg["load_id"], msg["mode"])
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "solarmind/loads/set_ev_min_power",
        vol.Required("load_id"): str,
        vol.Required("power_w"): vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=50000))),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_load_set_ev_min_power(hass: HomeAssistant, connection, msg) -> None:
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    await coordinator.store.async_set_ev_min_power(msg["load_id"], msg["power_w"])
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): "solarmind/notify/test"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_notify_test(hass: HomeAssistant, connection, msg) -> None:
    from .notifier import async_send, notify_targets

    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    settings = coordinator.store.settings
    targets = notify_targets(settings)
    if not targets:
        connection.send_error(msg["id"], "no_target", "No notification service selected")
        return
    await async_send(hass, settings, [coordinator.notifier.test_message()])
    connection.send_result(msg["id"], {"sent_to": targets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "solarmind/analytics",
        vol.Optional("load_id"): vol.Any(str, None),
        vol.Optional("start"): vol.Coerce(float),
        vol.Optional("end"): vol.Coerce(float),
    }
)
@websocket_api.require_admin
@callback
def ws_analytics(hass: HomeAssistant, connection, msg) -> None:
    """Timeline (minute rows), daily totals, summary, quarters, sessions and rhythm."""
    coordinator = _coord(hass)
    if coordinator is None:
        return _not_ready(connection, msg)
    now = dt_util.now()
    end_ts = msg.get("end") or now.timestamp()
    start_ts = msg.get("start") or (dt_util.start_of_local_day(now).timestamp())
    start_local = dt_util.as_local(dt_util.utc_from_timestamp(start_ts))
    end_local = dt_util.as_local(dt_util.utc_from_timestamp(end_ts - 1))
    sk, ek = day_key(start_local), day_key(end_local)
    hist = coordinator.history
    settings = coordinator.store.settings
    load_id = msg.get("load_id")
    days = hist.day_totals(sk, ek)
    # Limit the timeline to at most 14 days of minute data.
    tl_start = max(start_ts, end_ts - 14 * 86400)
    payload: dict[str, Any] = {
        "start": start_ts,
        "end": end_ts,
        "timeline": hist.timeline(tl_start, end_ts, load_id),
        "days": days,
        "summary": summarize(days, settings.get("price_import", 0.3), settings.get("price_export", 0.04)),
        "quarters": hist.quarter_rows(sk, ek),
        "sessions": [s for s in hist.load_sessions(load_id) if (s.get("end") or end_ts) >= start_ts and s["start"] <= end_ts],
        "rhythm": {},
    }
    rh_start = day_key(now - timedelta(days=13))
    for cfg in coordinator.store.loads:
        if load_id is None or cfg["id"] == load_id:
            payload["rhythm"][cfg["id"]] = rhythm(hist.samples, cfg["id"], rh_start, day_key(now), dt_util.get_default_time_zone())
    connection.send_result(msg["id"], payload)


def _logs_payload(hass: HomeAssistant) -> dict[str, Any]:
    buffer = async_get_log_buffer(hass.data.setdefault(DOMAIN, {}))
    return {"entries": list(buffer.entries), "verbose": buffer.verbose, "max": buffer.entries.maxlen}


@websocket_api.websocket_command({vol.Required("type"): "solarmind/logs"})
@websocket_api.require_admin
@callback
def ws_logs(hass: HomeAssistant, connection, msg) -> None:
    connection.send_result(msg["id"], _logs_payload(hass))


@websocket_api.websocket_command({vol.Required("type"): "solarmind/logs/clear"})
@websocket_api.require_admin
@callback
def ws_logs_clear(hass: HomeAssistant, connection, msg) -> None:
    async_get_log_buffer(hass.data.setdefault(DOMAIN, {})).clear()
    connection.send_result(msg["id"], _logs_payload(hass))


@websocket_api.websocket_command({vol.Required("type"): "solarmind/logs/verbose", vol.Required("enabled"): bool})
@websocket_api.require_admin
@callback
def ws_logs_verbose(hass: HomeAssistant, connection, msg) -> None:
    async_get_log_buffer(hass.data.setdefault(DOMAIN, {})).set_verbose(msg["enabled"])
    connection.send_result(msg["id"], _logs_payload(hass))


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    data = hass.data.setdefault(DOMAIN, {})
    if data.get("ws_registered"):
        return
    for handler in (
        ws_config,
        ws_subscribe,
        ws_settings_save,
        ws_load_save,
        ws_load_delete,
        ws_notify_test,
        ws_load_set_ev_min_power,
        ws_load_reorder,
        ws_load_set_mode,
        ws_analytics,
        ws_logs,
        ws_logs_clear,
        ws_logs_verbose,
    ):
        websocket_api.async_register_command(hass, handler)
    data["ws_registered"] = True
