"""Home battery: charging on surplus, self consumption, peak support."""

from __future__ import annotations

import copy
from datetime import UTC

from custom_components.solarmind.const import (
    BAT_FOR_ALL,
    BAT_FOR_HOUSE,
    BAT_SIGN_DISCHARGE_POSITIVE,
    DEFAULT_LOAD,
    LOAD_BATTERY,
    MODE_OFF,
    MODE_ON,
    MODE_SELF,
    MODE_SOLAR,
    MODE_SOLAR_NIGHT,
    R_ALWAYS_ON,
    R_BAT_FULL,
    R_MODE_OFF,
    R_NIGHT,
    R_PEAK,
    R_RESERVE,
    R_SELF_CONSUMPTION,
    R_SOLAR,
)
from custom_components.solarmind.control.allocator import (
    LoadRuntime,
    LoadState,
    SiteState,
    allocate,
    battery_power_from_sensor,
    evaluate_night_need,
)
from custom_components.solarmind.history import HistoryData, LoadSample, summarize

from .test_allocator import boiler, ev


def battery(lid="bat", **kw):
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(id=lid, name=lid, type=LOAD_BATTERY, mode=MODE_SELF, bat_max_charge_w=3000, bat_max_discharge_w=3000)
    cfg.update(kw)
    return cfg


def run(grid_w, loads, states, runtimes=None, **site_kw):
    runtimes = {} if runtimes is None else runtimes
    site = SiteState(now=site_kw.pop("now", 100000.0), grid_w=grid_w, **site_kw)
    res = allocate(site, loads, states, runtimes)
    return {d.load_id: d for d in res.decisions}, res


def bat_state(soc=50.0, power=0.0):
    return LoadState(available=True, is_on=abs(power) > 1, power_w=power, soc=soc)


def test_charges_with_surplus_and_respects_priority():
    # 4 kW surplus: the boiler above the battery takes 2 kW, the battery the rest.
    loads = [boiler(), battery()]
    d, _ = run(-4000, loads, {"b1": LoadState(is_on=False), "bat": bat_state()})
    assert d["b1"].on is True
    assert d["bat"].setpoint_w == 2000
    assert d["bat"].reason == R_SOLAR


def test_own_charging_counts_as_surplus():
    # Battery charging at 1500 W, grid at 0: the surplus is still 1500 W, keep charging.
    d, res = run(0, [battery()], {"bat": bat_state(power=1500)})
    assert res.surplus_w == 1500
    assert d["bat"].setpoint_w == 1500


def test_charging_capped_and_stops_when_full():
    d, _ = run(-6000, [battery()], {"bat": bat_state()})
    assert d["bat"].setpoint_w == 3000
    d, _ = run(-6000, [battery(bat_max_soc=90)], {"bat": bat_state(soc=90)})
    assert d["bat"].setpoint_w == 0
    assert d["bat"].reason == R_BAT_FULL


def test_self_consumption_covers_house_only():
    # Evening: house 600 W, EV on its minimum power from the grid 1380 W.
    loads = [ev(mode=MODE_SOLAR, ev_min_power_w=1380), battery(bat_discharge_for=BAT_FOR_HOUSE)]
    states = {"ev": LoadState(is_on=True, current_a=6, power_w=1380, plugged=True, soc=40), "bat": bat_state()}
    d, _ = run(600 + 1380, loads, states)
    assert d["bat"].setpoint_w == -600
    assert d["bat"].reason == R_SELF_CONSUMPTION


def test_self_consumption_may_feed_ev_when_allowed():
    loads = [ev(mode=MODE_SOLAR, ev_min_power_w=1380), battery(bat_discharge_for=BAT_FOR_ALL)]
    states = {"ev": LoadState(is_on=True, current_a=6, power_w=1380, plugged=True, soc=40), "bat": bat_state()}
    d, _ = run(600 + 1380, loads, states)
    assert d["bat"].setpoint_w == -1980


def test_discharging_battery_does_not_look_like_surplus():
    # Battery already delivers 600 W, grid 0: the house still needs 600 W, no surplus.
    d, res = run(0, [boiler(), battery()], {"b1": LoadState(is_on=False), "bat": bat_state(power=-600)})
    assert res.surplus_w == 0
    assert d["b1"].on is False
    assert d["bat"].setpoint_w == -600


def test_reserve_stops_self_consumption():
    d, _ = run(800, [battery(bat_min_soc=10)], {"bat": bat_state(soc=10)})
    assert d["bat"].setpoint_w == 0
    assert d["bat"].reason == R_RESERVE


def test_solar_mode_does_not_discharge_for_house():
    d, _ = run(800, [battery(mode=MODE_SOLAR)], {"bat": bat_state()})
    assert d["bat"].setpoint_w == 0


def test_peak_guard_uses_battery_before_shedding():
    # Budget 2500 W, house 1500 W, boiler 2000 W on night top-up: 3500 W import.
    rt = {"b1": LoadRuntime(night_needed=True)}
    loads = [boiler(mode=MODE_SOLAR_NIGHT), battery(mode=MODE_SOLAR)]
    states = {"b1": LoadState(is_on=True, power_w=2000), "bat": bat_state()}
    d, _ = run(3500, loads, states, rt, in_night=True, grid_budget_w=2500)
    assert d["b1"].on is True
    assert d["bat"].setpoint_w == -1000
    assert d["bat"].reason == R_PEAK


def test_peak_guard_sheds_when_battery_low():
    rt = {"b1": LoadRuntime(night_needed=True)}
    loads = [boiler(mode=MODE_SOLAR_NIGHT), battery(mode=MODE_SOLAR, bat_peak_min_soc=5)]
    states = {"b1": LoadState(is_on=True, power_w=2000), "bat": bat_state(soc=5)}
    d, _ = run(3500, loads, states, rt, in_night=True, grid_budget_w=2500)
    assert d["b1"].on is False
    assert d["b1"].reason == R_PEAK


def test_peak_support_can_be_disabled():
    rt = {"b1": LoadRuntime(night_needed=True)}
    loads = [boiler(mode=MODE_SOLAR_NIGHT), battery(mode=MODE_SOLAR, bat_peak_support=False)]
    states = {"b1": LoadState(is_on=True, power_w=2000), "bat": bat_state()}
    d, _ = run(3500, loads, states, rt, in_night=True, grid_budget_w=2500)
    assert d["b1"].on is False
    assert d["bat"].setpoint_w == 0


def test_night_grid_charging_within_peak_budget():
    rt = {"bat": LoadRuntime(night_needed=True)}
    loads = [battery(mode=MODE_SOLAR_NIGHT, bat_target_soc=80)]
    d, _ = run(500, loads, {"bat": bat_state(soc=30)}, rt, in_night=True, grid_budget_w=2500)
    assert d["bat"].setpoint_w == 2000  # 2500 budget - 500 house
    assert d["bat"].reason == R_NIGHT
    # Target reached: no more grid charging, back to covering the house.
    d, _ = run(500, loads, {"bat": bat_state(soc=80)}, rt, in_night=True, grid_budget_w=2500)
    assert d["bat"].setpoint_w == -500


def test_night_need_follows_forecast():
    cfg = battery(mode=MODE_SOLAR_NIGHT, bat_target_soc=80, night_skip_forecast_kwh=15)
    site = SiteState(now=0, grid_w=0, forecast_tomorrow_kwh=20)
    assert evaluate_night_need(cfg, bat_state(soc=30), LoadRuntime(), site) is False
    site.forecast_tomorrow_kwh = 5
    assert evaluate_night_need(cfg, bat_state(soc=30), LoadRuntime(), site) is True
    assert evaluate_night_need(cfg, bat_state(soc=85), LoadRuntime(), site) is False


def test_mode_on_and_off():
    d, _ = run(500, [battery(mode=MODE_ON, bat_target_soc=80)], {"bat": bat_state(soc=50)})
    assert d["bat"].setpoint_w == 3000
    assert d["bat"].reason == R_ALWAYS_ON
    d, _ = run(500, [battery(mode=MODE_OFF)], {"bat": bat_state()})
    assert d["bat"].on is False
    assert d["bat"].reason == R_MODE_OFF


def test_power_sign():
    assert battery_power_from_sensor(battery(), 500) == 500
    assert battery_power_from_sensor(battery(bat_power_sign=BAT_SIGN_DISCHARGE_POSITIVE), 500) == -500


def test_history_and_savings():
    from datetime import datetime

    h = HistoryData()
    t = datetime(2026, 6, 1, 12, 0, tzinfo=UTC)
    for _ in range(36):
        h.record(t, 100, 0, 0, {"bat": LoadSample(power_w=2000, solar_w=2000, on=True, reason="solar")})
    for _ in range(36):
        h.record(t, 100, 0, 0, {"bat": LoadSample(power_w=0, solar_w=0, on=True, reason="self_consumption", discharge_w=1800)})
    day = h.days["2026-06-01"]["loads"]["bat"]
    assert round(day["kwh"], 3) == 2.0
    assert round(day["discharge_kwh"], 3) == 1.8
    s = summarize(h.days, 0.30, 0.04)["loads"]["bat"]
    assert round(s["saving"], 3) == round(1.8 * 0.30 - 2.0 * 0.04, 3)
    assert round(s["efficiency"], 2) == 0.9
