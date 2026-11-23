import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles, tokens } from "../../styles/tokens";
import { t } from "../../i18n";

/** Modal dialog. Fires `closed` on cancel and `save` on the primary button. */
@customElement("sm-dialog")
export class SmDialog extends LitElement {
  @property() heading = "";
  @property() saveLabel = "";
  @property({ type: Boolean }) busy = false;
  @property({ type: Boolean }) canSave = true;
  @property() error = "";

  static styles = [
    tokens,
    cardStyles,
    css`
      .scrim {
        position: fixed; inset: 0; background: rgb(0 0 0 / 45%); z-index: 10;
        display: grid; place-items: center; padding: 16px;
      }
      .dlg {
        background: var(--sm-surface); border-radius: 24px; box-shadow: var(--sm-shadow-pop);
        width: min(560px, 100%); max-height: calc(100vh - 32px); display: flex; flex-direction: column;
      }
      h2 { margin: 0; padding: 24px 24px 8px; font-size: 22px; font-weight: 400; }
      .body { padding: 8px 24px; overflow: auto; }
      .actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px 20px; }
      .err {
        margin: 8px 0 0; padding: 8px 12px; border-radius: var(--sm-radius-sm);
        background: color-mix(in srgb, var(--sm-err) 12%, transparent); color: var(--sm-err-text); font-size: 14px;
      }
    `,
  ];

  render() {
    return html`<div class="scrim" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
      <div class="dlg" role="dialog" aria-modal="true" aria-label=${this.heading}>
        <h2>${this.heading}</h2>
        <div class="body"><slot></slot>${this.error ? html`<div class="err" role="alert">${this.error}</div>` : nothing}</div>
        <div class="actions">
          <button class="text" @click=${this._close}>${t("load.cancel")}</button>
          <button class="filled" ?disabled=${this.busy || !this.canSave}
            @click=${() => this.dispatchEvent(new CustomEvent("save"))}>${this.saveLabel || t("load.save")}</button>
        </div>
      </div>
    </div>`;
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("closed"));
  }
}
