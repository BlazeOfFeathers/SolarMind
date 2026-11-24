import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { deleteLoad, saveLoad } from "../api";
import { t } from "../i18n";
import { cardStyles, fmtKwh, fmtSec, fmtW, splitW, tokens } from "../styles/tokens";
import type { Hass, LiveLoad, Load } from "../types";
import { defaultIcon, isBattery, modeKey, modeOptions, reasonTone } from "./common";
import type { FieldSpec } from "./shared/sm-form";
import "./shared/sm-dialog";
import "./shared/sm-form";
import "./shared/sm-list-row";
import "./shared/sm-segmented";
import "./shared/sm-sparkline";
import "./shared/sm-toggle";

const isEv = (l: Record<string, any>) => l.type === "ev";
const isTesla = (l: Record<string, any>) => isEv(l) && l.ev_driver === "tesla_ble_proxy";
const isBat = (l: Record<string, any>) => isBattery(l);
const notBat = (l: Record<string, any>) => !isBattery(l);
const isSwitch = (l: Record<string, any>) => !isEv(l) && !isBat(l);
const signOpts = () => ["charge_positive", "discharge_positive"].map((v) => ({ value: v, label: t(`f.bat_sign.${v}`) }));
const pct = (v: number | null | undefined) => (v == null ? "–" : `${v}%`);

interface RowSpec {
  icon: string;
  title: string;
  secondary?: (l: Load, lv?: LiveLoad) => string;
  value?: (l: Load, lv?: LiveLoad) => string;
  fields?: FieldSpec[];
  toggle?: string;
  show?: (l: Load) => boolean;
}

interface SectionSpec {
  title: string;
  meta?: (l: Load) => string;
  show?: (l: Load) => boolean;
  rows: RowSpec[];
}

const sec = (v: number | null | undefined) => fmtSec(v ?? 0);

const entityName = (hass: Hass, id: string | null | undefined) => {
  if (!id) return t("detail.not_set");
  const st = hass.states[id];
  return st ? `${st.attributes.friendly_name ?? id}` : id;
};

const onOff = (hass: Hass, id: string | null | undefined) => {
  const st = id ? hass.states[id] : undefined;
  if (!st) return "";
  return st.state === "on" ? t("detail.on") : st.state === "off" ? t("detail.off") : st.state;
};

const entityValue = (hass: Hass, id: string | null | undefined) => {
  if (!id) return "";
  const st = hass.states[id];
  return st ? `${st.state}${st.attributes.unit_of_measurement ? " " + st.attributes.unit_of_measurement : ""}` : "?";
};

@customElement("sm-load-detail")
export class SmLoadDetail extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) load!: Load;
  @property({ attribute: false }) live?: LiveLoad;
  @property({ attribute: false }) spark: [number, number, number][] = [];
  @property({ type: Number }) priority = 1;
  @property({ type: Number }) count = 1;
  @state() private _dialog: { title: string; fields: FieldSpec[] } | null = null;
  @state() private _draft: Record<string, any> = {};
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _confirmDelete = false;

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: block; }
      .layout { display: grid; grid-template-columns: minmax(0, 420px) minmax(0, 1fr); gap: 16px; align-items: start; }
      @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
      .col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
      .hero { overflow: hidden; }
      .hero-head { display: flex; align-items: center; gap: 12px; padding: 20px 20px 0; }
      .hero-ic { width: 40px; height: 40px; border-radius: 50%; background: var(--sm-fill); display: grid; place-items: center; --mdc-icon-size: 22px; color: var(--secondary-text-color); }
      .hero-ic.active { color: var(--sm-solar); }
      .hero-name { font-size: 17px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
      .hero-name button.icon { width: 32px; height: 32px; --mdc-icon-size: 18px; color: var(--secondary-text-color); }
      .hero-sub { font-size: 13px; color: var(--secondary-text-color); }
      .big { display: flex; align-items: flex-start; gap: 6px; padding: 8px 20px 0; }
      .big .v { font-size: 64px; font-weight: 300; line-height: 1.05; letter-spacing: -1.5px; font-variant-numeric: tabular-nums; }
      .big .dir { --mdc-icon-size: 30px; margin-top: 18px; color: var(--secondary-text-color); }
      .big .u { font-size: 22px; color: var(--secondary-text-color); margin-top: 8px; }
      .info { display: flex; flex-wrap: wrap; gap: 6px 14px; padding: 8px 20px 0; font-size: 13px; color: var(--secondary-text-color); --mdc-icon-size: 15px; }
      .info span { display: inline-flex; align-items: center; gap: 4px; }
      .status { --mdc-icon-size: 15px; }
      .status.solar { color: var(--sm-solar-text); }
      .status.grid { color: var(--sm-grid-text); }
      .status.warn { color: var(--sm-warn-text); }
      .status.ok { color: var(--sm-ok-text); }
      hr { border: none; border-top: 1px solid var(--sm-border); margin: 16px 20px; }
      .mode { padding: 0 20px 20px; }
      .mode .l { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px; }
      .mode .d { font-size: 13px; color: var(--secondary-text-color); margin-top: 8px; }
      .list { padding-bottom: 8px; }
      .list .card-head { padding-bottom: 4px; }
    `,
  ];

  private get _sections(): SectionSpec[] {
    const h = this.hass;
    return [
      {
        title: t("detail.device"),
        rows: [
          {
            icon: "mdi:home-battery-outline", title: t("f.bat_soc_entity"), show: isBat,
            secondary: (l) => entityName(h, l.bat_soc_entity), value: (_l, lv) => (lv?.soc != null ? `${Math.round(lv.soc)}%` : ""),
            fields: [
              { key: "bat_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1 },
            ],
          },
          {
            icon: "mdi:meter-electric-outline", title: t("f.bat_power_entity"), show: isBat,
            secondary: (l) => `${entityName(h, l.bat_power_entity)} · ${t(`f.bat_sign.${l.bat_power_sign}`)}`,
            value: (l) => entityValue(h, l.bat_power_entity),
            fields: [
              { key: "bat_power_entity", kind: "entity", domains: ["sensor"], helper: t("f.bat_power_entity.help") },
              { key: "bat_power_sign", kind: "select", options: signOpts() },
            ],
          },
          {
            icon: "mdi:tune-variant", title: t("detail.bat_control"), show: isBat,
            secondary: (l) =>
              l.bat_setpoint_entity
                ? entityName(h, l.bat_setpoint_entity)
                : l.bat_charge_entity || l.bat_discharge_entity
                  ? `${entityName(h, l.bat_charge_entity)} / ${entityName(h, l.bat_discharge_entity)}`
                  : t("detail.not_set"),
            value: (_l, lv) => (lv?.setpoint_w != null ? fmtW(lv.setpoint_w) : ""),
            fields: [
              { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], helper: t("f.bat_setpoint_entity.help") },
              { key: "bat_setpoint_sign", kind: "select", options: signOpts(), show: (d) => !!d.bat_setpoint_entity },
              { key: "bat_charge_entity", kind: "entity", domains: ["number", "input_number"], show: (d) => !d.bat_setpoint_entity },
              { key: "bat_discharge_entity", kind: "entity", domains: ["number", "input_number"], show: (d) => !d.bat_setpoint_entity },
              { key: "bat_mode_entity", kind: "entity", domains: ["select", "input_select"], helper: t("f.bat_mode_entity.help") },
              { key: "bat_mode_remote_option", kind: "text", show: (d) => !!d.bat_mode_entity },
              { key: "bat_mode_auto_option", kind: "text", show: (d) => !!d.bat_mode_entity },
            ],
          },
          {
            icon: "mdi:power-socket-eu", title: t("f.switch_entity"), show: isSwitch,
            secondary: (l) => entityName(h, l.switch_entity), value: (l) => onOff(h, l.switch_entity),
            fields: [{ key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"] }],
          },
          {
            icon: "mdi:flash", title: t("f.nominal_power_w"), show: isSwitch,
            secondary: () => t("detail.nominal_help"), value: (l) => fmtW(l.nominal_power_w),
            fields: [{ key: "nominal_power_w", kind: "number", unit: "W", step: 50 }, { key: "full_threshold_w", kind: "number", unit: "W" }],
          },
          {
            icon: "mdi:ev-plug-type2", title: t("f.ev_driver"), show: isEv,
            secondary: (l) => (isTesla(l) ? `${l.ev_proxy_url} · ${l.ev_vin || "VIN?"}` : entityName(h, l.ev_charge_switch_entity)),
            value: (l) => t(`f.ev_driver.${l.ev_driver}`),
            fields: [
              { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"].map((o) => ({ value: o, label: t(`f.ev_driver.${o}`) })) },
              { key: "ev_proxy_url", kind: "text", show: isTesla, helper: t("f.ev_proxy_url.help") },
              { key: "ev_vin", kind: "text", show: isTesla },
              { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (l) => !isTesla(l) },
              { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (l) => !isTesla(l) },
              { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: (l) => !isTesla(l) },
            ],
          },
          {
            icon: "mdi:meter-electric-outline", title: t("detail.power_sensor"), show: notBat,
            secondary: (l) => entityName(h, l.power_entity), value: (l) => entityValue(h, l.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: t("f.power_entity.help") }],
          },
          {
            icon: "mdi:thermometer", title: t("detail.temp_sensor"), show: isSwitch,
            secondary: (l) => entityName(h, l.temperature_entity),
            value: (l) => (l.max_temperature != null ? `${entityValue(h, l.temperature_entity)} · max ${l.max_temperature} °C` : entityValue(h, l.temperature_entity)),
            fields: [
              { key: "temperature_entity", kind: "entity", domains: ["sensor"] },
              { key: "max_temperature", kind: "number", nullable: true, unit: "°C" },
              { key: "boiler_volume_l", kind: "number", unit: "l", step: 10, helper: t("f.boiler_volume_l.help"), show: (d) => !!d.temperature_entity },
              { key: "boiler_target_temperature", kind: "number", nullable: true, unit: "°C", helper: t("f.boiler_target_temperature.help"), show: (d) => !!d.temperature_entity },
            ],
          },
          {
            icon: "mdi:battery-charging", title: t("f.ev_soc_entity"), show: isEv,
            secondary: (l) => (l.ev_soc_entity ? entityName(h, l.ev_soc_entity) : isTesla(l) ? t("detail.from_proxy") : t("detail.not_set")),
            value: (l, lv) => (lv?.soc != null ? `${Math.round(lv.soc)}%` : ""),
            fields: [
              { key: "ev_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "ev_charge_limit_entity", kind: "entity", domains: ["sensor", "number", "input_number"], show: (l) => !isTesla(l) },
            ],
          },
        ],
      },
      {
        title: t("f.section.battery"),
        show: isBat,
        rows: [
          {
            icon: "mdi:battery-charging-high", title: t("detail.bat_power"),
            secondary: () => t("detail.bat_power_sub"),
            value: (l) => `↑ ${fmtW(l.bat_max_charge_w)} · ↓ ${fmtW(l.bat_max_discharge_w)}`,
            fields: [
              { key: "bat_max_charge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_max_discharge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_deadband_w", kind: "number", unit: "W", step: 10, helper: t("f.bat_deadband_w.help") },
            ],
          },
          {
            icon: "mdi:battery-10", title: t("detail.bat_limits"),
            secondary: (l) => t("detail.bat_limits_sub").replace("{min}", pct(l.bat_min_soc)).replace("{max}", pct(l.bat_max_soc)),
            value: (l) => `${pct(l.bat_min_soc)} – ${pct(l.bat_max_soc)}`,
            fields: [
              { key: "bat_min_soc", kind: "number", unit: "%", helper: t("f.bat_min_soc.help") },
              { key: "bat_max_soc", kind: "number", unit: "%" },
              { key: "bat_target_soc", kind: "number", unit: "%", helper: t("f.bat_target_soc.help") },
            ],
          },
          {
            icon: "mdi:home-lightning-bolt-outline", title: t("f.bat_discharge_for"), secondary: () => t("detail.bat_for_help"),
            value: (l) => t(`f.bat_for.${l.bat_discharge_for}`),
            fields: [{
              key: "bat_discharge_for", kind: "select",
              options: ["house", "house_switch", "all"].map((v) => ({ value: v, label: t(`f.bat_for.${v}`) })),
            }],
          },
          { icon: "mdi:transmission-tower", title: t("f.bat_peak_support"), secondary: () => t("detail.bat_peak_help"), toggle: "bat_peak_support" },
          {
            icon: "mdi:battery-lock-outline", title: t("f.bat_peak_min_soc"), show: (l) => !!l.bat_peak_support,
            secondary: () => t("detail.bat_peak_min_help"), value: (l) => pct(l.bat_peak_min_soc),
            fields: [{ key: "bat_peak_min_soc", kind: "number", unit: "%" }],
          },
        ],
      },
      {
        title: t("f.section.ev"),
        show: isEv,
        rows: [
          {
            icon: "mdi:current-ac", title: t("detail.current"),
            secondary: (l) => `${l.ev_phases} ${t("detail.phase")} · ${t("detail.step")} ${l.ev_current_step_interval_s} s`,
            value: (l) => `${l.ev_min_current}–${l.ev_max_current} A`,
            fields: [
              { key: "ev_phases", kind: "select", options: [{ value: "1", label: "1" }, { value: "3", label: "3" }] },
              { key: "ev_min_current", kind: "number", unit: "A" },
              { key: "ev_max_current", kind: "number", unit: "A" },
              { key: "ev_current_step_interval_s", kind: "number", unit: "s" },
            ],
          },
          {
            icon: "mdi:car-battery", title: t("f.ev_battery_kwh"),
            secondary: (_l: Load, lv?: LiveLoad) =>
              lv?.battery_kwh_learned
                ? t("detail.battery_learned").replace("{kwh}", `${lv.battery_kwh_learned} kWh`)
                : lv?.battery_kwh_source === "car" && lv.battery_kwh
                  ? t("detail.battery_car").replace("{kwh}", `${lv.battery_kwh} kWh`)
                  : t("detail.battery_learning"),
            value: (l, lv) => (l.ev_battery_kwh ? `${l.ev_battery_kwh} kWh` : lv?.battery_kwh_learned ? `${lv.battery_kwh_learned} kWh (${t("detail.learned")})` : "–"),
            fields: [{ key: "ev_battery_kwh", kind: "number", nullable: true, unit: "kWh" }],
          },
          {
            icon: "mdi:battery-alert-variant-outline", title: t("f.ev_min_soc"), secondary: () => t("detail.min_soc_help"),
            value: (l) => (l.ev_min_soc != null ? `${l.ev_min_soc}%` : t("detail.off")),
            fields: [{ key: "ev_min_soc", kind: "number", nullable: true, unit: "%" }],
          },
        ],
      },
      {
        title: t("detail.behaviour"),
        show: notBat,
        rows: [
          {
            icon: "mdi:timer-play-outline", title: t("detail.start_stop"),
            secondary: (l) => t("detail.start_stop_sub").replace("{start}", sec(l.start_delay_s)).replace("{stop}", sec(l.stop_delay_s)),
            value: (l) => `+${l.start_margin_w} W`,
            fields: [
              { key: "start_delay_s", kind: "number", unit: "s" },
              { key: "stop_delay_s", kind: "number", unit: "s" },
              { key: "start_margin_w", kind: "number", unit: "W" },
            ],
          },
          {
            icon: "mdi:timer-lock-outline", title: t("detail.min_times"),
            secondary: (l) => `${t("detail.on")} ${sec(l.min_on_s)} · ${t("detail.off_short")} ${sec(l.min_off_s)}`,
            fields: [
              { key: "min_on_s", kind: "number", unit: "s" },
              { key: "min_off_s", kind: "number", unit: "s" },
            ],
          },
          {
            icon: "mdi:transmission-tower-import", title: t("f.allowed_import_w"), secondary: () => t("detail.allowed_import_help"),
            value: (l) => fmtW(l.allowed_import_w),
            fields: [{ key: "allowed_import_w", kind: "number", unit: "W", step: 50 }],
          },
          { icon: "mdi:chart-bell-curve-cumulative", title: t("f.peak_shed"), secondary: () => t("detail.peak_shed_help"), toggle: "peak_shed" },
        ],
      },
      {
        title: t("f.section.night"),
        meta: (l) => (l.mode === "solar_night" ? "" : t("detail.night_inactive")),
        rows: [
          {
            icon: "mdi:weather-night", title: t("detail.night_when"),
            secondary: (l) =>
              isBat(l)
                ? t("detail.night_when_bat").replace("{soc}", String(l.bat_target_soc))
                : isEv(l) && (l.ev_soc_entity || isTesla(l))
                ? t("detail.night_when_soc").replace("{soc}", String(l.ev_target_soc))
                : l.night_min_temperature != null
                  ? t("detail.night_when_temp").replace("{t}", String(l.night_min_temperature))
                  : t("detail.night_when_kwh").replace("{kwh}", String(l.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (l) => isSwitch(l) || (isEv(l) && !(l.ev_soc_entity || isTesla(l))) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: true, show: isSwitch },
              { key: "bat_target_soc", kind: "number", unit: "%", show: isBat },
              { key: "ev_target_soc", kind: "number", unit: "%", show: isEv },
            ],
          },
          {
            icon: "mdi:battery-arrow-up-outline", title: t("detail.night_amount"), show: isSwitch,
            value: (l) => (l.night_target_kwh ? fmtKwh(l.night_target_kwh, 1) : t("detail.until_full")),
            fields: [{ key: "night_target_kwh", kind: "number", unit: "kWh", step: 0.1 }],
          },
          {
            icon: "mdi:weather-sunny-alert", title: t("detail.forecast_skip"), secondary: () => t("detail.forecast_skip_help"),
            value: (l) => (l.night_skip_forecast_kwh ? `> ${l.night_skip_forecast_kwh} kWh` : t("detail.off")),
            fields: [{ key: "night_skip_forecast_kwh", kind: "number", unit: "kWh", nullable: true, step: 0.5 }],
          },
        ],
      },
      {
        title: t("f.section.plan"),
        show: notBat,
        meta: () => (this.live?.plan ? "" : t("detail.plan_inactive")),
        rows: [
          {
            icon: "mdi:water-thermometer-outline", title: t("detail.plan_need"), show: isSwitch,
            secondary: (l, lv) =>
              l.temperature_entity ? t("detail.plan_need_temp")
              : l.plan_need_kwh ? t("detail.plan_need_set")
              : lv?.need_learned_kwh ? t("detail.plan_need_learned").replace("{kwh}", fmtKwh(lv.need_learned_kwh, 1))
              : t("detail.plan_need_learning"),
            value: (l, lv) => (l.plan_need_kwh ? fmtKwh(l.plan_need_kwh, 1) : lv?.need_learned_kwh ? fmtKwh(lv.need_learned_kwh, 1) : ""),
            fields: [{ key: "plan_need_kwh", kind: "number", nullable: true, unit: "kWh", step: 0.1, helper: t("f.plan_need_kwh.help") }],
          },
          { icon: "mdi:car-clock", title: t("f.ev_departure_enabled"), secondary: () => t("detail.departure_help"), toggle: "ev_departure_enabled", show: isEv },
          {
            icon: "mdi:clock-outline", title: t("detail.departure"), show: (l) => isEv(l) && !!l.ev_departure_enabled,
            value: (l) => `${l.ev_departure_time} · ${l.ev_departure_soc}%`,
            secondary: (l) => {
              const days: number[] = (l.ev_departure_days ?? []).map(Number);
              return days.length === 7 ? t("detail.every_day") : days.sort().map((d) => t(`day.${d}`)).join(", ");
            },
            fields: [
              { key: "ev_departure_time", kind: "time" },
              { key: "ev_departure_soc", kind: "number", unit: "%", step: 5 },
              { key: "ev_departure_days", kind: "multi", options: [0, 1, 2, 3, 4, 5, 6].map((d) => ({ value: String(d), label: t(`day.${d}`) })) },
            ],
          },
          {
            icon: "mdi:calendar-check-outline", title: t("detail.plan_now"), show: () => !!this.live?.plan,
            secondary: () => {
              const p = this.live?.plan;
              if (!p) return "";
              const at = (ts: number) => new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const base = t("detail.plan_now_sub").replace("{need}", fmtKwh(p.need_kwh, 1)).replace("{sun}", fmtKwh(p.solar_kwh, 1));
              return p.grid_kwh > 0.01
                ? `${base} · ${t("plan.grid_at").replace("{kwh}", fmtKwh(p.grid_kwh, 1)).replace("{from}", at(p.grid_from)).replace("{to}", at(p.grid_to))}`
                : base;
            },
          },
        ],
      },
      {
        title: t("f.section.legionella"),
        show: isSwitch,
        rows: [
          { icon: "mdi:bacteria-outline", title: t("f.legionella_enabled"), secondary: () => t("f.legionella.hint"), toggle: "legionella_enabled" },
          {
            icon: "mdi:thermometer-high", title: t("detail.legionella_rule"), show: (l) => !!l.legionella_enabled,
            value: (l) => `${l.legionella_temperature} °C / ${l.legionella_interval_days} d`,
            fields: [
              { key: "legionella_temperature", kind: "number", unit: "°C" },
              { key: "legionella_interval_days", kind: "number", unit: t("detail.days") },
            ],
          },
        ],
      },
    ];
  }

  private _openDialog(title: string, fields: FieldSpec[]) {
    this._draft = { ...this.load };
    this._error = "";
    this._dialog = { title, fields };
  }

  private async _save(changes: Record<string, any>) {
    this._busy = true;
    this._error = "";
    try {
      const res = await saveLoad(this.hass, { ...this.load, ...changes });
      this.dispatchEvent(new CustomEvent("load-saved", { detail: { load: res.load, renamed: res.load.name !== this.load.name }, bubbles: true, composed: true }));
      this._dialog = null;
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
    await deleteLoad(this.hass, this.load.id);
    this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: true, composed: true }));
  }

  private _move(delta: number) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta }, bubbles: true, composed: true }));
  }

  private _hero() {
    const l = this.load;
    const lv = this.live;
    const [v, u] = splitW(isBat(l) ? Math.abs(lv?.power_w ?? 0) : lv?.power_w ?? 0);
    const dir = isBat(l) && lv ? (lv.power_w > 1 ? "mdi:arrow-up-bold" : lv.power_w < -1 ? "mdi:arrow-down-bold" : "") : "";
    const reason = lv?.reason ?? "idle";
    const tone = reasonTone(reason);
    const icon = l.icon || defaultIcon(l.type);
    const nominal = isEv(l) ? l.ev_max_current * 230 * l.ev_phases : isBat(l) ? Math.max(l.bat_max_charge_w, l.bat_max_discharge_w) : l.nominal_power_w;
    const share = lv?.kwh_today ? (lv.solar_kwh_today ?? 0) / lv.kwh_today : null;
    return html`<div class="card hero">
      <div class="hero-head">
        <div class="hero-ic ${lv?.is_on && (lv?.power_w ?? 0) > 1 ? "active" : ""}"><ha-icon .icon=${icon}></ha-icon></div>
        <div>
          <div class="hero-name">${l.name}
            <button class="icon" title=${t("load.edit")} @click=${() => this._openDialog(t("detail.name_icon"), [
              { key: "name", kind: "text" }, { key: "icon", kind: "text", helper: t("f.icon.help") },
            ])}><ha-icon icon="mdi:pencil"></ha-icon></button>
          </div>
          <div class="hero-sub"><span class="status ${tone}">${t(`reason.${reason}`)}</span> · ${t(`type.${l.type}`)}</div>
        </div>
      </div>
      <div class="big">${dir ? html`<ha-icon class="dir" .icon=${dir}></ha-icon>` : nothing}<span class="v">${v}</span><span class="u">${u}</span></div>
      <sm-sparkline .points=${this.spark} .max=${nominal} .height=${90} .label=${t("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${lv?.temperature != null ? html`<span><ha-icon icon="mdi:thermometer"></ha-icon>${lv.temperature.toFixed(1)} °C</span>` : nothing}
        ${lv?.soc != null ? html`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(lv.soc)}%</span>` : nothing}
        ${lv?.current_a != null && isEv(l) ? html`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(lv.current_a)} A</span>` : nothing}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${fmtKwh(lv?.kwh_today ?? 0, 1)} ${isBat(l) ? t("load.charged_today") : t("load.today")}</span>
        ${isBat(l) ? html`<span><ha-icon icon="mdi:home-export-outline"></ha-icon>${fmtKwh(lv?.discharge_kwh_today ?? 0, 1)} ${t("load.discharged")}</span>` : nothing}
        ${share !== null ? html`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(share * 100)}% ${t("load.from_solar")}</span>` : nothing}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${t("f.mode")}</div>
        <sm-segmented .options=${modeOptions(l.type)} .value=${l.mode}
          @value-changed=${(e: CustomEvent) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: l.id, mode: e.detail.value }, bubbles: true, composed: true }))}></sm-segmented>
        <div class="d">${t(`${modeKey(l.mode, l.type)}.desc`)}</div>
      </div>
    </div>`;
  }

  private _controlCard() {
    const l = this.load;
    return html`<div class="card list">
      <sm-list-row icon="mdi:power" variant="primary" .heading=${t("f.enabled")} .secondary=${t("detail.enabled_help")}>
        <sm-toggle .checked=${l.enabled} @change=${(e: CustomEvent) => this._save({ enabled: e.detail.checked })}></sm-toggle>
      </sm-list-row>
      <sm-list-row icon="mdi:sort-numeric-ascending" .heading=${t("detail.priority")}
        .secondary=${t("detail.priority_sub").replace("{n}", String(this.priority)).replace("{c}", String(this.count))}>
        <button class="icon" ?disabled=${this.priority <= 1} @click=${() => this._move(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon" ?disabled=${this.priority >= this.count} @click=${() => this._move(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
      </sm-list-row>
      <sm-list-row icon="mdi:chart-line" .heading=${t("load.analytics")} .secondary=${t("detail.analytics_sub")} clickable
        @row-click=${() => this.dispatchEvent(new CustomEvent("open-analytics", { detail: { id: l.id }, bubbles: true, composed: true }))}></sm-list-row>
      <sm-list-row icon="mdi:delete-outline" variant="danger" .heading=${this._confirmDelete ? t("load.delete_confirm") : t("load.delete")}
        clickable @row-click=${this._delete}></sm-list-row>
    </div>`;
  }

  private _section(s: SectionSpec) {
    const l = this.load;
    if (s.show && !s.show(l)) return nothing;
    const rows = s.rows.filter((r) => !r.show || r.show(l));
    return html`<div class="card list">
      <div class="card-head"><h2>${s.title}</h2>${s.meta && s.meta(l) ? html`<span class="meta">${s.meta(l)}</span>` : nothing}</div>
      ${rows.map((r) =>
        r.toggle
          ? html`<sm-list-row .icon=${r.icon} .heading=${r.title} .secondary=${r.secondary?.(l, this.live) ?? ""}>
              <sm-toggle .checked=${!!l[r.toggle]} @change=${(e: CustomEvent) => this._save({ [r.toggle!]: e.detail.checked })}></sm-toggle>
            </sm-list-row>`
          : html`<sm-list-row .icon=${r.icon} .heading=${r.title} .secondary=${r.secondary?.(l, this.live) ?? ""} .value=${r.value?.(l, this.live) ?? ""}
              clickable @row-click=${() => this._openDialog(r.title, r.fields ?? [])}></sm-list-row>`,
      )}
    </div>`;
  }

  render() {
    const sections = this._sections;
    return html`
      <div class="layout">
        <div class="col">${this._hero()}${this._controlCard()}</div>
        <div class="col">${sections.map((s) => this._section(s))}</div>
      </div>
      ${this._dialog
        ? html`<sm-dialog .heading=${this._dialog.title} .busy=${this._busy} .error=${this._error}
            @closed=${() => (this._dialog = null)} @save=${() => this._save(this._draft)}>
            <sm-form .hass=${this.hass} .fields=${this._dialog.fields} .data=${this._draft}
              @value-changed=${(e: CustomEvent) => (this._draft = { ...this._draft, [e.detail.key]: e.detail.value })}></sm-form>
          </sm-dialog>`
        : nothing}
    `;
  }
}
