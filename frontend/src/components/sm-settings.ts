import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { notifyTest, saveSettings } from "../api";
import { t } from "../i18n";
import { cardStyles, tokens } from "../styles/tokens";
import type { Hass, Settings } from "../types";
import type { FieldSpec } from "./shared/sm-form";
import "./shared/sm-form";
import "./shared/sm-list-row";
import "./sm-logs";

interface Category {
  id: string;
  group: string;
  icon: string;
  fields: FieldSpec[];
  summary: (s: Settings, hass: Hass, site: Record<string, any>) => string;
}

/** Groups of the settings list, in this order. */
const GROUPS = ["measure", "control", "info", "system"];

const kwh = (v: number | null | undefined) => (v == null ? "–" : `${v.toFixed(1)} kWh`);
const forecastOn = (d: Settings) => !!(d.forecast_ev_priority || d.forecast_ev_floor_pause);

const opt = (key: string, values: string[]) => values.map((v) => ({ value: v, label: t(`s.${key}.${v}`) }));
const ent = (hass: Hass, id?: string | null) => (id ? (hass.states[id]?.attributes.friendly_name ?? id) : t("detail.not_set"));

const notifyOptions = (hass: Hass) =>
  Object.keys(hass.services?.notify ?? {})
    .filter((s) => !["send_message", "persistent_notification"].includes(s))
    .sort((a, b) => Number(b.startsWith("mobile_app_")) - Number(a.startsWith("mobile_app_")) || a.localeCompare(b))
    .map((s) => ({
      value: `notify.${s}`,
      label: s.startsWith("mobile_app_") ? `📱 ${s.slice(11).replace(/_/g, " ")}` : s.replace(/_/g, " "),
    }));

const categories = (hass: Hass): Category[] => [
  // Meten
  {
    id: "meter", group: "measure", icon: "mdi:meter-electric-outline",
    fields: [
      { key: "grid_mode", kind: "select", options: opt("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (d) => d.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: opt("grid_sign", ["import_positive", "export_positive"]), show: (d) => d.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (d) => d.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (d) => d.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" },
    ],
    summary: (s, h) => ent(h, s.grid_mode === "split" ? s.grid_import_entity : s.grid_power_entity),
  },
  {
    id: "pv", group: "measure", icon: "mdi:solar-power-variant",
    fields: [{ key: "pv_power_entity", kind: "entity", domains: ["sensor"], helper: t("s.pv_power_entity.help") }],
    summary: (s, h) => ent(h, s.pv_power_entity),
  },
  // Slim sturen
  {
    id: "general", group: "control", icon: "mdi:power",
    fields: [{ key: "enabled", kind: "bool", helper: t("s.enabled.help") }],
    summary: (s) => (s.enabled ? t("s.enabled") : t("site.disabled")),
  },
  {
    id: "forecast", group: "control", icon: "mdi:weather-partly-cloudy",
    fields: [
      { key: "pv_forecast_remaining_entity", kind: "entity", domains: ["sensor"], helper: t("s.pv_forecast_remaining_entity.help") },
      { key: "pv_forecast_today_entity", kind: "entity", domains: ["sensor"], helper: t("s.pv_forecast_today_entity.help") },
      { key: "pv_forecast_tomorrow_entity", kind: "entity", domains: ["sensor"], helper: t("s.pv_forecast_tomorrow_entity.help") },
      { key: "forecast_ev_priority", kind: "bool", helper: t("s.forecast_ev_priority.help") },
      { key: "forecast_ev_floor_pause", kind: "bool", helper: t("s.forecast_ev_floor_pause.help") },
      { key: "forecast_ev_floor_kwh", kind: "number", unit: "kWh", step: 0.5, helper: t("s.forecast_ev_floor_kwh.help"), show: (d) => !!d.forecast_ev_floor_pause },
      { key: "forecast_factor_pct", kind: "number", unit: "%", step: 5, helper: t("s.forecast_factor_pct.help"), show: forecastOn },
      { key: "forecast_house_kwh", kind: "number", unit: "kWh", step: 0.5, helper: t("s.forecast_house_kwh.help"), show: forecastOn },
    ],
    summary: (s, h, site) => {
      const f = site?.forecast;
      if (f?.remaining_kwh != null) return t("s.forecast.summary").replace("{kwh}", kwh(f.remaining_kwh));
      if (s.pv_forecast_remaining_entity || s.pv_forecast_today_entity) return ent(h, s.pv_forecast_remaining_entity || s.pv_forecast_today_entity);
      return t("detail.not_set");
    },
  },
  {
    id: "planning", group: "control", icon: "mdi:calendar-clock",
    fields: [
      { key: "plan_enabled", kind: "bool", helper: t("s.plan_enabled.help") },
      { key: "plan_boiler_night", kind: "bool", helper: t("s.plan_boiler_night.help"), show: (d) => !!d.plan_enabled },
      { key: "plan_ev", kind: "bool", helper: t("s.plan_ev.help"), show: (d) => !!d.plan_enabled },
      { key: "plan_battery_night", kind: "bool", helper: t("s.plan_battery_night.help"), show: (d) => !!d.plan_enabled },
      { key: "plan_peak_spread", kind: "bool", helper: t("s.plan_peak_spread.help"), show: (d) => !!d.plan_enabled },
      { key: "plan_learn_base", kind: "bool", helper: t("s.plan_learn_base.help"), show: (d) => !!d.plan_enabled },
      { key: "plan_base_w", kind: "number", unit: "W", step: 50, show: (d) => !!d.plan_enabled && !d.plan_learn_base },
      { key: "plan_pv_estimate", kind: "select", options: opt("plan_pv_estimate", ["pv_estimate", "pv_estimate10"]), helper: t("s.plan_pv_estimate.help"), show: (d) => !!d.plan_enabled },
      { key: "forecast_factor_pct", kind: "number", unit: "%", step: 5, helper: t("s.forecast_factor_pct.help"), show: (d) => !!d.plan_enabled },
      { key: "plan_horizon_h", kind: "number", unit: "u", step: 6, helper: t("s.plan_horizon_h.help"), show: (d) => !!d.plan_enabled },
    ],
    summary: (s, _h, site) => {
      if (!s.plan_enabled) return t("detail.off");
      const n = Object.values(site?.plan?.loads ?? {}).filter((p: any) => p.grid_kwh > 0.01).length;
      return n ? t("s.planning.summary").replace("{n}", String(n)) : t("s.planning.on");
    },
  },
  {
    id: "peak", group: "control", icon: "mdi:chart-bell-curve-cumulative",
    fields: [
      { key: "peak_guard_enabled", kind: "bool", helper: t("s.peak.help") },
      { key: "peak_limit_w", kind: "number", unit: "W", step: 100, show: (d) => d.peak_guard_enabled },
      { key: "peak_margin_w", kind: "number", unit: "W", step: 50, show: (d) => d.peak_guard_enabled },
      { key: "peak_follow_month_max", kind: "bool", helper: t("s.peak_follow.help"), show: (d) => d.peak_guard_enabled },
    ],
    summary: (s) => (s.peak_guard_enabled ? `${(s.peak_limit_w / 1000).toFixed(1)} kW` : t("detail.off")),
  },
  {
    id: "night", group: "control", icon: "mdi:weather-night",
    fields: [
      { key: "night_start", kind: "time" },
      { key: "night_end", kind: "time" },
    ],
    summary: (s) => `${s.night_start} – ${s.night_end}`,
  },
  // Kosten en meldingen
  {
    id: "prices", group: "info", icon: "mdi:currency-eur",
    fields: [
      { key: "price_import", kind: "number", unit: "€/kWh", step: 0.01 },
      { key: "price_export", kind: "number", unit: "€/kWh", step: 0.01 },
    ],
    summary: (s) => `€ ${s.price_import} / € ${s.price_export}`,
  },
  {
    id: "notify", group: "info", icon: "mdi:bell-outline",
    fields: [
      { key: "notify_services", kind: "multi", options: notifyOptions(hass), helper: t("s.notify_services.help") },
      { key: "notify_peak", kind: "bool", helper: t("s.notify_peak.help") },
      { key: "notify_ev", kind: "bool", helper: t("s.notify_ev.help") },
      { key: "notify_faults", kind: "bool", helper: t("s.notify_faults.help") },
    ],
    summary: (s) => {
      const n = (s.notify_services ?? []).length;
      return n ? t("s.notify.summary").replace("{n}", String(n)) : t("detail.off");
    },
  },
  // Systeem
  {
    id: "debug", group: "system", icon: "mdi:bug-outline",
    fields: [],
    summary: () => `${t("s.cat.debug.summary")} · ${t("s.version").replace("{v}", __PANEL_VERSION__)}`,
  },
];

/** Settings as categories (list) with the chosen category's form next to it. Saves on change. */
@customElement("sm-settings")
export class SmSettings extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) settings!: Settings;
  @property({ attribute: false }) site: Record<string, any> = {};
  @property({ type: Boolean }) narrow = false;
  @state() private _cat: string | null = null;
  @state() private _draft: Settings = {};
  @state() private _testMsg = "";

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: block; }
      .md { display: grid; grid-template-columns: minmax(0, 360px) minmax(0, 1fr); gap: 16px; align-items: start; }
      .md.single { grid-template-columns: 1fr; max-width: 720px; }
      .nav { padding: 4px 0 8px; }
      .group { padding: 16px 16px 4px; font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary-text-color); }
      .group + sm-list-row { margin-top: 0; }
      .nav hr { border: none; border-top: 1px solid var(--sm-border); margin: 8px 0 0; }
      .plan { margin: 0 0 16px; padding: 12px 14px; border-radius: var(--sm-radius); background: var(--sm-fill); font-size: 14px; line-height: 1.55; }
      .plan b { font-weight: 500; }
      .plan .on { color: var(--sm-solar); }
      sm-list-row.sel { background: var(--sm-fill-primary); }
      .detail .card-body { padding-top: 4px; }
      .back { display: flex; align-items: center; gap: 4px; }
      .test { display: flex; align-items: center; gap: 12px; margin-top: 16px; font-size: 13px; color: var(--secondary-text-color); }
      .desc { font-size: 14px; color: var(--secondary-text-color); margin: 0 0 16px; line-height: 1.5; }
    `,
  ];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("settings")) this._draft = { ...this.settings };
    if (this._cat === null && !this.narrow) this._cat = "meter";
  }

  private async _change(key: string, value: any) {
    this._draft = { ...this._draft, [key]: value };
    this.dispatchEvent(new CustomEvent("saving", { bubbles: true, composed: true }));
    try {
      await saveSettings(this.hass, { [key]: value });
      this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: true, composed: true }));
    } catch (err: any) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: err?.message ?? String(err) }, bubbles: true, composed: true }));
    }
  }

  private async _test() {
    this._testMsg = "";
    try {
      await notifyTest(this.hass);
      this._testMsg = t("s.notify.test_sent");
    } catch (err: any) {
      this._testMsg = err?.message ?? String(err);
    }
  }

  /** What the forecast planning decides right now. */
  private _plan() {
    const f = this.site?.forecast;
    if (!f || f.remaining_kwh == null) return html`<div class="plan">${t("s.plan.none")}</div>`;
    const yes = (on: boolean) => html`<b class=${on ? "on" : ""}>${on ? t("s.plan.yes") : t("s.plan.no")}</b>`;
    return html`<div class="plan">
      ${t("s.plan.remaining")} <b>${kwh(f.remaining_kwh)}</b>, ${t("s.plan.usable")} <b>${kwh(f.usable_kwh)}</b><br />
      ${t("s.plan.boilers")} <b>${kwh(f.boiler_need_kwh)}</b><br />
      ${this._draft.forecast_ev_priority ? html`${t("s.plan.ev_first")} ${yes(f.ev_first)}<br />` : ""}
      ${this._draft.forecast_ev_floor_pause ? html`${t("s.plan.floor_paused")} ${yes(f.ev_floor_paused)}` : ""}
    </div>`;
  }

  render() {
    const cats = categories(this.hass);
    const cat = cats.find((c) => c.id === this._cat);
    const showNav = !this.narrow || !cat;
    const showDetail = !!cat;
    return html`<div class="md ${this.narrow ? "single" : ""}">
      ${showNav
        ? html`<div class="card nav">
            ${GROUPS.map(
              (g, i) => html`${i ? html`<hr />` : ""}<div class="group">${t(`s.group.${g}`)}</div>
                ${cats.filter((c) => c.group === g).map(
                  (c) => html`<sm-list-row class=${c.id === this._cat && !this.narrow ? "sel" : ""} .icon=${c.icon} .heading=${t(`s.cat.${c.id}`)}
                    .secondary=${c.summary(this._draft, this.hass, this.site ?? {})} clickable @row-click=${() => (this._cat = c.id)}></sm-list-row>`,
                )}`,
            )}
          </div>`
        : ""}
      ${showDetail
        ? html`<div class="card detail">
            <div class="card-head">
              ${this.narrow ? html`<button class="icon" @click=${() => (this._cat = null)}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
              <h2>${t(`s.cat.${cat!.id}`)}</h2>
            </div>
            <div class="card-body">
              <p class="desc">${t(`s.cat.${cat!.id}.desc`)}</p>
              ${cat!.id === "forecast" ? this._plan() : ""}
              ${cat!.id === "debug"
                ? html`<sm-logs .hass=${this.hass}></sm-logs>`
                : html`<sm-form .hass=${this.hass} prefix="s" .fields=${cat!.fields} .data=${this._draft}
                    @value-changed=${(e: CustomEvent) => this._change(e.detail.key, e.detail.value)}></sm-form>`}
              ${cat!.id === "notify"
                ? html`<div class="test"><button class="text" ?disabled=${!(this._draft.notify_services ?? []).length}
                    @click=${this._test}>${t("s.notify.test")}</button><span>${this._testMsg}</span></div>`
                : ""}
            </div>
          </div>`
        : ""}
    </div>`;
  }
}
