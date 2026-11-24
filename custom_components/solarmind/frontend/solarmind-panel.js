/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = globalThis, Xe = We.ShadowRoot && (We.ShadyCSS === void 0 || We.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Je = Symbol(), it = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(e, i, a) {
    if (this._$cssResult$ = !0, a !== Je) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Xe && e === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (e = it.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && it.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Lt = (t) => new wt(typeof t == "string" ? t : t + "", void 0, Je), M = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((a, s, o) => a + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new wt(i, t, Je);
}, Nt = (t, e) => {
  if (Xe) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const a = document.createElement("style"), s = We.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, t.appendChild(a);
  }
}, st = Xe ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const a of e.cssRules) i += a.cssText;
  return Lt(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: It, getOwnPropertyDescriptor: Wt, getOwnPropertyNames: Ht, getOwnPropertySymbols: Ut, getPrototypeOf: Bt } = Object, K = globalThis, at = K.trustedTypes, Rt = at ? at.emptyScript : "", Re = K.reactiveElementPolyfillSupport, Ee = (t, e) => t, He = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Rt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Qe = (t, e) => !Tt(t, e), rt = { attribute: !0, type: String, converter: He, reflect: !1, useDefault: !1, hasChanged: Qe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), K.litPropertyMetadata ?? (K.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ge = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = rt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, i);
      s !== void 0 && It(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, a) {
    const { get: s, set: o } = Wt(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: s, set(r) {
      const h = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(e, h, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ee("elementProperties"))) return;
    const e = Bt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ee("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ee("properties"))) {
      const i = this.properties, a = [...Ht(i), ...Ut(i)];
      for (const s of a) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [a, s] of i) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const s = this._$Eu(i, a);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const s of a) i.unshift(st(s));
    } else e !== void 0 && i.push(st(e));
    return i;
  }
  static _$Eu(e, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const a of i.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Nt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var a;
      return (a = i.hostConnected) == null ? void 0 : a.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var a;
      return (a = i.hostDisconnected) == null ? void 0 : a.call(i);
    });
  }
  attributeChangedCallback(e, i, a) {
    this._$AK(e, a);
  }
  _$ET(e, i) {
    var o;
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const r = (((o = a.converter) == null ? void 0 : o.toAttribute) !== void 0 ? a.converter : He).toAttribute(i, a.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var o, r;
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const h = a.getPropertyOptions(s), l = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((o = h.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? h.converter : He;
      this._$Em = s;
      const c = l.fromAttribute(i, h.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, a, s = !1, o) {
    var r;
    if (e !== void 0) {
      const h = this.constructor;
      if (s === !1 && (o = this[e]), a ?? (a = h.getPropertyOptions(e)), !((a.hasChanged ?? Qe)(o, i) || a.useDefault && a.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(h._$Eu(e, a)))) return;
      this.C(e, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: a, reflect: s, wrapped: o }, r) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), o !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, r] of s) {
        const { wrapped: h } = r, l = this[o];
        h !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (a = this._$EO) == null || a.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((a) => {
      var s;
      return (s = a.hostUpdated) == null ? void 0 : s.call(a);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[Ee("elementProperties")] = /* @__PURE__ */ new Map(), ge[Ee("finalized")] = /* @__PURE__ */ new Map(), Re == null || Re({ ReactiveElement: ge }), (K.reactiveElementVersions ?? (K.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis, ot = (t) => t, Ue = Me.trustedTypes, nt = Ue ? Ue.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, kt = "$lit$", G = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + G, Vt = `<${At}>`, ae = document, Oe = () => ae.createComment(""), ze = (t) => t === null || typeof t != "object" && typeof t != "function", et = Array.isArray, Ft = (t) => et(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Ve = `[ 	
\f\r]`, we = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lt = /-->/g, dt = />/g, te = RegExp(`>|${Ve}(?:([^\\s"'>=/]+)(${Ve}*=${Ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, ht = /"/g, St = /^(?:script|style|textarea|title)$/i, Et = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Et(1), A = Et(2), ve = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), ie = ae.createTreeWalker(ae, 129);
function Mt(t, e) {
  if (!et(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(e) : e;
}
const Zt = (t, e) => {
  const i = t.length - 1, a = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = we;
  for (let h = 0; h < i; h++) {
    const l = t[h];
    let c, m, p = -1, f = 0;
    for (; f < l.length && (r.lastIndex = f, m = r.exec(l), m !== null); ) f = r.lastIndex, r === we ? m[1] === "!--" ? r = lt : m[1] !== void 0 ? r = dt : m[2] !== void 0 ? (St.test(m[2]) && (s = RegExp("</" + m[2], "g")), r = te) : m[3] !== void 0 && (r = te) : r === te ? m[0] === ">" ? (r = s ?? we, p = -1) : m[1] === void 0 ? p = -2 : (p = r.lastIndex - m[2].length, c = m[1], r = m[3] === void 0 ? te : m[3] === '"' ? ht : ct) : r === ht || r === ct ? r = te : r === lt || r === dt ? r = we : (r = te, s = void 0);
    const g = r === te && t[h + 1].startsWith("/>") ? " " : "";
    o += r === we ? l + Vt : p >= 0 ? (a.push(c), l.slice(0, p) + kt + l.slice(p) + G + g) : l + G + (p === -2 ? h : g);
  }
  return [Mt(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class Ce {
  constructor({ strings: e, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const h = e.length - 1, l = this.parts, [c, m] = Zt(e, i);
    if (this.el = Ce.createElement(c, a), ie.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = ie.nextNode()) !== null && l.length < h; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(kt)) {
          const f = m[r++], g = s.getAttribute(p).split(G), y = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: o, name: y[2], strings: g, ctor: y[1] === "." ? Gt : y[1] === "?" ? Kt : y[1] === "@" ? Yt : Be }), s.removeAttribute(p);
        } else p.startsWith(G) && (l.push({ type: 6, index: o }), s.removeAttribute(p));
        if (St.test(s.tagName)) {
          const p = s.textContent.split(G), f = p.length - 1;
          if (f > 0) {
            s.textContent = Ue ? Ue.emptyScript : "";
            for (let g = 0; g < f; g++) s.append(p[g], Oe()), ie.nextNode(), l.push({ type: 2, index: ++o });
            s.append(p[f], Oe());
          }
        }
      } else if (s.nodeType === 8) if (s.data === At) l.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(G, p + 1)) !== -1; ) l.push({ type: 7, index: o }), p += G.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const a = ae.createElement("template");
    return a.innerHTML = e, a;
  }
}
function fe(t, e, i = t, a) {
  var r, h;
  if (e === ve) return e;
  let s = a !== void 0 ? (r = i._$Co) == null ? void 0 : r[a] : i._$Cl;
  const o = ze(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((h = s == null ? void 0 : s._$AO) == null || h.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, i, a)), a !== void 0 ? (i._$Co ?? (i._$Co = []))[a] = s : i._$Cl = s), s !== void 0 && (e = fe(t, s._$AS(t, e.values), s, a)), e;
}
class qt {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: a } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? ae).importNode(i, !0);
    ie.currentNode = s;
    let o = ie.nextNode(), r = 0, h = 0, l = a[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new De(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new Xt(o, this, e)), this._$AV.push(c), l = a[++h];
      }
      r !== (l == null ? void 0 : l.index) && (o = ie.nextNode(), r++);
    }
    return ie.currentNode = ae, s;
  }
  p(e) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, i), i += a.strings.length - 2) : a._$AI(e[i])), i++;
  }
}
class De {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, a, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = a, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = fe(this, e, i), ze(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== ve && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ft(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && ze(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ae.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: i, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = Ce.createElement(Mt(a.h, a.h[0]), this.options)), a);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(i);
    else {
      const r = new qt(s, this), h = r.u(this.options);
      r.p(i), this.T(h), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = pt.get(e.strings);
    return i === void 0 && pt.set(e.strings, i = new Ce(e)), i;
  }
  k(e) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const o of e) s === i.length ? i.push(a = new De(this.O(Oe()), this.O(Oe()), this, this.options)) : a = i[s], a._$AI(o), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, i); e !== this._$AB; ) {
      const s = ot(e).nextSibling;
      ot(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class Be {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, a, s, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = o, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = u;
  }
  _$AI(e, i = this, a, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) e = fe(this, e, i, 0), r = !ze(e) || e !== this._$AH && e !== ve, r && (this._$AH = e);
    else {
      const h = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = fe(this, h[a + l], i, l), c === ve && (c = this._$AH[l]), r || (r = !ze(c) || c !== this._$AH[l]), c === u ? e = u : e !== u && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Gt extends Be {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class Kt extends Be {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class Yt extends Be {
  constructor(e, i, a, s, o) {
    super(e, i, a, s, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = fe(this, e, i, 0) ?? u) === ve) return;
    const a = this._$AH, s = e === u && a !== u || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, o = e !== u && (a === u || s);
    s && this.element.removeEventListener(this.name, this, a), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Xt {
  constructor(e, i, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    fe(this, e);
  }
}
const Fe = Me.litHtmlPolyfillSupport;
Fe == null || Fe(Ce, De), (Me.litHtmlVersions ?? (Me.litHtmlVersions = [])).push("3.3.3");
const Jt = (t, e, i) => {
  const a = (i == null ? void 0 : i.renderBefore) ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    a._$litPart$ = s = new De(e.insertBefore(Oe(), o), o, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis;
class w extends ge {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Jt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return ve;
  }
}
var xt;
w._$litElement$ = !0, w.finalized = !0, (xt = se.litElementHydrateSupport) == null || xt.call(se, { LitElement: w });
const Ze = se.litElementPolyfillSupport;
Ze == null || Ze({ LitElement: w });
(se.litElementVersions ?? (se.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: He, reflect: !1, hasChanged: Qe }, ei = (t = Qt, e, i) => {
  const { kind: a, metadata: s } = i;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), a === "accessor") {
    const { name: r } = i;
    return { set(h) {
      const l = e.get.call(this);
      e.set.call(this, h), this.requestUpdate(r, l, t, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(r, void 0, t, h), h;
    } };
  }
  if (a === "setter") {
    const { name: r } = i;
    return function(h) {
      const l = this[r];
      e.call(this, h), this.requestUpdate(r, l, t, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function _(t) {
  return (e, i) => typeof i == "object" ? ei(t, e, i) : ((a, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, a), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return _({ ...t, state: !0, attribute: !1 });
}
const ti = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), ii = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), Pt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), si = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Ot = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), ai = (t, e, i) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: i }), ri = (t, e, i) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_ev_min_power", load_id: e, power_w: i }), zt = (t, e, i, a) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: i, load_id: a }), ut = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), mt = {
  "tab.overview": "Overzicht",
  "tab.analytics": "Analytics",
  "tab.settings": "Instellingen",
  "site.pv": "Zonnepanelen",
  "site.grid": "Net",
  "site.import": "Afname",
  "site.export": "Injectie",
  "site.house": "Huis (zonder verbruikers)",
  "site.managed": "Gestuurde verbruikers",
  "site.surplus": "Overschot",
  "site.peak": "Kwartierpiek",
  "site.peak_now": "Dit kwartier",
  "site.peak_projected": "Verwacht",
  "site.peak_limit": "Grens",
  "site.month_peak": "Maandpiek",
  "site.night": "Nachtvenster actief",
  "site.disabled": "Sturing staat uit: SolarMind meet wel, maar schakelt niets.",
  "site.no_grid": "Stel eerst je energiemeter in bij Instellingen.",
  "site.today": "Vandaag",
  "site.self_consumption": "Zelfconsumptie",
  "loads.title": "Verbruikers in volgorde van prioriteit",
  "loads.hint": "Sleep om de volgorde te wijzigen. De bovenste krijgt het overschot eerst.",
  "loads.add": "Verbruiker toevoegen",
  "loads.empty": "Nog geen verbruikers. Voeg je boilers en je laadpaal toe.",
  "load.edit": "Bewerken",
  "load.analytics": "Analytics",
  "load.delete": "Verwijderen",
  "load.delete_confirm": "Klik nogmaals om te verwijderen",
  "load.save": "Opslaan",
  "load.cancel": "Annuleren",
  "load.new": "Nieuwe verbruiker",
  "load.today": "vandaag",
  "load.from_solar": "van zon",
  "mode.solar": "Zon",
  "mode.solar_night": "Zon + nacht",
  "mode.on": "Aan",
  "mode.off": "Uit",
  "mode.solar.desc": "Draait alleen op overschot van je zonnepanelen.",
  "mode.solar_night.desc": "Draait op zon, en vult 's nachts aan van het net als de opbrengst te laag was.",
  "mode.on.desc": "Altijd aan (de piekbewaking kan nog ingrijpen).",
  "mode.off.desc": "SolarMind houdt deze verbruiker uit.",
  "type.switch": "Aan/uit (boiler, stekker)",
  "type.ev": "Laadpaal / auto (regelbaar)",
  "f.section.general": "Algemeen",
  "f.section.device": "Toestel",
  "f.section.timing": "Hysterese en timing",
  "f.section.night": "Nachtaanvulling",
  "f.section.legionella": "Legionella",
  "f.section.ev": "Laden",
  "f.name": "Naam",
  "f.type": "Type",
  "f.mode": "Modus",
  "f.icon": "Icoon (mdi:...)",
  "f.enabled": "Gestuurd door SolarMind",
  "f.nominal_power_w": "Nominaal vermogen",
  "f.power_entity": "Vermogenssensor (optioneel, aanbevolen)",
  "f.switch_entity": "Schakelaar (slimme stekker)",
  "f.temperature_entity": "Temperatuursensor (optioneel)",
  "f.max_temperature": "Stop bij temperatuur (optioneel)",
  "f.start_delay_s": "Startvertraging",
  "f.stop_delay_s": "Stopvertraging",
  "f.min_on_s": "Minimale aan-tijd",
  "f.min_off_s": "Minimale uit-tijd",
  "f.allowed_import_w": "Toegelaten afname tijdens zon",
  "f.start_margin_w": "Extra overschot nodig om te starten",
  "f.peak_shed": "Mag afgeschakeld worden door de piekbewaking",
  "f.night_min_solar_kwh": "Aanvullen als hij overdag minder zon kreeg dan",
  "f.night_target_kwh": "Hoeveel 's nachts aanvullen (0 = tot vol)",
  "f.night_min_temperature": "Of: aanvullen als het water kouder is dan",
  "f.night_skip_forecast_kwh": "Niet aanvullen als de voorspelling voor morgen hoger is dan",
  "f.legionella_enabled": "Legionellacyclus inschakelen",
  "f.legionella_temperature": "Minimumtemperatuur",
  "f.legionella_interval_days": "Minstens elke",
  "f.legionella.hint": "Werkt met een temperatuursensor. Als die temperatuur niet bereikt werd, verwarmt SolarMind 's nachts bij.",
  "f.full_threshold_w": "Als 'vol' beschouwen onder",
  "f.ev_driver": "Aansturing",
  "f.ev_driver.entities": "Via Home Assistant entities",
  "f.ev_driver.tesla_ble_proxy": "Rechtstreeks via Tesla BLE HTTP proxy",
  "f.ev_charge_switch_entity": "Laadschakelaar (switch)",
  "f.ev_current_entity": "Laadstroom (number, A)",
  "f.ev_soc_entity": "Batterijniveau (sensor, %)",
  "f.ev_plugged_entity": "Kabel ingeplugd (binary_sensor, optioneel)",
  "f.ev_proxy_url": "Proxy URL",
  "f.ev_vin": "VIN",
  "f.ev_phases": "Fasen",
  "f.ev_min_current": "Minimum stroom",
  "f.ev_max_current": "Maximum stroom",
  "f.ev_min_soc": "Altijd laden onder",
  "f.ev_min_power_w": "Minimaal laden",
  "f.ev_battery_kwh": "Batterijcapaciteit",
  "f.ev_charge_limit_entity": "Laadlimiet van de auto (%)",
  "eta.full": "100% over {d}",
  "eta.limit": "{soc}% (limiet) om {t}",
  "eta.at_min": "bij minimum",
  "hint.driver_error": "Auto weigert",
  "hint.no_power": "Laadpaal geeft geen stroom",
  "eta.need_capacity": "Laadtijd: vul de batterijcapaciteit in",
  "detail.battery_car": "Voorlopig geschat uit de auto: {kwh}",
  "detail.battery_learned": "Geleerd uit je laadsessies: {kwh}",
  "detail.battery_learning": "Leeg laten: SolarMind leert het uit je laadsessies",
  "detail.learned": "geleerd",
  "card.min_power_off": "Uit",
  "card.min_power_help": "Laadt minstens dit vermogen, aangevuld van het net",
  "f.ev_target_soc": "Nachtladen tot",
  "f.ev_current_step_interval_s": "Stroom max. verhogen elke",
  "s.section.meter": "Energiemeter",
  "s.section.pv": "Zonnepanelen en voorspelling",
  "s.section.peak": "Capaciteitstarief (piekbewaking)",
  "s.section.night": "Nachtvenster",
  "s.section.prices": "Prijzen (voor besparingen)",
  "s.enabled": "Sturing actief",
  "s.grid_mode": "Meting",
  "s.grid_mode.single": "Eén sensor voor netto vermogen",
  "s.grid_mode.split": "Aparte sensoren voor afname en injectie",
  "s.grid_power_entity": "Netvermogen (sensor)",
  "s.grid_sign": "Teken",
  "s.grid_sign.import_positive": "Positief = afname",
  "s.grid_sign.export_positive": "Positief = injectie",
  "s.grid_import_entity": "Afname (sensor)",
  "s.grid_export_entity": "Injectie (sensor)",
  "s.pv_power_entity": "PV-productie (sensor)",
  "s.pv_forecast_today_entity": "Voorspelling vandaag (optioneel)",
  "s.pv_forecast_tomorrow_entity": "Voorspelling morgen (optioneel)",
  "s.peak_guard_enabled": "Piekbewaking actief",
  "s.peak_limit_w": "Grens kwartiergemiddelde",
  "s.peak_follow_month_max": "Tot de reeds bereikte maandpiek mag",
  "s.peak_margin_w": "Veiligheidsmarge",
  "s.night_start": "Start",
  "s.night_end": "Einde",
  "s.price_import": "Afnameprijs",
  "s.price_export": "Injectievergoeding",
  "s.voltage": "Netspanning",
  "s.saved": "Opgeslagen",
  "reason.idle": "Inactief",
  "reason.solar": "Draait op zon",
  "reason.no_surplus": "Wacht op overschot",
  "reason.night": "Nachtaanvulling",
  "reason.always_on": "Altijd aan",
  "reason.mode_off": "Uit",
  "reason.peak_guard": "Beperkt door piekbewaking",
  "reason.legionella": "Legionellacyclus",
  "reason.min_soc": "Onder minimum lading",
  "reason.min_power": "Laden op minimumvermogen",
  "reason.target_reached": "Doel bereikt / vol",
  "reason.min_on_time": "Minimale aan-tijd",
  "reason.min_off_time": "Minimale uit-tijd",
  "reason.start_delay": "Start zo dadelijk",
  "reason.stop_delay": "Stopt zo dadelijk",
  "reason.unavailable": "Niet beschikbaar",
  "reason.disabled": "Niet gestuurd",
  "reason.not_connected": "Niet ingeplugd",
  "a.range.today": "Vandaag",
  "a.range.yesterday": "Gisteren",
  "a.range.7d": "7 dagen",
  "a.range.30d": "30 dagen",
  "a.range.month": "Deze maand",
  "a.all": "Hele huis",
  "a.timeline": "Tijdlijn",
  "a.summary": "Samenvatting",
  "a.rhythm": "Dagritme",
  "detail.power_sensor": "Vermogenssensor",
  "detail.temp_sensor": "Temperatuursensor",
  "detail.night_amount": "Hoeveel aanvullen",
  "a.daily": "Per dag",
  "a.sessions": "Laadsessies",
  "a.quarters": "Kwartierpieken",
  "a.energy": "Energie",
  "a.solar": "Zon",
  "a.grid": "Net",
  "a.solar_share": "Aandeel zon",
  "a.runtime": "Looptijd",
  "a.starts": "Starts",
  "a.saving": "Besparing",
  "a.cost": "Kost",
  "a.why": "Waarom aan/uit",
  "a.pv": "PV",
  "a.self_consumption": "Zelfconsumptie",
  "a.self_sufficiency": "Zelfvoorziening",
  "a.import": "Afname",
  "a.export": "Injectie",
  "a.peak": "Hoogste kwartier",
  "a.no_data": "Nog geen gegevens in deze periode.",
  "a.distribution": "Verdeling naar verbruikers",
  "a.start": "Start",
  "a.end": "Einde",
  "a.soc": "Batterij",
  "a.temperature": "Temperatuur",
  "a.ongoing": "bezig",
  "tab.loads": "Verbruikers",
  "nav.back": "Terug",
  "nav.done": "Klaar",
  "nav.reorder": "Volgorde wijzigen",
  "save.saving": "Opslaan…",
  "save.saved": "Opgeslagen",
  "save.error": "Opslaan mislukt",
  "load.add_save": "Toevoegen",
  "hint.peak": "Piekbewaking houdt dit tegen",
  "hint.full": "Boiler is warm (thermostaat)",
  "hint.full_ev": "Auto is vol",
  "hint.night_needed": "Vult vannacht aan",
  "hint.night_not_needed": "Geen nachtaanvulling nodig",
  "hint.charging_at": "Laadt aan",
  "detail.not_set": "Niet ingesteld",
  "detail.device": "Toestel",
  "detail.behaviour": "Gedrag",
  "detail.nominal_help": "Vermogen van het toestel als het aan staat",
  "detail.from_proxy": "Uit de Tesla BLE proxy",
  "detail.current": "Laadstroom",
  "detail.phase": "fase(n)",
  "detail.step": "verhogen elke",
  "detail.min_soc_help": "Daaronder laadt de auto meteen, ook van het net",
  "detail.off": "Uit",
  "detail.on": "Aan",
  "detail.off_short": "uit",
  "detail.start_stop": "Starten en stoppen",
  "detail.start_stop_sub": "Start na {start} overschot, stopt na {stop} tekort",
  "detail.min_times": "Minimale looptijden",
  "detail.allowed_import_help": "Zoveel mag even van het net komen voor hij stopt",
  "detail.peak_shed_help": "Uitschakelen of terugschroeven als de kwartierpiek te hoog dreigt te worden",
  "detail.night_inactive": "Actief in modus Zon + nacht",
  "detail.night_when": "Wanneer aanvullen",
  "detail.night_when_soc": "Als de batterij 's avonds onder {soc}% zit",
  "detail.night_when_temp": "Als het water 's avonds kouder is dan {t} °C",
  "detail.night_when_kwh": "Als hij overdag minder dan {kwh} kWh zon kreeg",
  "detail.until_full": "Tot vol",
  "detail.forecast_skip": "Overslaan bij goede voorspelling",
  "detail.forecast_skip_help": "Niet aanvullen als morgen veel zon voorspeld wordt",
  "detail.legionella_rule": "Temperatuur en interval",
  "detail.days": "dagen",
  "detail.name_icon": "Naam en icoon",
  "detail.last_6h": "laatste 6 u",
  "detail.enabled_help": "Uit: SolarMind laat dit toestel volledig met rust",
  "detail.priority": "Prioriteit",
  "detail.priority_sub": "#{n} van {c}: lager nummer krijgt het overschot eerst",
  "detail.analytics_sub": "Verbruik, aandeel zon en waarom hij aan of uit ging",
  "f.ev_proxy_url.help": "Bijvoorbeeld http://192.168.1.50:8080",
  "f.power_entity.help": "Aanbevolen: dan rekent SolarMind met het echte vermogen",
  "f.icon.help": "Een mdi-icoon, bijvoorbeeld mdi:water-boiler",
  "s.cat.general": "Algemeen",
  "s.cat.meter": "Energiemeter",
  "s.cat.pv": "Zonnepanelen en voorspelling",
  "s.cat.peak": "Capaciteitstarief",
  "s.cat.night": "Nachtvenster",
  "s.cat.prices": "Prijzen",
  "s.cat.general.desc": "Zet de sturing uit om SolarMind enkel te laten meten zonder iets te schakelen.",
  "s.cat.meter.desc": "Het netvermogen is de basis van alles: hieruit berekent SolarMind het overschot. Kies je digitale meter (P1, HomeWizard, ...).",
  "s.cat.pv.desc": "De PV-productie dient voor de grafieken. Met een voorspelling (Solcast, Forecast.Solar) kan de nachtaanvulling overgeslagen worden als morgen zonnig wordt.",
  "s.cat.peak.desc": "Het capaciteitstarief rekent je hoogste kwartiergemiddelde van de maand aan. SolarMind schakelt verbruikers af of verlaagt de laadstroom voor die piek stijgt.",
  "s.cat.night.desc": "In dit venster mogen verbruikers in modus Zon + nacht aanvullen van het net.",
  "s.cat.prices.desc": "Enkel gebruikt om besparingen en kosten in de analytics te schatten.",
  "s.enabled.help": "Uit: alleen meten, niets schakelen",
  "s.forecast.help": "Sensor met verwachte kWh",
  "s.peak.help": "Bewaak het kwartiergemiddelde van je afname",
  "s.peak_follow.help": "Een eerder bereikte hogere maandpiek mag opnieuw benut worden",
  "a.from_solar": "Van zon",
  "a.from_grid": "Van net",
  "a.power": "Vermogen",
  "a.rhythm_meta": "gem. per uur, 14 dagen"
}, oi = {
  "f.ev_battery_kwh": "Battery capacity",
  "f.ev_charge_limit_entity": "Car charge limit (%)",
  "eta.full": "100% in {d}",
  "eta.limit": "{soc}% (limit) at {t}",
  "eta.at_min": "at minimum",
  "hint.driver_error": "Car refused",
  "hint.no_power": "Charger delivers no power",
  "eta.need_capacity": "Charge time: set the battery capacity",
  "detail.battery_car": "Estimated from the car for now: {kwh}",
  "detail.battery_learned": "Learned from your charging sessions: {kwh}",
  "detail.battery_learning": "Leave empty: SolarMind learns it from your sessions",
  "detail.learned": "learned",
  "f.ev_min_power_w": "Minimum charge",
  "card.min_power_off": "Off",
  "card.min_power_help": "Always charges at least this, topped up from the grid",
  "reason.min_power": "Charging at minimum power",
  "tab.overview": "Overview",
  "tab.analytics": "Analytics",
  "tab.settings": "Settings",
  "site.pv": "Solar",
  "site.grid": "Grid",
  "site.import": "Import",
  "site.export": "Export",
  "site.house": "House (without loads)",
  "site.managed": "Managed loads",
  "site.surplus": "Surplus",
  "site.peak": "Quarter-hour peak",
  "site.peak_now": "This quarter",
  "site.peak_projected": "Projected",
  "site.peak_limit": "Limit",
  "site.month_peak": "Month peak",
  "site.night": "Night window active",
  "site.disabled": "Control is off: SolarMind measures but switches nothing.",
  "site.no_grid": "Set up your energy meter in Settings first.",
  "site.today": "Today",
  "site.self_consumption": "Self-consumption",
  "loads.title": "Loads in priority order",
  "loads.hint": "Drag to reorder. The top one gets the surplus first.",
  "loads.add": "Add load",
  "loads.empty": "No loads yet. Add your boilers and EV charger.",
  "load.edit": "Edit",
  "load.analytics": "Analytics",
  "load.delete": "Delete",
  "load.delete_confirm": "Click again to delete",
  "load.save": "Save",
  "load.cancel": "Cancel",
  "load.new": "New load",
  "load.today": "today",
  "load.from_solar": "from solar",
  "mode.solar_night": "Solar + night",
  "mode.off": "Off",
  "mode.solar.desc": "Runs only on solar surplus.",
  "mode.solar_night.desc": "Runs on solar and tops up from the grid at night when the yield was low.",
  "mode.on.desc": "Always on (the peak guard may still step in).",
  "mode.off.desc": "SolarMind keeps this load off.",
  "type.switch": "On/off (boiler, plug)",
  "type.ev": "EV charger (adjustable)",
  "s.saved": "Saved",
  "a.no_data": "No data in this period yet.",
  "tab.loads": "Loads",
  "nav.back": "Back",
  "nav.done": "Done",
  "nav.reorder": "Reorder",
  "save.saving": "Saving…",
  "save.saved": "Saved",
  "save.error": "Saving failed",
  "load.add_save": "Add",
  "mode.solar": "Solar",
  "mode.on": "On"
};
let Ct = "nl";
const ni = (t) => {
  Ct = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, n = (t) => (Ct === "en" ? oi[t] ?? mt[t] : mt[t]) ?? t, D = M`
  :host {
    --sm-radius: var(--ha-card-border-radius, 12px);
    --sm-radius-sm: 8px;
    --sm-fill: color-mix(in srgb, var(--secondary-text-color) 8%, transparent);
    --sm-fill-strong: color-mix(in srgb, var(--secondary-text-color) 14%, transparent);
    --sm-fill-primary: color-mix(in srgb, var(--primary-color) 10%, transparent);
    --sm-solar: var(--energy-solar-color, #ff9800);
    --sm-grid: var(--energy-grid-consumption-color, #488fc2);
    --sm-export: var(--energy-grid-return-color, #8353d1);
    --sm-ok: var(--success-color, #43a047);
    --sm-warn: var(--warning-color, #ffa600);
    --sm-err: var(--error-color, #db4437);
    --sm-solar-text: color-mix(in srgb, var(--sm-solar) 50%, var(--primary-text-color));
    --sm-grid-text: color-mix(in srgb, var(--sm-grid) 50%, var(--primary-text-color));
    --sm-ok-text: color-mix(in srgb, var(--sm-ok) 50%, var(--primary-text-color));
    --sm-warn-text: color-mix(in srgb, var(--sm-warn) 50%, var(--primary-text-color));
    --sm-err-text: color-mix(in srgb, var(--sm-err) 50%, var(--primary-text-color));
    --sm-border: var(--divider-color);
    --sm-border-strong: color-mix(in srgb, var(--primary-text-color) 22%, transparent);
    --sm-surface: var(--card-background-color, var(--ha-card-background, #fff));
    --sm-shadow-pop: 0 1px 3px rgb(0 0 0 / 12%), 0 8px 24px rgb(0 0 0 / 22%);
    --sm-touch: 44px;
  }
`, de = M`
  .card {
    background: var(--sm-surface);
    border-radius: var(--sm-radius);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--sm-border));
    box-shadow: var(--ha-card-box-shadow, none);
    box-sizing: border-box;
    min-width: 0;
  }
  .card-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 16px 8px;
  }
  .card-head h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    flex: 1;
  }
  .card-head .meta {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .card-body {
    padding: 0 16px 16px;
  }
  .muted {
    color: var(--secondary-text-color);
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    border-radius: 15px;
    border: 1px solid var(--sm-border);
    background: var(--sm-fill);
    font-size: 13px;
    white-space: nowrap;
    --mdc-icon-size: 16px;
  }
  .pill b {
    font-weight: 600;
  }
  .hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 14px;
    border: 1px solid var(--sm-border);
    background: var(--sm-surface);
    font-size: 12px;
    --mdc-icon-size: 14px;
  }
  button.text {
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    background: none;
    border: none;
    padding: 8px 12px;
    border-radius: var(--sm-radius-sm);
    cursor: pointer;
  }
  button.text:hover {
    background: var(--sm-fill-primary);
  }
  button.filled {
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-color, #fff);
    background: var(--primary-color);
    border: none;
    padding: 8px 16px;
    border-radius: var(--sm-radius-sm);
    cursor: pointer;
  }
  button.filled:disabled {
    opacity: 0.5;
    cursor: default;
  }
  button.icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    flex: none;
    --mdc-icon-size: 24px;
  }
  button.icon:hover {
    background: var(--sm-fill);
  }
  button.icon:disabled {
    opacity: 0.35;
    cursor: default;
  }
`, z = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, jt = (t) => t == null || Number.isNaN(t) ? ["–", ""] : Math.abs(t) >= 1e3 ? [(t / 1e3).toFixed(2), "kW"] : [String(Math.round(t)), "W"], T = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, ke = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, qe = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), i = Math.round(t % 3600 / 60);
  return e ? `${e} u ${i} min` : `${i} min`;
}, li = (t) => {
  const e = Math.max(1, Math.round(t / 60)), i = Math.floor(e / 60), a = e % 60;
  return i ? a ? `${i} u ${String(a).padStart(2, "0")}` : `${i} u` : `${a} min`;
}, _t = (t) => {
  const e = new Date(Date.now() + t * 1e3), i = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return e.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? i : `${e.toLocaleDateString([], { weekday: "short" })} ${i}`;
}, gt = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`, di = (t) => t == null ? "–" : t >= 3600 ? `${Math.round(t / 3600 * 10) / 10} u` : t >= 60 ? `${Math.round(t / 60 * 10) / 10} min` : `${t} s`;
var ci = Object.defineProperty, hi = Object.getOwnPropertyDescriptor, Le = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && ci(e, i, s), s;
};
let re = class extends w {
  constructor() {
    super(...arguments), this.options = [], this.value = null, this.size = "md", this.wrap = !1;
  }
  render() {
    return d`<div class="seg" role="radiogroup">
      ${this.options.map(
      (t) => d`<button role="radio" aria-checked=${t.value === this.value ? "true" : "false"} title=${t.label}
          @click=${(e) => {
        e.stopPropagation(), this._pick(t);
      }}>
          ${t.icon ? d`<ha-icon .icon=${t.icon}></ha-icon>` : u}<span>${t.label}</span>
        </button>`
    )}
    </div>`;
  }
  _pick(t) {
    t.value !== this.value && this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: t.value }, bubbles: !0, composed: !0 }));
  }
};
re.styles = [
  D,
  M`
      :host { display: block; min-width: 0; }
      .seg { display: flex; gap: 3px; padding: 3px; border-radius: 10px; background: var(--sm-fill); }
      :host([wrap]) .seg { flex-wrap: wrap; }
      :host([wrap]) button { flex: 1 0 auto; }
      button {
        flex: 1 1 auto; min-width: 0; height: 34px; padding: 0 6px; border: 1px solid transparent; border-radius: 8px;
        background: none; color: var(--secondary-text-color); font: inherit; font-size: 13px; font-weight: 500;
        display: flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; white-space: nowrap;
        --mdc-icon-size: 16px; transition: background-color 0.15s ease, color 0.15s ease;
      }
      :host([size="sm"]) button { height: 28px; padding: 0 10px; font-size: 12px; }
      button span { overflow: hidden; text-overflow: ellipsis; }
      button:hover:not([aria-checked="true"]) { color: var(--primary-text-color); background: var(--sm-fill); }
      button[aria-checked="true"] {
        background: color-mix(in srgb, var(--primary-color) 16%, var(--sm-surface));
        border-color: color-mix(in srgb, var(--primary-color) 45%, transparent);
        color: var(--primary-text-color);
      }
      button[aria-checked="true"] ha-icon { color: var(--primary-color); }
    `
];
Le([
  _({ attribute: !1 })
], re.prototype, "options", 2);
Le([
  _({ attribute: !1 })
], re.prototype, "value", 2);
Le([
  _({ reflect: !0 })
], re.prototype, "size", 2);
Le([
  _({ type: Boolean, reflect: !0 })
], re.prototype, "wrap", 2);
re = Le([
  j("sm-segmented")
], re);
var pi = Object.defineProperty, ui = Object.getOwnPropertyDescriptor, Ne = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ui(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && pi(e, i, s), s;
};
let oe = class extends w {
  constructor() {
    super(...arguments), this.points = [], this.max = 0, this.height = 72, this.label = "";
  }
  render() {
    const t = this.points, e = 400, i = this.height;
    if (t.length < 2) return d`<svg viewBox="0 0 ${e} ${i}" preserveAspectRatio="none" style="height:${i}px"></svg>`;
    const a = t[0][0], s = t[t.length - 1][0], o = Math.max(this.max, ...t.map((p) => p[1]), 1) * 1.1, r = (p) => (p - a) / Math.max(1, s - a) * e, h = (p) => i - p / o * (i - 4), l = (p) => t.map((f, g) => `${g ? "L" : "M"}${r(f[0]).toFixed(1)},${h(p(f)).toFixed(1)}`).join(""), c = (p, f) => {
      let g = l(p);
      for (let y = t.length - 1; y >= 0; y--) g += `L${r(t[y][0]).toFixed(1)},${h(f(t[y])).toFixed(1)}`;
      return g + "Z";
    }, m = `g${Math.random().toString(36).slice(2, 8)}`;
    return d`<svg viewBox="0 0 ${e} ${i}" preserveAspectRatio="none" style="height:${i}px">
        <defs>
          <linearGradient id="${m}s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--sm-solar)" stop-opacity="0.45"></stop>
            <stop offset="1" stop-color="var(--sm-solar)" stop-opacity="0.05"></stop>
          </linearGradient>
          <linearGradient id="${m}g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--sm-grid)" stop-opacity="0.5"></stop>
            <stop offset="1" stop-color="var(--sm-grid)" stop-opacity="0.1"></stop>
          </linearGradient>
        </defs>
        ${A`<path d="${c((p) => p[2], () => 0)}" fill="url(#${m}s)"></path>
        <path d="${c((p) => p[1], (p) => p[2])}" fill="url(#${m}g)"></path>
        <path d="${l((p) => p[1])}" fill="none" stroke="var(--secondary-text-color)" stroke-opacity="0.6" stroke-width="1.2" vector-effect="non-scaling-stroke"></path>
        <path d="${l((p) => p[2])}" fill="none" stroke="var(--sm-solar)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
      </svg>
      ${this.label ? d`<span class="label">${this.label}</span>` : ""}`;
  }
};
oe.styles = [
  D,
  M`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `
];
Ne([
  _({ attribute: !1 })
], oe.prototype, "points", 2);
Ne([
  _({ type: Number })
], oe.prototype, "max", 2);
Ne([
  _({ type: Number })
], oe.prototype, "height", 2);
Ne([
  _()
], oe.prototype, "label", 2);
oe = Ne([
  j("sm-sparkline")
], oe);
const mi = {
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off"
}, Dt = () => ["solar", "solar_night", "on", "off"].map((t) => ({ value: t, label: n(`mode.${t}`), icon: mi[t] })), Pe = (t) => t === "solar" ? "solar" : ["night", "always_on", "legionella", "min_soc", "min_power"].includes(t) ? "grid" : t === "peak_guard" || t === "unavailable" ? "warn" : t === "target_reached" ? "ok" : "", _i = (t) => ({
  solar: "mdi:white-balance-sunny",
  night: "mdi:weather-night",
  always_on: "mdi:power-plug",
  legionella: "mdi:bacteria-outline",
  min_soc: "mdi:battery-alert-variant-outline",
  min_power: "mdi:speedometer-slow",
  peak_guard: "mdi:transmission-tower",
  unavailable: "mdi:alert-circle-outline",
  target_reached: "mdi:check-circle-outline"
})[t] ?? "mdi:circle-small", me = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
var gi = Object.defineProperty, vi = Object.getOwnPropertyDescriptor, be = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && gi(e, i, s), s;
};
let Y = class extends w {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this._minAmps = null;
  }
  _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _hint() {
    const t = this.live, e = this.load;
    return t ? t.driver_error ? `${n("hint.driver_error")}: ${t.driver_error}` : e.type === "ev" && t.car_state === "NoPower" ? n("hint.no_power") : t.reason === "peak_guard" ? n("hint.peak") : t.is_full ? n(e.type === "ev" ? "hint.full_ev" : "hint.full") : e.mode === "solar_night" && t.night_needed === !0 ? n("hint.night_needed") : e.mode === "solar_night" && t.night_needed === !1 ? n("hint.night_not_needed") : e.type === "ev" && t.plugged === !1 ? n("reason.not_connected") : e.type === "ev" && t.is_on && t.current_a != null ? `${n("hint.charging_at")} ${Math.round(t.current_a)} A` : null : null;
  }
  _eta() {
    const t = this.live;
    if (this.load.type !== "ev" || !t || t.plugged === !1) return u;
    if (t.soc != null && t.soc < 100 && !t.battery_kwh && t.eta_full_s == null && t.eta_limit_s == null)
      return d`<span class="eta est"><ha-icon icon="mdi:timer-sand"></ha-icon>${n("eta.need_capacity")}</span>`;
    if (t.eta_full_s == null || !t.eta_full_s) return u;
    const e = !!t.eta_estimated, i = `${e ? "~" : ""}${li(t.eta_full_s)}`, a = e ? ` ${n("eta.at_min")}` : ` (± ${_t(t.eta_full_s)})`;
    return d`<span class="eta ${e ? "est" : ""}"><ha-icon icon="mdi:timer-sand"></ha-icon>${n("eta.full").replace("{d}", i)}${a}</span>`;
  }
  _limitLine() {
    const t = this.live;
    if (this.load.type !== "ev" || !t || t.eta_limit_s == null || t.charge_limit == null || t.plugged === !1) return u;
    const e = `${t.eta_estimated ? "~" : ""}${_t(t.eta_limit_s)}`;
    return d`<div class="limit">${n("eta.limit").replace("{soc}", String(Math.round(t.charge_limit))).replace("{t}", e)}</div>`;
  }
  _wpa() {
    return 230 * (this.load.ev_phases ?? 1);
  }
  /** Current minimum in amps (0 = off), from the pending click or the saved watts. */
  _curAmps() {
    if (this._minAmps !== null) return this._minAmps;
    const t = this.load.ev_min_power_w;
    if (!t) return 0;
    const e = this.load.ev_min_current ?? 6, i = this.load.ev_max_current ?? 16;
    return Math.max(e, Math.min(i, Math.ceil(t / this._wpa() - 1e-9)));
  }
  _step(t, e) {
    t.stopPropagation();
    const i = this.load.ev_min_current ?? 6, a = this.load.ev_max_current ?? 16, s = this._curAmps();
    let o = s + e;
    e > 0 && s === 0 && (o = i), e < 0 && s <= i && (o = 0), o = Math.min(a, Math.max(0, o)), o !== s && (this._minAmps = o, window.clearTimeout(this._minTimer), this._minTimer = window.setTimeout(() => {
      const r = this._minAmps ?? 0;
      this.dispatchEvent(new CustomEvent("set-min-power", {
        detail: { id: this.load.id, power_w: r ? r * this._wpa() : null },
        bubbles: !0,
        composed: !0
      }));
    }, 700));
  }
  updated(t) {
    if (t.has("load") && this._minAmps !== null) {
      const e = this.load.ev_min_power_w;
      (e ? Math.round(e / this._wpa()) : 0) === this._minAmps && (this._minAmps = null);
    }
  }
  _minPowerRow() {
    const t = this._curAmps(), e = this.load.ev_max_current ?? 16, i = t * this._wpa() / 1e3;
    return d`<div class="minp" @click=${(a) => a.stopPropagation()} title=${n("card.min_power_help")}>
      <span class="lbl"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${n("f.ev_min_power_w")}</span></span>
      <span class="stepper">
        <button ?disabled=${t === 0} @click=${(a) => this._step(a, -1)} aria-label="-">−</button>
        <span class="val ${t ? "" : "off"}">${t ? `${i.toLocaleString(void 0, { maximumFractionDigits: 1 })} kW · ${t} A` : n("card.min_power_off")}</span>
        <button ?disabled=${t >= e} @click=${(a) => this._step(a, 1)} aria-label="+">+</button>
      </span>
    </div>`;
  }
  render() {
    const t = this.load, e = this.live, [i, a] = jt((e == null ? void 0 : e.power_w) ?? 0), s = (e == null ? void 0 : e.reason) ?? "idle", o = Pe(s), r = !!(e != null && e.is_on) && ((e == null ? void 0 : e.power_w) ?? 0) > 1, h = t.icon || (t.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler"), l = t.type === "ev" ? (t.ev_max_current ?? 16) * 230 * (t.ev_phases ?? 1) : t.nominal_power_w, c = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null, m = this._hint();
    return d`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${r ? "active" : ""} .icon=${h}></ha-icon>
        <span class="name">${t.name}</span>
        <span class="status ${o}">
          ${o ? d`<ha-icon .icon=${_i(s)}></ha-icon>` : d`<span class="dot"></span>`}
          ${n(`reason.${s}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big"><span class="v">${i}</span><span class="u">${a}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
            ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : u}
            ${this._eta()}
            ${t.enabled ? u : d`<span>${n("reason.disabled")}</span>`}
          </div>
          ${this._limitLine()}
        </div>
        <div class="side">
          <div class="l">${n("load.today")}</div>
          <div class="v">${T((e == null ? void 0 : e.kwh_today) ?? 0, 1)}</div>
          <div class="s">${c === null ? "" : `${Math.round(c * 100)}% ${n("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${l} .height=${76}></sm-sparkline>
        ${m ? d`<span class="hint">${m}</span>` : u}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${Dt()} .value=${t.mode}
          @value-changed=${(p) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: p.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
      </div>
      ${t.type === "ev" && t.mode === "solar" ? this._minPowerRow() : u}
      </div>
    </div>`;
  }
};
Y.styles = [
  D,
  de,
  M`
      :host { display: block; }
      .card { display: flex; flex-direction: column; overflow: hidden; cursor: pointer; height: 100%; }
      .card:hover { border-color: var(--sm-border-strong); }
      .head { display: flex; align-items: center; gap: 10px; padding: 14px 16px 0; }
      .head > ha-icon { --mdc-icon-size: 22px; color: var(--secondary-text-color); }
      .head > ha-icon.active { color: var(--sm-solar); }
      .name { font-size: 16px; font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .prio { font-size: 12px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
      .status { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--secondary-text-color); white-space: nowrap; --mdc-icon-size: 16px; }
      .status.solar { color: var(--sm-solar-text); }
      .status.solar ha-icon { color: var(--sm-solar); }
      .status.grid { color: var(--sm-grid-text); }
      .status.grid ha-icon { color: var(--sm-grid); }
      .status.warn { color: var(--sm-warn-text); }
      .status.warn ha-icon { color: var(--sm-warn); }
      .status.ok { color: var(--sm-ok-text); }
      .status.ok ha-icon { color: var(--sm-ok); }
      .dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; margin: 0 4px; }
      .main { display: flex; align-items: flex-start; padding: 6px 16px 0; gap: 12px; }
      .big { display: flex; align-items: flex-start; gap: 4px; }
      .big .v { font-size: 48px; font-weight: 300; line-height: 1.05; font-variant-numeric: tabular-nums; letter-spacing: -1px; }
      .big .u { font-size: 18px; color: var(--secondary-text-color); margin-top: 6px; }
      .eta { color: var(--primary-text-color); }
      .eta.est { color: var(--secondary-text-color); }
      .limit { font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; }
      .extra { flex-wrap: wrap; row-gap: 2px; }
      .extra { display: flex; gap: 10px; margin-top: 12px; font-size: 13px; color: var(--secondary-text-color); --mdc-icon-size: 14px; }
      .extra span { display: inline-flex; align-items: center; gap: 3px; }
      .side { margin-left: auto; text-align: end; }
      .side .l { font-size: 13px; color: var(--secondary-text-color); }
      .side .v { font-size: 18px; font-weight: 500; font-variant-numeric: tabular-nums; }
      .side .s { font-size: 12px; color: var(--secondary-text-color); }
      .chart { position: relative; margin-top: 6px; }
      .chart .hint { position: absolute; left: 12px; bottom: 8px; }
      .foot { padding: 0 16px 16px; margin-top: auto; }
      .foot .seg-wrap { padding-top: 8px; }
      .minp { display: flex; align-items: center; gap: 8px; padding-top: 10px; font-size: 13px; color: var(--secondary-text-color); --mdc-icon-size: 18px; cursor: default; }
      .minp .lbl { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }
      .minp .lbl span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .stepper { display: inline-flex; align-items: center; border: 1px solid var(--sm-border, var(--divider-color)); border-radius: 18px; overflow: hidden; }
      .stepper button { all: unset; cursor: pointer; width: 32px; height: 30px; display: grid; place-items: center; color: var(--primary-text-color); font-size: 18px; }
      .stepper button:hover:not([disabled]) { background: var(--secondary-background-color); }
      .stepper button[disabled] { opacity: 0.35; cursor: default; }
      .stepper .val { min-width: 92px; text-align: center; color: var(--primary-text-color); font-variant-numeric: tabular-nums; font-weight: 500; }
      .stepper .val.off { color: var(--secondary-text-color); font-weight: 400; }
    `
];
be([
  _({ attribute: !1 })
], Y.prototype, "load", 2);
be([
  _({ attribute: !1 })
], Y.prototype, "live", 2);
be([
  _({ attribute: !1 })
], Y.prototype, "spark", 2);
be([
  _({ type: Number })
], Y.prototype, "priority", 2);
be([
  b()
], Y.prototype, "_minAmps", 2);
Y = be([
  j("sm-load-card")
], Y);
var fi = Object.defineProperty, yi = Object.getOwnPropertyDescriptor, ce = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? yi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && fi(e, i, s), s;
};
let R = class extends w {
  constructor() {
    super(...arguments), this.icon = "", this.heading = "", this.secondary = "", this.value = "", this.clickable = !1, this.variant = "";
  }
  render() {
    return d`<div class="row ${this.clickable ? "click" : ""}" @click=${this._click}>
      ${this.icon ? d`<div class="ic"><ha-icon .icon=${this.icon}></ha-icon></div>` : u}
      <div class="text">
        <div class="h">${this.heading}</div>
        ${this.secondary ? d`<div class="s">${this.secondary}</div>` : u}
      </div>
      ${this.value ? d`<div class="v">${this.value}</div>` : u}
      <slot></slot>
      ${this.clickable ? d`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : u}
    </div>`;
  }
  _click() {
    this.clickable && this.dispatchEvent(new CustomEvent("row-click", { bubbles: !0, composed: !0 }));
  }
};
R.styles = [
  D,
  M`
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
    `
];
ce([
  _()
], R.prototype, "icon", 2);
ce([
  _()
], R.prototype, "heading", 2);
ce([
  _()
], R.prototype, "secondary", 2);
ce([
  _()
], R.prototype, "value", 2);
ce([
  _({ type: Boolean })
], R.prototype, "clickable", 2);
ce([
  _({ reflect: !0 })
], R.prototype, "variant", 2);
R = ce([
  j("sm-list-row")
], R);
var bi = Object.defineProperty, $i = Object.getOwnPropertyDescriptor, he = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $i(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && bi(e, i, s), s;
};
let V = class extends w {
  constructor() {
    super(...arguments), this.loads = [], this.spark = {}, this.editing = !1, this._dragId = null;
  }
  _emit(t, e = {}) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  async _saveOrder(t) {
    this._emit("loads-reordered", { order: t }), await Ot(this.hass, t);
  }
  _move(t, e) {
    const i = this.loads.map((o) => o.id), a = i.indexOf(t), s = a + e;
    s < 0 || s >= i.length || ([i[a], i[s]] = [i[s], i[a]], this._saveOrder(i));
  }
  _drop(t) {
    if (!this._dragId || this._dragId === t) return;
    const e = this.loads.map((i) => i.id).filter((i) => i !== this._dragId);
    e.splice(e.indexOf(t), 0, this._dragId), this._dragId = null, this._saveOrder(e);
  }
  _pills() {
    var s;
    const t = ((s = this.live) == null ? void 0 : s.site) ?? {}, e = t.grid_w, i = e != null && e < 0, a = (t.quarter_projected_w ?? 0) > (t.peak_limit_w ?? 1 / 0) ? "warn" : "grid";
    return d`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${n("site.pv")} <b>${z(t.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${i ? "export" : "grid"} icon=${i ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${n(i ? "site.export" : "site.import")} <b>${z(e == null ? null : Math.abs(e))}</b></span>
      <span class="pill"><ha-icon class="solar" icon="mdi:white-balance-sunny"></ha-icon>${n("site.surplus")} <b>${z(t.surplus_w)}</b></span>
      <span class="pill"><ha-icon icon="mdi:lightning-bolt"></ha-icon>${n("site.managed")} <b>${z(t.managed_w)}</b></span>
      <span class="pill"><ha-icon class=${a} icon="mdi:chart-bell-curve-cumulative"></ha-icon>${n("site.peak_now")}
        <b>${z(t.quarter_average_w)}</b>&nbsp;/ ${z(t.peak_limit_w)}</span>
      <span class="pill"><ha-icon icon="mdi:calendar-month"></ha-icon>${n("site.month_peak")} <b>${z(t.month_peak_w)}</b></span>
      ${t.in_night ? d`<span class="pill"><ha-icon icon="mdi:weather-night"></ha-icon>${n("site.night")}</span>` : u}
    </div>`;
  }
  _editList() {
    return d`<div class="card edit-list">
      <div class="card-head"><h2>${n("loads.title")}</h2></div>
      <div class="card-body muted" style="padding-bottom:8px">${n("loads.hint")}</div>
      ${this.loads.map(
      (t, e) => d`<div class="edit-row ${this._dragId === t.id ? "dragging" : ""}" draggable="true"
          @dragstart=${() => this._dragId = t.id} @dragend=${() => this._dragId = null}
          @dragover=${(i) => i.preventDefault()} @drop=${() => this._drop(t.id)}>
          <ha-icon class="handle" icon="mdi:drag"></ha-icon>
          <sm-list-row .icon=${t.icon || (t.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler")} .heading=${`${e + 1}. ${t.name}`}
            .secondary=${n(`mode.${t.mode}`)}>
            <button class="icon" ?disabled=${e === 0} @click=${() => this._move(t.id, -1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button class="icon" ?disabled=${e === this.loads.length - 1} @click=${() => this._move(t.id, 1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          </sm-list-row>
        </div>`
    )}
    </div>`;
  }
  render() {
    var e;
    const t = ((e = this.live) == null ? void 0 : e.site) ?? {};
    return d`
      ${t.available === !1 ? d`<div class="banner"><ha-icon icon="mdi:alert-outline"></ha-icon>${n("site.no_grid")}</div>` : u}
      ${t.enabled === !1 ? d`<div class="banner"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${n("site.disabled")}</div>` : u}
      ${this._pills()}
      ${this.editing ? this._editList() : this.loads.length ? d`<div class="grid">
              ${this.loads.map((i, a) => {
      var s, o;
      return d`<sm-load-card .load=${i} .live=${(o = (s = this.live) == null ? void 0 : s.loads) == null ? void 0 : o[i.id]} .spark=${this.spark[i.id] ?? []} .priority=${a + 1}></sm-load-card>`;
    })}
              <button class="add" @click=${() => this._emit("add-load")}><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${n("loads.add")}</button>
            </div>` : d`<div class="placeholder"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><p>${n("loads.empty")}</p>
              <button class="filled" @click=${() => this._emit("add-load")}>${n("loads.add")}</button></div>`}
    `;
  }
};
V.styles = [
  D,
  de,
  M`
      :host { display: block; }
      .pills { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; }
      .pills ha-icon.solar { color: var(--sm-solar); }
      .pills ha-icon.grid { color: var(--sm-grid); }
      .pills ha-icon.export { color: var(--sm-export); }
      .pills ha-icon.warn { color: var(--sm-warn); }
      @media (max-width: 600px) {
        .pills { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
      }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); gap: 12px; }
      .add {
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 200px;
        border: 2px dashed var(--sm-border); border-radius: var(--sm-radius); color: var(--secondary-text-color);
        cursor: pointer; background: none; font: inherit; font-size: 15px; --mdc-icon-size: 32px;
      }
      .add:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .banner {
        display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin-bottom: 12px; border-radius: var(--sm-radius);
        background: color-mix(in srgb, var(--sm-warn) 12%, transparent); color: var(--sm-warn-text); font-size: 14px;
        --mdc-icon-size: 20px;
      }
      .edit-list { max-width: 720px; }
      .edit-row { display: flex; align-items: center; border-top: 1px solid var(--sm-border); }
      .edit-row:first-of-type { border-top: none; }
      .edit-row.dragging { opacity: 0.4; }
      .edit-row sm-list-row { flex: 1; min-width: 0; }
      .handle { cursor: grab; color: var(--secondary-text-color); padding: 0 4px 0 12px; --mdc-icon-size: 22px; }
      .placeholder { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px 16px; text-align: center; color: var(--secondary-text-color); }
      .placeholder ha-icon { --mdc-icon-size: 56px; opacity: 0.4; }
    `
];
he([
  _({ attribute: !1 })
], V.prototype, "hass", 2);
he([
  _({ attribute: !1 })
], V.prototype, "loads", 2);
he([
  _({ attribute: !1 })
], V.prototype, "live", 2);
he([
  _({ attribute: !1 })
], V.prototype, "spark", 2);
he([
  _({ type: Boolean })
], V.prototype, "editing", 2);
he([
  b()
], V.prototype, "_dragId", 2);
V = he([
  j("sm-dashboard")
], V);
var xi = Object.defineProperty, wi = Object.getOwnPropertyDescriptor, $e = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && xi(e, i, s), s;
};
let X = class extends w {
  constructor() {
    super(...arguments), this.heading = "", this.saveLabel = "", this.busy = !1, this.canSave = !0, this.error = "";
  }
  render() {
    return d`<div class="scrim" @click=${(t) => t.target === t.currentTarget && this._close()}>
      <div class="dlg" role="dialog" aria-modal="true" aria-label=${this.heading}>
        <h2>${this.heading}</h2>
        <div class="body"><slot></slot>${this.error ? d`<div class="err" role="alert">${this.error}</div>` : u}</div>
        <div class="actions">
          <button class="text" @click=${this._close}>${n("load.cancel")}</button>
          <button class="filled" ?disabled=${this.busy || !this.canSave}
            @click=${() => this.dispatchEvent(new CustomEvent("save"))}>${this.saveLabel || n("load.save")}</button>
        </div>
      </div>
    </div>`;
  }
  _close() {
    this.dispatchEvent(new CustomEvent("closed"));
  }
};
X.styles = [
  D,
  de,
  M`
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
    `
];
$e([
  _()
], X.prototype, "heading", 2);
$e([
  _()
], X.prototype, "saveLabel", 2);
$e([
  _({ type: Boolean })
], X.prototype, "busy", 2);
$e([
  _({ type: Boolean })
], X.prototype, "canSave", 2);
$e([
  _()
], X.prototype, "error", 2);
X = $e([
  j("sm-dialog")
], X);
var ki = Object.defineProperty, Ai = Object.getOwnPropertyDescriptor, tt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ai(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && ki(e, i, s), s;
};
let je = class extends w {
  constructor() {
    super(...arguments), this.checked = !1, this.disabled = !1;
  }
  render() {
    return d`<button role="switch" aria-checked=${this.checked ? "true" : "false"} ?disabled=${this.disabled}
      @click=${(t) => {
      t.stopPropagation(), this.checked = !this.checked, this.dispatchEvent(new CustomEvent("change", { detail: { checked: this.checked }, bubbles: !0, composed: !0 }));
    }}></button>`;
  }
};
je.styles = [
  D,
  M`
      :host { display: inline-flex; flex: none; }
      button {
        position: relative; width: 48px; height: 28px; border-radius: 14px; padding: 0; cursor: pointer;
        border: 2px solid var(--sm-border-strong); background: var(--sm-fill-strong); transition: all 0.15s ease;
      }
      button::after {
        content: ""; position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%;
        background: var(--secondary-text-color); transition: all 0.15s ease;
      }
      :host([checked]) button { background: color-mix(in srgb, var(--primary-color) 35%, transparent); border-color: var(--primary-color); }
      :host([checked]) button::after { left: 22px; top: 2px; width: 20px; height: 20px; background: var(--primary-color); }
      :host([disabled]) button { opacity: 0.4; cursor: default; }
    `
];
tt([
  _({ type: Boolean, reflect: !0 })
], je.prototype, "checked", 2);
tt([
  _({ type: Boolean, reflect: !0 })
], je.prototype, "disabled", 2);
je = tt([
  j("sm-toggle")
], je);
var Si = Object.defineProperty, Ei = Object.getOwnPropertyDescriptor, Te = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ei(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Si(e, i, s), s;
};
let Mi = 0, ne = class extends w {
  constructor() {
    super(...arguments), this.fields = [], this.data = {}, this.prefix = "f";
  }
  _emit(t, e) {
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { key: t, value: e }, bubbles: !0, composed: !0 }));
  }
  _label(t) {
    return t.label ?? n(`${this.prefix}.${t.key}`);
  }
  _entity(t, e) {
    var r, h, l;
    const i = this._label(t);
    if (customElements.get("ha-entity-picker"))
      return d`<ha-entity-picker .hass=${this.hass} .label=${i} .value=${e ?? ""} allow-custom-entity
        .includeDomains=${t.domains} @value-changed=${(c) => this._emit(t.key, c.detail.value || null)}></ha-entity-picker>
        ${t.helper ? d`<span class="help">${t.helper}</span>` : u}`;
    const a = `sm-ents-${++Mi}`, s = e ? (h = (r = this.hass) == null ? void 0 : r.states) == null ? void 0 : h[e] : void 0, o = Object.values(((l = this.hass) == null ? void 0 : l.states) ?? {}).filter((c) => {
      var m;
      return !((m = t.domains) != null && m.length) || t.domains.includes(c.entity_id.split(".")[0]);
    }).sort((c, m) => c.entity_id.localeCompare(m.entity_id));
    return d`<label class="field">${i}
      <input list=${a} .value=${e ?? ""} placeholder="entity_id"
        @change=${(c) => this._emit(t.key, c.target.value.trim() || null)} />
      <datalist id=${a}>${o.map((c) => d`<option value=${c.entity_id}>${c.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${s ? d`<span class="ent-state">${s.attributes.friendly_name ?? ""}: ${s.state} ${s.attributes.unit_of_measurement ?? ""}</span>` : u}
      ${t.helper ? d`<span class="help">${t.helper}</span>` : u}
    </label>`;
  }
  _field(t) {
    const e = this.data;
    if (t.show && !t.show(e)) return u;
    const i = e[t.key], a = this._label(t);
    switch (t.kind) {
      case "entity":
        return d`<div>${this._entity(t, i)}</div>`;
      case "bool":
        return d`<div class="bool"><span class="txt">${a}${t.helper ? d`<span class="help">${t.helper}</span>` : u}</span>
          <sm-toggle .checked=${!!i} @change=${(s) => this._emit(t.key, s.detail.checked)}></sm-toggle></div>`;
      case "select":
        return d`<label class="field">${a}
          <select @change=${(s) => {
          const o = s.target.value;
          this._emit(t.key, typeof i == "number" ? Number(o) : o);
        }}>${(t.options ?? []).map((s) => d`<option value=${s.value} ?selected=${String(i) === s.value}>${s.label}</option>`)}</select>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
      case "number":
        return d`<label class="field">${a}
          <span class="wrap"><input type="number" step=${t.step ?? 1} .value=${i == null ? "" : String(i)}
            @change=${(s) => {
          const o = s.target.value;
          this._emit(t.key, o === "" ? t.nullable ? null : 0 : Number(o));
        }} />${t.unit ? d`<span class="unit">${t.unit}</span>` : u}</span>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
      case "time":
        return d`<label class="field">${a}
          <input type="time" .value=${i ?? ""} @change=${(s) => this._emit(t.key, s.target.value)} /></label>`;
      default:
        return d`<label class="field">${a}
          <input type="text" .value=${i ?? ""} @change=${(s) => this._emit(t.key, s.target.value)} />
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
    }
  }
  render() {
    return d`${this.fields.map((t) => this._field(t))}`;
  }
};
ne.styles = [
  D,
  M`
      :host { display: flex; flex-direction: column; gap: 14px; }
      label.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--secondary-text-color); }
      .wrap { position: relative; display: flex; align-items: center; }
      input, select {
        font: inherit; font-size: 15px; color: var(--primary-text-color); width: 100%; box-sizing: border-box;
        height: 48px; padding: 0 14px; border-radius: var(--sm-radius-sm); border: 1px solid var(--sm-border-strong);
        background: var(--sm-surface); outline: none;
      }
      input:focus, select:focus { border-color: var(--primary-color); box-shadow: inset 0 0 0 1px var(--primary-color); }
      .wrap input { padding-right: 56px; }
      .unit { position: absolute; right: 36px; color: var(--secondary-text-color); font-size: 14px; pointer-events: none; }
      .help { font-size: 12px; color: var(--secondary-text-color); line-height: 1.4; }
      .ent-state { font-size: 12px; color: var(--secondary-text-color); }
      .bool { display: flex; align-items: center; gap: 16px; min-height: 48px; }
      .bool .txt { flex: 1; font-size: 15px; color: var(--primary-text-color); }
      .bool .txt .help { display: block; margin-top: 2px; }
      ha-entity-picker { display: block; }
    `
];
Te([
  _({ attribute: !1 })
], ne.prototype, "hass", 2);
Te([
  _({ attribute: !1 })
], ne.prototype, "fields", 2);
Te([
  _({ attribute: !1 })
], ne.prototype, "data", 2);
Te([
  _()
], ne.prototype, "prefix", 2);
ne = Te([
  j("sm-form")
], ne);
var Pi = Object.defineProperty, Oi = Object.getOwnPropertyDescriptor, I = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Oi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Pi(e, i, s), s;
};
const E = (t) => t.type === "ev", W = (t) => E(t) && t.ev_driver === "tesla_ble_proxy", Ie = (t) => di(t ?? 0), Ae = (t, e) => {
  if (!e) return n("detail.not_set");
  const i = t.states[e];
  return i ? `${i.attributes.friendly_name ?? e}` : e;
}, zi = (t, e) => {
  const i = e ? t.states[e] : void 0;
  return i ? i.state === "on" ? n("detail.on") : i.state === "off" ? n("detail.off") : i.state : "";
}, Ge = (t, e) => {
  if (!e) return "";
  const i = t.states[e];
  return i ? `${i.state}${i.attributes.unit_of_measurement ? " " + i.attributes.unit_of_measurement : ""}` : "?";
};
let C = class extends w {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this.count = 1, this._dialog = null, this._draft = {}, this._busy = !1, this._error = "", this._confirmDelete = !1;
  }
  get _sections() {
    const t = this.hass;
    return [
      {
        title: n("detail.device"),
        rows: [
          {
            icon: "mdi:power-socket-eu",
            title: n("f.switch_entity"),
            show: (e) => !E(e),
            secondary: (e) => Ae(t, e.switch_entity),
            value: (e) => zi(t, e.switch_entity),
            fields: [{ key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"] }]
          },
          {
            icon: "mdi:flash",
            title: n("f.nominal_power_w"),
            show: (e) => !E(e),
            secondary: () => n("detail.nominal_help"),
            value: (e) => z(e.nominal_power_w),
            fields: [{ key: "nominal_power_w", kind: "number", unit: "W", step: 50 }, { key: "full_threshold_w", kind: "number", unit: "W" }]
          },
          {
            icon: "mdi:ev-plug-type2",
            title: n("f.ev_driver"),
            show: E,
            secondary: (e) => W(e) ? `${e.ev_proxy_url} · ${e.ev_vin || "VIN?"}` : Ae(t, e.ev_charge_switch_entity),
            value: (e) => n(`f.ev_driver.${e.ev_driver}`),
            fields: [
              { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"].map((e) => ({ value: e, label: n(`f.ev_driver.${e}`) })) },
              { key: "ev_proxy_url", kind: "text", show: W, helper: n("f.ev_proxy_url.help") },
              { key: "ev_vin", kind: "text", show: W },
              { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (e) => !W(e) },
              { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !W(e) },
              { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: (e) => !W(e) }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: n("detail.power_sensor"),
            secondary: (e) => Ae(t, e.power_entity),
            value: (e) => Ge(t, e.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: n("f.power_entity.help") }]
          },
          {
            icon: "mdi:thermometer",
            title: n("detail.temp_sensor"),
            show: (e) => !E(e),
            secondary: (e) => Ae(t, e.temperature_entity),
            value: (e) => e.max_temperature != null ? `${Ge(t, e.temperature_entity)} · max ${e.max_temperature} °C` : Ge(t, e.temperature_entity),
            fields: [
              { key: "temperature_entity", kind: "entity", domains: ["sensor"] },
              { key: "max_temperature", kind: "number", nullable: !0, unit: "°C" }
            ]
          },
          {
            icon: "mdi:battery-charging",
            title: n("f.ev_soc_entity"),
            show: E,
            secondary: (e) => e.ev_soc_entity ? Ae(t, e.ev_soc_entity) : W(e) ? n("detail.from_proxy") : n("detail.not_set"),
            value: (e, i) => (i == null ? void 0 : i.soc) != null ? `${Math.round(i.soc)}%` : "",
            fields: [
              { key: "ev_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "ev_charge_limit_entity", kind: "entity", domains: ["sensor", "number", "input_number"], show: (e) => !W(e) }
            ]
          }
        ]
      },
      {
        title: n("f.section.ev"),
        show: E,
        rows: [
          {
            icon: "mdi:current-ac",
            title: n("detail.current"),
            secondary: (e) => `${e.ev_phases} ${n("detail.phase")} · ${n("detail.step")} ${e.ev_current_step_interval_s} s`,
            value: (e) => `${e.ev_min_current}–${e.ev_max_current} A`,
            fields: [
              { key: "ev_phases", kind: "select", options: [{ value: "1", label: "1" }, { value: "3", label: "3" }] },
              { key: "ev_min_current", kind: "number", unit: "A" },
              { key: "ev_max_current", kind: "number", unit: "A" },
              { key: "ev_current_step_interval_s", kind: "number", unit: "s" }
            ]
          },
          {
            icon: "mdi:car-battery",
            title: n("f.ev_battery_kwh"),
            secondary: (e, i) => i != null && i.battery_kwh_learned ? n("detail.battery_learned").replace("{kwh}", `${i.battery_kwh_learned} kWh`) : (i == null ? void 0 : i.battery_kwh_source) === "car" && i.battery_kwh ? n("detail.battery_car").replace("{kwh}", `${i.battery_kwh} kWh`) : n("detail.battery_learning"),
            value: (e, i) => e.ev_battery_kwh ? `${e.ev_battery_kwh} kWh` : i != null && i.battery_kwh_learned ? `${i.battery_kwh_learned} kWh (${n("detail.learned")})` : "–",
            fields: [{ key: "ev_battery_kwh", kind: "number", nullable: !0, unit: "kWh" }]
          },
          {
            icon: "mdi:battery-alert-variant-outline",
            title: n("f.ev_min_soc"),
            secondary: () => n("detail.min_soc_help"),
            value: (e) => e.ev_min_soc != null ? `${e.ev_min_soc}%` : n("detail.off"),
            fields: [{ key: "ev_min_soc", kind: "number", nullable: !0, unit: "%" }]
          }
        ]
      },
      {
        title: n("detail.behaviour"),
        rows: [
          {
            icon: "mdi:timer-play-outline",
            title: n("detail.start_stop"),
            secondary: (e) => n("detail.start_stop_sub").replace("{start}", Ie(e.start_delay_s)).replace("{stop}", Ie(e.stop_delay_s)),
            value: (e) => `+${e.start_margin_w} W`,
            fields: [
              { key: "start_delay_s", kind: "number", unit: "s" },
              { key: "stop_delay_s", kind: "number", unit: "s" },
              { key: "start_margin_w", kind: "number", unit: "W" }
            ]
          },
          {
            icon: "mdi:timer-lock-outline",
            title: n("detail.min_times"),
            secondary: (e) => `${n("detail.on")} ${Ie(e.min_on_s)} · ${n("detail.off_short")} ${Ie(e.min_off_s)}`,
            fields: [
              { key: "min_on_s", kind: "number", unit: "s" },
              { key: "min_off_s", kind: "number", unit: "s" }
            ]
          },
          {
            icon: "mdi:transmission-tower-import",
            title: n("f.allowed_import_w"),
            secondary: () => n("detail.allowed_import_help"),
            value: (e) => z(e.allowed_import_w),
            fields: [{ key: "allowed_import_w", kind: "number", unit: "W", step: 50 }]
          },
          { icon: "mdi:chart-bell-curve-cumulative", title: n("f.peak_shed"), secondary: () => n("detail.peak_shed_help"), toggle: "peak_shed" }
        ]
      },
      {
        title: n("f.section.night"),
        meta: (e) => e.mode === "solar_night" ? "" : n("detail.night_inactive"),
        rows: [
          {
            icon: "mdi:weather-night",
            title: n("detail.night_when"),
            secondary: (e) => E(e) && (e.ev_soc_entity || W(e)) ? n("detail.night_when_soc").replace("{soc}", String(e.ev_target_soc)) : e.night_min_temperature != null ? n("detail.night_when_temp").replace("{t}", String(e.night_min_temperature)) : n("detail.night_when_kwh").replace("{kwh}", String(e.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (e) => !(E(e) && (e.ev_soc_entity || W(e))) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: !0, show: (e) => !E(e) },
              { key: "ev_target_soc", kind: "number", unit: "%", show: E }
            ]
          },
          {
            icon: "mdi:battery-arrow-up-outline",
            title: n("detail.night_amount"),
            show: (e) => !E(e),
            value: (e) => e.night_target_kwh ? T(e.night_target_kwh, 1) : n("detail.until_full"),
            fields: [{ key: "night_target_kwh", kind: "number", unit: "kWh", step: 0.1 }]
          },
          {
            icon: "mdi:weather-sunny-alert",
            title: n("detail.forecast_skip"),
            secondary: () => n("detail.forecast_skip_help"),
            value: (e) => e.night_skip_forecast_kwh ? `> ${e.night_skip_forecast_kwh} kWh` : n("detail.off"),
            fields: [{ key: "night_skip_forecast_kwh", kind: "number", unit: "kWh", nullable: !0, step: 0.5 }]
          }
        ]
      },
      {
        title: n("f.section.legionella"),
        show: (e) => !E(e),
        rows: [
          { icon: "mdi:bacteria-outline", title: n("f.legionella_enabled"), secondary: () => n("f.legionella.hint"), toggle: "legionella_enabled" },
          {
            icon: "mdi:thermometer-high",
            title: n("detail.legionella_rule"),
            show: (e) => !!e.legionella_enabled,
            value: (e) => `${e.legionella_temperature} °C / ${e.legionella_interval_days} d`,
            fields: [
              { key: "legionella_temperature", kind: "number", unit: "°C" },
              { key: "legionella_interval_days", kind: "number", unit: n("detail.days") }
            ]
          }
        ]
      }
    ];
  }
  _openDialog(t, e) {
    this._draft = { ...this.load }, this._error = "", this._dialog = { title: t, fields: e };
  }
  async _save(t) {
    this._busy = !0, this._error = "";
    try {
      const e = await Pt(this.hass, { ...this.load, ...t });
      this.dispatchEvent(new CustomEvent("load-saved", { detail: { load: e.load, renamed: e.load.name !== this.load.name }, bubbles: !0, composed: !0 })), this._dialog = null;
    } catch (e) {
      this._error = (e == null ? void 0 : e.message) ?? String(e);
    } finally {
      this._busy = !1;
    }
  }
  async _delete() {
    if (!this._confirmDelete) {
      this._confirmDelete = !0;
      return;
    }
    await si(this.hass, this.load.id), this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _move(t) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta: t }, bubbles: !0, composed: !0 }));
  }
  _hero() {
    const t = this.load, e = this.live, [i, a] = jt((e == null ? void 0 : e.power_w) ?? 0), s = (e == null ? void 0 : e.reason) ?? "idle", o = Pe(s), r = t.icon || (E(t) ? "mdi:ev-station" : "mdi:water-boiler"), h = E(t) ? t.ev_max_current * 230 * t.ev_phases : t.nominal_power_w, l = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null;
    return d`<div class="card hero">
      <div class="hero-head">
        <div class="hero-ic ${e != null && e.is_on && ((e == null ? void 0 : e.power_w) ?? 0) > 1 ? "active" : ""}"><ha-icon .icon=${r}></ha-icon></div>
        <div>
          <div class="hero-name">${t.name}
            <button class="icon" title=${n("load.edit")} @click=${() => this._openDialog(n("detail.name_icon"), [
      { key: "name", kind: "text" },
      { key: "icon", kind: "text", helper: n("f.icon.help") }
    ])}><ha-icon icon="mdi:pencil"></ha-icon></button>
          </div>
          <div class="hero-sub"><span class="status ${o}">${n(`reason.${s}`)}</span> · ${n(`type.${t.type}`)}</div>
        </div>
      </div>
      <div class="big"><span class="v">${i}</span><span class="u">${a}</span></div>
      <sm-sparkline .points=${this.spark} .max=${h} .height=${90} .label=${n("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
        ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : u}
        ${(e == null ? void 0 : e.current_a) != null && E(t) ? d`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(e.current_a)} A</span>` : u}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${T((e == null ? void 0 : e.kwh_today) ?? 0, 1)} ${n("load.today")}</span>
        ${l !== null ? d`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(l * 100)}% ${n("load.from_solar")}</span>` : u}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${n("f.mode")}</div>
        <sm-segmented .options=${Dt()} .value=${t.mode}
          @value-changed=${(c) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: c.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
        <div class="d">${n(`mode.${t.mode}.desc`)}</div>
      </div>
    </div>`;
  }
  _controlCard() {
    const t = this.load;
    return d`<div class="card list">
      <sm-list-row icon="mdi:power" variant="primary" .heading=${n("f.enabled")} .secondary=${n("detail.enabled_help")}>
        <sm-toggle .checked=${t.enabled} @change=${(e) => this._save({ enabled: e.detail.checked })}></sm-toggle>
      </sm-list-row>
      <sm-list-row icon="mdi:sort-numeric-ascending" .heading=${n("detail.priority")}
        .secondary=${n("detail.priority_sub").replace("{n}", String(this.priority)).replace("{c}", String(this.count))}>
        <button class="icon" ?disabled=${this.priority <= 1} @click=${() => this._move(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon" ?disabled=${this.priority >= this.count} @click=${() => this._move(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
      </sm-list-row>
      <sm-list-row icon="mdi:chart-line" .heading=${n("load.analytics")} .secondary=${n("detail.analytics_sub")} clickable
        @row-click=${() => this.dispatchEvent(new CustomEvent("open-analytics", { detail: { id: t.id }, bubbles: !0, composed: !0 }))}></sm-list-row>
      <sm-list-row icon="mdi:delete-outline" variant="danger" .heading=${this._confirmDelete ? n("load.delete_confirm") : n("load.delete")}
        clickable @row-click=${this._delete}></sm-list-row>
    </div>`;
  }
  _section(t) {
    const e = this.load;
    if (t.show && !t.show(e)) return u;
    const i = t.rows.filter((a) => !a.show || a.show(e));
    return d`<div class="card list">
      <div class="card-head"><h2>${t.title}</h2>${t.meta && t.meta(e) ? d`<span class="meta">${t.meta(e)}</span>` : u}</div>
      ${i.map(
      (a) => {
        var s, o, r;
        return a.toggle ? d`<sm-list-row .icon=${a.icon} .heading=${a.title} .secondary=${((s = a.secondary) == null ? void 0 : s.call(a, e, this.live)) ?? ""}>
              <sm-toggle .checked=${!!e[a.toggle]} @change=${(h) => this._save({ [a.toggle]: h.detail.checked })}></sm-toggle>
            </sm-list-row>` : d`<sm-list-row .icon=${a.icon} .heading=${a.title} .secondary=${((o = a.secondary) == null ? void 0 : o.call(a, e, this.live)) ?? ""} .value=${((r = a.value) == null ? void 0 : r.call(a, e, this.live)) ?? ""}
              clickable @row-click=${() => this._openDialog(a.title, a.fields ?? [])}></sm-list-row>`;
      }
    )}
    </div>`;
  }
  render() {
    const t = this._sections;
    return d`
      <div class="layout">
        <div class="col">${this._hero()}${this._controlCard()}</div>
        <div class="col">${t.map((e) => this._section(e))}</div>
      </div>
      ${this._dialog ? d`<sm-dialog .heading=${this._dialog.title} .busy=${this._busy} .error=${this._error}
            @closed=${() => this._dialog = null} @save=${() => this._save(this._draft)}>
            <sm-form .hass=${this.hass} .fields=${this._dialog.fields} .data=${this._draft}
              @value-changed=${(e) => this._draft = { ...this._draft, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : u}
    `;
  }
};
C.styles = [
  D,
  de,
  M`
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
    `
];
I([
  _({ attribute: !1 })
], C.prototype, "hass", 2);
I([
  _({ attribute: !1 })
], C.prototype, "load", 2);
I([
  _({ attribute: !1 })
], C.prototype, "live", 2);
I([
  _({ attribute: !1 })
], C.prototype, "spark", 2);
I([
  _({ type: Number })
], C.prototype, "priority", 2);
I([
  _({ type: Number })
], C.prototype, "count", 2);
I([
  b()
], C.prototype, "_dialog", 2);
I([
  b()
], C.prototype, "_draft", 2);
I([
  b()
], C.prototype, "_busy", 2);
I([
  b()
], C.prototype, "_error", 2);
I([
  b()
], C.prototype, "_confirmDelete", 2);
C = I([
  j("sm-load-detail")
], C);
var Ci = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, xe = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ji(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ci(e, i, s), s;
};
const vt = (t, e) => e.map((i) => ({ value: i, label: n(`s.${t}.${i}`) })), ft = (t, e) => {
  var i;
  return e ? ((i = t.states[e]) == null ? void 0 : i.attributes.friendly_name) ?? e : n("detail.not_set");
}, Di = () => [
  {
    id: "general",
    icon: "mdi:cog-outline",
    fields: [{ key: "enabled", kind: "bool", helper: n("s.enabled.help") }],
    summary: (t) => t.enabled ? n("s.enabled") : n("site.disabled")
  },
  {
    id: "meter",
    icon: "mdi:meter-electric-outline",
    fields: [
      { key: "grid_mode", kind: "select", options: vt("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (t) => t.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: vt("grid_sign", ["import_positive", "export_positive"]), show: (t) => t.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (t) => t.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (t) => t.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" }
    ],
    summary: (t, e) => ft(e, t.grid_mode === "split" ? t.grid_import_entity : t.grid_power_entity)
  },
  {
    id: "pv",
    icon: "mdi:solar-power-variant",
    fields: [
      { key: "pv_power_entity", kind: "entity", domains: ["sensor"] },
      { key: "pv_forecast_today_entity", kind: "entity", domains: ["sensor"], helper: n("s.forecast.help") },
      { key: "pv_forecast_tomorrow_entity", kind: "entity", domains: ["sensor"] }
    ],
    summary: (t, e) => ft(e, t.pv_power_entity)
  },
  {
    id: "peak",
    icon: "mdi:chart-bell-curve-cumulative",
    fields: [
      { key: "peak_guard_enabled", kind: "bool", helper: n("s.peak.help") },
      { key: "peak_limit_w", kind: "number", unit: "W", step: 100, show: (t) => t.peak_guard_enabled },
      { key: "peak_margin_w", kind: "number", unit: "W", step: 50, show: (t) => t.peak_guard_enabled },
      { key: "peak_follow_month_max", kind: "bool", helper: n("s.peak_follow.help"), show: (t) => t.peak_guard_enabled }
    ],
    summary: (t) => t.peak_guard_enabled ? `${(t.peak_limit_w / 1e3).toFixed(1)} kW` : n("detail.off")
  },
  {
    id: "night",
    icon: "mdi:weather-night",
    fields: [
      { key: "night_start", kind: "time" },
      { key: "night_end", kind: "time" }
    ],
    summary: (t) => `${t.night_start} – ${t.night_end}`
  },
  {
    id: "prices",
    icon: "mdi:currency-eur",
    fields: [
      { key: "price_import", kind: "number", unit: "€/kWh", step: 0.01 },
      { key: "price_export", kind: "number", unit: "€/kWh", step: 0.01 }
    ],
    summary: (t) => `€ ${t.price_import} / € ${t.price_export}`
  }
];
let J = class extends w {
  constructor() {
    super(...arguments), this.narrow = !1, this._cat = null, this._draft = {};
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings }), this._cat === null && !this.narrow && (this._cat = "meter");
  }
  async _change(t, e) {
    this._draft = { ...this._draft, [t]: e }, this.dispatchEvent(new CustomEvent("saving", { bubbles: !0, composed: !0 }));
    try {
      await ii(this.hass, { [t]: e }), this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
    } catch (i) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: (i == null ? void 0 : i.message) ?? String(i) }, bubbles: !0, composed: !0 }));
    }
  }
  render() {
    const t = Di(), e = t.find((s) => s.id === this._cat), i = !this.narrow || !e, a = !!e;
    return d`<div class="md ${this.narrow ? "single" : ""}">
      ${i ? d`<div class="card nav">
            ${t.map(
      (s) => d`<sm-list-row class=${s.id === this._cat && !this.narrow ? "sel" : ""} .icon=${s.icon} .heading=${n(`s.cat.${s.id}`)}
                .secondary=${s.summary(this._draft, this.hass)} clickable @row-click=${() => this._cat = s.id}></sm-list-row>`
    )}
          </div>` : ""}
      ${a ? d`<div class="card detail">
            <div class="card-head">
              ${this.narrow ? d`<button class="icon" @click=${() => this._cat = null}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
              <h2>${n(`s.cat.${e.id}`)}</h2>
            </div>
            <div class="card-body">
              <p class="desc">${n(`s.cat.${e.id}.desc`)}</p>
              <sm-form .hass=${this.hass} prefix="s" .fields=${e.fields} .data=${this._draft}
                @value-changed=${(s) => this._change(s.detail.key, s.detail.value)}></sm-form>
            </div>
          </div>` : ""}
    </div>`;
  }
};
J.styles = [
  D,
  de,
  M`
      :host { display: block; }
      .md { display: grid; grid-template-columns: minmax(0, 360px) minmax(0, 1fr); gap: 16px; align-items: start; }
      .md.single { grid-template-columns: 1fr; max-width: 720px; }
      .nav { padding: 8px 0; }
      sm-list-row.sel { background: var(--sm-fill-primary); }
      .detail .card-body { padding-top: 4px; }
      .back { display: flex; align-items: center; gap: 4px; }
      .desc { font-size: 14px; color: var(--secondary-text-color); margin: 0 0 16px; line-height: 1.5; }
    `
];
xe([
  _({ attribute: !1 })
], J.prototype, "hass", 2);
xe([
  _({ attribute: !1 })
], J.prototype, "settings", 2);
xe([
  _({ type: Boolean })
], J.prototype, "narrow", 2);
xe([
  b()
], J.prototype, "_cat", 2);
xe([
  b()
], J.prototype, "_draft", 2);
J = xe([
  j("sm-settings")
], J);
var Li = Object.defineProperty, Ni = Object.getOwnPropertyDescriptor, F = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ni(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Li(e, i, s), s;
};
const q = 1e3, x = 64, B = 16, yt = 18, Ke = 14, bt = 12, Ti = (t) => {
  const e = Math.pow(10, Math.floor(Math.log10(t))), i = t / e;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 2.5 ? 2.5 : i <= 5 ? 5 : 10) * e;
}, Ye = (t, e) => e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
let ye = class extends w {
  constructor() {
    super(...arguments), this.x = [], this.panels = [], this._hover = null;
  }
  render() {
    var N, k;
    const t = this.x.length;
    if (t < 2) return d`<slot></slot>`;
    const e = this.x[0], i = this.x[t - 1], a = (v) => x + (v - e) / Math.max(1, i - e) * (q - x - B);
    let s = 0;
    const o = [], r = [];
    for (const v of this.panels) {
      const $ = s + yt, pe = v.height;
      r.push([$, pe]), o.push(A`<text class="ptitle" x="${x}" y="${s + 12}">${v.title}</text>`), o.push(A`<rect class="plot" x="${x}" y="${$}" width="${q - x - B}" height="${pe}" rx="2"></rect>`), (N = v.series) != null && N.length && o.push(this._series(v, $, pe, a)), (k = v.bands) != null && k.length && v.bands.forEach((ue, ee) => {
        const Z = $ + 4 + ee * (bt + 4);
        o.push(A`<text class="axis" x="${x - 8}" y="${Z + 10}" text-anchor="end">${ue.label}</text>`), ue.segments.forEach(
          (U) => o.push(A`<rect x="${a(U.from)}" y="${Z}" width="${Math.max(1, a(U.to) - a(U.from))}" height="${bt}" fill="${U.color}" rx="2"><title>${U.title}</title></rect>`)
        );
      }), s = $ + pe + Ke;
    }
    const h = i - e, l = h <= 1.5 * 86400 ? 3 * 3600 : h <= 8 * 86400 ? 86400 : 7 * 86400, c = [], m = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
    for (let v = Math.ceil((e - m) / l) * l + m; v <= i; v += l) c.push(v);
    const p = (v) => {
      const $ = new Date(v * 1e3);
      return l < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { weekday: "short", day: "numeric" });
    }, f = s - Ke + 16, g = f + 6;
    c.forEach((v) => {
      o.push(A`<line class="gridline" x1="${a(v)}" x2="${a(v)}" y1="${yt}" y2="${s - Ke}" stroke-dasharray="2 4"></line>`), o.push(A`<text class="axis" x="${a(v)}" y="${f}" text-anchor="middle">${p(v)}</text>`);
    });
    const y = this._hover;
    y !== null && r.forEach(
      ([v, $]) => o.push(A`<line x1="${a(this.x[y])}" x2="${a(this.x[y])}" y1="${v}" y2="${v + $}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`)
    );
    const L = (v) => {
      const $ = v.currentTarget.getBoundingClientRect(), pe = (v.clientX - $.left) / $.width * q, ue = e + (pe - x) / (q - x - B) * (i - e);
      let ee = 0, Z = t - 1;
      for (; Z - ee > 1; ) {
        const U = ee + Z >> 1;
        this.x[U] < ue ? ee = U : Z = U;
      }
      this._hover = Math.abs(this.x[ee] - ue) < Math.abs(this.x[Z] - ue) ? ee : Z;
    }, O = this.panels.flatMap((v) => (v.series ?? []).map(($) => ({ ...$, unit: $.unit ?? v.unit })));
    return d`
      <svg viewBox="0 0 ${q} ${g}" @mousemove=${L} @mouseleave=${() => this._hover = null}>${o}</svg>
      ${y !== null ? d`<div class="tip" style="${a(this.x[y]) > q / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[y] * 1e3).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${O.map((v) => {
      const $ = v.values[y];
      return $ == null ? u : d`<div><span class="dot" style="background:${v.color}"></span>${v.label}: ${Ye($, v.unit)}</div>`;
    })}
          </div>` : u}
      <div class="legend">
        ${O.filter((v) => v.legend !== !1).map((v) => d`<span><span class="dot" style="background:${v.color}"></span>${v.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }
  _series(t, e, i, a) {
    const s = this.x.length, o = {}, r = [], h = [];
    for (const g of t.series)
      if (g.kind === "area" && g.stack) {
        const y = o[g.stack] ?? new Array(s).fill(0), L = y.map((O, N) => O + Math.max(0, g.values[N] ?? 0));
        h.push(y), r.push(L), o[g.stack] = L;
      } else
        h.push(new Array(s).fill(0)), r.push(g.values.map((y) => y ?? 0));
    let l = -1 / 0, c = 1 / 0;
    t.series.forEach((g, y) => {
      for (let L = 0; L < s; L++) {
        const O = g.values[L];
        O != null && (l = Math.max(l, g.kind === "area" ? r[y][L] : O), c = Math.min(c, g.kind === "area" ? 0 : O));
      }
    }), l === -1 / 0 && (l = 1, c = 0), t.zero !== !1 && (c = Math.min(c, 0), l = Math.max(l, 0));
    const m = Ti((l - c) / 3 || 1);
    l = Math.ceil((l + (l - c) * 0.04) / m) * m, c = Math.floor(c / m) * m;
    const p = (g) => e + i - (g - c) / (l - c) * i, f = [];
    for (let g = c; g <= l + m / 2; g += m)
      f.push(A`<line class="gridline" x1="${x}" x2="${q - B}" y1="${p(g)}" y2="${p(g)}"></line>
        <text class="axis" x="${x - 8}" y="${p(g) + 4}" text-anchor="end">${Ye(g, t.unit)}</text>`);
    return c < 0 && f.push(A`<line x1="${x}" x2="${q - B}" y1="${p(0)}" y2="${p(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`), t.series.forEach((g, y) => {
      if (g.kind === "area") {
        let N = "";
        for (let k = 0; k < s; k++) N += `${k ? "L" : "M"}${a(this.x[k]).toFixed(1)},${p(r[y][k]).toFixed(1)}`;
        for (let k = s - 1; k >= 0; k--) N += `L${a(this.x[k]).toFixed(1)},${p(h[y][k]).toFixed(1)}`;
        f.push(A`<path d="${N}Z" fill="${g.color}" fill-opacity="0.45" stroke="${g.color}" stroke-width="1"></path>`);
        return;
      }
      let L = "", O = !1;
      for (let N = 0; N < s; N++) {
        const k = g.values[N];
        if (k == null) {
          O = !1;
          continue;
        }
        const v = a(this.x[N]).toFixed(1), $ = p(k).toFixed(1);
        g.kind === "step" && O ? L += `H${v}V${$}` : L += `${O ? "L" : "M"}${v},${$}`, O = !0;
      }
      f.push(A`<path d="${L}" fill="none" stroke="${g.color}" stroke-width="1.8" stroke-dasharray="${g.dashed ? "5 4" : ""}"></path>`);
    }), f;
  }
};
ye.styles = [
  D,
  M`
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
    `
];
F([
  _({ attribute: !1 })
], ye.prototype, "x", 2);
F([
  _({ attribute: !1 })
], ye.prototype, "panels", 2);
F([
  b()
], ye.prototype, "_hover", 2);
ye = F([
  j("sm-chart")
], ye);
let le = class extends w {
  constructor() {
    super(...arguments), this.bars = [], this.height = 180, this.unit = "kWh", this.limit = null;
  }
  render() {
    if (!this.bars.length) return d`<slot></slot>`;
    const t = this.height, e = t - 26, i = (l) => l.parts.reduce((c, m) => c + m.value, 0), a = Math.max(this.limit ?? 0, ...this.bars.map(i), 1e-3) * 1.1, s = 640, o = (s - x - B) / this.bars.length, r = (l) => e - l / a * e, h = Math.ceil(this.bars.length / 10);
    return d`<svg viewBox="0 0 ${s} ${t}">
      <rect class="plot" x="${x}" y="0" width="${s - x - B}" height="${e}" rx="2"></rect>
      ${[0, 1, 2, 3].map((l) => {
      const c = a / 1.1 * (l / 3);
      return A`<line class="gridline" x1="${x}" x2="${s - B}" y1="${r(c)}" y2="${r(c)}"></line>
          <text class="axis" x="${x - 8}" y="${r(c) + 4}" text-anchor="end">${Ye(c, this.unit)}</text>`;
    })}
      ${this.bars.map((l, c) => {
      let m = 0;
      const p = x + c * o + o * 0.18;
      return A`${l.parts.map((f) => {
        const g = r(m);
        m += f.value;
        const y = r(m);
        return A`<rect x="${p}" width="${o * 0.64}" y="${y}" height="${Math.max(0, g - y)}" fill="${f.color}" rx="2"><title>${l.label}: ${f.title}</title></rect>`;
      })}${c % h === 0 ? A`<text class="axis" x="${p + o * 0.32}" y="${t - 6}" text-anchor="middle">${l.label}</text>` : u}`;
    })}
      ${this.limit ? A`<line x1="${x}" x2="${s - B}" y1="${r(this.limit)}" y2="${r(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : u}
    </svg>`;
  }
};
le.styles = [
  D,
  M`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `
];
F([
  _({ attribute: !1 })
], le.prototype, "bars", 2);
F([
  _({ type: Number })
], le.prototype, "height", 2);
F([
  _()
], le.prototype, "unit", 2);
F([
  _({ type: Number })
], le.prototype, "limit", 2);
le = F([
  j("sm-bars")
], le);
var Ii = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, Q = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Wi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ii(e, i, s), s;
};
const Se = "var(--sm-solar)", _e = "var(--sm-grid)", $t = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)"
}, Hi = (t) => {
  const e = /* @__PURE__ */ new Date(), i = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() / 1e3, a = e.getTime() / 1e3;
  switch (t) {
    case "yesterday":
      return [i - 86400, i];
    case "7d":
      return [i - 6 * 86400, a];
    case "30d":
      return [i - 29 * 86400, a];
    case "month":
      return [new Date(e.getFullYear(), e.getMonth(), 1).getTime() / 1e3, a];
    default:
      return [i, a];
  }
};
let H = class extends w {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this.peakLimit = null, this._range = "today", this._data = null, this._loading = !1, this._loadedFor = "";
  }
  updated(t) {
    const e = `${this.loadId}|${this._range}`;
    (t.has("loadId") || t.has("hass")) && this.hass && e !== this._loadedFor && this._fetch();
  }
  async _fetch() {
    this._loadedFor = `${this.loadId}|${this._range}`, this._loading = !0;
    const [t, e] = Hi(this._range);
    try {
      this._data = await zt(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _downsample(t) {
    if (t.length <= 1200) return t;
    const i = Math.ceil(t.length / 1200), a = [];
    for (let s = 0; s < t.length; s += i) {
      const o = t.slice(s, s + i), r = (c) => {
        const m = o.map(c).filter((p) => p != null);
        return m.length ? m.reduce((p, f) => p + f, 0) / m.length : null;
      }, h = o[o.length - 1], l = {};
      for (const c of Object.keys(h[3]))
        l[c] = [r((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[0];
        }), r((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[1];
        }), h[3][c][2], o.some((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[3];
        }) ? 1 : 0, r((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[4];
        })];
      a.push([o[0][0], r((c) => c[1]), r((c) => c[2]), l]);
    }
    return a;
  }
  _band(t, e, i) {
    var o;
    const a = [];
    let s = null;
    for (let r = 0; r < t.length; r++) {
      const h = t[r][3][e], l = h ? h[2] : null, c = l ? Pe(l) : "", p = l && (h[3] || l === "peak_guard") && c ? $t[c] : null, f = l ? n(`reason.${l}`) : "", g = ((o = t[r + 1]) == null ? void 0 : o[0]) ?? t[r][0] + 60;
      p && s && s.color === p && s.title === f ? s.to = g : (s && a.push(s), s = p ? { from: t[r][0], to: g, color: p, title: f } : null);
    }
    return s && a.push(s), { label: i, segments: a };
  }
  _history() {
    var a, s;
    const t = this._downsample(((s = (a = this._data) == null ? void 0 : a.timeline) == null ? void 0 : s.rows) ?? []);
    if (t.length < 2) return d`<div class="empty">${n("a.no_data")}</div>`;
    const e = t.map((o) => o[0]), i = [];
    if (this.loadId) {
      const o = this.loadId, r = this.loads.find((l) => l.id === o), h = [
        { label: n("a.from_solar"), color: Se, kind: "area", stack: "l", values: t.map((l) => {
          var c;
          return ((c = l[3][o]) == null ? void 0 : c[1]) ?? 0;
        }) },
        { label: n("a.from_grid"), color: _e, kind: "area", stack: "l", values: t.map((l) => {
          var c, m;
          return Math.max(0, (((c = l[3][o]) == null ? void 0 : c[0]) ?? 0) - (((m = l[3][o]) == null ? void 0 : m[1]) ?? 0));
        }) },
        { label: n("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: t.map((l) => l[1]) }
      ];
      if (i.push({ title: `${n("a.power")} (W)`, unit: "W", height: 220, series: h }), t.some((l) => {
        var c;
        return ((c = l[3][o]) == null ? void 0 : c[4]) != null;
      })) {
        const l = (r == null ? void 0 : r.type) === "ev";
        i.push({
          title: l ? `${n("a.soc")} (%)` : `${n("a.temperature")} (°C)`,
          unit: l ? "%" : "°C",
          height: 90,
          zero: !1,
          series: [{ label: n(l ? "a.soc" : "a.temperature"), color: "var(--sm-err)", kind: "line", values: t.map((c) => {
            var m;
            return ((m = c[3][o]) == null ? void 0 : m[4]) ?? null;
          }) }]
        });
      }
      i.push({ title: n("a.why"), unit: "", height: 22, bands: [this._band(t, o, "")] });
    } else {
      const o = this.loads.map((r, h) => ({
        label: r.name,
        color: me[h % me.length],
        kind: "area",
        stack: "loads",
        values: t.map((l) => {
          var c;
          return ((c = l[3][r.id]) == null ? void 0 : c[0]) ?? 0;
        })
      }));
      o.push({ label: n("a.pv"), color: Se, kind: "line", values: t.map((r) => r[1]) }), i.push({ title: `${n("a.power")} (W)`, unit: "W", height: 220, series: o }), i.push({
        title: `${n("site.grid")} (W) · + ${n("a.import").toLowerCase()} / − ${n("a.export").toLowerCase()}`,
        unit: "W",
        height: 90,
        series: [{ label: n("site.grid"), color: _e, kind: "line", values: t.map((r) => r[2]) }]
      }), i.push({
        title: n("a.why"),
        unit: "",
        height: this.loads.length * 16 + 6,
        bands: this.loads.map((r) => this._band(t, r.id, r.name.length > 9 ? r.name.slice(0, 8) + "…" : r.name))
      });
    }
    return d`<sm-chart .x=${e} .panels=${i}></sm-chart>`;
  }
  _tile(t, e, i) {
    return d`<div class="tile"><div class="v">${t}</div><div class="l">${e}</div>
      ${i ? d`<div class="bar"><div style="width:${i[0] * 100}%;background:${Se}"></div><div style="width:${i[1] * 100}%;background:${_e}"></div></div>` : u}</div>`;
  }
  _summary() {
    var i;
    const t = (i = this._data) == null ? void 0 : i.summary;
    if (!t) return u;
    if (this.loadId) {
      const a = t.loads[this.loadId];
      if (!a) return d`<div class="empty">${n("a.no_data")}</div>`;
      const s = a.solar_share ?? 0, o = Object.entries(a.reasons ?? {}).filter(([r]) => Pe(r)).sort((r, h) => h[1] - r[1]);
      return d`<div class="tiles">
          ${this._tile(T(a.kwh), n("a.energy"), a.kwh > 0 ? [s, 1 - s] : void 0)}
          ${this._tile(ke(a.solar_share), n("a.solar_share"))}
          ${this._tile(T(a.grid_kwh), n("a.grid"))}
          ${this._tile(qe(a.runtime_s), n("a.runtime"))}
          ${this._tile(String(a.starts), n("a.starts"))}
          ${this._tile(gt(a.saving), n("a.saving"))}
        </div>
        ${o.length ? d`<div class="why">${o.map(([r, h]) => d`<span class="pill"><span class="swatch" style="background:${$t[Pe(r)]}"></span>${n(`reason.${r}`)} <b>${qe(h)}</b></span>`)}</div>` : u}`;
    }
    const e = t.house;
    return d`<div class="tiles">
        ${this._tile(T(e.pv_kwh, 1), n("a.pv"))}
        ${this._tile(ke(e.self_consumption), n("a.self_consumption"))}
        ${this._tile(ke(e.self_sufficiency), n("a.self_sufficiency"))}
        ${this._tile(T(e.import_kwh, 1), n("a.import"))}
        ${this._tile(T(e.export_kwh, 1), n("a.export"))}
        ${this._tile(z(e.peak_w), n("a.peak"))}
      </div>
      <table>
        <tr><th>${n("a.distribution")}</th><th class="num">${n("a.energy")}</th><th class="num">${n("a.solar_share")}</th><th class="num">${n("a.runtime")}</th><th class="num">${n("a.saving")}</th></tr>
        ${this.loads.map((a, s) => {
      const o = t.loads[a.id];
      return o ? d`<tr><td><span class="swatch" style="background:${me[s % me.length]}"></span>${a.name}</td>
            <td class="num">${T(o.kwh)}</td><td class="num">${ke(o.solar_share)}</td><td class="num">${qe(o.runtime_s)}</td><td class="num">${gt(o.saving)}</td></tr>` : u;
    })}
      </table>`;
  }
  _daily() {
    var a;
    const t = ((a = this._data) == null ? void 0 : a.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return u;
    const i = e.map((s) => {
      const o = `${Number(s.slice(8))}/${Number(s.slice(5, 7))}`;
      if (this.loadId) {
        const r = t[s].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label: o, parts: [
          { value: r.solar_kwh, color: Se, title: `${n("a.solar")} ${T(r.solar_kwh)}` },
          { value: Math.max(0, r.kwh - r.solar_kwh), color: _e, title: `${n("a.grid")} ${T(r.kwh - r.solar_kwh)}` }
        ] };
      }
      return { label: o, parts: this.loads.map((r, h) => {
        var c;
        const l = ((c = t[s].loads[r.id]) == null ? void 0 : c.kwh) ?? 0;
        return { value: l, color: me[h % me.length], title: `${r.name} ${T(l)}` };
      }) };
    });
    return d`<div class="card"><div class="card-head"><h2>${n("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${i}></sm-bars></div></div>`;
  }
  _rhythm() {
    var i, a;
    if (!this.loadId) return u;
    const t = ((a = (i = this._data) == null ? void 0 : i.rhythm) == null ? void 0 : a[this.loadId]) ?? [];
    if (!t.some((s) => s > 0)) return u;
    const e = t.map((s, o) => ({ label: `${o}u`, parts: [{ value: s, color: Se, title: z(s) }] }));
    return d`<div class="card"><div class="card-head"><h2>${n("a.rhythm")}</h2><span class="meta">${n("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div></div>`;
  }
  _quarters() {
    var s;
    if (this.loadId) return u;
    const t = ((s = this._data) == null ? void 0 : s.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return u;
    const i = this.peakLimit, a = e.length === 1 ? t[e[0]].map(([o, r]) => ({
      label: new Date(o * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: r, color: i && r > i ? "var(--sm-err)" : _e, title: z(r) }]
    })) : e.map((o) => {
      const r = Math.max(...t[o].map((h) => h[1]));
      return { label: `${Number(o.slice(8))}/${Number(o.slice(5, 7))}`, parts: [{ value: r, color: i && r > i ? "var(--sm-err)" : _e, title: z(r) }] };
    });
    return d`<div class="card"><div class="card-head"><h2>${n("a.quarters")}</h2><span class="meta">${n("site.peak_limit")} ${z(i)}</span></div>
      <div class="card-body"><sm-bars .bars=${a} unit="W" .limit=${i}></sm-bars></div></div>`;
  }
  _sessions() {
    var a;
    const t = this.loadId ? this.loads.find((s) => s.id === this.loadId) : null;
    if (!t || t.type !== "ev") return u;
    const e = [...((a = this._data) == null ? void 0 : a.sessions) ?? []].reverse();
    if (!e.length) return u;
    const i = (s) => s ? new Date(s * 1e3).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : n("a.ongoing");
    return d`<div class="card"><div class="card-head"><h2>${n("a.sessions")}</h2><span class="meta">${e.length}</span></div>
      <table>
        <tr><th>${n("a.start")}</th><th>${n("a.end")}</th><th class="num">${n("a.energy")}</th><th class="num">${n("a.solar_share")}</th><th class="num">${n("a.soc")}</th></tr>
        ${e.map((s) => d`<tr><td>${i(s.start)}</td><td>${i(s.end)}</td><td class="num">${T(s.kwh)}</td>
          <td class="num">${ke(s.kwh > 0 ? s.solar_kwh / s.kwh : null)}</td><td class="num">${s.soc_start ?? "–"}% → ${s.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }
  render() {
    const t = [{ value: "", label: n("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((i) => ({ value: i.id, label: i.name, icon: i.icon || (i.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler") }))
    ), e = ["today", "yesterday", "7d", "30d", "month"];
    return d`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${t} .value=${this.loadId ?? ""}
          @value-changed=${(i) => {
      this.loadId = i.detail.value || null, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: !0, composed: !0 }));
    }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${e.map((i) => ({ value: i, label: n(`a.range.${i}`) }))} .value=${this._range}
          @value-changed=${(i) => {
      this._range = i.detail.value, this._fetch();
    }}></sm-segmented>
      </div>
      <div class="card"><div class="card-head"><h2>${n("a.summary")}</h2>${this._loading ? d`<span class="meta">…</span>` : u}</div>${this._summary()}</div>
      <div class="card"><div class="card-head"><h2>${n("a.timeline")}</h2></div><div class="card-body">${this._history()}</div></div>
      ${this._sessions()}
      <div class="two">${this._daily()}${this._rhythm()}${this._quarters()}</div>
    `;
  }
};
H.styles = [
  D,
  de,
  M`
      :host { display: flex; flex-direction: column; gap: 16px; }
      .toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
      .toolbar sm-segmented.loads { flex: 1 1 420px; max-width: 760px; }
      .toolbar sm-segmented.range { flex: 0 1 420px; }
      .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; padding: 0 16px 16px; }
      .tile { background: var(--sm-fill); border-radius: var(--sm-radius-sm); padding: 12px; }
      .tile .v { font-size: 22px; font-weight: 400; font-variant-numeric: tabular-nums; }
      .tile .l { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
      .tile .bar { height: 6px; border-radius: 3px; overflow: hidden; display: flex; background: var(--sm-fill-strong); margin-top: 8px; }
      .why { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 16px; }
      table { border-collapse: collapse; width: 100%; font-size: 14px; }
      th, td { text-align: left; padding: 10px 16px; border-top: 1px solid var(--sm-border); }
      th { font-weight: 500; font-size: 12px; color: var(--secondary-text-color); border-top: none; }
      td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
      .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
      .empty { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); }
      .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr)); gap: 16px; }
    `
];
Q([
  _({ attribute: !1 })
], H.prototype, "hass", 2);
Q([
  _({ attribute: !1 })
], H.prototype, "loads", 2);
Q([
  _()
], H.prototype, "loadId", 2);
Q([
  _({ type: Number })
], H.prototype, "peakLimit", 2);
Q([
  b()
], H.prototype, "_range", 2);
Q([
  b()
], H.prototype, "_data", 2);
Q([
  b()
], H.prototype, "_loading", 2);
H = Q([
  j("sm-analytics")
], H);
var Ui = Object.defineProperty, Bi = Object.getOwnPropertyDescriptor, P = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bi(e, i) : e, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ui(e, i, s), s;
};
const Ri = 6 * 3600;
let S = class extends w {
  constructor() {
    super(...arguments), this.narrow = !1, this._tab = "loads", this._detail = null, this._editing = !1, this._analyticsLoad = null, this._spark = {}, this._adding = null, this._addBusy = !1, this._addError = "", this._save = "", this._error = "", this._started = !1;
  }
  updated(t) {
    t.has("hass") && this.hass && !this._started && this._init();
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && !this._started && this._init();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._unsub) == null || t.call(this), this._unsub = void 0, window.clearInterval(this._sparkTimer), this._started = !1;
  }
  async _init() {
    this._started = !0, ni(this.hass.language);
    try {
      await this._reload(), this._unsub = await ut(this.hass, (t) => this._live = t), this._loadSpark(), this._sparkTimer = window.setInterval(() => this._loadSpark(), 6e4);
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t), this._started = !1;
    }
  }
  async _reload() {
    this._config = await ti(this.hass), this._live = this._config.live;
  }
  async _loadSpark() {
    const t = Date.now() / 1e3;
    try {
      const e = await zt(this.hass, t - Ri, t, null), i = {};
      for (const a of e.timeline.rows)
        for (const [s, o] of Object.entries(a[3]))
          (i[s] ?? (i[s] = [])).push([a[0], o[0] ?? 0, o[1] ?? 0]);
      this._spark = i;
    } catch {
    }
  }
  async _resubscribe() {
    var t;
    (t = this._unsub) == null || t.call(this), this._unsub = void 0;
    for (let e = 0; e < 20; e++) {
      await new Promise((i) => setTimeout(i, 500));
      try {
        await this._reload(), this._unsub = await ut(this.hass, (i) => this._live = i);
        return;
      } catch {
      }
    }
  }
  _flashSave(t) {
    this._save = t, window.clearTimeout(this._saveTimer), t === "saved" && (this._saveTimer = window.setTimeout(() => this._save = "", 2500));
  }
  _setOrder(t) {
    const e = this._config, i = new Map(e.loads.map((a) => [a.id, a]));
    this._config = { ...e, loads: t.map((a) => i.get(a)).filter(Boolean) };
  }
  async _setMode(t, e) {
    const i = this._config;
    this._config = { ...i, loads: i.loads.map((a) => a.id === t ? { ...a, mode: e } : a) }, this._flashSave("saving"), await ai(this.hass, t, e), this._flashSave("saved");
  }
  async _setMinPower(t, e) {
    const i = this._config;
    this._config = { ...i, loads: i.loads.map((a) => a.id === t ? { ...a, ev_min_power_w: e } : a) }, this._flashSave("saving"), await ri(this.hass, t, e), this._flashSave("saved");
  }
  async _moveLoad(t, e) {
    const i = this._config.loads.map((o) => o.id), a = i.indexOf(t), s = a + e;
    s < 0 || s >= i.length || ([i[a], i[s]] = [i[s], i[a]], this._setOrder(i), await Ot(this.hass, i));
  }
  _addFields() {
    const t = (i) => i.type === "ev", e = (i) => t(i) && i.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev"].map((i) => ({ value: i, label: n(`type.${i}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: (i) => !t(i) },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: (i) => !t(i) },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((i) => ({ value: i, label: n(`f.ev_driver.${i}`) })), show: t },
      { key: "ev_proxy_url", kind: "text", show: e, helper: n("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: e },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (i) => t(i) && !e(i) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (i) => t(i) && !e(i) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: n("f.power_entity.help") },
      { key: "mode", kind: "select", options: ["solar", "solar_night", "on", "off"].map((i) => ({ value: i, label: n(`mode.${i}`) })) }
    ];
  }
  _startAdd() {
    this._addError = "", this._adding = { ...this._config.defaults.load, id: "", name: "", ev_driver: "tesla_ble_proxy" };
  }
  async _saveAdd() {
    const t = { ...this._adding };
    t.type === "ev" && (!t.icon || t.icon === "mdi:water-boiler") && (t.icon = "mdi:ev-station"), this._addBusy = !0;
    try {
      const e = await Pt(this.hass, t);
      this._adding = null, await this._resubscribe(), this._detail = e.load.id;
    } catch (e) {
      this._addError = (e == null ? void 0 : e.message) ?? String(e);
    } finally {
      this._addBusy = !1;
    }
  }
  _menuButton() {
    return this.narrow && customElements.get("ha-menu-button") ? d`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : u;
  }
  _saveIndicator() {
    if (!this._save) return u;
    const t = this._save === "saving" ? "mdi:cloud-upload-outline" : this._save === "saved" ? "mdi:check-circle-outline" : "mdi:alert-circle-outline";
    return d`<span class="save ${this._save}"><ha-icon .icon=${t}></ha-icon>${n(`save.${this._save}`)}</span>`;
  }
  _toolbar() {
    const t = this._config, e = this._detail ? t == null ? void 0 : t.loads.find((i) => i.id === this._detail) : void 0;
    return e ? d`<div class="toolbar">
        <button class="icon" @click=${() => this._detail = null} title=${n("nav.back")}><ha-icon icon="mdi:arrow-left"></ha-icon></button>
        <span class="title pad">${e.name}</span>
        ${this._saveIndicator()}
        <button class="icon" title=${n("load.analytics")} @click=${() => {
      this._analyticsLoad = e.id, this._detail = null, this._tab = "analytics";
    }}>
          <ha-icon icon="mdi:chart-line"></ha-icon></button>
      </div>` : d`<div class="toolbar">
        ${this._menuButton()}
        <span class="title ${this.narrow ? "" : "pad"}">SolarMind</span>
        ${this._saveIndicator()}
        ${this._tab === "loads" && (t != null && t.loads.length) ? d`<button class="icon" title=${this._editing ? n("nav.done") : n("nav.reorder")} @click=${() => this._editing = !this._editing}>
              <ha-icon .icon=${this._editing ? "mdi:check" : "mdi:pencil"}></ha-icon></button>` : u}
      </div>
      <nav class="tabs">
        ${["loads", "analytics", "settings"].map(
      (i) => d`<button class="tab ${this._tab === i ? "on" : ""}" @click=${() => {
        this._tab = i, this._editing = !1;
      }}>${n(`tab.${i}`)}</button>`
    )}
      </nav>`;
  }
  _content(t) {
    var i, a, s, o;
    const e = this._detail ? t.loads.findIndex((r) => r.id === this._detail) : -1;
    if (e >= 0) {
      const r = { ...t.defaults.load, ...t.loads[e] };
      return d`<sm-load-detail .hass=${this.hass} .load=${r} .live=${(a = (i = this._live) == null ? void 0 : i.loads) == null ? void 0 : a[r.id]} .spark=${this._spark[r.id] ?? []}
        .priority=${e + 1} .count=${t.loads.length}
        @set-mode=${(h) => this._setMode(h.detail.id, h.detail.mode)}
        @set-min-power=${(h) => this._setMinPower(h.detail.id, h.detail.power_w)}
        @move-load=${(h) => this._moveLoad(h.detail.id, h.detail.delta)}
        @open-analytics=${(h) => {
        this._analyticsLoad = h.detail.id, this._detail = null, this._tab = "analytics";
      }}
        @load-saved=${async (h) => {
        this._flashSave("saved"), h.detail.renamed ? await this._resubscribe() : await this._reload();
      }}
        @load-deleted=${async () => {
        this._detail = null, await this._resubscribe();
      }}></sm-load-detail>`;
    }
    switch (this._tab) {
      case "analytics":
        return d`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad} .peakLimit=${((o = (s = this._live) == null ? void 0 : s.site) == null ? void 0 : o.peak_limit_w) ?? null}
          @analytics-load=${(r) => this._analyticsLoad = r.detail.id}></sm-analytics>`;
      case "settings":
        return d`<sm-settings .hass=${this.hass} .settings=${t.settings} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(r) => {
          this._config = { ...t, settings: { ...t.settings, ...r.detail.settings } }, this._flashSave("saved");
        }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return d`<sm-dashboard .hass=${this.hass} .loads=${t.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(r) => this._detail = r.detail.id}
          @set-mode=${(r) => this._setMode(r.detail.id, r.detail.mode)}
        @set-min-power=${(r) => this._setMinPower(r.detail.id, r.detail.power_w)}
          @loads-reordered=${(r) => this._setOrder(r.detail.order)}
          @add-load=${this._startAdd}></sm-dashboard>`;
    }
  }
  render() {
    if (this._error) return d`<div class="err">${this._error}</div>`;
    const t = this._config;
    return d`
      ${this._toolbar()}
      <main>${t ? this._content(t) : u}</main>
      ${this._adding ? d`<sm-dialog .heading=${n("loads.add")} .saveLabel=${n("load.add_save")} .busy=${this._addBusy} .error=${this._addError}
            .canSave=${!!this._adding.name} @closed=${() => this._adding = null} @save=${this._saveAdd}>
            <sm-form .hass=${this.hass} .fields=${this._addFields()} .data=${this._adding}
              @value-changed=${(e) => this._adding = { ...this._adding, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : u}
    `;
  }
};
S.styles = [
  D,
  de,
  M`
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
    `
];
P([
  _({ attribute: !1 })
], S.prototype, "hass", 2);
P([
  _({ type: Boolean })
], S.prototype, "narrow", 2);
P([
  b()
], S.prototype, "_config", 2);
P([
  b()
], S.prototype, "_live", 2);
P([
  b()
], S.prototype, "_tab", 2);
P([
  b()
], S.prototype, "_detail", 2);
P([
  b()
], S.prototype, "_editing", 2);
P([
  b()
], S.prototype, "_analyticsLoad", 2);
P([
  b()
], S.prototype, "_spark", 2);
P([
  b()
], S.prototype, "_adding", 2);
P([
  b()
], S.prototype, "_addBusy", 2);
P([
  b()
], S.prototype, "_addError", 2);
P([
  b()
], S.prototype, "_save", 2);
P([
  b()
], S.prototype, "_error", 2);
S = P([
  j("solarmind-panel")
], S);
export {
  S as SolarMindPanel
};
