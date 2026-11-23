import { LitElement, css, html, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { tokens } from "../../styles/tokens";

/** Edge-to-edge area sparkline: solar part and grid part of a load's power. Points: [ts, power, solar]. */
@customElement("sm-sparkline")
export class SmSparkline extends LitElement {
  @property({ attribute: false }) points: [number, number, number][] = [];
  @property({ type: Number }) max = 0;
  @property({ type: Number }) height = 72;
  @property() label = "";

  static styles = [
    tokens,
    css`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `,
  ];

  render() {
    const pts = this.points;
    const W = 400;
    const H = this.height;
    if (pts.length < 2) return html`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px"></svg>`;
    const x0 = pts[0][0];
    const x1 = pts[pts.length - 1][0];
    const max = Math.max(this.max, ...pts.map((p) => p[1]), 1) * 1.1;
    const sx = (t: number) => ((t - x0) / Math.max(1, x1 - x0)) * W;
    const sy = (v: number) => H - (v / max) * (H - 4);
    const line = (f: (p: [number, number, number]) => number) =>
      pts.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)},${sy(f(p)).toFixed(1)}`).join("");
    const area = (top: (p: [number, number, number]) => number, bottom: (p: [number, number, number]) => number) => {
      let d = line(top);
      for (let i = pts.length - 1; i >= 0; i--) d += `L${sx(pts[i][0]).toFixed(1)},${sy(bottom(pts[i])).toFixed(1)}`;
      return d + "Z";
    };
    const id = `g${Math.random().toString(36).slice(2, 8)}`;
    return html`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">
        <defs>
          <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--sm-solar)" stop-opacity="0.45"></stop>
            <stop offset="1" stop-color="var(--sm-solar)" stop-opacity="0.05"></stop>
          </linearGradient>
          <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--sm-grid)" stop-opacity="0.5"></stop>
            <stop offset="1" stop-color="var(--sm-grid)" stop-opacity="0.1"></stop>
          </linearGradient>
        </defs>
        ${svg`<path d="${area((p) => p[2], () => 0)}" fill="url(#${id}s)"></path>
        <path d="${area((p) => p[1], (p) => p[2])}" fill="url(#${id}g)"></path>
        <path d="${line((p) => p[1])}" fill="none" stroke="var(--secondary-text-color)" stroke-opacity="0.6" stroke-width="1.2" vector-effect="non-scaling-stroke"></path>
        <path d="${line((p) => p[2])}" fill="none" stroke="var(--sm-solar)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
      </svg>
      ${this.label ? html`<span class="label">${this.label}</span>` : ""}`;
  }
}
