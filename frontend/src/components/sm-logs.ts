import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { clearLogs, getLogs, setVerboseLogs, type LogEntry, type LogsPayload } from "../api";
import { t } from "../i18n";
import { cardStyles, tokens } from "../styles/tokens";
import type { Hass } from "../types";
import "./shared/sm-segmented";
import "./shared/sm-toggle";

const LEVELS: Record<string, number> = { DEBUG: 10, INFO: 20, WARNING: 30, ERROR: 40, CRITICAL: 50 };

const fmtTs = (ts: number) => {
  const d = new Date(ts * 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

/** SolarMind's own recent log lines (in-memory buffer on the server). */
@customElement("sm-logs")
export class SmLogs extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @state() private _data: LogsPayload | null = null;
  @state() private _level = "all";
  @state() private _query = "";
  @state() private _msg = "";
  @state() private _auto = true;
  private _timer?: number;

  static styles = [
    tokens,
    cardStyles,
    css`
      :host { display: block; }
      .row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
      .row .grow { flex: 1; min-width: 0; }
      .lbl { font-size: 14px; }
      .help { font-size: 12px; color: var(--secondary-text-color); }
      input.search {
        font: inherit; font-size: 14px; flex: 1; min-width: 140px; padding: 8px 12px; box-sizing: border-box;
        border: 1px solid var(--sm-border-strong); border-radius: var(--sm-radius-sm);
        background: var(--sm-surface); color: var(--primary-text-color);
      }
      .actions { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
      .actions .muted { font-size: 12px; margin-left: auto; }
      .log {
        font-family: var(--code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
        font-size: 12px; line-height: 1.45; max-height: 60vh; overflow: auto;
        border: 1px solid var(--sm-border); border-radius: var(--sm-radius-sm); background: var(--sm-fill);
      }
      .e { display: grid; grid-template-columns: auto auto 1fr; gap: 8px; padding: 4px 8px; border-bottom: 1px solid var(--sm-border); }
      .e:last-child { border-bottom: none; }
      .ts { color: var(--secondary-text-color); white-space: nowrap; }
      .lv { font-weight: 600; white-space: nowrap; }
      .lv.DEBUG { color: var(--secondary-text-color); }
      .lv.WARNING { color: var(--sm-warn-text); }
      .lv.ERROR, .lv.CRITICAL { color: var(--sm-err-text); }
      .m { white-space: pre-wrap; word-break: break-word; min-width: 0; }
      .src { color: var(--secondary-text-color); }
      .empty { padding: 16px; text-align: center; color: var(--secondary-text-color); font-family: inherit; }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this._load();
    this._timer = window.setInterval(() => this._auto && this._load(), 5000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }

  private async _run(fn: () => Promise<LogsPayload>) {
    try {
      this._data = await fn();
    } catch (err: any) {
      this._msg = err?.message ?? String(err);
    }
  }

  private _load = () => this._run(() => getLogs(this.hass));

  private _filtered(): LogEntry[] {
    const min = this._level === "all" ? 0 : LEVELS[this._level] ?? 0;
    const q = this._query.trim().toLowerCase();
    return (this._data?.entries ?? [])
      .filter((e) => (LEVELS[e.level] ?? 0) >= min)
      .filter((e) => !q || e.message.toLowerCase().includes(q) || e.source.toLowerCase().includes(q))
      .reverse();
  }

  private async _copy() {
    const text = this._filtered()
      .slice()
      .reverse()
      .map((e) => `${fmtTs(e.ts)} ${e.level} [${e.source}] ${e.message}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      this._msg = t("logs.copied");
    } catch {
      this._msg = t("logs.copy_failed");
    }
    window.setTimeout(() => (this._msg = ""), 3000);
  }

  render() {
    const rows = this._filtered();
    const total = this._data?.entries.length ?? 0;
    return html`
      <div class="row">
        <div class="grow">
          <div class="lbl">${t("logs.verbose")}</div>
          <div class="help">${t("logs.verbose.help")}</div>
        </div>
        <sm-toggle ?checked=${this._data?.verbose ?? false}
          @change=${(e: CustomEvent) => this._run(() => setVerboseLogs(this.hass, e.detail.checked))}></sm-toggle>
      </div>
      <div class="row">
        <sm-segmented size="sm" .value=${this._level}
          .options=${["all", "INFO", "WARNING", "ERROR"].map((v) => ({ value: v, label: t(`logs.level.${v}`) }))}
          @value-changed=${(e: CustomEvent) => { e.stopPropagation(); this._level = e.detail.value; }}></sm-segmented>
        <input class="search" type="search" placeholder=${t("logs.search")} .value=${this._query}
          @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)} />
      </div>
      <div class="row actions">
        <button class="text" @click=${this._load}>${t("logs.refresh")}</button>
        <button class="text" ?disabled=${!rows.length} @click=${this._copy}>${t("logs.copy")}</button>
        <button class="text" ?disabled=${!total} @click=${() => this._run(() => clearLogs(this.hass))}>${t("logs.clear")}</button>
        <label class="help"><input type="checkbox" .checked=${this._auto}
          @change=${(e: Event) => (this._auto = (e.target as HTMLInputElement).checked)} /> ${t("logs.auto")}</label>
        <span class="muted">${this._msg || t("logs.count").replace("{n}", String(rows.length)).replace("{t}", String(total))}</span>
      </div>
      <div class="log">
        ${rows.length
          ? rows.map(
              (e) => html`<div class="e"><span class="ts">${fmtTs(e.ts)}</span><span class="lv ${e.level}">${e.level}</span>
                <span class="m"><span class="src">[${e.source}]</span> ${e.message}</span></div>`,
            )
          : html`<div class="empty">${this._data ? t("logs.empty") : t("logs.loading")}</div>`}
      </div>
    `;
  }
}
