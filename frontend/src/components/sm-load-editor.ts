import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { deleteLoad, saveLoad } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import type { Hass, Load } from "../types";
import "./sm-entity-picker";

type FieldKind = "number" | "text" | "bool" | "entity" | "select" | "time";

interface Field {
  key: string;
  kind: FieldKind;
  domains?: string[];
  options?: string[];
  nullable?: boolean;
  step?: number;
  show?: (l: Load) => boolean;
}

const isEv = (l: Load) => l.type === "ev";
const isSwitch = (l: Load) => l.type === "switch";
const isTesla = (l: Load) => isEv(l) && l.ev_driver === "tesla_ble_proxy";
const isEvEntities = (l: Load) => isEv(l) && l.ev_driver !== "tesla_ble_proxy";

const SECTIONS: { title: string; fields: Field[]; show?: (l: Load) => boolean; hint?: string }[] = [
  {
    title: "f.section.general",
    fields: [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev"] },
      { key: "mode", kind: "select", options: ["solar", "solar_night", "on", "off"] },
      { key: "icon", kind: "text" },
      { key: "enabled", kind: "bool" },
      { key: "peak_shed", kind: "bool" },
    ],
  },
  {
    title: "f.section.device",
    fields: [
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: isSwitch },
      { key: "nominal_power_w", kind: "number", show: isSwitch },
      { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"], show: isEv },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: isEvEntities },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: isEvEntities },
      { key: "ev_proxy_url", kind: "text", show: isTesla },
      { key: "ev_vin", kind: "text", show: isTesla },
      { key: "power_entity", kind: "entity", domains: ["sensor"] },
      { key: "temperature_entity", kind: "entity", domains: ["sensor"], show: isSwitch },
      { key: "max_temperature", kind: "number", nullable: true, show: isSwitch },
      { key: "ev_soc_entity", kind: "entity", domains: ["sensor"], show: isEv },
      { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: isEvEntities },
      { key: "full_threshold_w", kind: "number" },
    ],
  },
  {
    title: "f.section.ev",
    show: isEv,
    fields: [
      { key: "ev_phases", kind: "select", options: ["1", "3"] },
      { key: "ev_min_current", kind: "number" },
      { key: "ev_max_current", kind: "number" },
      { key: "ev_min_soc", kind: "number", nullable: true },
      { key: "ev_target_soc", kind: "number" },
      { key: "ev_current_step_interval_s", kind: "number" },
    ],
  },
  {
    title: "f.section.timing",
    fields: [
      { key: "start_delay_s", kind: "number" },
      { key: "stop_delay_s", kind: "number" },
      { key: "min_on_s", kind: "number" },
      { key: "min_off_s", kind: "number" },
      { key: "allowed_import_w", kind: "number" },
      { key: "start_margin_w", kind: "number" },
    ],
  },
  {
    title: "f.section.night",
    show: (l) => l.mode === "solar_night",
    fields: [
      { key: "night_min_solar_kwh", kind: "number", step: 0.1, show: (l) => !(isEv(l) && l.ev_soc_entity) },
      { key: "night_target_kwh", kind: "number", step: 0.1, show: isSwitch },
      { key: "night_min_temperature", kind: "number", nullable: true, show: isSwitch },
      { key: "night_skip_forecast_kwh", kind: "number", nullable: true, step: 0.5 },
    ],
  },
  {
    title: "f.section.legionella",
    show: isSwitch,
    hint: "f.legionella.hint",
    fields: [
      { key: "legionella_enabled", kind: "bool" },
      { key: "legionella_temperature", kind: "number", show: (l) => l.legionella_enabled },
      { key: "legionella_interval_days", kind: "number", show: (l) => l.legionella_enabled },
    ],
  },
];

@customElement("sm-load-editor")
export class SmLoadEditor extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) load!: Load;
  @state() private _draft!: Load;
  @state() private _busy = false;
  @state() private _confirmDelete = false;
  @state() private _error = "";

  static styles = [
    shared,
    css`
      .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
      .modes { display: grid; gap: 4px; margin-top: 4px; }
    `,
  ];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("load")) this._draft = { ...this.load };
  }

  private _set(key: string, value: any) {
    const next: Load = { ...this._draft, [key]: value };
    if (key === "type" && value === "ev" && (!this._draft.icon || this._draft.icon === "mdi:water-boiler")) next.icon = "mdi:ev-station";
    if (key === "type" && value === "switch" && this._draft.icon === "mdi:ev-station") next.icon = "mdi:water-boiler";
    this._draft = next;
  }

  private _renderField(f: Field) {
    const d = this._draft;
    if (f.show && !f.show(d)) return nothing;
    const label = t(`f.${f.key}`);
    const v = d[f.key];
    switch (f.kind) {
      case "entity":
        return html`<sm-entity-picker .hass=${this.hass} .label=${label} .value=${v} .domains=${f.domains ?? []}
          @value-changed=${(e: CustomEvent) => this._set(f.key, e.detail.value)}></sm-entity-picker>`;
      case "bool":
        return html`<label class="check"><input type="checkbox" .checked=${!!v}
          @change=${(e: Event) => this._set(f.key, (e.target as HTMLInputElement).checked)} />${label}</label>`;
      case "select": {
        const opts = f.options ?? [];
        const optLabel = (o: string) =>
          f.key === "mode" ? t(`mode.${o}`) : f.key === "type" ? t(`type.${o}`) : f.key === "ev_driver" ? t(`f.ev_driver.${o}`) : o;
        return html`<label class="field">${label}
          <select @change=${(e: Event) => {
            const raw = (e.target as HTMLSelectElement).value;
            this._set(f.key, f.key === "ev_phases" ? Number(raw) : raw);
          }}>
            ${opts.map((o) => html`<option value=${o} ?selected=${String(v) === o}>${optLabel(o)}</option>`)}
          </select>
          ${f.key === "mode" ? html`<span class="muted">${t(`mode.${v}.desc`)}</span>` : nothing}
        </label>`;
      }
      case "number":
        return html`<label class="field">${label}
          <input type="number" step=${f.step ?? 1} .value=${v === null || v === undefined ? "" : String(v)}
            @change=${(e: Event) => {
              const raw = (e.target as HTMLInputElement).value;
              this._set(f.key, raw === "" ? (f.nullable ? null : 0) : Number(raw));
            }} /></label>`;
      default:
        return html`<label class="field">${label}
          <input type="text" .value=${v ?? ""} @change=${(e: Event) => this._set(f.key, (e.target as HTMLInputElement).value)} /></label>`;
    }
  }

  private async _save() {
    this._busy = true;
    this._error = "";
    try {
      const res = await saveLoad(this.hass, this._draft);
      this.dispatchEvent(new CustomEvent("load-saved", { detail: { load: res.load }, bubbles: true, composed: true }));
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    } finally {
      this._busy = false;
    }
  }

  private async _delete() {
    if (!this._confirmDelete) {
      this._confirmDelete = true;
      return;
    }
    this._busy = true;
    await deleteLoad(this.hass, this._draft.id);
    this._busy = false;
    this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this._draft.id }, bubbles: true, composed: true }));
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent("close-editor", { bubbles: true, composed: true }));
  }

  render() {
    const d = this._draft;
    return html`
      <div class="card">
        <h2>${d.id ? d.name : t("load.new")}</h2>
        ${SECTIONS.filter((s) => !s.show || s.show(d)).map(
          (s) => html`
            <h3>${t(s.title)}</h3>
            ${s.hint ? html`<p class="muted">${t(s.hint)}</p>` : nothing}
            <div class="grid2">${s.fields.map((f) => this._renderField(f))}</div>
          `,
        )}
        ${this._error ? html`<div class="banner">${this._error}</div>` : nothing}
        <div class="actions">
          ${d.id ? html`<button class="danger" @click=${this._delete} ?disabled=${this._busy}>${this._confirmDelete ? t("load.delete_confirm") : t("load.delete")}</button>` : nothing}
          <span class="spacer"></span>
          <button @click=${this._cancel}>${t("load.cancel")}</button>
          <button class="primary" @click=${this._save} ?disabled=${this._busy || !d.name}>${t("load.save")}</button>
        </div>
      </div>
    `;
  }
}
