"""Device drivers: read a load's state and apply decisions.

* ``SwitchDriver``: any on/off entity (smart plug ``switch``, ``input_boolean``, ``light``).
* ``EvEntitiesDriver``: EV charging via entities of any integration
  (charge switch + charging amps ``number``), e.g. the Tesla BLE MQTT/ESPHome entities.
* ``TeslaBleProxyDriver``: direct REST calls to TeslaBleHttpProxy
  (``/api/1/vehicles/{vin}/command/...``).
"""

from __future__ import annotations

import logging
import time
from typing import Any

import aiohttp
from homeassistant.const import STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import EV_DRIVER_TESLA_BLE, LOAD_EV
from .control.allocator import Decision, LoadState

_LOGGER = logging.getLogger(__name__)

RESEND_AFTER_S = 60
TESLA_POLL_S = 60
TESLA_TIMEOUT_S = 30
BAD_STATES = (STATE_UNAVAILABLE, STATE_UNKNOWN, None)


def read_float(hass: HomeAssistant, entity_id: str | None, to_watts: bool = False) -> float | None:
    """Numeric state of an entity; converts kW to W when ``to_watts``."""
    if not entity_id:
        return None
    st = hass.states.get(entity_id)
    if st is None or st.state in BAD_STATES:
        return None
    try:
        value = float(st.state)
    except (TypeError, ValueError):
        return None
    if to_watts:
        unit = (st.attributes.get("unit_of_measurement") or "").lower()
        if unit == "kw":
            value *= 1000
        elif unit == "mw":
            value *= 1_000_000
    return value


def read_bool(hass: HomeAssistant, entity_id: str | None) -> bool | None:
    if not entity_id:
        return None
    st = hass.states.get(entity_id)
    if st is None or st.state in BAD_STATES:
        return None
    s = str(st.state).lower()
    if s in ("on", "true", "home", "connected", "plugged", "plugged_in", "charging", "complete", "stopped", "1"):
        return True
    if s in ("off", "false", "disconnected", "unplugged", "not_home", "0"):
        return False
    return None


async def _turn(hass: HomeAssistant, entity_id: str, on: bool) -> None:
    domain = entity_id.split(".", 1)[0]
    if domain not in ("switch", "input_boolean", "light", "fan"):
        domain = "homeassistant"
    await hass.services.async_call(domain, "turn_on" if on else "turn_off", {"entity_id": entity_id}, blocking=False)


class BaseDriver:
    def __init__(self, hass: HomeAssistant, cfg: dict[str, Any]) -> None:
        self.hass = hass
        self.cfg = cfg
        self._last_cmd: tuple[Any, ...] | None = None
        self._last_cmd_ts = 0.0

    def _should_send(self, cmd: tuple[Any, ...]) -> bool:
        now = time.monotonic()
        if cmd == self._last_cmd and now - self._last_cmd_ts < RESEND_AFTER_S:
            return False
        self._last_cmd = cmd
        self._last_cmd_ts = now
        return True

    async def async_read(self) -> LoadState:
        raise NotImplementedError

    async def async_apply(self, st: LoadState, dec: Decision) -> bool:
        """Apply a decision. Returns True when the on/off state was changed."""
        raise NotImplementedError

    async def async_close(self) -> None:
        return None


class SwitchDriver(BaseDriver):
    async def async_read(self) -> LoadState:
        ent = self.cfg.get("switch_entity")
        st = self.hass.states.get(ent) if ent else None
        if st is None or st.state in BAD_STATES:
            return LoadState(available=False)
        return LoadState(
            available=True,
            is_on=st.state == STATE_ON,
            power_w=read_float(self.hass, self.cfg.get("power_entity"), to_watts=True),
            temperature=read_float(self.hass, self.cfg.get("temperature_entity")),
        )

    async def async_apply(self, st: LoadState, dec: Decision) -> bool:
        if dec.on is None or dec.on == st.is_on:
            self._last_cmd = None
            return False
        if self._should_send(("switch", dec.on)):
            await _turn(self.hass, self.cfg["switch_entity"], dec.on)
            return True
        return False


class EvEntitiesDriver(BaseDriver):
    async def async_read(self) -> LoadState:
        sw = self.cfg.get("ev_charge_switch_entity")
        st = self.hass.states.get(sw) if sw else None
        if st is None or st.state in BAD_STATES:
            return LoadState(available=False)
        return LoadState(
            available=True,
            is_on=st.state == STATE_ON,
            power_w=read_float(self.hass, self.cfg.get("power_entity"), to_watts=True),
            current_a=read_float(self.hass, self.cfg.get("ev_current_entity")),
            soc=read_float(self.hass, self.cfg.get("ev_soc_entity")),
            plugged=read_bool(self.hass, self.cfg.get("ev_plugged_entity")),
            charge_limit=read_float(self.hass, self.cfg.get("ev_charge_limit_entity")),
        )

    async def async_apply(self, st: LoadState, dec: Decision) -> bool:
        changed = False
        if dec.on is None:
            return False
        cur_ent = self.cfg.get("ev_current_entity")
        if dec.on and dec.current_a is not None and cur_ent:
            cur = None if st.current_a is None else int(round(st.current_a))
            if cur != dec.current_a and self._should_send(("amps", dec.current_a)):
                await self.hass.services.async_call(
                    "number", "set_value", {"entity_id": cur_ent, "value": dec.current_a}, blocking=False
                )
        if dec.on != st.is_on and self._should_send(("switch", dec.on)):
            await _turn(self.hass, self.cfg["ev_charge_switch_entity"], dec.on)
            changed = True
        return changed


class TeslaBleProxyDriver(BaseDriver):
    """Talks to https://github.com/wimaha/TeslaBleHttpProxy."""

    def __init__(self, hass: HomeAssistant, cfg: dict[str, Any]) -> None:
        super().__init__(hass, cfg)
        self._charge_state: dict[str, Any] | None = None
        self._last_poll = 0.0
        self._fail_count = 0

    @property
    def _base(self) -> str:
        return f"{self.cfg['ev_proxy_url'].rstrip('/')}/api/1/vehicles/{self.cfg['ev_vin']}"

    async def _poll(self, force: bool = False) -> None:
        now = time.monotonic()
        if not force and now - self._last_poll < TESLA_POLL_S:
            return
        self._last_poll = now
        session = async_get_clientsession(self.hass)
        try:
            async with session.get(
                f"{self._base}/vehicle_data",
                params={"endpoints": "charge_state"},
                timeout=aiohttp.ClientTimeout(total=TESLA_TIMEOUT_S),
            ) as resp:
                data = await resp.json(content_type=None)
            cs = _find_key(data, "charge_state")
            if isinstance(cs, dict):
                self._charge_state = cs
                self._fail_count = 0
                return
            self._fail_count += 1
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            self._fail_count += 1
            _LOGGER.debug("Tesla BLE proxy poll failed: %s", err)
        # On failures (car asleep, BLE out of range) keep the last known state: commands
        # sent through the proxy wake the car anyway.

    async def _command(self, command: str, body: dict[str, Any] | None = None) -> bool:
        session = async_get_clientsession(self.hass)
        try:
            async with session.post(
                f"{self._base}/command/{command}",
                json=body or {},
                timeout=aiohttp.ClientTimeout(total=TESLA_TIMEOUT_S),
            ) as resp:
                ok = resp.status < 300
                if not ok:
                    _LOGGER.warning("Tesla BLE proxy %s failed: HTTP %s", command, resp.status)
                return ok
        except (aiohttp.ClientError, TimeoutError) as err:
            _LOGGER.warning("Tesla BLE proxy %s failed: %s", command, err)
            return False

    async def async_read(self) -> LoadState:
        await self._poll()
        cs = self._charge_state
        if cs is None:
            return LoadState(available=False)
        charging_state = str(cs.get("charging_state", "")).lower()
        plugged = charging_state not in ("disconnected", "")
        power_w = None
        if charging_state == "complete":
            power_w = 0.0
        elif cs.get("charger_power") is not None:
            power_w = float(cs["charger_power"]) * 1000
        if self.cfg.get("power_entity"):
            power_w = read_float(self.hass, self.cfg["power_entity"], to_watts=True)
        soc = cs.get("battery_level")
        if self.cfg.get("ev_soc_entity"):
            soc = read_float(self.hass, self.cfg["ev_soc_entity"])
        return LoadState(
            available=True,
            # "Complete" counts as on with ~0 W, so SolarMind sees the car as full instead of
            # sending charge_start again and again.
            is_on=charging_state in ("charging", "starting", "complete"),
            power_w=power_w,
            current_a=cs.get("charge_current_request", cs.get("charge_amps")),
            soc=None if soc is None else float(soc),
            plugged=plugged,
            charge_limit=_float_or_none(cs.get("charge_limit_soc")),
        )

    async def async_apply(self, st: LoadState, dec: Decision) -> bool:
        if dec.on is None:
            return False
        changed = False
        if dec.on and dec.current_a is not None:
            cur = None if st.current_a is None else int(round(st.current_a))
            if cur != dec.current_a and self._should_send(("amps", dec.current_a)):
                if await self._command("set_charging_amps", {"charging_amps": dec.current_a}):
                    if self._charge_state is not None:
                        self._charge_state["charge_current_request"] = dec.current_a
        if dec.on != st.is_on and self._should_send(("switch", dec.on)):
            if await self._command("charge_start" if dec.on else "charge_stop"):
                changed = True
                if self._charge_state is not None:
                    self._charge_state["charging_state"] = "Charging" if dec.on else "Stopped"
            self._last_poll = 0.0  # re-read soon
        return changed


def _float_or_none(value: Any) -> float | None:
    try:
        return None if value is None else float(value)
    except (TypeError, ValueError):
        return None


def _find_key(data: Any, key: str) -> Any:
    if isinstance(data, dict):
        if key in data:
            return data[key]
        for value in data.values():
            found = _find_key(value, key)
            if found is not None:
                return found
    return None


def make_driver(hass: HomeAssistant, cfg: dict[str, Any]) -> BaseDriver:
    if cfg["type"] == LOAD_EV:
        if cfg.get("ev_driver") == EV_DRIVER_TESLA_BLE:
            return TeslaBleProxyDriver(hass, cfg)
        return EvEntitiesDriver(hass, cfg)
    return SwitchDriver(hass, cfg)
