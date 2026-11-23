"""Tests for the quarter-hour peak tracker."""

from custom_components.solarmind.control.peak import PeakTracker

SETTINGS = {"peak_limit_w": 2500, "peak_follow_month_max": True, "peak_margin_w": 0}


def test_average_and_rollover():
    t = PeakTracker()
    t.update(0, 4000, "2026-11")
    t.update(450, 0, "2026-11")  # 4000 W for 450 s
    t.update(900, 0, "2026-11")  # quarter closes: avg 2000 W
    done = t.pop_finished()
    assert done == [(0, 2000.0)]
    assert t.month_peak_w == 2000.0


def test_budget_shrinks_as_energy_is_used():
    t = PeakTracker()
    t.update(0, 2500, "2026-11")
    t.update(450, 2500, "2026-11")
    # Used 312.5 Wh of 625 Wh with 450 s left => 2500 W still allowed
    assert round(t.budget_w(450, SETTINGS)) == 2500
    t.update(450, 5000, "2026-11")
    t.update(600, 5000, "2026-11")
    # 312.5 + 208.3 = 520.8 Wh used, 104.2 Wh left in 300 s => 1250 W
    assert round(t.budget_w(600, SETTINGS)) == 1250


def test_month_peak_raises_limit_and_resets_monthly():
    t = PeakTracker(month_key="2026-11", month_peak_w=4000)
    assert t.limit_w(SETTINGS) == 4000
    t.update(0, 0, "2026-12")
    assert t.month_peak_w == 0
    assert t.limit_w(SETTINGS) == 2500


def test_projection():
    t = PeakTracker()
    t.update(0, 3000, "2026-11")
    t.update(300, 3000, "2026-11")
    assert round(t.projected_w(300)) == 3000
