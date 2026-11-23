import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { t } from "../i18n";
import { cardStyles, fmtKwh, splitW, tokens } from "../styles/tokens";
import type { LiveLoad, Load, Mode } from "../types";
import "./shared/sm-segmented";
import "./shared/sm-sparkline";
import { modeOptions, reasonIcon, reasonTone } from "./common";

/** Dashboard card for one load, in the style of a RoomMind room card. */
@customElement("sm-load-card")
export class SmLoadCard extends LitElement {
  @property({ attribute: false }) load!: Load;
  @property({ attribute: false }) live?: LiveLoad;
  @property({ attribute: false }) spark: [number, number, number][] = [];
  @property({ type: Number }) priority = 1;

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: block; }
      .card { display: flex; flex-direction: column; overflow: hidden; cursor: pointer; height: 100%; }
      .card:hover { border-color: var(--sm-border-strong); }
      .head { display: flex; align-items: center; gap: 10px; padding: 14px 16px 0; }
      .head > ha-icon { --mdc-icon-size: 22px; color: var(--secondary-text-color); }
      .head > ha-icon.active { color: var(--sm-solar); }
      .name { font-size: 16px; font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .prio { font-size: 12px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
      .status { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--secondary-text-color); white-space: nowrap; --mdc-icon-size: 16px; }
      .status.solar { color: var(--sm-solar-text); }
      .status.solar ha-icon { color: var(--sm-solar); }
      .status.grid { color: var(--sm-grid-text); }
      .status.grid ha-icon { color: var(--sm-grid); }
      .status.warn { color: var(--sm-warn-text); }
      .status.warn ha-icon { color: var(--sm-warn); }
      .status.ok { color: var(--sm-ok-text); }
      .status.ok ha-icon { color: var(--sm-ok); }
      .dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; margin: 0 4px; }
      .main { display: flex; align-items: flex-start; padding: 6px 16px 0; gap: 12px; }
      .big { display: flex; align-items: flex-start; gap: 4px; }
      .big .v { font-size: 48px; font-weight: 300; line-height: 1.05; font-variant-numeric: tabular-nums; letter-spacing: -1px; }
      .big .u { font-size: 18px; color: var(--secondary-text-color); margin-top: 6px; }
      .extra { display: flex; gap: 10px; margin-top: 12px; font-size: 13px; color: var(--secondary-text-color); --mdc-icon-size: 14px; }
      .extra span { display: inline-flex; align-items: center; gap: 3px; }
      .side { margin-left: auto; text-align: end; }
      .side .l { font-size: 13px; color: var(--secondary-text-color); }
      .side .v { font-size: 18px; font-weight: 500; font-variant-numeric: tabular-nums; }
      .side .s { font-size: 12px; color: var(--secondary-text-color); }
      .chart { position: relative; margin-top: 6px; }
      .chart .hint { position: absolute; left: 12px; bottom: 8px; }
      .foot { padding: 0 16px 16px; margin-top: auto; }
      .foot .seg-wrap { padding-top: 8px; }
    `,
  ];

  private _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: true, composed: true }));
  }

  private _hint(): string | null {
    const lv = this.live;
    const l = this.load;
    if (!lv) return null;
    if (lv.reason === "peak_guard") return t("hint.peak");
    if (lv.is_full) return t(l.type === "ev" ? "hint.full_ev" : "hint.full");
    if (l.mode === "solar_night" && lv.night_needed === true) return t("hint.night_needed");
    if (l.mode === "solar_night" && lv.night_needed === false) return t("hint.night_not_needed");
    if (l.type === "ev" && lv.plugged === false) return t("reason.not_connected");
    if (l.type === "ev" && lv.is_on && lv.current_a != null) return `${t("hint.charging_at")} ${Math.round(lv.current_a)} A`;
    return null;
  }

  render() {
    const l = this.load;
    const lv = this.live;
    const [v, u] = splitW(lv?.power_w ?? 0);
    const reason = lv?.reason ?? "idle";
    const tone = reasonTone(reason);
    const active = !!lv?.is_on && (lv?.power_w ?? 0) > 1;
    const icon = l.icon || (l.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler");
    const nominal = l.type === "ev" ? (l.ev_max_current ?? 16) * 230 * (l.ev_phases ?? 1) : l.nominal_power_w;
    const share = lv?.kwh_today ? (lv.solar_kwh_today ?? 0) / lv.kwh_today : null;
    const hint = this._hint();
    return html`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${active ? "active" : ""} .icon=${icon}></ha-icon>
        <span class="name">${l.name}</span>
        <span class="status ${tone}">
          ${tone ? html`<ha-icon .icon=${reasonIcon(reason)}></ha-icon>` : html`<span class="dot"></span>`}
          ${t(`reason.${reason}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big"><span class="v">${v}</span><span class="u">${u}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${lv?.temperature != null ? html`<span><ha-icon icon="mdi:thermometer"></ha-icon>${lv.temperature.toFixed(1)} °C</span>` : nothing}
            ${lv?.soc != null ? html`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(lv.soc)}%</span>` : nothing}
            ${!l.enabled ? html`<span>${t("reason.disabled")}</span>` : nothing}
          </div>
        </div>
        <div class="side">
          <div class="l">${t("load.today")}</div>
          <div class="v">${fmtKwh(lv?.kwh_today ?? 0, 1)}</div>
          <div class="s">${share === null ? "" : `${Math.round(share * 100)}% ${t("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${nominal} .height=${76}></sm-sparkline>
        ${hint ? html`<span class="hint">${hint}</span>` : nothing}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${modeOptions()} .value=${l.mode}
          @value-changed=${(e: CustomEvent) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: l.id, mode: e.detail.value as Mode }, bubbles: true, composed: true }))}></sm-segmented>
      </div></div>
    </div>`;
  }
}
