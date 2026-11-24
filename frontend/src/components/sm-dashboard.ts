import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { reorderLoads } from "../api";
import { t } from "../i18n";
import { cardStyles, fmtW, tokens } from "../styles/tokens";
import type { Hass, Live, Load } from "../types";
import { defaultIcon } from "./common";
import "./sm-load-card";
import "./shared/sm-list-row";

/** Overview: status pills and one card per load, or the reorder list in edit mode. */
@customElement("sm-dashboard")
export class SmDashboard extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) loads: Load[] = [];
  @property({ attribute: false }) live?: Live;
  @property({ attribute: false }) spark: Record<string, [number, number, number][]> = {};
  @property({ type: Boolean }) editing = false;
  @state() private _dragId: string | null = null;

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: block; }
      .pills { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; }
      .pills ha-icon.solar { color: var(--sm-solar); }
      .pills ha-icon.grid { color: var(--sm-grid); }
      .pills ha-icon.export { color: var(--sm-export); }
      .pills ha-icon.warn { color: var(--sm-warn); }
      @media (max-width: 600px) {
        .pills { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
      }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); gap: 12px; }
      .add {
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 200px;
        border: 2px dashed var(--sm-border); border-radius: var(--sm-radius); color: var(--secondary-text-color);
        cursor: pointer; background: none; font: inherit; font-size: 15px; --mdc-icon-size: 32px;
      }
      .add:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .banner {
        display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin-bottom: 12px; border-radius: var(--sm-radius);
        background: color-mix(in srgb, var(--sm-warn) 12%, transparent); color: var(--sm-warn-text); font-size: 14px;
        --mdc-icon-size: 20px;
      }
      .edit-list { max-width: 720px; }
      .edit-row { display: flex; align-items: center; border-top: 1px solid var(--sm-border); }
      .edit-row:first-of-type { border-top: none; }
      .edit-row.dragging { opacity: 0.4; }
      .edit-row sm-list-row { flex: 1; min-width: 0; }
      .handle { cursor: grab; color: var(--secondary-text-color); padding: 0 4px 0 12px; --mdc-icon-size: 22px; }
      .placeholder { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px 16px; text-align: center; color: var(--secondary-text-color); }
      .placeholder ha-icon { --mdc-icon-size: 56px; opacity: 0.4; }
    `,
  ];

  private _emit(name: string, detail: any = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private async _saveOrder(order: string[]) {
    this._emit("loads-reordered", { order });
    await reorderLoads(this.hass, order);
  }

  private _move(id: string, delta: number) {
    const order = this.loads.map((l) => l.id);
    const i = order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this._saveOrder(order);
  }

  private _drop(targetId: string) {
    if (!this._dragId || this._dragId === targetId) return;
    const order = this.loads.map((l) => l.id).filter((i) => i !== this._dragId);
    order.splice(order.indexOf(targetId), 0, this._dragId);
    this._dragId = null;
    this._saveOrder(order);
  }

  private _pills() {
    const s = this.live?.site ?? {};
    const grid = s.grid_w as number | null | undefined;
    const exporting = grid != null && grid < 0;
    const peakTone = (s.quarter_projected_w ?? 0) > (s.peak_limit_w ?? Infinity) ? "warn" : "grid";
    return html`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${t("site.pv")} <b>${fmtW(s.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${exporting ? "export" : "grid"} icon=${exporting ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${exporting ? t("site.export") : t("site.import")} <b>${fmtW(grid == null ? null : Math.abs(grid))}</b></span>
      <span class="pill"><ha-icon class="solar" icon="mdi:white-balance-sunny"></ha-icon>${t("site.surplus")} <b>${fmtW(s.surplus_w)}</b></span>
      <span class="pill"><ha-icon icon="mdi:lightning-bolt"></ha-icon>${t("site.managed")} <b>${fmtW(s.managed_w)}</b></span>
      <span class="pill"><ha-icon class=${peakTone} icon="mdi:chart-bell-curve-cumulative"></ha-icon>${t("site.peak_now")}
        <b>${fmtW(s.quarter_average_w)}</b>&nbsp;/ ${fmtW(s.peak_limit_w)}</span>
      <span class="pill"><ha-icon icon="mdi:calendar-month"></ha-icon>${t("site.month_peak")} <b>${fmtW(s.month_peak_w)}</b></span>
      ${s.in_night ? html`<span class="pill"><ha-icon icon="mdi:weather-night"></ha-icon>${t("site.night")}</span>` : nothing}
    </div>`;
  }

  private _editList() {
    return html`<div class="card edit-list">
      <div class="card-head"><h2>${t("loads.title")}</h2></div>
      <div class="card-body muted" style="padding-bottom:8px">${t("loads.hint")}</div>
      ${this.loads.map(
        (l, i) => html`<div class="edit-row ${this._dragId === l.id ? "dragging" : ""}" draggable="true"
          @dragstart=${() => (this._dragId = l.id)} @dragend=${() => (this._dragId = null)}
          @dragover=${(e: DragEvent) => e.preventDefault()} @drop=${() => this._drop(l.id)}>
          <ha-icon class="handle" icon="mdi:drag"></ha-icon>
          <sm-list-row .icon=${l.icon || defaultIcon(l.type)} .heading=${`${i + 1}. ${l.name}`}
            .secondary=${t(`mode.${l.mode}`)}>
            <button class="icon" ?disabled=${i === 0} @click=${() => this._move(l.id, -1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button class="icon" ?disabled=${i === this.loads.length - 1} @click=${() => this._move(l.id, 1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          </sm-list-row>
        </div>`,
      )}
    </div>`;
  }

  render() {
    const s = this.live?.site ?? {};
    return html`
      ${s.available === false ? html`<div class="banner"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("site.no_grid")}</div>` : nothing}
      ${s.enabled === false ? html`<div class="banner"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${t("site.disabled")}</div>` : nothing}
      ${this._pills()}
      ${this.editing
        ? this._editList()
        : this.loads.length
          ? html`<div class="grid">
              ${this.loads.map((l, i) => html`<sm-load-card .load=${l} .live=${this.live?.loads?.[l.id]} .spark=${this.spark[l.id] ?? []} .priority=${i + 1}></sm-load-card>`)}
              <button class="add" @click=${() => this._emit("add-load")}><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${t("loads.add")}</button>
            </div>`
          : html`<div class="placeholder"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><p>${t("loads.empty")}</p>
              <button class="filled" @click=${() => this._emit("add-load")}>${t("loads.add")}</button></div>`}
    `;
  }
}
