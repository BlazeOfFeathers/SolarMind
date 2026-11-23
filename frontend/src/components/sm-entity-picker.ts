import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Hass } from "../types";

let counter = 0;

/** Simple entity picker: text input with suggestions from hass.states, filtered by domain. */
@customElement("sm-entity-picker")
export class SmEntityPicker extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property() label = "";
  @property() value: string | null = null;
  @property({ attribute: false }) domains: string[] = [];
  @property({ attribute: false }) deviceClasses: string[] = [];
  private _listId = `sm-ents-${++counter}`;

  static styles = css`
    label { display: flex; flex-direction: column; gap: 4px; font-size: 0.9em; }
    input {
      font: inherit; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc);
      background: var(--input-fill-color, var(--secondary-background-color, transparent)); color: inherit;
    }
    .state { font-size: 0.8em; color: var(--secondary-text-color); min-height: 1em; }
  `;

  private _options() {
    return Object.values(this.hass?.states ?? {})
      .filter((s) => !this.domains.length || this.domains.includes(s.entity_id.split(".")[0]))
      .filter((s) => !this.deviceClasses.length || this.deviceClasses.includes(s.attributes.device_class) ||
        this.deviceClasses.includes(String(s.attributes.unit_of_measurement ?? "").toLowerCase()))
      .sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  }

  private _changed(ev: Event) {
    const v = (ev.target as HTMLInputElement).value.trim();
    this.value = v || null;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: this.value } }));
  }

  render() {
    const st = this.value ? this.hass?.states[this.value] : undefined;
    return html`<label>
      ${this.label}
      <input list=${this._listId} .value=${this.value ?? ""} @change=${this._changed} placeholder="entity_id" />
      <datalist id=${this._listId}>
        ${this._options().map(
          (s) => html`<option value=${s.entity_id}>${s.attributes.friendly_name ?? ""}</option>`,
        )}
      </datalist>
      <span class="state">${st ? `${st.attributes.friendly_name ?? ""}: ${st.state} ${st.attributes.unit_of_measurement ?? ""}` : this.value ? "?" : ""}</span>
    </label>`;
  }
}
