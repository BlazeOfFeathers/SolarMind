import { t } from "../i18n";
import type { SegOption } from "./shared/sm-segmented";

export const MODE_ICONS: Record<string, string> = {
  self: "mdi:home-battery-outline",
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off",
};

export const isBattery = (l: { type?: string } | undefined | null) => l?.type === "battery";

export const modesFor = (type?: string): string[] =>
  type === "battery" ? ["self", "solar", "solar_night", "on", "off"] : ["solar", "solar_night", "on", "off"];

/** Mode label/description key: batteries have their own wording. */
export const modeKey = (m: string, type?: string) => (type === "battery" && m !== "self" ? `mode.bat.${m}` : `mode.${m}`);

export const modeOptions = (type?: string): SegOption[] =>
  modesFor(type).map((m) => ({ value: m, label: t(modeKey(m, type)), icon: MODE_ICONS[m] }));

export const defaultIcon = (type?: string) =>
  type === "ev" ? "mdi:ev-station" : type === "battery" ? "mdi:home-battery" : "mdi:water-boiler";

export const reasonTone = (r: string): string => {
  if (r === "solar") return "solar";
  if (r === "self_consumption") return "ok";
  if (["night", "always_on", "legionella", "min_soc", "min_power", "planned"].includes(r)) return "grid";
  if (r === "peak_guard" || r === "unavailable") return "warn";
  if (r === "target_reached" || r === "battery_full") return "ok";
  if (r === "reserve") return "warn";
  return "";
};

export const reasonIcon = (r: string): string =>
  ({
    solar: "mdi:white-balance-sunny",
    night: "mdi:weather-night",
    always_on: "mdi:power-plug",
    legionella: "mdi:bacteria-outline",
    min_soc: "mdi:battery-alert-variant-outline",
    min_power: "mdi:speedometer-slow",
    peak_guard: "mdi:transmission-tower",
    unavailable: "mdi:alert-circle-outline",
    target_reached: "mdi:check-circle-outline",
    self_consumption: "mdi:home-lightning-bolt-outline",
    reserve: "mdi:battery-10",
    battery_full: "mdi:battery",
    planned: "mdi:calendar-clock",
    plan_wait: "mdi:timer-sand",
  })[r] ?? "mdi:circle-small";

export const LOAD_COLORS = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
