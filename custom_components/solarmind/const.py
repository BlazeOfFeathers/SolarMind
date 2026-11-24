"""Constants for SolarMind."""

from __future__ import annotations

DOMAIN = "solarmind"
VERSION = "0.2.2"

PLATFORMS = ["sensor", "select", "switch", "binary_sensor"]

STORAGE_VERSION = 1
STORAGE_KEY = DOMAIN
HISTORY_STORAGE_KEY = f"{DOMAIN}_history"

# Control loop
UPDATE_INTERVAL = 10  # seconds

# Load types
LOAD_SWITCH = "switch"  # on/off load such as a boiler on a smart plug
LOAD_EV = "ev"  # variable power load (EV charger, amps adjustable)
LOAD_BATTERY = "battery"  # home battery: takes surplus and can also deliver power
LOAD_TYPES = [LOAD_SWITCH, LOAD_EV, LOAD_BATTERY]

# EV drivers
EV_DRIVER_ENTITIES = "entities"  # switch + number entity (any integration)
EV_DRIVER_TESLA_BLE = "tesla_ble_proxy"  # direct REST calls to TeslaBleHttpProxy
EV_DRIVERS = [EV_DRIVER_ENTITIES, EV_DRIVER_TESLA_BLE]

# Load modes
MODE_OFF = "off"
MODE_SOLAR = "solar"
MODE_SOLAR_NIGHT = "solar_night"
MODE_ON = "on"
MODE_SELF = "self"  # battery only: charge on surplus, discharge to cover the house
MODES = [MODE_SELF, MODE_SOLAR, MODE_SOLAR_NIGHT, MODE_ON, MODE_OFF]
LOAD_MODES = [MODE_SOLAR, MODE_SOLAR_NIGHT, MODE_ON, MODE_OFF]
BATTERY_MODES = [MODE_SELF, MODE_SOLAR, MODE_SOLAR_NIGHT, MODE_ON, MODE_OFF]

# What a discharging battery may supply
BAT_FOR_HOUSE = "house"  # only the house (base load), never the managed loads
BAT_FOR_HOUSE_SWITCH = "house_switch"  # house + on/off loads running from the grid (boilers)
BAT_FOR_ALL = "all"  # house + every load running from the grid (also the EV)
BAT_FOR = [BAT_FOR_HOUSE, BAT_FOR_HOUSE_SWITCH, BAT_FOR_ALL]

# Battery power sensor / setpoint sign
BAT_SIGN_CHARGE_POSITIVE = "charge_positive"
BAT_SIGN_DISCHARGE_POSITIVE = "discharge_positive"

# Reasons (why a load is in its current state). Stored in history as short codes.
R_IDLE = "idle"
R_SOLAR = "solar"
R_NO_SURPLUS = "no_surplus"
R_NIGHT = "night"
R_ALWAYS_ON = "always_on"
R_MODE_OFF = "mode_off"
R_PEAK = "peak_guard"
R_LEGIONELLA = "legionella"
R_MIN_SOC = "min_soc"
R_MIN_POWER = "min_power"
R_TARGET_REACHED = "target_reached"
R_HOLD_MIN_ON = "min_on_time"
R_HOLD_MIN_OFF = "min_off_time"
R_WAIT_START = "start_delay"
R_WAIT_STOP = "stop_delay"
R_UNAVAILABLE = "unavailable"
R_DISABLED = "disabled"
R_NOT_CONNECTED = "not_connected"
R_SELF_CONSUMPTION = "self_consumption"  # battery covers the house
R_RESERVE = "reserve"  # battery at its minimum SoC
R_BAT_FULL = "battery_full"

REASONS = [
    R_IDLE,
    R_SOLAR,
    R_NO_SURPLUS,
    R_NIGHT,
    R_ALWAYS_ON,
    R_MODE_OFF,
    R_PEAK,
    R_LEGIONELLA,
    R_MIN_SOC,
    R_MIN_POWER,
    R_TARGET_REACHED,
    R_HOLD_MIN_ON,
    R_HOLD_MIN_OFF,
    R_WAIT_START,
    R_WAIT_STOP,
    R_UNAVAILABLE,
    R_DISABLED,
    R_NOT_CONNECTED,
    R_SELF_CONSUMPTION,
    R_RESERVE,
    R_BAT_FULL,
]

# Grid sensor sign conventions
GRID_SIGN_IMPORT_POSITIVE = "import_positive"
GRID_SIGN_EXPORT_POSITIVE = "export_positive"

DEFAULT_SETTINGS: dict = {
    "enabled": True,
    # Grid measurement: either one net power sensor, or separate import/export sensors.
    "grid_mode": "single",  # single | split
    "grid_power_entity": None,
    "grid_sign": GRID_SIGN_IMPORT_POSITIVE,
    "grid_import_entity": None,
    "grid_export_entity": None,
    "pv_power_entity": None,
    "pv_forecast_today_entity": None,
    "pv_forecast_tomorrow_entity": None,
    # Capacity tariff peak guard (Belgium: monthly max of 15-min average import).
    "peak_guard_enabled": True,
    "peak_limit_w": 2500,  # never let the quarter average exceed this (min. billed is 2.5 kW)
    "peak_follow_month_max": True,  # allow up to this month's peak already set
    "peak_margin_w": 200,
    # Off-peak / night window used by "solar + night" mode.
    "night_start": "22:00",
    "night_end": "07:00",
    # Prices for savings estimates.
    "price_import": 0.30,
    "price_export": 0.04,
    "voltage": 230,
    # Notifications (notify.* services, e.g. the Companion app)
    "notify_services": [],
    "notify_peak": True,
    "notify_ev": True,
    "notify_faults": True,
}

DEFAULT_LOAD: dict = {
    "id": None,
    "name": "",
    "type": LOAD_SWITCH,
    "enabled": True,
    "mode": MODE_SOLAR,
    "icon": "mdi:water-boiler",
    # Power
    "nominal_power_w": 2000,
    "power_entity": None,  # measured power of the load (smart plug)
    # Switch load
    "switch_entity": None,
    "temperature_entity": None,
    "max_temperature": None,  # stop when reached (optional)
    # Hysteresis / timing
    "start_delay_s": 60,
    "stop_delay_s": 120,
    "min_on_s": 600,
    "min_off_s": 300,
    "allowed_import_w": 200,  # tolerated grid import while running on solar
    "start_margin_w": 100,  # extra surplus needed before starting
    "peak_shed": True,  # may be switched off by the peak guard
    # Solar + night
    "night_min_solar_kwh": 4.0,  # run at night when the load got less than this from solar today
    "night_target_kwh": 4.0,  # energy to deliver during the night (0 = until load stops drawing)
    "night_min_temperature": None,  # or: run at night when temperature below this
    "night_skip_forecast_kwh": None,  # skip night run if tomorrow's forecast exceeds this
    # Legionella (boilers)
    "legionella_enabled": False,
    "legionella_temperature": 60,
    "legionella_interval_days": 7,
    # Full detection: if switched on but drawing less than this, the thermostat cut it.
    "full_threshold_w": 50,
    # EV
    "ev_driver": EV_DRIVER_ENTITIES,
    "ev_charge_switch_entity": None,
    "ev_current_entity": None,  # number entity for charging amps
    "ev_soc_entity": None,
    "ev_plugged_entity": None,  # binary_sensor / sensor telling the cable is connected
    "ev_proxy_url": "http://localhost:8080",
    "ev_vin": "",
    "ev_phases": 1,
    "ev_min_current": 6,
    "ev_max_current": 16,
    "ev_min_soc": None,  # charge from grid immediately below this SoC
    "ev_target_soc": 80,  # night fallback target
    "ev_battery_kwh": None,  # usable battery size; None = learn it from sessions
    "ev_charge_limit_entity": None,  # entities driver: the car's charge limit (%)
    "ev_min_power_w": None,  # Solar mode: always charge at least this, topped up from the grid
    "ev_current_step_interval_s": 30,
    # Home battery
    "bat_soc_entity": None,
    "bat_power_entity": None,  # measured battery power
    "bat_power_sign": BAT_SIGN_CHARGE_POSITIVE,
    "bat_setpoint_entity": None,  # number: one signed power setpoint (W or kW)
    "bat_setpoint_sign": BAT_SIGN_CHARGE_POSITIVE,
    "bat_charge_entity": None,  # or two numbers: charge power ...
    "bat_discharge_entity": None,  # ... and discharge power
    "bat_mode_entity": None,  # optional select to put the inverter in remote/forced control
    "bat_mode_remote_option": "",
    "bat_mode_auto_option": "",
    "bat_capacity_kwh": 10.0,
    "bat_max_charge_w": 3000,
    "bat_max_discharge_w": 3000,
    "bat_min_soc": 10,  # self consumption stops here (reserve)
    "bat_peak_min_soc": 5,  # the peak guard may use the battery down to here
    "bat_max_soc": 100,  # solar charging stops here
    "bat_target_soc": 80,  # grid charging ("On", night) stops here
    "bat_discharge_for": BAT_FOR_HOUSE,
    "bat_peak_support": True,  # discharge to keep the quarter peak under the limit
    "bat_deadband_w": 50,  # ignore setpoint changes smaller than this
}
