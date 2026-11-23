import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { saveSettings } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import type { Hass, Settings } from "../types";
import "./sm-entity-picker";

@customElement("sm-settings")
export class SmSettings extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) settings!: Settings;
  @state() private _draft: Settings = {};
  @state() private _saved = false;

  static styles = shared;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("settings")) this._draft = { ...this.settings };
  }

  private _set(key: string, value: any) {
    this._draft = { ...this._draft, [key]: value };
    this._saved = false;
  }

  private _entity(key: string, domains = ["sensor"]) {
    return html`<sm-entity-picker .hass=${this.hass} .label=${t(`s.${key}`)} .value=${this._draft[key]} .domains=${domains}
      @value-changed=${(e: CustomEvent) => this._set(key, e.detail.value)}></sm-entity-picker>`;
  }

  private _num(key: string, step = 1) {
    return html`<label class="field">${t(`s.${key}`)}
      <input type="number" step=${step} .value=${String(this._draft[key] ?? "")}
        @change=${(e: Event) => this._set(key, Number((e.target as HTMLInputElement).value))} /></label>`;
  }

  private _bool(key: string) {
    return html`<label class="check"><input type="checkbox" .checked=${!!this._draft[key]}
      @change=${(e: Event) => this._set(key, (e.target as HTMLInputElement).checked)} />${t(`s.${key}`)}</label>`;
  }

  private _select(key: string, options: string[]) {
    return html`<label class="field">${t(`s.${key}`)}
      <select @change=${(e: Event) => this._set(key, (e.target as HTMLSelectElement).value)}>
        ${options.map((o) => html`<option value=${o} ?selected=${this._draft[key] === o}>${t(`s.${key}.${o}`)}</option>`)}
      </select></label>`;
  }

  private _time(key: string) {
    return html`<label class="field">${t(`s.${key}`)}
      <input type="time" .value=${this._draft[key] ?? ""} @change=${(e: Event) => this._set(key, (e.target as HTMLInputElement).value)} /></label>`;
  }

  private async _save() {
    await saveSettings(this.hass, this._draft);
    this._saved = true;
    this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: true, composed: true }));
  }

  render() {
    const d = this._draft;
    return html`
      <div class="card">
        ${this._bool("enabled")}
        <h3>${t("s.section.meter")}</h3>
        <div class="grid2">
          ${this._select("grid_mode", ["single", "split"])}
          ${d.grid_mode === "split"
            ? html`${this._entity("grid_import_entity")}${this._entity("grid_export_entity")}`
            : html`${this._entity("grid_power_entity")}${this._select("grid_sign", ["import_positive", "export_positive"])}`}
          ${this._num("voltage")}
        </div>
        <h3>${t("s.section.pv")}</h3>
        <div class="grid2">
          ${this._entity("pv_power_entity")}
          ${this._entity("pv_forecast_today_entity")}
          ${this._entity("pv_forecast_tomorrow_entity")}
        </div>
        <h3>${t("s.section.peak")}</h3>
        <div class="grid2">
          ${this._bool("peak_guard_enabled")}
          ${d.peak_guard_enabled
            ? html`${this._num("peak_limit_w", 100)}${this._num("peak_margin_w", 50)}${this._bool("peak_follow_month_max")}`
            : nothing}
        </div>
        <h3>${t("s.section.night")}</h3>
        <div class="grid2">${this._time("night_start")}${this._time("night_end")}</div>
        <h3>${t("s.section.prices")}</h3>
        <div class="grid2">${this._num("price_import", 0.01)}${this._num("price_export", 0.01)}</div>
        <div class="row" style="margin-top:16px">
          <span class="spacer"></span>
          ${this._saved ? html`<span class="muted">${t("s.saved")}</span>` : nothing}
          <button class="primary" @click=${this._save}>${t("load.save")}</button>
        </div>
      </div>
    `;
  }
}
