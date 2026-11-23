import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { tokens } from "../../styles/tokens";

/**
 * List row: round icon, title + subtitle, value on the right and a chevron (clickable),
 * or a slot for a control (toggle). Fires `row-click` when `clickable`.
 */
@customElement("sm-list-row")
export class SmListRow extends LitElement {
  @property() icon = "";
  @property() heading = "";
  @property() secondary = "";
  @property() value = "";
  @property({ type: Boolean }) clickable = false;
  @property({ reflect: true }) variant: "" | "primary" | "danger" | "warn" | "solar" = "";

  static styles = [
    tokens,
    css`
      :host { display: block; --row-icon: var(--secondary-text-color); }
      :host([variant="primary"]) { --row-icon: var(--primary-color); }
      :host([variant="danger"]) { --row-icon: var(--sm-err); }
      :host([variant="warn"]) { --row-icon: var(--sm-warn); }
      :host([variant="solar"]) { --row-icon: var(--sm-solar); }
      .row { display: flex; align-items: center; gap: 16px; min-height: 56px; padding: 0 16px; box-sizing: border-box; }
      .row.click { cursor: pointer; }
      .row.click:hover { background: var(--sm-fill); }
      .ic {
        width: 40px; height: 40px; border-radius: 50%; flex: none; display: grid; place-items: center;
        background: var(--sm-fill); color: var(--row-icon); --mdc-icon-size: 22px;
      }
      :host([variant="primary"]) .ic { background: var(--sm-fill-primary); }
      .text { flex: 1; min-width: 0; padding: 8px 0; }
      .h { font-size: 15px; line-height: 1.3; }
      :host([variant="primary"]) .h { color: var(--primary-color); font-weight: 500; }
      :host([variant="danger"]) .h { color: var(--sm-err-text); }
      .s { font-size: 13px; color: var(--secondary-text-color); line-height: 1.35; margin-top: 1px; }
      .v { font-size: 14px; color: var(--secondary-text-color); text-align: end; white-space: nowrap; font-variant-numeric: tabular-nums; }
      .chev { color: var(--secondary-text-color); --mdc-icon-size: 20px; flex: none; }
    `,
  ];

  render() {
    return html`<div class="row ${this.clickable ? "click" : ""}" @click=${this._click}>
      ${this.icon ? html`<div class="ic"><ha-icon .icon=${this.icon}></ha-icon></div>` : nothing}
      <div class="text">
        <div class="h">${this.heading}</div>
        ${this.secondary ? html`<div class="s">${this.secondary}</div>` : nothing}
      </div>
      ${this.value ? html`<div class="v">${this.value}</div>` : nothing}
      <slot></slot>
      ${this.clickable ? html`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : nothing}
    </div>`;
  }

  private _click() {
    if (this.clickable) this.dispatchEvent(new CustomEvent("row-click", { bubbles: true, composed: true }));
  }
}
