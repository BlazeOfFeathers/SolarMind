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
