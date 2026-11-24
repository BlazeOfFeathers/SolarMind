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
            "charging_state": "Stopped", "battery_level": 55, "charge_limit_soc": 80, "minutes_to_full_charge": 90, "charge_current_request": 16, "charger_power": 0}}}},
    )
    aioclient_mock.post(f"{BASE}/command/set_charging_amps", json={"response": {"result": True}})
    aioclient_mock.post(f"{BASE}/command/charge_start", json={"response": {"result": True}})
    drv = TeslaBleProxyDriver(hass, _cfg())
    st = await drv.async_read()
    assert st.available and st.plugged and not st.is_on and st.soc == 55 and st.charge_limit == 80 and st.car_time_to_limit_h == 1.5
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


async def test_asleep_without_state_wakes_once(hass: HomeAssistant, aioclient_mock) -> None:
    """After a restart the car may sleep: wake it once to learn its state, then not again."""
    aioclient_mock.get(
        f"{BASE}/vehicle_data", params={"endpoints": "charge_state", "wakeup": "true"},
        json={"response": {"response": {"charge_state": {"charging_state": "Stopped", "battery_level": 50}}}},
    )
    aioclient_mock.get(
        f"{BASE}/vehicle_data", params={"endpoints": "charge_state"},
        status=503, json={"response": {"result": False, "reason": "vehicle is sleeping"}},
    )
    drv = TeslaBleProxyDriver(hass, _cfg())
    st = await drv.async_read()
    assert st.available and st.plugged and not st.is_on and st.soc == 50
    wake_calls = [c for c in aioclient_mock.mock_calls if "wakeup" in str(c[1])]
    assert len(wake_calls) == 1
    # Later polls while asleep keep the last state and do not wake the car again.
    drv._last_poll = 0.0
    st = await drv.async_read()
    assert st.available and st.soc == 50
    assert len([c for c in aioclient_mock.mock_calls if "wakeup" in str(c[1])]) == 1
