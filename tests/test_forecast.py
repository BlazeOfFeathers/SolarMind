"""Tests for forecast planning (car first on sunny days, minimum power waits for the sun)."""

from __future__ import annotations

from custom_components.solarmind.const import DEFAULT_SETTINGS, MODE_OFF, R_MIN_POWER, R_SOLAR, R_WAIT_SUN
from custom_components.solarmind.control.allocator import LoadRuntime, LoadState, SiteState, allocate
from custom_components.solarmind.control.forecast import apply_order, boiler_need_kwh, make_plan, remaining_today

from .test_allocator import boiler, ev


def settings(**kw):
    s = dict(DEFAULT_SETTINGS)
    s.update(forecast_ev_priority=True, forecast_ev_floor_pause=True, forecast_factor_pct=100, forecast_house_kwh=0)
    s.update(kw)
    return s


def setup():
    loads = [boiler("b1", night_min_solar_kwh=4.0), boiler("b2", night_min_solar_kwh=4.0), ev("car")]
    states = {"b1": LoadState(), "b2": LoadState(), "car": LoadState(plugged=True, soc=50)}
    runtimes = {"b1": LoadRuntime(solar_kwh_day=1.0), "b2": LoadRuntime(solar_kwh_day=0.0), "car": LoadRuntime()}
    return loads, states, runtimes


def test_remaining_prefers_sensor_then_today_minus_produced():
    assert remaining_today(7.5, 20, 3) == 7.5
    assert remaining_today(None, 20, 3) == 17
    assert remaining_today(None, 20, 25) == 0
    assert remaining_today(None, None, 3) is None


def test_boiler_need_counts_what_is_left():
    loads, states, runtimes = setup()
    assert boiler_need_kwh(loads, states, runtimes) == 7.0
    runtimes["b1"].is_full = True
    assert boiler_need_kwh(loads, states, runtimes) == 4.0
    loads[1]["mode"] = MODE_OFF
    assert boiler_need_kwh(loads, states, runtimes) == 0.0


def test_car_first_when_sun_covers_boilers():
    loads, states, runtimes = setup()
    plan = make_plan(settings(), loads, states, runtimes, remaining_kwh=10, in_night=False)
    assert plan.ev_first
    assert [c["id"] for c in apply_order(loads, plan)] == ["car", "b1", "b2"]
    plan = make_plan(settings(), loads, states, runtimes, remaining_kwh=6, in_night=False)
    assert not plan.ev_first
    assert apply_order(loads, plan) is loads


def test_factor_and_house_use_reduce_usable_sun():
    loads, states, runtimes = setup()
    plan = make_plan(settings(forecast_factor_pct=80, forecast_house_kwh=2), loads, states, runtimes, 10, False)
    assert plan.usable_kwh == 6.0
    assert not plan.ev_first


def test_hysteresis_keeps_car_first_until_clearly_short():
    loads, states, runtimes = setup()
    prev = make_plan(settings(), loads, states, runtimes, 8, False)
    assert prev.ev_first
    assert make_plan(settings(), loads, states, runtimes, 6.5, False, prev).ev_first
    assert not make_plan(settings(), loads, states, runtimes, 5.5, False, prev).ev_first


def test_nothing_planned_at_night_or_when_disabled():
    loads, states, runtimes = setup()
    assert not make_plan(settings(), loads, states, runtimes, 30, True).ev_first
    off = settings(forecast_ev_priority=False, forecast_ev_floor_pause=False)
    plan = make_plan(off, loads, states, runtimes, 30, False)
    assert not plan.ev_first and not plan.ev_floor_paused


def test_battery_keeps_its_place():
    loads, states, runtimes = setup()
    bat = boiler("bat", type="battery")
    loads.insert(1, bat)
    plan = make_plan(settings(), loads, states, runtimes, 20, False)
    assert [c["id"] for c in apply_order(loads, plan)] == ["car", "bat", "b1", "b2"]


def test_car_first_takes_the_surplus():
    loads, states, runtimes = setup()
    plan = make_plan(settings(), loads, states, runtimes, 20, False)
    site = SiteState(now=100000.0, grid_w=-2500)
    res = allocate(site, apply_order(loads, plan), states, runtimes)
    by_id = {d.load_id: d for d in res.decisions}
    assert by_id["car"].reason == R_SOLAR and by_id["car"].current_a == 10
    assert not by_id["b1"].on


def test_min_power_waits_for_the_sun():
    car = ev(ev_min_power_w=2000)
    states = {"ev": LoadState(plugged=True, soc=40)}
    site = SiteState(now=100000.0, grid_w=300, ev_floor_paused=True)
    dec = allocate(site, [car], states, {}).decisions[0]
    assert not dec.on and dec.reason == R_WAIT_SUN
    site = SiteState(now=100000.0, grid_w=300)
    dec = allocate(site, [car], states, {}).decisions[0]
    assert dec.on and dec.reason == R_MIN_POWER


def test_floor_pause_threshold():
    loads, states, runtimes = setup()
    assert make_plan(settings(forecast_ev_floor_kwh=5), loads, states, runtimes, 6, False).ev_floor_paused
    assert not make_plan(settings(forecast_ev_floor_kwh=5), loads, states, runtimes, 4, False).ev_floor_paused
