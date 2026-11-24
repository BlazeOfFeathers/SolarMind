import { css } from "lit";

/** Design tokens; values derive from Home Assistant's theme variables only. */
export const tokens = css`
  :host {
    --sm-radius: var(--ha-card-border-radius, 12px);
    --sm-radius-sm: 8px;
    --sm-fill: color-mix(in srgb, var(--secondary-text-color) 8%, transparent);
    --sm-fill-strong: color-mix(in srgb, var(--secondary-text-color) 14%, transparent);
    --sm-fill-primary: color-mix(in srgb, var(--primary-color) 10%, transparent);
    --sm-solar: var(--energy-solar-color, #ff9800);
    --sm-grid: var(--energy-grid-consumption-color, #488fc2);
    --sm-export: var(--energy-grid-return-color, #8353d1);
    --sm-ok: var(--success-color, #43a047);
    --sm-warn: var(--warning-color, #ffa600);
    --sm-err: var(--error-color, #db4437);
    --sm-solar-text: color-mix(in srgb, var(--sm-solar) 50%, var(--primary-text-color));
    --sm-grid-text: color-mix(in srgb, var(--sm-grid) 50%, var(--primary-text-color));
    --sm-ok-text: color-mix(in srgb, var(--sm-ok) 50%, var(--primary-text-color));
    --sm-warn-text: color-mix(in srgb, var(--sm-warn) 50%, var(--primary-text-color));
    --sm-err-text: color-mix(in srgb, var(--sm-err) 50%, var(--primary-text-color));
    --sm-border: var(--divider-color);
    --sm-border-strong: color-mix(in srgb, var(--primary-text-color) 22%, transparent);
    --sm-surface: var(--card-background-color, var(--ha-card-background, #fff));
    --sm-shadow-pop: 0 1px 3px rgb(0 0 0 / 12%), 0 8px 24px rgb(0 0 0 / 22%);
    --sm-touch: 44px;
  }
`;

/** Card look shared by all panels (matches ha-card). */
export const cardStyles = css`
  .card {
    background: var(--sm-surface);
    border-radius: var(--sm-radius);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--sm-border));
    box-shadow: var(--ha-card-box-shadow, none);
    box-sizing: border-box;
    min-width: 0;
  }
  .card-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 16px 8px;
  }
  .card-head h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    flex: 1;
  }
  .card-head .meta {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .card-body {
    padding: 0 16px 16px;
  }
  .muted {
    color: var(--secondary-text-color);
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    border-radius: 15px;
    border: 1px solid var(--sm-border);
    background: var(--sm-fill);
    font-size: 13px;
    white-space: nowrap;
    --mdc-icon-size: 16px;
  }
  .pill b {
    font-weight: 600;
  }
  .hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 14px;
    border: 1px solid var(--sm-border);
    background: var(--sm-surface);
    font-size: 12px;
    --mdc-icon-size: 14px;
  }
  button.text {
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    background: none;
    border: none;
    padding: 8px 12px;
    border-radius: var(--sm-radius-sm);
    cursor: pointer;
  }
  button.text:hover {
    background: var(--sm-fill-primary);
  }
  button.filled {
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #fff);
    background: var(--primary-color);
    border: none;
    padding: 8px 16px;
    border-radius: var(--sm-radius-sm);
    cursor: pointer;
  }
  button.filled:disabled {
    opacity: 0.5;
    cursor: default;
  }
  button.icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    flex: none;
    --mdc-icon-size: 24px;
  }
  button.icon:hover {
    background: var(--sm-fill);
  }
  button.icon:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

export const fmtW = (w: number | null | undefined): string => {
  if (w === null || w === undefined || Number.isNaN(w)) return "–";
  return Math.abs(w) >= 1000 ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`;
};
export const splitW = (w: number | null | undefined): [string, string] => {
  if (w === null || w === undefined || Number.isNaN(w)) return ["–", ""];
  return Math.abs(w) >= 1000 ? [(w / 1000).toFixed(2), "kW"] : [String(Math.round(w)), "W"];
};
export const fmtKwh = (v: number | null | undefined, d = 2): string =>
  v === null || v === undefined ? "–" : `${v.toFixed(d)} kWh`;
export const fmtPct = (v: number | null | undefined): string =>
  v === null || v === undefined ? "–" : `${Math.round(v * 100)}%`;
export const fmtDur = (s: number | null | undefined): string => {
  if (!s) return "0 min";
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h ? `${h} u ${m} min` : `${m} min`;
};
/** Short duration for an ETA: "7 u 10" or "45 min". */
export const fmtEta = (s: number): string => {
  const mins = Math.max(1, Math.round(s / 60));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return m ? `${h} u ${String(m).padStart(2, "0")}` : `${h} u`;
};
/** Clock time `s` seconds from now: "17:55", with a weekday when it is not today. */
export const fmtClockIn = (s: number): string => {
  const at = new Date(Date.now() + s * 1000);
  const hm = at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  if (at.toDateString() === new Date().toDateString()) return hm;
  return `${at.toLocaleDateString([], { weekday: "short" })} ${hm}`;
};
export const fmtEur = (v: number | null | undefined): string =>
  v === null || v === undefined ? "–" : `€ ${v.toFixed(2)}`;
export const fmtSec = (s: number | null | undefined): string => {
  if (s === null || s === undefined) return "–";
  if (s >= 3600) return `${Math.round((s / 3600) * 10) / 10} u`;
  if (s >= 60) return `${Math.round((s / 60) * 10) / 10} min`;
  return `${s} s`;
};
