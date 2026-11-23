import type { ConfigPayload, Hass, Live, Load, Mode, Settings } from "./types";

export const getConfig = (hass: Hass) => hass.connection.sendMessagePromise<ConfigPayload>({ type: "solarmind/config" });
export const saveSettings = (hass: Hass, settings: Settings) =>
  hass.connection.sendMessagePromise({ type: "solarmind/settings/save", settings });
export const saveLoad = (hass: Hass, load: Partial<Load>) =>
  hass.connection.sendMessagePromise<{ load: Load }>({ type: "solarmind/loads/save", load });
export const deleteLoad = (hass: Hass, load_id: string) =>
  hass.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id });
export const reorderLoads = (hass: Hass, order: string[]) =>
  hass.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order });
export const setMode = (hass: Hass, load_id: string, mode: Mode) =>
  hass.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id, mode });
export const getAnalytics = (hass: Hass, start: number, end: number, load_id: string | null) =>
  hass.connection.sendMessagePromise<any>({ type: "solarmind/analytics", start, end, load_id });
export const subscribeLive = (hass: Hass, cb: (live: Live) => void) =>
  hass.connection.subscribeMessage<Live>(cb, { type: "solarmind/subscribe" });
