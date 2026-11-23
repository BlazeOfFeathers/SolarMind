import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { tokens } from "../styles/tokens";

export interface Series {
  label: string;
  color: string;
  values: (number | null)[];
  kind: "area" | "line" | "step";
  stack?: string;
  dashed?: boolean;
  unit?: string;
  legend?: boolean;
}

export interface BandSeg {
  from: number;
  to: number;
  color: string;
  title: string;
}

export interface Panel {
  title: string;
  unit: string;
  height: number;
  series?: Series[];
  bands?: { label: string; segments: BandSeg[] }[];
  zero?: boolean; // include 0 in the y range
}

const W = 1000;
const PAD_L = 64;
const PAD_R = 16;
const TITLE_H = 18;
const GAP = 14;
const BAND_H = 12;

const niceStep = (raw: number) => {
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
};

const fmt = (v: number, unit: string) => {
  if (unit === "W") return Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)} kW` : `${Math.round(v)} W`;
  return `${Math.round(v * 10) / 10}${unit ? " " + unit : ""}`;
};

/** Stacked chart panels sharing one time axis, with a hover readout (RoomMind analytics look). */
@customElement("sm-chart")
export class SmChart extends LitElement {
  @property({ attribute: false }) x: number[] = [];
  @property({ attribute: false }) panels: Panel[] = [];
  @state() private _hover: number | null = null;

  static styles = [
    tokens,
    css`
      :host { display: block; position: relative; }
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .ptitle { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); stroke-width: 1; }
      .tip {
        position: absolute; top: 8px; pointer-events: none; background: var(--sm-surface); border: 1px solid var(--sm-border);
        border-radius: 8px; padding: 8px 10px; font-size: 12px; box-shadow: var(--sm-shadow-pop); white-space: nowrap; z-index: 2;
      }
      .tip div { line-height: 1.6; }
      .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
      .legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; font-size: 13px; margin-top: 10px; }
    `,
  ];

  render() {
    const n = this.x.length;
    if (n < 2) return html`<slot></slot>`;
    const x0 = this.x[0];
    const x1 = this.x[n - 1];
    const sx = (t: number) => PAD_L + ((t - x0) / Math.max(1, x1 - x0)) * (W - PAD_L - PAD_R);

    let y = 0;
    const parts: unknown[] = [];
    const plotTops: [number, number][] = [];
    for (const p of this.panels) {
      const top = y + TITLE_H;
      const h = p.height;
      plotTops.push([top, h]);
      parts.push(svg`<text class="ptitle" x="${PAD_L}" y="${y + 12}">${p.title}</text>`);
      parts.push(svg`<rect class="plot" x="${PAD_L}" y="${top}" width="${W - PAD_L - PAD_R}" height="${h}" rx="2"></rect>`);
      if (p.series?.length) parts.push(this._series(p, top, h, sx));
      if (p.bands?.length) {
        p.bands.forEach((b, bi) => {
          const by = top + 4 + bi * (BAND_H + 4);
          parts.push(svg`<text class="axis" x="${PAD_L - 8}" y="${by + 10}" text-anchor="end">${b.label}</text>`);
          b.segments.forEach((s) =>
            parts.push(svg`<rect x="${sx(s.from)}" y="${by}" width="${Math.max(1, sx(s.to) - sx(s.from))}" height="${BAND_H}" fill="${s.color}" rx="2"><title>${s.title}</title></rect>`),
          );
        });
      }
      y = top + h + GAP;
    }
    // time axis
    const span = x1 - x0;
    const step = span <= 1.5 * 86400 ? 3 * 3600 : span <= 8 * 86400 ? 86400 : 7 * 86400;
    const ticks: number[] = [];
    const tzOff = new Date().getTimezoneOffset() * 60;
    for (let tk = Math.ceil((x0 - tzOff) / step) * step + tzOff; tk <= x1; tk += step) ticks.push(tk);
    const fmtX = (tk: number) => {
      const d = new Date(tk * 1000);
      return step < 86400 ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString([], { weekday: "short", day: "numeric" });
    };
    const axisY = y - GAP + 16;
    const H = axisY + 6;
    ticks.forEach((tk) => {
      parts.push(svg`<line class="gridline" x1="${sx(tk)}" x2="${sx(tk)}" y1="${TITLE_H}" y2="${y - GAP}" stroke-dasharray="2 4"></line>`);
      parts.push(svg`<text class="axis" x="${sx(tk)}" y="${axisY}" text-anchor="middle">${fmtX(tk)}</text>`);
    });
    const hi = this._hover;
    if (hi !== null) {
      plotTops.forEach(([top, h]) =>
        parts.push(svg`<line x1="${sx(this.x[hi])}" x2="${sx(this.x[hi])}" y1="${top}" y2="${top + h}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`),
      );
    }

    const onMove = (e: MouseEvent) => {
      const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const tt = x0 + ((px - PAD_L) / (W - PAD_L - PAD_R)) * (x1 - x0);
      let lo = 0;
      let hiI = n - 1;
      while (hiI - lo > 1) {
        const mid = (lo + hiI) >> 1;
        if (this.x[mid] < tt) lo = mid;
        else hiI = mid;
      }
      this._hover = Math.abs(this.x[lo] - tt) < Math.abs(this.x[hiI] - tt) ? lo : hiI;
    };

    const allSeries = this.panels.flatMap((p) => (p.series ?? []).map((s) => ({ ...s, unit: s.unit ?? p.unit })));
    return html`
      <svg viewBox="0 0 ${W} ${H}" @mousemove=${onMove} @mouseleave=${() => (this._hover = null)}>${parts}</svg>
      ${hi !== null
        ? html`<div class="tip" style="${sx(this.x[hi]) > W / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[hi] * 1000).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${allSeries.map((s) => {
              const v = s.values[hi];
              return v === null || v === undefined ? nothing : html`<div><span class="dot" style="background:${s.color}"></span>${s.label}: ${fmt(v, s.unit!)}</div>`;
            })}
          </div>`
        : nothing}
      <div class="legend">
        ${allSeries.filter((s) => s.legend !== false).map((s) => html`<span><span class="dot" style="background:${s.color}"></span>${s.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }

  private _series(p: Panel, top: number, h: number, sx: (t: number) => number) {
    const n = this.x.length;
    const stacks: Record<string, number[]> = {};
    const tops: number[][] = [];
    const bottoms: number[][] = [];
    for (const s of p.series!) {
      if (s.kind === "area" && s.stack) {
        const base = stacks[s.stack] ?? new Array(n).fill(0);
        const tp = base.map((b, i) => b + Math.max(0, s.values[i] ?? 0));
        bottoms.push(base);
        tops.push(tp);
        stacks[s.stack] = tp;
      } else {
        bottoms.push(new Array(n).fill(0));
        tops.push(s.values.map((v) => v ?? 0));
      }
    }
    let mx = -Infinity;
    let mn = Infinity;
    p.series!.forEach((s, k) => {
      for (let i = 0; i < n; i++) {
        const v = s.values[i];
        if (v === null || v === undefined) continue;
        mx = Math.max(mx, s.kind === "area" ? tops[k][i] : v);
        mn = Math.min(mn, s.kind === "area" ? 0 : v);
      }
    });
    if (mx === -Infinity) {
      mx = 1;
      mn = 0;
    }
    if (p.zero !== false) {
      mn = Math.min(mn, 0);
      mx = Math.max(mx, 0);
    }
    const step = niceStep((mx - mn) / 3 || 1);
    mx = Math.ceil((mx + (mx - mn) * 0.04) / step) * step;
    mn = Math.floor(mn / step) * step;
    const sy = (v: number) => top + h - ((v - mn) / (mx - mn)) * h;
    const out: unknown[] = [];
    for (let v = mn; v <= mx + step / 2; v += step) {
      out.push(svg`<line class="gridline" x1="${PAD_L}" x2="${W - PAD_R}" y1="${sy(v)}" y2="${sy(v)}"></line>
        <text class="axis" x="${PAD_L - 8}" y="${sy(v) + 4}" text-anchor="end">${fmt(v, p.unit)}</text>`);
    }
    if (mn < 0) out.push(svg`<line x1="${PAD_L}" x2="${W - PAD_R}" y1="${sy(0)}" y2="${sy(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`);
    p.series!.forEach((s, k) => {
      if (s.kind === "area") {
        let d = "";
        for (let i = 0; i < n; i++) d += `${i ? "L" : "M"}${sx(this.x[i]).toFixed(1)},${sy(tops[k][i]).toFixed(1)}`;
        for (let i = n - 1; i >= 0; i--) d += `L${sx(this.x[i]).toFixed(1)},${sy(bottoms[k][i]).toFixed(1)}`;
        out.push(svg`<path d="${d}Z" fill="${s.color}" fill-opacity="0.45" stroke="${s.color}" stroke-width="1"></path>`);
        return;
      }
      let d = "";
      let pen = false;
      for (let i = 0; i < n; i++) {
        const v = s.values[i];
        if (v === null || v === undefined) {
          pen = false;
          continue;
        }
        const X = sx(this.x[i]).toFixed(1);
        const Y = sy(v).toFixed(1);
        if (s.kind === "step" && pen) d += `H${X}V${Y}`;
        else d += `${pen ? "L" : "M"}${X},${Y}`;
        pen = true;
      }
      out.push(svg`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="1.8" stroke-dasharray="${s.dashed ? "5 4" : ""}"></path>`);
    });
    return out;
  }
}

export interface Bar {
  label: string;
  parts: { value: number; color: string; title: string }[];
}

/** Stacked bars (per day, per hour, per quarter). */
@customElement("sm-bars")
export class SmBars extends LitElement {
  @property({ attribute: false }) bars: Bar[] = [];
  @property({ type: Number }) height = 180;
  @property() unit = "kWh";
  @property({ type: Number }) limit: number | null = null;

  static styles = [
    tokens,
    css`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `,
  ];

  render() {
    if (!this.bars.length) return html`<slot></slot>`;
    const H = this.height;
    const plotH = H - 26;
    const total = (b: Bar) => b.parts.reduce((a, p) => a + p.value, 0);
    const max = Math.max(this.limit ?? 0, ...this.bars.map(total), 0.001) * 1.1;
    const BW = 640;
    const bw = (BW - PAD_L - PAD_R) / this.bars.length;
    const sy = (v: number) => plotH - (v / max) * plotH;
    const every = Math.ceil(this.bars.length / 10);
    return html`<svg viewBox="0 0 ${BW} ${H}">
      <rect class="plot" x="${PAD_L}" y="0" width="${BW - PAD_L - PAD_R}" height="${plotH}" rx="2"></rect>
      ${[0, 1, 2, 3].map((i) => {
        const v = (max / 1.1) * (i / 3);
        return svg`<line class="gridline" x1="${PAD_L}" x2="${BW - PAD_R}" y1="${sy(v)}" y2="${sy(v)}"></line>
          <text class="axis" x="${PAD_L - 8}" y="${sy(v) + 4}" text-anchor="end">${fmt(v, this.unit)}</text>`;
      })}
      ${this.bars.map((b, i) => {
        let acc = 0;
        const x = PAD_L + i * bw + bw * 0.18;
        return svg`${b.parts.map((p) => {
          const y0 = sy(acc);
          acc += p.value;
          const y1 = sy(acc);
          return svg`<rect x="${x}" width="${bw * 0.64}" y="${y1}" height="${Math.max(0, y0 - y1)}" fill="${p.color}" rx="2"><title>${b.label}: ${p.title}</title></rect>`;
        })}${i % every === 0 ? svg`<text class="axis" x="${x + bw * 0.32}" y="${H - 6}" text-anchor="middle">${b.label}</text>` : nothing}`;
      })}
      ${this.limit ? svg`<line x1="${PAD_L}" x2="${BW - PAD_R}" y1="${sy(this.limit)}" y2="${sy(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : nothing}
    </svg>`;
  }
}
