import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getAnalytics, getConfig, reorderLoads, saveLoad, setEvMinPower, setMode, subscribeLive } from "./api";
import { setLanguage, t } from "./i18n";
import { cardStyles, tokens } from "./styles/tokens";
import type { ConfigPayload, Hass, Live, Mode } from "./types";
import type { FieldSpec } from "./components/shared/sm-form";
import { defaultIcon, modeKey, modesFor } from "./components/common";
import "./components/sm-dashboard";
import "./components/sm-load-detail";
import "./components/sm-settings";
import "./components/sm-analytics";
import "./components/shared/sm-dialog";
import "./components/shared/sm-form";

type Tab = "loads" | "analytics" | "settings";
type SaveState = "" | "saving" | "saved" | "error";

const SPARK_WINDOW_S = 6 * 3600;

@customElement("solarmind-panel")
export class SolarMindPanel extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ type: Boolean }) narrow = false;
  @state() private _config?: ConfigPayload;
  @state() private _live?: Live;
  @state() private _tab: Tab = "loads";
  @state() private _detail: string | null = null;
  @state() private _editing = false;
  @state() private _analyticsLoad: string | null = null;
  @state() private _spark: Record<string, [number, number, number][]> = {};
  @state() private _adding: Record<string, any> | null = null;
  @state() private _addBusy = false;
  @state() private _addError = "";
  @state() private _save: SaveState = "";
  @state() private _error = "";
  private _unsub?: () => void;
  private _started = false;
  private _sparkTimer?: number;
  private _saveTimer?: number;

  static styles = [
    tokens,
    cardStyles,
    css`
      :host {
        display: block; min-height: 100vh; background: var(--primary-background-color); color: var(--primary-text-color);
        font-family: var(--primary-font-family, Roboto, sans-serif); -webkit-font-smoothing: antialiased;
      }
      .toolbar {
        display: flex; align-items: center; height: 56px; padding: 0 12px; font-size: 20px; box-sizing: border-box;
        background-color: var(--app-header-background-color, var(--primary-background-color));
        color: var(--app-header-text-color, var(--primary-text-color));
        border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; z-index: 4;
      }
      .toolbar .title { margin-left: 4px; font-weight: 400; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .toolbar .title.pad { margin-left: 12px; }
      .save { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; margin-right: 8px; --mdc-icon-size: 18px; }
      .save.saving { color: var(--primary-color); }
      .save.saved { color: var(--sm-ok-text); }
      .save.error { color: var(--sm-err-text); }
      .tabs {
        display: flex; border-bottom: 1px solid var(--divider-color); padding: 0 16px; background: var(--primary-background-color);
        position: sticky; top: 56px; z-index: 3; overflow-x: auto; scrollbar-width: none;
      }
      .tab {
        padding: 12px 24px; cursor: pointer; border: none; background: none; color: var(--secondary-text-color); font: inherit;
        font-size: 14px; font-weight: 500; border-bottom: 2px solid transparent; white-space: nowrap;
      }
      .tab:hover { color: var(--primary-text-color); }
      .tab.on { color: var(--primary-color); border-bottom-color: var(--primary-color); }
      main { padding: 24px; max-width: 1400px; margin: 0 auto; box-sizing: border-box; }
      @media (max-width: 600px) { main { padding: 12px; } .tab { padding: 12px 16px; } }
      .err { padding: 24px; color: var(--sm-err-text); }
    `,
  ];

  updated(changed: Map<string, unknown>) {
    if (changed.has("hass") && this.hass && !this._started) this._init();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hass && !this._started) this._init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
    window.clearInterval(this._sparkTimer);
    this._started = false;
  }

  private async _init() {
    this._started = true;
    setLanguage(this.hass.language);
    try {
      await this._reload();
      this._unsub = await subscribeLive(this.hass, (live) => (this._live = live));
      this._loadSpark();
      this._sparkTimer = window.setInterval(() => this._loadSpark(), 60_000);
    } catch (err: any) {
      this._error = err?.message ?? String(err);
      this._started = false;
    }
  }

  private async _reload() {
    this._config = await getConfig(this.hass);
    this._live = this._config.live;
  }

  private async _loadSpark() {
    const end = Date.now() / 1000;
    try {
      const data = await getAnalytics(this.hass, end - SPARK_WINDOW_S, end, null);
      const out: Record<string, [number, number, number][]> = {};
      for (const row of data.timeline.rows) {
        for (const [lid, v] of Object.entries(row[3] as Record<string, any[]>)) {
          // Batteries: show charging and discharging alike (absolute power).
          (out[lid] ??= []).push([row[0], Math.abs(v[0] ?? 0), v[1] ?? 0]);
        }
      }
      this._spark = out;
    } catch {
      /* integration reloading */
    }
  }

  private async _resubscribe() {
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

  private _flashSave(state: SaveState) {
    this._save = state;
    window.clearTimeout(this._saveTimer);
    if (state === "saved") this._saveTimer = window.setTimeout(() => (this._save = ""), 2500);
  }

  private _setOrder(order: string[]) {
    const c = this._config!;
    const byId = new Map(c.loads.map((l) => [l.id, l]));
    this._config = { ...c, loads: order.map((id) => byId.get(id)!).filter(Boolean) };
  }

  private async _setMode(id: string, mode: Mode) {
    const c = this._config!;
    this._config = { ...c, loads: c.loads.map((l) => (l.id === id ? { ...l, mode } : l)) };
    this._flashSave("saving");
    await setMode(this.hass, id, mode);
    this._flashSave("saved");
  }

  private async _setMinPower(id: string, power_w: number | null) {
    const c = this._config!;
    this._config = { ...c, loads: c.loads.map((l) => (l.id === id ? { ...l, ev_min_power_w: power_w } : l)) };
    this._flashSave("saving");
    await setEvMinPower(this.hass, id, power_w);
    this._flashSave("saved");
  }

  private async _moveLoad(id: string, delta: number) {
    const order = this._config!.loads.map((l) => l.id);
    const i = order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this._setOrder(order);
    await reorderLoads(this.hass, order);
  }

  private _addFields(): FieldSpec[] {
    const isEv = (d: Record<string, any>) => d.type === "ev";
    const isBat = (d: Record<string, any>) => d.type === "battery";
    const isSwitch = (d: Record<string, any>) => !isEv(d) && !isBat(d);
    const tesla = (d: Record<string, any>) => isEv(d) && d.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev", "battery"].map((v) => ({ value: v, label: t(`type.${v}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: isSwitch },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: isSwitch },
      { key: "bat_soc_entity", kind: "entity", domains: ["sensor"], show: isBat },
      { key: "bat_power_entity", kind: "entity", domains: ["sensor"], show: isBat, helper: t("f.bat_power_entity.help") },
      { key: "bat_power_sign", kind: "select", show: isBat, options: ["charge_positive", "discharge_positive"].map((v) => ({ value: v, label: t(`f.bat_sign.${v}`) })) },
      { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], show: isBat, helper: t("f.bat_setpoint_entity.help") },
      { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1, show: isBat },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((v) => ({ value: v, label: t(`f.ev_driver.${v}`) })), show: isEv },
      { key: "ev_proxy_url", kind: "text", show: tesla, helper: t("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: tesla },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (d) => isEv(d) && !tesla(d) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (d) => isEv(d) && !tesla(d) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: t("f.power_entity.help"), show: (d) => !isBat(d) },
      { key: "mode", kind: "select", options: modesFor(this._adding?.type).map((v) => ({ value: v, label: t(modeKey(v, this._adding?.type)) })) },
    ];
  }

  private _startAdd() {
    this._addError = "";
    this._adding = { ...this._config!.defaults.load, id: "", name: "", ev_driver: "tesla_ble_proxy" };
  }

  private async _saveAdd() {
    const d = { ...this._adding! };
    if (d.type !== "switch" && (!d.icon || d.icon === "mdi:water-boiler")) d.icon = defaultIcon(d.type);
    if (!modesFor(d.type).includes(d.mode)) d.mode = d.type === "battery" ? "self" : "solar";
    this._addBusy = true;
    try {
      const res = await saveLoad(this.hass, d);
      this._adding = null;
      await this._resubscribe();
      this._detail = res.load.id;
    } catch (err: any) {
      this._addError = err?.message ?? String(err);
    } finally {
      this._addBusy = false;
    }
  }

  private _menuButton() {
    return this.narrow && customElements.get("ha-menu-button")
      ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`
      : nothing;
  }

  private _saveIndicator() {
    if (!this._save) return nothing;
    const icon = this._save === "saving" ? "mdi:cloud-upload-outline" : this._save === "saved" ? "mdi:check-circle-outline" : "mdi:alert-circle-outline";
    return html`<span class="save ${this._save}"><ha-icon .icon=${icon}></ha-icon>${t(`save.${this._save}`)}</span>`;
  }

  private _toolbar() {
    const c = this._config;
    const load = this._detail ? c?.loads.find((l) => l.id === this._detail) : undefined;
    if (load) {
      return html`<div class="toolbar">
        <button class="icon" @click=${() => (this._detail = null)} title=${t("nav.back")}><ha-icon icon="mdi:arrow-left"></ha-icon></button>
        <span class="title pad">${load.name}</span>
        ${this._saveIndicator()}
        <button class="icon" title=${t("load.analytics")} @click=${() => { this._analyticsLoad = load.id; this._detail = null; this._tab = "analytics"; }}>
          <ha-icon icon="mdi:chart-line"></ha-icon></button>
      </div>`;
    }
    return html`<div class="toolbar">
        ${this._menuButton()}
        <span class="title ${this.narrow ? "" : "pad"}">SolarMind</span>
        ${this._saveIndicator()}
        ${this._tab === "loads" && c?.loads.length
          ? html`<button class="icon" title=${this._editing ? t("nav.done") : t("nav.reorder")} @click=${() => (this._editing = !this._editing)}>
              <ha-icon .icon=${this._editing ? "mdi:check" : "mdi:pencil"}></ha-icon></button>`
          : nothing}
      </div>
      <nav class="tabs">
        ${(["loads", "analytics", "settings"] as Tab[]).map(
          (tab) => html`<button class="tab ${this._tab === tab ? "on" : ""}" @click=${() => { this._tab = tab; this._editing = false; }}>${t(`tab.${tab}`)}</button>`,
        )}
      </nav>`;
  }

  private _content(c: ConfigPayload) {
    const idx = this._detail ? c.loads.findIndex((l) => l.id === this._detail) : -1;
    if (idx >= 0) {
      const load = { ...c.defaults.load, ...c.loads[idx] };
      return html`<sm-load-detail .hass=${this.hass} .load=${load} .live=${this._live?.loads?.[load.id]} .spark=${this._spark[load.id] ?? []}
        .priority=${idx + 1} .count=${c.loads.length}
        @set-mode=${(e: CustomEvent) => this._setMode(e.detail.id, e.detail.mode)}
        @set-min-power=${(e: CustomEvent) => this._setMinPower(e.detail.id, e.detail.power_w)}
        @move-load=${(e: CustomEvent) => this._moveLoad(e.detail.id, e.detail.delta)}
        @open-analytics=${(e: CustomEvent) => { this._analyticsLoad = e.detail.id; this._detail = null; this._tab = "analytics"; }}
        @load-saved=${async (e: CustomEvent) => {
          this._flashSave("saved");
          if (e.detail.renamed) await this._resubscribe();
          else await this._reload();
        }}
        @load-deleted=${async () => { this._detail = null; await this._resubscribe(); }}></sm-load-detail>`;
    }
    switch (this._tab) {
      case "analytics":
        return html`<sm-analytics .hass=${this.hass} .loads=${c.loads} .loadId=${this._analyticsLoad} .peakLimit=${this._live?.site?.peak_limit_w ?? null}
          @analytics-load=${(e: CustomEvent) => (this._analyticsLoad = e.detail.id)}></sm-analytics>`;
      case "settings":
        return html`<sm-settings .hass=${this.hass} .settings=${c.settings} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(e: CustomEvent) => { this._config = { ...c, settings: { ...c.settings, ...e.detail.settings } }; this._flashSave("saved"); }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return html`<sm-dashboard .hass=${this.hass} .loads=${c.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(e: CustomEvent) => (this._detail = e.detail.id)}
          @set-mode=${(e: CustomEvent) => this._setMode(e.detail.id, e.detail.mode)}
        @set-min-power=${(e: CustomEvent) => this._setMinPower(e.detail.id, e.detail.power_w)}
          @loads-reordered=${(e: CustomEvent) => this._setOrder(e.detail.order)}
          @add-load=${this._startAdd}></sm-dashboard>`;
    }
  }

  render() {
    if (this._error) return html`<div class="err">${this._error}</div>`;
    const c = this._config;
    return html`
      ${this._toolbar()}
      <main>${c ? this._content(c) : nothing}</main>
      ${this._adding
        ? html`<sm-dialog .heading=${t("loads.add")} .saveLabel=${t("load.add_save")} .busy=${this._addBusy} .error=${this._addError}
            .canSave=${!!this._adding.name} @closed=${() => (this._adding = null)} @save=${this._saveAdd}>
            <sm-form .hass=${this.hass} .fields=${this._addFields()} .data=${this._adding}
              @value-changed=${(e: CustomEvent) => (this._adding = { ...this._adding, [e.detail.key]: e.detail.value })}></sm-form>
          </sm-dialog>`
        : nothing}
    `;
  }
}
