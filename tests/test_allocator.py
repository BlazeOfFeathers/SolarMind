"""Tests for the surplus allocator (pure logic, no Home Assistant needed)."""

from __future__ import annotations

import copy

from custom_components.solarmind.const import (
    DEFAULT_LOAD,
    LOAD_EV,
    MODE_OFF,
    MODE_ON,
    MODE_SOLAR,
    MODE_SOLAR_NIGHT,
    R_ALWAYS_ON,
    R_HOLD_MIN_ON,
    R_LEGIONELLA,
    R_MODE_OFF,
    R_NIGHT,
    R_NO_SURPLUS,
    R_NOT_CONNECTED,
    R_PEAK,
    R_SOLAR,
    R_TARGET_REACHED,
    R_WAIT_START,
    R_WAIT_STOP,
)
from custom_components.solarmind.control.allocator import (
    LoadRuntime,
    LoadState,
    SiteState,
    allocate,
    evaluate_night_need,
)


def boiler(lid="b1", **kw):
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(id=lid, name=lid, nominal_power_w=2000, start_delay_s=0, stop_delay_s=0, min_on_s=0, min_off_s=0)
    cfg.update(kw)
    return cfg


def ev(lid="ev", **kw):
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(
        id=lid, name=lid, type=LOAD_EV, start_delay_s=0, stop_delay_s=0, min_on_s=0, min_off_s=0,
        ev_min_current=6, ev_max_current=16, ev_phases=1, ev_current_step_interval_s=0,
    )
    cfg.update(kw)
    return cfg


def run(grid_w, loads, states, runtimes=None, **site_kw):
    runtimes = {} if runtimes is None else runtimes
    site = SiteState(now=site_kw.pop("now", 100000.0), grid_w=grid_w, **site_kw)
    res = allocate(site, loads, states, runtimes)
    return {d.load_id: d for d in res.decisions}, res


def test_priority_first_load_gets_surplus():
    loads = [boiler("b1"), boiler("b2")]
    states = {"b1": LoadState(), "b2": LoadState()}
    d, _ = run(-2500, loads, states)
    assert d["b1"].on is True and d["b1"].reason == R_SOLAR
    assert d["b2"].on is False and d["b2"].reason == R_NO_SURPLUS


def test_both_boilers_when_enough_surplus():
    loads = [boiler("b1"), boiler("b2")]
    d, _ = run(-4500, loads, {"b1": LoadState(), "b2": LoadState()})
    assert d["b1"].on and d["b2"].on


def test_running_load_counts_its_own_power():
    # Boiler draws 2000 W, grid shows 300 W export => surplus 2300 W, keep it on.
    loads = [boiler("b1")]
    d, res = run(-300, loads, {"b1": LoadState(is_on=True, power_w=2000)})
    assert res.surplus_w == 2300
    assert d["b1"].on is True


def test_stops_when_import_exceeds_tolerance():
    loads = [boiler("b1", allowed_import_w=200)]
    d, _ = run(500, loads, {"b1": LoadState(is_on=True, power_w=2000)})
    assert d["b1"].on is False and d["b1"].reason == R_NO_SURPLUS


def test_tolerated_small_import_keeps_running():
    loads = [boiler("b1", allowed_import_w=200)]
    d, _ = run(150, loads, {"b1": LoadState(is_on=True, power_w=2000)})
    assert d["b1"].on is True


def test_start_delay_and_stop_delay():
    loads = [boiler("b1", start_delay_s=60, stop_delay_s=120)]
    rts: dict[str, LoadRuntime] = {}
    d, _ = run(-3000, loads, {"b1": LoadState()}, rts, now=1000)
    assert d["b1"].on is False and d["b1"].reason == R_WAIT_START
    d, _ = run(-3000, loads, {"b1": LoadState()}, rts, now=1061)
    assert d["b1"].on is True
    rts["b1"].last_switch_ts = 0
    d, _ = run(1500, loads, {"b1": LoadState(is_on=True, power_w=2000)}, rts, now=2000)
    assert d["b1"].on is True and d["b1"].reason == R_WAIT_STOP
    d, _ = run(1500, loads, {"b1": LoadState(is_on=True, power_w=2000)}, rts, now=2121)
    assert d["b1"].on is False


def test_min_on_time_holds():
    loads = [boiler("b1", min_on_s=600)]
    rts = {"b1": LoadRuntime(last_switch_ts=1000)}
    d, _ = run(1500, loads, {"b1": LoadState(is_on=True, power_w=2000)}, rts, now=1100)
    assert d["b1"].on is True and d["b1"].reason == R_HOLD_MIN_ON


def test_full_boiler_releases_budget_to_next_load():
    loads = [boiler("b1"), boiler("b2")]
    rts = {"b1": LoadRuntime(low_power_since=0.0)}
    states = {"b1": LoadState(is_on=True, power_w=2), "b2": LoadState()}
    d, _ = run(-2300, loads, states, rts, now=1000)
    assert d["b1"].reason == R_TARGET_REACHED and d["b1"].allocated_w == 0
    assert d["b2"].on is True


def test_mode_off_and_always_on():
    loads = [boiler("b1", mode=MODE_OFF), boiler("b2", mode=MODE_ON)]
    d, _ = run(1000, loads, {"b1": LoadState(is_on=True, power_w=2000), "b2": LoadState()})
    assert d["b1"].on is False and d["b1"].reason == R_MODE_OFF
    assert d["b2"].on is True and d["b2"].reason == R_ALWAYS_ON


def test_ev_follows_surplus_in_amps():
    loads = [ev()]
    d, _ = run(-2400, loads, {"ev": LoadState(plugged=True)})
    # 2400 - 100 margin = 2300 W / 230 V = 10 A
    assert d["ev"].on is True and d["ev"].current_a == 10


def test_ev_running_uses_own_power():
    loads = [ev()]
    # charging 8 A (1840 W), exporting 700 W => surplus 2540 => 11 A (+200 tolerance => 11.9)
    d, _ = run(-700, loads, {"ev": LoadState(is_on=True, current_a=8, power_w=1840, plugged=True)})
    assert d["ev"].current_a == 11


def test_ev_stops_below_min_current():
    loads = [ev()]
    d, _ = run(-500, loads, {"ev": LoadState(plugged=True)})
    assert d["ev"].on is False


def test_ev_not_plugged():
    loads = [ev()]
    d, _ = run(-5000, loads, {"ev": LoadState(plugged=False)})
    assert d["ev"].reason == R_NOT_CONNECTED and d["ev"].on is None


def test_ev_three_phase():
    loads = [ev(ev_phases=3)]
    d, _ = run(-7000, loads, {"ev": LoadState(plugged=True)})
    assert d["ev"].current_a == 10  # (7000-100)/690 = 10


def test_boiler_then_ev_shares_rest():
    loads = [boiler("b1"), ev()]
    d, _ = run(-4000, loads, {"b1": LoadState(), "ev": LoadState(plugged=True)})
    assert d["b1"].on is True
    assert d["ev"].on is True and d["ev"].current_a == 8


def test_peak_guard_sheds_always_on_load():
    loads = [boiler("b1", mode=MODE_ON)]
    # house imports 1500 W, budget 2500 W => 1000 W headroom < 2000 W boiler
    d, _ = run(1500, loads, {"b1": LoadState()}, grid_budget_w=2500)
    assert d["b1"].on is False and d["b1"].reason == R_PEAK


def test_peak_guard_respects_no_shed_flag():
    loads = [boiler("b1", mode=MODE_ON, peak_shed=False)]
    d, _ = run(1500, loads, {"b1": LoadState()}, grid_budget_w=2500)
    assert d["b1"].on is True


def test_peak_guard_limits_ev_amps_at_night():
    loads = [ev(mode=MODE_ON)]
    # base import 800 W, budget 2500 => 1700 W => 7 A
    d, _ = run(800, loads, {"ev": LoadState(plugged=True)}, grid_budget_w=2500)
    assert d["ev"].on is True and d["ev"].current_a == 7


def test_night_fallback_runs_when_needed():
    loads = [boiler("b1", mode=MODE_SOLAR_NIGHT, night_target_kwh=3)]
    rts = {"b1": LoadRuntime(night_needed=True, night_kwh=1)}
    d, _ = run(300, loads, {"b1": LoadState()}, rts, in_night=True)
    assert d["b1"].on is True and d["b1"].reason == R_NIGHT
    rts["b1"].night_kwh = 3.1
    d, _ = run(2300, loads, {"b1": LoadState(is_on=True, power_w=2000)}, rts, in_night=True)
    assert d["b1"].on is False


def test_night_not_needed_stays_off():
    loads = [boiler("b1", mode=MODE_SOLAR_NIGHT)]
    rts = {"b1": LoadRuntime(night_needed=False)}
    d, _ = run(300, loads, {"b1": LoadState()}, rts, in_night=True)
    assert d["b1"].on is False


def test_evaluate_night_need():
    cfg = boiler("b1", mode=MODE_SOLAR_NIGHT, night_min_solar_kwh=4, night_skip_forecast_kwh=20)
    site = SiteState(now=0, grid_w=0, forecast_tomorrow_kwh=10)
    assert evaluate_night_need(cfg, LoadState(), LoadRuntime(solar_kwh_day=2), site) is True
    assert evaluate_night_need(cfg, LoadState(), LoadRuntime(solar_kwh_day=5), site) is False
    site.forecast_tomorrow_kwh = 25
    assert evaluate_night_need(cfg, LoadState(), LoadRuntime(solar_kwh_day=0), site) is False
    car = ev(mode=MODE_SOLAR_NIGHT, ev_target_soc=80)
    site.forecast_tomorrow_kwh = None
    assert evaluate_night_need(car, LoadState(soc=60), LoadRuntime(), site) is True
    assert evaluate_night_need(car, LoadState(soc=85), LoadRuntime(), site) is False


def test_legionella_runs_at_night_when_overdue():
    loads = [boiler("b1", mode=MODE_SOLAR, legionella_enabled=True)]
    rts = {"b1": LoadRuntime(last_hot_ts=0)}
    d, _ = run(300, loads, {"b1": LoadState(temperature=50)}, rts, in_night=True, now=8 * 86400)
    assert d["b1"].on is True and d["b1"].reason == R_LEGIONELLA


def test_max_temperature_stops():
    loads = [boiler("b1", max_temperature=65)]
    d, _ = run(-5000, loads, {"b1": LoadState(is_on=True, power_w=2000, temperature=66)})
    assert d["b1"].on is False and d["b1"].reason == R_TARGET_REACHED


def test_disabled_and_unavailable_are_left_alone():
    loads = [boiler("b1", enabled=False), boiler("b2")]
    d, _ = run(-5000, loads, {"b1": LoadState(), "b2": LoadState(available=False)})
    assert d["b1"].on is None and d["b2"].on is None


def test_ev_min_power_tops_up_from_grid():
    from custom_components.solarmind.const import R_MIN_POWER

    car = ev(ev_min_power_w=2000)
    # 500 W surplus only: plain solar would stop, the minimum keeps 9 A (2070 W).
    d, _ = run(-500, [car], {"ev": LoadState(is_on=False, soc=50)})
    d = d["ev"]
    assert d.on is True and d.current_a == 9 and d.reason == R_MIN_POWER and d.wants_grid


def test_ev_min_power_lets_surplus_go_higher():
    car = ev(ev_min_power_w=2000)
    d, _ = run(-3500, [car], {"ev": LoadState(is_on=False, soc=50)})
    d = d["ev"]
    assert d.reason == R_SOLAR and d.current_a == 14


def test_ev_min_power_stops_at_target_soc():
    car = ev(ev_min_power_w=2000, ev_target_soc=80)
    d, _ = run(0, [car], {"ev": LoadState(is_on=False, soc=85)})
    assert d["ev"].on is False and d["ev"].reason == R_NO_SURPLUS


def test_ev_min_power_respects_peak_guard():
    car = ev(ev_min_power_w=2000)
    # House imports 800 W, budget 2500 W -> 1700 W headroom -> 7 A.
    d, _ = run(800, [car], {"ev": LoadState(is_on=False, soc=50)}, grid_budget_w=2500)
    d = d["ev"]
    assert d.on is True and d.current_a == 7 and d.reason == R_PEAK
    d, _ = run(1500, [car], {"ev": LoadState(is_on=False, soc=50)}, grid_budget_w=2500)
    assert d["ev"].on is False and d["ev"].reason == R_PEAK


def test_ev_min_power_only_in_solar_mode():
    car = ev(ev_min_power_w=2000, mode=MODE_SOLAR_NIGHT)
    d, _ = run(-500, [car], {"ev": LoadState(is_on=False, soc=50)})
    assert d["ev"].on is False and d["ev"].reason == R_NO_SURPLUS
