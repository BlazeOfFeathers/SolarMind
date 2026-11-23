import { css } from "lit";

export const shared = css`
  :host {
    --sm-solar: #f5a623;
    --sm-grid: #5b8def;
    --sm-export: #3fb68b;
    --sm-warn: #e0533d;
    --sm-muted: var(--secondary-text-color, #777);
    --sm-card: var(--card-background-color, #fff);
    --sm-border: var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .card {
    background: var(--sm-card);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.15));
    border: var(--ha-card-border-width, 0) solid var(--sm-border);
    padding: 16px;
    margin-bottom: 16px;
  }
  h2 { font-size: 1.15rem; font-weight: 500; margin: 0 0 12px; }
  h3 { font-size: 1rem; font-weight: 500; margin: 16px 0 8px; }
  .muted { color: var(--sm-muted); font-size: 0.9em; }
  .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .spacer { flex: 1; }
  button {
    font: inherit; cursor: pointer; border-radius: 8px; padding: 6px 14px;
    border: 1px solid var(--sm-border); background: transparent; color: inherit;
  }
  button.primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }
  button.danger { color: var(--sm-warn); border-color: var(--sm-warn); }
  button:disabled { opacity: 0.5; cursor: default; }
  .chip {
    display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 999px; font-size: 0.85em;
    background: rgba(127, 127, 127, 0.15);
  }
  .chip.solar { background: rgba(245, 166, 35, 0.2); }
  .chip.grid { background: rgba(91, 141, 239, 0.2); }
  .chip.warn { background: rgba(224, 83, 61, 0.2); }
  .seg { display: inline-flex; border: 1px solid var(--sm-border); border-radius: 8px; overflow: hidden; }
  .seg button { border: 0; border-radius: 0; padding: 4px 10px; font-size: 0.85em; }
  .seg button + button { border-left: 1px solid var(--sm-border); }
  .seg button.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
  .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px 16px; }
  label.field { display: flex; flex-direction: column; gap: 4px; font-size: 0.9em; }
  label.check { display: flex; align-items: center; gap: 8px; font-size: 0.95em; }
  input, select {
    font: inherit; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--sm-border);
    background: var(--input-fill-color, var(--secondary-background-color, transparent)); color: inherit;
  }
  table { border-collapse: collapse; width: 100%; font-size: 0.9em; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--sm-border); }
  th { font-weight: 500; color: var(--sm-muted); }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .stat { display: flex; flex-direction: column; }
  .stat .v { font-size: 1.4rem; font-weight: 500; font-variant-numeric: tabular-nums; }
  .stat .l { font-size: 0.8rem; color: var(--sm-muted); }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
  .banner { padding: 10px 14px; border-radius: 8px; background: rgba(224, 83, 61, 0.12); margin-bottom: 12px; }
`;

export const fmtW = (w: number | null | undefined): string => {
  if (w === null || w === undefined || Number.isNaN(w)) return "–";
  const a = Math.abs(w);
  return a >= 1000 ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`;
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
export const fmtEur = (v: number | null | undefined): string =>
  v === null || v === undefined ? "–" : `€ ${v.toFixed(2)}`;
