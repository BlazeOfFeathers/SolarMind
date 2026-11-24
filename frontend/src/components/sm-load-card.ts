import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { t } from "../i18n";
import { cardStyles, fmtClockIn, fmtEta, fmtKwh, splitW, tokens } from "../styles/tokens";
import type { LiveLoad, Load, Mode } from "../types";
import "./shared/sm-segmented";
import "./shared/sm-sparkline";
import { defaultIcon, isBattery, modeOptions, reasonIcon, reasonTone } from "./common";

/** Dashboard card for one load, in the style of a RoomMind room card. */
@customElement("sm-load-card")
export class SmLoadCard extends LitElement {
  @property({ attribute: false }) load!: Load;
  @property({ attribute: false }) live?: LiveLoad;
  @property({ attribute: false }) spark: [number, number, number][] = [];
  @property({ type: Number }) priority = 1;
  /** Pending minimum-power choice while the user is still clicking (amps, 0 = off). */
  @state() private _minAmps: number | null = null;
  private _minTimer?: number;

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
      .big .dir { --mdc-icon-size: 26px; margin-top: 12px; color: var(--secondary-text-color); }
      .big .u { font-size: 18px; color: var(--secondary-text-color); margin-top: 6px; }
      .eta { color: var(--primary-text-color); }
      .eta.est { color: var(--secondary-text-color); }
      .limit { font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; }
      .extra { flex-wrap: wrap; row-gap: 2px; }
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
      .minp { display: flex; align-items: center; gap: 8px; padding-top: 10px; font-size: 13px; color: var(--secondary-text-color); --mdc-icon-size: 18px; cursor: default; }
      .minp .lbl { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }
      .minp .lbl span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .stepper { display: inline-flex; align-items: center; border: 1px solid var(--sm-border, var(--divider-color)); border-radius: 18px; overflow: hidden; }
      .stepper button { all: unset; cursor: pointer; width: 32px; height: 30px; display: grid; place-items: center; color: var(--primary-text-color); font-size: 18px; }
      .stepper button:hover:not([disabled]) { background: var(--secondary-background-color); }
      .stepper button[disabled] { opacity: 0.35; cursor: default; }
      .stepper .val { min-width: 92px; text-align: center; color: var(--primary-text-color); font-variant-numeric: tabular-nums; font-weight: 500; }
      .stepper .val.off { color: var(--secondary-text-color); font-weight: 400; }
    `,
  ];

  private _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: true, composed: true }));
  }

  private _hint(): string | null {
    const lv = this.live;
    const l = this.load;
    if (!lv) return null;
    if (lv.driver_error) return `${t("hint.driver_error")}: ${lv.driver_error}`;
    if (isBattery(l)) {
      if (l.mode === "solar_night" && lv.night_needed === true) return t("hint.bat_night");
      if (lv.reason === "peak_guard" && (lv.power_w ?? 0) < 0) return t("hint.bat_peak");
      return lv.stored_kwh != null ? `${fmtKwh(lv.stored_kwh, 1)} ${t("hint.bat_stored")}` : null;
    }
    if (l.type === "ev" && lv.car_state === "NoPower") return t("hint.no_power");
    if (lv.reason === "peak_guard") return t("hint.peak");
    if (lv.is_full) return t(l.type === "ev" ? "hint.full_ev" : "hint.full");
    if (l.mode === "solar_night" && lv.night_needed === true) return t("hint.night_needed");
    if (l.mode === "solar_night" && lv.night_needed === false) return t("hint.night_not_needed");
    if (l.type === "ev" && lv.plugged === false) return t("reason.not_connected");
    if (l.type === "ev" && lv.is_on && lv.current_a != null) return `${t("hint.charging_at")} ${Math.round(lv.current_a)} A`;
    return null;
  }

  private _batEta() {
    const lv = this.live;
    if (!lv) return nothing;
    if (lv.eta_full_s) return html`<span class="eta"><ha-icon icon="mdi:battery-arrow-up"></ha-icon>${t("eta.bat_full").replace("{t}", fmtClockIn(lv.eta_full_s))}</span>`;
    if (lv.eta_empty_s) return html`<span class="eta"><ha-icon icon="mdi:battery-arrow-down"></ha-icon>${t("eta.bat_empty").replace("{t}", fmtClockIn(lv.eta_empty_s))}</span>`;
    return nothing;
  }

  private _eta() {
    const lv = this.live;
    if (isBattery(this.load)) return this._batEta();
    if (this.load.type !== "ev" || !lv || lv.plugged === false) return nothing;
    if (lv.soc != null && lv.soc < 100 && !lv.battery_kwh && lv.eta_full_s == null && lv.eta_limit_s == null) {
      return html`<span class="eta est"><ha-icon icon="mdi:timer-sand"></ha-icon>${t("eta.need_capacity")}</span>`;
    }
    if (lv.eta_full_s == null || !lv.eta_full_s) return nothing;
    const est = !!lv.eta_estimated;
    const d = `${est ? "~" : ""}${fmtEta(lv.eta_full_s)}`;
    const tail = est ? ` ${t("eta.at_min")}` : ` (± ${fmtClockIn(lv.eta_full_s)})`;
    return html`<span class="eta ${est ? "est" : ""}"><ha-icon icon="mdi:timer-sand"></ha-icon>${t("eta.full").replace("{d}", d)}${tail}</span>`;
  }

  private _limitLine() {
    const lv = this.live;
    if (this.load.type !== "ev" || !lv || lv.eta_limit_s == null || lv.charge_limit == null || lv.plugged === false) return nothing;
    const when = `${lv.eta_estimated ? "~" : ""}${fmtClockIn(lv.eta_limit_s)}`;
    return html`<div class="limit">${t("eta.limit").replace("{soc}", String(Math.round(lv.charge_limit))).replace("{t}", when)}</div>`;
  }

  private _wpa(): number {
    return 230 * (this.load.ev_phases ?? 1);
  }

  /** Current minimum in amps (0 = off), from the pending click or the saved watts. */
  private _curAmps(): number {
    if (this._minAmps !== null) return this._minAmps;
    const w = this.load.ev_min_power_w;
    if (!w) return 0;
    const min = this.load.ev_min_current ?? 6;
    const max = this.load.ev_max_current ?? 16;
    return Math.max(min, Math.min(max, Math.ceil(w / this._wpa() - 1e-9)));
  }

  private _step(e: Event, dir: number) {
    e.stopPropagation();
    const min = this.load.ev_min_current ?? 6;
    const max = this.load.ev_max_current ?? 16;
    const cur = this._curAmps();
    let next = cur + dir;
    if (dir > 0 && cur === 0) next = min;
    if (dir < 0 && cur <= min) next = 0;
    next = Math.min(max, Math.max(0, next));
    if (next === cur) return;
    this._minAmps = next;
    window.clearTimeout(this._minTimer);
    this._minTimer = window.setTimeout(() => {
      const amps = this._minAmps ?? 0;
      this.dispatchEvent(new CustomEvent("set-min-power", {
        detail: { id: this.load.id, power_w: amps ? amps * this._wpa() : null }, bubbles: true, composed: true,
      }));
    }, 700);
  }

  protected updated(changed: Map<string, unknown>) {
    // Once the saved value catches up with the pending click, drop the local copy.
    if (changed.has("load") && this._minAmps !== null) {
      const w = this.load.ev_min_power_w;
      if ((w ? Math.round(w / this._wpa()) : 0) === this._minAmps) this._minAmps = null;
    }
  }

  private _minPowerRow() {
    const amps = this._curAmps();
    const max = this.load.ev_max_current ?? 16;
    const kw = (amps * this._wpa()) / 1000;
    return html`<div class="minp" @click=${(e: Event) => e.stopPropagation()} title=${t("card.min_power_help")}>
      <span class="lbl"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${t("f.ev_min_power_w")}</span></span>
      <span class="stepper">
        <button ?disabled=${amps === 0} @click=${(e: Event) => this._step(e, -1)} aria-label="-">−</button>
        <span class="val ${amps ? "" : "off"}">${amps ? `${kw.toLocaleString(undefined, { maximumFractionDigits: 1 })} kW · ${amps} A` : t("card.min_power_off")}</span>
        <button ?disabled=${amps >= max} @click=${(e: Event) => this._step(e, 1)} aria-label="+">+</button>
      </span>
    </div>`;
  }

  render() {
    const l = this.load;
    const lv = this.live;
    const bat = isBattery(l);
    const [v, u] = splitW(bat ? Math.abs(lv?.power_w ?? 0) : lv?.power_w ?? 0);
    const dir = bat && lv ? (lv.power_w > 1 ? "mdi:arrow-up-bold" : lv.power_w < -1 ? "mdi:arrow-down-bold" : "") : "";
    const reason = lv?.reason ?? "idle";
    const tone = reasonTone(reason);
    const active = !!lv?.is_on && Math.abs(lv?.power_w ?? 0) > 1;
    const icon = l.icon || defaultIcon(l.type);
    const nominal = l.type === "ev"
      ? (l.ev_max_current ?? 16) * 230 * (l.ev_phases ?? 1)
      : bat ? Math.max(l.bat_max_charge_w ?? 0, l.bat_max_discharge_w ?? 0) : l.nominal_power_w;
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
          <div class="big">${dir ? html`<ha-icon class="dir" .icon=${dir}></ha-icon>` : nothing}<span class="v">${v}</span><span class="u">${u}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${lv?.temperature != null ? html`<span><ha-icon icon="mdi:thermometer"></ha-icon>${lv.temperature.toFixed(1)} °C</span>` : nothing}
            ${lv?.soc != null ? html`<span><ha-icon .icon=${bat ? "mdi:home-battery-outline" : "mdi:battery-charging"}></ha-icon>${Math.round(lv.soc)}%</span>` : nothing}
            ${this._eta()}
            ${!l.enabled ? html`<span>${t("reason.disabled")}</span>` : nothing}
          </div>
          ${this._limitLine()}
        </div>
        <div class="side">
          <div class="l">${bat ? t("load.charged_today") : t("load.today")}</div>
          <div class="v">${fmtKwh(lv?.kwh_today ?? 0, 1)}</div>
          <div class="s">${bat
            ? `${fmtKwh(lv?.discharge_kwh_today ?? 0, 1)} ${t("load.discharged")}`
            : share === null ? "" : `${Math.round(share * 100)}% ${t("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${nominal} .height=${76}></sm-sparkline>
        ${hint ? html`<span class="hint">${hint}</span>` : nothing}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${modeOptions(l.type)} .value=${l.mode}
          @value-changed=${(e: CustomEvent) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: l.id, mode: e.detail.value as Mode }, bubbles: true, composed: true }))}></sm-segmented>
      </div>
      ${l.type === "ev" && l.mode === "solar" ? this._minPowerRow() : nothing}
      </div>
    </div>`;
  }
}
