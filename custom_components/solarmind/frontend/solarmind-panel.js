/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = globalThis, vt = et.ShadowRoot && (et.ShadyCSS === void 0 || et.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ft = Symbol(), xt = /* @__PURE__ */ new WeakMap();
let Ft = class {
  constructor(e, a, i) {
    if (this._$cssResult$ = !0, i !== ft) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = a;
  }
  get styleSheet() {
    let e = this.o;
    const a = this.t;
    if (vt && e === void 0) {
      const i = a !== void 0 && a.length === 1;
      i && (e = xt.get(a)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && xt.set(a, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const sa = (t) => new Ft(typeof t == "string" ? t : t + "", void 0, ft), E = (t, ...e) => {
  const a = t.length === 1 ? t[0] : e.reduce((i, s, n) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Ft(a, t, ft);
}, ia = (t, e) => {
  if (vt) t.adoptedStyleSheets = e.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of e) {
    const i = document.createElement("style"), s = et.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = a.cssText, t.appendChild(i);
  }
}, kt = vt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let a = "";
  for (const i of e.cssRules) a += i.cssText;
  return sa(a);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: oa, defineProperty: na, getOwnPropertyDescriptor: ra, getOwnPropertyNames: la, getOwnPropertySymbols: da, getPrototypeOf: pa } = Object, ie = globalThis, St = ie.trustedTypes, ca = St ? St.emptyScript : "", ot = ie.reactiveElementPolyfillSupport, Te = (t, e) => t, at = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ca : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let a = t;
  switch (e) {
    case Boolean:
      a = t !== null;
      break;
    case Number:
      a = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        a = JSON.parse(t);
      } catch {
        a = null;
      }
  }
  return a;
} }, bt = (t, e) => !oa(t, e), At = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ie.litPropertyMetadata ?? (ie.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Ae = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, a = At) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(e, a), !a.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, a);
      s !== void 0 && na(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, a, i) {
    const { get: s, set: n } = ra(this.prototype, e) ?? { get() {
      return this[a];
    }, set(r) {
      this[a] = r;
    } };
    return { get: s, set(r) {
      const p = s == null ? void 0 : s.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, p, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? At;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Te("elementProperties"))) return;
    const e = pa(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Te("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Te("properties"))) {
      const a = this.properties, i = [...la(a), ...da(a)];
      for (const s of i) this.createProperty(s, a[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const a = litPropertyMetadata.get(e);
      if (a !== void 0) for (const [i, s] of a) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, i] of this.elementProperties) {
      const s = this._$Eu(a, i);
      s !== void 0 && this._$Eh.set(s, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const a = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) a.unshift(kt(s));
    } else e !== void 0 && a.push(kt(e));
    return a;
  }
  static _$Eu(e, a) {
    const i = a.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((a) => this.enableUpdating = a), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((a) => a(this));
  }
  addController(e) {
    var a;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((a = e.hostConnected) == null || a.call(e));
  }
  removeController(e) {
    var a;
    (a = this._$EO) == null || a.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), a = this.constructor.elementProperties;
    for (const i of a.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ia(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((a) => {
      var i;
      return (i = a.hostConnected) == null ? void 0 : i.call(a);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((a) => {
      var i;
      return (i = a.hostDisconnected) == null ? void 0 : i.call(a);
    });
  }
  attributeChangedCallback(e, a, i) {
    this._$AK(e, i);
  }
  _$ET(e, a) {
    var n;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : at).toAttribute(a, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, a) {
    var n, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const p = i.getPropertyOptions(s), l = typeof p.converter == "function" ? { fromAttribute: p.converter } : ((n = p.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? p.converter : at;
      this._$Em = s;
      const c = l.fromAttribute(a, p.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, a, i, s = !1, n) {
    var r;
    if (e !== void 0) {
      const p = this.constructor;
      if (s === !1 && (n = this[e]), i ?? (i = p.getPropertyOptions(e)), !((i.hasChanged ?? bt)(n, a) || i.useDefault && i.reflect && n === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(p._$Eu(e, i)))) return;
      this.C(e, a, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, a, { useDefault: i, reflect: s, wrapped: n }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? a ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (a = void 0), this._$AL.set(e, a)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (a) {
      Promise.reject(a);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: p } = r, l = this[n];
        p !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
      }
    }
    let e = !1;
    const a = this._$AL;
    try {
      e = this.shouldUpdate(a), e ? (this.willUpdate(a), (i = this._$EO) == null || i.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(a)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(a);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var a;
    (a = this._$EO) == null || a.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((a) => this._$ET(a, this[a]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Ae.elementStyles = [], Ae.shadowRootOptions = { mode: "open" }, Ae[Te("elementProperties")] = /* @__PURE__ */ new Map(), Ae[Te("finalized")] = /* @__PURE__ */ new Map(), ot == null || ot({ ReactiveElement: Ae }), (ie.reactiveElementVersions ?? (ie.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = globalThis, Mt = (t) => t, st = We.trustedTypes, zt = st ? st.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Zt = "$lit$", se = `lit$${Math.random().toFixed(9).slice(2)}$`, Gt = "?" + se, ha = `<${Gt}>`, _e = document, Be = () => _e.createComment(""), Ve = (t) => t === null || typeof t != "object" && typeof t != "function", yt = Array.isArray, ua = (t) => yt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", nt = `[ 	
\f\r]`, Oe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pt = /-->/g, Et = />/g, pe = RegExp(`>|${nt}(?:([^\\s"'>=/]+)(${nt}*=${nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), jt = /'/g, Ot = /"/g, qt = /^(?:script|style|textarea|title)$/i, Kt = (t) => (e, ...a) => ({ _$litType$: t, strings: e, values: a }), d = Kt(1), j = Kt(2), Me = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Ct = /* @__PURE__ */ new WeakMap(), he = _e.createTreeWalker(_e, 129);
function Yt(t, e) {
  if (!yt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return zt !== void 0 ? zt.createHTML(e) : e;
}
const _a = (t, e) => {
  const a = t.length - 1, i = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Oe;
  for (let p = 0; p < a; p++) {
    const l = t[p];
    let c, u, h = -1, v = 0;
    for (; v < l.length && (r.lastIndex = v, u = r.exec(l), u !== null); ) v = r.lastIndex, r === Oe ? u[1] === "!--" ? r = Pt : u[1] !== void 0 ? r = Et : u[2] !== void 0 ? (qt.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = pe) : u[3] !== void 0 && (r = pe) : r === pe ? u[0] === ">" ? (r = s ?? Oe, h = -1) : u[1] === void 0 ? h = -2 : (h = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? pe : u[3] === '"' ? Ot : jt) : r === Ot || r === jt ? r = pe : r === Pt || r === Et ? r = Oe : (r = pe, s = void 0);
    const g = r === pe && t[p + 1].startsWith("/>") ? " " : "";
    n += r === Oe ? l + ha : h >= 0 ? (i.push(c), l.slice(0, h) + Zt + l.slice(h) + se + g) : l + se + (h === -2 ? p : g);
  }
  return [Yt(t, n + (t[a] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Ue {
  constructor({ strings: e, _$litType$: a }, i) {
    let s;
    this.parts = [];
    let n = 0, r = 0;
    const p = e.length - 1, l = this.parts, [c, u] = _a(e, a);
    if (this.el = Ue.createElement(c, i), he.currentNode = this.el.content, a === 2 || a === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = he.nextNode()) !== null && l.length < p; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(Zt)) {
          const v = u[r++], g = s.getAttribute(h).split(se), f = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: n, name: f[2], strings: g, ctor: f[1] === "." ? ga : f[1] === "?" ? va : f[1] === "@" ? fa : it }), s.removeAttribute(h);
        } else h.startsWith(se) && (l.push({ type: 6, index: n }), s.removeAttribute(h));
        if (qt.test(s.tagName)) {
          const h = s.textContent.split(se), v = h.length - 1;
          if (v > 0) {
            s.textContent = st ? st.emptyScript : "";
            for (let g = 0; g < v; g++) s.append(h[g], Be()), he.nextNode(), l.push({ type: 2, index: ++n });
            s.append(h[v], Be());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Gt) l.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(se, h + 1)) !== -1; ) l.push({ type: 7, index: n }), h += se.length - 1;
      }
      n++;
    }
  }
  static createElement(e, a) {
    const i = _e.createElement("template");
    return i.innerHTML = e, i;
  }
}
function ze(t, e, a = t, i) {
  var r, p;
  if (e === Me) return e;
  let s = i !== void 0 ? (r = a._$Co) == null ? void 0 : r[i] : a._$Cl;
  const n = Ve(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((p = s == null ? void 0 : s._$AO) == null || p.call(s, !1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, a, i)), i !== void 0 ? (a._$Co ?? (a._$Co = []))[i] = s : a._$Cl = s), s !== void 0 && (e = ze(t, s._$AS(t, e.values), s, i)), e;
}
class ma {
  constructor(e, a) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = a;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: a }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? _e).importNode(a, !0);
    he.currentNode = s;
    let n = he.nextNode(), r = 0, p = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new Ze(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new ba(n, this, e)), this._$AV.push(c), l = i[++p];
      }
      r !== (l == null ? void 0 : l.index) && (n = he.nextNode(), r++);
    }
    return he.currentNode = _e, s;
  }
  p(e) {
    let a = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, a), a += i.strings.length - 2) : i._$AI(e[a])), a++;
  }
}
class Ze {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, a, i, s) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = a, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const a = this._$AM;
    return a !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = a.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, a = this) {
    e = ze(this, e, a), Ve(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== Me && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ua(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && Ve(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_e.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: a, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Ue.createElement(Yt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(a);
    else {
      const r = new ma(s, this), p = r.u(this.options);
      r.p(a), this.T(p), this._$AH = r;
    }
  }
  _$AC(e) {
    let a = Ct.get(e.strings);
    return a === void 0 && Ct.set(e.strings, a = new Ue(e)), a;
  }
  k(e) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let i, s = 0;
    for (const n of e) s === a.length ? a.push(i = new Ze(this.O(Be()), this.O(Be()), this, this.options)) : i = a[s], i._$AI(n), s++;
    s < a.length && (this._$AR(i && i._$AB.nextSibling, s), a.length = s);
  }
  _$AR(e = this._$AA.nextSibling, a) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, a); e !== this._$AB; ) {
      const s = Mt(e).nextSibling;
      Mt(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var a;
    this._$AM === void 0 && (this._$Cv = e, (a = this._$AP) == null || a.call(this, e));
  }
}
class it {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, a, i, s, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = a, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, a = this, i, s) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = ze(this, e, a, 0), r = !Ve(e) || e !== this._$AH && e !== Me, r && (this._$AH = e);
    else {
      const p = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = ze(this, p[i + l], a, l), c === Me && (c = this._$AH[l]), r || (r = !Ve(c) || c !== this._$AH[l]), c === _ ? e = _ : e !== _ && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ga extends it {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class va extends it {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class fa extends it {
  constructor(e, a, i, s, n) {
    super(e, a, i, s, n), this.type = 5;
  }
  _$AI(e, a = this) {
    if ((e = ze(this, e, a, 0) ?? _) === Me) return;
    const i = this._$AH, s = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== _ && (i === _ || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var a;
    typeof this._$AH == "function" ? this._$AH.call(((a = this.options) == null ? void 0 : a.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ba {
  constructor(e, a, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ze(this, e);
  }
}
const rt = We.litHtmlPolyfillSupport;
rt == null || rt(Ue, Ze), (We.litHtmlVersions ?? (We.litHtmlVersions = [])).push("3.3.3");
const ya = (t, e, a) => {
  const i = (a == null ? void 0 : a.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (a == null ? void 0 : a.renderBefore) ?? null;
    i._$litPart$ = s = new Ze(e.insertBefore(Be(), n), n, void 0, a ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = globalThis;
class z extends Ae {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var a;
    const e = super.createRenderRoot();
    return (a = this.renderOptions).renderBefore ?? (a.renderBefore = e.firstChild), e;
  }
  update(e) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ya(a, this.renderRoot, this.renderOptions);
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
    return Me;
  }
}
var Ut;
z._$litElement$ = !0, z.finalized = !0, (Ut = ue.litElementHydrateSupport) == null || Ut.call(ue, { LitElement: z });
const lt = ue.litElementPolyfillSupport;
lt == null || lt({ LitElement: z });
(ue.litElementVersions ?? (ue.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = (t) => (e, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wa = { attribute: !0, type: String, converter: at, reflect: !1, hasChanged: bt }, $a = (t = wa, e, a) => {
  const { kind: i, metadata: s } = a;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(a.name, t), i === "accessor") {
    const { name: r } = a;
    return { set(p) {
      const l = e.get.call(this);
      e.set.call(this, p), this.requestUpdate(r, l, t, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(r, void 0, t, p), p;
    } };
  }
  if (i === "setter") {
    const { name: r } = a;
    return function(p) {
      const l = this[r];
      e.call(this, p), this.requestUpdate(r, l, t, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function m(t) {
  return (e, a) => typeof a == "object" ? $a(t, e, a) : ((i, s, n) => {
    const r = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, i), r ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, a);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(t) {
  return m({ ...t, state: !0, attribute: !1 });
}
const xa = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), ka = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), Jt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), Sa = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Xt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), Aa = (t, e, a) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: a }), Ma = (t, e, a) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_ev_min_power", load_id: e, power_w: a }), za = (t) => t.connection.sendMessagePromise({ type: "solarmind/notify/test" }), Qt = (t, e, a, i) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: a, load_id: i }), Pa = (t) => t.connection.sendMessagePromise({ type: "solarmind/plan" }), Dt = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), Ea = (t) => t.connection.sendMessagePromise({ type: "solarmind/logs" }), ja = (t) => t.connection.sendMessagePromise({ type: "solarmind/logs/clear" }), Oa = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/logs/verbose", enabled: e }), Nt = {
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
  "s.cat.meter": "Energiemeter",
  "s.cat.pv": "Zonnepanelen",
  "s.cat.peak": "Capaciteitstarief",
  "s.cat.night": "Nachtvenster",
  "s.cat.prices": "Prijzen",
  "s.cat.notify": "Meldingen",
  "s.cat.debug": "Debug",
  "s.cat.debug.summary": "Logboek van SolarMind",
  "s.cat.debug.desc": "De laatste 500 logregels van SolarMind zelf. Ze staan in het geheugen, dus na een herstart van Home Assistant begint de lijst leeg.",
  "logs.verbose": "Uitgebreide logging",
  "logs.verbose.help": "Toont ook debugregels (ook in het HA-log). Gaat vanzelf uit bij een herstart.",
  "logs.level.all": "Alles",
  "logs.level.INFO": "Info",
  "logs.level.WARNING": "Waarschuwingen",
  "logs.level.ERROR": "Fouten",
  "logs.search": "Zoeken",
  "logs.refresh": "Vernieuwen",
  "logs.copy": "Kopiëren",
  "logs.copied": "Gekopieerd.",
  "logs.copy_failed": "Kopiëren lukte niet.",
  "logs.clear": "Wissen",
  "logs.auto": "Automatisch vernieuwen",
  "logs.count": "{n} van {t} regels",
  "logs.empty": "Nog geen logregels.",
  "logs.loading": "Laden...",
  "panel.stale": "SolarMind {server} is geïnstalleerd, maar je browser toont nog paneel {panel}.",
  "panel.reload": "Herladen",
  "s.version": "Versie {v}",
  "s.cat.notify.desc": "Pushmeldingen naar je gsm (Home Assistant-app) of een andere notify-dienst.",
  "s.notify_services": "Sturen naar",
  "s.notify_services.help": "Je gsm verschijnt hier zodra de Home Assistant-app erop geïnstalleerd en aangemeld is.",
  "s.notify_peak": "Piekbewaking",
  "s.notify_peak.help": "Als de kwartierpiek dreigt overschreden te worden en toestellen afgeschakeld worden, en als ze weer mogen.",
  "s.notify_ev": "Auto",
  "s.notify_ev.help": "Als de auto een laadopdracht weigert, en als hij klaar is met laden.",
  "s.notify_faults": "Storingen",
  "s.notify_faults.help": "Als een verbruiker of de netmeter langer dan 5 minuten niet bereikbaar is, en als hij terug is.",
  "s.notify.summary": "Naar {n} toestel(len)",
  "s.notify.test": "Testmelding sturen",
  "s.notify.test_sent": "Verstuurd, kijk op je gsm.",
  "form.no_options": "Geen notify-diensten gevonden.",
  "s.cat.general.desc": "Zet de sturing uit om SolarMind enkel te laten meten zonder iets te schakelen.",
  "s.cat.meter.desc": "Het netvermogen is de basis van alles: hieruit berekent SolarMind het overschot. Kies je digitale meter (P1, HomeWizard, ...).",
  "s.cat.pv.desc": "De PV-productie dient voor de grafieken en om te weten hoeveel zon er vandaag al was. De voorspelling stel je in onder Zonnevoorspelling.",
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
  "a.rhythm_meta": "gem. per uur, 14 dagen",
  "type.battery": "Thuisbatterij (laadt en levert)",
  "mode.self": "Zelfverbruik",
  "mode.self.desc": "Laadt met overschot en dekt 's avonds en 's nachts je huisverbruik.",
  "mode.bat.solar": "Enkel zon",
  "mode.bat.solar.desc": "Laadt alleen met overschot. Ontlaadt enkel om de kwartierpiek op te vangen.",
  "mode.bat.solar_night": "Zon + nacht",
  "mode.bat.solar_night.desc": "Zoals Zelfverbruik, en laadt 's nachts bij van het net als morgen weinig zon voorspeld wordt.",
  "mode.bat.on": "Laden",
  "mode.bat.on.desc": "Laadt meteen op vol vermogen tot het doel-%, ook van het net (binnen de piekgrens).",
  "mode.bat.off": "Uit",
  "mode.bat.off.desc": "SolarMind stuurt niets: de omvormer regelt de batterij zelf.",
  "reason.self_consumption": "Dekt het huis",
  "reason.reserve": "Reserve bereikt",
  "reason.battery_full": "Batterij vol",
  "f.section.battery": "Batterij",
  "f.bat_soc_entity": "Laadtoestand (SoC)",
  "f.bat_power_entity": "Batterijvermogen",
  "f.bat_power_entity.help": "Gemeten vermogen van de batterij. Nodig om het overschot juist te berekenen.",
  "f.bat_power_sign": "Teken van het vermogen",
  "f.bat_setpoint_entity": "Vermogen-setpoint",
  "f.bat_setpoint_entity.help": "Een number-entity voor het laad/ontlaadvermogen (W of kW). Leeg laten als je aparte laad- en ontlaad-entities hebt.",
  "f.bat_setpoint_sign": "Teken van het setpoint",
  "f.bat_charge_entity": "Laadvermogen",
  "f.bat_discharge_entity": "Ontlaadvermogen",
  "f.bat_mode_entity": "Modus van de omvormer",
  "f.bat_mode_entity.help": "Optioneel: een select die de omvormer in externe sturing zet, en terug naar automatisch als SolarMind loslaat.",
  "f.bat_mode_remote_option": "Optie voor externe sturing",
  "f.bat_mode_auto_option": "Optie voor automatisch",
  "f.bat_capacity_kwh": "Bruikbare capaciteit",
  "f.bat_max_charge_w": "Max. laadvermogen",
  "f.bat_max_discharge_w": "Max. ontlaadvermogen",
  "f.bat_deadband_w": "Dode zone",
  "f.bat_deadband_w.help": "Kleinere wijzigingen worden niet doorgestuurd",
  "f.bat_min_soc": "Reserve (min. %)",
  "f.bat_min_soc.help": "Zelfverbruik stopt hier, bv. als reserve bij stroompanne",
  "f.bat_max_soc": "Max. % met zon",
  "f.bat_target_soc": "Doel-% van het net",
  "f.bat_target_soc.help": "Tot hier laadt hij van het net (modus Laden en nachtladen)",
  "f.bat_discharge_for": "Ontladen voor",
  "f.bat_peak_support": "Piek opvangen",
  "f.bat_peak_min_soc": "Piekreserve tot",
  "f.bat_sign.charge_positive": "Positief = laden",
  "f.bat_sign.discharge_positive": "Positief = ontladen",
  "f.bat_for.house": "Enkel het huis",
  "f.bat_for.house_switch": "Huis + boilers",
  "f.bat_for.all": "Alles (ook de auto)",
  "detail.bat_control": "Sturing",
  "detail.bat_power": "Vermogen",
  "detail.bat_power_sub": "Maximaal laden en ontladen",
  "detail.bat_limits": "Grenzen",
  "detail.bat_limits_sub": "Reserve {min}, met zon tot {max}",
  "detail.bat_for_help": "Gestuurde verbruikers die van het net draaien. Een verbruiker in modus Zon krijgt nooit batterijstroom.",
  "detail.bat_peak_help": "Ontlaadt als de kwartierpiek te hoog dreigt te worden, nog voor verbruikers afgeschakeld worden",
  "detail.bat_peak_min_help": "Voor de piek mag de batterij tot hier leeg, ook onder de reserve",
  "detail.night_when_bat": "Als de batterij 's avonds onder {soc}% zit",
  "hint.bat_night": "Laadt vannacht bij",
  "hint.bat_peak": "Vangt de kwartierpiek op",
  "hint.bat_stored": "opgeslagen",
  "eta.bat_full": "vol om {t}",
  "eta.bat_empty": "reserve om {t}",
  "load.charged_today": "geladen vandaag",
  "load.discharged": "ontladen",
  "a.charged": "Geladen",
  "a.discharged": "Ontladen",
  "a.efficiency": "Rendement",
  "a.cycles": "Volle cycli",
  "s.group.measure": "Meten",
  "s.group.control": "Slim sturen",
  "s.group.info": "Kosten en meldingen",
  "s.group.system": "Systeem",
  "s.cat.forecast": "Zonnevoorspelling",
  "s.cat.forecast.desc": "Met de zon die vandaag nog verwacht wordt (Solcast, Forecast.Solar) kan SolarMind slimmer kiezen wie het overschot krijgt. Met de voorspelling voor morgen slaan verbruikers in Zon + nacht de nachtaanvulling over als morgen zonnig wordt.",
  "s.forecast.summary": "Nog {kwh} vandaag",
  "s.pv_power_entity.help": "Voor de grafieken, en om te weten hoeveel zon er vandaag al was",
  "s.pv_forecast_remaining_entity": "Voorspelling rest van vandaag",
  "s.pv_forecast_remaining_entity.help": "Solcast: Forecast Remaining Today. Forecast.Solar: Estimated energy production - remaining today. Leeg: voorspelling vandaag min wat al opgewekt is.",
  "s.pv_forecast_today_entity": "Voorspelling vandaag",
  "s.pv_forecast_today_entity.help": "Sensor met de verwachte kWh voor vandaag",
  "s.pv_forecast_tomorrow_entity": "Voorspelling morgen",
  "s.pv_forecast_tomorrow_entity.help": "Gebruikt door Zon + nacht om de nachtaanvulling over te slaan",
  "s.forecast_ev_priority": "Auto voor boilers op een zonnige dag",
  "s.forecast_ev_priority.help": "Komt er vandaag nog genoeg zon om de boilers later te vullen, dan krijgt de auto het overschot eerst. Daarna geldt weer je gewone volgorde.",
  "s.forecast_ev_floor_pause": "Minimaal laadvermogen wacht op de zon",
  "s.forecast_ev_floor_pause.help": "In modus Zon vult de auto zijn minimale laadvermogen niet aan van het net zolang er vandaag nog genoeg zon verwacht wordt.",
  "s.forecast_ev_floor_kwh": "Genoeg zon is minstens",
  "s.forecast_ev_floor_kwh.help": "Bruikbare zon die vandaag nog moet komen",
  "s.forecast_factor_pct": "Reken op dit deel van de voorspelling",
  "s.forecast_factor_pct.help": "Voorspellingen zijn vaak wat te optimistisch. 80% is een veilige start.",
  "s.forecast_house_kwh": "Eigen verbruik van het huis",
  "s.forecast_house_kwh.help": "Zon die het huis vandaag zelf nog opgebruikt, die gaat eraf",
  "s.plan.none": "Nog geen voorspelling: kies een sensor hierboven.",
  "s.plan.remaining": "Nog verwacht vandaag:",
  "s.plan.usable": "bruikbaar",
  "s.plan.boilers": "Boilers hebben vandaag nog nodig:",
  "s.plan.ev_first": "Auto krijgt nu voorrang:",
  "s.plan.floor_paused": "Minimaal laadvermogen wacht op de zon:",
  "s.plan.yes": "ja",
  "s.plan.no": "nee",
  "s.cat.general": "Sturing",
  "reason.forecast_wait": "Wacht op voorspelde zon",
  "reason.planned": "Gepland van het net",
  "reason.plan_wait": "Wacht op gepland moment",
  "s.cat.planning": "Voorspellend plannen",
  "s.cat.planning.desc": "Zoals RoomMind voor verwarming: SolarMind voorspelt per kwartier je zon en je huisverbruik, plant de komende uren voor elke verbruiker en plant elke minuut opnieuw. Wat de zon niet zal geven, komt van het net op de momenten met de laagste afname, onder je piekgrens. Elk onderdeel zet je hieronder apart aan of uit. In Analytics zie je de planning.",
  "s.planning.summary": "Aan · {n} met netenergie gepland",
  "s.planning.on": "Aan",
  "s.plan_enabled": "Voorspellend plannen",
  "s.plan_enabled.help": "Hoofdschakelaar. Uit: SolarMind werkt zoals vroeger, met de vaste drempels.",
  "s.plan_boiler_night": "Boilers: 's nachts alleen het tekort bijvullen",
  "s.plan_boiler_night.help": "Voor boilers in Zon + nacht. SolarMind kent hun dagelijkse behoefte (geleerd, ingesteld of uit de temperatuur) en vult 's nachts enkel aan wat de zon vandaag niet gaf. Dit vervangt de drempel en de hoeveelheid van de nachtaanvulling.",
  "s.plan_ev": "Auto: nachtladen plannen en vertrektijd halen",
  "s.plan_ev.help": "Een auto in Zon + nacht laadt 's nachts alleen tot het doel-% wat de zon niet geeft, gespreid over de nacht. Met een vertrektijd (in te stellen bij de auto) haalt hij het gekozen % tegen dat uur, ook in modus Zon.",
  "s.plan_battery_night": "Thuisbatterij: 's nachts alleen bijladen wat morgen ontbreekt",
  "s.plan_battery_night.help": "Voor een batterij in Zon + nacht: laadt 's nachts van het net enkel het deel dat de zon van morgen niet zal leveren.",
  "s.plan_peak_spread": "Netenergie spreiden onder de piekgrens",
  "s.plan_peak_spread.help": "Boilers, auto en batterij komen 's nachts niet tegelijk op, en elk kwartier blijft onder je piekgrens. Uit: netenergie start meteen aan vol vermogen.",
  "s.plan_learn_base": "Huisverbruik leren",
  "s.plan_learn_base.help": "Gemiddeld verbruik van je huis per uur, uit de laatste 14 dagen. Uit: een vaste waarde.",
  "s.plan_base_w": "Vast huisverbruik",
  "s.plan_pv_estimate": "Solcast-schatting",
  "s.plan_pv_estimate.pv_estimate": "Gewoon (P50)",
  "s.plan_pv_estimate.pv_estimate10": "Voorzichtig (P10)",
  "s.plan_pv_estimate.help": "Alleen voor Solcast. Zonder detail per halfuur spreidt SolarMind het dagtotaal over de dag.",
  "s.plan_horizon_h": "Vooruit plannen",
  "s.plan_horizon_h.help": "Tussen 6 en 48 uur",
  "f.section.plan": "Planning",
  "f.boiler_volume_l": "Inhoud boiler",
  "f.boiler_volume_l.help": "Met de temperatuur berekent SolarMind hoeveel energie de boiler nog nodig heeft",
  "f.boiler_target_temperature": "Opwarmen tot",
  "f.boiler_target_temperature.help": "Leeg: de stoptemperatuur, anders 60 °C",
  "f.plan_need_kwh": "Dagelijkse behoefte",
  "f.plan_need_kwh.help": "Leeg: SolarMind leert het uit de dagen dat de boiler vol raakte",
  "f.ev_departure_enabled": "Vertrektijd",
  "f.ev_departure_time": "Vertrek om",
  "f.ev_departure_soc": "Geladen tot minstens",
  "f.ev_departure_days": "Op deze dagen",
  "detail.plan_inactive": "Voorspellend plannen staat uit",
  "detail.plan_need": "Dagelijkse behoefte",
  "detail.plan_need_temp": "Berekend uit de temperatuur en de inhoud",
  "detail.plan_need_set": "Zelf ingesteld",
  "detail.plan_need_learned": "Geleerd: {kwh} per dag",
  "detail.plan_need_learning": "Wordt nog geleerd (tot dan de nachtdrempel)",
  "detail.departure_help": "Tegen dat uur minstens het gekozen % geladen: eerst zon, de rest van het net",
  "detail.departure": "Vertrek",
  "detail.every_day": "Elke dag",
  "detail.plan_now": "Nu gepland",
  "detail.plan_now_sub": "Nodig {need}, zon verwacht {sun}",
  "day.0": "ma",
  "day.1": "di",
  "day.2": "wo",
  "day.3": "do",
  "day.4": "vr",
  "day.5": "za",
  "day.6": "zo",
  "plan.title": "Planning",
  "plan.disabled": "Voorspellend plannen staat uit. Zet het aan onder Instellingen → Voorspellend plannen.",
  "plan.none": "Nog geen planning. Die verschijnt binnen een minuut.",
  "plan.updated": "Gepland om {t}",
  "plan.pv_source.detailed": "zon: voorspelling per halfuur",
  "plan.pv_source.detailed+day": "zon: per halfuur, aangevuld met dagtotaal",
  "plan.pv_source.day": "zon: dagtotaal gespreid over de dag",
  "plan.pv_source.none": "geen zonnevoorspelling ingesteld",
  "plan.row.pv": "Zon",
  "plan.row.house": "Huis",
  "plan.row.import": "Afname",
  "plan.hint": "Wijs een vakje aan (of tik erop) om de kwartieren van dat uur te zien.",
  "plan.from_sun": "van zon",
  "plan.from_grid": "van het net",
  "plan.idle": "uit",
  "plan.need": "Nodig",
  "plan.src.temperature": "(temperatuur)",
  "plan.src.learned": "(geleerd)",
  "plan.src.set": "(ingesteld)",
  "plan.src.night": "(nachtdrempel)",
  "plan.src.default": "(standaard)",
  "plan.src.soc": "",
  "plan.goal.by": "tegen {t}",
  "plan.goal.departure": "tegen vertrek {t}",
  "plan.sun_expected": "zon verwacht",
  "plan.grid_at": "{kwh} van het net, {from}–{to}",
  "plan.no_grid": "geen net nodig",
  "plan.sun_only": "enkel zon",
  "plan.short": "{kwh} haalt de planning niet voor de deadline",
  "plan.over_limit": "Past niet volledig onder de piekgrens",
  "plan.chart": "Vandaag en de komende uren",
  "plan.pv_measured": "Zon gemeten",
  "plan.pv_predicted": "Zon verwacht",
  "plan.house_measured": "Huis gemeten",
  "plan.house_predicted": "Huis verwacht",
  "plan.import_planned": "Afname gepland",
  "plan.legend.sun": "Zon",
  "plan.legend.grid": "Net",
  "plan.legend.night": "Nachtvenster",
  "plan.legend.over": "Boven piekgrens",
  "site.ev_first": "Auto eerst (zonnige dag)"
}, Ca = {
  "s.cat.notify": "Notifications",
  "s.cat.debug": "Debug",
  "s.cat.debug.summary": "SolarMind log",
  "s.cat.debug.desc": "The last 500 log lines from SolarMind itself. They are kept in memory, so the list starts empty after a Home Assistant restart.",
  "logs.verbose": "Verbose logging",
  "logs.verbose.help": "Also shows debug lines (in the HA log too). Turns off by itself on restart.",
  "logs.level.all": "All",
  "logs.level.INFO": "Info",
  "logs.level.WARNING": "Warnings",
  "logs.level.ERROR": "Errors",
  "logs.search": "Search",
  "logs.refresh": "Refresh",
  "logs.copy": "Copy",
  "logs.copied": "Copied.",
  "logs.copy_failed": "Copy failed.",
  "logs.clear": "Clear",
  "logs.auto": "Auto refresh",
  "logs.count": "{n} of {t} lines",
  "logs.empty": "No log lines yet.",
  "logs.loading": "Loading...",
  "panel.stale": "SolarMind {server} is installed, but your browser still shows panel {panel}.",
  "panel.reload": "Reload",
  "s.version": "Version {v}",
  "s.cat.notify.desc": "Push notifications to your phone (Home Assistant app) or another notify service.",
  "s.notify_services": "Send to",
  "s.notify_services.help": "Your phone shows up here once the Home Assistant app is installed and signed in.",
  "s.notify_peak": "Peak guard",
  "s.notify_peak.help": "When the quarter-hour peak is about to be exceeded and devices are switched off, and when they may run again.",
  "s.notify_ev": "Car",
  "s.notify_ev.help": "When the car refuses a charging command, and when it has finished charging.",
  "s.notify_faults": "Problems",
  "s.notify_faults.help": "When a load or the grid meter is unreachable for more than 5 minutes, and when it is back.",
  "s.notify.summary": "To {n} device(s)",
  "s.notify.test": "Send test notification",
  "s.notify.test_sent": "Sent, check your phone.",
  "form.no_options": "No notify services found.",
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
  "mode.on": "On",
  "type.battery": "Home battery (charges and delivers)",
  "mode.self": "Self consumption",
  "mode.self.desc": "Charges on surplus and covers the house in the evening and at night.",
  "mode.bat.solar": "Solar only",
  "mode.bat.solar.desc": "Charges only on surplus. Discharges only to catch the quarter peak.",
  "mode.bat.solar_night": "Solar + night",
  "mode.bat.solar_night.desc": "Like self consumption, and tops up from the grid at night when little sun is forecast.",
  "mode.bat.on": "Charge",
  "mode.bat.on.desc": "Charges at full power up to the target %, also from the grid (within the peak limit).",
  "mode.bat.off": "Off",
  "mode.bat.off.desc": "SolarMind sends nothing: the inverter controls the battery itself.",
  "reason.self_consumption": "Covering the house",
  "reason.reserve": "At reserve",
  "reason.battery_full": "Battery full",
  "f.section.battery": "Battery",
  "f.bat_soc_entity": "State of charge (SoC)",
  "f.bat_power_entity": "Battery power",
  "f.bat_power_entity.help": "Measured battery power. Needed to compute the surplus correctly.",
  "f.bat_power_sign": "Power sign",
  "f.bat_setpoint_entity": "Power setpoint",
  "f.bat_setpoint_entity.help": "A number entity for the charge/discharge power (W or kW). Leave empty if you have separate charge and discharge entities.",
  "f.bat_setpoint_sign": "Setpoint sign",
  "f.bat_charge_entity": "Charge power",
  "f.bat_discharge_entity": "Discharge power",
  "f.bat_mode_entity": "Inverter mode",
  "f.bat_mode_entity.help": "Optional: a select that puts the inverter in remote control, and back to automatic when SolarMind lets go.",
  "f.bat_mode_remote_option": "Option for remote control",
  "f.bat_mode_auto_option": "Option for automatic",
  "f.bat_capacity_kwh": "Usable capacity",
  "f.bat_max_charge_w": "Max. charge power",
  "f.bat_max_discharge_w": "Max. discharge power",
  "f.bat_deadband_w": "Dead band",
  "f.bat_deadband_w.help": "Smaller changes are not sent",
  "f.bat_min_soc": "Reserve (min. %)",
  "f.bat_min_soc.help": "Self consumption stops here, e.g. as a reserve for power cuts",
  "f.bat_max_soc": "Max. % on solar",
  "f.bat_target_soc": "Target % from the grid",
  "f.bat_target_soc.help": "Grid charging stops here (Charge mode and night top-up)",
  "f.bat_discharge_for": "Discharge for",
  "f.bat_peak_support": "Catch peaks",
  "f.bat_peak_min_soc": "Peak reserve down to",
  "f.bat_sign.charge_positive": "Positive = charging",
  "f.bat_sign.discharge_positive": "Positive = discharging",
  "f.bat_for.house": "Only the house",
  "f.bat_for.house_switch": "House + boilers",
  "f.bat_for.all": "Everything (also the car)",
  "detail.bat_control": "Control",
  "detail.bat_power": "Power",
  "detail.bat_power_sub": "Maximum charge and discharge",
  "detail.bat_limits": "Limits",
  "detail.bat_limits_sub": "Reserve {min}, solar up to {max}",
  "detail.bat_for_help": "Managed loads running from the grid. A load in Solar mode never gets battery power.",
  "detail.bat_peak_help": "Discharges when the quarter peak threatens to rise, before loads are switched off",
  "detail.bat_peak_min_help": "For peaks the battery may go down to here, also below the reserve",
  "detail.night_when_bat": "When the battery is below {soc}% in the evening",
  "hint.bat_night": "Tops up tonight",
  "hint.bat_peak": "Catching the quarter peak",
  "hint.bat_stored": "stored",
  "eta.bat_full": "full at {t}",
  "eta.bat_empty": "reserve at {t}",
  "load.charged_today": "charged today",
  "load.discharged": "discharged",
  "a.charged": "Charged",
  "a.discharged": "Discharged",
  "a.efficiency": "Efficiency",
  "a.cycles": "Full cycles",
  "s.group.measure": "Measuring",
  "s.group.control": "Smart control",
  "s.group.info": "Costs and notifications",
  "s.group.system": "System",
  "s.cat.forecast": "Solar forecast",
  "s.cat.forecast.desc": "With the sun still expected today (Solcast, Forecast.Solar) SolarMind can choose better who gets the surplus. With tomorrow's forecast, loads in Solar + night skip the night top-up when tomorrow will be sunny.",
  "s.forecast.summary": "{kwh} still to come today",
  "s.pv_power_entity.help": "For the charts, and to know how much sun there was today",
  "s.pv_forecast_remaining_entity": "Forecast remaining today",
  "s.pv_forecast_remaining_entity.help": "Solcast: Forecast Remaining Today. Forecast.Solar: Estimated energy production - remaining today. Empty: forecast today minus what was produced.",
  "s.pv_forecast_today_entity": "Forecast today",
  "s.pv_forecast_today_entity.help": "Sensor with the expected kWh for today",
  "s.pv_forecast_tomorrow_entity": "Forecast tomorrow",
  "s.pv_forecast_tomorrow_entity.help": "Used by Solar + night to skip the night top-up",
  "s.forecast_ev_priority": "Car before boilers on a sunny day",
  "s.forecast_ev_priority.help": "When enough sun is still coming today to fill the boilers later, the car gets the surplus first. After that your normal order applies again.",
  "s.forecast_ev_floor_pause": "Minimum charging power waits for the sun",
  "s.forecast_ev_floor_pause.help": "In Solar mode the car does not top up its minimum power from the grid while enough sun is still expected today.",
  "s.forecast_ev_floor_kwh": "Enough sun is at least",
  "s.forecast_ev_floor_kwh.help": "Usable sun still to come today",
  "s.forecast_factor_pct": "Count on this share of the forecast",
  "s.forecast_factor_pct.help": "Forecasts tend to be a bit optimistic. 80% is a safe start.",
  "s.forecast_house_kwh": "The house's own use",
  "s.forecast_house_kwh.help": "Sun the house itself still uses today, subtracted first",
  "s.plan.none": "No forecast yet: choose a sensor above.",
  "s.plan.remaining": "Still expected today:",
  "s.plan.usable": "usable",
  "s.plan.boilers": "Boilers still need today:",
  "s.plan.ev_first": "Car has priority now:",
  "s.plan.floor_paused": "Minimum charging power waits for the sun:",
  "s.plan.yes": "yes",
  "s.plan.no": "no",
  "s.cat.general": "Control",
  "reason.forecast_wait": "Waiting for forecast sun",
  "reason.planned": "Planned from the grid",
  "reason.plan_wait": "Waiting for its planned time",
  "s.cat.planning": "Predictive planning",
  "s.cat.planning.desc": "Like RoomMind does for heating: SolarMind predicts your sun and house load per quarter hour, plans the coming hours for every load and plans again every minute. What the sun will not give comes from the grid when the import is lowest, under your peak limit. Each part can be switched on or off below. Analytics shows the plan.",
  "s.planning.summary": "On · grid energy planned for {n}",
  "s.planning.on": "On",
  "s.plan_enabled": "Predictive planning",
  "s.plan_enabled.help": "Main switch. Off: SolarMind works as before, with the fixed thresholds.",
  "s.plan_boiler_night": "Boilers: at night only top up the shortfall",
  "s.plan_boiler_night.help": "For boilers in Solar + night. SolarMind knows their daily need (learned, set or from the temperature) and at night only adds what the sun did not give today. This replaces the threshold and amount of the night top-up.",
  "s.plan_ev": "Car: plan night charging and meet the departure time",
  "s.plan_ev.help": "A car in Solar + night only charges at night what the sun will not give, up to the target %, spread over the night. With a departure time (set on the car) it reaches the chosen % by then, also in Solar mode.",
  "s.plan_battery_night": "Home battery: at night only charge what tomorrow lacks",
  "s.plan_battery_night.help": "For a battery in Solar + night: charges from the grid at night only the part tomorrow's sun will not deliver.",
  "s.plan_peak_spread": "Spread grid energy under the peak limit",
  "s.plan_peak_spread.help": "Boilers, car and battery do not start together at night, and every quarter stays under your peak limit. Off: grid energy starts right away at full power.",
  "s.plan_learn_base": "Learn the house load",
  "s.plan_learn_base.help": "Average load of your house per hour, from the last 14 days. Off: a fixed value.",
  "s.plan_base_w": "Fixed house load",
  "s.plan_pv_estimate": "Solcast estimate",
  "s.plan_pv_estimate.pv_estimate": "Normal (P50)",
  "s.plan_pv_estimate.pv_estimate10": "Cautious (P10)",
  "s.plan_pv_estimate.help": "Solcast only. Without detail per half hour SolarMind spreads the day total over the day.",
  "s.plan_horizon_h": "Plan ahead",
  "s.plan_horizon_h.help": "Between 6 and 48 hours",
  "f.section.plan": "Planning",
  "f.boiler_volume_l": "Boiler volume",
  "f.boiler_volume_l.help": "With the temperature SolarMind works out how much energy the boiler still needs",
  "f.boiler_target_temperature": "Heat up to",
  "f.boiler_target_temperature.help": "Empty: the stop temperature, else 60 °C",
  "f.plan_need_kwh": "Daily need",
  "f.plan_need_kwh.help": "Empty: SolarMind learns it from the days the boiler got full",
  "f.ev_departure_enabled": "Departure time",
  "f.ev_departure_time": "Leave at",
  "f.ev_departure_soc": "Charged to at least",
  "f.ev_departure_days": "On these days",
  "detail.plan_inactive": "Predictive planning is off",
  "detail.plan_need": "Daily need",
  "detail.plan_need_temp": "From the temperature and the volume",
  "detail.plan_need_set": "Set by you",
  "detail.plan_need_learned": "Learned: {kwh} per day",
  "detail.plan_need_learning": "Still learning (night threshold until then)",
  "detail.departure_help": "At least the chosen % by then: sun first, the rest from the grid",
  "detail.departure": "Departure",
  "detail.every_day": "Every day",
  "detail.plan_now": "Planned now",
  "detail.plan_now_sub": "Needs {need}, sun expected {sun}",
  "day.0": "Mon",
  "day.1": "Tue",
  "day.2": "Wed",
  "day.3": "Thu",
  "day.4": "Fri",
  "day.5": "Sat",
  "day.6": "Sun",
  "plan.title": "Plan",
  "plan.disabled": "Predictive planning is off. Switch it on under Settings → Predictive planning.",
  "plan.none": "No plan yet. It appears within a minute.",
  "plan.updated": "Planned at {t}",
  "plan.pv_source.detailed": "sun: forecast per half hour",
  "plan.pv_source.detailed+day": "sun: per half hour, completed with the day total",
  "plan.pv_source.day": "sun: day total spread over the day",
  "plan.pv_source.none": "no solar forecast set",
  "plan.row.pv": "Sun",
  "plan.row.house": "House",
  "plan.row.import": "Import",
  "plan.hint": "Point at (or tap) a cell to see the quarters of that hour.",
  "plan.from_sun": "from sun",
  "plan.from_grid": "from the grid",
  "plan.idle": "off",
  "plan.need": "Needs",
  "plan.src.temperature": "(temperature)",
  "plan.src.learned": "(learned)",
  "plan.src.set": "(set)",
  "plan.src.night": "(night threshold)",
  "plan.src.default": "(default)",
  "plan.src.soc": "",
  "plan.goal.by": "by {t}",
  "plan.goal.departure": "by departure {t}",
  "plan.sun_expected": "sun expected",
  "plan.grid_at": "{kwh} from the grid, {from}–{to}",
  "plan.no_grid": "no grid needed",
  "plan.sun_only": "sun only",
  "plan.short": "{kwh} does not fit before the deadline",
  "plan.over_limit": "Does not fully fit under the peak limit",
  "plan.chart": "Today and the coming hours",
  "plan.pv_measured": "Sun measured",
  "plan.pv_predicted": "Sun expected",
  "plan.house_measured": "House measured",
  "plan.house_predicted": "House expected",
  "plan.import_planned": "Import planned",
  "plan.legend.sun": "Sun",
  "plan.legend.grid": "Grid",
  "plan.legend.night": "Night window",
  "plan.legend.over": "Over peak limit",
  "site.ev_first": "Car first (sunny day)"
};
let ea = "nl";
const Da = (t) => {
  ea = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, o = (t) => (ea === "en" ? Ca[t] ?? Nt[t] : Nt[t]) ?? t, D = E`
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
`, X = E`
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
`, A = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, ta = (t) => t == null || Number.isNaN(t) ? ["–", ""] : Math.abs(t) >= 1e3 ? [(t / 1e3).toFixed(2), "kW"] : [String(Math.round(t)), "W"], w = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, ce = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, dt = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), a = Math.round(t % 3600 / 60);
  return e ? `${e} u ${a} min` : `${a} min`;
}, Na = (t) => {
  const e = Math.max(1, Math.round(t / 60)), a = Math.floor(e / 60), i = e % 60;
  return a ? i ? `${a} u ${String(i).padStart(2, "0")}` : `${a} u` : `${i} min`;
}, Ye = (t) => {
  const e = new Date(Date.now() + t * 1e3), a = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return e.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? a : `${e.toLocaleDateString([], { weekday: "short" })} ${a}`;
}, pt = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`, La = (t) => t == null ? "–" : t >= 3600 ? `${Math.round(t / 3600 * 10) / 10} u` : t >= 60 ? `${Math.round(t / 60 * 10) / 10} min` : `${t} s`, Ia = {
  self: "mdi:home-battery-outline",
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off"
}, Re = (t) => (t == null ? void 0 : t.type) === "battery", mt = (t) => t === "battery" ? ["self", "solar", "solar_night", "on", "off"] : ["solar", "solar_night", "on", "off"], wt = (t, e) => e === "battery" && t !== "self" ? `mode.bat.${t}` : `mode.${t}`, aa = (t) => mt(t).map((e) => ({ value: e, label: o(wt(e, t)), icon: Ia[e] })), me = (t) => t === "ev" ? "mdi:ev-station" : t === "battery" ? "mdi:home-battery" : "mdi:water-boiler", He = (t) => t === "solar" ? "solar" : t === "self_consumption" ? "ok" : ["night", "always_on", "legionella", "min_soc", "min_power", "planned"].includes(t) ? "grid" : t === "peak_guard" || t === "unavailable" ? "warn" : t === "target_reached" || t === "battery_full" ? "ok" : t === "reserve" ? "warn" : "", Ta = (t) => ({
  solar: "mdi:white-balance-sunny",
  night: "mdi:weather-night",
  always_on: "mdi:power-plug",
  legionella: "mdi:bacteria-outline",
  min_soc: "mdi:battery-alert-variant-outline",
  min_power: "mdi:speedometer-slow",
  peak_guard: "mdi:transmission-tower",
  unavailable: "mdi:alert-circle-outline",
  target_reached: "mdi:check-circle-outline",
  self_consumption: "mdi:home-lightning-bolt-outline",
  reserve: "mdi:battery-10",
  battery_full: "mdi:battery",
  planned: "mdi:calendar-clock",
  plan_wait: "mdi:timer-sand"
})[t] ?? "mdi:circle-small", ke = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
var Wa = Object.defineProperty, Ra = Object.getOwnPropertyDescriptor, Ge = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? Ra(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Wa(e, a, s), s;
};
let ge = class extends z {
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
          ${t.icon ? d`<ha-icon .icon=${t.icon}></ha-icon>` : _}<span>${t.label}</span>
        </button>`
    )}
    </div>`;
  }
  _pick(t) {
    t.value !== this.value && this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: t.value }, bubbles: !0, composed: !0 }));
  }
};
ge.styles = [
  D,
  E`
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
Ge([
  m({ attribute: !1 })
], ge.prototype, "options", 2);
Ge([
  m({ attribute: !1 })
], ge.prototype, "value", 2);
Ge([
  m({ reflect: !0 })
], ge.prototype, "size", 2);
Ge([
  m({ type: Boolean, reflect: !0 })
], ge.prototype, "wrap", 2);
ge = Ge([
  C("sm-segmented")
], ge);
var Ha = Object.defineProperty, Ba = Object.getOwnPropertyDescriptor, qe = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? Ba(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Ha(e, a, s), s;
};
let ve = class extends z {
  constructor() {
    super(...arguments), this.points = [], this.max = 0, this.height = 72, this.label = "";
  }
  render() {
    const t = this.points, e = 400, a = this.height;
    if (t.length < 2) return d`<svg viewBox="0 0 ${e} ${a}" preserveAspectRatio="none" style="height:${a}px"></svg>`;
    const i = t[0][0], s = t[t.length - 1][0], n = Math.max(this.max, ...t.map((h) => h[1]), 1) * 1.1, r = (h) => (h - i) / Math.max(1, s - i) * e, p = (h) => a - h / n * (a - 4), l = (h) => t.map((v, g) => `${g ? "L" : "M"}${r(v[0]).toFixed(1)},${p(h(v)).toFixed(1)}`).join(""), c = (h, v) => {
      let g = l(h);
      for (let f = t.length - 1; f >= 0; f--) g += `L${r(t[f][0]).toFixed(1)},${p(v(t[f])).toFixed(1)}`;
      return g + "Z";
    }, u = `g${Math.random().toString(36).slice(2, 8)}`;
    return d`<svg viewBox="0 0 ${e} ${a}" preserveAspectRatio="none" style="height:${a}px">
        <defs>
          <linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--sm-solar)" stop-opacity="0.45"></stop>
            <stop offset="1" stop-color="var(--sm-solar)" stop-opacity="0.05"></stop>
          </linearGradient>
          <linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--sm-grid)" stop-opacity="0.5"></stop>
            <stop offset="1" stop-color="var(--sm-grid)" stop-opacity="0.1"></stop>
          </linearGradient>
        </defs>
        ${j`<path d="${c((h) => h[2], () => 0)}" fill="url(#${u}s)"></path>
        <path d="${c((h) => h[1], (h) => h[2])}" fill="url(#${u}g)"></path>
        <path d="${l((h) => h[1])}" fill="none" stroke="var(--secondary-text-color)" stroke-opacity="0.6" stroke-width="1.2" vector-effect="non-scaling-stroke"></path>
        <path d="${l((h) => h[2])}" fill="none" stroke="var(--sm-solar)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
      </svg>
      ${this.label ? d`<span class="label">${this.label}</span>` : ""}`;
  }
};
ve.styles = [
  D,
  E`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `
];
qe([
  m({ attribute: !1 })
], ve.prototype, "points", 2);
qe([
  m({ type: Number })
], ve.prototype, "max", 2);
qe([
  m({ type: Number })
], ve.prototype, "height", 2);
qe([
  m()
], ve.prototype, "label", 2);
ve = qe([
  C("sm-sparkline")
], ve);
var Va = Object.defineProperty, Ua = Object.getOwnPropertyDescriptor, Ee = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? Ua(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Va(e, a, s), s;
};
let oe = class extends z {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this._minAmps = null;
  }
  _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _hint() {
    const t = this.live, e = this.load;
    return t ? t.driver_error ? `${o("hint.driver_error")}: ${t.driver_error}` : Re(e) ? e.mode === "solar_night" && t.night_needed === !0 ? o("hint.bat_night") : t.reason === "peak_guard" && (t.power_w ?? 0) < 0 ? o("hint.bat_peak") : t.stored_kwh != null ? `${w(t.stored_kwh, 1)} ${o("hint.bat_stored")}` : null : e.type === "ev" && t.car_state === "NoPower" ? o("hint.no_power") : t.reason === "peak_guard" ? o("hint.peak") : t.is_full ? o(e.type === "ev" ? "hint.full_ev" : "hint.full") : e.mode === "solar_night" && t.night_needed === !0 ? o("hint.night_needed") : e.mode === "solar_night" && t.night_needed === !1 ? o("hint.night_not_needed") : e.type === "ev" && t.plugged === !1 ? o("reason.not_connected") : e.type === "ev" && t.is_on && t.current_a != null ? `${o("hint.charging_at")} ${Math.round(t.current_a)} A` : null : null;
  }
  _batEta() {
    const t = this.live;
    return t ? t.eta_full_s ? d`<span class="eta"><ha-icon icon="mdi:battery-arrow-up"></ha-icon>${o("eta.bat_full").replace("{t}", Ye(t.eta_full_s))}</span>` : t.eta_empty_s ? d`<span class="eta"><ha-icon icon="mdi:battery-arrow-down"></ha-icon>${o("eta.bat_empty").replace("{t}", Ye(t.eta_empty_s))}</span>` : _ : _;
  }
  _eta() {
    const t = this.live;
    if (Re(this.load)) return this._batEta();
    if (this.load.type !== "ev" || !t || t.plugged === !1) return _;
    if (t.soc != null && t.soc < 100 && !t.battery_kwh && t.eta_full_s == null && t.eta_limit_s == null)
      return d`<span class="eta est"><ha-icon icon="mdi:timer-sand"></ha-icon>${o("eta.need_capacity")}</span>`;
    if (t.eta_full_s == null || !t.eta_full_s) return _;
    const e = !!t.eta_estimated, a = `${e ? "~" : ""}${Na(t.eta_full_s)}`, i = e ? ` ${o("eta.at_min")}` : ` (± ${Ye(t.eta_full_s)})`;
    return d`<span class="eta ${e ? "est" : ""}"><ha-icon icon="mdi:timer-sand"></ha-icon>${o("eta.full").replace("{d}", a)}${i}</span>`;
  }
  _limitLine() {
    const t = this.live;
    if (this.load.type !== "ev" || !t || t.eta_limit_s == null || t.charge_limit == null || t.plugged === !1) return _;
    const e = `${t.eta_estimated ? "~" : ""}${Ye(t.eta_limit_s)}`;
    return d`<div class="limit">${o("eta.limit").replace("{soc}", String(Math.round(t.charge_limit))).replace("{t}", e)}</div>`;
  }
  _wpa() {
    return 230 * (this.load.ev_phases ?? 1);
  }
  /** Current minimum in amps (0 = off), from the pending click or the saved watts. */
  _curAmps() {
    if (this._minAmps !== null) return this._minAmps;
    const t = this.load.ev_min_power_w;
    if (!t) return 0;
    const e = this.load.ev_min_current ?? 6, a = this.load.ev_max_current ?? 16;
    return Math.max(e, Math.min(a, Math.ceil(t / this._wpa() - 1e-9)));
  }
  _step(t, e) {
    t.stopPropagation();
    const a = this.load.ev_min_current ?? 6, i = this.load.ev_max_current ?? 16, s = this._curAmps();
    let n = s + e;
    e > 0 && s === 0 && (n = a), e < 0 && s <= a && (n = 0), n = Math.min(i, Math.max(0, n)), n !== s && (this._minAmps = n, window.clearTimeout(this._minTimer), this._minTimer = window.setTimeout(() => {
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
    const t = this._curAmps(), e = this.load.ev_max_current ?? 16, a = t * this._wpa() / 1e3;
    return d`<div class="minp" @click=${(i) => i.stopPropagation()} title=${o("card.min_power_help")}>
      <span class="lbl"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${o("f.ev_min_power_w")}</span></span>
      <span class="stepper">
        <button ?disabled=${t === 0} @click=${(i) => this._step(i, -1)} aria-label="-">−</button>
        <span class="val ${t ? "" : "off"}">${t ? `${a.toLocaleString(void 0, { maximumFractionDigits: 1 })} kW · ${t} A` : o("card.min_power_off")}</span>
        <button ?disabled=${t >= e} @click=${(i) => this._step(i, 1)} aria-label="+">+</button>
      </span>
    </div>`;
  }
  render() {
    const t = this.load, e = this.live, a = Re(t), [i, s] = ta(a ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), n = a && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", r = (e == null ? void 0 : e.reason) ?? "idle", p = He(r), l = !!(e != null && e.is_on) && Math.abs((e == null ? void 0 : e.power_w) ?? 0) > 1, c = t.icon || me(t.type), u = t.type === "ev" ? (t.ev_max_current ?? 16) * 230 * (t.ev_phases ?? 1) : a ? Math.max(t.bat_max_charge_w ?? 0, t.bat_max_discharge_w ?? 0) : t.nominal_power_w, h = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null, v = this._hint();
    return d`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${l ? "active" : ""} .icon=${c}></ha-icon>
        <span class="name">${t.name}</span>
        <span class="status ${p}">
          ${p ? d`<ha-icon .icon=${Ta(r)}></ha-icon>` : d`<span class="dot"></span>`}
          ${o(`reason.${r}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big">${n ? d`<ha-icon class="dir" .icon=${n}></ha-icon>` : _}<span class="v">${i}</span><span class="u">${s}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : _}
            ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon .icon=${a ? "mdi:home-battery-outline" : "mdi:battery-charging"}></ha-icon>${Math.round(e.soc)}%</span>` : _}
            ${this._eta()}
            ${t.enabled ? _ : d`<span>${o("reason.disabled")}</span>`}
          </div>
          ${this._limitLine()}
        </div>
        <div class="side">
          <div class="l">${o(a ? "load.charged_today" : "load.today")}</div>
          <div class="v">${w((e == null ? void 0 : e.kwh_today) ?? 0, 1)}</div>
          <div class="s">${a ? `${w((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${o("load.discharged")}` : h === null ? "" : `${Math.round(h * 100)}% ${o("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${u} .height=${76}></sm-sparkline>
        ${v ? d`<span class="hint">${v}</span>` : _}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${aa(t.type)} .value=${t.mode}
          @value-changed=${(g) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: g.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
      </div>
      ${t.type === "ev" && t.mode === "solar" ? this._minPowerRow() : _}
      </div>
    </div>`;
  }
};
oe.styles = [
  D,
  X,
  E`
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
      .big .dir { --mdc-icon-size: 26px; margin-top: 12px; color: var(--secondary-text-color); }
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
Ee([
  m({ attribute: !1 })
], oe.prototype, "load", 2);
Ee([
  m({ attribute: !1 })
], oe.prototype, "live", 2);
Ee([
  m({ attribute: !1 })
], oe.prototype, "spark", 2);
Ee([
  m({ type: Number })
], oe.prototype, "priority", 2);
Ee([
  y()
], oe.prototype, "_minAmps", 2);
oe = Ee([
  C("sm-load-card")
], oe);
var Fa = Object.defineProperty, Za = Object.getOwnPropertyDescriptor, ye = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? Za(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Fa(e, a, s), s;
};
let q = class extends z {
  constructor() {
    super(...arguments), this.icon = "", this.heading = "", this.secondary = "", this.value = "", this.clickable = !1, this.variant = "";
  }
  render() {
    return d`<div class="row ${this.clickable ? "click" : ""}" @click=${this._click}>
      ${this.icon ? d`<div class="ic"><ha-icon .icon=${this.icon}></ha-icon></div>` : _}
      <div class="text">
        <div class="h">${this.heading}</div>
        ${this.secondary ? d`<div class="s">${this.secondary}</div>` : _}
      </div>
      ${this.value ? d`<div class="v">${this.value}</div>` : _}
      <slot></slot>
      ${this.clickable ? d`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : _}
    </div>`;
  }
  _click() {
    this.clickable && this.dispatchEvent(new CustomEvent("row-click", { bubbles: !0, composed: !0 }));
  }
};
q.styles = [
  D,
  E`
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
ye([
  m()
], q.prototype, "icon", 2);
ye([
  m()
], q.prototype, "heading", 2);
ye([
  m()
], q.prototype, "secondary", 2);
ye([
  m()
], q.prototype, "value", 2);
ye([
  m({ type: Boolean })
], q.prototype, "clickable", 2);
ye([
  m({ reflect: !0 })
], q.prototype, "variant", 2);
q = ye([
  C("sm-list-row")
], q);
var Ga = Object.defineProperty, qa = Object.getOwnPropertyDescriptor, we = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? qa(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Ga(e, a, s), s;
};
let K = class extends z {
  constructor() {
    super(...arguments), this.loads = [], this.spark = {}, this.editing = !1, this._dragId = null;
  }
  _emit(t, e = {}) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  async _saveOrder(t) {
    this._emit("loads-reordered", { order: t }), await Xt(this.hass, t);
  }
  _move(t, e) {
    const a = this.loads.map((n) => n.id), i = a.indexOf(t), s = i + e;
    s < 0 || s >= a.length || ([a[i], a[s]] = [a[s], a[i]], this._saveOrder(a));
  }
  _drop(t) {
    if (!this._dragId || this._dragId === t) return;
    const e = this.loads.map((a) => a.id).filter((a) => a !== this._dragId);
    e.splice(e.indexOf(t), 0, this._dragId), this._dragId = null, this._saveOrder(e);
  }
  _pills() {
    var s, n;
    const t = ((s = this.live) == null ? void 0 : s.site) ?? {}, e = t.grid_w, a = e != null && e < 0, i = (t.quarter_projected_w ?? 0) > (t.peak_limit_w ?? 1 / 0) ? "warn" : "grid";
    return d`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${o("site.pv")} <b>${A(t.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${a ? "export" : "grid"} icon=${a ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${o(a ? "site.export" : "site.import")} <b>${A(e == null ? null : Math.abs(e))}</b></span>
      <span class="pill"><ha-icon class="solar" icon="mdi:white-balance-sunny"></ha-icon>${o("site.surplus")} <b>${A(t.surplus_w)}</b></span>
      <span class="pill"><ha-icon icon="mdi:lightning-bolt"></ha-icon>${o("site.managed")} <b>${A(t.managed_w)}</b></span>
      <span class="pill"><ha-icon class=${i} icon="mdi:chart-bell-curve-cumulative"></ha-icon>${o("site.peak_now")}
        <b>${A(t.quarter_average_w)}</b>&nbsp;/ ${A(t.peak_limit_w)}</span>
      <span class="pill"><ha-icon icon="mdi:calendar-month"></ha-icon>${o("site.month_peak")} <b>${A(t.month_peak_w)}</b></span>
      ${(n = t.forecast) != null && n.ev_first ? d`<span class="pill"><ha-icon class="solar" icon="mdi:car-electric"></ha-icon>${o("site.ev_first")}</span>` : _}
      ${t.in_night ? d`<span class="pill"><ha-icon icon="mdi:weather-night"></ha-icon>${o("site.night")}</span>` : _}
    </div>`;
  }
  _editList() {
    return d`<div class="card edit-list">
      <div class="card-head"><h2>${o("loads.title")}</h2></div>
      <div class="card-body muted" style="padding-bottom:8px">${o("loads.hint")}</div>
      ${this.loads.map(
      (t, e) => d`<div class="edit-row ${this._dragId === t.id ? "dragging" : ""}" draggable="true"
          @dragstart=${() => this._dragId = t.id} @dragend=${() => this._dragId = null}
          @dragover=${(a) => a.preventDefault()} @drop=${() => this._drop(t.id)}>
          <ha-icon class="handle" icon="mdi:drag"></ha-icon>
          <sm-list-row .icon=${t.icon || me(t.type)} .heading=${`${e + 1}. ${t.name}`}
            .secondary=${o(`mode.${t.mode}`)}>
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
      ${t.available === !1 ? d`<div class="banner"><ha-icon icon="mdi:alert-outline"></ha-icon>${o("site.no_grid")}</div>` : _}
      ${t.enabled === !1 ? d`<div class="banner"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${o("site.disabled")}</div>` : _}
      ${this._pills()}
      ${this.editing ? this._editList() : this.loads.length ? d`<div class="grid">
              ${this.loads.map((a, i) => {
      var s, n;
      return d`<sm-load-card .load=${a} .live=${(n = (s = this.live) == null ? void 0 : s.loads) == null ? void 0 : n[a.id]} .spark=${this.spark[a.id] ?? []} .priority=${i + 1}></sm-load-card>`;
    })}
              <button class="add" @click=${() => this._emit("add-load")}><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${o("loads.add")}</button>
            </div>` : d`<div class="placeholder"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><p>${o("loads.empty")}</p>
              <button class="filled" @click=${() => this._emit("add-load")}>${o("loads.add")}</button></div>`}
    `;
  }
};
K.styles = [
  D,
  X,
  E`
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
we([
  m({ attribute: !1 })
], K.prototype, "hass", 2);
we([
  m({ attribute: !1 })
], K.prototype, "loads", 2);
we([
  m({ attribute: !1 })
], K.prototype, "live", 2);
we([
  m({ attribute: !1 })
], K.prototype, "spark", 2);
we([
  m({ type: Boolean })
], K.prototype, "editing", 2);
we([
  y()
], K.prototype, "_dragId", 2);
K = we([
  C("sm-dashboard")
], K);
var Ka = Object.defineProperty, Ya = Object.getOwnPropertyDescriptor, je = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? Ya(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Ka(e, a, s), s;
};
let ne = class extends z {
  constructor() {
    super(...arguments), this.heading = "", this.saveLabel = "", this.busy = !1, this.canSave = !0, this.error = "";
  }
  render() {
    return d`<div class="scrim" @click=${(t) => t.target === t.currentTarget && this._close()}>
      <div class="dlg" role="dialog" aria-modal="true" aria-label=${this.heading}>
        <h2>${this.heading}</h2>
        <div class="body"><slot></slot>${this.error ? d`<div class="err" role="alert">${this.error}</div>` : _}</div>
        <div class="actions">
          <button class="text" @click=${this._close}>${o("load.cancel")}</button>
          <button class="filled" ?disabled=${this.busy || !this.canSave}
            @click=${() => this.dispatchEvent(new CustomEvent("save"))}>${this.saveLabel || o("load.save")}</button>
        </div>
      </div>
    </div>`;
  }
  _close() {
    this.dispatchEvent(new CustomEvent("closed"));
  }
};
ne.styles = [
  D,
  X,
  E`
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
je([
  m()
], ne.prototype, "heading", 2);
je([
  m()
], ne.prototype, "saveLabel", 2);
je([
  m({ type: Boolean })
], ne.prototype, "busy", 2);
je([
  m({ type: Boolean })
], ne.prototype, "canSave", 2);
je([
  m()
], ne.prototype, "error", 2);
ne = je([
  C("sm-dialog")
], ne);
var Ja = Object.defineProperty, Xa = Object.getOwnPropertyDescriptor, $t = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? Xa(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Ja(e, a, s), s;
};
let Fe = class extends z {
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
Fe.styles = [
  D,
  E`
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
$t([
  m({ type: Boolean, reflect: !0 })
], Fe.prototype, "checked", 2);
$t([
  m({ type: Boolean, reflect: !0 })
], Fe.prototype, "disabled", 2);
Fe = $t([
  C("sm-toggle")
], Fe);
var Qa = Object.defineProperty, es = Object.getOwnPropertyDescriptor, Ke = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? es(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && Qa(e, a, s), s;
};
let ts = 0, fe = class extends z {
  constructor() {
    super(...arguments), this.fields = [], this.data = {}, this.prefix = "f";
  }
  _emit(t, e) {
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { key: t, value: e }, bubbles: !0, composed: !0 }));
  }
  _label(t) {
    return t.label ?? o(`${this.prefix}.${t.key}`);
  }
  _entity(t, e) {
    var r, p, l;
    const a = this._label(t);
    if (customElements.get("ha-entity-picker"))
      return d`<ha-entity-picker .hass=${this.hass} .label=${a} .value=${e ?? ""} allow-custom-entity
        .includeDomains=${t.domains} @value-changed=${(c) => this._emit(t.key, c.detail.value || null)}></ha-entity-picker>
        ${t.helper ? d`<span class="help">${t.helper}</span>` : _}`;
    const i = `sm-ents-${++ts}`, s = e ? (p = (r = this.hass) == null ? void 0 : r.states) == null ? void 0 : p[e] : void 0, n = Object.values(((l = this.hass) == null ? void 0 : l.states) ?? {}).filter((c) => {
      var u;
      return !((u = t.domains) != null && u.length) || t.domains.includes(c.entity_id.split(".")[0]);
    }).sort((c, u) => c.entity_id.localeCompare(u.entity_id));
    return d`<label class="field">${a}
      <input list=${i} .value=${e ?? ""} placeholder="entity_id"
        @change=${(c) => this._emit(t.key, c.target.value.trim() || null)} />
      <datalist id=${i}>${n.map((c) => d`<option value=${c.entity_id}>${c.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${s ? d`<span class="ent-state">${s.attributes.friendly_name ?? ""}: ${s.state} ${s.attributes.unit_of_measurement ?? ""}</span>` : _}
      ${t.helper ? d`<span class="help">${t.helper}</span>` : _}
    </label>`;
  }
  _field(t) {
    const e = this.data;
    if (t.show && !t.show(e)) return _;
    const a = e[t.key], i = this._label(t);
    switch (t.kind) {
      case "entity":
        return d`<div>${this._entity(t, a)}</div>`;
      case "bool":
        return d`<div class="bool"><span class="txt">${i}${t.helper ? d`<span class="help">${t.helper}</span>` : _}</span>
          <sm-toggle .checked=${!!a} @change=${(s) => this._emit(t.key, s.detail.checked)}></sm-toggle></div>`;
      case "select":
        return d`<label class="field">${i}
          <select @change=${(s) => {
          const n = s.target.value;
          this._emit(t.key, typeof a == "number" ? Number(n) : n);
        }}>${(t.options ?? []).map((s) => d`<option value=${s.value} ?selected=${String(a) === s.value}>${s.label}</option>`)}</select>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : _}</label>`;
      case "number":
        return d`<label class="field">${i}
          <span class="wrap"><input type="number" step=${t.step ?? 1} .value=${a == null ? "" : String(a)}
            @change=${(s) => {
          const n = s.target.value;
          this._emit(t.key, n === "" ? t.nullable ? null : 0 : Number(n));
        }} />${t.unit ? d`<span class="unit">${t.unit}</span>` : _}</span>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : _}</label>`;
      case "multi": {
        const s = Array.isArray(a) ? a.map(String) : [], n = t.options ?? [];
        return d`<div class="field multi"><span>${i}</span>
          ${n.length ? n.map((r) => d`<div class="bool"><span class="txt">${r.label}</span>
                <sm-toggle .checked=${s.includes(r.value)} @change=${(p) => this._emit(t.key, p.detail.checked ? [...s, r.value] : s.filter((l) => l !== r.value))}></sm-toggle></div>`) : d`<span class="help">${o("form.no_options")}</span>`}
          ${t.helper ? d`<span class="help">${t.helper}</span>` : _}</div>`;
      }
      case "time":
        return d`<label class="field">${i}
          <input type="time" .value=${a ?? ""} @change=${(s) => this._emit(t.key, s.target.value)} /></label>`;
      default:
        return d`<label class="field">${i}
          <input type="text" .value=${a ?? ""} @change=${(s) => this._emit(t.key, s.target.value)} />
          ${t.helper ? d`<span class="help">${t.helper}</span>` : _}</label>`;
    }
  }
  render() {
    return d`${this.fields.map((t) => this._field(t))}`;
  }
};
fe.styles = [
  D,
  E`
      :host { display: flex; flex-direction: column; gap: 14px; }
      .field.multi { display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--secondary-text-color); }
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
Ke([
  m({ attribute: !1 })
], fe.prototype, "hass", 2);
Ke([
  m({ attribute: !1 })
], fe.prototype, "fields", 2);
Ke([
  m({ attribute: !1 })
], fe.prototype, "data", 2);
Ke([
  m()
], fe.prototype, "prefix", 2);
fe = Ke([
  C("sm-form")
], fe);
var as = Object.defineProperty, ss = Object.getOwnPropertyDescriptor, W = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? ss(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && as(e, a, s), s;
};
const T = (t) => t.type === "ev", H = (t) => T(t) && t.ev_driver === "tesla_ble_proxy", I = (t) => Re(t), ct = (t) => !Re(t), te = (t) => !T(t) && !I(t), Lt = () => ["charge_positive", "discharge_positive"].map((t) => ({ value: t, label: o(`f.bat_sign.${t}`) })), Ce = (t) => t == null ? "–" : `${t}%`, Je = (t) => La(t ?? 0), B = (t, e) => {
  if (!e) return o("detail.not_set");
  const a = t.states[e];
  return a ? `${a.attributes.friendly_name ?? e}` : e;
}, is = (t, e) => {
  const a = e ? t.states[e] : void 0;
  return a ? a.state === "on" ? o("detail.on") : a.state === "off" ? o("detail.off") : a.state : "";
}, Xe = (t, e) => {
  if (!e) return "";
  const a = t.states[e];
  return a ? `${a.state}${a.attributes.unit_of_measurement ? " " + a.attributes.unit_of_measurement : ""}` : "?";
};
let L = class extends z {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this.count = 1, this._dialog = null, this._draft = {}, this._busy = !1, this._error = "", this._confirmDelete = !1;
  }
  get _sections() {
    const t = this.hass;
    return [
      {
        title: o("detail.device"),
        rows: [
          {
            icon: "mdi:home-battery-outline",
            title: o("f.bat_soc_entity"),
            show: I,
            secondary: (e) => B(t, e.bat_soc_entity),
            value: (e, a) => (a == null ? void 0 : a.soc) != null ? `${Math.round(a.soc)}%` : "",
            fields: [
              { key: "bat_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1 }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: o("f.bat_power_entity"),
            show: I,
            secondary: (e) => `${B(t, e.bat_power_entity)} · ${o(`f.bat_sign.${e.bat_power_sign}`)}`,
            value: (e) => Xe(t, e.bat_power_entity),
            fields: [
              { key: "bat_power_entity", kind: "entity", domains: ["sensor"], helper: o("f.bat_power_entity.help") },
              { key: "bat_power_sign", kind: "select", options: Lt() }
            ]
          },
          {
            icon: "mdi:tune-variant",
            title: o("detail.bat_control"),
            show: I,
            secondary: (e) => e.bat_setpoint_entity ? B(t, e.bat_setpoint_entity) : e.bat_charge_entity || e.bat_discharge_entity ? `${B(t, e.bat_charge_entity)} / ${B(t, e.bat_discharge_entity)}` : o("detail.not_set"),
            value: (e, a) => (a == null ? void 0 : a.setpoint_w) != null ? A(a.setpoint_w) : "",
            fields: [
              { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], helper: o("f.bat_setpoint_entity.help") },
              { key: "bat_setpoint_sign", kind: "select", options: Lt(), show: (e) => !!e.bat_setpoint_entity },
              { key: "bat_charge_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !e.bat_setpoint_entity },
              { key: "bat_discharge_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !e.bat_setpoint_entity },
              { key: "bat_mode_entity", kind: "entity", domains: ["select", "input_select"], helper: o("f.bat_mode_entity.help") },
              { key: "bat_mode_remote_option", kind: "text", show: (e) => !!e.bat_mode_entity },
              { key: "bat_mode_auto_option", kind: "text", show: (e) => !!e.bat_mode_entity }
            ]
          },
          {
            icon: "mdi:power-socket-eu",
            title: o("f.switch_entity"),
            show: te,
            secondary: (e) => B(t, e.switch_entity),
            value: (e) => is(t, e.switch_entity),
            fields: [{ key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"] }]
          },
          {
            icon: "mdi:flash",
            title: o("f.nominal_power_w"),
            show: te,
            secondary: () => o("detail.nominal_help"),
            value: (e) => A(e.nominal_power_w),
            fields: [{ key: "nominal_power_w", kind: "number", unit: "W", step: 50 }, { key: "full_threshold_w", kind: "number", unit: "W" }]
          },
          {
            icon: "mdi:ev-plug-type2",
            title: o("f.ev_driver"),
            show: T,
            secondary: (e) => H(e) ? `${e.ev_proxy_url} · ${e.ev_vin || "VIN?"}` : B(t, e.ev_charge_switch_entity),
            value: (e) => o(`f.ev_driver.${e.ev_driver}`),
            fields: [
              { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"].map((e) => ({ value: e, label: o(`f.ev_driver.${e}`) })) },
              { key: "ev_proxy_url", kind: "text", show: H, helper: o("f.ev_proxy_url.help") },
              { key: "ev_vin", kind: "text", show: H },
              { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (e) => !H(e) },
              { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !H(e) },
              { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: (e) => !H(e) }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: o("detail.power_sensor"),
            show: ct,
            secondary: (e) => B(t, e.power_entity),
            value: (e) => Xe(t, e.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: o("f.power_entity.help") }]
          },
          {
            icon: "mdi:thermometer",
            title: o("detail.temp_sensor"),
            show: te,
            secondary: (e) => B(t, e.temperature_entity),
            value: (e) => e.max_temperature != null ? `${Xe(t, e.temperature_entity)} · max ${e.max_temperature} °C` : Xe(t, e.temperature_entity),
            fields: [
              { key: "temperature_entity", kind: "entity", domains: ["sensor"] },
              { key: "max_temperature", kind: "number", nullable: !0, unit: "°C" },
              { key: "boiler_volume_l", kind: "number", unit: "l", step: 10, helper: o("f.boiler_volume_l.help"), show: (e) => !!e.temperature_entity },
              { key: "boiler_target_temperature", kind: "number", nullable: !0, unit: "°C", helper: o("f.boiler_target_temperature.help"), show: (e) => !!e.temperature_entity }
            ]
          },
          {
            icon: "mdi:battery-charging",
            title: o("f.ev_soc_entity"),
            show: T,
            secondary: (e) => e.ev_soc_entity ? B(t, e.ev_soc_entity) : H(e) ? o("detail.from_proxy") : o("detail.not_set"),
            value: (e, a) => (a == null ? void 0 : a.soc) != null ? `${Math.round(a.soc)}%` : "",
            fields: [
              { key: "ev_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "ev_charge_limit_entity", kind: "entity", domains: ["sensor", "number", "input_number"], show: (e) => !H(e) }
            ]
          }
        ]
      },
      {
        title: o("f.section.battery"),
        show: I,
        rows: [
          {
            icon: "mdi:battery-charging-high",
            title: o("detail.bat_power"),
            secondary: () => o("detail.bat_power_sub"),
            value: (e) => `↑ ${A(e.bat_max_charge_w)} · ↓ ${A(e.bat_max_discharge_w)}`,
            fields: [
              { key: "bat_max_charge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_max_discharge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_deadband_w", kind: "number", unit: "W", step: 10, helper: o("f.bat_deadband_w.help") }
            ]
          },
          {
            icon: "mdi:battery-10",
            title: o("detail.bat_limits"),
            secondary: (e) => o("detail.bat_limits_sub").replace("{min}", Ce(e.bat_min_soc)).replace("{max}", Ce(e.bat_max_soc)),
            value: (e) => `${Ce(e.bat_min_soc)} – ${Ce(e.bat_max_soc)}`,
            fields: [
              { key: "bat_min_soc", kind: "number", unit: "%", helper: o("f.bat_min_soc.help") },
              { key: "bat_max_soc", kind: "number", unit: "%" },
              { key: "bat_target_soc", kind: "number", unit: "%", helper: o("f.bat_target_soc.help") }
            ]
          },
          {
            icon: "mdi:home-lightning-bolt-outline",
            title: o("f.bat_discharge_for"),
            secondary: () => o("detail.bat_for_help"),
            value: (e) => o(`f.bat_for.${e.bat_discharge_for}`),
            fields: [{
              key: "bat_discharge_for",
              kind: "select",
              options: ["house", "house_switch", "all"].map((e) => ({ value: e, label: o(`f.bat_for.${e}`) }))
            }]
          },
          { icon: "mdi:transmission-tower", title: o("f.bat_peak_support"), secondary: () => o("detail.bat_peak_help"), toggle: "bat_peak_support" },
          {
            icon: "mdi:battery-lock-outline",
            title: o("f.bat_peak_min_soc"),
            show: (e) => !!e.bat_peak_support,
            secondary: () => o("detail.bat_peak_min_help"),
            value: (e) => Ce(e.bat_peak_min_soc),
            fields: [{ key: "bat_peak_min_soc", kind: "number", unit: "%" }]
          }
        ]
      },
      {
        title: o("f.section.ev"),
        show: T,
        rows: [
          {
            icon: "mdi:current-ac",
            title: o("detail.current"),
            secondary: (e) => `${e.ev_phases} ${o("detail.phase")} · ${o("detail.step")} ${e.ev_current_step_interval_s} s`,
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
            title: o("f.ev_battery_kwh"),
            secondary: (e, a) => a != null && a.battery_kwh_learned ? o("detail.battery_learned").replace("{kwh}", `${a.battery_kwh_learned} kWh`) : (a == null ? void 0 : a.battery_kwh_source) === "car" && a.battery_kwh ? o("detail.battery_car").replace("{kwh}", `${a.battery_kwh} kWh`) : o("detail.battery_learning"),
            value: (e, a) => e.ev_battery_kwh ? `${e.ev_battery_kwh} kWh` : a != null && a.battery_kwh_learned ? `${a.battery_kwh_learned} kWh (${o("detail.learned")})` : "–",
            fields: [{ key: "ev_battery_kwh", kind: "number", nullable: !0, unit: "kWh" }]
          },
          {
            icon: "mdi:battery-alert-variant-outline",
            title: o("f.ev_min_soc"),
            secondary: () => o("detail.min_soc_help"),
            value: (e) => e.ev_min_soc != null ? `${e.ev_min_soc}%` : o("detail.off"),
            fields: [{ key: "ev_min_soc", kind: "number", nullable: !0, unit: "%" }]
          }
        ]
      },
      {
        title: o("detail.behaviour"),
        show: ct,
        rows: [
          {
            icon: "mdi:timer-play-outline",
            title: o("detail.start_stop"),
            secondary: (e) => o("detail.start_stop_sub").replace("{start}", Je(e.start_delay_s)).replace("{stop}", Je(e.stop_delay_s)),
            value: (e) => `+${e.start_margin_w} W`,
            fields: [
              { key: "start_delay_s", kind: "number", unit: "s" },
              { key: "stop_delay_s", kind: "number", unit: "s" },
              { key: "start_margin_w", kind: "number", unit: "W" }
            ]
          },
          {
            icon: "mdi:timer-lock-outline",
            title: o("detail.min_times"),
            secondary: (e) => `${o("detail.on")} ${Je(e.min_on_s)} · ${o("detail.off_short")} ${Je(e.min_off_s)}`,
            fields: [
              { key: "min_on_s", kind: "number", unit: "s" },
              { key: "min_off_s", kind: "number", unit: "s" }
            ]
          },
          {
            icon: "mdi:transmission-tower-import",
            title: o("f.allowed_import_w"),
            secondary: () => o("detail.allowed_import_help"),
            value: (e) => A(e.allowed_import_w),
            fields: [{ key: "allowed_import_w", kind: "number", unit: "W", step: 50 }]
          },
          { icon: "mdi:chart-bell-curve-cumulative", title: o("f.peak_shed"), secondary: () => o("detail.peak_shed_help"), toggle: "peak_shed" }
        ]
      },
      {
        title: o("f.section.night"),
        meta: (e) => e.mode === "solar_night" ? "" : o("detail.night_inactive"),
        rows: [
          {
            icon: "mdi:weather-night",
            title: o("detail.night_when"),
            secondary: (e) => I(e) ? o("detail.night_when_bat").replace("{soc}", String(e.bat_target_soc)) : T(e) && (e.ev_soc_entity || H(e)) ? o("detail.night_when_soc").replace("{soc}", String(e.ev_target_soc)) : e.night_min_temperature != null ? o("detail.night_when_temp").replace("{t}", String(e.night_min_temperature)) : o("detail.night_when_kwh").replace("{kwh}", String(e.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (e) => te(e) || T(e) && !(e.ev_soc_entity || H(e)) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: !0, show: te },
              { key: "bat_target_soc", kind: "number", unit: "%", show: I },
              { key: "ev_target_soc", kind: "number", unit: "%", show: T }
            ]
          },
          {
            icon: "mdi:battery-arrow-up-outline",
            title: o("detail.night_amount"),
            show: te,
            value: (e) => e.night_target_kwh ? w(e.night_target_kwh, 1) : o("detail.until_full"),
            fields: [{ key: "night_target_kwh", kind: "number", unit: "kWh", step: 0.1 }]
          },
          {
            icon: "mdi:weather-sunny-alert",
            title: o("detail.forecast_skip"),
            secondary: () => o("detail.forecast_skip_help"),
            value: (e) => e.night_skip_forecast_kwh ? `> ${e.night_skip_forecast_kwh} kWh` : o("detail.off"),
            fields: [{ key: "night_skip_forecast_kwh", kind: "number", unit: "kWh", nullable: !0, step: 0.5 }]
          }
        ]
      },
      {
        title: o("f.section.plan"),
        show: ct,
        meta: () => {
          var e;
          return (e = this.live) != null && e.plan ? "" : o("detail.plan_inactive");
        },
        rows: [
          {
            icon: "mdi:water-thermometer-outline",
            title: o("detail.plan_need"),
            show: te,
            secondary: (e, a) => e.temperature_entity ? o("detail.plan_need_temp") : e.plan_need_kwh ? o("detail.plan_need_set") : a != null && a.need_learned_kwh ? o("detail.plan_need_learned").replace("{kwh}", w(a.need_learned_kwh, 1)) : o("detail.plan_need_learning"),
            value: (e, a) => e.plan_need_kwh ? w(e.plan_need_kwh, 1) : a != null && a.need_learned_kwh ? w(a.need_learned_kwh, 1) : "",
            fields: [{ key: "plan_need_kwh", kind: "number", nullable: !0, unit: "kWh", step: 0.1, helper: o("f.plan_need_kwh.help") }]
          },
          { icon: "mdi:car-clock", title: o("f.ev_departure_enabled"), secondary: () => o("detail.departure_help"), toggle: "ev_departure_enabled", show: T },
          {
            icon: "mdi:clock-outline",
            title: o("detail.departure"),
            show: (e) => T(e) && !!e.ev_departure_enabled,
            value: (e) => `${e.ev_departure_time} · ${e.ev_departure_soc}%`,
            secondary: (e) => {
              const a = (e.ev_departure_days ?? []).map(Number);
              return a.length === 7 ? o("detail.every_day") : a.sort().map((i) => o(`day.${i}`)).join(", ");
            },
            fields: [
              { key: "ev_departure_time", kind: "time" },
              { key: "ev_departure_soc", kind: "number", unit: "%", step: 5 },
              { key: "ev_departure_days", kind: "multi", options: [0, 1, 2, 3, 4, 5, 6].map((e) => ({ value: String(e), label: o(`day.${e}`) })) }
            ]
          },
          {
            icon: "mdi:calendar-check-outline",
            title: o("detail.plan_now"),
            show: () => {
              var e;
              return !!((e = this.live) != null && e.plan);
            },
            secondary: () => {
              var s;
              const e = (s = this.live) == null ? void 0 : s.plan;
              if (!e) return "";
              const a = (n) => new Date(n * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), i = o("detail.plan_now_sub").replace("{need}", w(e.need_kwh, 1)).replace("{sun}", w(e.solar_kwh, 1));
              return e.grid_kwh > 0.01 ? `${i} · ${o("plan.grid_at").replace("{kwh}", w(e.grid_kwh, 1)).replace("{from}", a(e.grid_from)).replace("{to}", a(e.grid_to))}` : i;
            }
          }
        ]
      },
      {
        title: o("f.section.legionella"),
        show: te,
        rows: [
          { icon: "mdi:bacteria-outline", title: o("f.legionella_enabled"), secondary: () => o("f.legionella.hint"), toggle: "legionella_enabled" },
          {
            icon: "mdi:thermometer-high",
            title: o("detail.legionella_rule"),
            show: (e) => !!e.legionella_enabled,
            value: (e) => `${e.legionella_temperature} °C / ${e.legionella_interval_days} d`,
            fields: [
              { key: "legionella_temperature", kind: "number", unit: "°C" },
              { key: "legionella_interval_days", kind: "number", unit: o("detail.days") }
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
      const e = await Jt(this.hass, { ...this.load, ...t });
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
    await Sa(this.hass, this.load.id), this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _move(t) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta: t }, bubbles: !0, composed: !0 }));
  }
  _hero() {
    const t = this.load, e = this.live, [a, i] = ta(I(t) ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), s = I(t) && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", n = (e == null ? void 0 : e.reason) ?? "idle", r = He(n), p = t.icon || me(t.type), l = T(t) ? t.ev_max_current * 230 * t.ev_phases : I(t) ? Math.max(t.bat_max_charge_w, t.bat_max_discharge_w) : t.nominal_power_w, c = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null;
    return d`<div class="card hero">
      <div class="hero-head">
        <div class="hero-ic ${e != null && e.is_on && ((e == null ? void 0 : e.power_w) ?? 0) > 1 ? "active" : ""}"><ha-icon .icon=${p}></ha-icon></div>
        <div>
          <div class="hero-name">${t.name}
            <button class="icon" title=${o("load.edit")} @click=${() => this._openDialog(o("detail.name_icon"), [
      { key: "name", kind: "text" },
      { key: "icon", kind: "text", helper: o("f.icon.help") }
    ])}><ha-icon icon="mdi:pencil"></ha-icon></button>
          </div>
          <div class="hero-sub"><span class="status ${r}">${o(`reason.${n}`)}</span> · ${o(`type.${t.type}`)}</div>
        </div>
      </div>
      <div class="big">${s ? d`<ha-icon class="dir" .icon=${s}></ha-icon>` : _}<span class="v">${a}</span><span class="u">${i}</span></div>
      <sm-sparkline .points=${this.spark} .max=${l} .height=${90} .label=${o("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : _}
        ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : _}
        ${(e == null ? void 0 : e.current_a) != null && T(t) ? d`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(e.current_a)} A</span>` : _}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${w((e == null ? void 0 : e.kwh_today) ?? 0, 1)} ${I(t) ? o("load.charged_today") : o("load.today")}</span>
        ${I(t) ? d`<span><ha-icon icon="mdi:home-export-outline"></ha-icon>${w((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${o("load.discharged")}</span>` : _}
        ${c !== null ? d`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(c * 100)}% ${o("load.from_solar")}</span>` : _}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${o("f.mode")}</div>
        <sm-segmented .options=${aa(t.type)} .value=${t.mode}
          @value-changed=${(u) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: u.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
        <div class="d">${o(`${wt(t.mode, t.type)}.desc`)}</div>
      </div>
    </div>`;
  }
  _controlCard() {
    const t = this.load;
    return d`<div class="card list">
      <sm-list-row icon="mdi:power" variant="primary" .heading=${o("f.enabled")} .secondary=${o("detail.enabled_help")}>
        <sm-toggle .checked=${t.enabled} @change=${(e) => this._save({ enabled: e.detail.checked })}></sm-toggle>
      </sm-list-row>
      <sm-list-row icon="mdi:sort-numeric-ascending" .heading=${o("detail.priority")}
        .secondary=${o("detail.priority_sub").replace("{n}", String(this.priority)).replace("{c}", String(this.count))}>
        <button class="icon" ?disabled=${this.priority <= 1} @click=${() => this._move(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon" ?disabled=${this.priority >= this.count} @click=${() => this._move(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
      </sm-list-row>
      <sm-list-row icon="mdi:chart-line" .heading=${o("load.analytics")} .secondary=${o("detail.analytics_sub")} clickable
        @row-click=${() => this.dispatchEvent(new CustomEvent("open-analytics", { detail: { id: t.id }, bubbles: !0, composed: !0 }))}></sm-list-row>
      <sm-list-row icon="mdi:delete-outline" variant="danger" .heading=${this._confirmDelete ? o("load.delete_confirm") : o("load.delete")}
        clickable @row-click=${this._delete}></sm-list-row>
    </div>`;
  }
  _section(t) {
    const e = this.load;
    if (t.show && !t.show(e)) return _;
    const a = t.rows.filter((i) => !i.show || i.show(e));
    return d`<div class="card list">
      <div class="card-head"><h2>${t.title}</h2>${t.meta && t.meta(e) ? d`<span class="meta">${t.meta(e)}</span>` : _}</div>
      ${a.map(
      (i) => {
        var s, n, r;
        return i.toggle ? d`<sm-list-row .icon=${i.icon} .heading=${i.title} .secondary=${((s = i.secondary) == null ? void 0 : s.call(i, e, this.live)) ?? ""}>
              <sm-toggle .checked=${!!e[i.toggle]} @change=${(p) => this._save({ [i.toggle]: p.detail.checked })}></sm-toggle>
            </sm-list-row>` : d`<sm-list-row .icon=${i.icon} .heading=${i.title} .secondary=${((n = i.secondary) == null ? void 0 : n.call(i, e, this.live)) ?? ""} .value=${((r = i.value) == null ? void 0 : r.call(i, e, this.live)) ?? ""}
              clickable @row-click=${() => this._openDialog(i.title, i.fields ?? [])}></sm-list-row>`;
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
          </sm-dialog>` : _}
    `;
  }
};
L.styles = [
  D,
  X,
  E`
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
    `
];
W([
  m({ attribute: !1 })
], L.prototype, "hass", 2);
W([
  m({ attribute: !1 })
], L.prototype, "load", 2);
W([
  m({ attribute: !1 })
], L.prototype, "live", 2);
W([
  m({ attribute: !1 })
], L.prototype, "spark", 2);
W([
  m({ type: Number })
], L.prototype, "priority", 2);
W([
  m({ type: Number })
], L.prototype, "count", 2);
W([
  y()
], L.prototype, "_dialog", 2);
W([
  y()
], L.prototype, "_draft", 2);
W([
  y()
], L.prototype, "_busy", 2);
W([
  y()
], L.prototype, "_error", 2);
W([
  y()
], L.prototype, "_confirmDelete", 2);
L = W([
  C("sm-load-detail")
], L);
var os = Object.defineProperty, ns = Object.getOwnPropertyDescriptor, $e = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? ns(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && os(e, a, s), s;
};
const It = { DEBUG: 10, INFO: 20, WARNING: 30, ERROR: 40, CRITICAL: 50 }, Tt = (t) => {
  const e = new Date(t * 1e3), a = (i, s = 2) => String(i).padStart(s, "0");
  return `${a(e.getDate())}/${a(e.getMonth() + 1)} ${a(e.getHours())}:${a(e.getMinutes())}:${a(e.getSeconds())}`;
};
let Y = class extends z {
  constructor() {
    super(...arguments), this._data = null, this._level = "all", this._query = "", this._msg = "", this._auto = !0, this._load = () => this._run(() => Ea(this.hass));
  }
  connectedCallback() {
    super.connectedCallback(), this._load(), this._timer = window.setInterval(() => this._auto && this._load(), 5e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer);
  }
  async _run(t) {
    try {
      this._data = await t();
    } catch (e) {
      this._msg = (e == null ? void 0 : e.message) ?? String(e);
    }
  }
  _filtered() {
    var a;
    const t = this._level === "all" ? 0 : It[this._level] ?? 0, e = this._query.trim().toLowerCase();
    return (((a = this._data) == null ? void 0 : a.entries) ?? []).filter((i) => (It[i.level] ?? 0) >= t).filter((i) => !e || i.message.toLowerCase().includes(e) || i.source.toLowerCase().includes(e)).reverse();
  }
  async _copy() {
    const t = this._filtered().slice().reverse().map((e) => `${Tt(e.ts)} ${e.level} [${e.source}] ${e.message}`).join(`
`);
    try {
      await navigator.clipboard.writeText(t), this._msg = o("logs.copied");
    } catch {
      this._msg = o("logs.copy_failed");
    }
    window.setTimeout(() => this._msg = "", 3e3);
  }
  render() {
    var a, i;
    const t = this._filtered(), e = ((a = this._data) == null ? void 0 : a.entries.length) ?? 0;
    return d`
      <div class="row">
        <div class="grow">
          <div class="lbl">${o("logs.verbose")}</div>
          <div class="help">${o("logs.verbose.help")}</div>
        </div>
        <sm-toggle ?checked=${((i = this._data) == null ? void 0 : i.verbose) ?? !1}
          @change=${(s) => this._run(() => Oa(this.hass, s.detail.checked))}></sm-toggle>
      </div>
      <div class="row">
        <sm-segmented size="sm" .value=${this._level}
          .options=${["all", "INFO", "WARNING", "ERROR"].map((s) => ({ value: s, label: o(`logs.level.${s}`) }))}
          @value-changed=${(s) => {
      s.stopPropagation(), this._level = s.detail.value;
    }}></sm-segmented>
        <input class="search" type="search" placeholder=${o("logs.search")} .value=${this._query}
          @input=${(s) => this._query = s.target.value} />
      </div>
      <div class="row actions">
        <button class="text" @click=${this._load}>${o("logs.refresh")}</button>
        <button class="text" ?disabled=${!t.length} @click=${this._copy}>${o("logs.copy")}</button>
        <button class="text" ?disabled=${!e} @click=${() => this._run(() => ja(this.hass))}>${o("logs.clear")}</button>
        <label class="help"><input type="checkbox" .checked=${this._auto}
          @change=${(s) => this._auto = s.target.checked} /> ${o("logs.auto")}</label>
        <span class="muted">${this._msg || o("logs.count").replace("{n}", String(t.length)).replace("{t}", String(e))}</span>
      </div>
      <div class="log">
        ${t.length ? t.map(
      (s) => d`<div class="e"><span class="ts">${Tt(s.ts)}</span><span class="lv ${s.level}">${s.level}</span>
                <span class="m"><span class="src">[${s.source}]</span> ${s.message}</span></div>`
    ) : d`<div class="empty">${this._data ? o("logs.empty") : o("logs.loading")}</div>`}
      </div>
    `;
  }
};
Y.styles = [
  D,
  X,
  E`
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
    `
];
$e([
  m({ attribute: !1 })
], Y.prototype, "hass", 2);
$e([
  y()
], Y.prototype, "_data", 2);
$e([
  y()
], Y.prototype, "_level", 2);
$e([
  y()
], Y.prototype, "_query", 2);
$e([
  y()
], Y.prototype, "_msg", 2);
$e([
  y()
], Y.prototype, "_auto", 2);
Y = $e([
  C("sm-logs")
], Y);
var rs = Object.defineProperty, ls = Object.getOwnPropertyDescriptor, re = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? ls(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && rs(e, a, s), s;
};
const ds = ["measure", "control", "info", "system"], tt = (t) => t == null ? "–" : `${t.toFixed(1)} kWh`, Wt = (t) => !!(t.forecast_ev_priority || t.forecast_ev_floor_pause), ht = (t, e) => e.map((a) => ({ value: a, label: o(`s.${t}.${a}`) })), ut = (t, e) => {
  var a;
  return e ? ((a = t.states[e]) == null ? void 0 : a.attributes.friendly_name) ?? e : o("detail.not_set");
}, ps = (t) => {
  var e;
  return Object.keys(((e = t.services) == null ? void 0 : e.notify) ?? {}).filter((a) => !["send_message", "persistent_notification"].includes(a)).sort((a, i) => Number(i.startsWith("mobile_app_")) - Number(a.startsWith("mobile_app_")) || a.localeCompare(i)).map((a) => ({
    value: `notify.${a}`,
    label: a.startsWith("mobile_app_") ? `📱 ${a.slice(11).replace(/_/g, " ")}` : a.replace(/_/g, " ")
  }));
}, cs = (t) => [
  // Meten
  {
    id: "meter",
    group: "measure",
    icon: "mdi:meter-electric-outline",
    fields: [
      { key: "grid_mode", kind: "select", options: ht("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: ht("grid_sign", ["import_positive", "export_positive"]), show: (e) => e.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" }
    ],
    summary: (e, a) => ut(a, e.grid_mode === "split" ? e.grid_import_entity : e.grid_power_entity)
  },
  {
    id: "pv",
    group: "measure",
    icon: "mdi:solar-power-variant",
    fields: [{ key: "pv_power_entity", kind: "entity", domains: ["sensor"], helper: o("s.pv_power_entity.help") }],
    summary: (e, a) => ut(a, e.pv_power_entity)
  },
  // Slim sturen
  {
    id: "general",
    group: "control",
    icon: "mdi:power",
    fields: [{ key: "enabled", kind: "bool", helper: o("s.enabled.help") }],
    summary: (e) => e.enabled ? o("s.enabled") : o("site.disabled")
  },
  {
    id: "forecast",
    group: "control",
    icon: "mdi:weather-partly-cloudy",
    fields: [
      { key: "pv_forecast_remaining_entity", kind: "entity", domains: ["sensor"], helper: o("s.pv_forecast_remaining_entity.help") },
      { key: "pv_forecast_today_entity", kind: "entity", domains: ["sensor"], helper: o("s.pv_forecast_today_entity.help") },
      { key: "pv_forecast_tomorrow_entity", kind: "entity", domains: ["sensor"], helper: o("s.pv_forecast_tomorrow_entity.help") },
      { key: "forecast_ev_priority", kind: "bool", helper: o("s.forecast_ev_priority.help") },
      { key: "forecast_ev_floor_pause", kind: "bool", helper: o("s.forecast_ev_floor_pause.help") },
      { key: "forecast_ev_floor_kwh", kind: "number", unit: "kWh", step: 0.5, helper: o("s.forecast_ev_floor_kwh.help"), show: (e) => !!e.forecast_ev_floor_pause },
      { key: "forecast_factor_pct", kind: "number", unit: "%", step: 5, helper: o("s.forecast_factor_pct.help"), show: Wt },
      { key: "forecast_house_kwh", kind: "number", unit: "kWh", step: 0.5, helper: o("s.forecast_house_kwh.help"), show: Wt }
    ],
    summary: (e, a, i) => {
      const s = i == null ? void 0 : i.forecast;
      return (s == null ? void 0 : s.remaining_kwh) != null ? o("s.forecast.summary").replace("{kwh}", tt(s.remaining_kwh)) : e.pv_forecast_remaining_entity || e.pv_forecast_today_entity ? ut(a, e.pv_forecast_remaining_entity || e.pv_forecast_today_entity) : o("detail.not_set");
    }
  },
  {
    id: "planning",
    group: "control",
    icon: "mdi:calendar-clock",
    fields: [
      { key: "plan_enabled", kind: "bool", helper: o("s.plan_enabled.help") },
      { key: "plan_boiler_night", kind: "bool", helper: o("s.plan_boiler_night.help"), show: (e) => !!e.plan_enabled },
      { key: "plan_ev", kind: "bool", helper: o("s.plan_ev.help"), show: (e) => !!e.plan_enabled },
      { key: "plan_battery_night", kind: "bool", helper: o("s.plan_battery_night.help"), show: (e) => !!e.plan_enabled },
      { key: "plan_peak_spread", kind: "bool", helper: o("s.plan_peak_spread.help"), show: (e) => !!e.plan_enabled },
      { key: "plan_learn_base", kind: "bool", helper: o("s.plan_learn_base.help"), show: (e) => !!e.plan_enabled },
      { key: "plan_base_w", kind: "number", unit: "W", step: 50, show: (e) => !!e.plan_enabled && !e.plan_learn_base },
      { key: "plan_pv_estimate", kind: "select", options: ht("plan_pv_estimate", ["pv_estimate", "pv_estimate10"]), helper: o("s.plan_pv_estimate.help"), show: (e) => !!e.plan_enabled },
      { key: "forecast_factor_pct", kind: "number", unit: "%", step: 5, helper: o("s.forecast_factor_pct.help"), show: (e) => !!e.plan_enabled },
      { key: "plan_horizon_h", kind: "number", unit: "u", step: 6, helper: o("s.plan_horizon_h.help"), show: (e) => !!e.plan_enabled }
    ],
    summary: (e, a, i) => {
      var n;
      if (!e.plan_enabled) return o("detail.off");
      const s = Object.values(((n = i == null ? void 0 : i.plan) == null ? void 0 : n.loads) ?? {}).filter((r) => r.grid_kwh > 0.01).length;
      return s ? o("s.planning.summary").replace("{n}", String(s)) : o("s.planning.on");
    }
  },
  {
    id: "peak",
    group: "control",
    icon: "mdi:chart-bell-curve-cumulative",
    fields: [
      { key: "peak_guard_enabled", kind: "bool", helper: o("s.peak.help") },
      { key: "peak_limit_w", kind: "number", unit: "W", step: 100, show: (e) => e.peak_guard_enabled },
      { key: "peak_margin_w", kind: "number", unit: "W", step: 50, show: (e) => e.peak_guard_enabled },
      { key: "peak_follow_month_max", kind: "bool", helper: o("s.peak_follow.help"), show: (e) => e.peak_guard_enabled }
    ],
    summary: (e) => e.peak_guard_enabled ? `${(e.peak_limit_w / 1e3).toFixed(1)} kW` : o("detail.off")
  },
  {
    id: "night",
    group: "control",
    icon: "mdi:weather-night",
    fields: [
      { key: "night_start", kind: "time" },
      { key: "night_end", kind: "time" }
    ],
    summary: (e) => `${e.night_start} – ${e.night_end}`
  },
  // Kosten en meldingen
  {
    id: "prices",
    group: "info",
    icon: "mdi:currency-eur",
    fields: [
      { key: "price_import", kind: "number", unit: "€/kWh", step: 0.01 },
      { key: "price_export", kind: "number", unit: "€/kWh", step: 0.01 }
    ],
    summary: (e) => `€ ${e.price_import} / € ${e.price_export}`
  },
  {
    id: "notify",
    group: "info",
    icon: "mdi:bell-outline",
    fields: [
      { key: "notify_services", kind: "multi", options: ps(t), helper: o("s.notify_services.help") },
      { key: "notify_peak", kind: "bool", helper: o("s.notify_peak.help") },
      { key: "notify_ev", kind: "bool", helper: o("s.notify_ev.help") },
      { key: "notify_faults", kind: "bool", helper: o("s.notify_faults.help") }
    ],
    summary: (e) => {
      const a = (e.notify_services ?? []).length;
      return a ? o("s.notify.summary").replace("{n}", String(a)) : o("detail.off");
    }
  },
  // Systeem
  {
    id: "debug",
    group: "system",
    icon: "mdi:bug-outline",
    fields: [],
    summary: () => `${o("s.cat.debug.summary")} · ${o("s.version").replace("{v}", "0.2.5")}`
  }
];
let V = class extends z {
  constructor() {
    super(...arguments), this.site = {}, this.narrow = !1, this._cat = null, this._draft = {}, this._testMsg = "";
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings }), this._cat === null && !this.narrow && (this._cat = "meter");
  }
  async _change(t, e) {
    this._draft = { ...this._draft, [t]: e }, this.dispatchEvent(new CustomEvent("saving", { bubbles: !0, composed: !0 }));
    try {
      await ka(this.hass, { [t]: e }), this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
    } catch (a) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: (a == null ? void 0 : a.message) ?? String(a) }, bubbles: !0, composed: !0 }));
    }
  }
  async _test() {
    this._testMsg = "";
    try {
      await za(this.hass), this._testMsg = o("s.notify.test_sent");
    } catch (t) {
      this._testMsg = (t == null ? void 0 : t.message) ?? String(t);
    }
  }
  /** What the forecast planning decides right now. */
  _plan() {
    var a;
    const t = (a = this.site) == null ? void 0 : a.forecast;
    if (!t || t.remaining_kwh == null) return d`<div class="plan">${o("s.plan.none")}</div>`;
    const e = (i) => d`<b class=${i ? "on" : ""}>${o(i ? "s.plan.yes" : "s.plan.no")}</b>`;
    return d`<div class="plan">
      ${o("s.plan.remaining")} <b>${tt(t.remaining_kwh)}</b>, ${o("s.plan.usable")} <b>${tt(t.usable_kwh)}</b><br />
      ${o("s.plan.boilers")} <b>${tt(t.boiler_need_kwh)}</b><br />
      ${this._draft.forecast_ev_priority ? d`${o("s.plan.ev_first")} ${e(t.ev_first)}<br />` : ""}
      ${this._draft.forecast_ev_floor_pause ? d`${o("s.plan.floor_paused")} ${e(t.ev_floor_paused)}` : ""}
    </div>`;
  }
  render() {
    const t = cs(this.hass), e = t.find((s) => s.id === this._cat), a = !this.narrow || !e, i = !!e;
    return d`<div class="md ${this.narrow ? "single" : ""}">
      ${a ? d`<div class="card nav">
            ${ds.map(
      (s, n) => d`${n ? d`<hr />` : ""}<div class="group">${o(`s.group.${s}`)}</div>
                ${t.filter((r) => r.group === s).map(
        (r) => d`<sm-list-row class=${r.id === this._cat && !this.narrow ? "sel" : ""} .icon=${r.icon} .heading=${o(`s.cat.${r.id}`)}
                    .secondary=${r.summary(this._draft, this.hass, this.site ?? {})} clickable @row-click=${() => this._cat = r.id}></sm-list-row>`
      )}`
    )}
          </div>` : ""}
      ${i ? d`<div class="card detail">
            <div class="card-head">
              ${this.narrow ? d`<button class="icon" @click=${() => this._cat = null}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
              <h2>${o(`s.cat.${e.id}`)}</h2>
            </div>
            <div class="card-body">
              <p class="desc">${o(`s.cat.${e.id}.desc`)}</p>
              ${e.id === "forecast" ? this._plan() : ""}
              ${e.id === "debug" ? d`<sm-logs .hass=${this.hass}></sm-logs>` : d`<sm-form .hass=${this.hass} prefix="s" .fields=${e.fields} .data=${this._draft}
                    @value-changed=${(s) => this._change(s.detail.key, s.detail.value)}></sm-form>`}
              ${e.id === "notify" ? d`<div class="test"><button class="text" ?disabled=${!(this._draft.notify_services ?? []).length}
                    @click=${this._test}>${o("s.notify.test")}</button><span>${this._testMsg}</span></div>` : ""}
            </div>
          </div>` : ""}
    </div>`;
  }
};
V.styles = [
  D,
  X,
  E`
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
    `
];
re([
  m({ attribute: !1 })
], V.prototype, "hass", 2);
re([
  m({ attribute: !1 })
], V.prototype, "settings", 2);
re([
  m({ attribute: !1 })
], V.prototype, "site", 2);
re([
  m({ type: Boolean })
], V.prototype, "narrow", 2);
re([
  y()
], V.prototype, "_cat", 2);
re([
  y()
], V.prototype, "_draft", 2);
re([
  y()
], V.prototype, "_testMsg", 2);
V = re([
  C("sm-settings")
], V);
var hs = Object.defineProperty, us = Object.getOwnPropertyDescriptor, Q = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? us(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && hs(e, a, s), s;
};
const ae = 1e3, P = 64, G = 16, Rt = 18, _t = 14, Ht = 12, _s = (t) => {
  const e = Math.pow(10, Math.floor(Math.log10(t))), a = t / e;
  return (a <= 1 ? 1 : a <= 2 ? 2 : a <= 2.5 ? 2.5 : a <= 5 ? 5 : 10) * e;
}, gt = (t, e) => e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
let Pe = class extends z {
  constructor() {
    super(...arguments), this.x = [], this.panels = [], this._hover = null;
  }
  render() {
    var S, M;
    const t = this.x.length;
    if (t < 2) return d`<slot></slot>`;
    const e = this.x[0], a = this.x[t - 1], i = (b) => P + (b - e) / Math.max(1, a - e) * (ae - P - G);
    let s = 0;
    const n = [], r = [];
    for (const b of this.panels) {
      const $ = s + Rt, F = b.height;
      r.push([$, F]), n.push(j`<text class="ptitle" x="${P}" y="${s + 12}">${b.title}</text>`), n.push(j`<rect class="plot" x="${P}" y="${$}" width="${ae - P - G}" height="${F}" rx="2"></rect>`), (S = b.series) != null && S.length && n.push(this._series(b, $, F, i)), (M = b.bands) != null && M.length && b.bands.forEach((R, de) => {
        const ee = $ + 4 + de * (Ht + 4);
        n.push(j`<text class="axis" x="${P - 8}" y="${ee + 10}" text-anchor="end">${R.label}</text>`), R.segments.forEach(
          (Z) => n.push(j`<rect x="${i(Z.from)}" y="${ee}" width="${Math.max(1, i(Z.to) - i(Z.from))}" height="${Ht}" fill="${Z.color}" rx="2"><title>${Z.title}</title></rect>`)
        );
      }), s = $ + F + _t;
    }
    const p = a - e, l = p <= 1.5 * 86400 ? 3 * 3600 : p <= 8 * 86400 ? 86400 : 7 * 86400, c = [], u = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
    for (let b = Math.ceil((e - u) / l) * l + u; b <= a; b += l) c.push(b);
    const h = (b) => {
      const $ = new Date(b * 1e3);
      return l < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { weekday: "short", day: "numeric" });
    }, v = s - _t + 16, g = v + 6;
    c.forEach((b) => {
      n.push(j`<line class="gridline" x1="${i(b)}" x2="${i(b)}" y1="${Rt}" y2="${s - _t}" stroke-dasharray="2 4"></line>`), n.push(j`<text class="axis" x="${i(b)}" y="${v}" text-anchor="middle">${h(b)}</text>`);
    });
    const f = this._hover;
    f !== null && r.forEach(
      ([b, $]) => n.push(j`<line x1="${i(this.x[f])}" x2="${i(this.x[f])}" y1="${b}" y2="${b + $}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`)
    );
    const k = (b) => {
      const $ = b.currentTarget.getBoundingClientRect(), F = (b.clientX - $.left) / $.width * ae, R = e + (F - P) / (ae - P - G) * (a - e);
      let de = 0, ee = t - 1;
      for (; ee - de > 1; ) {
        const Z = de + ee >> 1;
        this.x[Z] < R ? de = Z : ee = Z;
      }
      this._hover = Math.abs(this.x[de] - R) < Math.abs(this.x[ee] - R) ? de : ee;
    }, x = this.panels.flatMap((b) => (b.series ?? []).map(($) => ({ ...$, unit: $.unit ?? b.unit })));
    return d`
      <svg viewBox="0 0 ${ae} ${g}" @mousemove=${k} @mouseleave=${() => this._hover = null}>${n}</svg>
      ${f !== null ? d`<div class="tip" style="${i(this.x[f]) > ae / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[f] * 1e3).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${x.map((b) => {
      const $ = b.values[f];
      return $ == null ? _ : d`<div><span class="dot" style="background:${b.color}"></span>${b.label}: ${gt($, b.unit)}</div>`;
    })}
          </div>` : _}
      <div class="legend">
        ${x.filter((b) => b.legend !== !1).map((b) => d`<span><span class="dot" style="background:${b.color}"></span>${b.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }
  _series(t, e, a, i) {
    const s = this.x.length, n = {}, r = [], p = [];
    for (const g of t.series)
      if (g.kind === "area" && g.stack) {
        const f = n[g.stack] ?? new Array(s).fill(0), k = f.map((x, S) => x + Math.max(0, g.values[S] ?? 0));
        p.push(f), r.push(k), n[g.stack] = k;
      } else
        p.push(new Array(s).fill(0)), r.push(g.values.map((f) => f ?? 0));
    let l = -1 / 0, c = 1 / 0;
    t.series.forEach((g, f) => {
      for (let k = 0; k < s; k++) {
        const x = g.values[k];
        x != null && (l = Math.max(l, g.kind === "area" ? r[f][k] : x), c = Math.min(c, g.kind === "area" ? 0 : x));
      }
    }), l === -1 / 0 && (l = 1, c = 0), t.zero !== !1 && (c = Math.min(c, 0), l = Math.max(l, 0));
    const u = _s((l - c) / 3 || 1);
    l = Math.ceil((l + (l - c) * 0.04) / u) * u, c = Math.floor(c / u) * u;
    const h = (g) => e + a - (g - c) / (l - c) * a, v = [];
    for (let g = c; g <= l + u / 2; g += u)
      v.push(j`<line class="gridline" x1="${P}" x2="${ae - G}" y1="${h(g)}" y2="${h(g)}"></line>
        <text class="axis" x="${P - 8}" y="${h(g) + 4}" text-anchor="end">${gt(g, t.unit)}</text>`);
    return c < 0 && v.push(j`<line x1="${P}" x2="${ae - G}" y1="${h(0)}" y2="${h(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`), t.series.forEach((g, f) => {
      if (g.kind === "area") {
        let S = "";
        for (let M = 0; M < s; M++) S += `${M ? "L" : "M"}${i(this.x[M]).toFixed(1)},${h(r[f][M]).toFixed(1)}`;
        for (let M = s - 1; M >= 0; M--) S += `L${i(this.x[M]).toFixed(1)},${h(p[f][M]).toFixed(1)}`;
        v.push(j`<path d="${S}Z" fill="${g.color}" fill-opacity="0.45" stroke="${g.color}" stroke-width="1"></path>`);
        return;
      }
      let k = "", x = !1;
      for (let S = 0; S < s; S++) {
        const M = g.values[S];
        if (M == null) {
          x = !1;
          continue;
        }
        const b = i(this.x[S]).toFixed(1), $ = h(M).toFixed(1);
        g.kind === "step" && x ? k += `H${b}V${$}` : k += `${x ? "L" : "M"}${b},${$}`, x = !0;
      }
      v.push(j`<path d="${k}" fill="none" stroke="${g.color}" stroke-width="1.8" stroke-dasharray="${g.dashed ? "5 4" : ""}"></path>`);
    }), v;
  }
};
Pe.styles = [
  D,
  E`
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
Q([
  m({ attribute: !1 })
], Pe.prototype, "x", 2);
Q([
  m({ attribute: !1 })
], Pe.prototype, "panels", 2);
Q([
  y()
], Pe.prototype, "_hover", 2);
Pe = Q([
  C("sm-chart")
], Pe);
let be = class extends z {
  constructor() {
    super(...arguments), this.bars = [], this.height = 180, this.unit = "kWh", this.limit = null;
  }
  render() {
    if (!this.bars.length) return d`<slot></slot>`;
    const t = this.height, e = t - 26, a = (l) => l.parts.reduce((c, u) => c + u.value, 0), i = Math.max(this.limit ?? 0, ...this.bars.map(a), 1e-3) * 1.1, s = 640, n = (s - P - G) / this.bars.length, r = (l) => e - l / i * e, p = Math.ceil(this.bars.length / 10);
    return d`<svg viewBox="0 0 ${s} ${t}">
      <rect class="plot" x="${P}" y="0" width="${s - P - G}" height="${e}" rx="2"></rect>
      ${[0, 1, 2, 3].map((l) => {
      const c = i / 1.1 * (l / 3);
      return j`<line class="gridline" x1="${P}" x2="${s - G}" y1="${r(c)}" y2="${r(c)}"></line>
          <text class="axis" x="${P - 8}" y="${r(c) + 4}" text-anchor="end">${gt(c, this.unit)}</text>`;
    })}
      ${this.bars.map((l, c) => {
      let u = 0;
      const h = P + c * n + n * 0.18;
      return j`${l.parts.map((v) => {
        const g = r(u);
        u += v.value;
        const f = r(u);
        return j`<rect x="${h}" width="${n * 0.64}" y="${f}" height="${Math.max(0, g - f)}" fill="${v.color}" rx="2"><title>${l.label}: ${v.title}</title></rect>`;
      })}${c % p === 0 ? j`<text class="axis" x="${h + n * 0.32}" y="${t - 6}" text-anchor="middle">${l.label}</text>` : _}`;
    })}
      ${this.limit ? j`<line x1="${P}" x2="${s - G}" y1="${r(this.limit)}" y2="${r(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : _}
    </svg>`;
  }
};
be.styles = [
  D,
  E`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `
];
Q([
  m({ attribute: !1 })
], be.prototype, "bars", 2);
Q([
  m({ type: Number })
], be.prototype, "height", 2);
Q([
  m()
], be.prototype, "unit", 2);
Q([
  m({ type: Number })
], be.prototype, "limit", 2);
be = Q([
  C("sm-bars")
], be);
var ms = Object.defineProperty, gs = Object.getOwnPropertyDescriptor, xe = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? gs(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && ms(e, a, s), s;
};
const De = 900, Ne = "var(--sm-solar)", Qe = "var(--sm-grid)", Le = (t) => new Date(t * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), Bt = (t) => new Date(t * 1e3).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
let J = class extends z {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this._data = null, this._hours = 24, this._sel = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._fetch(), this._timer = window.setInterval(() => this._fetch(), 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer);
  }
  async _fetch() {
    if (this.hass)
      try {
        this._data = await Pa(this.hass);
      } catch {
        this._data = null;
      }
  }
  _rows(t, e, a) {
    const i = Math.round((e - t.slots[0]) / De), s = (l, c) => Array.from({ length: 4 }, (u, h) => (l == null ? void 0 : l[i + c * 4 + h]) ?? 0), n = [], r = (l, c, u, h, v, g, f, k = 1) => ({
      id: l,
      label: c,
      icon: u,
      kind: h,
      max: k,
      cells: Array.from({ length: a }, (x, S) => {
        const M = s(v, S), b = s(g, S), $ = s(f ?? v, S);
        return M.map((F, R) => ({ solar: M[R], grid: b[R], value: $[R] }));
      })
    }), p = (l) => Math.max(1, ...l);
    this.loadId || (n.push(r("pv", o("plan.row.pv"), "mdi:white-balance-sunny", "pv", t.pv_w, void 0, t.pv_w, p(t.pv_w))), n.push(r("house", o("plan.row.house"), "mdi:home-outline", "house", void 0, void 0, t.base_w, p(t.base_w))));
    for (const l of this.loads) {
      if (this.loadId && l.id !== this.loadId || !t.solar_w[l.id]) continue;
      const c = l.type === "ev" ? l.ev_max_current * 230 * l.ev_phases : l.type === "battery" ? l.bat_max_charge_w : l.nominal_power_w, u = t.solar_w[l.id].map((h, v) => {
        var g;
        return h + (((g = t.grid_w[l.id]) == null ? void 0 : g[v]) ?? 0);
      });
      n.push(r(l.id, l.name, l.icon || me(l.type), "load", t.solar_w[l.id], t.grid_w[l.id], u, Math.max(1, c || 0)));
    }
    return this.loadId || n.push(r("import", o("plan.row.import"), "mdi:transmission-tower-import", "import", void 0, t.import_w, t.import_w, Math.max(t.limit_w ?? 0, p(t.import_w)))), n;
  }
  _color(t, e) {
    const a = (p) => e.reduce((l, c) => l + p(c), 0) / e.length, i = a((p) => p.value);
    if (i <= 1) return "";
    const s = Math.min(1, i / t.max), n = Math.round(30 + 70 * Math.sqrt(s));
    let r = "var(--secondary-text-color)";
    return t.kind === "pv" ? r = Ne : t.kind === "import" ? r = Qe : t.kind === "load" && (r = a((p) => p.grid) > a((p) => p.solar) ? Qe : Ne), `color-mix(in srgb, ${r} ${n}%, var(--idle))`;
  }
  _detail(t, e) {
    const a = this._sel;
    if (!a) return d`<div class="detail">${o("plan.hint")}</div>`;
    const i = t[a.row], s = i == null ? void 0 : i.cells[a.col];
    if (!s) return _;
    const n = e + a.col * 3600, r = s.map((p, l) => {
      const c = Le(n + l * De);
      return i.kind === "load" ? p.grid > 1 && p.solar > 1 ? d`<div>${c} · ${A(p.solar)} ${o("plan.from_sun")} + ${A(p.grid)} ${o("plan.from_grid")}</div>` : p.grid > 1 ? d`<div>${c} · <b>${A(p.grid)}</b> ${o("plan.from_grid")}</div>` : p.solar > 1 ? d`<div>${c} · <b>${A(p.solar)}</b> ${o("plan.from_sun")}</div>` : d`<div>${c} · ${o("plan.idle")}</div>` : d`<div>${c} · <b>${A(p.value)}</b></div>`;
    });
    return d`<div class="detail"><b>${i.label}</b> · ${Bt(n)}${r}</div>`;
  }
  _summary(t) {
    const e = this.loads.filter((a) => t.loads[a.id] && (!this.loadId || a.id === this.loadId));
    return e.length ? d`<div class="sum">${e.map((a) => {
      const i = t.loads[a.id], s = i.goal === "departure" && i.deadline ? o("plan.goal.departure").replace("{t}", Bt(i.deadline)) : i.deadline ? o("plan.goal.by").replace("{t}", Le(i.deadline)) : "", n = i.grid_kwh > 0.01 ? o("plan.grid_at").replace("{kwh}", w(i.grid_kwh, 1)).replace("{from}", Le(i.grid_from)).replace("{to}", Le(i.grid_to)) : i.grid_planned ? o("plan.no_grid") : o("plan.sun_only");
      return d`<div class="r"><ha-icon .icon=${a.icon || me(a.type)}></ha-icon><div>
        <div class="n">${a.name}</div>
        <div class="s">${o("plan.need")} <b>${w(i.need_kwh, 1)}</b> ${o(`plan.src.${i.need_source}`)} ${s}
          · ${o("plan.sun_expected")} ${w(i.solar_kwh, 1)} · ${n}</div>
        ${i.short_kwh > 0.05 ? d`<div class="s warn">${o("plan.short").replace("{kwh}", w(i.short_kwh, 1))}</div>` : _}
        ${i.over_limit ? d`<div class="s warn">${o("plan.over_limit")}</div>` : _}
      </div></div>`;
    })}</div>` : _;
  }
  _chart() {
    var c;
    const t = this._data, e = t.plan;
    if (this.loadId || !((c = e == null ? void 0 : e.slots) != null && c.length)) return _;
    const a = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).getTime() / 1e3, i = e.slots[0] + this._hours * 3600, s = [];
    for (let u = a; u < i; u += De) s.push(u);
    const n = new Map((t.measured ?? []).map((u) => [u[0], u])), r = new Map((t.predicted ?? []).map((u) => [u[0], u])), p = (u, h) => {
      const v = Math.round((h - e.slots[0]) / De);
      return v >= 0 && v < u.length ? u[v] : null;
    }, l = [{
      title: `${o("plan.chart")} (W)`,
      unit: "W",
      height: 160,
      series: [
        { label: o("plan.pv_measured"), color: Ne, kind: "area", values: s.map((u) => {
          var h;
          return ((h = n.get(u)) == null ? void 0 : h[1]) ?? null;
        }) },
        { label: o("plan.pv_predicted"), color: Ne, kind: "line", dashed: !0, values: s.map((u) => {
          var h;
          return ((h = r.get(u)) == null ? void 0 : h[1]) ?? p(e.pv_w, u);
        }) },
        { label: o("plan.house_measured"), color: "var(--secondary-text-color)", kind: "line", values: s.map((u) => {
          var h;
          return ((h = n.get(u)) == null ? void 0 : h[2]) ?? null;
        }) },
        { label: o("plan.house_predicted"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: s.map((u) => {
          var h;
          return ((h = r.get(u)) == null ? void 0 : h[2]) ?? p(e.base_w, u);
        }) },
        { label: o("plan.import_planned"), color: Qe, kind: "step", values: s.map((u) => p(e.import_w, u)) }
      ]
    }];
    return d`<div class="chart"><sm-chart .x=${s} .panels=${l}></sm-chart></div>`;
  }
  render() {
    var h, v, g;
    const t = this._data, e = d`<div class="card-head"><h2>${o("plan.title")}</h2></div>`;
    if (!t) return _;
    if (!t.enabled) return d`<div class="card">${e}<div class="empty">${o("plan.disabled")}</div></div>`;
    const a = t.plan;
    if (!((h = a == null ? void 0 : a.slots) != null && h.length)) return d`<div class="card">${e}<div class="empty">${o("plan.none")}</div></div>`;
    const i = a.slots[0], s = i - i % 3600, n = Math.min(this._hours, Math.floor((a.slots[a.slots.length - 1] + De - s) / 3600)), r = this._rows(a, s, n), p = ((v = t.info) == null ? void 0 : v.nights) ?? [], l = (f) => p.some(([k, x]) => f >= k && f < x), c = a.limit_w, u = ((g = t.info) == null ? void 0 : g.pv_source) ?? "none";
    return d`<div class="card">
      ${e}
      <div class="bar">
        <span class="meta">${o("plan.updated").replace("{t}", Le(a.created))} · ${o(`plan.pv_source.${u}`)}</span>
        <sm-segmented size="sm" .options=${[{ value: "24", label: "24 u" }, { value: "36", label: "36 u" }]} .value=${String(this._hours)}
          @value-changed=${(f) => {
      this._hours = Number(f.detail.value), this._sel = null;
    }}></sm-segmented>
      </div>
      ${this._chart()}
      <div class="grid" style="grid-template-columns: minmax(70px, max-content) repeat(${n}, minmax(0, 1fr))"
        @mouseleave=${() => {
    }}>
        ${r.map((f, k) => d`<div class="lbl" title=${f.label}><ha-icon .icon=${f.icon}></ha-icon>${f.label}</div>
          ${f.cells.map((x, S) => {
      const M = s + S * 3600, b = f.kind === "import" && c && x.some((F) => F.value > c + 1), $ = this._sel && this._sel.row === k && this._sel.col === S;
      return d`<div class="cell ${S === 0 ? "now" : ""} ${b ? "over" : ""} ${l(M) ? "night" : ""} ${$ ? "sel" : ""}"
              style=${this._color(f, x) ? `background:${this._color(f, x)}` : ""}
              @mouseenter=${() => this._sel = { row: k, col: S }} @click=${() => this._sel = { row: k, col: S }}></div>`;
    })}`)}
        <div></div>
        ${Array.from({ length: n }, (f, k) => {
      const x = new Date((s + k * 3600) * 1e3).getHours();
      return d`<div class="hours">${x % 3 === 0 ? `${x}u` : ""}</div>`;
    })}
      </div>
      ${this._detail(r, s)}
      <div class="legend">
        <span><span class="sw" style="background:${Ne}"></span>${o("plan.legend.sun")}</span>
        <span><span class="sw" style="background:${Qe}"></span>${o("plan.legend.grid")}</span>
        <span><span class="sw" style="outline:1px dashed var(--secondary-text-color)"></span>${o("plan.legend.night")}</span>
        ${c ? d`<span><span class="sw" style="box-shadow:inset 0 -3px var(--sm-err)"></span>${o("plan.legend.over")} ${A(c)}</span>` : _}
      </div>
      ${this._summary(a)}
    </div>`;
  }
};
J.styles = [
  D,
  X,
  E`
      :host { display: block; }
      .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 16px 8px; flex-wrap: wrap; }
      .bar .meta { font-size: 13px; color: var(--secondary-text-color); }
      .grid { display: grid; gap: 2px; padding: 0 16px; align-items: center; --idle: color-mix(in srgb, var(--primary-text-color) 7%, var(--sm-surface)); }
      .lbl { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px; display: flex; align-items: center; gap: 4px; --mdc-icon-size: 14px; }
      .cell { height: 22px; border-radius: 3px; background: var(--idle); cursor: pointer; position: relative; }
      .cell.sel { box-shadow: 0 0 0 1.5px var(--primary-text-color); }
      .cell.now::before { content: ""; position: absolute; left: -2px; top: -3px; bottom: -3px; width: 2px; background: var(--primary-text-color); border-radius: 1px; }
      .cell.over { box-shadow: inset 0 -3px var(--sm-err); }
      .cell.night { outline: 1px dashed color-mix(in srgb, var(--secondary-text-color) 35%, transparent); outline-offset: -1px; }
      .hours { font-size: 11px; color: var(--secondary-text-color); }
      .detail { margin: 10px 16px 0; padding: 10px 12px; border-radius: var(--sm-radius-sm); background: var(--sm-fill); font-size: 13px; line-height: 1.6; min-height: 20px; }
      .detail b { font-weight: 500; }
      .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; padding: 10px 16px 0; font-size: 12px; color: var(--secondary-text-color); }
      .sw { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
      .sum { padding: 8px 0 4px; }
      .sum .r { display: flex; gap: 12px; padding: 8px 16px; align-items: flex-start; border-top: 1px solid var(--sm-border); --mdc-icon-size: 20px; }
      .sum .r ha-icon { color: var(--secondary-text-color); margin-top: 2px; }
      .sum .n { font-size: 14px; }
      .sum .s { font-size: 13px; color: var(--secondary-text-color); line-height: 1.5; }
      .sum .warn { color: var(--sm-warn-text); }
      .empty { padding: 24px 16px; color: var(--secondary-text-color); font-size: 14px; line-height: 1.5; }
      .chart { padding: 8px 16px 0; }
    `
];
xe([
  m({ attribute: !1 })
], J.prototype, "hass", 2);
xe([
  m({ attribute: !1 })
], J.prototype, "loads", 2);
xe([
  m()
], J.prototype, "loadId", 2);
xe([
  y()
], J.prototype, "_data", 2);
xe([
  y()
], J.prototype, "_hours", 2);
xe([
  y()
], J.prototype, "_sel", 2);
J = xe([
  C("sm-plan")
], J);
var vs = Object.defineProperty, fs = Object.getOwnPropertyDescriptor, le = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? fs(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && vs(e, a, s), s;
};
const Ie = "var(--sm-solar)", Se = "var(--sm-grid)", Vt = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)"
}, bs = (t) => {
  const e = /* @__PURE__ */ new Date(), a = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() / 1e3, i = e.getTime() / 1e3;
  switch (t) {
    case "yesterday":
      return [a - 86400, a];
    case "7d":
      return [a - 6 * 86400, i];
    case "30d":
      return [a - 29 * 86400, i];
    case "month":
      return [new Date(e.getFullYear(), e.getMonth(), 1).getTime() / 1e3, i];
    default:
      return [a, i];
  }
};
let U = class extends z {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this.peakLimit = null, this._range = "today", this._data = null, this._loading = !1, this._loadedFor = "";
  }
  updated(t) {
    const e = `${this.loadId}|${this._range}`;
    (t.has("loadId") || t.has("hass")) && this.hass && e !== this._loadedFor && this._fetch();
  }
  async _fetch() {
    this._loadedFor = `${this.loadId}|${this._range}`, this._loading = !0;
    const [t, e] = bs(this._range);
    try {
      this._data = await Qt(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _downsample(t) {
    if (t.length <= 1200) return t;
    const a = Math.ceil(t.length / 1200), i = [];
    for (let s = 0; s < t.length; s += a) {
      const n = t.slice(s, s + a), r = (c) => {
        const u = n.map(c).filter((h) => h != null);
        return u.length ? u.reduce((h, v) => h + v, 0) / u.length : null;
      }, p = n[n.length - 1], l = {};
      for (const c of Object.keys(p[3]))
        l[c] = [r((u) => {
          var h;
          return (h = u[3][c]) == null ? void 0 : h[0];
        }), r((u) => {
          var h;
          return (h = u[3][c]) == null ? void 0 : h[1];
        }), p[3][c][2], n.some((u) => {
          var h;
          return (h = u[3][c]) == null ? void 0 : h[3];
        }) ? 1 : 0, r((u) => {
          var h;
          return (h = u[3][c]) == null ? void 0 : h[4];
        })];
      i.push([n[0][0], r((c) => c[1]), r((c) => c[2]), l]);
    }
    return i;
  }
  _band(t, e, a) {
    var n;
    const i = [];
    let s = null;
    for (let r = 0; r < t.length; r++) {
      const p = t[r][3][e], l = p ? p[2] : null, c = l ? He(l) : "", h = l && (p[3] || l === "peak_guard") && c ? Vt[c] : null, v = l ? o(`reason.${l}`) : "", g = ((n = t[r + 1]) == null ? void 0 : n[0]) ?? t[r][0] + 60;
      h && s && s.color === h && s.title === v ? s.to = g : (s && i.push(s), s = h ? { from: t[r][0], to: g, color: h, title: v } : null);
    }
    return s && i.push(s), { label: a, segments: i };
  }
  _history() {
    var i, s;
    const t = this._downsample(((s = (i = this._data) == null ? void 0 : i.timeline) == null ? void 0 : s.rows) ?? []);
    if (t.length < 2) return d`<div class="empty">${o("a.no_data")}</div>`;
    const e = t.map((n) => n[0]), a = [];
    if (this.loadId) {
      const n = this.loadId, r = this.loads.find((l) => l.id === n), p = [
        { label: o("a.from_solar"), color: Ie, kind: "area", stack: "l", values: t.map((l) => {
          var c;
          return ((c = l[3][n]) == null ? void 0 : c[1]) ?? 0;
        }) },
        { label: o("a.from_grid"), color: Se, kind: "area", stack: "l", values: t.map((l) => {
          var c, u;
          return Math.max(0, (((c = l[3][n]) == null ? void 0 : c[0]) ?? 0) - (((u = l[3][n]) == null ? void 0 : u[1]) ?? 0));
        }) },
        ...(r == null ? void 0 : r.type) === "battery" ? [{ label: o("a.discharged"), color: "var(--sm-ok)", kind: "area", stack: "d", values: t.map((l) => {
          var c;
          return Math.max(0, -(((c = l[3][n]) == null ? void 0 : c[0]) ?? 0));
        }) }] : [],
        { label: o("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: t.map((l) => l[1]) }
      ];
      if (a.push({ title: `${o("a.power")} (W)`, unit: "W", height: 220, series: p }), t.some((l) => {
        var c;
        return ((c = l[3][n]) == null ? void 0 : c[4]) != null;
      })) {
        const l = (r == null ? void 0 : r.type) === "ev" || (r == null ? void 0 : r.type) === "battery";
        a.push({
          title: l ? `${o("a.soc")} (%)` : `${o("a.temperature")} (°C)`,
          unit: l ? "%" : "°C",
          height: 90,
          zero: !1,
          series: [{ label: o(l ? "a.soc" : "a.temperature"), color: "var(--sm-err)", kind: "line", values: t.map((c) => {
            var u;
            return ((u = c[3][n]) == null ? void 0 : u[4]) ?? null;
          }) }]
        });
      }
      a.push({ title: o("a.why"), unit: "", height: 22, bands: [this._band(t, n, "")] });
    } else {
      const n = this.loads.map((r, p) => ({
        label: r.name,
        color: ke[p % ke.length],
        kind: "area",
        stack: "loads",
        values: t.map((l) => {
          var c;
          return Math.max(0, ((c = l[3][r.id]) == null ? void 0 : c[0]) ?? 0);
        })
      }));
      n.push({ label: o("a.pv"), color: Ie, kind: "line", values: t.map((r) => r[1]) }), a.push({ title: `${o("a.power")} (W)`, unit: "W", height: 220, series: n }), a.push({
        title: `${o("site.grid")} (W) · + ${o("a.import").toLowerCase()} / − ${o("a.export").toLowerCase()}`,
        unit: "W",
        height: 90,
        series: [{ label: o("site.grid"), color: Se, kind: "line", values: t.map((r) => r[2]) }]
      }), a.push({
        title: o("a.why"),
        unit: "",
        height: this.loads.length * 16 + 6,
        bands: this.loads.map((r) => this._band(t, r.id, r.name.length > 9 ? r.name.slice(0, 8) + "…" : r.name))
      });
    }
    return d`<sm-chart .x=${e} .panels=${a}></sm-chart>`;
  }
  _tile(t, e, a) {
    return d`<div class="tile"><div class="v">${t}</div><div class="l">${e}</div>
      ${a ? d`<div class="bar"><div style="width:${a[0] * 100}%;background:${Ie}"></div><div style="width:${a[1] * 100}%;background:${Se}"></div></div>` : _}</div>`;
  }
  _summary() {
    var a;
    const t = (a = this._data) == null ? void 0 : a.summary;
    if (!t) return _;
    if (this.loadId) {
      const i = t.loads[this.loadId];
      if (!i) return d`<div class="empty">${o("a.no_data")}</div>`;
      const s = i.solar_share ?? 0, n = this.loads.find((p) => p.id === this.loadId);
      if ((n == null ? void 0 : n.type) === "battery") {
        const p = n.bat_capacity_kwh || 0;
        return d`<div class="tiles">
          ${this._tile(w(i.kwh), o("a.charged"), i.kwh > 0 ? [s, 1 - s] : void 0)}
          ${this._tile(ce(i.solar_share), o("a.solar_share"))}
          ${this._tile(w(i.discharge_kwh ?? 0), o("a.discharged"))}
          ${this._tile(ce(i.efficiency ?? null), o("a.efficiency"))}
          ${this._tile(p ? ((i.discharge_kwh ?? 0) / p).toFixed(1) : "–", o("a.cycles"))}
          ${this._tile(pt(i.saving), o("a.saving"))}
        </div>`;
      }
      const r = Object.entries(i.reasons ?? {}).filter(([p]) => He(p)).sort((p, l) => l[1] - p[1]);
      return d`<div class="tiles">
          ${this._tile(w(i.kwh), o("a.energy"), i.kwh > 0 ? [s, 1 - s] : void 0)}
          ${this._tile(ce(i.solar_share), o("a.solar_share"))}
          ${this._tile(w(i.grid_kwh), o("a.grid"))}
          ${this._tile(dt(i.runtime_s), o("a.runtime"))}
          ${this._tile(String(i.starts), o("a.starts"))}
          ${this._tile(pt(i.saving), o("a.saving"))}
        </div>
        ${r.length ? d`<div class="why">${r.map(([p, l]) => d`<span class="pill"><span class="swatch" style="background:${Vt[He(p)]}"></span>${o(`reason.${p}`)} <b>${dt(l)}</b></span>`)}</div>` : _}`;
    }
    const e = t.house;
    return d`<div class="tiles">
        ${this._tile(w(e.pv_kwh, 1), o("a.pv"))}
        ${this._tile(ce(e.self_consumption), o("a.self_consumption"))}
        ${this._tile(ce(e.self_sufficiency), o("a.self_sufficiency"))}
        ${this._tile(w(e.import_kwh, 1), o("a.import"))}
        ${this._tile(w(e.export_kwh, 1), o("a.export"))}
        ${this._tile(A(e.peak_w), o("a.peak"))}
      </div>
      <table>
        <tr><th>${o("a.distribution")}</th><th class="num">${o("a.energy")}</th><th class="num">${o("a.solar_share")}</th><th class="num">${o("a.runtime")}</th><th class="num">${o("a.saving")}</th></tr>
        ${this.loads.map((i, s) => {
      const n = t.loads[i.id];
      return n ? d`<tr><td><span class="swatch" style="background:${ke[s % ke.length]}"></span>${i.name}</td>
            <td class="num">${w(n.kwh)}</td><td class="num">${ce(n.solar_share)}</td><td class="num">${dt(n.runtime_s)}</td><td class="num">${pt(n.saving)}</td></tr>` : _;
    })}
      </table>`;
  }
  _daily() {
    var i;
    const t = ((i = this._data) == null ? void 0 : i.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return _;
    const a = e.map((s) => {
      const n = `${Number(s.slice(8))}/${Number(s.slice(5, 7))}`;
      if (this.loadId) {
        const r = t[s].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label: n, parts: [
          { value: r.solar_kwh, color: Ie, title: `${o("a.solar")} ${w(r.solar_kwh)}` },
          { value: Math.max(0, r.kwh - r.solar_kwh), color: Se, title: `${o("a.grid")} ${w(r.kwh - r.solar_kwh)}` }
        ] };
      }
      return { label: n, parts: this.loads.map((r, p) => {
        var c;
        const l = ((c = t[s].loads[r.id]) == null ? void 0 : c.kwh) ?? 0;
        return { value: l, color: ke[p % ke.length], title: `${r.name} ${w(l)}` };
      }) };
    });
    return d`<div class="card"><div class="card-head"><h2>${o("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${a}></sm-bars></div></div>`;
  }
  _rhythm() {
    var a, i;
    if (!this.loadId) return _;
    const t = ((i = (a = this._data) == null ? void 0 : a.rhythm) == null ? void 0 : i[this.loadId]) ?? [];
    if (!t.some((s) => s > 0)) return _;
    const e = t.map((s, n) => ({ label: `${n}u`, parts: [{ value: s, color: Ie, title: A(s) }] }));
    return d`<div class="card"><div class="card-head"><h2>${o("a.rhythm")}</h2><span class="meta">${o("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div></div>`;
  }
  _quarters() {
    var s;
    if (this.loadId) return _;
    const t = ((s = this._data) == null ? void 0 : s.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return _;
    const a = this.peakLimit, i = e.length === 1 ? t[e[0]].map(([n, r]) => ({
      label: new Date(n * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: r, color: a && r > a ? "var(--sm-err)" : Se, title: A(r) }]
    })) : e.map((n) => {
      const r = Math.max(...t[n].map((p) => p[1]));
      return { label: `${Number(n.slice(8))}/${Number(n.slice(5, 7))}`, parts: [{ value: r, color: a && r > a ? "var(--sm-err)" : Se, title: A(r) }] };
    });
    return d`<div class="card"><div class="card-head"><h2>${o("a.quarters")}</h2><span class="meta">${o("site.peak_limit")} ${A(a)}</span></div>
      <div class="card-body"><sm-bars .bars=${i} unit="W" .limit=${a}></sm-bars></div></div>`;
  }
  _sessions() {
    var i;
    const t = this.loadId ? this.loads.find((s) => s.id === this.loadId) : null;
    if (!t || t.type !== "ev") return _;
    const e = [...((i = this._data) == null ? void 0 : i.sessions) ?? []].reverse();
    if (!e.length) return _;
    const a = (s) => s ? new Date(s * 1e3).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : o("a.ongoing");
    return d`<div class="card"><div class="card-head"><h2>${o("a.sessions")}</h2><span class="meta">${e.length}</span></div>
      <table>
        <tr><th>${o("a.start")}</th><th>${o("a.end")}</th><th class="num">${o("a.energy")}</th><th class="num">${o("a.solar_share")}</th><th class="num">${o("a.soc")}</th></tr>
        ${e.map((s) => d`<tr><td>${a(s.start)}</td><td>${a(s.end)}</td><td class="num">${w(s.kwh)}</td>
          <td class="num">${ce(s.kwh > 0 ? s.solar_kwh / s.kwh : null)}</td><td class="num">${s.soc_start ?? "–"}% → ${s.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }
  render() {
    const t = [{ value: "", label: o("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((a) => ({ value: a.id, label: a.name, icon: a.icon || me(a.type) }))
    ), e = ["today", "yesterday", "7d", "30d", "month"];
    return d`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${t} .value=${this.loadId ?? ""}
          @value-changed=${(a) => {
      this.loadId = a.detail.value || null, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: !0, composed: !0 }));
    }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${e.map((a) => ({ value: a, label: o(`a.range.${a}`) }))} .value=${this._range}
          @value-changed=${(a) => {
      this._range = a.detail.value, this._fetch();
    }}></sm-segmented>
      </div>
      <sm-plan .hass=${this.hass} .loads=${this.loads} .loadId=${this.loadId}></sm-plan>
      <div class="card"><div class="card-head"><h2>${o("a.summary")}</h2>${this._loading ? d`<span class="meta">…</span>` : _}</div>${this._summary()}</div>
      <div class="card"><div class="card-head"><h2>${o("a.timeline")}</h2></div><div class="card-body">${this._history()}</div></div>
      ${this._sessions()}
      <div class="two">${this._daily()}${this._rhythm()}${this._quarters()}</div>
    `;
  }
};
U.styles = [
  D,
  X,
  E`
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
le([
  m({ attribute: !1 })
], U.prototype, "hass", 2);
le([
  m({ attribute: !1 })
], U.prototype, "loads", 2);
le([
  m()
], U.prototype, "loadId", 2);
le([
  m({ type: Number })
], U.prototype, "peakLimit", 2);
le([
  y()
], U.prototype, "_range", 2);
le([
  y()
], U.prototype, "_data", 2);
le([
  y()
], U.prototype, "_loading", 2);
U = le([
  C("sm-analytics")
], U);
var ys = Object.defineProperty, ws = Object.getOwnPropertyDescriptor, N = (t, e, a, i) => {
  for (var s = i > 1 ? void 0 : i ? ws(e, a) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (i ? r(e, a, s) : r(s)) || s);
  return i && s && ys(e, a, s), s;
};
const $s = 6 * 3600;
let O = class extends z {
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
    this._started = !0, Da(this.hass.language);
    try {
      await this._reload(), this._unsub = await Dt(this.hass, (t) => this._live = t), this._loadSpark(), this._sparkTimer = window.setInterval(() => this._loadSpark(), 6e4);
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t), this._started = !1;
    }
  }
  async _reload() {
    this._config = await xa(this.hass), this._live = this._config.live;
  }
  async _loadSpark() {
    const t = Date.now() / 1e3;
    try {
      const e = await Qt(this.hass, t - $s, t, null), a = {};
      for (const i of e.timeline.rows)
        for (const [s, n] of Object.entries(i[3]))
          (a[s] ?? (a[s] = [])).push([i[0], Math.abs(n[0] ?? 0), n[1] ?? 0]);
      this._spark = a;
    } catch {
    }
  }
  async _resubscribe() {
    var t;
    (t = this._unsub) == null || t.call(this), this._unsub = void 0;
    for (let e = 0; e < 20; e++) {
      await new Promise((a) => setTimeout(a, 500));
      try {
        await this._reload(), this._unsub = await Dt(this.hass, (a) => this._live = a);
        return;
      } catch {
      }
    }
  }
  _flashSave(t) {
    this._save = t, window.clearTimeout(this._saveTimer), t === "saved" && (this._saveTimer = window.setTimeout(() => this._save = "", 2500));
  }
  _setOrder(t) {
    const e = this._config, a = new Map(e.loads.map((i) => [i.id, i]));
    this._config = { ...e, loads: t.map((i) => a.get(i)).filter(Boolean) };
  }
  async _setMode(t, e) {
    const a = this._config;
    this._config = { ...a, loads: a.loads.map((i) => i.id === t ? { ...i, mode: e } : i) }, this._flashSave("saving"), await Aa(this.hass, t, e), this._flashSave("saved");
  }
  async _setMinPower(t, e) {
    const a = this._config;
    this._config = { ...a, loads: a.loads.map((i) => i.id === t ? { ...i, ev_min_power_w: e } : i) }, this._flashSave("saving"), await Ma(this.hass, t, e), this._flashSave("saved");
  }
  async _moveLoad(t, e) {
    const a = this._config.loads.map((n) => n.id), i = a.indexOf(t), s = i + e;
    s < 0 || s >= a.length || ([a[i], a[s]] = [a[s], a[i]], this._setOrder(a), await Xt(this.hass, a));
  }
  _addFields() {
    var s;
    const t = (n) => n.type === "ev", e = (n) => n.type === "battery", a = (n) => !t(n) && !e(n), i = (n) => t(n) && n.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev", "battery"].map((n) => ({ value: n, label: o(`type.${n}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: a },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: a },
      { key: "bat_soc_entity", kind: "entity", domains: ["sensor"], show: e },
      { key: "bat_power_entity", kind: "entity", domains: ["sensor"], show: e, helper: o("f.bat_power_entity.help") },
      { key: "bat_power_sign", kind: "select", show: e, options: ["charge_positive", "discharge_positive"].map((n) => ({ value: n, label: o(`f.bat_sign.${n}`) })) },
      { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], show: e, helper: o("f.bat_setpoint_entity.help") },
      { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1, show: e },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((n) => ({ value: n, label: o(`f.ev_driver.${n}`) })), show: t },
      { key: "ev_proxy_url", kind: "text", show: i, helper: o("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: i },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (n) => t(n) && !i(n) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (n) => t(n) && !i(n) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: o("f.power_entity.help"), show: (n) => !e(n) },
      { key: "mode", kind: "select", options: mt((s = this._adding) == null ? void 0 : s.type).map((n) => {
        var r;
        return { value: n, label: o(wt(n, (r = this._adding) == null ? void 0 : r.type)) };
      }) }
    ];
  }
  _startAdd() {
    this._addError = "", this._adding = { ...this._config.defaults.load, id: "", name: "", ev_driver: "tesla_ble_proxy" };
  }
  async _saveAdd() {
    const t = { ...this._adding };
    t.type !== "switch" && (!t.icon || t.icon === "mdi:water-boiler") && (t.icon = me(t.type)), mt(t.type).includes(t.mode) || (t.mode = t.type === "battery" ? "self" : "solar"), this._addBusy = !0;
    try {
      const e = await Jt(this.hass, t);
      this._adding = null, await this._resubscribe(), this._detail = e.load.id;
    } catch (e) {
      this._addError = (e == null ? void 0 : e.message) ?? String(e);
    } finally {
      this._addBusy = !1;
    }
  }
  _menuButton() {
    return this.narrow && customElements.get("ha-menu-button") ? d`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : _;
  }
  _saveIndicator() {
    if (!this._save) return _;
    const t = this._save === "saving" ? "mdi:cloud-upload-outline" : this._save === "saved" ? "mdi:check-circle-outline" : "mdi:alert-circle-outline";
    return d`<span class="save ${this._save}"><ha-icon .icon=${t}></ha-icon>${o(`save.${this._save}`)}</span>`;
  }
  _toolbar() {
    const t = this._config, e = this._detail ? t == null ? void 0 : t.loads.find((a) => a.id === this._detail) : void 0;
    return e ? d`<div class="toolbar">
        <button class="icon" @click=${() => this._detail = null} title=${o("nav.back")}><ha-icon icon="mdi:arrow-left"></ha-icon></button>
        <span class="title pad">${e.name}</span>
        ${this._saveIndicator()}
        <button class="icon" title=${o("load.analytics")} @click=${() => {
      this._analyticsLoad = e.id, this._detail = null, this._tab = "analytics";
    }}>
          <ha-icon icon="mdi:chart-line"></ha-icon></button>
      </div>` : d`<div class="toolbar">
        ${this._menuButton()}
        <span class="title ${this.narrow ? "" : "pad"}">SolarMind</span>
        ${this._saveIndicator()}
        ${this._tab === "loads" && (t != null && t.loads.length) ? d`<button class="icon" title=${this._editing ? o("nav.done") : o("nav.reorder")} @click=${() => this._editing = !this._editing}>
              <ha-icon .icon=${this._editing ? "mdi:check" : "mdi:pencil"}></ha-icon></button>` : _}
      </div>
      <nav class="tabs">
        ${["loads", "analytics", "settings"].map(
      (a) => d`<button class="tab ${this._tab === a ? "on" : ""}" @click=${() => {
        this._tab = a, this._editing = !1;
      }}>${o(`tab.${a}`)}</button>`
    )}
      </nav>`;
  }
  _content(t) {
    var a, i, s, n, r;
    const e = this._detail ? t.loads.findIndex((p) => p.id === this._detail) : -1;
    if (e >= 0) {
      const p = { ...t.defaults.load, ...t.loads[e] };
      return d`<sm-load-detail .hass=${this.hass} .load=${p} .live=${(i = (a = this._live) == null ? void 0 : a.loads) == null ? void 0 : i[p.id]} .spark=${this._spark[p.id] ?? []}
        .priority=${e + 1} .count=${t.loads.length}
        @set-mode=${(l) => this._setMode(l.detail.id, l.detail.mode)}
        @set-min-power=${(l) => this._setMinPower(l.detail.id, l.detail.power_w)}
        @move-load=${(l) => this._moveLoad(l.detail.id, l.detail.delta)}
        @open-analytics=${(l) => {
        this._analyticsLoad = l.detail.id, this._detail = null, this._tab = "analytics";
      }}
        @load-saved=${async (l) => {
        this._flashSave("saved"), l.detail.renamed ? await this._resubscribe() : await this._reload();
      }}
        @load-deleted=${async () => {
        this._detail = null, await this._resubscribe();
      }}></sm-load-detail>`;
    }
    switch (this._tab) {
      case "analytics":
        return d`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad} .peakLimit=${((n = (s = this._live) == null ? void 0 : s.site) == null ? void 0 : n.peak_limit_w) ?? null}
          @analytics-load=${(p) => this._analyticsLoad = p.detail.id}></sm-analytics>`;
      case "settings":
        return d`<sm-settings .hass=${this.hass} .settings=${t.settings} .site=${(r = this._live) == null ? void 0 : r.site} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(p) => {
          this._config = { ...t, settings: { ...t.settings, ...p.detail.settings } }, this._flashSave("saved");
        }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return d`<sm-dashboard .hass=${this.hass} .loads=${t.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(p) => this._detail = p.detail.id}
          @set-mode=${(p) => this._setMode(p.detail.id, p.detail.mode)}
        @set-min-power=${(p) => this._setMinPower(p.detail.id, p.detail.power_w)}
          @loads-reordered=${(p) => this._setOrder(p.detail.order)}
          @add-load=${this._startAdd}></sm-dashboard>`;
    }
  }
  render() {
    if (this._error) return d`<div class="err">${this._error}</div>`;
    const t = this._config;
    return d`
      ${this._toolbar()}
      ${t && t.version && t.version !== "0.2.5" ? d`<div class="stale"><ha-icon icon="mdi:update"></ha-icon>
            <span>${o("panel.stale").replace("{server}", t.version).replace("{panel}", "0.2.5")}</span>
            <button class="text" @click=${() => location.reload()}>${o("panel.reload")}</button></div>` : _}
      <main>${t ? this._content(t) : _}</main>
      ${this._adding ? d`<sm-dialog .heading=${o("loads.add")} .saveLabel=${o("load.add_save")} .busy=${this._addBusy} .error=${this._addError}
            .canSave=${!!this._adding.name} @closed=${() => this._adding = null} @save=${this._saveAdd}>
            <sm-form .hass=${this.hass} .fields=${this._addFields()} .data=${this._adding}
              @value-changed=${(e) => this._adding = { ...this._adding, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : _}
    `;
  }
};
O.styles = [
  D,
  X,
  E`
      .stale {
        display: flex; align-items: center; gap: 10px; margin: 12px 16px 0; padding: 10px 14px; border-radius: 12px;
        background: color-mix(in srgb, var(--sm-warn) 12%, transparent); color: var(--sm-warn-text); font-size: 14px;
      }
      .stale span { flex: 1; }
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
N([
  m({ attribute: !1 })
], O.prototype, "hass", 2);
N([
  m({ type: Boolean })
], O.prototype, "narrow", 2);
N([
  y()
], O.prototype, "_config", 2);
N([
  y()
], O.prototype, "_live", 2);
N([
  y()
], O.prototype, "_tab", 2);
N([
  y()
], O.prototype, "_detail", 2);
N([
  y()
], O.prototype, "_editing", 2);
N([
  y()
], O.prototype, "_analyticsLoad", 2);
N([
  y()
], O.prototype, "_spark", 2);
N([
  y()
], O.prototype, "_adding", 2);
N([
  y()
], O.prototype, "_addBusy", 2);
N([
  y()
], O.prototype, "_addError", 2);
N([
  y()
], O.prototype, "_save", 2);
N([
  y()
], O.prototype, "_error", 2);
O = N([
  C("solarmind-panel")
], O);
export {
  O as SolarMindPanel
};
