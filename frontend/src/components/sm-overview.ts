import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { reorderLoads, setMode } from "../api";
import { t } from "../i18n";
import { fmtDur, fmtKwh, fmtW, shared } from "../styles";
import type { Hass, Live, Load, Mode } from "../types";

const MODES: Mode[] = ["solar", "solar_night", "on", "off"];

const reasonClass = (r: string) =>
  r === "solar" ? "solar" : ["night", "always_on", "legionella", "min_soc"].includes(r) ? "grid" : r === "peak_guard" ? "warn" : "";

@customElement("sm-overview")
export class SmOverview extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) loads: Load[] = [];
  @property({ attribute: false }) live?: Live;
  @state() private _dragId: string | null = null;

  static styles = [
    shared,
    css`
      .flow { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
      .tile { border-radius: 10px; padding: 12px; background: rgba(127, 127, 127, 0.08); }
      .tile .v { font-size: 1.5rem; font-weight: 500; font-variant-numeric: tabular-nums; }
      .tile .l { font-size: 0.8rem; color: var(--sm-muted); }
      .tile.solar { background: rgba(245, 166, 35, 0.14); }
      .tile.export { background: rgba(63, 182, 139, 0.14); }
      .tile.import { background: rgba(91, 141, 239, 0.14); }
      .peakbar { position: relative; height: 10px; border-radius: 5px; background: rgba(127, 127, 127, 0.15); margin: 8px 0 4px; overflow: hidden; }
      .peakbar .fill { position: absolute; inset: 0 auto 0 0; background: var(--sm-grid); }
      .peakbar .proj { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--sm-warn); }
      .load { display: flex; gap: 12px; align-items: center; padding: 12px; border: 1px solid var(--sm-border); border-radius: 10px; margin-bottom: 8px; background: var(--sm-card); }
      .load.dragging { opacity: 0.4; }
      .load.disabled { opacity: 0.6; }
      .handle { cursor: grab; color: var(--sm-muted); user-select: none; display: flex; flex-direction: column; align-items: center; }
      .handle .prio { font-weight: 600; font-size: 1.1rem; color: var(--primary-text-color); }
      .handle button { padding: 0 6px; border: 0; font-size: 0.8rem; line-height: 1; }
      .body { flex: 1; min-width: 0; }
      .name { font-weight: 500; font-size: 1.05rem; }
      .meter { height: 6px; border-radius: 3px; background: rgba(127, 127, 127, 0.15); overflow: hidden; margin-top: 6px; display: flex; }
      .meter .s { background: var(--sm-solar); }
      .meter .g { background: var(--sm-grid); }
      .power { font-size: 1.3rem; font-weight: 500; font-variant-numeric: tabular-nums; min-width: 90px; text-align: right; }
      ha-icon { --mdc-icon-size: 28px; color: var(--sm-muted); }
      ha-icon.on { color: var(--sm-solar); }
    `,
  ];

  private _emit(name: string, detail: any = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private async _move(id: string, delta: number) {
    const order = this.loads.map((l) => l.id);
    const i = order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    await this._saveOrder(order);
  }

  private async _saveOrder(order: string[]) {
    this._emit("loads-reordered", { order });
    await reorderLoads(this.hass, order);
  }

  private _onDrop(targetId: string) {
    if (!this._dragId || this._dragId === targetId) return;
    const order = this.loads.map((l) => l.id).filter((i) => i !== this._dragId);
    order.splice(order.indexOf(targetId), 0, this._dragId);
    this._dragId = null;
    this._saveOrder(order);
  }

  private async _setMode(load: Load, mode: Mode) {
    this._emit("load-mode", { id: load.id, mode });
    await setMode(this.hass, load.id, mode);
  }

  private _renderSite() {
    const s = this.live?.site ?? {};
    const grid = s.grid_w as number | null;
    const pct = (v: number) => Math.min(100, Math.max(0, (v / Math.max(1, (s.peak_limit_w ?? 2500) * 1.25)) * 100));
    return html`
      ${s.enabled === false ? html`<div class="banner">${t("site.disabled")}</div>` : nothing}
      ${s.available === false ? html`<div class="banner">${t("site.no_grid")}</div>` : nothing}
      <div class="card">
        <div class="flow">
          <div class="tile solar"><div class="l">${t("site.pv")}</div><div class="v">${fmtW(s.pv_w)}</div></div>
          <div class="tile ${grid !== null && grid < 0 ? "export" : "import"}">
            <div class="l">${t("site.grid")} · ${grid !== null && grid < 0 ? t("site.export") : t("site.import")}</div>
            <div class="v">${fmtW(grid === null ? null : Math.abs(grid))}</div>
          </div>
          <div class="tile"><div class="l">${t("site.house")}</div><div class="v">${fmtW(s.base_w !== undefined && s.pv_w != null ? s.base_w + s.pv_w : null)}</div></div>
          <div class="tile"><div class="l">${t("site.managed")}</div><div class="v">${fmtW(s.managed_w)}</div></div>
          <div class="tile"><div class="l">${t("site.surplus")}</div><div class="v">${fmtW(s.surplus_w)}</div></div>
        </div>
        <h3>${t("site.peak")}</h3>
        <div class="peakbar">
          <div class="fill" style="width:${pct(s.quarter_average_w ?? 0)}%"></div>
          <div class="proj" style="left:${pct(s.quarter_projected_w ?? 0)}%"></div>
          <div class="proj" style="left:${pct(s.peak_limit_w ?? 0)}%;background:var(--primary-text-color)"></div>
        </div>
        <div class="row muted">
          <span>${t("site.peak_now")}: ${fmtW(s.quarter_average_w)}</span>
          <span>· ${t("site.peak_projected")}: ${fmtW(s.quarter_projected_w)}</span>
          <span>· ${t("site.peak_limit")}: ${fmtW(s.peak_limit_w)}</span>
          <span>· ${t("site.month_peak")}: ${fmtW(s.month_peak_w)}</span>
          ${s.in_night ? html`<span class="chip grid">${t("site.night")}</span>` : nothing}
        </div>
      </div>
    `;
  }

  private _renderLoad(load: Load, index: number) {
    const lv = this.live?.loads?.[load.id];
    const p = lv?.power_w ?? 0;
    const solar = lv?.solar_w ?? 0;
    const max = Math.max(1, load.type === "ev" ? load.ev_max_current * 230 * load.ev_phases : load.nominal_power_w);
    const icon = load.icon || (load.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler");
    const extra: string[] = [];
    if (lv?.temperature != null) extra.push(`${lv.temperature.toFixed(1)} °C`);
    if (lv?.soc != null) extra.push(`${Math.round(lv.soc)}%`);
    if (lv?.current_a != null && load.type === "ev") extra.push(`${Math.round(lv.current_a)} A`);
    return html`
      <div
        class="load ${this._dragId === load.id ? "dragging" : ""} ${load.enabled ? "" : "disabled"}"
        draggable="true"
        @dragstart=${() => (this._dragId = load.id)}
        @dragend=${() => (this._dragId = null)}
        @dragover=${(e: DragEvent) => e.preventDefault()}
        @drop=${() => this._onDrop(load.id)}
      >
        <div class="handle">
          <button @click=${() => this._move(load.id, -1)} ?disabled=${index === 0}>▲</button>
          <span class="prio">${index + 1}</span>
          <button @click=${() => this._move(load.id, 1)} ?disabled=${index === this.loads.length - 1}>▼</button>
        </div>
        <ha-icon class=${lv?.is_on && p > 1 ? "on" : ""} .icon=${icon}></ha-icon>
        <div class="body">
          <div class="row">
            <span class="name">${load.name}</span>
            <span class="chip ${reasonClass(lv?.reason ?? "")}">${t(`reason.${lv?.reason ?? "idle"}`)}</span>
            ${extra.length ? html`<span class="muted">${extra.join(" · ")}</span>` : nothing}
          </div>
          <div class="meter">
            <div class="s" style="width:${(Math.min(solar, max) / max) * 100}%"></div>
            <div class="g" style="width:${(Math.min(Math.max(0, p - solar), max) / max) * 100}%"></div>
          </div>
          <div class="row muted" style="margin-top:6px">
            <span>${fmtKwh(lv?.kwh_today ?? 0)} ${t("load.today")} · ${fmtKwh(lv?.solar_kwh_today ?? 0)} ${t("load.from_solar")} · ${fmtDur(lv?.runtime_today_s)}</span>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="seg">
              ${MODES.map(
                (m) => html`<button class=${load.mode === m ? "on" : ""} title=${t(`mode.${m}.desc`)} @click=${() => this._setMode(load, m)}>${t(`mode.${m}`)}</button>`,
              )}
            </div>
            <span class="spacer"></span>
            <button @click=${() => this._emit("open-analytics", { id: load.id })}>${t("load.analytics")}</button>
            <button @click=${() => this._emit("edit-load", { id: load.id })}>${t("load.edit")}</button>
          </div>
        </div>
        <div class="power">${fmtW(p)}</div>
      </div>
    `;
  }

  render() {
    return html`
      ${this._renderSite()}
      <div class="card">
        <div class="row">
          <h2 style="margin:0">${t("loads.title")}</h2>
          <span class="spacer"></span>
          <button class="primary" @click=${() => this._emit("edit-load", { id: null })}>+ ${t("loads.add")}</button>
        </div>
        <p class="muted">${t("loads.hint")}</p>
        ${this.loads.length ? this.loads.map((l, i) => this._renderLoad(l, i)) : html`<p>${t("loads.empty")}</p>`}
      </div>
    `;
  }
}
