export interface Hass {
  language: string;
  states: Record<string, { entity_id: string; state: string; attributes: Record<string, any> }>;
  connection: {
    sendMessagePromise<T = any>(msg: Record<string, any>): Promise<T>;
    subscribeMessage<T = any>(cb: (msg: T) => void, msg: Record<string, any>): Promise<() => void>;
  };
  themes?: { darkMode?: boolean };
}

export type Mode = "solar" | "solar_night" | "on" | "off";

export interface Load {
  id: string;
  name: string;
  type: "switch" | "ev";
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
