import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { t } from "../../i18n";
import { tokens } from "../../styles/tokens";
import type { Hass } from "../../types";
import "./sm-toggle";

export type FieldKind = "number" | "text" | "bool" | "entity" | "select" | "time";

export interface FieldSpec {
  key: string;
  kind: FieldKind;
  label?: string;
  helper?: string;
  domains?: string[];
  options?: { value: string; label: string }[];
  nullable?: boolean;
  step?: number;
  unit?: string;
  show?: (d: Record<string, any>) => boolean;
}

let uid = 0;

/** Form built from field specs. Fires `value-changed` with `{ key, value }`. */
@customElement("sm-form")
export class SmForm extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) fields: FieldSpec[] = [];
  @property({ attribute: false }) data: Record<string, any> = {};
  @property() prefix = "f";

  static styles = [
    tokens,
    css`
      :host { display: flex; flex-direction: column; gap: 14px; }
      label.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--secondary-text-color); }
      .wrap { position: relative; display: flex; align-items: center; }
      input, select {
        font: inherit; font-size: 15px; color: var(--primary-text-color); width: 100%; box-sizing: border-box;
        height: 48px; padding: 0 14px; border-radius: var(--sm-radius-sm); border: 1px solid var(--sm-border-strong);
        background: var(--sm-surface); outline: none;
      }
      input:focus, select:focus { border-color: var(--primary-color); box-shadow: inset 0 0 0 1px var(--primary-color); }
      .unit { position: absolute; right: 14px; color: var(--secondary-text-color); font-size: 14px; pointer-events: none; }
      .help { font-size: 12px; color: var(--secondary-text-color); line-height: 1.4; }
      .ent-state { font-size: 12px; color: var(--secondary-text-color); }
      .bool { display: flex; align-items: center; gap: 16px; min-height: 48px; }
      .bool .txt { flex: 1; font-size: 15px; color: var(--primary-text-color); }
      .bool .txt .help { display: block; margin-top: 2px; }
      ha-entity-picker { display: block; }
    `,
  ];

  private _emit(key: string, value: any) {
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { key, value }, bubbles: true, composed: true }));
  }

  private _label(f: FieldSpec) {
    return f.label ?? t(`${this.prefix}.${f.key}`);
  }

  private _entity(f: FieldSpec, v: any) {
    const label = this._label(f);
    if (customElements.get("ha-entity-picker")) {
      return html`<ha-entity-picker .hass=${this.hass} .label=${label} .value=${v ?? ""} allow-custom-entity
        .includeDomains=${f.domains} @value-changed=${(e: CustomEvent) => this._emit(f.key, e.detail.value || null)}></ha-entity-picker>
        ${f.helper ? html`<span class="help">${f.helper}</span>` : nothing}`;
    }
    const listId = `sm-ents-${++uid}`;
    const st = v ? this.hass?.states?.[v] : undefined;
    const options = Object.values(this.hass?.states ?? {})
      .filter((s) => !f.domains?.length || f.domains.includes(s.entity_id.split(".")[0]))
      .sort((a, b) => a.entity_id.localeCompare(b.entity_id));
    return html`<label class="field">${label}
      <input list=${listId} .value=${v ?? ""} placeholder="entity_id"
        @change=${(e: Event) => this._emit(f.key, (e.target as HTMLInputElement).value.trim() || null)} />
      <datalist id=${listId}>${options.map((s) => html`<option value=${s.entity_id}>${s.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${st ? html`<span class="ent-state">${st.attributes.friendly_name ?? ""}: ${st.state} ${st.attributes.unit_of_measurement ?? ""}</span>` : nothing}
      ${f.helper ? html`<span class="help">${f.helper}</span>` : nothing}
    </label>`;
  }

  private _field(f: FieldSpec) {
    const d = this.data;
    if (f.show && !f.show(d)) return nothing;
    const v = d[f.key];
    const label = this._label(f);
    switch (f.kind) {
      case "entity":
        return html`<div>${this._entity(f, v)}</div>`;
      case "bool":
        return html`<div class="bool"><span class="txt">${label}${f.helper ? html`<span class="help">${f.helper}</span>` : nothing}</span>
          <sm-toggle .checked=${!!v} @change=${(e: CustomEvent) => this._emit(f.key, e.detail.checked)}></sm-toggle></div>`;
      case "select":
        return html`<label class="field">${label}
          <select @change=${(e: Event) => {
            const raw = (e.target as HTMLSelectElement).value;
            this._emit(f.key, typeof v === "number" ? Number(raw) : raw);
          }}>${(f.options ?? []).map((o) => html`<option value=${o.value} ?selected=${String(v) === o.value}>${o.label}</option>`)}</select>
          ${f.helper ? html`<span class="help">${f.helper}</span>` : nothing}</label>`;
      case "number":
        return html`<label class="field">${label}
          <span class="wrap"><input type="number" step=${f.step ?? 1} .value=${v === null || v === undefined ? "" : String(v)}
            @change=${(e: Event) => {
              const raw = (e.target as HTMLInputElement).value;
              this._emit(f.key, raw === "" ? (f.nullable ? null : 0) : Number(raw));
            }} />${f.unit ? html`<span class="unit">${f.unit}</span>` : nothing}</span>
          ${f.helper ? html`<span class="help">${f.helper}</span>` : nothing}</label>`;
      case "time":
        return html`<label class="field">${label}
          <input type="time" .value=${v ?? ""} @change=${(e: Event) => this._emit(f.key, (e.target as HTMLInputElement).value)} /></label>`;
      default:
        return html`<label class="field">${label}
          <input type="text" .value=${v ?? ""} @change=${(e: Event) => this._emit(f.key, (e.target as HTMLInputElement).value)} />
          ${f.helper ? html`<span class="help">${f.helper}</span>` : nothing}</label>`;
    }
  }

  render() {
    return html`${this.fields.map((f) => this._field(f))}`;
  }
}
