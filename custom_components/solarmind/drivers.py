"""Device drivers: read a load's state and apply decisions.

* ``SwitchDriver``: any on/off entity (smart plug ``switch``, ``input_boolean``, ``light``).
* ``EvEntitiesDriver``: EV charging via entities of any integration
  (charge switch + charging amps ``number``), e.g. the Tesla BLE MQTT/ESPHome entities.
* ``TeslaBleProxyDriver``: direct REST calls to TeslaBleHttpProxy
  (``/api/1/vehicles/{vin}/command/...``).
* ``BatteryDriver``: home battery via entities of any integration (SoC and power
  sensors, a power setpoint ``number`` or separate charge/discharge numbers,
  optionally a ``select`` that switches the inverter between remote and auto).
"""

from __future__ import annotations

import logging
import time
from typing import Any

import aiohttp
from homeassistant.const import STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import BAT_SIGN_DISCHARGE_POSITIVE, EV_DRIVER_TESLA_BLE, LOAD_BATTERY, LOAD_EV
from .control.allocator import Decision, LoadState, battery_power_from_sensor

_LOGGER = logging.getLogger(__name__)

RESEND_AFTER_S = 60
TESLA_POLL_S = 60
TESLA_TIMEOUT_S = 30
TESLA_COMMAND_TIMEOUT_S = 45  # commands wait for the car's answer (wait=true)
TESLA_WAKE_TIMEOUT_S = 60
TESLA_WAKE_RETRY_S = 600  # without any known state, wake the car at most every 10 min to read it
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
        self.last_error: str | None = None  # last failed command, shown in the panel

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
        self._last_wake = -TESLA_WAKE_RETRY_S
        self._fail_count = 0

    @property
    def _base(self) -> str:
        return f"{self.cfg['ev_proxy_url'].rstrip('/')}/api/1/vehicles/{self.cfg['ev_vin']}"

    async def _poll(self, force: bool = False) -> None:
        now = time.monotonic()
        if not force and now - self._last_poll < TESLA_POLL_S:
            return
        self._last_poll = now
        if await self._fetch_charge_state(wakeup=False):
            return
        # The proxy does not wake a sleeping car for vehicle_data. Without any known state
        # (e.g. right after a Home Assistant restart) SolarMind could never decide to start
        # charging, so wake the car to read it, but not more than every 10 minutes.
        if self._charge_state is None and now - self._last_wake >= TESLA_WAKE_RETRY_S:
            self._last_wake = now
            _LOGGER.info("Tesla BLE proxy: no charge state yet, waking the car to read it")
            await self._fetch_charge_state(wakeup=True)
        # On other failures (car asleep, BLE out of range) keep the last known state: commands
        # sent through the proxy wake the car anyway.

    async def _fetch_charge_state(self, wakeup: bool) -> bool:
        session = async_get_clientsession(self.hass)
        params = {"endpoints": "charge_state"}
        if wakeup:
            params["wakeup"] = "true"
        try:
            async with session.get(
                f"{self._base}/vehicle_data",
                params=params,
                timeout=aiohttp.ClientTimeout(total=TESLA_WAKE_TIMEOUT_S if wakeup else TESLA_TIMEOUT_S),
            ) as resp:
                data = await resp.json(content_type=None)
                status = resp.status
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            self._fail_count += 1
            _LOGGER.debug("Tesla BLE proxy poll failed: %s", err)
            return False
        cs = _find_key(data, "charge_state")
        if isinstance(cs, dict):
            if self._fail_count:
                _LOGGER.debug("Tesla BLE proxy poll OK again after %s failures", self._fail_count)
            self._charge_state = cs
            self._fail_count = 0
            return True
        self._fail_count += 1
        reason = _find_key(data, "reason") if isinstance(data, dict) else None
        _LOGGER.debug("Tesla BLE proxy returned no charge_state (HTTP %s): %s", status, reason or data)
        return False

    async def _command(self, command: str, body: dict[str, Any] | None = None) -> bool:
        """Send a command and wait for the car's answer, so a refusal is not mistaken for success."""
        session = async_get_clientsession(self.hass)
        try:
            async with session.post(
                f"{self._base}/command/{command}",
                params={"wait": "true"},
                json=body or {},
                timeout=aiohttp.ClientTimeout(total=TESLA_COMMAND_TIMEOUT_S),
            ) as resp:
                status = resp.status
                try:
                    data = await resp.json(content_type=None)
                except ValueError:
                    data = None
        except (aiohttp.ClientError, TimeoutError) as err:
            self.last_error = f"{command}: {err or type(err).__name__}"
            _LOGGER.warning("Tesla BLE proxy %s failed: %s", command, self.last_error)
            return False
        result = _find_key(data, "result") if isinstance(data, dict) else None
        reason = _find_key(data, "reason") if isinstance(data, dict) else None
        if status < 300 and result is not False:
            self.last_error = None
            _LOGGER.debug("Tesla BLE proxy %s OK %s", command, body or "")
            return True
        self.last_error = f"{command}: {reason or f'HTTP {status}'}"
        _LOGGER.warning("Tesla BLE proxy %s refused (HTTP %s): %s", command, status, reason or data)
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
            car_time_to_limit_h=_car_hours_to_limit(cs),
            car_state=str(cs.get("charging_state") or "") or None,
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
                # Re-read in ~20 s: the car needs a moment before it reports the new state.
                self._last_poll = time.monotonic() - TESLA_POLL_S + 20
            else:
                self._last_poll = 0.0  # re-read right away
        return changed


def _car_hours_to_limit(cs: dict[str, Any]) -> float | None:
    """The car's own time-to-charge-limit estimate (the BLE proxy reports minutes)."""
    minutes = _float_or_none(cs.get("minutes_to_full_charge"))
    if minutes is not None:
        return minutes / 60
    return _float_or_none(cs.get("time_to_full_charge"))


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


class BatteryDriver(BaseDriver):
    """Sends a power setpoint (+ charge, - discharge) to the battery's entities."""

    def __init__(self, hass: HomeAssistant, cfg: dict[str, Any]) -> None:
        super().__init__(hass, cfg)
        self._sent_w: float | None = None
        self._sent_ts = 0.0
        self._remote: bool | None = None

    async def async_read(self) -> LoadState:
        soc = read_float(self.hass, self.cfg.get("bat_soc_entity"))
        power = battery_power_from_sensor(self.cfg, read_float(self.hass, self.cfg.get("bat_power_entity"), to_watts=True))
        if soc is None and power is None:
            return LoadState(available=False)
        return LoadState(available=True, is_on=bool(power and abs(power) > 1), power_w=power, soc=soc)

    async def _set_number(self, entity_id: str, watts: float) -> None:
        st = self.hass.states.get(entity_id)
        unit = ((st.attributes.get("unit_of_measurement") if st else None) or "w").lower()
        value: float = watts / 1000 if unit == "kw" else watts
        if st is not None:
            lo, hi = st.attributes.get("min"), st.attributes.get("max")
            if lo is not None:
                value = max(float(lo), value)
            if hi is not None:
                value = min(float(hi), value)
        value = round(value, 3) if unit == "kw" else round(value)
        domain = "input_number" if entity_id.startswith("input_number.") else "number"
        await self.hass.services.async_call(domain, "set_value", {"entity_id": entity_id, "value": value}, blocking=False)

    async def _select(self, option: str) -> None:
        ent = self.cfg.get("bat_mode_entity")
        if not ent or not option:
            return
        st = self.hass.states.get(ent)
        if st is not None and st.state == option:
            return
        domain = "input_select" if ent.startswith("input_select.") else "select"
        await self.hass.services.async_call(domain, "select_option", {"entity_id": ent, "option": option}, blocking=False)

    async def async_apply(self, st: LoadState, dec: Decision) -> bool:
        if dec.on is None:
            return False
        if dec.on is False:
            # Mode off: hand the battery back to the inverter's own control.
            if self._remote is not False:
                await self._release()
            return False
        target = float(dec.setpoint_w or 0.0)
        now = time.monotonic()
        deadband = float(self.cfg.get("bat_deadband_w", 50))
        if (
            self._sent_w is not None
            and abs(target - self._sent_w) < deadband
            and (target == 0) == (self._sent_w == 0)
            and now - self._sent_ts < RESEND_AFTER_S
        ):
            return False
        if self._remote is not True:
            await self._select(self.cfg.get("bat_mode_remote_option", ""))
            self._remote = True
        await self._send(target)
        self._sent_w = target
        self._sent_ts = now
        return False

    async def _send(self, watts: float) -> None:
        sp = self.cfg.get("bat_setpoint_entity")
        if sp:
            value = -watts if self.cfg.get("bat_setpoint_sign") == BAT_SIGN_DISCHARGE_POSITIVE else watts
            await self._set_number(sp, value)
            return
        ch, dis = self.cfg.get("bat_charge_entity"), self.cfg.get("bat_discharge_entity")
        if ch:
            await self._set_number(ch, max(0.0, watts))
        if dis:
            await self._set_number(dis, max(0.0, -watts))

    async def _release(self) -> None:
        self._remote = False
        self._sent_w = None
        if self.cfg.get("bat_mode_entity") and self.cfg.get("bat_mode_auto_option"):
            await self._select(self.cfg["bat_mode_auto_option"])
        else:
            # Without a mode select: a zero setpoint is the safest neutral state.
            await self._send(0.0)

    async def async_close(self) -> None:
        if self._remote:
            try:
                await self._release()
            except Exception:
                _LOGGER.debug("Releasing battery %s failed", self.cfg.get("name"), exc_info=True)


def make_driver(hass: HomeAssistant, cfg: dict[str, Any]) -> BaseDriver:
    if cfg["type"] == LOAD_BATTERY:
        return BatteryDriver(hass, cfg)
    if cfg["type"] == LOAD_EV:
        if cfg.get("ev_driver") == EV_DRIVER_TESLA_BLE:
            return TeslaBleProxyDriver(hass, cfg)
        return EvEntitiesDriver(hass, cfg)
    return SwitchDriver(hass, cfg)
