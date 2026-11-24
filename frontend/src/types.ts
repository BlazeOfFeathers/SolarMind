export interface Hass {
  language: string;
  states: Record<string, { entity_id: string; state: string; attributes: Record<string, any> }>;
  connection: {
    sendMessagePromise<T = any>(msg: Record<string, any>): Promise<T>;
    subscribeMessage<T = any>(cb: (msg: T) => void, msg: Record<string, any>): Promise<() => void>;
  };
  themes?: { darkMode?: boolean };
  services?: Record<string, Record<string, unknown>>;
}

export type Mode = "self" | "solar" | "solar_night" | "on" | "off";

export interface Load {
  id: string;
  name: string;
  type: "switch" | "ev" | "battery";
  enabled: boolean;
  mode: Mode;
  icon: string;
  [key: string]: any;
}

export interface Settings {
  [key: string]: any;
}

export interface LiveLoad {
  available: boolean;
  is_on: boolean;
  power_w: number;
  solar_w: number;
  current_a: number | null;
  target_current_a: number | null;
  soc: number | null;
  temperature: number | null;
  plugged: boolean | null;
  reason: string;
  allocated_w: number;
  is_full: boolean;
  night_needed: boolean | null;
  kwh_today?: number;
  solar_kwh_today?: number;
  runtime_today_s?: number;
  // EV only
  battery_kwh?: number | null;
  battery_kwh_learned?: number | null;
  battery_kwh_source?: "set" | "learned" | "car" | null;
  charge_limit?: number | null;
  eta_full_s?: number | null;
  eta_limit_s?: number | null;
  eta_estimated?: boolean;
  eta_source?: "car" | "calc" | null;
  car_state?: string | null;
  // Battery only (power_w is + charging, - discharging)
  setpoint_w?: number | null;
  capacity_kwh?: number | null;
  stored_kwh?: number | null;
  eta_empty_s?: number | null;
  discharge_kwh_today?: number;
  driver_error?: string | null;
  // Planner
  plan?: Record<string, any> | null;
  need_learned_kwh?: number | null;
}

export interface Live {
  site: Record<string, any>;
  loads: Record<string, LiveLoad>;
  order: string[];
}

export interface ConfigPayload {
  version: string;
  settings: Settings;
  loads: Load[];
  defaults: { load: Load; settings: Settings };
  modes: Mode[];
  load_types: string[];
  reasons: string[];
  live: Live;
}
