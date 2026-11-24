"""Tests for the predictive planner, its predictions and how the allocator follows it."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from custom_components.solarmind.const import (
    LOAD_BATTERY,
    LOAD_EV,
    LOAD_SWITCH,
    MODE_SOLAR_NIGHT,
    R_NO_SURPLUS,
    R_PLANNED,
)
from custom_components.solarmind.control.allocator import LoadRuntime, LoadState
from custom_components.solarmind.control.planner import PlanLoad, make_plan
from custom_components.solarmind.control.predict import (
    SLOT_S,
    BoilerLearner,
    base_profile,
    boiler_day_need,
    boiler_need_from_temperature,
    periods_from_attributes,
    resample,
    spread_day,
)
from custom_components.solarmind.planning import next_departure, night_windows

from .test_allocator import boiler, ev, run

T0 = 1_700_000_100.0 - (1_700_000_100.0 % SLOT_S)  # a quarter start
N = 32  # 8 hours


def kwh(plan, lid):
    return sum(plan.grid_w[lid]) * SLOT_S / 3.6e6


# ------------------------------------------------------------------ planner


def test_boiler_shortfall_is_placed_late_in_the_night():
    pl = PlanLoad("b1", LOAD_SWITCH, 2000, need_kwh=1.0, grid=True, grid_until=T0 + N * SLOT_S)
    plan = make_plan(T0, [0.0] * N, [300.0] * N, [pl], limit_w=2500)
    assert round(kwh(plan, "b1"), 3) == 1.0
    on = [i for i, w in enumerate(plan.grid_w["b1"]) if w > 0]
    assert on == [N - 2, N - 1]
    assert plan.loads["b1"]["grid_kwh"] == 1.0
    assert plan.loads["b1"]["short_kwh"] == 0.0


def test_expected_sun_covers_the_need_no_grid():
    pv = [0.0] * 8 + [3000.0] * 8 + [0.0] * 16
    pl = PlanLoad("b1", LOAD_SWITCH, 2000, need_kwh=3.0, grid=True)
    plan = make_plan(T0, pv, [300.0] * N, [pl], limit_w=2500)
    assert plan.loads["b1"]["solar_kwh"] == 3.0
    assert kwh(plan, "b1") == 0


def test_only_what_the_sun_misses_comes_from_the_grid():
    pv = [0.0] * 8 + [3000.0] * 2 + [0.0] * 22  # 2 quarters of sun = 1 kWh for the boiler
    pl = PlanLoad("b1", LOAD_SWITCH, 2000, need_kwh=3.0, grid=True, grid_windows=[(T0 + 20 * SLOT_S, T0 + N * SLOT_S)])
    plan = make_plan(T0, pv, [300.0] * N, [pl], limit_w=2500)
    assert plan.loads["b1"]["solar_kwh"] == 1.0
    assert round(kwh(plan, "b1"), 3) == 2.0
    assert all(i >= 20 for i, w in enumerate(plan.grid_w["b1"]) if w > 0)


def test_two_boilers_are_spread_under_the_peak_limit():
    loads = [PlanLoad(f"b{i}", LOAD_SWITCH, 2000, need_kwh=2.0, grid=True) for i in (1, 2)]
    plan = make_plan(T0, [0.0] * N, [300.0] * N, loads, limit_w=2500)
    assert max(plan.import_w) <= 2500
    assert not any(plan.grid_w["b1"][i] and plan.grid_w["b2"][i] for i in range(N))
    assert not plan.loads["b2"]["over_limit"]


def test_car_is_charged_flat_under_the_limit():
    pl = PlanLoad("car", LOAD_EV, 16 * 230, min_w=6 * 230, need_kwh=10.0, grid=True)
    plan = make_plan(T0, [0.0] * N, [300.0] * N, [pl], limit_w=2500)
    assert abs(kwh(plan, "car") - 10.0) < 0.01
    assert max(plan.import_w) <= 2500 + 1
    assert all(w == 0 or w >= 6 * 230 - 1 for w in plan.grid_w["car"])


def test_battery_charges_only_what_tomorrows_sun_will_not():
    night_end = T0 + 16 * SLOT_S
    pv = [0.0] * 16 + [2300.0] * 16  # tomorrow: 2 kW surplus for 4 h = 8 kWh, battery takes max 1 kW -> 4 kWh
    pl = PlanLoad("bat", LOAD_BATTERY, 1000, need_kwh=6.0, grid=True, grid_until=night_end,
                  grid_windows=[(T0, night_end)])
    plan = make_plan(T0, pv, [300.0] * N, [pl], limit_w=2500)
    assert plan.loads["bat"]["solar_kwh"] == 4.0
    assert abs(kwh(plan, "bat") - 2.0) < 0.01
    assert all(w == 0 for w in plan.grid_w["bat"][16:])


def test_without_spread_grid_starts_right_away():
    pl = PlanLoad("b1", LOAD_SWITCH, 2000, need_kwh=1.0, grid=True)
    plan = make_plan(T0, [0.0] * N, [300.0] * N, [pl], limit_w=None, spread=False)
    assert [i for i, w in enumerate(plan.grid_w["b1"]) if w > 0] == [0, 1]
    assert plan.grid_now("b1", T0 + 10) == 2000
    assert plan.grid_later("b1", T0 + 10)


def test_priority_gets_the_sun_first():
    pv = [2300.0] * 4 + [0.0] * (N - 4)
    a = PlanLoad("a", LOAD_SWITCH, 2000, need_kwh=1.0)
    b = PlanLoad("b", LOAD_SWITCH, 2000, need_kwh=1.0)
    plan = make_plan(T0, pv, [300.0] * N, [a, b])
    assert plan.loads["a"]["solar_kwh"] == 1.0
    assert plan.loads["b"]["solar_kwh"] == 1.0  # after "a" is full the sun goes to "b"
    assert plan.solar_w["a"][0] and not plan.solar_w["b"][0]


# -------------------------------------------------------------- predictions


def test_solcast_detailed_forecast_is_resampled_to_quarters():
    t = datetime(2026, 6, 1, 12, 0, tzinfo=UTC)
    attrs = {"detailedForecast": [
        {"period_start": t.isoformat(), "pv_estimate": 2.0, "pv_estimate10": 1.0},
        {"period_start": (t + timedelta(minutes=30)).isoformat(), "pv_estimate": 4.0, "pv_estimate10": 2.0},
    ]}
    periods = periods_from_attributes(attrs)
    s = t.timestamp()
    assert resample(periods, [s, s + 900, s + 1800, s + 2700, s + 3600]) == [2000, 2000, 4000, 4000, None]
    assert resample(periods_from_attributes(attrs, "pv_estimate10"), [s])[0] == 1000


def test_open_meteo_watts_and_day_spread():
    t = datetime(2026, 6, 1, 12, 0, tzinfo=UTC).timestamp()
    periods = periods_from_attributes({"wh_period": {datetime.fromtimestamp(t, tz=UTC).isoformat(): 500}})
    assert periods == [(t, t + 3600, 500.0)]
    shape = [0.0] * 96
    shape[48] = 1.0
    day = datetime(2026, 6, 1, tzinfo=UTC)
    assert spread_day(2.0, day, shape) == [(t, t + 900, 8000.0)]


def test_base_profile_subtracts_managed_loads():
    tz = UTC
    t = datetime(2026, 6, 1, 0, 0, tzinfo=tz).timestamp()
    rows = [[t + m * 60, 0, 2400, {"b1": [2000, 0, "night", 1, None]}] for m in range(7 * 60)]
    prof = base_profile({"2026-06-01": rows}, tz)
    assert prof[3] == 400


def test_boiler_need_from_temperature_and_learning():
    cfg = boiler(temperature_entity="sensor.t", boiler_volume_l=200, boiler_target_temperature=55)
    assert round(boiler_need_from_temperature(cfg, 45.0), 2) == 2.33
    assert boiler_need_from_temperature(cfg, None) is None
    lr = BoilerLearner()
    lr.add(3.0)
    lr.got_full()
    lr.add(1.0)  # after full: not counted
    assert lr.learned_kwh == 3.0
    lr.new_day()
    lr.add(5.0)
    lr.got_full()
    assert round(lr.learned_kwh, 2) == 3.6
    assert boiler_day_need(boiler(), lr) == (lr.learned_kwh, "learned")
    assert boiler_day_need(boiler(plan_need_kwh=2.5), lr) == (2.5, "set")


def test_night_windows_and_departure():
    tz = UTC
    local = datetime(2026, 6, 1, 23, 0, tzinfo=tz)  # a Monday, inside the night
    w = night_windows(local, "22:00", "07:00", 36)
    assert w[0] == (datetime(2026, 6, 1, 22, 0, tzinfo=tz).timestamp(), datetime(2026, 6, 2, 7, 0, tzinfo=tz).timestamp())
    assert len(w) == 2
    cfg = {"ev_departure_time": "07:30", "ev_departure_days": [2]}  # Wednesday only
    assert next_departure(local, cfg, 24) is None
    assert next_departure(local, cfg, 36) == datetime(2026, 6, 3, 7, 30, tzinfo=tz).timestamp()


# ----------------------------------------------------- allocator follows plan


def test_planned_boiler_runs_only_in_its_quarter():
    cfg = boiler(mode=MODE_SOLAR_NIGHT)
    rts = {"b1": LoadRuntime(night_needed=True)}
    dec, _ = run(300, [cfg], {"b1": LoadState()}, rts, in_night=True, plan_grid_w={"b1": 0.0})
    assert dec["b1"].on is False and dec["b1"].reason == R_NO_SURPLUS  # night fallback replaced by the plan
    dec, _ = run(300, [cfg], {"b1": LoadState()}, rts, in_night=True, plan_grid_w={"b1": 2000.0})
    assert dec["b1"].on is True and dec["b1"].reason == R_PLANNED


def test_planned_car_current_follows_the_plan():
    cfg = ev(mode=MODE_SOLAR_NIGHT)
    st = {"ev": LoadState(plugged=True, soc=40)}
    dec, _ = run(300, [cfg], st, {}, in_night=True, plan_grid_w={"ev": 1840.0})
    assert dec["ev"].reason == R_PLANNED and dec["ev"].current_a == 8
    dec, _ = run(300, [cfg], st, {}, in_night=True, plan_grid_w={"ev": 500.0})
    assert dec["ev"].current_a == 6  # never below the minimum current


def test_planned_battery_charges_at_the_planned_power():
    from custom_components.solarmind.const import DEFAULT_LOAD

    cfg = dict(DEFAULT_LOAD, id="bat", name="bat", type=LOAD_BATTERY, mode=MODE_SOLAR_NIGHT, bat_max_charge_w=3000)
    st = {"bat": LoadState(soc=30)}
    dec, _ = run(300, [cfg], st, {"bat": LoadRuntime(night_needed=True)}, in_night=True, plan_grid_w={"bat": 1200.0})
    assert dec["bat"].reason == R_PLANNED and dec["bat"].setpoint_w == 1200
    dec, _ = run(300, [cfg], st, {"bat": LoadRuntime(night_needed=True)}, in_night=True, plan_grid_w={"bat": 0.0})
    assert dec["bat"].reason != R_PLANNED and (dec["bat"].setpoint_w or 0) <= 0
