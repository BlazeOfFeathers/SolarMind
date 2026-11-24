import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getPlan } from "../api";
import { t } from "../i18n";
import { cardStyles, fmtKwh, fmtW, tokens } from "../styles/tokens";
import type { Hass, Load } from "../types";
import { defaultIcon } from "./common";
import type { Panel } from "./sm-chart";
import "./sm-chart";
import "./shared/sm-segmented";

const Q = 900;
const SOLAR = "var(--sm-solar)";
const GRID = "var(--sm-grid)";

interface Cell { solar: number; grid: number; value: number }
interface Row { id: string; label: string; icon: string; kind: "pv" | "house" | "load" | "import"; max: number; cells: Cell[][] }

const hhmm = (ts: number) => new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const dayTime = (ts: number) =>
  new Date(ts * 1000).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });

/** The planner's view: predictions and plan per quarter, as a day-rhythm grid (RoomMind style). */
@customElement("sm-plan")
export class SmPlan extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) loads: Load[] = [];
  @property() loadId: string | null = null;
  @state() private _data: any = null;
  @state() private _hours = 24;
  @state() private _sel: { row: number; col: number } | null = null;
  private _timer?: number;

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: block; }
      .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 16px 8px; flex-wrap: wrap; }
      .bar .meta { font-size: 13px; color: var(--secondary-text-color); }
      .grid { display: grid; gap: 2px; padding: 0 16px; align-items: center; --idle: color-mix(in srgb, var(--primary-text-color) 7%, var(--sm-surface)); }
      .lbl { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px; display: flex; align-items: center; gap: 4px; --mdc-icon-size: 14px; }
      .cell { height: 22px; border-radius: 3px; background: var(--idle); cursor: pointer; position: relative; }
      .cell.sel { box-shadow: 0 0 0 1.5px var(--primary-text-color); }
      .cell.now::before { content: ""; position: absolute; left: -2px; top: -3px; bottom: -3px; width: 2px; background: var(--primary-text-color); border-radius: 1px; }
      .cell.over { box-shadow: inset 0 -3px var(--sm-err); }
      .cell.night { outline: 1px dashed color-mix(in srgb, var(--secondary-text-color) 35%, transparent); outline-offset: -1px; }
      .hours { font-size: 11px; color: var(--secondary-text-color); }
      .detail { margin: 10px 16px 0; padding: 10px 12px; border-radius: var(--sm-radius-sm); background: var(--sm-fill); font-size: 13px; line-height: 1.6; min-height: 20px; }
      .detail b { font-weight: 500; }
      .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; padding: 10px 16px 0; font-size: 12px; color: var(--secondary-text-color); }
      .sw { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
      .sum { padding: 8px 0 4px; }
      .sum .r { display: flex; gap: 12px; padding: 8px 16px; align-items: flex-start; border-top: 1px solid var(--sm-border); --mdc-icon-size: 20px; }
      .sum .r ha-icon { color: var(--secondary-text-color); margin-top: 2px; }
      .sum .n { font-size: 14px; }
      .sum .s { font-size: 13px; color: var(--secondary-text-color); line-height: 1.5; }
      .sum .warn { color: var(--sm-warn-text); }
      .empty { padding: 24px 16px; color: var(--secondary-text-color); font-size: 14px; line-height: 1.5; }
      .chart { padding: 8px 16px 0; }
      .trial { margin: 0 16px 12px; padding: 10px 12px; border-radius: var(--sm-radius-sm); font-size: 13px; line-height: 1.5;
        background: color-mix(in srgb, var(--sm-warn) 14%, transparent); color: var(--sm-warn-text); }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this._fetch();
    this._timer = window.setInterval(() => this._fetch(), 60000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }

  private async _fetch() {
    if (!this.hass) return;
    try {
      this._data = await getPlan(this.hass);
    } catch {
      this._data = null;
    }
  }

  private _rows(plan: any, start: number, cols: number): Row[] {
    const idx0 = Math.round((start - plan.slots[0]) / Q);
    const take = (arr: number[] | undefined, c: number) =>
      Array.from({ length: 4 }, (_, k) => arr?.[idx0 + c * 4 + k] ?? 0);
    const rows: Row[] = [];
    const mk = (id: string, label: string, icon: string, kind: Row["kind"], solar?: number[], grid?: number[], value?: number[], max = 1): Row => ({
      id, label, icon, kind, max,
      cells: Array.from({ length: cols }, (_, c) => {
        const s = take(solar, c), g = take(grid, c), v = take(value ?? solar, c);
        return s.map((_, k) => ({ solar: s[k], grid: g[k], value: v[k] }));
      }),
    });
    const maxOf = (a: number[]) => Math.max(1, ...a);
    if (!this.loadId) {
      rows.push(mk("pv", t("plan.row.pv"), "mdi:white-balance-sunny", "pv", plan.pv_w, undefined, plan.pv_w, maxOf(plan.pv_w)));
      rows.push(mk("house", t("plan.row.house"), "mdi:home-outline", "house", undefined, undefined, plan.base_w, maxOf(plan.base_w)));
    }
    for (const l of this.loads) {
      if (this.loadId && l.id !== this.loadId) continue;
      if (!plan.solar_w[l.id]) continue;
      const power = l.type === "ev" ? l.ev_max_current * 230 * l.ev_phases : l.type === "battery" ? l.bat_max_charge_w : l.nominal_power_w;
      const tot = plan.solar_w[l.id].map((v: number, i: number) => v + (plan.grid_w[l.id]?.[i] ?? 0));
      rows.push(mk(l.id, l.name, l.icon || defaultIcon(l.type), "load", plan.solar_w[l.id], plan.grid_w[l.id], tot, Math.max(1, power || 0)));
    }
    if (!this.loadId) rows.push(mk("import", t("plan.row.import"), "mdi:transmission-tower-import", "import", undefined, plan.import_w, plan.import_w, Math.max(plan.limit_w ?? 0, maxOf(plan.import_w))));
    return rows;
  }

  private _color(row: Row, cell: Cell[]): string {
    const avg = (f: (c: Cell) => number) => cell.reduce((a, c) => a + f(c), 0) / cell.length;
    const v = avg((c) => c.value);
    if (v <= 1) return "";
    const share = Math.min(1, v / row.max);
    const pct = Math.round(30 + 70 * Math.sqrt(share));
    let base = "var(--secondary-text-color)";
    if (row.kind === "pv") base = SOLAR;
    else if (row.kind === "import") base = GRID;
    else if (row.kind === "load") base = avg((c) => c.grid) > avg((c) => c.solar) ? GRID : SOLAR;
    return `color-mix(in srgb, ${base} ${pct}%, var(--idle))`;
  }

  private _detail(rows: Row[], start: number) {
    const sel = this._sel;
    if (!sel) return html`<div class="detail">${t("plan.hint")}</div>`;
    const row = rows[sel.row];
    const cell = row?.cells[sel.col];
    if (!cell) return nothing;
    const from = start + sel.col * 3600;
    const parts = cell.map((c, k) => {
      const at = hhmm(from + k * Q);
      if (row.kind === "load") {
        if (c.grid > 1 && c.solar > 1) return html`<div>${at} · ${fmtW(c.solar)} ${t("plan.from_sun")} + ${fmtW(c.grid)} ${t("plan.from_grid")}</div>`;
        if (c.grid > 1) return html`<div>${at} · <b>${fmtW(c.grid)}</b> ${t("plan.from_grid")}</div>`;
        if (c.solar > 1) return html`<div>${at} · <b>${fmtW(c.solar)}</b> ${t("plan.from_sun")}</div>`;
        return html`<div>${at} · ${t("plan.idle")}</div>`;
      }
      return html`<div>${at} · <b>${fmtW(c.value)}</b></div>`;
    });
    return html`<div class="detail"><b>${row.label}</b> · ${dayTime(from)}${parts}</div>`;
  }

  private _summary(plan: any) {
    const items = this.loads.filter((l) => plan.loads[l.id] && (!this.loadId || l.id === this.loadId));
    if (!items.length) return nothing;
    return html`<div class="sum">${items.map((l) => {
      const p = plan.loads[l.id];
      const goal =
        p.goal === "departure" && p.deadline ? t("plan.goal.departure").replace("{t}", dayTime(p.deadline))
        : p.deadline ? t("plan.goal.by").replace("{t}", hhmm(p.deadline)) : "";
      const grid = p.grid_kwh > 0.01
        ? t("plan.grid_at").replace("{kwh}", fmtKwh(p.grid_kwh, 1)).replace("{from}", hhmm(p.grid_from)).replace("{to}", hhmm(p.grid_to))
        : p.grid_planned ? t("plan.no_grid") : t("plan.sun_only");
      return html`<div class="r"><ha-icon .icon=${l.icon || defaultIcon(l.type)}></ha-icon><div>
        <div class="n">${l.name}</div>
        <div class="s">${t("plan.need")} <b>${fmtKwh(p.need_kwh, 1)}</b> ${t(`plan.src.${p.need_source}`)} ${goal}
          · ${t("plan.sun_expected")} ${fmtKwh(p.solar_kwh, 1)} · ${grid}</div>
        ${p.short_kwh > 0.05 ? html`<div class="s warn">${t("plan.short").replace("{kwh}", fmtKwh(p.short_kwh, 1))}</div>` : nothing}
        ${p.over_limit ? html`<div class="s warn">${t("plan.over_limit")}</div>` : nothing}
      </div></div>`;
    })}</div>`;
  }

  private _chart() {
    const d = this._data;
    const plan = d.plan;
    if (this.loadId || !plan?.slots?.length) return nothing;
    const dayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000;
    const end = plan.slots[0] + this._hours * 3600;
    const x: number[] = [];
    for (let ts = dayStart; ts < end; ts += Q) x.push(ts);
    const measured = new Map<number, any[]>((d.measured ?? []).map((r: any[]) => [r[0], r]));
    const predicted = new Map<number, any[]>((d.predicted ?? []).map((r: any[]) => [r[0], r]));
    const fut = (arr: number[], ts: number) => {
      const i = Math.round((ts - plan.slots[0]) / Q);
      return i >= 0 && i < arr.length ? arr[i] : null;
    };
    const panels: Panel[] = [{
      title: `${t("plan.chart")} (W)`, unit: "W", height: 160,
      series: [
        { label: t("plan.pv_measured"), color: SOLAR, kind: "area", values: x.map((ts) => measured.get(ts)?.[1] ?? null) },
        { label: t("plan.pv_predicted"), color: SOLAR, kind: "line", dashed: true, values: x.map((ts) => predicted.get(ts)?.[1] ?? fut(plan.pv_w, ts)) },
        { label: t("plan.house_measured"), color: "var(--secondary-text-color)", kind: "line", values: x.map((ts) => measured.get(ts)?.[2] ?? null) },
        { label: t("plan.house_predicted"), color: "var(--secondary-text-color)", kind: "line", dashed: true, values: x.map((ts) => predicted.get(ts)?.[2] ?? fut(plan.base_w, ts)) },
        { label: t("plan.import_planned"), color: GRID, kind: "step", values: x.map((ts) => fut(plan.import_w, ts)) },
      ],
    }];
    return html`<div class="chart"><sm-chart .x=${x} .panels=${panels}></sm-chart></div>`;
  }

  render() {
    const d = this._data;
    const head = html`<div class="card-head"><h2>${t("plan.title")}</h2></div>`;
    if (!d) return nothing;
    const plan = d.plan;
    if (!plan?.slots?.length) return html`<div class="card">${head}<div class="empty">${t("plan.none")}</div></div>`;
    const first = plan.slots[0];
    const start = first - (first % 3600);
    const cols = Math.min(this._hours, Math.floor((plan.slots[plan.slots.length - 1] + Q - start) / 3600));
    const rows = this._rows(plan, start, cols);
    const nights: [number, number][] = d.info?.nights ?? [];
    const isNight = (ts: number) => nights.some(([s, e]) => ts >= s && ts < e);
    const limit = plan.limit_w;
    const src = d.info?.pv_source ?? "none";
    return html`<div class="card">
      ${head}
      ${d.enabled ? nothing : html`<div class="trial">${t("plan.trial")}</div>`}
      <div class="bar">
        <span class="meta">${t("plan.updated").replace("{t}", hhmm(plan.created))} · ${t(`plan.pv_source.${src}`)}</span>
        <sm-segmented size="sm" .options=${[{ value: "24", label: "24 u" }, { value: "36", label: "36 u" }]} .value=${String(this._hours)}
          @value-changed=${(e: CustomEvent) => { this._hours = Number(e.detail.value); this._sel = null; }}></sm-segmented>
      </div>
      ${this._chart()}
      <div class="grid" style="grid-template-columns: minmax(70px, max-content) repeat(${cols}, minmax(0, 1fr))"
        @mouseleave=${() => undefined}>
        ${rows.map((row, ri) => html`<div class="lbl" title=${row.label}><ha-icon .icon=${row.icon}></ha-icon>${row.label}</div>
          ${row.cells.map((cell, ci) => {
            const ts = start + ci * 3600;
            const over = row.kind === "import" && limit && cell.some((c) => c.value > limit + 1);
            const sel = this._sel && this._sel.row === ri && this._sel.col === ci;
            return html`<div class="cell ${ci === 0 ? "now" : ""} ${over ? "over" : ""} ${isNight(ts) ? "night" : ""} ${sel ? "sel" : ""}"
              style=${this._color(row, cell) ? `background:${this._color(row, cell)}` : ""}
              @mouseenter=${() => (this._sel = { row: ri, col: ci })} @click=${() => (this._sel = { row: ri, col: ci })}></div>`;
          })}`)}
        <div></div>
        ${Array.from({ length: cols }, (_, ci) => {
          const h = new Date((start + ci * 3600) * 1000).getHours();
          return html`<div class="hours">${h % 3 === 0 ? `${h}u` : ""}</div>`;
        })}
      </div>
      ${this._detail(rows, start)}
      <div class="legend">
        <span><span class="sw" style="background:${SOLAR}"></span>${t("plan.legend.sun")}</span>
        <span><span class="sw" style="background:${GRID}"></span>${t("plan.legend.grid")}</span>
        <span><span class="sw" style="outline:1px dashed var(--secondary-text-color)"></span>${t("plan.legend.night")}</span>
        ${limit ? html`<span><span class="sw" style="box-shadow:inset 0 -3px var(--sm-err)"></span>${t("plan.legend.over")} ${fmtW(limit)}</span>` : nothing}
      </div>
      ${this._summary(plan)}
    </div>`;
  }
}
