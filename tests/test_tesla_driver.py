"""Tesla BLE HTTP proxy driver."""

import copy

from homeassistant.core import HomeAssistant

from custom_components.solarmind.const import DEFAULT_LOAD
from custom_components.solarmind.control.allocator import Decision
from custom_components.solarmind.drivers import TeslaBleProxyDriver

BASE = "http://proxy:8080/api/1/vehicles/VIN123"


def _cfg():
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(id="ev", type="ev", ev_driver="tesla_ble_proxy", ev_proxy_url="http://proxy:8080/", ev_vin="VIN123")
    return cfg


async def test_read_and_command(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(
        f"{BASE}/vehicle_data",
        json={"response": {"result": True, "response": {"charge_state": {
            "charging_state": "Stopped", "battery_level": 55, "charge_limit_soc": 80, "charge_current_request": 16, "charger_power": 0}}}},
    )
    aioclient_mock.post(f"{BASE}/command/set_charging_amps", json={"response": {"result": True}})
    aioclient_mock.post(f"{BASE}/command/charge_start", json={"response": {"result": True}})
    drv = TeslaBleProxyDriver(hass, _cfg())
    st = await drv.async_read()
    assert st.available and st.plugged and not st.is_on and st.soc == 55 and st.charge_limit == 80
    changed = await drv.async_apply(st, Decision("ev", True, current_a=8))
    assert changed
    calls = [(c[0], str(c[1])) for c in aioclient_mock.mock_calls]
    assert ("POST", f"{BASE}/command/set_charging_amps") in calls
    assert ("POST", f"{BASE}/command/charge_start") in calls
    amps_call = next(c for c in aioclient_mock.mock_calls if str(c[1]).endswith("set_charging_amps"))
    assert amps_call[2] == {"charging_amps": 8}


async def test_complete_counts_as_full(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(
        f"{BASE}/vehicle_data",
        json={"response": {"response": {"charge_state": {"charging_state": "Complete", "battery_level": 80}}}},
    )
    st = await TeslaBleProxyDriver(hass, _cfg()).async_read()
    assert st.is_on and st.power_w == 0.0


async def test_disconnected(hass: HomeAssistant, aioclient_mock) -> None:
    aioclient_mock.get(f"{BASE}/vehicle_data", json={"charge_state": {"charging_state": "Disconnected"}})
    st = await TeslaBleProxyDriver(hass, _cfg()).async_read()
    assert st.plugged is False
