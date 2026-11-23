import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export interface Series {
  label: string;
  color: string;
  values: (number | null)[];
  kind: "area" | "line";
  stack?: string; // areas with the same stack id are stacked
  axis?: "left" | "right";
  unit?: string;
  dashed?: boolean;
}

export interface Band {
  label: string;
  segments: { from: number; to: number; color: string; title: string }[];
}

const W = 1000;
const PAD_L = 74;
const PAD_R = 44;
const PAD_T = 10;
const BAND_H = 14;

/** Small dependency-free time series chart (SVG) with hover readout. */
@customElement("sm-chart")
export class SmChart extends LitElement {
  @property({ attribute: false }) x: number[] = []; // timestamps (s)
  @property({ attribute: false }) series: Series[] = [];
  @property({ attribute: false }) bands: Band[] = [];
  @property({ type: Number }) height = 240;
  @property() unit = "W";
  @property() rightUnit = "";
  @state() private _hover: number | null = null;

  static styles = css`
    :host { display: block; position: relative; }
    svg { width: 100%; height: auto; display: block; }
    .axis { font-size: 11px; fill: var(--secondary-text-color, #777); }
    .gridline { stroke: var(--divider-color, rgba(0,0,0,.12)); stroke-width: 1; }
    .tip {
      position: absolute; top: 4px; pointer-events: none; background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px; padding: 6px 8px; font-size: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,.15); white-space: nowrap; z-index: 2;
    }
    .dot { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; }
    .legend { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; margin-top: 4px; color: var(--secondary-text-color); }
  `;

  private _fmt(v: number, unit: string) {
    if (unit === "W") return Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)} kW` : `${Math.round(v)} W`;
    return `${Math.round(v * 10) / 10}${unit ? " " + unit : ""}`;
  }

  render() {
    const n = this.x.length;
    if (n < 2) return html`<slot></slot>`;
    const bandsH = this.bands.length * (BAND_H + 4);
    const plotH = this.height - PAD_T - 24 - bandsH;
    const x0 = this.x[0];
    const x1 = this.x[n - 1];
    const sx = (t: number) => PAD_L + ((t - x0) / Math.max(1, x1 - x0)) * (W - PAD_L - PAD_R);

    // stacking
    const stacks: Record<string, number[]> = {};
    const tops: number[][] = [];
    const bottoms: number[][] = [];
    for (const s of this.series) {
      if (s.kind === "area" && s.stack) {
        const base = stacks[s.stack] ?? new Array(n).fill(0);
        const top = base.map((b, i) => b + Math.max(0, s.values[i] ?? 0));
        bottoms.push(base);
        tops.push(top);
        stacks[s.stack] = top;
      } else {
        bottoms.push(new Array(n).fill(0));
        tops.push(s.values.map((v) => v ?? 0));
      }
    }
    let maxL = 0;
    let minL = 0;
    let maxR = -Infinity;
    let minR = Infinity;
    this.series.forEach((s, k) => {
      for (let i = 0; i < n; i++) {
        const v = s.values[i];
        if (v === null || v === undefined) continue;
        if (s.axis === "right") {
          maxR = Math.max(maxR, v);
          minR = Math.min(minR, v);
        } else {
          maxL = Math.max(maxL, tops[k][i]);
          minL = Math.min(minL, s.kind === "line" ? v : 0);
        }
      }
    });
    maxL = maxL <= 0 ? 1 : maxL * 1.05;
    const syL = (v: number) => PAD_T + plotH - ((v - minL) / (maxL - minL)) * plotH;
    if (maxR === -Infinity) {
      maxR = 1;
      minR = 0;
    } else {
      const span = Math.max(1, maxR - minR);
      maxR += span * 0.1;
      minR -= span * 0.1;
    }
    const syR = (v: number) => PAD_T + plotH - ((v - minR) / (maxR - minR)) * plotH;

    const paths = this.series.map((s, k) => {
      const sy = s.axis === "right" ? syR : syL;
      if (s.kind === "area") {
        let d = "";
        for (let i = 0; i < n; i++) d += `${i ? "L" : "M"}${sx(this.x[i]).toFixed(1)},${sy(tops[k][i]).toFixed(1)}`;
        for (let i = n - 1; i >= 0; i--) d += `L${sx(this.x[i]).toFixed(1)},${sy(bottoms[k][i]).toFixed(1)}`;
        return svg`<path d="${d}Z" fill="${s.color}" fill-opacity="0.55" stroke="${s.color}" stroke-width="1"></path>`;
      }
      let d = "";
      let pen = false;
      for (let i = 0; i < n; i++) {
        const v = s.values[i];
        if (v === null || v === undefined) {
          pen = false;
          continue;
        }
        d += `${pen ? "L" : "M"}${sx(this.x[i]).toFixed(1)},${sy(v).toFixed(1)}`;
        pen = true;
      }
      return svg`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="1.6" stroke-dasharray="${s.dashed ? "4 3" : ""}"></path>`;
    });

    const ticks = 4;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) => minL + ((maxL - minL) * i) / ticks);
    const span = x1 - x0;
    const step = span <= 2 * 86400 ? 3 * 3600 : span <= 8 * 86400 ? 86400 : 7 * 86400;
    const xTicks: number[] = [];
    const first = Math.ceil(x0 / step) * step;
    for (let t = first; t <= x1; t += step) xTicks.push(t);
    const fmtX = (t: number) => {
      const d = new Date(t * 1000);
      return step < 86400
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString([], { day: "numeric", month: "short" });
    };

    const bandY0 = PAD_T + plotH + 22;
    const hoverI = this._hover;
    const onMove = (e: MouseEvent) => {
      const el = e.currentTarget as SVGSVGElement;
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const t = x0 + ((px - PAD_L) / (W - PAD_L - PAD_R)) * (x1 - x0);
      let lo = 0;
      let hi = n - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (this.x[mid] < t) lo = mid;
        else hi = mid;
      }
      this._hover = Math.abs(this.x[lo] - t) < Math.abs(this.x[hi] - t) ? lo : hi;
    };

    return html`
      <svg viewBox="0 0 ${W} ${this.height}" @mousemove=${onMove} @mouseleave=${() => (this._hover = null)}>
        ${yTicks.map(
          (v) => svg`<line class="gridline" x1="${PAD_L}" x2="${W - PAD_R}" y1="${syL(v)}" y2="${syL(v)}"></line>
            <text class="axis" x="${PAD_L - 6}" y="${syL(v) + 4}" text-anchor="end">${this._fmt(v, this.unit)}</text>`,
        )}
        ${this.rightUnit
          ? [0, 0.5, 1].map((f) => {
              const v = minR + (maxR - minR) * f;
              return svg`<text class="axis" x="${W - PAD_R + 6}" y="${syR(v) + 4}">${this._fmt(v, this.rightUnit)}</text>`;
            })
          : nothing}
        ${xTicks.map((t) => svg`<text class="axis" x="${sx(t)}" y="${PAD_T + plotH + 14}" text-anchor="middle">${fmtX(t)}</text>`)}
        ${paths}
        ${this.bands.map(
          (b, bi) => svg`
            <text class="axis" x="${PAD_L - 6}" y="${bandY0 + bi * (BAND_H + 4) + 11}" text-anchor="end">${b.label}</text>
            ${b.segments.map(
              (seg) => svg`<rect x="${sx(seg.from)}" y="${bandY0 + bi * (BAND_H + 4)}" width="${Math.max(1, sx(seg.to) - sx(seg.from))}"
                height="${BAND_H}" fill="${seg.color}" rx="2"><title>${seg.title}</title></rect>`,
            )}`,
        )}
        ${hoverI !== null
          ? svg`<line x1="${sx(this.x[hoverI])}" x2="${sx(this.x[hoverI])}" y1="${PAD_T}" y2="${PAD_T + plotH}" stroke="currentColor" stroke-opacity="0.4"></line>`
          : nothing}
      </svg>
      ${hoverI !== null
        ? html`<div class="tip" style="${sx(this.x[hoverI]) > W / 2 ? "left:8px" : "right:8px"}">
            <div><b>${new Date(this.x[hoverI] * 1000).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${this.series.map((s) => {
              const v = s.values[hoverI];
              return v === null || v === undefined
                ? nothing
                : html`<div><span class="dot" style="background:${s.color}"></span>${s.label}: ${this._fmt(v, s.unit ?? this.unit)}</div>`;
            })}
          </div>`
        : nothing}
      <div class="legend">
        ${this.series.map((s) => html`<span><span class="dot" style="background:${s.color}"></span>${s.label}</span>`)}
      </div>
    `;
  }
}

export interface Bar {
  label: string;
  parts: { value: number; color: string; title: string }[];
}

/** Stacked bar chart. */
@customElement("sm-bars")
export class SmBars extends LitElement {
  @property({ attribute: false }) bars: Bar[] = [];
  @property({ type: Number }) height = 180;
  @property() unit = "kWh";
  @property({ type: Number }) limit: number | null = null;

  static styles = css`
    svg { width: 100%; height: auto; display: block; }
    .axis { font-size: 11px; fill: var(--secondary-text-color, #777); }
    .gridline { stroke: var(--divider-color, rgba(0,0,0,.12)); }
  `;

  private _fmt(v: number) {
    if (this.unit === "W") return v >= 1000 ? `${(v / 1000).toFixed(1)} kW` : `${Math.round(v)} W`;
    return `${v.toFixed(v < 10 ? 1 : 0)} ${this.unit}`;
  }

  render() {
    if (!this.bars.length) return html`<slot></slot>`;
    const H = this.height;
    const plotH = H - 30;
    const max = Math.max(this.limit ?? 0, ...this.bars.map((b) => b.parts.reduce((a, p) => a + p.value, 0)), 0.001) * 1.1;
    const bw = (W - PAD_L - 10) / this.bars.length;
    const sy = (v: number) => 8 + plotH - (v / max) * plotH;
    const every = Math.ceil(this.bars.length / 16);
    return html`<svg viewBox="0 0 ${W} ${H}">
      ${[0, 0.5, 1].map((f) => svg`<line class="gridline" x1="${PAD_L}" x2="${W - 10}" y1="${sy(max * f / 1.1)}" y2="${sy(max * f / 1.1)}"></line>
        <text class="axis" x="${PAD_L - 6}" y="${sy(max * f / 1.1) + 4}" text-anchor="end">${this._fmt(max * f / 1.1)}</text>`)}
      ${this.bars.map((b, i) => {
        let acc = 0;
        const x = PAD_L + i * bw + bw * 0.15;
        return svg`${b.parts.map((p) => {
          const y0 = sy(acc);
          acc += p.value;
          const y1 = sy(acc);
          return svg`<rect x="${x}" width="${bw * 0.7}" y="${y1}" height="${Math.max(0, y0 - y1)}" fill="${p.color}" rx="2"><title>${b.label}: ${p.title}</title></rect>`;
        })}
        ${i % every === 0 ? svg`<text class="axis" x="${x + bw * 0.35}" y="${H - 6}" text-anchor="middle">${b.label}</text>` : nothing}`;
      })}
      ${this.limit ? svg`<line x1="${PAD_L}" x2="${W - 10}" y1="${sy(this.limit)}" y2="${sy(this.limit)}" stroke="#e0533d" stroke-dasharray="5 4"></line>` : nothing}
    </svg>`;
  }
}
