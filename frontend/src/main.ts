import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getConfig, subscribeLive } from "./api";
import { setLanguage, t } from "./i18n";
import { shared } from "./styles";
import type { ConfigPayload, Hass, Live, Load } from "./types";
import "./components/sm-overview";
import "./components/sm-load-editor";
import "./components/sm-settings";
import "./components/sm-analytics";

type Tab = "overview" | "analytics" | "settings";

@customElement("solarmind-panel")
export class SolarMindPanel extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ type: Boolean }) narrow = false;
  @state() private _config?: ConfigPayload;
  @state() private _live?: Live;
  @state() private _tab: Tab = "overview";
  @state() private _editing: Load | null = null;
  @state() private _analyticsLoad: string | null = null;
  @state() private _error = "";
  private _unsub?: () => void;
  private _subscribing = false;

  static styles = [
    shared,
    css`
      :host { display: block; background: var(--primary-background-color); min-height: 100vh; }
      header {
        display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px;
        background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, #fff);
        position: sticky; top: 0; z-index: 3;
      }
      header .title { font-size: 1.25rem; flex: 1; }
      nav { display: flex; gap: 4px; }
      nav button { color: inherit; border: 0; border-radius: 0; border-bottom: 2px solid transparent; padding: 16px 10px; }
      nav button.on { border-bottom-color: currentColor; }
      main { max-width: 1100px; margin: 0 auto; padding: 16px; }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    if (this.hass) this._init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
    this._subscribing = false;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("hass") && this.hass && !this._config && !this._subscribing) this._init();
  }

  private async _init() {
    if (this._subscribing) return;
    this._subscribing = true;
    setLanguage(this.hass.language);
    try {
      await this._reload();
      this._unsub = await subscribeLive(this.hass, (live) => (this._live = live));
    } catch (err: any) {
      this._error = err?.message ?? String(err);
      this._subscribing = false;
    }
  }

  private async _reload() {
    this._config = await getConfig(this.hass);
    this._live = this._config.live;
  }

  private async _resubscribe() {
    // The integration reloads after adding/removing a load: wait for it, then subscribe again.
    this._unsub?.();
    this._unsub = undefined;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      try {
        await this._reload();
        this._unsub = await subscribeLive(this.hass, (live) => (this._live = live));
        return;
      } catch {
        /* still reloading */
      }
    }
  }

  private _editLoad(id: string | null) {
    const c = this._config!;
    this._editing = id ? { ...c.defaults.load, ...c.loads.find((l) => l.id === id)! } : ({ ...c.defaults.load, id: "", name: "" } as Load);
  }

  private _onReorder(order: string[]) {
    const c = this._config!;
    const byId = new Map(c.loads.map((l) => [l.id, l]));
    this._config = { ...c, loads: order.map((id) => byId.get(id)!).filter(Boolean) };
  }

  private _onMode(id: string, mode: any) {
    const c = this._config!;
    this._config = { ...c, loads: c.loads.map((l) => (l.id === id ? { ...l, mode } : l)) };
  }

  render() {
    if (this._error) return html`<main><div class="banner">${this._error}</div></main>`;
    const c = this._config;
    return html`
      <header>
        <span class="title">☀️ SolarMind</span>
        <nav>
          ${(["overview", "analytics", "settings"] as Tab[]).map(
            (tab) => html`<button class=${this._tab === tab ? "on" : ""} @click=${() => { this._tab = tab; this._editing = null; }}>${t(`tab.${tab}`)}</button>`,
          )}
        </nav>
      </header>
      <main>
        ${!c ? html`<p>…</p>` : this._renderTab(c)}
      </main>
    `;
  }

  private _renderTab(c: ConfigPayload) {
    if (this._editing) {
      return html`<sm-load-editor .hass=${this.hass} .load=${this._editing}
        @close-editor=${() => (this._editing = null)}
        @load-saved=${async (e: CustomEvent) => {
          const isNew = !this._editing?.id;
          const renamed = this._editing?.name !== e.detail.load.name;
          this._editing = null;
          if (isNew || renamed) await this._resubscribe();
          else await this._reload();
        }}
        @load-deleted=${async () => { this._editing = null; await this._resubscribe(); }}
      ></sm-load-editor>`;
    }
    switch (this._tab) {
      case "analytics":
        return html`<sm-analytics .hass=${this.hass} .loads=${c.loads} .loadId=${this._analyticsLoad}
          .peakLimit=${this._live?.site?.peak_limit_w ?? null}
          @analytics-load=${(e: CustomEvent) => (this._analyticsLoad = e.detail.id)}></sm-analytics>`;
      case "settings":
        return html`<sm-settings .hass=${this.hass} .settings=${c.settings}
          @settings-saved=${() => this._reload()}></sm-settings>`;
      default:
        return html`<sm-overview .hass=${this.hass} .loads=${c.loads} .live=${this._live}
          @edit-load=${(e: CustomEvent) => this._editLoad(e.detail.id)}
          @open-analytics=${(e: CustomEvent) => { this._analyticsLoad = e.detail.id; this._tab = "analytics"; }}
          @loads-reordered=${(e: CustomEvent) => this._onReorder(e.detail.order)}
          @load-mode=${(e: CustomEvent) => this._onMode(e.detail.id, e.detail.mode)}
        ></sm-overview>
        ${nothing}`;
    }
  }
}
