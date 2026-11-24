"""Notification edge detection."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.solarmind.notifier import (
    FAULT_DEBOUNCE_S,
    NotificationTracker,
    async_send,
    notify_targets,
)

LOADS = [
    {"id": "b1", "name": "Boiler", "type": "switch", "enabled": True},
    {"id": "ev", "name": "Frank", "type": "ev", "enabled": True},
]
SETTINGS = {"notify_peak": True, "notify_ev": True, "notify_faults": True}


def live(b1=None, ev=None, site=None):
    base = {"available": True, "reason": "solar"}
    return {
        "site": {"available": True, "peak_limit_w": 2500, **(site or {})},
        "loads": {"b1": {**base, **(b1 or {})}, "ev": {**base, **(ev or {})}},
    }


def test_peak_shed_and_clear():
    tr = NotificationTracker()
    assert tr.update(0, live(), LOADS, SETTINGS) == []  # first snapshot only primes
    msgs = tr.update(10, live(b1={"reason": "peak_guard"}), LOADS, SETTINGS)
    assert len(msgs) == 1 and msgs[0].kind == "peak" and "Boiler" in msgs[0].message and "2,5 kW" in msgs[0].message
    assert tr.update(20, live(b1={"reason": "peak_guard"}), LOADS, SETTINGS) == []  # no repeat
    msgs = tr.update(30, live(), LOADS, SETTINGS)
    assert len(msgs) == 1 and "mag weer" in msgs[0].message


def test_peak_disabled_setting():
    tr = NotificationTracker()
    tr.update(0, live(), LOADS, SETTINGS)
    assert tr.update(10, live(b1={"reason": "peak_guard"}), LOADS, {**SETTINGS, "notify_peak": False}) == []


def test_ev_refused_and_complete():
    tr = NotificationTracker()
    tr.update(0, live(ev={"car_state": "Charging"}), LOADS, SETTINGS)
    msgs = tr.update(10, live(ev={"car_state": "Stopped", "driver_error": "charge_start: no power"}), LOADS, SETTINGS)
    assert [m.kind for m in msgs] == ["ev"] and "no power" in msgs[0].message and msgs[0].title == "Frank"
    # same error again: no new message
    assert tr.update(20, live(ev={"car_state": "Stopped", "driver_error": "charge_start: no power"}), LOADS, SETTINGS) == []
    tr.update(30, live(ev={"car_state": "Charging"}), LOADS, SETTINGS)
    msgs = tr.update(40, live(ev={"car_state": "Complete", "soc": 80}), LOADS, SETTINGS)
    assert len(msgs) == 1 and "80%" in msgs[0].message


def test_fault_debounced_and_recovery():
    tr = NotificationTracker()
    tr.update(0, live(), LOADS, SETTINGS)
    down = live(b1={"available": False, "reason": "unavailable"})
    assert tr.update(10, down, LOADS, SETTINGS) == []
    msgs = tr.update(10 + FAULT_DEBOUNCE_S, down, LOADS, SETTINGS)
    assert len(msgs) == 1 and "Boiler" in msgs[0].message
    assert tr.update(20 + FAULT_DEBOUNCE_S, down, LOADS, SETTINGS) == []
    msgs = tr.update(30 + FAULT_DEBOUNCE_S, live(), LOADS, SETTINGS)
    assert len(msgs) == 1 and "weer bereikbaar" in msgs[0].message


def test_short_glitch_is_ignored():
    tr = NotificationTracker()
    tr.update(0, live(), LOADS, SETTINGS)
    tr.update(10, live(site={"available": False}), LOADS, SETTINGS)
    assert tr.update(60, live(), LOADS, SETTINGS) == []


def test_notify_targets():
    assert notify_targets({"notify_services": ["notify.mobile_app_x", "persistent"]}) == ["mobile_app_x", "persistent"]
    assert notify_targets({}) == []


async def test_async_send(hass: HomeAssistant) -> None:
    calls = []
    hass.services.async_register("notify", "mobile_app_phone", lambda call: calls.append(call.data))
    tr = NotificationTracker()
    await async_send(hass, {"notify_services": ["notify.mobile_app_phone", "notify.missing"]}, [tr.test_message()])
    await hass.async_block_till_done()
    assert calls and calls[0]["data"]["tag"] == "solarmind_test"
