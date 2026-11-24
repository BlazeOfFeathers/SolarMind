"""End-to-end test: set up the integration, add loads over websocket, run the loop."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service

from custom_components.solarmind.const import DOMAIN


async def _setup(hass: HomeAssistant):
    hass.states.async_set("sensor.grid", "-2500", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.pv", "4000", {"unit_of_measurement": "W"})
    hass.states.async_set("switch.boiler1", "off")
    hass.states.async_set("switch.boiler2", "off")
    entry = MockConfigEntry(domain=DOMAIN, data={}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    with patch("custom_components.solarmind._async_register_panel"):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


async def test_full_flow(hass: HomeAssistant, hass_ws_client) -> None:
    await async_setup_component(hass, "http", {})
    await async_setup_component(hass, "websocket_api", {})
    hass.config.components.add("frontend")  # the real frontend needs hass_frontend, not installed in tests
    with patch("custom_components.solarmind._async_register_panel"):
        entry = await _setup(hass)
        turn_on = async_mock_service(hass, "switch", "turn_on")
        client = await hass_ws_client(hass)

        await client.send_json({"id": 1, "type": "solarmind/settings/save",
                                "settings": {"grid_power_entity": "sensor.grid", "pv_power_entity": "sensor.pv"}})
        assert (await client.receive_json())["success"]

        for i, ent in enumerate(["switch.boiler1", "switch.boiler2"], start=2):
            await client.send_json({"id": i, "type": "solarmind/loads/save",
                                    "load": {"name": f"Boiler {i - 1}", "switch_entity": ent, "nominal_power_w": 2000,
                                             "start_delay_s": 0, "min_off_s": 0}})
            res = await client.receive_json()
            assert res["success"], res
            await hass.async_block_till_done()

        await client.send_json({"id": 10, "type": "solarmind/config"})
        cfg = (await client.receive_json())["result"]
        assert [item["name"] for item in cfg["loads"]] == ["Boiler 1", "Boiler 2"]

        coordinator = hass.data[DOMAIN][entry.entry_id]
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        # 2500 W surplus: only the first boiler (priority 1) is switched on.
        assert {c.data["entity_id"] for c in turn_on} == {"switch.boiler1"}

        # Reorder: boiler 2 first.
        ids = [item["id"] for item in cfg["loads"]]
        await client.send_json({"id": 11, "type": "solarmind/loads/reorder", "order": list(reversed(ids))})
        assert (await client.receive_json())["success"]

        mode_entity = [s.entity_id for s in hass.states.async_all("select")]
        assert len(mode_entity) == 2
        assert hass.states.get("switch.solarmind_control_enabled") is not None

        await client.send_json({"id": 12, "type": "solarmind/analytics"})
        res = await client.receive_json()
        assert res["success"]
        assert "summary" in res["result"]

        await client.send_json({"id": 14, "type": "solarmind/loads/set_ev_min_power", "load_id": ids[0], "power_w": 2070})
        assert (await client.receive_json())["success"]
        assert coordinator.store.get_load(ids[0])["ev_min_power_w"] == 2070
        await client.send_json({"id": 15, "type": "solarmind/loads/set_ev_min_power", "load_id": ids[0], "power_w": None})
        assert (await client.receive_json())["success"]
        assert coordinator.store.get_load(ids[0])["ev_min_power_w"] is None

        await client.send_json({"id": 16, "type": "solarmind/loads/delete", "load_id": ids[1]})
        assert (await client.receive_json())["result"]["deleted"]
        await hass.async_block_till_done()
        assert len(hass.states.async_all("select")) == 1
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=30))
        await hass.async_block_till_done()


def test_versions_match():
    import json
    from pathlib import Path

    from custom_components.solarmind.const import VERSION

    manifest = json.loads((Path(__file__).parents[1] / "custom_components/solarmind/manifest.json").read_text())
    assert manifest["version"] == VERSION


async def test_battery_flow(hass: HomeAssistant, hass_ws_client) -> None:
    """Battery charges on surplus, covers the house at night, and is released when disabled."""
    await async_setup_component(hass, "http", {})
    await async_setup_component(hass, "websocket_api", {})
    hass.config.components.add("frontend")
    with patch("custom_components.solarmind._async_register_panel"):
        entry = await _setup(hass)
        set_value = async_mock_service(hass, "number", "set_value")
        select_option = async_mock_service(hass, "select", "select_option")
        hass.states.async_set("sensor.bat_soc", "50", {"unit_of_measurement": "%"})
        hass.states.async_set("sensor.bat_power", "0", {"unit_of_measurement": "W"})
        hass.states.async_set("number.bat_setpoint", "0", {"unit_of_measurement": "kW", "min": -5, "max": 5})
        hass.states.async_set("select.bat_mode", "auto")
        client = await hass_ws_client(hass)
        await client.send_json({"id": 1, "type": "solarmind/settings/save", "settings": {"grid_power_entity": "sensor.grid"}})
        assert (await client.receive_json())["success"]
        await client.send_json({"id": 2, "type": "solarmind/loads/save", "load": {
            "name": "Batterij", "type": "battery", "bat_soc_entity": "sensor.bat_soc", "bat_power_entity": "sensor.bat_power",
            "bat_setpoint_entity": "number.bat_setpoint", "bat_mode_entity": "select.bat_mode",
            "bat_mode_remote_option": "remote", "bat_mode_auto_option": "auto"}})
        res = await client.receive_json()
        assert res["success"], res
        load = res["result"]["load"]
        assert load["mode"] == "self"
        await hass.async_block_till_done()
        assert hass.states.get("select.batterij_mode").attributes["options"] == ["self", "solar", "solar_night", "on", "off"]

        coordinator = hass.data[DOMAIN][entry.entry_id]
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        # 2500 W surplus, setpoint entity in kW.
        assert select_option[-1].data == {"entity_id": "select.bat_mode", "option": "remote"}
        assert set_value[-1].data == {"entity_id": "number.bat_setpoint", "value": 2.5}
        assert coordinator.live["loads"][load["id"]]["reason"] == "solar"

        # Evening: house imports 700 W, battery covers it.
        hass.states.async_set("sensor.grid", "700", {"unit_of_measurement": "W"})
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        assert set_value[-1].data["value"] == -0.7
        assert coordinator.live["loads"][load["id"]]["reason"] == "self_consumption"

        # Disabled: handed back to the inverter.
        await client.send_json({"id": 3, "type": "solarmind/loads/save", "load": {**load, "enabled": False}})
        assert (await client.receive_json())["success"]
        hass.states.async_set("select.bat_mode", "remote")
        coordinator.rebuild_drivers()
        coordinator.drivers[load["id"]]._remote = True
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        assert select_option[-1].data == {"entity_id": "select.bat_mode", "option": "auto"}


async def test_logs_ws(hass: HomeAssistant, hass_ws_client) -> None:
    """SolarMind's own log lines are buffered and served to the panel."""
    import logging

    await async_setup_component(hass, "http", {})
    await async_setup_component(hass, "websocket_api", {})
    hass.config.components.add("frontend")
    await _setup(hass)
    client = await hass_ws_client(hass)

    logging.getLogger("custom_components.solarmind.drivers").warning("test warning %s", 42)
    logging.getLogger("homeassistant.other").warning("not ours")
    logging.getLogger("custom_components.solarmind.coordinator").debug("hidden debug")

    await client.send_json({"id": 1, "type": "solarmind/logs"})
    res = (await client.receive_json())["result"]
    msgs = [e["message"] for e in res["entries"]]
    assert "test warning 42" in msgs
    assert "not ours" not in msgs
    assert "hidden debug" not in msgs
    assert res["entries"][-1]["source"] == "drivers"

    await client.send_json({"id": 2, "type": "solarmind/logs/verbose", "enabled": True})
    assert (await client.receive_json())["result"]["verbose"]
    logging.getLogger("custom_components.solarmind.coordinator").debug("shown debug")
    await client.send_json({"id": 3, "type": "solarmind/logs/verbose", "enabled": False})
    res = (await client.receive_json())["result"]
    assert "shown debug" in [e["message"] for e in res["entries"]]

    await client.send_json({"id": 4, "type": "solarmind/logs/clear"})
    assert (await client.receive_json())["result"]["entries"] == []


async def test_planner_runs_and_serves_the_plan(hass: HomeAssistant, hass_ws_client) -> None:
    await async_setup_component(hass, "http", {})
    await async_setup_component(hass, "websocket_api", {})
    hass.config.components.add("frontend")
    start = dt_util.now().replace(hour=12, minute=0, second=0, microsecond=0)
    hass.states.async_set("sensor.solcast_today", "20", {"detailedForecast": [
        {"period_start": (start + timedelta(minutes=30 * i)).isoformat(), "pv_estimate": 3.0} for i in range(8)
    ]})
    with patch("custom_components.solarmind._async_register_panel"):
        entry = await _setup(hass)
        client = await hass_ws_client(hass)
        await client.send_json({"id": 1, "type": "solarmind/settings/save", "settings": {
            "grid_power_entity": "sensor.grid", "plan_enabled": True, "pv_forecast_today_entity": "sensor.solcast_today",
        }})
        assert (await client.receive_json())["success"]
        await client.send_json({"id": 2, "type": "solarmind/loads/save", "load": {
            "name": "Boiler", "switch_entity": "switch.boiler1", "mode": "solar_night", "plan_need_kwh": 3.0}})
        load_id = (await client.receive_json())["result"]["load"]["id"]
        coordinator = hass.data[DOMAIN][entry.entry_id]
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        await client.send_json({"id": 3, "type": "solarmind/plan"})
        res = (await client.receive_json())["result"]
        assert res["enabled"] is True
        assert res["plan"]["loads"][load_id]["need_kwh"] == 3.0
        assert len(res["plan"]["slots"]) == 36 * 4
        assert res["info"]["pv_source"].startswith("detailed")
        assert coordinator.live["site"]["plan"]["loads"][load_id]["grid_planned"] is True


async def test_plan_is_shown_in_trial_mode_but_does_not_steer(hass: HomeAssistant, hass_ws_client) -> None:
    await async_setup_component(hass, "http", {})
    await async_setup_component(hass, "websocket_api", {})
    hass.config.components.add("frontend")
    with patch("custom_components.solarmind._async_register_panel"):
        entry = await _setup(hass)
        client = await hass_ws_client(hass)
        await client.send_json({"id": 1, "type": "solarmind/settings/save", "settings": {
            "grid_power_entity": "sensor.grid", "night_start": "00:00", "night_end": "23:59"}})
        assert (await client.receive_json())["success"]
        await client.send_json({"id": 2, "type": "solarmind/loads/save", "load": {
            "name": "Boiler", "switch_entity": "switch.boiler1", "mode": "solar_night", "plan_need_kwh": 3.0}})
        load_id = (await client.receive_json())["result"]["load"]["id"]
        coordinator = hass.data[DOMAIN][entry.entry_id]
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        await client.send_json({"id": 3, "type": "solarmind/plan"})
        res = (await client.receive_json())["result"]
        assert res["enabled"] is False
        assert res["plan"]["loads"][load_id]["grid_kwh"] > 0  # what it would do
        assert coordinator.live["site"]["plan"]["active"] is False
        assert coordinator.planning.controls(coordinator.store.settings, 0) == {}
        assert coordinator.live["loads"][load_id]["reason"] not in ("planned", "plan_wait")
