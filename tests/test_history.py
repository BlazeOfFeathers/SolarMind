"""Tests for history aggregation."""

from datetime import datetime, timedelta, timezone

from custom_components.solarmind.history import HistoryData, LoadSample, rhythm, summarize

TZ = timezone(timedelta(hours=1))


def test_minute_rows_and_day_totals():
    h = HistoryData()
    start = datetime(2026, 6, 1, 12, 0, 0, tzinfo=TZ)
    for i in range(13):  # 2 minutes of 10 s cycles
        now = start + timedelta(seconds=10 * i)
        h.record(now, 10, 5000, -1000, {"b1": LoadSample(power_w=2000, solar_w=2000, on=True, reason="solar")})
    rows = h.samples["2026-06-01"]
    assert len(rows) == 2
    assert rows[0][3]["b1"][0] == 2000
    day = h.days["2026-06-01"]
    assert round(day["loads"]["b1"]["kwh"], 4) == round(2000 * 130 / 3.6e6, 4)
    assert day["loads"]["b1"]["runtime_s"] == 130
    s = summarize(h.days, 0.3, 0.04)
    assert s["loads"]["b1"]["solar_share"] == 1.0
    assert s["house"]["self_consumption"] == 0.8


def test_starts_counted_and_sessions():
    h = HistoryData()
    t0 = datetime(2026, 6, 1, 12, 0, 0, tzinfo=TZ)
    seq = [(False, True), (True, True), (True, True), (False, True), (False, False)]
    for i, (on, plugged) in enumerate(seq):
        h.record(t0 + timedelta(seconds=i * 60), 60 if i else 0, 0, 0,
                 {"ev": LoadSample(power_w=2300 if on else 0, solar_w=1000 if on else 0, on=on, reason="solar",
                                   plugged=plugged, soc=50 + i)})
    assert h.days["2026-06-01"]["loads"]["ev"]["starts"] == 1
    assert len(h.sessions) == 1
    sess = h.sessions[0]
    assert sess["soc_start"] == 50 and sess["soc_end"] == 53
    assert round(sess["kwh"], 4) == round(2 * 60 * 2300 / 3.6e6, 4)


def test_rhythm_and_prune():
    h = HistoryData()
    t0 = datetime(2026, 6, 1, 13, 0, 30, tzinfo=TZ)
    h.record(t0, 10, 0, 0, {"b1": LoadSample(power_w=1000, solar_w=0, on=True, reason="solar")})
    h.record(t0 + timedelta(minutes=1), 10, 0, 0, {"b1": LoadSample(power_w=0, solar_w=0, on=False, reason="idle")})
    r = rhythm(h.samples, "b1", "2026-06-01", "2026-06-01", TZ)
    assert r[13] == 1000
    h.prune(t0 + timedelta(days=30))
    assert "2026-06-01" not in h.samples
    assert "2026-06-01" in h.days
