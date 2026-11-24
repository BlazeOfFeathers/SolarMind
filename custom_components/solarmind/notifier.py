"""Push notifications (e.g. to the Home Assistant Companion app).

The ``NotificationTracker`` is pure Python: it turns successive snapshots of the
live state into messages (edge triggered, with debouncing), so it is easy to test.
``async_send`` delivers them through ``notify.*`` services.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant

from .const import R_PEAK, R_UNAVAILABLE

_LOGGER = logging.getLogger(__name__)

FAULT_DEBOUNCE_S = 300  # something must be unreachable this long before we tell you
PEAK_REPEAT_S = 900  # at most one "peak" message per quarter hour (unless the list grows)
SKIP_REASONS = ("disabled",)

# Texts (Dutch first: the panel's default language).
TEXTS: dict[str, dict[str, str]] = {
    "nl": {
        "peak_title": "Piekbewaking",
        "peak_shed": "Kwartierpiek dreigt boven {limit} te gaan. Uitgeschakeld, teruggeschroefd of tegengehouden: {names}.",
        "peak_clear": "Piek onder controle, {names} mag weer.",
        "ev_title": "{name}",
        "ev_refused": "De auto weigert: {reason}",
        "ev_complete": "Klaar met laden ({soc}).",
        "fault_title": "SolarMind storing",
        "fault_load": "{name} is niet bereikbaar.",
        "fault_load_ok": "{name} is weer bereikbaar.",
        "fault_grid": "De netmeter levert geen waarde: SolarMind stuurt niets tot hij terug is.",
        "fault_grid_ok": "De netmeter werkt weer.",
        "test_title": "SolarMind",
        "test": "Testmelding: meldingen werken.",
    },
    "en": {
        "peak_title": "Peak guard",
        "peak_shed": "Quarter-hour peak about to exceed {limit}. Switched off, reduced or held back: {names}.",
        "peak_clear": "Peak under control, {names} may run again.",
        "ev_title": "{name}",
        "ev_refused": "The car refused: {reason}",
        "ev_complete": "Finished charging ({soc}).",
        "fault_title": "SolarMind problem",
        "fault_load": "{name} is unreachable.",
        "fault_load_ok": "{name} is reachable again.",
        "fault_grid": "The grid meter has no value: SolarMind controls nothing until it is back.",
        "fault_grid_ok": "The grid meter works again.",
        "test_title": "SolarMind",
        "test": "Test notification: notifications work.",
    },
}


@dataclass
class Message:
    kind: str  # peak | ev | fault | test
    title: str
    message: str
    tag: str  # same tag replaces the previous notification on the phone


def _fmt_w(w: float | None) -> str:
    if w is None:
        return "?"
    return f"{w / 1000:.1f} kW".replace(".", ",") if w >= 1000 else f"{round(w)} W"


def _join(names: list[str]) -> str:
    return ", ".join(sorted(names))


@dataclass
class NotificationTracker:
    lang: str = "nl"
    shed: set[str] = field(default_factory=set)
    last_peak_ts: float = -1e12
    peak_announced: bool = False
    ev_error: dict[str, str | None] = field(default_factory=dict)
    car_state: dict[str, str | None] = field(default_factory=dict)
    down_since: dict[str, float] = field(default_factory=dict)  # load id / "grid" -> ts
    reported_down: set[str] = field(default_factory=set)
    _primed: bool = False

    def _t(self, key: str, **kw: Any) -> str:
        texts = TEXTS.get(self.lang, TEXTS["nl"])
        return texts[key].format(**kw)

    def update(self, now: float, live: dict[str, Any], loads: list[dict[str, Any]], settings: dict[str, Any]) -> list[Message]:
        """Compare with the previous snapshot and return the messages to send."""
        out: list[Message] = []
        site = live.get("site", {})
        loads_live = live.get("loads", {})
        names = {cfg["id"]: cfg.get("name") or cfg["id"] for cfg in loads}

        # --- peak guard
        shed_now = {lid for lid, lv in loads_live.items() if lv.get("reason") == R_PEAK and lid in names}
        if self._primed and settings.get("notify_peak", True):
            new = shed_now - self.shed
            if new and (now - self.last_peak_ts >= PEAK_REPEAT_S or not self.shed):
                self.last_peak_ts = now
                self.peak_announced = True
                out.append(Message("peak", self._t("peak_title"), self._t(
                    "peak_shed", limit=_fmt_w(site.get("peak_limit_w")), names=_join([names[i] for i in shed_now])),
                    "solarmind_peak"))
            elif self.shed and not shed_now and self.peak_announced:
                self.peak_announced = False
                out.append(Message("peak", self._t("peak_title"),
                                   self._t("peak_clear", names=_join([names[i] for i in self.shed if i in names])),
                                   "solarmind_peak"))
        self.shed = shed_now

        # --- EV: refused commands and charging complete
        for cfg in loads:
            if cfg.get("type") != "ev":
                continue
            lid = cfg["id"]
            lv = loads_live.get(lid) or {}
            err = lv.get("driver_error")
            state = lv.get("car_state")
            if self._primed and settings.get("notify_ev", True):
                if err and err != self.ev_error.get(lid):
                    out.append(Message("ev", self._t("ev_title", name=names[lid]),
                                       self._t("ev_refused", reason=err), f"solarmind_ev_{lid}"))
                prev = self.car_state.get(lid)
                if state == "Complete" and prev not in (None, "Complete"):
                    soc = lv.get("soc")
                    out.append(Message("ev", self._t("ev_title", name=names[lid]),
                                       self._t("ev_complete", soc=f"{round(soc)}%" if soc is not None else "?"),
                                       f"solarmind_ev_{lid}"))
            self.ev_error[lid] = err
            if state:
                self.car_state[lid] = state

        # --- faults: unreachable loads and grid meter (debounced)
        current_down: dict[str, str] = {}
        for cfg in loads:
            lv = loads_live.get(cfg["id"]) or {}
            if not cfg.get("enabled", True) or lv.get("reason") in SKIP_REASONS:
                continue
            if lv and (lv.get("available") is False or lv.get("reason") == R_UNAVAILABLE) and site.get("available", True):
                current_down[cfg["id"]] = names[cfg["id"]]
        if site.get("available") is False:
            current_down["grid"] = ""
        for key in current_down:
            self.down_since.setdefault(key, now)
        for key in list(self.down_since):
            if key not in current_down:
                del self.down_since[key]
        notify_faults = settings.get("notify_faults", True)
        for key, name in current_down.items():
            if key not in self.reported_down and now - self.down_since[key] >= FAULT_DEBOUNCE_S:
                self.reported_down.add(key)
                if notify_faults:
                    text = self._t("fault_grid") if key == "grid" else self._t("fault_load", name=name)
                    out.append(Message("fault", self._t("fault_title"), text, f"solarmind_fault_{key}"))
        for key in list(self.reported_down):
            if key not in current_down:
                self.reported_down.discard(key)
                if notify_faults and (key == "grid" or key in names):
                    text = self._t("fault_grid_ok") if key == "grid" else self._t("fault_load_ok", name=names[key])
                    out.append(Message("fault", self._t("fault_title"), text, f"solarmind_fault_{key}"))

        self._primed = True
        return out

    def test_message(self) -> Message:
        return Message("test", self._t("test_title"), self._t("test"), "solarmind_test")


def notify_targets(settings: dict[str, Any]) -> list[str]:
    """notify service names (without the ``notify.`` prefix) chosen in the settings."""
    raw = settings.get("notify_services") or []
    if isinstance(raw, str):
        raw = [raw]
    return [s.split(".", 1)[1] if s.startswith("notify.") else s for s in raw if s]


async def async_send(hass: HomeAssistant, settings: dict[str, Any], messages: list[Message]) -> None:
    for msg in messages:
        for service in notify_targets(settings):
            if not hass.services.has_service("notify", service):
                _LOGGER.warning("SolarMind: notify.%s does not exist", service)
                continue
            data: dict[str, Any] = {"title": msg.title, "message": msg.message}
            if service.startswith("mobile_app_"):
                data["data"] = {"tag": msg.tag, "group": "solarmind"}
            try:
                await hass.services.async_call("notify", service, data, blocking=False)
            except Exception:  # noqa: BLE001 - never let a notification break the control loop
                _LOGGER.exception("SolarMind: sending notification via notify.%s failed", service)
