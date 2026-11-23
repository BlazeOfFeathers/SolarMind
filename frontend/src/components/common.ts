import { t } from "../i18n";
import type { SegOption } from "./shared/sm-segmented";

export const MODE_ICONS: Record<string, string> = {
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off",
};

export const modeOptions = (): SegOption[] =>
  ["solar", "solar_night", "on", "off"].map((m) => ({ value: m, label: t(`mode.${m}`), icon: MODE_ICONS[m] }));

export const reasonTone = (r: string): string => {
  if (r === "solar") return "solar";
  if (["night", "always_on", "legionella", "min_soc"].includes(r)) return "grid";
  if (r === "peak_guard" || r === "unavailable") return "warn";
  if (r === "target_reached") return "ok";
  return "";
};

export const reasonIcon = (r: string): string =>
  ({
    solar: "mdi:white-balance-sunny",
    night: "mdi:weather-night",
    always_on: "mdi:power-plug",
    legionella: "mdi:bacteria-outline",
    min_soc: "mdi:battery-alert-variant-outline",
    peak_guard: "mdi:transmission-tower",
    unavailable: "mdi:alert-circle-outline",
    target_reached: "mdi:check-circle-outline",
  })[r] ?? "mdi:circle-small";

export const LOAD_COLORS = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
