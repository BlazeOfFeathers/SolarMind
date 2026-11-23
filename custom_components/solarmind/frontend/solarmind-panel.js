/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = globalThis, Xe = He.ShadowRoot && (He.ShadyCSS === void 0 || He.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Je = Symbol(), st = /* @__PURE__ */ new WeakMap();
let xt = class {
  constructor(e, s, a) {
    if (this._$cssResult$ = !0, a !== Je) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Xe && e === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (e = st.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && st.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (t) => new xt(typeof t == "string" ? t : t + "", void 0, Je), P = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((a, i, r) => a + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[r + 1], t[0]);
  return new xt(s, t, Je);
}, Nt = (t, e) => {
  if (Xe) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const a = document.createElement("style"), i = He.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = s.cssText, t.appendChild(a);
  }
}, it = Xe ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const a of e.cssRules) s += a.cssText;
  return Dt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Lt, getOwnPropertyDescriptor: It, getOwnPropertyNames: Ht, getOwnPropertySymbols: Wt, getPrototypeOf: Ut } = Object, K = globalThis, at = K.trustedTypes, Bt = at ? at.emptyScript : "", Re = K.reactiveElementPolyfillSupport, Se = (t, e) => t, We = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Bt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, Qe = (t, e) => !Tt(t, e), ot = { attribute: !0, type: String, converter: We, reflect: !1, useDefault: !1, hasChanged: Qe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), K.litPropertyMetadata ?? (K.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let _e = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = ot) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(e, a, s);
      i !== void 0 && Lt(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, s, a) {
    const { get: i, set: r } = It(this.prototype, e) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: i, set(o) {
      const h = i == null ? void 0 : i.call(this);
      r == null || r.call(this, o), this.requestUpdate(e, h, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Se("elementProperties"))) return;
    const e = Ut(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Se("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Se("properties"))) {
      const s = this.properties, a = [...Ht(s), ...Wt(s)];
      for (const i of a) this.createProperty(i, s[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [a, i] of s) this.elementProperties.set(a, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, a] of this.elementProperties) {
      const i = this._$Eu(s, a);
      i !== void 0 && this._$Eh.set(i, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const i of a) s.unshift(it(i));
    } else e !== void 0 && s.push(it(e));
    return s;
  }
  static _$Eu(e, s) {
    const a = s.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((s) => s(this));
  }
  addController(e) {
    var s;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((s = e.hostConnected) == null || s.call(e));
  }
  removeController(e) {
    var s;
    (s = this._$EO) == null || s.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const a of s.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Nt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((s) => {
      var a;
      return (a = s.hostConnected) == null ? void 0 : a.call(s);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var a;
      return (a = s.hostDisconnected) == null ? void 0 : a.call(s);
    });
  }
  attributeChangedCallback(e, s, a) {
    this._$AK(e, a);
  }
  _$ET(e, s) {
    var r;
    const a = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, a);
    if (i !== void 0 && a.reflect === !0) {
      const o = (((r = a.converter) == null ? void 0 : r.toAttribute) !== void 0 ? a.converter : We).toAttribute(s, a.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var r, o;
    const a = this.constructor, i = a._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const h = a.getPropertyOptions(i), l = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((r = h.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? h.converter : We;
      this._$Em = i;
      const c = l.fromAttribute(s, h.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, s, a, i = !1, r) {
    var o;
    if (e !== void 0) {
      const h = this.constructor;
      if (i === !1 && (r = this[e]), a ?? (a = h.getPropertyOptions(e)), !((a.hasChanged ?? Qe)(r, s) || a.useDefault && a.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(h._$Eu(e, a)))) return;
      this.C(e, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: a, reflect: i, wrapped: r }, o) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? s ?? this[e]), r !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (s = void 0), this._$AL.set(e, s)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: h } = o, l = this[r];
        h !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (a = this._$EO) == null || a.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
      }), this.update(s)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((a) => {
      var i;
      return (i = a.hostUpdated) == null ? void 0 : i.call(a);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((s) => this._$ET(s, this[s]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
_e.elementStyles = [], _e.shadowRootOptions = { mode: "open" }, _e[Se("elementProperties")] = /* @__PURE__ */ new Map(), _e[Se("finalized")] = /* @__PURE__ */ new Map(), Re == null || Re({ ReactiveElement: _e }), (K.reactiveElementVersions ?? (K.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ee = globalThis, rt = (t) => t, Ue = Ee.trustedTypes, nt = Ue ? Ue.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, wt = "$lit$", G = `lit$${Math.random().toFixed(9).slice(2)}$`, kt = "?" + G, Rt = `<${kt}>`, ie = document, Oe = () => ie.createComment(""), Me = (t) => t === null || typeof t != "object" && typeof t != "function", et = Array.isArray, Vt = (t) => et(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Ve = `[ 	
\f\r]`, xe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lt = /-->/g, dt = />/g, ee = RegExp(`>|${Ve}(?:([^\\s"'>=/]+)(${Ve}*=${Ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, ht = /"/g, At = /^(?:script|style|textarea|title)$/i, St = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = St(1), A = St(2), ve = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), te = ie.createTreeWalker(ie, 129);
function Et(t, e) {
  if (!et(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(e) : e;
}
const Ft = (t, e) => {
  const s = t.length - 1, a = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = xe;
  for (let h = 0; h < s; h++) {
    const l = t[h];
    let c, m, p = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, m = o.exec(l), m !== null); ) f = o.lastIndex, o === xe ? m[1] === "!--" ? o = lt : m[1] !== void 0 ? o = dt : m[2] !== void 0 ? (At.test(m[2]) && (i = RegExp("</" + m[2], "g")), o = ee) : m[3] !== void 0 && (o = ee) : o === ee ? m[0] === ">" ? (o = i ?? xe, p = -1) : m[1] === void 0 ? p = -2 : (p = o.lastIndex - m[2].length, c = m[1], o = m[3] === void 0 ? ee : m[3] === '"' ? ht : ct) : o === ht || o === ct ? o = ee : o === lt || o === dt ? o = xe : (o = ee, i = void 0);
    const _ = o === ee && t[h + 1].startsWith("/>") ? " " : "";
    r += o === xe ? l + Rt : p >= 0 ? (a.push(c), l.slice(0, p) + wt + l.slice(p) + G + _) : l + G + (p === -2 ? h : _);
  }
  return [Et(t, r + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class ze {
  constructor({ strings: e, _$litType$: s }, a) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const h = e.length - 1, l = this.parts, [c, m] = Ft(e, s);
    if (this.el = ze.createElement(c, a), te.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = te.nextNode()) !== null && l.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(wt)) {
          const f = m[o++], _ = i.getAttribute(p).split(G), y = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: y[2], strings: _, ctor: y[1] === "." ? qt : y[1] === "?" ? Gt : y[1] === "@" ? Kt : Be }), i.removeAttribute(p);
        } else p.startsWith(G) && (l.push({ type: 6, index: r }), i.removeAttribute(p));
        if (At.test(i.tagName)) {
          const p = i.textContent.split(G), f = p.length - 1;
          if (f > 0) {
            i.textContent = Ue ? Ue.emptyScript : "";
            for (let _ = 0; _ < f; _++) i.append(p[_], Oe()), te.nextNode(), l.push({ type: 2, index: ++r });
            i.append(p[f], Oe());
          }
        }
      } else if (i.nodeType === 8) if (i.data === kt) l.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(G, p + 1)) !== -1; ) l.push({ type: 7, index: r }), p += G.length - 1;
      }
      r++;
    }
  }
  static createElement(e, s) {
    const a = ie.createElement("template");
    return a.innerHTML = e, a;
  }
}
function fe(t, e, s = t, a) {
  var o, h;
  if (e === ve) return e;
  let i = a !== void 0 ? (o = s._$Co) == null ? void 0 : o[a] : s._$Cl;
  const r = Me(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((h = i == null ? void 0 : i._$AO) == null || h.call(i, !1), r === void 0 ? i = void 0 : (i = new r(t), i._$AT(t, s, a)), a !== void 0 ? (s._$Co ?? (s._$Co = []))[a] = i : s._$Cl = i), i !== void 0 && (e = fe(t, i._$AS(t, e.values), i, a)), e;
}
class Zt {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: a } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? ie).importNode(s, !0);
    te.currentNode = i;
    let r = te.nextNode(), o = 0, h = 0, l = a[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new je(r, r.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (c = new Yt(r, this, e)), this._$AV.push(c), l = a[++h];
      }
      o !== (l == null ? void 0 : l.index) && (r = te.nextNode(), o++);
    }
    return te.currentNode = ie, i;
  }
  p(e) {
    let s = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, s), s += a.strings.length - 2) : a._$AI(e[s])), s++;
  }
}
class je {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, a, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = a, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = fe(this, e, s), Me(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== ve && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Vt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && Me(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ie.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: s, _$litType$: a } = e, i = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = ze.createElement(Et(a.h, a.h[0]), this.options)), a);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(s);
    else {
      const o = new Zt(i, this), h = o.u(this.options);
      o.p(s), this.T(h), this._$AH = o;
    }
  }
  _$AC(e) {
    let s = pt.get(e.strings);
    return s === void 0 && pt.set(e.strings, s = new ze(e)), s;
  }
  k(e) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, i = 0;
    for (const r of e) i === s.length ? s.push(a = new je(this.O(Oe()), this.O(Oe()), this, this.options)) : a = s[i], a._$AI(r), i++;
    i < s.length && (this._$AR(a && a._$AB.nextSibling, i), s.length = i);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, s); e !== this._$AB; ) {
      const i = rt(e).nextSibling;
      rt(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Be {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, a, i, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = s, this._$AM = i, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = u;
  }
  _$AI(e, s = this, a, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) e = fe(this, e, s, 0), o = !Me(e) || e !== this._$AH && e !== ve, o && (this._$AH = e);
    else {
      const h = e;
      let l, c;
      for (e = r[0], l = 0; l < r.length - 1; l++) c = fe(this, h[a + l], s, l), c === ve && (c = this._$AH[l]), o || (o = !Me(c) || c !== this._$AH[l]), c === u ? e = u : e !== u && (e += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class qt extends Be {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class Gt extends Be {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class Kt extends Be {
  constructor(e, s, a, i, r) {
    super(e, s, a, i, r), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = fe(this, e, s, 0) ?? u) === ve) return;
    const a = this._$AH, i = e === u && a !== u || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, r = e !== u && (a === u || i);
    i && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Yt {
  constructor(e, s, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    fe(this, e);
  }
}
const Fe = Ee.litHtmlPolyfillSupport;
Fe == null || Fe(ze, je), (Ee.litHtmlVersions ?? (Ee.litHtmlVersions = [])).push("3.3.3");
const Xt = (t, e, s) => {
  const a = (s == null ? void 0 : s.renderBefore) ?? e;
  let i = a._$litPart$;
  if (i === void 0) {
    const r = (s == null ? void 0 : s.renderBefore) ?? null;
    a._$litPart$ = i = new je(e.insertBefore(Oe(), r), r, void 0, s ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis;
class w extends _e {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const e = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = e.firstChild), e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Xt(s, this.renderRoot, this.renderOptions);
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
var $t;
w._$litElement$ = !0, w.finalized = !0, ($t = se.litElementHydrateSupport) == null || $t.call(se, { LitElement: w });
const Ze = se.litElementPolyfillSupport;
Ze == null || Ze({ LitElement: w });
(se.litElementVersions ?? (se.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = { attribute: !0, type: String, converter: We, reflect: !1, hasChanged: Qe }, Qt = (t = Jt, e, s) => {
  const { kind: a, metadata: i } = s;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(s.name, t), a === "accessor") {
    const { name: o } = s;
    return { set(h) {
      const l = e.get.call(this);
      e.set.call(this, h), this.requestUpdate(o, l, t, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, t, h), h;
    } };
  }
  if (a === "setter") {
    const { name: o } = s;
    return function(h) {
      const l = this[o];
      e.call(this, h), this.requestUpdate(o, l, t, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function g(t) {
  return (e, s) => typeof s == "object" ? Qt(t, e, s) : ((a, i, r) => {
    const o = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, a), o ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return g({ ...t, state: !0, attribute: !1 });
}
const es = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), ts = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), Pt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), ss = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Ot = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), is = (t, e, s) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: s }), Mt = (t, e, s, a) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: s, load_id: a }), ut = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), mt = {
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
}, as = {
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
let zt = "nl";
const os = (t) => {
  zt = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, n = (t) => (zt === "en" ? as[t] ?? mt[t] : mt[t]) ?? t, D = P`
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
`, de = P`
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
`, z = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, Ct = (t) => t == null || Number.isNaN(t) ? ["–", ""] : Math.abs(t) >= 1e3 ? [(t / 1e3).toFixed(2), "kW"] : [String(Math.round(t)), "W"], L = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, we = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, qe = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), s = Math.round(t % 3600 / 60);
  return e ? `${e} u ${s} min` : `${s} min`;
}, gt = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`, rs = (t) => t == null ? "–" : t >= 3600 ? `${Math.round(t / 3600 * 10) / 10} u` : t >= 60 ? `${Math.round(t / 60 * 10) / 10} min` : `${t} s`;
var ns = Object.defineProperty, ls = Object.getOwnPropertyDescriptor, De = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? ls(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && ns(e, s, i), i;
};
let ae = class extends w {
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
ae.styles = [
  D,
  P`
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
De([
  g({ attribute: !1 })
], ae.prototype, "options", 2);
De([
  g({ attribute: !1 })
], ae.prototype, "value", 2);
De([
  g({ reflect: !0 })
], ae.prototype, "size", 2);
De([
  g({ type: Boolean, reflect: !0 })
], ae.prototype, "wrap", 2);
ae = De([
  j("sm-segmented")
], ae);
var ds = Object.defineProperty, cs = Object.getOwnPropertyDescriptor, Ne = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? cs(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && ds(e, s, i), i;
};
let oe = class extends w {
  constructor() {
    super(...arguments), this.points = [], this.max = 0, this.height = 72, this.label = "";
  }
  render() {
    const t = this.points, e = 400, s = this.height;
    if (t.length < 2) return d`<svg viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" style="height:${s}px"></svg>`;
    const a = t[0][0], i = t[t.length - 1][0], r = Math.max(this.max, ...t.map((p) => p[1]), 1) * 1.1, o = (p) => (p - a) / Math.max(1, i - a) * e, h = (p) => s - p / r * (s - 4), l = (p) => t.map((f, _) => `${_ ? "L" : "M"}${o(f[0]).toFixed(1)},${h(p(f)).toFixed(1)}`).join(""), c = (p, f) => {
      let _ = l(p);
      for (let y = t.length - 1; y >= 0; y--) _ += `L${o(t[y][0]).toFixed(1)},${h(f(t[y])).toFixed(1)}`;
      return _ + "Z";
    }, m = `g${Math.random().toString(36).slice(2, 8)}`;
    return d`<svg viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" style="height:${s}px">
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
  P`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `
];
Ne([
  g({ attribute: !1 })
], oe.prototype, "points", 2);
Ne([
  g({ type: Number })
], oe.prototype, "max", 2);
Ne([
  g({ type: Number })
], oe.prototype, "height", 2);
Ne([
  g()
], oe.prototype, "label", 2);
oe = Ne([
  j("sm-sparkline")
], oe);
const hs = {
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off"
}, jt = () => ["solar", "solar_night", "on", "off"].map((t) => ({ value: t, label: n(`mode.${t}`), icon: hs[t] })), Pe = (t) => t === "solar" ? "solar" : ["night", "always_on", "legionella", "min_soc"].includes(t) ? "grid" : t === "peak_guard" || t === "unavailable" ? "warn" : t === "target_reached" ? "ok" : "", ps = (t) => ({
  solar: "mdi:white-balance-sunny",
  night: "mdi:weather-night",
  always_on: "mdi:power-plug",
  legionella: "mdi:bacteria-outline",
  min_soc: "mdi:battery-alert-variant-outline",
  peak_guard: "mdi:transmission-tower",
  unavailable: "mdi:alert-circle-outline",
  target_reached: "mdi:check-circle-outline"
})[t] ?? "mdi:circle-small", me = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
var us = Object.defineProperty, ms = Object.getOwnPropertyDescriptor, Te = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? ms(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && us(e, s, i), i;
};
let re = class extends w {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1;
  }
  _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _hint() {
    const t = this.live, e = this.load;
    return t ? t.reason === "peak_guard" ? n("hint.peak") : t.is_full ? n(e.type === "ev" ? "hint.full_ev" : "hint.full") : e.mode === "solar_night" && t.night_needed === !0 ? n("hint.night_needed") : e.mode === "solar_night" && t.night_needed === !1 ? n("hint.night_not_needed") : e.type === "ev" && t.plugged === !1 ? n("reason.not_connected") : e.type === "ev" && t.is_on && t.current_a != null ? `${n("hint.charging_at")} ${Math.round(t.current_a)} A` : null : null;
  }
  render() {
    const t = this.load, e = this.live, [s, a] = Ct((e == null ? void 0 : e.power_w) ?? 0), i = (e == null ? void 0 : e.reason) ?? "idle", r = Pe(i), o = !!(e != null && e.is_on) && ((e == null ? void 0 : e.power_w) ?? 0) > 1, h = t.icon || (t.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler"), l = t.type === "ev" ? (t.ev_max_current ?? 16) * 230 * (t.ev_phases ?? 1) : t.nominal_power_w, c = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null, m = this._hint();
    return d`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${o ? "active" : ""} .icon=${h}></ha-icon>
        <span class="name">${t.name}</span>
        <span class="status ${r}">
          ${r ? d`<ha-icon .icon=${ps(i)}></ha-icon>` : d`<span class="dot"></span>`}
          ${n(`reason.${i}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big"><span class="v">${s}</span><span class="u">${a}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
            ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : u}
            ${t.enabled ? u : d`<span>${n("reason.disabled")}</span>`}
          </div>
        </div>
        <div class="side">
          <div class="l">${n("load.today")}</div>
          <div class="v">${L((e == null ? void 0 : e.kwh_today) ?? 0, 1)}</div>
          <div class="s">${c === null ? "" : `${Math.round(c * 100)}% ${n("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${l} .height=${76}></sm-sparkline>
        ${m ? d`<span class="hint">${m}</span>` : u}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${jt()} .value=${t.mode}
          @value-changed=${(p) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: p.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
      </div></div>
    </div>`;
  }
};
re.styles = [
  D,
  de,
  P`
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
    `
];
Te([
  g({ attribute: !1 })
], re.prototype, "load", 2);
Te([
  g({ attribute: !1 })
], re.prototype, "live", 2);
Te([
  g({ attribute: !1 })
], re.prototype, "spark", 2);
Te([
  g({ type: Number })
], re.prototype, "priority", 2);
re = Te([
  j("sm-load-card")
], re);
var gs = Object.defineProperty, _s = Object.getOwnPropertyDescriptor, ce = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? _s(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && gs(e, s, i), i;
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
  P`
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
  g()
], R.prototype, "icon", 2);
ce([
  g()
], R.prototype, "heading", 2);
ce([
  g()
], R.prototype, "secondary", 2);
ce([
  g()
], R.prototype, "value", 2);
ce([
  g({ type: Boolean })
], R.prototype, "clickable", 2);
ce([
  g({ reflect: !0 })
], R.prototype, "variant", 2);
R = ce([
  j("sm-list-row")
], R);
var vs = Object.defineProperty, fs = Object.getOwnPropertyDescriptor, he = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? fs(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && vs(e, s, i), i;
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
    const s = this.loads.map((r) => r.id), a = s.indexOf(t), i = a + e;
    i < 0 || i >= s.length || ([s[a], s[i]] = [s[i], s[a]], this._saveOrder(s));
  }
  _drop(t) {
    if (!this._dragId || this._dragId === t) return;
    const e = this.loads.map((s) => s.id).filter((s) => s !== this._dragId);
    e.splice(e.indexOf(t), 0, this._dragId), this._dragId = null, this._saveOrder(e);
  }
  _pills() {
    var i;
    const t = ((i = this.live) == null ? void 0 : i.site) ?? {}, e = t.grid_w, s = e != null && e < 0, a = (t.quarter_projected_w ?? 0) > (t.peak_limit_w ?? 1 / 0) ? "warn" : "grid";
    return d`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${n("site.pv")} <b>${z(t.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${s ? "export" : "grid"} icon=${s ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${n(s ? "site.export" : "site.import")} <b>${z(e == null ? null : Math.abs(e))}</b></span>
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
          @dragover=${(s) => s.preventDefault()} @drop=${() => this._drop(t.id)}>
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
              ${this.loads.map((s, a) => {
      var i, r;
      return d`<sm-load-card .load=${s} .live=${(r = (i = this.live) == null ? void 0 : i.loads) == null ? void 0 : r[s.id]} .spark=${this.spark[s.id] ?? []} .priority=${a + 1}></sm-load-card>`;
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
  P`
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
  g({ attribute: !1 })
], V.prototype, "hass", 2);
he([
  g({ attribute: !1 })
], V.prototype, "loads", 2);
he([
  g({ attribute: !1 })
], V.prototype, "live", 2);
he([
  g({ attribute: !1 })
], V.prototype, "spark", 2);
he([
  g({ type: Boolean })
], V.prototype, "editing", 2);
he([
  b()
], V.prototype, "_dragId", 2);
V = he([
  j("sm-dashboard")
], V);
var ys = Object.defineProperty, bs = Object.getOwnPropertyDescriptor, be = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? bs(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && ys(e, s, i), i;
};
let Y = class extends w {
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
Y.styles = [
  D,
  de,
  P`
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
be([
  g()
], Y.prototype, "heading", 2);
be([
  g()
], Y.prototype, "saveLabel", 2);
be([
  g({ type: Boolean })
], Y.prototype, "busy", 2);
be([
  g({ type: Boolean })
], Y.prototype, "canSave", 2);
be([
  g()
], Y.prototype, "error", 2);
Y = be([
  j("sm-dialog")
], Y);
var $s = Object.defineProperty, xs = Object.getOwnPropertyDescriptor, tt = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? xs(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && $s(e, s, i), i;
};
let Ce = class extends w {
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
Ce.styles = [
  D,
  P`
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
  g({ type: Boolean, reflect: !0 })
], Ce.prototype, "checked", 2);
tt([
  g({ type: Boolean, reflect: !0 })
], Ce.prototype, "disabled", 2);
Ce = tt([
  j("sm-toggle")
], Ce);
var ws = Object.defineProperty, ks = Object.getOwnPropertyDescriptor, Le = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? ks(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && ws(e, s, i), i;
};
let As = 0, ne = class extends w {
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
    var o, h, l;
    const s = this._label(t);
    if (customElements.get("ha-entity-picker"))
      return d`<ha-entity-picker .hass=${this.hass} .label=${s} .value=${e ?? ""} allow-custom-entity
        .includeDomains=${t.domains} @value-changed=${(c) => this._emit(t.key, c.detail.value || null)}></ha-entity-picker>
        ${t.helper ? d`<span class="help">${t.helper}</span>` : u}`;
    const a = `sm-ents-${++As}`, i = e ? (h = (o = this.hass) == null ? void 0 : o.states) == null ? void 0 : h[e] : void 0, r = Object.values(((l = this.hass) == null ? void 0 : l.states) ?? {}).filter((c) => {
      var m;
      return !((m = t.domains) != null && m.length) || t.domains.includes(c.entity_id.split(".")[0]);
    }).sort((c, m) => c.entity_id.localeCompare(m.entity_id));
    return d`<label class="field">${s}
      <input list=${a} .value=${e ?? ""} placeholder="entity_id"
        @change=${(c) => this._emit(t.key, c.target.value.trim() || null)} />
      <datalist id=${a}>${r.map((c) => d`<option value=${c.entity_id}>${c.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${i ? d`<span class="ent-state">${i.attributes.friendly_name ?? ""}: ${i.state} ${i.attributes.unit_of_measurement ?? ""}</span>` : u}
      ${t.helper ? d`<span class="help">${t.helper}</span>` : u}
    </label>`;
  }
  _field(t) {
    const e = this.data;
    if (t.show && !t.show(e)) return u;
    const s = e[t.key], a = this._label(t);
    switch (t.kind) {
      case "entity":
        return d`<div>${this._entity(t, s)}</div>`;
      case "bool":
        return d`<div class="bool"><span class="txt">${a}${t.helper ? d`<span class="help">${t.helper}</span>` : u}</span>
          <sm-toggle .checked=${!!s} @change=${(i) => this._emit(t.key, i.detail.checked)}></sm-toggle></div>`;
      case "select":
        return d`<label class="field">${a}
          <select @change=${(i) => {
          const r = i.target.value;
          this._emit(t.key, typeof s == "number" ? Number(r) : r);
        }}>${(t.options ?? []).map((i) => d`<option value=${i.value} ?selected=${String(s) === i.value}>${i.label}</option>`)}</select>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
      case "number":
        return d`<label class="field">${a}
          <span class="wrap"><input type="number" step=${t.step ?? 1} .value=${s == null ? "" : String(s)}
            @change=${(i) => {
          const r = i.target.value;
          this._emit(t.key, r === "" ? t.nullable ? null : 0 : Number(r));
        }} />${t.unit ? d`<span class="unit">${t.unit}</span>` : u}</span>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
      case "time":
        return d`<label class="field">${a}
          <input type="time" .value=${s ?? ""} @change=${(i) => this._emit(t.key, i.target.value)} /></label>`;
      default:
        return d`<label class="field">${a}
          <input type="text" .value=${s ?? ""} @change=${(i) => this._emit(t.key, i.target.value)} />
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
    }
  }
  render() {
    return d`${this.fields.map((t) => this._field(t))}`;
  }
};
ne.styles = [
  D,
  P`
      :host { display: flex; flex-direction: column; gap: 14px; }
      label.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--secondary-text-color); }
      .wrap { position: relative; display: flex; align-items: center; }
      input, select {
        font: inherit; font-size: 15px; color: var(--primary-text-color); width: 100%; box-sizing: border-box;
        height: 48px; padding: 0 14px; border-radius: var(--sm-radius-sm); border: 1px solid var(--sm-border-strong);
        background: var(--sm-surface); outline: none;
      }
      input:focus, select:focus { border-color: var(--primary-color); box-shadow: inset 0 0 0 1px var(--primary-color); }
      .unit { position: absolute; right: 14px; color: var(--secondary-text-color); font-size: 14px; pointer-events: none; }
      .help { font-size: 12px; color: var(--secondary-text-color); line-height: 1.4; }
      .ent-state { font-size: 12px; color: var(--secondary-text-color); }
      .bool { display: flex; align-items: center; gap: 16px; min-height: 48px; }
      .bool .txt { flex: 1; font-size: 15px; color: var(--primary-text-color); }
      .bool .txt .help { display: block; margin-top: 2px; }
      ha-entity-picker { display: block; }
    `
];
Le([
  g({ attribute: !1 })
], ne.prototype, "hass", 2);
Le([
  g({ attribute: !1 })
], ne.prototype, "fields", 2);
Le([
  g({ attribute: !1 })
], ne.prototype, "data", 2);
Le([
  g()
], ne.prototype, "prefix", 2);
ne = Le([
  j("sm-form")
], ne);
var Ss = Object.defineProperty, Es = Object.getOwnPropertyDescriptor, I = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Es(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && Ss(e, s, i), i;
};
const E = (t) => t.type === "ev", U = (t) => E(t) && t.ev_driver === "tesla_ble_proxy", Ie = (t) => rs(t ?? 0), ke = (t, e) => {
  if (!e) return n("detail.not_set");
  const s = t.states[e];
  return s ? `${s.attributes.friendly_name ?? e}` : e;
}, Ps = (t, e) => {
  const s = e ? t.states[e] : void 0;
  return s ? s.state === "on" ? n("detail.on") : s.state === "off" ? n("detail.off") : s.state : "";
}, Ge = (t, e) => {
  if (!e) return "";
  const s = t.states[e];
  return s ? `${s.state}${s.attributes.unit_of_measurement ? " " + s.attributes.unit_of_measurement : ""}` : "?";
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
            secondary: (e) => ke(t, e.switch_entity),
            value: (e) => Ps(t, e.switch_entity),
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
            secondary: (e) => U(e) ? `${e.ev_proxy_url} · ${e.ev_vin || "VIN?"}` : ke(t, e.ev_charge_switch_entity),
            value: (e) => n(`f.ev_driver.${e.ev_driver}`),
            fields: [
              { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"].map((e) => ({ value: e, label: n(`f.ev_driver.${e}`) })) },
              { key: "ev_proxy_url", kind: "text", show: U, helper: n("f.ev_proxy_url.help") },
              { key: "ev_vin", kind: "text", show: U },
              { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (e) => !U(e) },
              { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !U(e) },
              { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: (e) => !U(e) }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: n("detail.power_sensor"),
            secondary: (e) => ke(t, e.power_entity),
            value: (e) => Ge(t, e.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: n("f.power_entity.help") }]
          },
          {
            icon: "mdi:thermometer",
            title: n("detail.temp_sensor"),
            show: (e) => !E(e),
            secondary: (e) => ke(t, e.temperature_entity),
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
            secondary: (e) => e.ev_soc_entity ? ke(t, e.ev_soc_entity) : U(e) ? n("detail.from_proxy") : n("detail.not_set"),
            value: (e, s) => (s == null ? void 0 : s.soc) != null ? `${Math.round(s.soc)}%` : "",
            fields: [{ key: "ev_soc_entity", kind: "entity", domains: ["sensor"] }]
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
            secondary: (e) => E(e) && (e.ev_soc_entity || U(e)) ? n("detail.night_when_soc").replace("{soc}", String(e.ev_target_soc)) : e.night_min_temperature != null ? n("detail.night_when_temp").replace("{t}", String(e.night_min_temperature)) : n("detail.night_when_kwh").replace("{kwh}", String(e.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (e) => !(E(e) && (e.ev_soc_entity || U(e))) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: !0, show: (e) => !E(e) },
              { key: "ev_target_soc", kind: "number", unit: "%", show: E }
            ]
          },
          {
            icon: "mdi:battery-arrow-up-outline",
            title: n("detail.night_amount"),
            show: (e) => !E(e),
            value: (e) => e.night_target_kwh ? L(e.night_target_kwh, 1) : n("detail.until_full"),
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
    await ss(this.hass, this.load.id), this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _move(t) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta: t }, bubbles: !0, composed: !0 }));
  }
  _hero() {
    const t = this.load, e = this.live, [s, a] = Ct((e == null ? void 0 : e.power_w) ?? 0), i = (e == null ? void 0 : e.reason) ?? "idle", r = Pe(i), o = t.icon || (E(t) ? "mdi:ev-station" : "mdi:water-boiler"), h = E(t) ? t.ev_max_current * 230 * t.ev_phases : t.nominal_power_w, l = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null;
    return d`<div class="card hero">
      <div class="hero-head">
        <div class="hero-ic ${e != null && e.is_on && ((e == null ? void 0 : e.power_w) ?? 0) > 1 ? "active" : ""}"><ha-icon .icon=${o}></ha-icon></div>
        <div>
          <div class="hero-name">${t.name}
            <button class="icon" title=${n("load.edit")} @click=${() => this._openDialog(n("detail.name_icon"), [
      { key: "name", kind: "text" },
      { key: "icon", kind: "text", helper: n("f.icon.help") }
    ])}><ha-icon icon="mdi:pencil"></ha-icon></button>
          </div>
          <div class="hero-sub"><span class="status ${r}">${n(`reason.${i}`)}</span> · ${n(`type.${t.type}`)}</div>
        </div>
      </div>
      <div class="big"><span class="v">${s}</span><span class="u">${a}</span></div>
      <sm-sparkline .points=${this.spark} .max=${h} .height=${90} .label=${n("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
        ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : u}
        ${(e == null ? void 0 : e.current_a) != null && E(t) ? d`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(e.current_a)} A</span>` : u}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${L((e == null ? void 0 : e.kwh_today) ?? 0, 1)} ${n("load.today")}</span>
        ${l !== null ? d`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(l * 100)}% ${n("load.from_solar")}</span>` : u}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${n("f.mode")}</div>
        <sm-segmented .options=${jt()} .value=${t.mode}
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
    const s = t.rows.filter((a) => !a.show || a.show(e));
    return d`<div class="card list">
      <div class="card-head"><h2>${t.title}</h2>${t.meta && t.meta(e) ? d`<span class="meta">${t.meta(e)}</span>` : u}</div>
      ${s.map(
      (a) => {
        var i, r, o;
        return a.toggle ? d`<sm-list-row .icon=${a.icon} .heading=${a.title} .secondary=${((i = a.secondary) == null ? void 0 : i.call(a, e)) ?? ""}>
              <sm-toggle .checked=${!!e[a.toggle]} @change=${(h) => this._save({ [a.toggle]: h.detail.checked })}></sm-toggle>
            </sm-list-row>` : d`<sm-list-row .icon=${a.icon} .heading=${a.title} .secondary=${((r = a.secondary) == null ? void 0 : r.call(a, e)) ?? ""} .value=${((o = a.value) == null ? void 0 : o.call(a, e, this.live)) ?? ""}
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
  P`
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
  g({ attribute: !1 })
], C.prototype, "hass", 2);
I([
  g({ attribute: !1 })
], C.prototype, "load", 2);
I([
  g({ attribute: !1 })
], C.prototype, "live", 2);
I([
  g({ attribute: !1 })
], C.prototype, "spark", 2);
I([
  g({ type: Number })
], C.prototype, "priority", 2);
I([
  g({ type: Number })
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
var Os = Object.defineProperty, Ms = Object.getOwnPropertyDescriptor, $e = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ms(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && Os(e, s, i), i;
};
const _t = (t, e) => e.map((s) => ({ value: s, label: n(`s.${t}.${s}`) })), vt = (t, e) => {
  var s;
  return e ? ((s = t.states[e]) == null ? void 0 : s.attributes.friendly_name) ?? e : n("detail.not_set");
}, zs = () => [
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
      { key: "grid_mode", kind: "select", options: _t("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (t) => t.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: _t("grid_sign", ["import_positive", "export_positive"]), show: (t) => t.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (t) => t.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (t) => t.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" }
    ],
    summary: (t, e) => vt(e, t.grid_mode === "split" ? t.grid_import_entity : t.grid_power_entity)
  },
  {
    id: "pv",
    icon: "mdi:solar-power-variant",
    fields: [
      { key: "pv_power_entity", kind: "entity", domains: ["sensor"] },
      { key: "pv_forecast_today_entity", kind: "entity", domains: ["sensor"], helper: n("s.forecast.help") },
      { key: "pv_forecast_tomorrow_entity", kind: "entity", domains: ["sensor"] }
    ],
    summary: (t, e) => vt(e, t.pv_power_entity)
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
let X = class extends w {
  constructor() {
    super(...arguments), this.narrow = !1, this._cat = null, this._draft = {};
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings }), this._cat === null && !this.narrow && (this._cat = "meter");
  }
  async _change(t, e) {
    this._draft = { ...this._draft, [t]: e }, this.dispatchEvent(new CustomEvent("saving", { bubbles: !0, composed: !0 }));
    try {
      await ts(this.hass, { [t]: e }), this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
    } catch (s) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: (s == null ? void 0 : s.message) ?? String(s) }, bubbles: !0, composed: !0 }));
    }
  }
  render() {
    const t = zs(), e = t.find((i) => i.id === this._cat), s = !this.narrow || !e, a = !!e;
    return d`<div class="md ${this.narrow ? "single" : ""}">
      ${s ? d`<div class="card nav">
            ${t.map(
      (i) => d`<sm-list-row class=${i.id === this._cat && !this.narrow ? "sel" : ""} .icon=${i.icon} .heading=${n(`s.cat.${i.id}`)}
                .secondary=${i.summary(this._draft, this.hass)} clickable @row-click=${() => this._cat = i.id}></sm-list-row>`
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
                @value-changed=${(i) => this._change(i.detail.key, i.detail.value)}></sm-form>
            </div>
          </div>` : ""}
    </div>`;
  }
};
X.styles = [
  D,
  de,
  P`
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
$e([
  g({ attribute: !1 })
], X.prototype, "hass", 2);
$e([
  g({ attribute: !1 })
], X.prototype, "settings", 2);
$e([
  g({ type: Boolean })
], X.prototype, "narrow", 2);
$e([
  b()
], X.prototype, "_cat", 2);
$e([
  b()
], X.prototype, "_draft", 2);
X = $e([
  j("sm-settings")
], X);
var Cs = Object.defineProperty, js = Object.getOwnPropertyDescriptor, F = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? js(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && Cs(e, s, i), i;
};
const q = 1e3, x = 64, B = 16, ft = 18, Ke = 14, yt = 12, Ds = (t) => {
  const e = Math.pow(10, Math.floor(Math.log10(t))), s = t / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 2.5 ? 2.5 : s <= 5 ? 5 : 10) * e;
}, Ye = (t, e) => e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
let ye = class extends w {
  constructor() {
    super(...arguments), this.x = [], this.panels = [], this._hover = null;
  }
  render() {
    var T, k;
    const t = this.x.length;
    if (t < 2) return d`<slot></slot>`;
    const e = this.x[0], s = this.x[t - 1], a = (v) => x + (v - e) / Math.max(1, s - e) * (q - x - B);
    let i = 0;
    const r = [], o = [];
    for (const v of this.panels) {
      const $ = i + ft, pe = v.height;
      o.push([$, pe]), r.push(A`<text class="ptitle" x="${x}" y="${i + 12}">${v.title}</text>`), r.push(A`<rect class="plot" x="${x}" y="${$}" width="${q - x - B}" height="${pe}" rx="2"></rect>`), (T = v.series) != null && T.length && r.push(this._series(v, $, pe, a)), (k = v.bands) != null && k.length && v.bands.forEach((ue, Q) => {
        const Z = $ + 4 + Q * (yt + 4);
        r.push(A`<text class="axis" x="${x - 8}" y="${Z + 10}" text-anchor="end">${ue.label}</text>`), ue.segments.forEach(
          (W) => r.push(A`<rect x="${a(W.from)}" y="${Z}" width="${Math.max(1, a(W.to) - a(W.from))}" height="${yt}" fill="${W.color}" rx="2"><title>${W.title}</title></rect>`)
        );
      }), i = $ + pe + Ke;
    }
    const h = s - e, l = h <= 1.5 * 86400 ? 3 * 3600 : h <= 8 * 86400 ? 86400 : 7 * 86400, c = [], m = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
    for (let v = Math.ceil((e - m) / l) * l + m; v <= s; v += l) c.push(v);
    const p = (v) => {
      const $ = new Date(v * 1e3);
      return l < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { weekday: "short", day: "numeric" });
    }, f = i - Ke + 16, _ = f + 6;
    c.forEach((v) => {
      r.push(A`<line class="gridline" x1="${a(v)}" x2="${a(v)}" y1="${ft}" y2="${i - Ke}" stroke-dasharray="2 4"></line>`), r.push(A`<text class="axis" x="${a(v)}" y="${f}" text-anchor="middle">${p(v)}</text>`);
    });
    const y = this._hover;
    y !== null && o.forEach(
      ([v, $]) => r.push(A`<line x1="${a(this.x[y])}" x2="${a(this.x[y])}" y1="${v}" y2="${v + $}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`)
    );
    const N = (v) => {
      const $ = v.currentTarget.getBoundingClientRect(), pe = (v.clientX - $.left) / $.width * q, ue = e + (pe - x) / (q - x - B) * (s - e);
      let Q = 0, Z = t - 1;
      for (; Z - Q > 1; ) {
        const W = Q + Z >> 1;
        this.x[W] < ue ? Q = W : Z = W;
      }
      this._hover = Math.abs(this.x[Q] - ue) < Math.abs(this.x[Z] - ue) ? Q : Z;
    }, M = this.panels.flatMap((v) => (v.series ?? []).map(($) => ({ ...$, unit: $.unit ?? v.unit })));
    return d`
      <svg viewBox="0 0 ${q} ${_}" @mousemove=${N} @mouseleave=${() => this._hover = null}>${r}</svg>
      ${y !== null ? d`<div class="tip" style="${a(this.x[y]) > q / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[y] * 1e3).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${M.map((v) => {
      const $ = v.values[y];
      return $ == null ? u : d`<div><span class="dot" style="background:${v.color}"></span>${v.label}: ${Ye($, v.unit)}</div>`;
    })}
          </div>` : u}
      <div class="legend">
        ${M.filter((v) => v.legend !== !1).map((v) => d`<span><span class="dot" style="background:${v.color}"></span>${v.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }
  _series(t, e, s, a) {
    const i = this.x.length, r = {}, o = [], h = [];
    for (const _ of t.series)
      if (_.kind === "area" && _.stack) {
        const y = r[_.stack] ?? new Array(i).fill(0), N = y.map((M, T) => M + Math.max(0, _.values[T] ?? 0));
        h.push(y), o.push(N), r[_.stack] = N;
      } else
        h.push(new Array(i).fill(0)), o.push(_.values.map((y) => y ?? 0));
    let l = -1 / 0, c = 1 / 0;
    t.series.forEach((_, y) => {
      for (let N = 0; N < i; N++) {
        const M = _.values[N];
        M != null && (l = Math.max(l, _.kind === "area" ? o[y][N] : M), c = Math.min(c, _.kind === "area" ? 0 : M));
      }
    }), l === -1 / 0 && (l = 1, c = 0), t.zero !== !1 && (c = Math.min(c, 0), l = Math.max(l, 0));
    const m = Ds((l - c) / 3 || 1);
    l = Math.ceil((l + (l - c) * 0.04) / m) * m, c = Math.floor(c / m) * m;
    const p = (_) => e + s - (_ - c) / (l - c) * s, f = [];
    for (let _ = c; _ <= l + m / 2; _ += m)
      f.push(A`<line class="gridline" x1="${x}" x2="${q - B}" y1="${p(_)}" y2="${p(_)}"></line>
        <text class="axis" x="${x - 8}" y="${p(_) + 4}" text-anchor="end">${Ye(_, t.unit)}</text>`);
    return c < 0 && f.push(A`<line x1="${x}" x2="${q - B}" y1="${p(0)}" y2="${p(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`), t.series.forEach((_, y) => {
      if (_.kind === "area") {
        let T = "";
        for (let k = 0; k < i; k++) T += `${k ? "L" : "M"}${a(this.x[k]).toFixed(1)},${p(o[y][k]).toFixed(1)}`;
        for (let k = i - 1; k >= 0; k--) T += `L${a(this.x[k]).toFixed(1)},${p(h[y][k]).toFixed(1)}`;
        f.push(A`<path d="${T}Z" fill="${_.color}" fill-opacity="0.45" stroke="${_.color}" stroke-width="1"></path>`);
        return;
      }
      let N = "", M = !1;
      for (let T = 0; T < i; T++) {
        const k = _.values[T];
        if (k == null) {
          M = !1;
          continue;
        }
        const v = a(this.x[T]).toFixed(1), $ = p(k).toFixed(1);
        _.kind === "step" && M ? N += `H${v}V${$}` : N += `${M ? "L" : "M"}${v},${$}`, M = !0;
      }
      f.push(A`<path d="${N}" fill="none" stroke="${_.color}" stroke-width="1.8" stroke-dasharray="${_.dashed ? "5 4" : ""}"></path>`);
    }), f;
  }
};
ye.styles = [
  D,
  P`
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
  g({ attribute: !1 })
], ye.prototype, "x", 2);
F([
  g({ attribute: !1 })
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
    const t = this.height, e = t - 26, s = (l) => l.parts.reduce((c, m) => c + m.value, 0), a = Math.max(this.limit ?? 0, ...this.bars.map(s), 1e-3) * 1.1, i = 640, r = (i - x - B) / this.bars.length, o = (l) => e - l / a * e, h = Math.ceil(this.bars.length / 10);
    return d`<svg viewBox="0 0 ${i} ${t}">
      <rect class="plot" x="${x}" y="0" width="${i - x - B}" height="${e}" rx="2"></rect>
      ${[0, 1, 2, 3].map((l) => {
      const c = a / 1.1 * (l / 3);
      return A`<line class="gridline" x1="${x}" x2="${i - B}" y1="${o(c)}" y2="${o(c)}"></line>
          <text class="axis" x="${x - 8}" y="${o(c) + 4}" text-anchor="end">${Ye(c, this.unit)}</text>`;
    })}
      ${this.bars.map((l, c) => {
      let m = 0;
      const p = x + c * r + r * 0.18;
      return A`${l.parts.map((f) => {
        const _ = o(m);
        m += f.value;
        const y = o(m);
        return A`<rect x="${p}" width="${r * 0.64}" y="${y}" height="${Math.max(0, _ - y)}" fill="${f.color}" rx="2"><title>${l.label}: ${f.title}</title></rect>`;
      })}${c % h === 0 ? A`<text class="axis" x="${p + r * 0.32}" y="${t - 6}" text-anchor="middle">${l.label}</text>` : u}`;
    })}
      ${this.limit ? A`<line x1="${x}" x2="${i - B}" y1="${o(this.limit)}" y2="${o(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : u}
    </svg>`;
  }
};
le.styles = [
  D,
  P`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `
];
F([
  g({ attribute: !1 })
], le.prototype, "bars", 2);
F([
  g({ type: Number })
], le.prototype, "height", 2);
F([
  g()
], le.prototype, "unit", 2);
F([
  g({ type: Number })
], le.prototype, "limit", 2);
le = F([
  j("sm-bars")
], le);
var Ns = Object.defineProperty, Ts = Object.getOwnPropertyDescriptor, J = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ts(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && Ns(e, s, i), i;
};
const Ae = "var(--sm-solar)", ge = "var(--sm-grid)", bt = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)"
}, Ls = (t) => {
  const e = /* @__PURE__ */ new Date(), s = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() / 1e3, a = e.getTime() / 1e3;
  switch (t) {
    case "yesterday":
      return [s - 86400, s];
    case "7d":
      return [s - 6 * 86400, a];
    case "30d":
      return [s - 29 * 86400, a];
    case "month":
      return [new Date(e.getFullYear(), e.getMonth(), 1).getTime() / 1e3, a];
    default:
      return [s, a];
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
    const [t, e] = Ls(this._range);
    try {
      this._data = await Mt(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _downsample(t) {
    if (t.length <= 1200) return t;
    const s = Math.ceil(t.length / 1200), a = [];
    for (let i = 0; i < t.length; i += s) {
      const r = t.slice(i, i + s), o = (c) => {
        const m = r.map(c).filter((p) => p != null);
        return m.length ? m.reduce((p, f) => p + f, 0) / m.length : null;
      }, h = r[r.length - 1], l = {};
      for (const c of Object.keys(h[3]))
        l[c] = [o((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[0];
        }), o((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[1];
        }), h[3][c][2], r.some((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[3];
        }) ? 1 : 0, o((m) => {
          var p;
          return (p = m[3][c]) == null ? void 0 : p[4];
        })];
      a.push([r[0][0], o((c) => c[1]), o((c) => c[2]), l]);
    }
    return a;
  }
  _band(t, e, s) {
    var r;
    const a = [];
    let i = null;
    for (let o = 0; o < t.length; o++) {
      const h = t[o][3][e], l = h ? h[2] : null, c = l ? Pe(l) : "", p = l && (h[3] || l === "peak_guard") && c ? bt[c] : null, f = l ? n(`reason.${l}`) : "", _ = ((r = t[o + 1]) == null ? void 0 : r[0]) ?? t[o][0] + 60;
      p && i && i.color === p && i.title === f ? i.to = _ : (i && a.push(i), i = p ? { from: t[o][0], to: _, color: p, title: f } : null);
    }
    return i && a.push(i), { label: s, segments: a };
  }
  _history() {
    var a, i;
    const t = this._downsample(((i = (a = this._data) == null ? void 0 : a.timeline) == null ? void 0 : i.rows) ?? []);
    if (t.length < 2) return d`<div class="empty">${n("a.no_data")}</div>`;
    const e = t.map((r) => r[0]), s = [];
    if (this.loadId) {
      const r = this.loadId, o = this.loads.find((l) => l.id === r), h = [
        { label: n("a.from_solar"), color: Ae, kind: "area", stack: "l", values: t.map((l) => {
          var c;
          return ((c = l[3][r]) == null ? void 0 : c[1]) ?? 0;
        }) },
        { label: n("a.from_grid"), color: ge, kind: "area", stack: "l", values: t.map((l) => {
          var c, m;
          return Math.max(0, (((c = l[3][r]) == null ? void 0 : c[0]) ?? 0) - (((m = l[3][r]) == null ? void 0 : m[1]) ?? 0));
        }) },
        { label: n("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: t.map((l) => l[1]) }
      ];
      if (s.push({ title: `${n("a.power")} (W)`, unit: "W", height: 220, series: h }), t.some((l) => {
        var c;
        return ((c = l[3][r]) == null ? void 0 : c[4]) != null;
      })) {
        const l = (o == null ? void 0 : o.type) === "ev";
        s.push({
          title: l ? `${n("a.soc")} (%)` : `${n("a.temperature")} (°C)`,
          unit: l ? "%" : "°C",
          height: 90,
          zero: !1,
          series: [{ label: n(l ? "a.soc" : "a.temperature"), color: "var(--sm-err)", kind: "line", values: t.map((c) => {
            var m;
            return ((m = c[3][r]) == null ? void 0 : m[4]) ?? null;
          }) }]
        });
      }
      s.push({ title: n("a.why"), unit: "", height: 22, bands: [this._band(t, r, "")] });
    } else {
      const r = this.loads.map((o, h) => ({
        label: o.name,
        color: me[h % me.length],
        kind: "area",
        stack: "loads",
        values: t.map((l) => {
          var c;
          return ((c = l[3][o.id]) == null ? void 0 : c[0]) ?? 0;
        })
      }));
      r.push({ label: n("a.pv"), color: Ae, kind: "line", values: t.map((o) => o[1]) }), s.push({ title: `${n("a.power")} (W)`, unit: "W", height: 220, series: r }), s.push({
        title: `${n("site.grid")} (W) · + ${n("a.import").toLowerCase()} / − ${n("a.export").toLowerCase()}`,
        unit: "W",
        height: 90,
        series: [{ label: n("site.grid"), color: ge, kind: "line", values: t.map((o) => o[2]) }]
      }), s.push({
        title: n("a.why"),
        unit: "",
        height: this.loads.length * 16 + 6,
        bands: this.loads.map((o) => this._band(t, o.id, o.name.length > 9 ? o.name.slice(0, 8) + "…" : o.name))
      });
    }
    return d`<sm-chart .x=${e} .panels=${s}></sm-chart>`;
  }
  _tile(t, e, s) {
    return d`<div class="tile"><div class="v">${t}</div><div class="l">${e}</div>
      ${s ? d`<div class="bar"><div style="width:${s[0] * 100}%;background:${Ae}"></div><div style="width:${s[1] * 100}%;background:${ge}"></div></div>` : u}</div>`;
  }
  _summary() {
    var s;
    const t = (s = this._data) == null ? void 0 : s.summary;
    if (!t) return u;
    if (this.loadId) {
      const a = t.loads[this.loadId];
      if (!a) return d`<div class="empty">${n("a.no_data")}</div>`;
      const i = a.solar_share ?? 0, r = Object.entries(a.reasons ?? {}).filter(([o]) => Pe(o)).sort((o, h) => h[1] - o[1]);
      return d`<div class="tiles">
          ${this._tile(L(a.kwh), n("a.energy"), a.kwh > 0 ? [i, 1 - i] : void 0)}
          ${this._tile(we(a.solar_share), n("a.solar_share"))}
          ${this._tile(L(a.grid_kwh), n("a.grid"))}
          ${this._tile(qe(a.runtime_s), n("a.runtime"))}
          ${this._tile(String(a.starts), n("a.starts"))}
          ${this._tile(gt(a.saving), n("a.saving"))}
        </div>
        ${r.length ? d`<div class="why">${r.map(([o, h]) => d`<span class="pill"><span class="swatch" style="background:${bt[Pe(o)]}"></span>${n(`reason.${o}`)} <b>${qe(h)}</b></span>`)}</div>` : u}`;
    }
    const e = t.house;
    return d`<div class="tiles">
        ${this._tile(L(e.pv_kwh, 1), n("a.pv"))}
        ${this._tile(we(e.self_consumption), n("a.self_consumption"))}
        ${this._tile(we(e.self_sufficiency), n("a.self_sufficiency"))}
        ${this._tile(L(e.import_kwh, 1), n("a.import"))}
        ${this._tile(L(e.export_kwh, 1), n("a.export"))}
        ${this._tile(z(e.peak_w), n("a.peak"))}
      </div>
      <table>
        <tr><th>${n("a.distribution")}</th><th class="num">${n("a.energy")}</th><th class="num">${n("a.solar_share")}</th><th class="num">${n("a.runtime")}</th><th class="num">${n("a.saving")}</th></tr>
        ${this.loads.map((a, i) => {
      const r = t.loads[a.id];
      return r ? d`<tr><td><span class="swatch" style="background:${me[i % me.length]}"></span>${a.name}</td>
            <td class="num">${L(r.kwh)}</td><td class="num">${we(r.solar_share)}</td><td class="num">${qe(r.runtime_s)}</td><td class="num">${gt(r.saving)}</td></tr>` : u;
    })}
      </table>`;
  }
  _daily() {
    var a;
    const t = ((a = this._data) == null ? void 0 : a.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return u;
    const s = e.map((i) => {
      const r = `${Number(i.slice(8))}/${Number(i.slice(5, 7))}`;
      if (this.loadId) {
        const o = t[i].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label: r, parts: [
          { value: o.solar_kwh, color: Ae, title: `${n("a.solar")} ${L(o.solar_kwh)}` },
          { value: Math.max(0, o.kwh - o.solar_kwh), color: ge, title: `${n("a.grid")} ${L(o.kwh - o.solar_kwh)}` }
        ] };
      }
      return { label: r, parts: this.loads.map((o, h) => {
        var c;
        const l = ((c = t[i].loads[o.id]) == null ? void 0 : c.kwh) ?? 0;
        return { value: l, color: me[h % me.length], title: `${o.name} ${L(l)}` };
      }) };
    });
    return d`<div class="card"><div class="card-head"><h2>${n("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${s}></sm-bars></div></div>`;
  }
  _rhythm() {
    var s, a;
    if (!this.loadId) return u;
    const t = ((a = (s = this._data) == null ? void 0 : s.rhythm) == null ? void 0 : a[this.loadId]) ?? [];
    if (!t.some((i) => i > 0)) return u;
    const e = t.map((i, r) => ({ label: `${r}u`, parts: [{ value: i, color: Ae, title: z(i) }] }));
    return d`<div class="card"><div class="card-head"><h2>${n("a.rhythm")}</h2><span class="meta">${n("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div></div>`;
  }
  _quarters() {
    var i;
    if (this.loadId) return u;
    const t = ((i = this._data) == null ? void 0 : i.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return u;
    const s = this.peakLimit, a = e.length === 1 ? t[e[0]].map(([r, o]) => ({
      label: new Date(r * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: o, color: s && o > s ? "var(--sm-err)" : ge, title: z(o) }]
    })) : e.map((r) => {
      const o = Math.max(...t[r].map((h) => h[1]));
      return { label: `${Number(r.slice(8))}/${Number(r.slice(5, 7))}`, parts: [{ value: o, color: s && o > s ? "var(--sm-err)" : ge, title: z(o) }] };
    });
    return d`<div class="card"><div class="card-head"><h2>${n("a.quarters")}</h2><span class="meta">${n("site.peak_limit")} ${z(s)}</span></div>
      <div class="card-body"><sm-bars .bars=${a} unit="W" .limit=${s}></sm-bars></div></div>`;
  }
  _sessions() {
    var a;
    const t = this.loadId ? this.loads.find((i) => i.id === this.loadId) : null;
    if (!t || t.type !== "ev") return u;
    const e = [...((a = this._data) == null ? void 0 : a.sessions) ?? []].reverse();
    if (!e.length) return u;
    const s = (i) => i ? new Date(i * 1e3).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : n("a.ongoing");
    return d`<div class="card"><div class="card-head"><h2>${n("a.sessions")}</h2><span class="meta">${e.length}</span></div>
      <table>
        <tr><th>${n("a.start")}</th><th>${n("a.end")}</th><th class="num">${n("a.energy")}</th><th class="num">${n("a.solar_share")}</th><th class="num">${n("a.soc")}</th></tr>
        ${e.map((i) => d`<tr><td>${s(i.start)}</td><td>${s(i.end)}</td><td class="num">${L(i.kwh)}</td>
          <td class="num">${we(i.kwh > 0 ? i.solar_kwh / i.kwh : null)}</td><td class="num">${i.soc_start ?? "–"}% → ${i.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }
  render() {
    const t = [{ value: "", label: n("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((s) => ({ value: s.id, label: s.name, icon: s.icon || (s.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler") }))
    ), e = ["today", "yesterday", "7d", "30d", "month"];
    return d`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${t} .value=${this.loadId ?? ""}
          @value-changed=${(s) => {
      this.loadId = s.detail.value || null, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: !0, composed: !0 }));
    }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${e.map((s) => ({ value: s, label: n(`a.range.${s}`) }))} .value=${this._range}
          @value-changed=${(s) => {
      this._range = s.detail.value, this._fetch();
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
  P`
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
J([
  g({ attribute: !1 })
], H.prototype, "hass", 2);
J([
  g({ attribute: !1 })
], H.prototype, "loads", 2);
J([
  g()
], H.prototype, "loadId", 2);
J([
  g({ type: Number })
], H.prototype, "peakLimit", 2);
J([
  b()
], H.prototype, "_range", 2);
J([
  b()
], H.prototype, "_data", 2);
J([
  b()
], H.prototype, "_loading", 2);
H = J([
  j("sm-analytics")
], H);
var Is = Object.defineProperty, Hs = Object.getOwnPropertyDescriptor, O = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Hs(e, s) : e, r = t.length - 1, o; r >= 0; r--)
    (o = t[r]) && (i = (a ? o(e, s, i) : o(i)) || i);
  return a && i && Is(e, s, i), i;
};
const Ws = 6 * 3600;
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
    this._started = !0, os(this.hass.language);
    try {
      await this._reload(), this._unsub = await ut(this.hass, (t) => this._live = t), this._loadSpark(), this._sparkTimer = window.setInterval(() => this._loadSpark(), 6e4);
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t), this._started = !1;
    }
  }
  async _reload() {
    this._config = await es(this.hass), this._live = this._config.live;
  }
  async _loadSpark() {
    const t = Date.now() / 1e3;
    try {
      const e = await Mt(this.hass, t - Ws, t, null), s = {};
      for (const a of e.timeline.rows)
        for (const [i, r] of Object.entries(a[3]))
          (s[i] ?? (s[i] = [])).push([a[0], r[0] ?? 0, r[1] ?? 0]);
      this._spark = s;
    } catch {
    }
  }
  async _resubscribe() {
    var t;
    (t = this._unsub) == null || t.call(this), this._unsub = void 0;
    for (let e = 0; e < 20; e++) {
      await new Promise((s) => setTimeout(s, 500));
      try {
        await this._reload(), this._unsub = await ut(this.hass, (s) => this._live = s);
        return;
      } catch {
      }
    }
  }
  _flashSave(t) {
    this._save = t, window.clearTimeout(this._saveTimer), t === "saved" && (this._saveTimer = window.setTimeout(() => this._save = "", 2500));
  }
  _setOrder(t) {
    const e = this._config, s = new Map(e.loads.map((a) => [a.id, a]));
    this._config = { ...e, loads: t.map((a) => s.get(a)).filter(Boolean) };
  }
  async _setMode(t, e) {
    const s = this._config;
    this._config = { ...s, loads: s.loads.map((a) => a.id === t ? { ...a, mode: e } : a) }, this._flashSave("saving"), await is(this.hass, t, e), this._flashSave("saved");
  }
  async _moveLoad(t, e) {
    const s = this._config.loads.map((r) => r.id), a = s.indexOf(t), i = a + e;
    i < 0 || i >= s.length || ([s[a], s[i]] = [s[i], s[a]], this._setOrder(s), await Ot(this.hass, s));
  }
  _addFields() {
    const t = (s) => s.type === "ev", e = (s) => t(s) && s.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev"].map((s) => ({ value: s, label: n(`type.${s}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: (s) => !t(s) },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: (s) => !t(s) },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((s) => ({ value: s, label: n(`f.ev_driver.${s}`) })), show: t },
      { key: "ev_proxy_url", kind: "text", show: e, helper: n("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: e },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (s) => t(s) && !e(s) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (s) => t(s) && !e(s) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: n("f.power_entity.help") },
      { key: "mode", kind: "select", options: ["solar", "solar_night", "on", "off"].map((s) => ({ value: s, label: n(`mode.${s}`) })) }
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
    const t = this._config, e = this._detail ? t == null ? void 0 : t.loads.find((s) => s.id === this._detail) : void 0;
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
      (s) => d`<button class="tab ${this._tab === s ? "on" : ""}" @click=${() => {
        this._tab = s, this._editing = !1;
      }}>${n(`tab.${s}`)}</button>`
    )}
      </nav>`;
  }
  _content(t) {
    var s, a, i, r;
    const e = this._detail ? t.loads.findIndex((o) => o.id === this._detail) : -1;
    if (e >= 0) {
      const o = { ...t.defaults.load, ...t.loads[e] };
      return d`<sm-load-detail .hass=${this.hass} .load=${o} .live=${(a = (s = this._live) == null ? void 0 : s.loads) == null ? void 0 : a[o.id]} .spark=${this._spark[o.id] ?? []}
        .priority=${e + 1} .count=${t.loads.length}
        @set-mode=${(h) => this._setMode(h.detail.id, h.detail.mode)}
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
        return d`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad} .peakLimit=${((r = (i = this._live) == null ? void 0 : i.site) == null ? void 0 : r.peak_limit_w) ?? null}
          @analytics-load=${(o) => this._analyticsLoad = o.detail.id}></sm-analytics>`;
      case "settings":
        return d`<sm-settings .hass=${this.hass} .settings=${t.settings} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(o) => {
          this._config = { ...t, settings: { ...t.settings, ...o.detail.settings } }, this._flashSave("saved");
        }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return d`<sm-dashboard .hass=${this.hass} .loads=${t.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(o) => this._detail = o.detail.id}
          @set-mode=${(o) => this._setMode(o.detail.id, o.detail.mode)}
          @loads-reordered=${(o) => this._setOrder(o.detail.order)}
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
  P`
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
O([
  g({ attribute: !1 })
], S.prototype, "hass", 2);
O([
  g({ type: Boolean })
], S.prototype, "narrow", 2);
O([
  b()
], S.prototype, "_config", 2);
O([
  b()
], S.prototype, "_live", 2);
O([
  b()
], S.prototype, "_tab", 2);
O([
  b()
], S.prototype, "_detail", 2);
O([
  b()
], S.prototype, "_editing", 2);
O([
  b()
], S.prototype, "_analyticsLoad", 2);
O([
  b()
], S.prototype, "_spark", 2);
O([
  b()
], S.prototype, "_adding", 2);
O([
  b()
], S.prototype, "_addBusy", 2);
O([
  b()
], S.prototype, "_addError", 2);
O([
  b()
], S.prototype, "_save", 2);
O([
  b()
], S.prototype, "_error", 2);
S = O([
  j("solarmind-panel")
], S);
export {
  S as SolarMindPanel
};
