"""Tests for the EV time-to-full estimate and capacity learning."""

from __future__ import annotations

import pytest

from custom_components.solarmind.control.eta import CapacityLearner, PowerAverager, time_to_soc_s


def test_time_to_full_basic():
    # 75 kWh, 51 % -> 95 %: 33 kWh at 3 kW * 0.9 = 12.2 h, plus 5 % taper (3.75 kWh * 1.4).
    s = time_to_soc_s(51, 100, 75, 3000)
    normal = 0.44 * 75 / 2.7
    taper = 0.05 * 75 * 1.4 / 2.7
    assert s == pytest.approx((normal + taper) * 3600)


def test_time_to_limit_has_no_taper():
    assert time_to_soc_s(50, 80, 60, 2000) == pytest.approx(0.30 * 60 / 1.8 * 3600)


def test_time_to_soc_edge_cases():
    assert time_to_soc_s(100, 100, 75, 3000) == 0.0
    assert time_to_soc_s(50, 100, 75, 0) is None
    assert time_to_soc_s(50, 100, 0, 3000) is None


def test_power_averager_window():
    avg = PowerAverager(window_s=300)
    avg.add(0, 1000)
    avg.add(100, 3000)
    assert avg.average() == 2000
    avg.add(400, 3000)  # first sample falls out of the window
    assert avg.average() == 3000
    avg.reset()
    assert avg.average() is None


def test_capacity_learning():
    c = CapacityLearner()
    c.update(40, True, 0)  # anchor
    # 7.5 kWh from the wall -> 6.75 kWh in the battery for 9 % -> not yet
    c.update(49, True, 7.5)
    assert c.learned_kwh is None
    # +1 % with 0.833 kWh -> 10 % gained with 8.333 kWh wall = 7.5 kWh battery -> 75 kWh
    c.update(50, True, 0.8333)
    assert c.learned_kwh == pytest.approx(75, rel=0.01)
    # Driving lowers the SoC: re-anchor, no bogus estimate.
    c.update(30, True, 0)
    assert c.anchor_soc == 30
    c.update(30, False, 0)
    assert c.anchor_soc is None
    assert CapacityLearner.from_dict(c.to_dict()).learned_kwh == pytest.approx(c.learned_kwh)


def test_coordinator_eta_live_fields():
    import copy
    from types import SimpleNamespace

    from custom_components.solarmind.const import DEFAULT_LOAD, LOAD_EV
    from custom_components.solarmind.control.allocator import LoadState
    from custom_components.solarmind.coordinator import SolarMindCoordinator

    fake = SimpleNamespace(_ev_power={}, _ev_capacity={})
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(id="ev", type=LOAD_EV, ev_battery_kwh=60, mode="solar", ev_min_power_w=None)
    st = LoadState(is_on=True, power_w=3000, soc=50, charge_limit=80, plugged=True)
    out = SolarMindCoordinator._ev_eta(fake, cfg, st, 3000, 1000.0, 10, 230)
    assert out["eta_estimated"] is False
    assert out["eta_limit_s"] == round(0.30 * 60 / 2.7 * 3600)
    assert out["eta_full_s"] > out["eta_limit_s"]
    # Paused: estimate at 6 A on one phase.
    st2 = LoadState(is_on=False, power_w=0, soc=50, charge_limit=80, plugged=True)
    out = SolarMindCoordinator._ev_eta(fake, cfg, st2, 0, 1010.0, 10, 230)
    assert out["eta_estimated"] is True
    assert out["eta_limit_s"] == round(0.30 * 60 / (1380 * 0.9 / 1000) * 3600)


def test_capacity_from_car_estimate():
    from custom_components.solarmind.control.eta import capacity_from_car_estimate

    # 55 % -> 80 % in 6.2 h at 3 kW: 6.2 * 3 * 0.9 / 0.25 = 66.96 kWh
    assert capacity_from_car_estimate(55, 80, 6.2, 3000) == pytest.approx(66.96)
    assert capacity_from_car_estimate(79, 80, 1, 3000) is None  # too close to the limit
    assert capacity_from_car_estimate(55, 80, 0.1, 3000) is None  # implausible
    assert capacity_from_car_estimate(55, None, 6, 3000) is None


def test_coordinator_uses_car_estimate_until_learned():
    import copy
    from types import SimpleNamespace

    from custom_components.solarmind.const import DEFAULT_LOAD, LOAD_EV
    from custom_components.solarmind.control.allocator import LoadState
    from custom_components.solarmind.coordinator import SolarMindCoordinator

    fake = SimpleNamespace(_ev_power={}, _ev_capacity={})
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(id="ev", type=LOAD_EV, mode="solar")
    st = LoadState(is_on=True, power_w=3000, soc=55, charge_limit=80, plugged=True, car_time_to_limit_h=6.2)
    out = SolarMindCoordinator._ev_eta(fake, cfg, st, 3000, 1000.0, 10, 230)
    assert out["battery_kwh_source"] == "car"
    assert out["battery_kwh"] == pytest.approx(67.0)
    assert out["eta_full_s"] and out["eta_limit_s"]
    # Without the car estimate and without a capacity: no time.
    fake2 = SimpleNamespace(_ev_power={}, _ev_capacity={})
    st2 = LoadState(is_on=True, power_w=3000, soc=55, charge_limit=80, plugged=True)
    assert SolarMindCoordinator._ev_eta(fake2, cfg, st2, 3000, 1000.0, 10, 230)["eta_full_s"] is None


def test_coordinator_prefers_car_time_to_limit():
    import copy
    from types import SimpleNamespace

    from custom_components.solarmind.const import DEFAULT_LOAD, LOAD_EV
    from custom_components.solarmind.control.allocator import LoadState
    from custom_components.solarmind.control.eta import time_to_soc_s
    from custom_components.solarmind.coordinator import SolarMindCoordinator

    fake = SimpleNamespace(_ev_power={}, _ev_capacity={})
    cfg = copy.deepcopy(DEFAULT_LOAD)
    cfg.update(id="ev", type=LOAD_EV, mode="solar", ev_battery_kwh=60)
    st = LoadState(is_on=True, power_w=3000, soc=55, charge_limit=80, plugged=True, car_time_to_limit_h=5.0)
    out = SolarMindCoordinator._ev_eta(fake, cfg, st, 3000, 1000.0, 10, 230)
    assert out["eta_source"] == "car"
    assert out["eta_limit_s"] == 5 * 3600
    assert out["eta_full_s"] == round(5 * 3600 + time_to_soc_s(80, 100, 60, 3000))
    # Limit at 100 %: the car's time is the time to full; no capacity needed.
    fake2 = SimpleNamespace(_ev_power={}, _ev_capacity={})
    cfg2 = dict(cfg, ev_battery_kwh=None)
    st2 = LoadState(is_on=True, power_w=3000, soc=55, charge_limit=100, plugged=True, car_time_to_limit_h=2.0)
    out = SolarMindCoordinator._ev_eta(fake2, cfg2, st2, 3000, 1000.0, 10, 230)
    assert out["eta_full_s"] == 7200 and out["eta_limit_s"] is None
    # Paused: the car reports nothing useful, fall back to the calculation.
    st3 = LoadState(is_on=False, power_w=0, soc=55, charge_limit=80, plugged=True, car_time_to_limit_h=0.0)
    out = SolarMindCoordinator._ev_eta(fake, cfg, st3, 0, 1010.0, 10, 230)
    assert out["eta_source"] == "calc" and out["eta_estimated"] is True
