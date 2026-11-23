import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { tokens } from "../../styles/tokens";

export interface SegOption {
  value: string;
  label: string;
  icon?: string;
}

/** Segmented choice. Fires `value-changed` with `{ value }`. */
@customElement("sm-segmented")
export class SmSegmented extends LitElement {
  @property({ attribute: false }) options: SegOption[] = [];
  @property({ attribute: false }) value: string | null = null;
  @property({ reflect: true }) size: "sm" | "md" = "md";
  @property({ type: Boolean, reflect: true }) wrap = false;

  static styles = [
    tokens,
    css`
      :host { display: block; min-width: 0; }
      .seg { display: flex; gap: 3px; padding: 3px; border-radius: 10px; background: var(--sm-fill); }
      :host([wrap]) .seg { flex-wrap: wrap; }
      :host([wrap]) button { flex: 1 0 auto; }
      button {
        flex: 1 1 auto; min-width: 0; height: 34px; padding: 0 6px; border: 1px solid transparent; border-radius: 8px;
        background: none; color: var(--secondary-text-color); font: inherit; font-size: 13px; font-weight: 500;
        display: flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; white-space: nowrap;
        --mdc-icon-size: 16px; transition: background-color 0.15s ease, color 0.15s ease;
      }
      :host([size="sm"]) button { height: 28px; padding: 0 10px; font-size: 12px; }
      button span { overflow: hidden; text-overflow: ellipsis; }
      button:hover:not([aria-checked="true"]) { color: var(--primary-text-color); background: var(--sm-fill); }
      button[aria-checked="true"] {
        background: color-mix(in srgb, var(--primary-color) 16%, var(--sm-surface));
        border-color: color-mix(in srgb, var(--primary-color) 45%, transparent);
        color: var(--primary-text-color);
      }
      button[aria-checked="true"] ha-icon { color: var(--primary-color); }
    `,
  ];

  render() {
    return html`<div class="seg" role="radiogroup">
      ${this.options.map(
        (o) => html`<button role="radio" aria-checked=${o.value === this.value ? "true" : "false"} title=${o.label}
          @click=${(e: Event) => { e.stopPropagation(); this._pick(o); }}>
          ${o.icon ? html`<ha-icon .icon=${o.icon}></ha-icon>` : nothing}<span>${o.label}</span>
        </button>`,
      )}
    </div>`;
  }

  private _pick(o: SegOption) {
    if (o.value === this.value) return;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: o.value }, bubbles: true, composed: true }));
  }
}
