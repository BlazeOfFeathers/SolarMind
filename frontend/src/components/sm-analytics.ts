import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getAnalytics } from "../api";
import { t } from "../i18n";
import { cardStyles, fmtDur, fmtEur, fmtKwh, fmtPct, fmtW, tokens } from "../styles/tokens";
import type { Hass, Load } from "../types";
import { LOAD_COLORS, defaultIcon, reasonTone } from "./common";
import type { Bar, BandSeg, Panel, Series } from "./sm-chart";
import "./sm-chart";
import "./sm-plan";
import "./shared/sm-segmented";

type Range = "today" | "yesterday" | "7d" | "30d" | "month";

const SOLAR = "var(--sm-solar)";
const GRID = "var(--sm-grid)";
const TONE_COLORS: Record<string, string> = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)",
};

const rangeBounds = (r: Range): [number, number] => {
  const now = new Date();
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
  const end = now.getTime() / 1000;
  switch (r) {
    case "yesterday":
      return [sod - 86400, sod];
    case "7d":
      return [sod - 6 * 86400, end];
    case "30d":
      return [sod - 29 * 86400, end];
    case "month":
      return [new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000, end];
    default:
      return [sod, end];
  }
};

@customElement("sm-analytics")
export class SmAnalytics extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) loads: Load[] = [];
  @property() loadId: string | null = null;
  @property({ type: Number }) peakLimit: number | null = null;
  @state() private _range: Range = "today";
  @state() private _data: any = null;
  @state() private _loading = false;
  private _loadedFor = "";

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: flex; flex-direction: column; gap: 16px; }
      .toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
      .toolbar sm-segmented.loads { flex: 1 1 420px; max-width: 760px; }
      .toolbar sm-segmented.range { flex: 0 1 420px; }
      .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; padding: 0 16px 16px; }
      .tile { background: var(--sm-fill); border-radius: var(--sm-radius-sm); padding: 12px; }
      .tile .v { font-size: 22px; font-weight: 400; font-variant-numeric: tabular-nums; }
      .tile .l { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
      .tile .bar { height: 6px; border-radius: 3px; overflow: hidden; display: flex; background: var(--sm-fill-strong); margin-top: 8px; }
      .why { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 16px; }
      table { border-collapse: collapse; width: 100%; font-size: 14px; }
      th, td { text-align: left; padding: 10px 16px; border-top: 1px solid var(--sm-border); }
      th { font-weight: 500; font-size: 12px; color: var(--secondary-text-color); border-top: none; }
      td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
      .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
      .empty { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); }
      .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr)); gap: 16px; }
    `,
  ];

  updated(changed: Map<string, unknown>) {
    const key = `${this.loadId}|${this._range}`;
    if ((changed.has("loadId") || changed.has("hass")) && this.hass && key !== this._loadedFor) this._fetch();
  }

  private async _fetch() {
    this._loadedFor = `${this.loadId}|${this._range}`;
    this._loading = true;
    const [s, e] = rangeBounds(this._range);
    try {
      this._data = await getAnalytics(this.hass, s, e, this.loadId);
    } finally {
      this._loading = false;
    }
  }

  private _downsample(rows: any[]): any[] {
    const max = 1200;
    if (rows.length <= max) return rows;
    const step = Math.ceil(rows.length / max);
    const out: any[] = [];
    for (let i = 0; i < rows.length; i += step) {
      const chunk = rows.slice(i, i + step);
      const avg = (f: (r: any) => number | null | undefined) => {
        const vals = chunk.map(f).filter((v) => v !== null && v !== undefined) as number[];
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      };
      const last = chunk[chunk.length - 1];
      const loads: Record<string, any[]> = {};
      for (const lid of Object.keys(last[3])) {
        loads[lid] = [avg((r) => r[3][lid]?.[0]), avg((r) => r[3][lid]?.[1]), last[3][lid][2], chunk.some((r) => r[3][lid]?.[3]) ? 1 : 0, avg((r) => r[3][lid]?.[4])];
      }
      out.push([chunk[0][0], avg((r) => r[1]), avg((r) => r[2]), loads]);
    }
    return out;
  }

  private _band(rows: any[], lid: string, label: string) {
    const segs: BandSeg[] = [];
    let cur: BandSeg | null = null;
    for (let i = 0; i < rows.length; i++) {
      const ld = rows[i][3][lid];
      const reason: string | null = ld ? ld[2] : null;
      const tone = reason ? reasonTone(reason) : "";
      const show = reason && (ld[3] || reason === "peak_guard") && tone;
      const color = show ? TONE_COLORS[tone] : null;
      const title = reason ? t(`reason.${reason}`) : "";
      const next = rows[i + 1]?.[0] ?? rows[i][0] + 60;
      if (color && cur && cur.color === color && cur.title === title) cur.to = next;
      else {
        if (cur) segs.push(cur);
        cur = color ? { from: rows[i][0], to: next, color, title } : null;
      }
    }
    if (cur) segs.push(cur);
    return { label, segments: segs };
  }

  private _history() {
    const rows = this._downsample(this._data?.timeline?.rows ?? []);
    if (rows.length < 2) return html`<div class="empty">${t("a.no_data")}</div>`;
    const x = rows.map((r: any) => r[0]);
    const panels: Panel[] = [];
    if (this.loadId) {
      const lid = this.loadId;
      const load = this.loads.find((l) => l.id === lid);
      const series: Series[] = [
        { label: t("a.from_solar"), color: SOLAR, kind: "area", stack: "l", values: rows.map((r: any) => r[3][lid]?.[1] ?? 0) },
        { label: t("a.from_grid"), color: GRID, kind: "area", stack: "l", values: rows.map((r: any) => Math.max(0, (r[3][lid]?.[0] ?? 0) - (r[3][lid]?.[1] ?? 0))) },
        ...(load?.type === "battery"
          ? [{ label: t("a.discharged"), color: "var(--sm-ok)", kind: "area" as const, stack: "d", values: rows.map((r: any) => Math.max(0, -(r[3][lid]?.[0] ?? 0))) }]
          : []),
        { label: t("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: true, values: rows.map((r: any) => r[1]) },
      ];
      panels.push({ title: `${t("a.power")} (W)`, unit: "W", height: 220, series });
      if (rows.some((r: any) => r[3][lid]?.[4] != null)) {
        const isEv = load?.type === "ev" || load?.type === "battery";
        panels.push({
          title: isEv ? `${t("a.soc")} (%)` : `${t("a.temperature")} (°C)`, unit: isEv ? "%" : "°C", height: 90, zero: false,
          series: [{ label: isEv ? t("a.soc") : t("a.temperature"), color: "var(--sm-err)", kind: "line", values: rows.map((r: any) => r[3][lid]?.[4] ?? null) }],
        });
      }
      panels.push({ title: t("a.why"), unit: "", height: 22, bands: [this._band(rows, lid, "")] });
    } else {
      const series: Series[] = this.loads.map((l, i) => ({
        label: l.name, color: LOAD_COLORS[i % LOAD_COLORS.length], kind: "area" as const, stack: "loads", values: rows.map((r: any) => Math.max(0, r[3][l.id]?.[0] ?? 0)),
      }));
      series.push({ label: t("a.pv"), color: SOLAR, kind: "line", values: rows.map((r: any) => r[1]) });
      panels.push({ title: `${t("a.power")} (W)`, unit: "W", height: 220, series });
      panels.push({
        title: `${t("site.grid")} (W) · + ${t("a.import").toLowerCase()} / − ${t("a.export").toLowerCase()}`, unit: "W", height: 90,
        series: [{ label: t("site.grid"), color: GRID, kind: "line", values: rows.map((r: any) => r[2]) }],
      });
      panels.push({
        title: t("a.why"), unit: "", height: this.loads.length * 16 + 6,
        bands: this.loads.map((l) => this._band(rows, l.id, l.name.length > 9 ? l.name.slice(0, 8) + "…" : l.name)),
      });
    }
    return html`<sm-chart .x=${x} .panels=${panels}></sm-chart>`;
  }

  private _tile(v: string, l: string, bar?: [number, number]) {
    return html`<div class="tile"><div class="v">${v}</div><div class="l">${l}</div>
      ${bar ? html`<div class="bar"><div style="width:${bar[0] * 100}%;background:${SOLAR}"></div><div style="width:${bar[1] * 100}%;background:${GRID}"></div></div>` : nothing}</div>`;
  }

  private _summary() {
    const sum = this._data?.summary;
    if (!sum) return nothing;
    if (this.loadId) {
      const l = sum.loads[this.loadId];
      if (!l) return html`<div class="empty">${t("a.no_data")}</div>`;
      const share = l.solar_share ?? 0;
      const bat = this.loads.find((x) => x.id === this.loadId);
      if (bat?.type === "battery") {
        const cap = bat.bat_capacity_kwh || 0;
        return html`<div class="tiles">
          ${this._tile(fmtKwh(l.kwh), t("a.charged"), l.kwh > 0 ? [share, 1 - share] : undefined)}
          ${this._tile(fmtPct(l.solar_share), t("a.solar_share"))}
          ${this._tile(fmtKwh(l.discharge_kwh ?? 0), t("a.discharged"))}
          ${this._tile(fmtPct(l.efficiency ?? null), t("a.efficiency"))}
          ${this._tile(cap ? ((l.discharge_kwh ?? 0) / cap).toFixed(1) : "–", t("a.cycles"))}
          ${this._tile(fmtEur(l.saving), t("a.saving"))}
        </div>`;
      }
      const reasons = Object.entries(l.reasons ?? {})
        .filter(([r]) => reasonTone(r))
        .sort((a: any, b: any) => b[1] - a[1]);
      return html`<div class="tiles">
          ${this._tile(fmtKwh(l.kwh), t("a.energy"), l.kwh > 0 ? [share, 1 - share] : undefined)}
          ${this._tile(fmtPct(l.solar_share), t("a.solar_share"))}
          ${this._tile(fmtKwh(l.grid_kwh), t("a.grid"))}
          ${this._tile(fmtDur(l.runtime_s), t("a.runtime"))}
          ${this._tile(String(l.starts), t("a.starts"))}
          ${this._tile(fmtEur(l.saving), t("a.saving"))}
        </div>
        ${reasons.length
          ? html`<div class="why">${reasons.map(([r, s]: any) => html`<span class="pill"><span class="swatch" style="background:${TONE_COLORS[reasonTone(r)]}"></span>${t(`reason.${r}`)} <b>${fmtDur(s)}</b></span>`)}</div>`
          : nothing}`;
    }
    const h = sum.house;
    return html`<div class="tiles">
        ${this._tile(fmtKwh(h.pv_kwh, 1), t("a.pv"))}
        ${this._tile(fmtPct(h.self_consumption), t("a.self_consumption"))}
        ${this._tile(fmtPct(h.self_sufficiency), t("a.self_sufficiency"))}
        ${this._tile(fmtKwh(h.import_kwh, 1), t("a.import"))}
        ${this._tile(fmtKwh(h.export_kwh, 1), t("a.export"))}
        ${this._tile(fmtW(h.peak_w), t("a.peak"))}
      </div>
      <table>
        <tr><th>${t("a.distribution")}</th><th class="num">${t("a.energy")}</th><th class="num">${t("a.solar_share")}</th><th class="num">${t("a.runtime")}</th><th class="num">${t("a.saving")}</th></tr>
        ${this.loads.map((l, i) => {
          const d = sum.loads[l.id];
          if (!d) return nothing;
          return html`<tr><td><span class="swatch" style="background:${LOAD_COLORS[i % LOAD_COLORS.length]}"></span>${l.name}</td>
            <td class="num">${fmtKwh(d.kwh)}</td><td class="num">${fmtPct(d.solar_share)}</td><td class="num">${fmtDur(d.runtime_s)}</td><td class="num">${fmtEur(d.saving)}</td></tr>`;
        })}
      </table>`;
  }

  private _daily() {
    const days = this._data?.days ?? {};
    const keys = Object.keys(days).sort();
    if (keys.length < 2) return nothing;
    const bars: Bar[] = keys.map((k) => {
      const label = `${Number(k.slice(8))}/${Number(k.slice(5, 7))}`;
      if (this.loadId) {
        const d = days[k].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label, parts: [
          { value: d.solar_kwh, color: SOLAR, title: `${t("a.solar")} ${fmtKwh(d.solar_kwh)}` },
          { value: Math.max(0, d.kwh - d.solar_kwh), color: GRID, title: `${t("a.grid")} ${fmtKwh(d.kwh - d.solar_kwh)}` },
        ] };
      }
      return { label, parts: this.loads.map((l, i) => {
        const v = days[k].loads[l.id]?.kwh ?? 0;
        return { value: v, color: LOAD_COLORS[i % LOAD_COLORS.length], title: `${l.name} ${fmtKwh(v)}` };
      }) };
    });
    return html`<div class="card"><div class="card-head"><h2>${t("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${bars}></sm-bars></div></div>`;
  }

  private _rhythm() {
    if (!this.loadId) return nothing;
    const r: number[] = this._data?.rhythm?.[this.loadId] ?? [];
    if (!r.some((v) => v > 0)) return nothing;
    const bars: Bar[] = r.map((v, h) => ({ label: `${h}u`, parts: [{ value: v, color: SOLAR, title: fmtW(v) }] }));
    return html`<div class="card"><div class="card-head"><h2>${t("a.rhythm")}</h2><span class="meta">${t("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${bars} unit="W" .height=${150}></sm-bars></div></div>`;
  }

  private _quarters() {
    if (this.loadId) return nothing;
    const q = this._data?.quarters ?? {};
    const keys = Object.keys(q).sort();
    if (!keys.length) return nothing;
    const lim = this.peakLimit;
    const bars: Bar[] =
      keys.length === 1
        ? q[keys[0]].map(([ts, avg]: number[]) => ({
            label: new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            parts: [{ value: avg, color: lim && avg > lim ? "var(--sm-err)" : GRID, title: fmtW(avg) }],
          }))
        : keys.map((k) => {
            const mx = Math.max(...q[k].map((r: number[]) => r[1]));
            return { label: `${Number(k.slice(8))}/${Number(k.slice(5, 7))}`, parts: [{ value: mx, color: lim && mx > lim ? "var(--sm-err)" : GRID, title: fmtW(mx) }] };
          });
    return html`<div class="card"><div class="card-head"><h2>${t("a.quarters")}</h2><span class="meta">${t("site.peak_limit")} ${fmtW(lim)}</span></div>
      <div class="card-body"><sm-bars .bars=${bars} unit="W" .limit=${lim}></sm-bars></div></div>`;
  }

  private _sessions() {
    const load = this.loadId ? this.loads.find((l) => l.id === this.loadId) : null;
    if (!load || load.type !== "ev") return nothing;
    const sess = [...(this._data?.sessions ?? [])].reverse();
    if (!sess.length) return nothing;
    const fmt = (ts: number | null) =>
      ts ? new Date(ts * 1000).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : t("a.ongoing");
    return html`<div class="card"><div class="card-head"><h2>${t("a.sessions")}</h2><span class="meta">${sess.length}</span></div>
      <table>
        <tr><th>${t("a.start")}</th><th>${t("a.end")}</th><th class="num">${t("a.energy")}</th><th class="num">${t("a.solar_share")}</th><th class="num">${t("a.soc")}</th></tr>
        ${sess.map((s: any) => html`<tr><td>${fmt(s.start)}</td><td>${fmt(s.end)}</td><td class="num">${fmtKwh(s.kwh)}</td>
          <td class="num">${fmtPct(s.kwh > 0 ? s.solar_kwh / s.kwh : null)}</td><td class="num">${s.soc_start ?? "–"}% → ${s.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }

  render() {
    const loadOpts = [{ value: "", label: t("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((l) => ({ value: l.id, label: l.name, icon: l.icon || defaultIcon(l.type) })),
    );
    const ranges: Range[] = ["today", "yesterday", "7d", "30d", "month"];
    return html`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${loadOpts} .value=${this.loadId ?? ""}
          @value-changed=${(e: CustomEvent) => {
            this.loadId = e.detail.value || null;
            this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: true, composed: true }));
          }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${ranges.map((r) => ({ value: r, label: t(`a.range.${r}`) }))} .value=${this._range}
          @value-changed=${(e: CustomEvent) => { this._range = e.detail.value; this._fetch(); }}></sm-segmented>
      </div>
      <sm-plan .hass=${this.hass} .loads=${this.loads} .loadId=${this.loadId}></sm-plan>
      <div class="card"><div class="card-head"><h2>${t("a.summary")}</h2>${this._loading ? html`<span class="meta">…</span>` : nothing}</div>${this._summary()}</div>
      <div class="card"><div class="card-head"><h2>${t("a.timeline")}</h2></div><div class="card-body">${this._history()}</div></div>
      ${this._sessions()}
      <div class="two">${this._daily()}${this._rhythm()}${this._quarters()}</div>
    `;
  }
}
