import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getAnalytics } from "../api";
import { t } from "../i18n";
import { fmtDur, fmtEur, fmtKwh, fmtPct, fmtW, shared } from "../styles";
import type { Hass, Load } from "../types";
import type { Band, Bar, Series } from "./sm-chart";
import "./sm-chart";

type Range = "today" | "yesterday" | "7d" | "30d" | "month";

const LOAD_COLORS = ["#f5a623", "#e86f9b", "#8e6ce0", "#2bb3c0", "#7cb342", "#ff7043"];
const REASON_COLORS: Record<string, string> = {
  solar: "#f5a623",
  night: "#5b8def",
  always_on: "#5b8def",
  legionella: "#9c27b0",
  min_soc: "#5b8def",
  peak_guard: "#e0533d",
  target_reached: "#3fb68b",
  no_surplus: "rgba(127,127,127,.35)",
};

const rangeBounds = (r: Range): [number, number] => {
  const now = new Date();
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = 86400;
  const s = sod.getTime() / 1000;
  switch (r) {
    case "yesterday":
      return [s - day, s];
    case "7d":
      return [s - 6 * day, now.getTime() / 1000];
    case "30d":
      return [s - 29 * day, now.getTime() / 1000];
    case "month":
      return [new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000, now.getTime() / 1000];
    default:
      return [s, now.getTime() / 1000];
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

  static styles = [
    shared,
    css`
      .toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 12px; }
      .split { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
      .share { height: 10px; border-radius: 5px; overflow: hidden; display: flex; background: rgba(127,127,127,.15); }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("loadId") && changed.get("loadId") !== undefined) this._load();
  }

  private async _load() {
    if (!this.hass) return;
    this._loading = true;
    const [s, e] = rangeBounds(this._range);
    try {
      this._data = await getAnalytics(this.hass, s, e, this.loadId);
    } finally {
      this._loading = false;
    }
  }

  private _setRange(r: Range) {
    this._range = r;
    this._load();
  }

  private _setLoad(id: string | null) {
    this.loadId = id;
    this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id }, bubbles: true, composed: true }));
    this._load();
  }

  private _load_(id: string) {
    return this.loads.find((l) => l.id === id);
  }

  private _downsample(rows: any[]): any[] {
    const max = 1500;
    if (rows.length <= max) return rows;
    const step = Math.ceil(rows.length / max);
    const out: any[] = [];
    for (let i = 0; i < rows.length; i += step) {
      const chunk = rows.slice(i, i + step);
      const avg = (f: (r: any) => number | null) => {
        const vals = chunk.map(f).filter((v) => v !== null && v !== undefined) as number[];
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      };
      const loads: Record<string, any[]> = {};
      for (const lid of Object.keys(chunk[chunk.length - 1][3])) {
        loads[lid] = [
          avg((r) => r[3][lid]?.[0] ?? null),
          avg((r) => r[3][lid]?.[1] ?? null),
          chunk[chunk.length - 1][3][lid][2],
          chunk.some((r) => r[3][lid]?.[3]) ? 1 : 0,
          avg((r) => r[3][lid]?.[4] ?? null),
        ];
      }
      out.push([chunk[0][0], avg((r) => r[1]), avg((r) => r[2]), loads]);
    }
    return out;
  }

  private _timeline() {
    const rows = this._downsample(this._data?.timeline?.rows ?? []);
    if (rows.length < 2) return html`<p class="muted">${t("a.no_data")}</p>`;
    const x = rows.map((r: any) => r[0]);
    const series: Series[] = [];
    const bands: Band[] = [];
    if (this.loadId) {
      const lid = this.loadId;
      const load = this._load_(lid);
      series.push({ label: t("a.pv"), color: "rgba(245,166,35,.35)", kind: "line", values: rows.map((r: any) => r[1]), dashed: true });
      series.push({ label: `${t("a.solar")}`, color: "#f5a623", kind: "area", stack: "l", values: rows.map((r: any) => r[3][lid]?.[1] ?? 0) });
      series.push({
        label: `${t("a.grid")}`, color: "#5b8def", kind: "area", stack: "l",
        values: rows.map((r: any) => Math.max(0, (r[3][lid]?.[0] ?? 0) - (r[3][lid]?.[1] ?? 0))),
      });
      const hasValue = rows.some((r: any) => r[3][lid]?.[4] !== null && r[3][lid]?.[4] !== undefined);
      if (hasValue) {
        const isEv = load?.type === "ev";
        series.push({
          label: isEv ? t("a.soc") : t("a.temperature"), color: "#e0533d", kind: "line", axis: "right",
          unit: isEv ? "%" : "°C", values: rows.map((r: any) => r[3][lid]?.[4] ?? null),
        });
      }
      bands.push(this._reasonBand(rows, lid));
    } else {
      series.push({ label: t("a.pv"), color: "rgba(245,166,35,.6)", kind: "line", values: rows.map((r: any) => r[1]) });
      this.loads.forEach((l, i) => {
        series.push({
          label: l.name, color: LOAD_COLORS[i % LOAD_COLORS.length], kind: "area", stack: "loads",
          values: rows.map((r: any) => r[3][l.id]?.[0] ?? 0),
        });
      });
      series.push({ label: t("site.grid"), color: "#5b8def", kind: "line", values: rows.map((r: any) => r[2]) });
      this.loads.forEach((l) => bands.push({ ...this._reasonBand(rows, l.id), label: l.name.length > 11 ? l.name.slice(0, 10) + "…" : l.name }));
    }
    const right = series.find((s) => s.axis === "right");
    return html`<sm-chart .x=${x} .series=${series} .bands=${bands} .height=${280 + bands.length * 18} unit="W" .rightUnit=${right?.unit ?? ""}></sm-chart>`;
  }

  private _reasonBand(rows: any[], lid: string): Band {
    const segs: Band["segments"] = [];
    let cur: { from: number; to: number; color: string; title: string } | null = null;
    for (let i = 0; i < rows.length; i++) {
      const ld = rows[i][3][lid];
      const reason: string | null = ld ? ld[2] : null;
      const color = reason && (ld[3] || reason === "peak_guard") ? REASON_COLORS[reason] ?? "rgba(127,127,127,.35)" : null;
      const next = rows[i + 1]?.[0] ?? rows[i][0] + 60;
      if (color && cur && cur.color === color && cur.title === t(`reason.${reason}`)) {
        cur.to = next;
      } else {
        if (cur) segs.push(cur);
        cur = color ? { from: rows[i][0], to: next, color, title: t(`reason.${reason}`) } : null;
      }
    }
    if (cur) segs.push(cur);
    return { label: "Status", segments: segs };
  }

  private _summary() {
    const sum = this._data?.summary;
    if (!sum) return nothing;
    if (this.loadId) {
      const l = sum.loads[this.loadId];
      if (!l) return html`<p class="muted">${t("a.no_data")}</p>`;
      const reasons = Object.entries(l.reasons ?? {}).filter(([r]) => !["no_surplus", "mode_off", "disabled", "unavailable", "idle", "not_connected"].includes(r))
        .sort((a: any, b: any) => b[1] - a[1]);
      return html`
        <div class="stats">
          <div class="stat"><span class="v">${fmtKwh(l.kwh)}</span><span class="l">${t("a.energy")}</span></div>
          <div class="stat"><span class="v">${fmtKwh(l.solar_kwh)}</span><span class="l">${t("a.solar")}</span></div>
          <div class="stat"><span class="v">${fmtKwh(l.grid_kwh)}</span><span class="l">${t("a.grid")}</span></div>
          <div class="stat"><span class="v">${fmtPct(l.solar_share)}</span><span class="l">${t("a.solar_share")}</span></div>
          <div class="stat"><span class="v">${fmtDur(l.runtime_s)}</span><span class="l">${t("a.runtime")}</span></div>
          <div class="stat"><span class="v">${l.starts}</span><span class="l">${t("a.starts")}</span></div>
          <div class="stat"><span class="v">${fmtEur(l.saving)}</span><span class="l">${t("a.saving")}</span></div>
          <div class="stat"><span class="v">${fmtEur(l.cost)}</span><span class="l">${t("a.cost")}</span></div>
        </div>
        ${reasons.length
          ? html`<h3>${t("a.why")}</h3>
              <div class="row">${reasons.map(([r, s]: any) => html`<span class="chip" style="background:${REASON_COLORS[r] ?? "rgba(127,127,127,.2)"}33">${t(`reason.${r}`)}: ${fmtDur(s)}</span>`)}</div>`
          : nothing}
      `;
    }
    const h = sum.house;
    const totalLoads = Object.values(sum.loads).reduce((a: number, l: any) => a + l.kwh, 0) as number;
    return html`
      <div class="stats">
        <div class="stat"><span class="v">${fmtKwh(h.pv_kwh, 1)}</span><span class="l">${t("a.pv")}</span></div>
        <div class="stat"><span class="v">${fmtKwh(h.import_kwh, 1)}</span><span class="l">${t("a.import")}</span></div>
        <div class="stat"><span class="v">${fmtKwh(h.export_kwh, 1)}</span><span class="l">${t("a.export")}</span></div>
        <div class="stat"><span class="v">${fmtPct(h.self_consumption)}</span><span class="l">${t("a.self_consumption")}</span></div>
        <div class="stat"><span class="v">${fmtPct(h.self_sufficiency)}</span><span class="l">${t("a.self_sufficiency")}</span></div>
        <div class="stat"><span class="v">${fmtW(h.peak_w)}</span><span class="l">${t("a.peak")}</span></div>
      </div>
      <h3>${t("a.distribution")}</h3>
      <table>
        <tr><th></th><th class="num">${t("a.energy")}</th><th class="num">${t("a.solar")}</th><th class="num">${t("a.solar_share")}</th><th class="num">${t("a.runtime")}</th><th class="num">${t("a.saving")}</th></tr>
        ${this.loads.map((l, i) => {
          const d = sum.loads[l.id];
          if (!d) return nothing;
          return html`<tr>
            <td><span class="chip" style="background:${LOAD_COLORS[i % LOAD_COLORS.length]}44">${l.name}</span></td>
            <td class="num">${fmtKwh(d.kwh)}</td><td class="num">${fmtKwh(d.solar_kwh)}</td>
            <td class="num">${fmtPct(d.solar_share)}</td><td class="num">${fmtDur(d.runtime_s)}</td><td class="num">${fmtEur(d.saving)}</td>
          </tr>`;
        })}
        <tr><td><b>Σ</b></td><td class="num"><b>${fmtKwh(totalLoads)}</b></td><td colspan="4"></td></tr>
      </table>
    `;
  }

  private _daily() {
    const days = this._data?.days ?? {};
    const keys = Object.keys(days).sort();
    if (keys.length < 2) return nothing;
    const bars: Bar[] = keys.map((k) => {
      const label = k.slice(8) + "/" + k.slice(5, 7);
      if (this.loadId) {
        const d = days[k].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return {
          label,
          parts: [
            { value: d.solar_kwh, color: "#f5a623", title: `${t("a.solar")} ${fmtKwh(d.solar_kwh)}` },
            { value: Math.max(0, d.kwh - d.solar_kwh), color: "#5b8def", title: `${t("a.grid")} ${fmtKwh(d.kwh - d.solar_kwh)}` },
          ],
        };
      }
      return {
        label,
        parts: this.loads.map((l, i) => {
          const v = days[k].loads[l.id]?.kwh ?? 0;
          return { value: v, color: LOAD_COLORS[i % LOAD_COLORS.length], title: `${l.name} ${fmtKwh(v)}` };
        }),
      };
    });
    return html`<div class="card"><h2>${t("a.daily")}</h2><sm-bars .bars=${bars}></sm-bars></div>`;
  }

  private _rhythm() {
    if (!this.loadId) return nothing;
    const r: number[] = this._data?.rhythm?.[this.loadId] ?? [];
    if (!r.some((v) => v > 0)) return nothing;
    const bars: Bar[] = r.map((v, h) => ({ label: `${h}u`, parts: [{ value: v, color: "#f5a623", title: fmtW(v) }] }));
    return html`<div class="card"><h2>${t("a.rhythm")}</h2><sm-bars .bars=${bars} unit="W" .height=${150}></sm-bars></div>`;
  }

  private _quarters() {
    if (this.loadId) return nothing;
    const q = this._data?.quarters ?? {};
    const keys = Object.keys(q).sort();
    if (!keys.length) return nothing;
    let bars: Bar[];
    if (keys.length === 1) {
      bars = q[keys[0]].map(([ts, avg]: number[]) => ({
        label: new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        parts: [{ value: avg, color: avg > (this._limit() ?? Infinity) ? "#e0533d" : "#5b8def", title: fmtW(avg) }],
      }));
    } else {
      bars = keys.map((k) => {
        const max = Math.max(...q[k].map((r: number[]) => r[1]));
        return { label: k.slice(8) + "/" + k.slice(5, 7), parts: [{ value: max, color: "#5b8def", title: fmtW(max) }] };
      });
    }
    return html`<div class="card"><h2>${t("a.quarters")}</h2><sm-bars .bars=${bars} unit="W" .limit=${this._limit()}></sm-bars></div>`;
  }

  private _limit(): number | null {
    return this.peakLimit;
  }

  private _sessions() {
    const load = this.loadId ? this._load_(this.loadId) : null;
    if (!load || load.type !== "ev") return nothing;
    const sess = [...(this._data?.sessions ?? [])].reverse();
    if (!sess.length) return nothing;
    const fmt = (ts: number | null) =>
      ts ? new Date(ts * 1000).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : t("a.ongoing");
    return html`<div class="card"><h2>${t("a.sessions")}</h2>
      <table>
        <tr><th>${t("a.start")}</th><th>${t("a.end")}</th><th class="num">${t("a.energy")}</th><th class="num">${t("a.solar_share")}</th><th class="num">${t("a.soc")}</th></tr>
        ${sess.map((s: any) => html`<tr>
          <td>${fmt(s.start)}</td><td>${fmt(s.end)}</td><td class="num">${fmtKwh(s.kwh)}</td>
          <td class="num">${fmtPct(s.kwh > 0 ? s.solar_kwh / s.kwh : null)}</td>
          <td class="num">${s.soc_start ?? "–"}% → ${s.soc_end ?? "–"}%</td>
        </tr>`)}
      </table></div>`;
  }

  render() {
    const ranges: Range[] = ["today", "yesterday", "7d", "30d", "month"];
    return html`
      <div class="toolbar">
        <select @change=${(e: Event) => this._setLoad((e.target as HTMLSelectElement).value || null)}>
          <option value="" ?selected=${!this.loadId}>${t("a.all")}</option>
          ${this.loads.map((l) => html`<option value=${l.id} ?selected=${this.loadId === l.id}>${l.name}</option>`)}
        </select>
        <div class="seg">
          ${ranges.map((r) => html`<button class=${this._range === r ? "on" : ""} @click=${() => this._setRange(r)}>${t(`a.range.${r}`)}</button>`)}
        </div>
        ${this._loading ? html`<span class="muted">…</span>` : nothing}
      </div>
      <div class="card"><h2>${t("a.summary")}</h2>${this._summary()}</div>
      <div class="card"><h2>${t("a.timeline")}</h2>${this._timeline()}</div>
      ${this._daily()} ${this._rhythm()} ${this._sessions()} ${this._quarters()}
    `;
  }
}
