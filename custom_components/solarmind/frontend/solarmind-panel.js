/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis, Le = xe.ShadowRoot && (xe.ShadyCSS === void 0 || xe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, De = Symbol(), We = /* @__PURE__ */ new WeakMap();
let at = class {
  constructor(e, s, a) {
    if (this._$cssResult$ = !0, a !== De) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Le && e === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (e = We.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && We.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (t) => new at(typeof t == "string" ? t : t + "", void 0, De), R = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((a, i, r) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[r + 1], t[0]);
  return new at(s, t, De);
}, vt = (t, e) => {
  if (Le) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const a = document.createElement("style"), i = xe.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = s.cssText, t.appendChild(a);
  }
}, Ve = Le ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const a of e.cssRules) s += a.cssText;
  return gt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $t, defineProperty: ft, getOwnPropertyDescriptor: bt, getOwnPropertyNames: yt, getOwnPropertySymbols: xt, getPrototypeOf: wt } = Object, U = globalThis, Be = U.trustedTypes, kt = Be ? Be.emptyScript : "", Me = U.reactiveElementPolyfillSupport, ce = (t, e) => t, ke = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? kt : null;
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
} }, Te = (t, e) => !$t(t, e), qe = { attribute: !0, type: String, converter: ke, reflect: !1, useDefault: !1, hasChanged: Te };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), U.litPropertyMetadata ?? (U.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ie = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = qe) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(e, a, s);
      i !== void 0 && ft(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, s, a) {
    const { get: i, set: r } = bt(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: i, set(n) {
      const o = i == null ? void 0 : i.call(this);
      r == null || r.call(this, n), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? qe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ce("elementProperties"))) return;
    const e = wt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ce("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ce("properties"))) {
      const s = this.properties, a = [...yt(s), ...xt(s)];
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
      for (const i of a) s.unshift(Ve(i));
    } else e !== void 0 && s.push(Ve(e));
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
    return vt(e, this.constructor.elementStyles), e;
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
      const n = (((r = a.converter) == null ? void 0 : r.toAttribute) !== void 0 ? a.converter : ke).toAttribute(s, a.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var r, n;
    const a = this.constructor, i = a._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = a.getPropertyOptions(i), d = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((r = o.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? o.converter : ke;
      this._$Em = i;
      const u = d.fromAttribute(s, o.type);
      this[i] = u ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, s, a, i = !1, r) {
    var n;
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (r = this[e]), a ?? (a = o.getPropertyOptions(e)), !((a.hasChanged ?? Te)(r, s) || a.useDefault && a.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(o._$Eu(e, a)))) return;
      this.C(e, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: a, reflect: i, wrapped: r }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (s = void 0), this._$AL.set(e, s)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, n] of i) {
        const { wrapped: o } = n, d = this[r];
        o !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, n, d);
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
ie.elementStyles = [], ie.shadowRootOptions = { mode: "open" }, ie[ce("elementProperties")] = /* @__PURE__ */ new Map(), ie[ce("finalized")] = /* @__PURE__ */ new Map(), Me == null || Me({ ReactiveElement: ie }), (U.reactiveElementVersions ?? (U.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = globalThis, Fe = (t) => t, Ae = he.trustedTypes, Ze = Ae ? Ae.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, nt = "$lit$", z = `lit$${Math.random().toFixed(9).slice(2)}$`, rt = "?" + z, At = `<${rt}>`, J = document, pe = () => J.createComment(""), ue = (t) => t === null || typeof t != "object" && typeof t != "function", Ie = Array.isArray, St = (t) => Ie(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Pe = `[ 	
\f\r]`, le = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ke = /-->/g, Ge = />/g, F = RegExp(`>|${Pe}(?:([^\\s"'>=/]+)(${Pe}*=${Pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ye = /'/g, Je = /"/g, ot = /^(?:script|style|textarea|title)$/i, lt = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), h = lt(1), S = lt(2), ne = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Xe = /* @__PURE__ */ new WeakMap(), G = J.createTreeWalker(J, 129);
function dt(t, e) {
  if (!Ie(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ze !== void 0 ? Ze.createHTML(e) : e;
}
const Et = (t, e) => {
  const s = t.length - 1, a = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = le;
  for (let o = 0; o < s; o++) {
    const d = t[o];
    let u, c, m = -1, g = 0;
    for (; g < d.length && (n.lastIndex = g, c = n.exec(d), c !== null); ) g = n.lastIndex, n === le ? c[1] === "!--" ? n = Ke : c[1] !== void 0 ? n = Ge : c[2] !== void 0 ? (ot.test(c[2]) && (i = RegExp("</" + c[2], "g")), n = F) : c[3] !== void 0 && (n = F) : n === F ? c[0] === ">" ? (n = i ?? le, m = -1) : c[1] === void 0 ? m = -2 : (m = n.lastIndex - c[2].length, u = c[1], n = c[3] === void 0 ? F : c[3] === '"' ? Je : Ye) : n === Je || n === Ye ? n = F : n === Ke || n === Ge ? n = le : (n = F, i = void 0);
    const A = n === F && t[o + 1].startsWith("/>") ? " " : "";
    r += n === le ? d + At : m >= 0 ? (a.push(u), d.slice(0, m) + nt + d.slice(m) + z + A) : d + z + (m === -2 ? o : A);
  }
  return [dt(t, r + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class me {
  constructor({ strings: e, _$litType$: s }, a) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const o = e.length - 1, d = this.parts, [u, c] = Et(e, s);
    if (this.el = me.createElement(u, a), G.currentNode = this.el.content, s === 2 || s === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (i = G.nextNode()) !== null && d.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const m of i.getAttributeNames()) if (m.endsWith(nt)) {
          const g = c[n++], A = i.getAttribute(m).split(z), B = /([.?@])?(.*)/.exec(g);
          d.push({ type: 1, index: r, name: B[2], strings: A, ctor: B[1] === "." ? Pt : B[1] === "?" ? Ct : B[1] === "@" ? Ot : Se }), i.removeAttribute(m);
        } else m.startsWith(z) && (d.push({ type: 6, index: r }), i.removeAttribute(m));
        if (ot.test(i.tagName)) {
          const m = i.textContent.split(z), g = m.length - 1;
          if (g > 0) {
            i.textContent = Ae ? Ae.emptyScript : "";
            for (let A = 0; A < g; A++) i.append(m[A], pe()), G.nextNode(), d.push({ type: 2, index: ++r });
            i.append(m[g], pe());
          }
        }
      } else if (i.nodeType === 8) if (i.data === rt) d.push({ type: 2, index: r });
      else {
        let m = -1;
        for (; (m = i.data.indexOf(z, m + 1)) !== -1; ) d.push({ type: 7, index: r }), m += z.length - 1;
      }
      r++;
    }
  }
  static createElement(e, s) {
    const a = J.createElement("template");
    return a.innerHTML = e, a;
  }
}
function re(t, e, s = t, a) {
  var n, o;
  if (e === ne) return e;
  let i = a !== void 0 ? (n = s._$Co) == null ? void 0 : n[a] : s._$Cl;
  const r = ue(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((o = i == null ? void 0 : i._$AO) == null || o.call(i, !1), r === void 0 ? i = void 0 : (i = new r(t), i._$AT(t, s, a)), a !== void 0 ? (s._$Co ?? (s._$Co = []))[a] = i : s._$Cl = i), i !== void 0 && (e = re(t, i._$AS(t, e.values), i, a)), e;
}
class Mt {
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
    const { el: { content: s }, parts: a } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? J).importNode(s, !0);
    G.currentNode = i;
    let r = G.nextNode(), n = 0, o = 0, d = a[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let u;
        d.type === 2 ? u = new _e(r, r.nextSibling, this, e) : d.type === 1 ? u = new d.ctor(r, d.name, d.strings, this, e) : d.type === 6 && (u = new jt(r, this, e)), this._$AV.push(u), d = a[++o];
      }
      n !== (d == null ? void 0 : d.index) && (r = G.nextNode(), n++);
    }
    return G.currentNode = J, i;
  }
  p(e) {
    let s = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, s), s += a.strings.length - 2) : a._$AI(e[s])), s++;
  }
}
class _e {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, a, i) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = a, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = re(this, e, s), ue(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== ne && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : St(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && ue(this._$AH) ? this._$AA.nextSibling.data = e : this.T(J.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: s, _$litType$: a } = e, i = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = me.createElement(dt(a.h, a.h[0]), this.options)), a);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(s);
    else {
      const n = new Mt(i, this), o = n.u(this.options);
      n.p(s), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let s = Xe.get(e.strings);
    return s === void 0 && Xe.set(e.strings, s = new me(e)), s;
  }
  k(e) {
    Ie(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, i = 0;
    for (const r of e) i === s.length ? s.push(a = new _e(this.O(pe()), this.O(pe()), this, this.options)) : a = s[i], a._$AI(r), i++;
    i < s.length && (this._$AR(a && a._$AB.nextSibling, i), s.length = i);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, s); e !== this._$AB; ) {
      const i = Fe(e).nextSibling;
      Fe(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Se {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, a, i, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = s, this._$AM = i, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = _;
  }
  _$AI(e, s = this, a, i) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = re(this, e, s, 0), n = !ue(e) || e !== this._$AH && e !== ne, n && (this._$AH = e);
    else {
      const o = e;
      let d, u;
      for (e = r[0], d = 0; d < r.length - 1; d++) u = re(this, o[a + d], s, d), u === ne && (u = this._$AH[d]), n || (n = !ue(u) || u !== this._$AH[d]), u === _ ? e = _ : e !== _ && (e += (u ?? "") + r[d + 1]), this._$AH[d] = u;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pt extends Se {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class Ct extends Se {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class Ot extends Se {
  constructor(e, s, a, i, r) {
    super(e, s, a, i, r), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = re(this, e, s, 0) ?? _) === ne) return;
    const a = this._$AH, i = e === _ && a !== _ || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, r = e !== _ && (a === _ || i);
    i && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class jt {
  constructor(e, s, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    re(this, e);
  }
}
const Ce = he.litHtmlPolyfillSupport;
Ce == null || Ce(me, _e), (he.litHtmlVersions ?? (he.litHtmlVersions = [])).push("3.3.3");
const Nt = (t, e, s) => {
  const a = (s == null ? void 0 : s.renderBefore) ?? e;
  let i = a._$litPart$;
  if (i === void 0) {
    const r = (s == null ? void 0 : s.renderBefore) ?? null;
    a._$litPart$ = i = new _e(e.insertBefore(pe(), r), r, void 0, s ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis;
class C extends ie {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Nt(s, this.renderRoot, this.renderOptions);
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
    return ne;
  }
}
var it;
C._$litElement$ = !0, C.finalized = !0, (it = Y.litElementHydrateSupport) == null || it.call(Y, { LitElement: C });
const Oe = Y.litElementPolyfillSupport;
Oe == null || Oe({ LitElement: C });
(Y.litElementVersions ?? (Y.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = { attribute: !0, type: String, converter: ke, reflect: !1, hasChanged: Te }, Dt = (t = Lt, e, s) => {
  const { kind: a, metadata: i } = s;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(s.name, t), a === "accessor") {
    const { name: n } = s;
    return { set(o) {
      const d = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(n, d, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, t, o), o;
    } };
  }
  if (a === "setter") {
    const { name: n } = s;
    return function(o) {
      const d = this[n];
      e.call(this, o), this.requestUpdate(n, d, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function v(t) {
  return (e, s) => typeof s == "object" ? Dt(t, e, s) : ((a, i, r) => {
    const n = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, a), n ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(t) {
  return v({ ...t, state: !0, attribute: !1 });
}
const Tt = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), It = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), zt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), Ut = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Ht = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), Rt = (t, e, s) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: s }), Wt = (t, e, s, a) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: s, load_id: a }), Qe = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), et = {
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
  "mode.solar": "Enkel zon",
  "mode.solar_night": "Zon + nacht",
  "mode.on": "Altijd aan",
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
  "f.nominal_power_w": "Nominaal vermogen (W)",
  "f.power_entity": "Vermogenssensor (optioneel, aanbevolen)",
  "f.switch_entity": "Schakelaar (slimme stekker)",
  "f.temperature_entity": "Temperatuursensor (optioneel)",
  "f.max_temperature": "Stop bij temperatuur (°C, optioneel)",
  "f.start_delay_s": "Startvertraging (s)",
  "f.stop_delay_s": "Stopvertraging (s)",
  "f.min_on_s": "Minimale aan-tijd (s)",
  "f.min_off_s": "Minimale uit-tijd (s)",
  "f.allowed_import_w": "Toegelaten afname tijdens zon (W)",
  "f.start_margin_w": "Extra overschot nodig om te starten (W)",
  "f.peak_shed": "Mag afgeschakeld worden door de piekbewaking",
  "f.night_min_solar_kwh": "'s Nachts aanvullen als vandaag minder dan (kWh) van zon kwam",
  "f.night_target_kwh": "Hoeveel 's nachts aanvullen (kWh, 0 = tot vol)",
  "f.night_min_temperature": "Of: aanvullen als temperatuur onder (°C)",
  "f.night_skip_forecast_kwh": "Niet aanvullen als de voorspelling voor morgen hoger is dan (kWh)",
  "f.legionella_enabled": "Legionellacyclus inschakelen",
  "f.legionella_temperature": "Minimumtemperatuur (°C)",
  "f.legionella_interval_days": "Minstens elke (dagen)",
  "f.legionella.hint": "Werkt met een temperatuursensor. Als die temperatuur niet bereikt werd, verwarmt SolarMind 's nachts bij.",
  "f.full_threshold_w": "Als 'vol' beschouwen onder (W)",
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
  "f.ev_min_current": "Minimum stroom (A)",
  "f.ev_max_current": "Maximum stroom (A)",
  "f.ev_min_soc": "Altijd laden onder (%, optioneel)",
  "f.ev_target_soc": "Nachtladen tot (%)",
  "f.ev_current_step_interval_s": "Stroom max. verhogen elke (s)",
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
  "s.pv_forecast_today_entity": "Voorspelling vandaag (kWh, optioneel)",
  "s.pv_forecast_tomorrow_entity": "Voorspelling morgen (kWh, optioneel)",
  "s.peak_guard_enabled": "Piekbewaking actief",
  "s.peak_limit_w": "Grens kwartiergemiddelde (W)",
  "s.peak_follow_month_max": "Tot de reeds bereikte maandpiek mag",
  "s.peak_margin_w": "Veiligheidsmarge (W)",
  "s.night_start": "Start",
  "s.night_end": "Einde",
  "s.price_import": "Afnameprijs (€/kWh)",
  "s.price_export": "Injectievergoeding (€/kWh)",
  "s.voltage": "Netspanning (V)",
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
  "a.rhythm": "Dagritme (gem. vermogen per uur, 14 dagen)",
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
  "a.ongoing": "bezig"
}, Vt = {
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
  "mode.solar": "Solar only",
  "mode.solar_night": "Solar + night",
  "mode.on": "Always on",
  "mode.off": "Off",
  "mode.solar.desc": "Runs only on solar surplus.",
  "mode.solar_night.desc": "Runs on solar and tops up from the grid at night when the yield was low.",
  "mode.on.desc": "Always on (the peak guard may still step in).",
  "mode.off.desc": "SolarMind keeps this load off.",
  "type.switch": "On/off (boiler, plug)",
  "type.ev": "EV charger (adjustable)",
  "s.saved": "Saved",
  "a.no_data": "No data in this period yet."
};
let ct = "nl";
const Bt = (t) => {
  ct = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, l = (t) => (ct === "en" ? Vt[t] ?? et[t] : et[t]) ?? t, ge = R`
  :host {
    --sm-solar: #f5a623;
    --sm-grid: #5b8def;
    --sm-export: #3fb68b;
    --sm-warn: #e0533d;
    --sm-muted: var(--secondary-text-color, #777);
    --sm-card: var(--card-background-color, #fff);
    --sm-border: var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .card {
    background: var(--sm-card);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.15));
    border: var(--ha-card-border-width, 0) solid var(--sm-border);
    padding: 16px;
    margin-bottom: 16px;
  }
  h2 { font-size: 1.15rem; font-weight: 500; margin: 0 0 12px; }
  h3 { font-size: 1rem; font-weight: 500; margin: 16px 0 8px; }
  .muted { color: var(--sm-muted); font-size: 0.9em; }
  .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .spacer { flex: 1; }
  button {
    font: inherit; cursor: pointer; border-radius: 8px; padding: 6px 14px;
    border: 1px solid var(--sm-border); background: transparent; color: inherit;
  }
  button.primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }
  button.danger { color: var(--sm-warn); border-color: var(--sm-warn); }
  button:disabled { opacity: 0.5; cursor: default; }
  .chip {
    display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 999px; font-size: 0.85em;
    background: rgba(127, 127, 127, 0.15);
  }
  .chip.solar { background: rgba(245, 166, 35, 0.2); }
  .chip.grid { background: rgba(91, 141, 239, 0.2); }
  .chip.warn { background: rgba(224, 83, 61, 0.2); }
  .seg { display: inline-flex; border: 1px solid var(--sm-border); border-radius: 8px; overflow: hidden; }
  .seg button { border: 0; border-radius: 0; padding: 4px 10px; font-size: 0.85em; }
  .seg button + button { border-left: 1px solid var(--sm-border); }
  .seg button.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
  .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px 16px; }
  label.field { display: flex; flex-direction: column; gap: 4px; font-size: 0.9em; }
  label.check { display: flex; align-items: center; gap: 8px; font-size: 0.95em; }
  input, select {
    font: inherit; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--sm-border);
    background: var(--input-fill-color, var(--secondary-background-color, transparent)); color: inherit;
  }
  table { border-collapse: collapse; width: 100%; font-size: 0.9em; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--sm-border); }
  th { font-weight: 500; color: var(--sm-muted); }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .stat { display: flex; flex-direction: column; }
  .stat .v { font-size: 1.4rem; font-weight: 500; font-variant-numeric: tabular-nums; }
  .stat .l { font-size: 0.8rem; color: var(--sm-muted); }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
  .banner { padding: 10px 14px; border-radius: 8px; background: rgba(224, 83, 61, 0.12); margin-bottom: 12px; }
`, k = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, x = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, de = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, we = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), s = Math.round(t % 3600 / 60);
  return e ? `${e} u ${s} min` : `${s} min`;
}, je = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`;
var qt = Object.defineProperty, Ft = Object.getOwnPropertyDescriptor, ve = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ft(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && qt(e, s, i), i;
};
const Zt = ["solar", "solar_night", "on", "off"], Kt = (t) => t === "solar" ? "solar" : ["night", "always_on", "legionella", "min_soc"].includes(t) ? "grid" : t === "peak_guard" ? "warn" : "";
let X = class extends C {
  constructor() {
    super(...arguments), this.loads = [], this._dragId = null;
  }
  _emit(t, e = {}) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  async _move(t, e) {
    const s = this.loads.map((r) => r.id), a = s.indexOf(t), i = a + e;
    i < 0 || i >= s.length || ([s[a], s[i]] = [s[i], s[a]], await this._saveOrder(s));
  }
  async _saveOrder(t) {
    this._emit("loads-reordered", { order: t }), await Ht(this.hass, t);
  }
  _onDrop(t) {
    if (!this._dragId || this._dragId === t) return;
    const e = this.loads.map((s) => s.id).filter((s) => s !== this._dragId);
    e.splice(e.indexOf(t), 0, this._dragId), this._dragId = null, this._saveOrder(e);
  }
  async _setMode(t, e) {
    this._emit("load-mode", { id: t.id, mode: e }), await Rt(this.hass, t.id, e);
  }
  _renderSite() {
    var a;
    const t = ((a = this.live) == null ? void 0 : a.site) ?? {}, e = t.grid_w, s = (i) => Math.min(100, Math.max(0, i / Math.max(1, (t.peak_limit_w ?? 2500) * 1.25) * 100));
    return h`
      ${t.enabled === !1 ? h`<div class="banner">${l("site.disabled")}</div>` : _}
      ${t.available === !1 ? h`<div class="banner">${l("site.no_grid")}</div>` : _}
      <div class="card">
        <div class="flow">
          <div class="tile solar"><div class="l">${l("site.pv")}</div><div class="v">${k(t.pv_w)}</div></div>
          <div class="tile ${e !== null && e < 0 ? "export" : "import"}">
            <div class="l">${l("site.grid")} · ${e !== null && e < 0 ? l("site.export") : l("site.import")}</div>
            <div class="v">${k(e === null ? null : Math.abs(e))}</div>
          </div>
          <div class="tile"><div class="l">${l("site.house")}</div><div class="v">${k(t.base_w !== void 0 && t.pv_w != null ? t.base_w + t.pv_w : null)}</div></div>
          <div class="tile"><div class="l">${l("site.managed")}</div><div class="v">${k(t.managed_w)}</div></div>
          <div class="tile"><div class="l">${l("site.surplus")}</div><div class="v">${k(t.surplus_w)}</div></div>
        </div>
        <h3>${l("site.peak")}</h3>
        <div class="peakbar">
          <div class="fill" style="width:${s(t.quarter_average_w ?? 0)}%"></div>
          <div class="proj" style="left:${s(t.quarter_projected_w ?? 0)}%"></div>
          <div class="proj" style="left:${s(t.peak_limit_w ?? 0)}%;background:var(--primary-text-color)"></div>
        </div>
        <div class="row muted">
          <span>${l("site.peak_now")}: ${k(t.quarter_average_w)}</span>
          <span>· ${l("site.peak_projected")}: ${k(t.quarter_projected_w)}</span>
          <span>· ${l("site.peak_limit")}: ${k(t.peak_limit_w)}</span>
          <span>· ${l("site.month_peak")}: ${k(t.month_peak_w)}</span>
          ${t.in_night ? h`<span class="chip grid">${l("site.night")}</span>` : _}
        </div>
      </div>
    `;
  }
  _renderLoad(t, e) {
    var d, u;
    const s = (u = (d = this.live) == null ? void 0 : d.loads) == null ? void 0 : u[t.id], a = (s == null ? void 0 : s.power_w) ?? 0, i = (s == null ? void 0 : s.solar_w) ?? 0, r = Math.max(1, t.type === "ev" ? t.ev_max_current * 230 * t.ev_phases : t.nominal_power_w), n = t.icon || (t.type === "ev" ? "mdi:ev-station" : "mdi:water-boiler"), o = [];
    return (s == null ? void 0 : s.temperature) != null && o.push(`${s.temperature.toFixed(1)} °C`), (s == null ? void 0 : s.soc) != null && o.push(`${Math.round(s.soc)}%`), (s == null ? void 0 : s.current_a) != null && t.type === "ev" && o.push(`${Math.round(s.current_a)} A`), h`
      <div
        class="load ${this._dragId === t.id ? "dragging" : ""} ${t.enabled ? "" : "disabled"}"
        draggable="true"
        @dragstart=${() => this._dragId = t.id}
        @dragend=${() => this._dragId = null}
        @dragover=${(c) => c.preventDefault()}
        @drop=${() => this._onDrop(t.id)}
      >
        <div class="handle">
          <button @click=${() => this._move(t.id, -1)} ?disabled=${e === 0}>▲</button>
          <span class="prio">${e + 1}</span>
          <button @click=${() => this._move(t.id, 1)} ?disabled=${e === this.loads.length - 1}>▼</button>
        </div>
        <ha-icon class=${s != null && s.is_on && a > 1 ? "on" : ""} .icon=${n}></ha-icon>
        <div class="body">
          <div class="row">
            <span class="name">${t.name}</span>
            <span class="chip ${Kt((s == null ? void 0 : s.reason) ?? "")}">${l(`reason.${(s == null ? void 0 : s.reason) ?? "idle"}`)}</span>
            ${o.length ? h`<span class="muted">${o.join(" · ")}</span>` : _}
          </div>
          <div class="meter">
            <div class="s" style="width:${Math.min(i, r) / r * 100}%"></div>
            <div class="g" style="width:${Math.min(Math.max(0, a - i), r) / r * 100}%"></div>
          </div>
          <div class="row muted" style="margin-top:6px">
            <span>${x((s == null ? void 0 : s.kwh_today) ?? 0)} ${l("load.today")} · ${x((s == null ? void 0 : s.solar_kwh_today) ?? 0)} ${l("load.from_solar")} · ${we(s == null ? void 0 : s.runtime_today_s)}</span>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="seg">
              ${Zt.map(
      (c) => h`<button class=${t.mode === c ? "on" : ""} title=${l(`mode.${c}.desc`)} @click=${() => this._setMode(t, c)}>${l(`mode.${c}`)}</button>`
    )}
            </div>
            <span class="spacer"></span>
            <button @click=${() => this._emit("open-analytics", { id: t.id })}>${l("load.analytics")}</button>
            <button @click=${() => this._emit("edit-load", { id: t.id })}>${l("load.edit")}</button>
          </div>
        </div>
        <div class="power">${k(a)}</div>
      </div>
    `;
  }
  render() {
    return h`
      ${this._renderSite()}
      <div class="card">
        <div class="row">
          <h2 style="margin:0">${l("loads.title")}</h2>
          <span class="spacer"></span>
          <button class="primary" @click=${() => this._emit("edit-load", { id: null })}>+ ${l("loads.add")}</button>
        </div>
        <p class="muted">${l("loads.hint")}</p>
        ${this.loads.length ? this.loads.map((t, e) => this._renderLoad(t, e)) : h`<p>${l("loads.empty")}</p>`}
      </div>
    `;
  }
};
X.styles = [
  ge,
  R`
      .flow { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
      .tile { border-radius: 10px; padding: 12px; background: rgba(127, 127, 127, 0.08); }
      .tile .v { font-size: 1.5rem; font-weight: 500; font-variant-numeric: tabular-nums; }
      .tile .l { font-size: 0.8rem; color: var(--sm-muted); }
      .tile.solar { background: rgba(245, 166, 35, 0.14); }
      .tile.export { background: rgba(63, 182, 139, 0.14); }
      .tile.import { background: rgba(91, 141, 239, 0.14); }
      .peakbar { position: relative; height: 10px; border-radius: 5px; background: rgba(127, 127, 127, 0.15); margin: 8px 0 4px; overflow: hidden; }
      .peakbar .fill { position: absolute; inset: 0 auto 0 0; background: var(--sm-grid); }
      .peakbar .proj { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--sm-warn); }
      .load { display: flex; gap: 12px; align-items: center; padding: 12px; border: 1px solid var(--sm-border); border-radius: 10px; margin-bottom: 8px; background: var(--sm-card); }
      .load.dragging { opacity: 0.4; }
      .load.disabled { opacity: 0.6; }
      .handle { cursor: grab; color: var(--sm-muted); user-select: none; display: flex; flex-direction: column; align-items: center; }
      .handle .prio { font-weight: 600; font-size: 1.1rem; color: var(--primary-text-color); }
      .handle button { padding: 0 6px; border: 0; font-size: 0.8rem; line-height: 1; }
      .body { flex: 1; min-width: 0; }
      .name { font-weight: 500; font-size: 1.05rem; }
      .meter { height: 6px; border-radius: 3px; background: rgba(127, 127, 127, 0.15); overflow: hidden; margin-top: 6px; display: flex; }
      .meter .s { background: var(--sm-solar); }
      .meter .g { background: var(--sm-grid); }
      .power { font-size: 1.3rem; font-weight: 500; font-variant-numeric: tabular-nums; min-width: 90px; text-align: right; }
      ha-icon { --mdc-icon-size: 28px; color: var(--sm-muted); }
      ha-icon.on { color: var(--sm-solar); }
    `
];
ve([
  v({ attribute: !1 })
], X.prototype, "hass", 2);
ve([
  v({ attribute: !1 })
], X.prototype, "loads", 2);
ve([
  v({ attribute: !1 })
], X.prototype, "live", 2);
ve([
  y()
], X.prototype, "_dragId", 2);
X = ve([
  W("sm-overview")
], X);
var Gt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, oe = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Yt(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Gt(e, s, i), i;
};
let Jt = 0, H = class extends C {
  constructor() {
    super(...arguments), this.label = "", this.value = null, this.domains = [], this.deviceClasses = [], this._listId = `sm-ents-${++Jt}`;
  }
  _options() {
    var t;
    return Object.values(((t = this.hass) == null ? void 0 : t.states) ?? {}).filter((e) => !this.domains.length || this.domains.includes(e.entity_id.split(".")[0])).filter((e) => !this.deviceClasses.length || this.deviceClasses.includes(e.attributes.device_class) || this.deviceClasses.includes(String(e.attributes.unit_of_measurement ?? "").toLowerCase())).sort((e, s) => e.entity_id.localeCompare(s.entity_id));
  }
  _changed(t) {
    const e = t.target.value.trim();
    this.value = e || null, this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: this.value } }));
  }
  render() {
    var e;
    const t = this.value ? (e = this.hass) == null ? void 0 : e.states[this.value] : void 0;
    return h`<label>
      ${this.label}
      <input list=${this._listId} .value=${this.value ?? ""} @change=${this._changed} placeholder="entity_id" />
      <datalist id=${this._listId}>
        ${this._options().map(
      (s) => h`<option value=${s.entity_id}>${s.attributes.friendly_name ?? ""}</option>`
    )}
      </datalist>
      <span class="state">${t ? `${t.attributes.friendly_name ?? ""}: ${t.state} ${t.attributes.unit_of_measurement ?? ""}` : this.value ? "?" : ""}</span>
    </label>`;
  }
};
H.styles = R`
    label { display: flex; flex-direction: column; gap: 4px; font-size: 0.9em; }
    input {
      font: inherit; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc);
      background: var(--input-fill-color, var(--secondary-background-color, transparent)); color: inherit;
    }
    .state { font-size: 0.8em; color: var(--secondary-text-color); min-height: 1em; }
  `;
oe([
  v({ attribute: !1 })
], H.prototype, "hass", 2);
oe([
  v()
], H.prototype, "label", 2);
oe([
  v()
], H.prototype, "value", 2);
oe([
  v({ attribute: !1 })
], H.prototype, "domains", 2);
oe([
  v({ attribute: !1 })
], H.prototype, "deviceClasses", 2);
H = oe([
  W("sm-entity-picker")
], H);
var Xt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, te = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Qt(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Xt(e, s, i), i;
};
const ae = (t) => t.type === "ev", Z = (t) => t.type === "switch", tt = (t) => ae(t) && t.ev_driver === "tesla_ble_proxy", Ne = (t) => ae(t) && t.ev_driver !== "tesla_ble_proxy", es = [
  {
    title: "f.section.general",
    fields: [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev"] },
      { key: "mode", kind: "select", options: ["solar", "solar_night", "on", "off"] },
      { key: "icon", kind: "text" },
      { key: "enabled", kind: "bool" },
      { key: "peak_shed", kind: "bool" }
    ]
  },
  {
    title: "f.section.device",
    fields: [
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: Z },
      { key: "nominal_power_w", kind: "number", show: Z },
      { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"], show: ae },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: Ne },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: Ne },
      { key: "ev_proxy_url", kind: "text", show: tt },
      { key: "ev_vin", kind: "text", show: tt },
      { key: "power_entity", kind: "entity", domains: ["sensor"] },
      { key: "temperature_entity", kind: "entity", domains: ["sensor"], show: Z },
      { key: "max_temperature", kind: "number", nullable: !0, show: Z },
      { key: "ev_soc_entity", kind: "entity", domains: ["sensor"], show: ae },
      { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: Ne },
      { key: "full_threshold_w", kind: "number" }
    ]
  },
  {
    title: "f.section.ev",
    show: ae,
    fields: [
      { key: "ev_phases", kind: "select", options: ["1", "3"] },
      { key: "ev_min_current", kind: "number" },
      { key: "ev_max_current", kind: "number" },
      { key: "ev_min_soc", kind: "number", nullable: !0 },
      { key: "ev_target_soc", kind: "number" },
      { key: "ev_current_step_interval_s", kind: "number" }
    ]
  },
  {
    title: "f.section.timing",
    fields: [
      { key: "start_delay_s", kind: "number" },
      { key: "stop_delay_s", kind: "number" },
      { key: "min_on_s", kind: "number" },
      { key: "min_off_s", kind: "number" },
      { key: "allowed_import_w", kind: "number" },
      { key: "start_margin_w", kind: "number" }
    ]
  },
  {
    title: "f.section.night",
    show: (t) => t.mode === "solar_night",
    fields: [
      { key: "night_min_solar_kwh", kind: "number", step: 0.1, show: (t) => !(ae(t) && t.ev_soc_entity) },
      { key: "night_target_kwh", kind: "number", step: 0.1, show: Z },
      { key: "night_min_temperature", kind: "number", nullable: !0, show: Z },
      { key: "night_skip_forecast_kwh", kind: "number", nullable: !0, step: 0.5 }
    ]
  },
  {
    title: "f.section.legionella",
    show: Z,
    hint: "f.legionella.hint",
    fields: [
      { key: "legionella_enabled", kind: "bool" },
      { key: "legionella_temperature", kind: "number", show: (t) => t.legionella_enabled },
      { key: "legionella_interval_days", kind: "number", show: (t) => t.legionella_enabled }
    ]
  }
];
let T = class extends C {
  constructor() {
    super(...arguments), this._busy = !1, this._confirmDelete = !1, this._error = "";
  }
  willUpdate(t) {
    t.has("load") && (this._draft = { ...this.load });
  }
  _set(t, e) {
    const s = { ...this._draft, [t]: e };
    t === "type" && e === "ev" && (!this._draft.icon || this._draft.icon === "mdi:water-boiler") && (s.icon = "mdi:ev-station"), t === "type" && e === "switch" && this._draft.icon === "mdi:ev-station" && (s.icon = "mdi:water-boiler"), this._draft = s;
  }
  _renderField(t) {
    const e = this._draft;
    if (t.show && !t.show(e)) return _;
    const s = l(`f.${t.key}`), a = e[t.key];
    switch (t.kind) {
      case "entity":
        return h`<sm-entity-picker .hass=${this.hass} .label=${s} .value=${a} .domains=${t.domains ?? []}
          @value-changed=${(i) => this._set(t.key, i.detail.value)}></sm-entity-picker>`;
      case "bool":
        return h`<label class="check"><input type="checkbox" .checked=${!!a}
          @change=${(i) => this._set(t.key, i.target.checked)} />${s}</label>`;
      case "select": {
        const i = t.options ?? [], r = (n) => t.key === "mode" ? l(`mode.${n}`) : t.key === "type" ? l(`type.${n}`) : t.key === "ev_driver" ? l(`f.ev_driver.${n}`) : n;
        return h`<label class="field">${s}
          <select @change=${(n) => {
          const o = n.target.value;
          this._set(t.key, t.key === "ev_phases" ? Number(o) : o);
        }}>
            ${i.map((n) => h`<option value=${n} ?selected=${String(a) === n}>${r(n)}</option>`)}
          </select>
          ${t.key === "mode" ? h`<span class="muted">${l(`mode.${a}.desc`)}</span>` : _}
        </label>`;
      }
      case "number":
        return h`<label class="field">${s}
          <input type="number" step=${t.step ?? 1} .value=${a == null ? "" : String(a)}
            @change=${(i) => {
          const r = i.target.value;
          this._set(t.key, r === "" ? t.nullable ? null : 0 : Number(r));
        }} /></label>`;
      default:
        return h`<label class="field">${s}
          <input type="text" .value=${a ?? ""} @change=${(i) => this._set(t.key, i.target.value)} /></label>`;
    }
  }
  async _save() {
    this._busy = !0, this._error = "";
    try {
      const t = await zt(this.hass, this._draft);
      this.dispatchEvent(new CustomEvent("load-saved", { detail: { load: t.load }, bubbles: !0, composed: !0 }));
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t);
    } finally {
      this._busy = !1;
    }
  }
  async _delete() {
    if (!this._confirmDelete) {
      this._confirmDelete = !0;
      return;
    }
    this._busy = !0, await Ut(this.hass, this._draft.id), this._busy = !1, this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this._draft.id }, bubbles: !0, composed: !0 }));
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-editor", { bubbles: !0, composed: !0 }));
  }
  render() {
    const t = this._draft;
    return h`
      <div class="card">
        <h2>${t.id ? t.name : l("load.new")}</h2>
        ${es.filter((e) => !e.show || e.show(t)).map(
      (e) => h`
            <h3>${l(e.title)}</h3>
            ${e.hint ? h`<p class="muted">${l(e.hint)}</p>` : _}
            <div class="grid2">${e.fields.map((s) => this._renderField(s))}</div>
          `
    )}
        ${this._error ? h`<div class="banner">${this._error}</div>` : _}
        <div class="actions">
          ${t.id ? h`<button class="danger" @click=${this._delete} ?disabled=${this._busy}>${this._confirmDelete ? l("load.delete_confirm") : l("load.delete")}</button>` : _}
          <span class="spacer"></span>
          <button @click=${this._cancel}>${l("load.cancel")}</button>
          <button class="primary" @click=${this._save} ?disabled=${this._busy || !t.name}>${l("load.save")}</button>
        </div>
      </div>
    `;
  }
};
T.styles = [
  ge,
  R`
      .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
      .modes { display: grid; gap: 4px; margin-top: 4px; }
    `
];
te([
  v({ attribute: !1 })
], T.prototype, "hass", 2);
te([
  v({ attribute: !1 })
], T.prototype, "load", 2);
te([
  y()
], T.prototype, "_draft", 2);
te([
  y()
], T.prototype, "_busy", 2);
te([
  y()
], T.prototype, "_confirmDelete", 2);
te([
  y()
], T.prototype, "_error", 2);
T = te([
  W("sm-load-editor")
], T);
var ts = Object.defineProperty, ss = Object.getOwnPropertyDescriptor, $e = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? ss(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && ts(e, s, i), i;
};
let Q = class extends C {
  constructor() {
    super(...arguments), this._draft = {}, this._saved = !1;
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings });
  }
  _set(t, e) {
    this._draft = { ...this._draft, [t]: e }, this._saved = !1;
  }
  _entity(t, e = ["sensor"]) {
    return h`<sm-entity-picker .hass=${this.hass} .label=${l(`s.${t}`)} .value=${this._draft[t]} .domains=${e}
      @value-changed=${(s) => this._set(t, s.detail.value)}></sm-entity-picker>`;
  }
  _num(t, e = 1) {
    return h`<label class="field">${l(`s.${t}`)}
      <input type="number" step=${e} .value=${String(this._draft[t] ?? "")}
        @change=${(s) => this._set(t, Number(s.target.value))} /></label>`;
  }
  _bool(t) {
    return h`<label class="check"><input type="checkbox" .checked=${!!this._draft[t]}
      @change=${(e) => this._set(t, e.target.checked)} />${l(`s.${t}`)}</label>`;
  }
  _select(t, e) {
    return h`<label class="field">${l(`s.${t}`)}
      <select @change=${(s) => this._set(t, s.target.value)}>
        ${e.map((s) => h`<option value=${s} ?selected=${this._draft[t] === s}>${l(`s.${t}.${s}`)}</option>`)}
      </select></label>`;
  }
  _time(t) {
    return h`<label class="field">${l(`s.${t}`)}
      <input type="time" .value=${this._draft[t] ?? ""} @change=${(e) => this._set(t, e.target.value)} /></label>`;
  }
  async _save() {
    await It(this.hass, this._draft), this._saved = !0, this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
  }
  render() {
    const t = this._draft;
    return h`
      <div class="card">
        ${this._bool("enabled")}
        <h3>${l("s.section.meter")}</h3>
        <div class="grid2">
          ${this._select("grid_mode", ["single", "split"])}
          ${t.grid_mode === "split" ? h`${this._entity("grid_import_entity")}${this._entity("grid_export_entity")}` : h`${this._entity("grid_power_entity")}${this._select("grid_sign", ["import_positive", "export_positive"])}`}
          ${this._num("voltage")}
        </div>
        <h3>${l("s.section.pv")}</h3>
        <div class="grid2">
          ${this._entity("pv_power_entity")}
          ${this._entity("pv_forecast_today_entity")}
          ${this._entity("pv_forecast_tomorrow_entity")}
        </div>
        <h3>${l("s.section.peak")}</h3>
        <div class="grid2">
          ${this._bool("peak_guard_enabled")}
          ${t.peak_guard_enabled ? h`${this._num("peak_limit_w", 100)}${this._num("peak_margin_w", 50)}${this._bool("peak_follow_month_max")}` : _}
        </div>
        <h3>${l("s.section.night")}</h3>
        <div class="grid2">${this._time("night_start")}${this._time("night_end")}</div>
        <h3>${l("s.section.prices")}</h3>
        <div class="grid2">${this._num("price_import", 0.01)}${this._num("price_export", 0.01)}</div>
        <div class="row" style="margin-top:16px">
          <span class="spacer"></span>
          ${this._saved ? h`<span class="muted">${l("s.saved")}</span>` : _}
          <button class="primary" @click=${this._save}>${l("load.save")}</button>
        </div>
      </div>
    `;
  }
};
Q.styles = ge;
$e([
  v({ attribute: !1 })
], Q.prototype, "hass", 2);
$e([
  v({ attribute: !1 })
], Q.prototype, "settings", 2);
$e([
  y()
], Q.prototype, "_draft", 2);
$e([
  y()
], Q.prototype, "_saved", 2);
Q = $e([
  W("sm-settings")
], Q);
var is = Object.defineProperty, as = Object.getOwnPropertyDescriptor, E = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? as(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && is(e, s, i), i;
};
const O = 1e3, P = 74, be = 44, K = 10, ye = 14;
let N = class extends C {
  constructor() {
    super(...arguments), this.x = [], this.series = [], this.bands = [], this.height = 240, this.unit = "W", this.rightUnit = "", this._hover = null;
  }
  _fmt(t, e) {
    return e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
  }
  render() {
    const t = this.x.length;
    if (t < 2) return h`<slot></slot>`;
    const e = this.bands.length * (ye + 4), s = this.height - K - 24 - e, a = this.x[0], i = this.x[t - 1], r = (p) => P + (p - a) / Math.max(1, i - a) * (O - P - be), n = {}, o = [], d = [];
    for (const p of this.series)
      if (p.kind === "area" && p.stack) {
        const $ = n[p.stack] ?? new Array(t).fill(0), f = $.map((M, D) => M + Math.max(0, p.values[D] ?? 0));
        d.push($), o.push(f), n[p.stack] = f;
      } else
        d.push(new Array(t).fill(0)), o.push(p.values.map(($) => $ ?? 0));
    let u = 0, c = 0, m = -1 / 0, g = 1 / 0;
    this.series.forEach((p, $) => {
      for (let f = 0; f < t; f++) {
        const M = p.values[f];
        M != null && (p.axis === "right" ? (m = Math.max(m, M), g = Math.min(g, M)) : (u = Math.max(u, o[$][f]), c = Math.min(c, p.kind === "line" ? M : 0)));
      }
    }), u = u <= 0 ? 1 : u * 1.05;
    const A = (p) => K + s - (p - c) / (u - c) * s;
    if (m === -1 / 0)
      m = 1, g = 0;
    else {
      const p = Math.max(1, m - g);
      m += p * 0.1, g -= p * 0.1;
    }
    const B = (p) => K + s - (p - g) / (m - g) * s, ht = this.series.map((p, $) => {
      const f = p.axis === "right" ? B : A;
      if (p.kind === "area") {
        let w = "";
        for (let b = 0; b < t; b++) w += `${b ? "L" : "M"}${r(this.x[b]).toFixed(1)},${f(o[$][b]).toFixed(1)}`;
        for (let b = t - 1; b >= 0; b--) w += `L${r(this.x[b]).toFixed(1)},${f(d[$][b]).toFixed(1)}`;
        return S`<path d="${w}Z" fill="${p.color}" fill-opacity="0.55" stroke="${p.color}" stroke-width="1"></path>`;
      }
      let M = "", D = !1;
      for (let w = 0; w < t; w++) {
        const b = p.values[w];
        if (b == null) {
          D = !1;
          continue;
        }
        M += `${D ? "L" : "M"}${r(this.x[w]).toFixed(1)},${f(b).toFixed(1)}`, D = !0;
      }
      return S`<path d="${M}" fill="none" stroke="${p.color}" stroke-width="1.6" stroke-dasharray="${p.dashed ? "4 3" : ""}"></path>`;
    }), ze = 4, pt = Array.from({ length: ze + 1 }, (p, $) => c + (u - c) * $ / ze), Ue = i - a, fe = Ue <= 2 * 86400 ? 3 * 3600 : Ue <= 8 * 86400 ? 86400 : 7 * 86400, He = [], ut = Math.ceil(a / fe) * fe;
    for (let p = ut; p <= i; p += fe) He.push(p);
    const mt = (p) => {
      const $ = new Date(p * 1e3);
      return fe < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { day: "numeric", month: "short" });
    }, Re = K + s + 22, q = this._hover, _t = (p) => {
      const f = p.currentTarget.getBoundingClientRect(), M = (p.clientX - f.left) / f.width * O, D = a + (M - P) / (O - P - be) * (i - a);
      let w = 0, b = t - 1;
      for (; b - w > 1; ) {
        const Ee = w + b >> 1;
        this.x[Ee] < D ? w = Ee : b = Ee;
      }
      this._hover = Math.abs(this.x[w] - D) < Math.abs(this.x[b] - D) ? w : b;
    };
    return h`
      <svg viewBox="0 0 ${O} ${this.height}" @mousemove=${_t} @mouseleave=${() => this._hover = null}>
        ${pt.map(
      (p) => S`<line class="gridline" x1="${P}" x2="${O - be}" y1="${A(p)}" y2="${A(p)}"></line>
            <text class="axis" x="${P - 6}" y="${A(p) + 4}" text-anchor="end">${this._fmt(p, this.unit)}</text>`
    )}
        ${this.rightUnit ? [0, 0.5, 1].map((p) => {
      const $ = g + (m - g) * p;
      return S`<text class="axis" x="${O - be + 6}" y="${B($) + 4}">${this._fmt($, this.rightUnit)}</text>`;
    }) : _}
        ${He.map((p) => S`<text class="axis" x="${r(p)}" y="${K + s + 14}" text-anchor="middle">${mt(p)}</text>`)}
        ${ht}
        ${this.bands.map(
      (p, $) => S`
            <text class="axis" x="${P - 6}" y="${Re + $ * (ye + 4) + 11}" text-anchor="end">${p.label}</text>
            ${p.segments.map(
        (f) => S`<rect x="${r(f.from)}" y="${Re + $ * (ye + 4)}" width="${Math.max(1, r(f.to) - r(f.from))}"
                height="${ye}" fill="${f.color}" rx="2"><title>${f.title}</title></rect>`
      )}`
    )}
        ${q !== null ? S`<line x1="${r(this.x[q])}" x2="${r(this.x[q])}" y1="${K}" y2="${K + s}" stroke="currentColor" stroke-opacity="0.4"></line>` : _}
      </svg>
      ${q !== null ? h`<div class="tip" style="${r(this.x[q]) > O / 2 ? "left:8px" : "right:8px"}">
            <div><b>${new Date(this.x[q] * 1e3).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${this.series.map((p) => {
      const $ = p.values[q];
      return $ == null ? _ : h`<div><span class="dot" style="background:${p.color}"></span>${p.label}: ${this._fmt($, p.unit ?? this.unit)}</div>`;
    })}
          </div>` : _}
      <div class="legend">
        ${this.series.map((p) => h`<span><span class="dot" style="background:${p.color}"></span>${p.label}</span>`)}
      </div>
    `;
  }
};
N.styles = R`
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
E([
  v({ attribute: !1 })
], N.prototype, "x", 2);
E([
  v({ attribute: !1 })
], N.prototype, "series", 2);
E([
  v({ attribute: !1 })
], N.prototype, "bands", 2);
E([
  v({ type: Number })
], N.prototype, "height", 2);
E([
  v()
], N.prototype, "unit", 2);
E([
  v()
], N.prototype, "rightUnit", 2);
E([
  y()
], N.prototype, "_hover", 2);
N = E([
  W("sm-chart")
], N);
let ee = class extends C {
  constructor() {
    super(...arguments), this.bars = [], this.height = 180, this.unit = "kWh", this.limit = null;
  }
  _fmt(t) {
    return this.unit === "W" ? t >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${t.toFixed(t < 10 ? 1 : 0)} ${this.unit}`;
  }
  render() {
    if (!this.bars.length) return h`<slot></slot>`;
    const t = this.height, e = t - 30, s = Math.max(this.limit ?? 0, ...this.bars.map((n) => n.parts.reduce((o, d) => o + d.value, 0)), 1e-3) * 1.1, a = (O - P - 10) / this.bars.length, i = (n) => 8 + e - n / s * e, r = Math.ceil(this.bars.length / 16);
    return h`<svg viewBox="0 0 ${O} ${t}">
      ${[0, 0.5, 1].map((n) => S`<line class="gridline" x1="${P}" x2="${O - 10}" y1="${i(s * n / 1.1)}" y2="${i(s * n / 1.1)}"></line>
        <text class="axis" x="${P - 6}" y="${i(s * n / 1.1) + 4}" text-anchor="end">${this._fmt(s * n / 1.1)}</text>`)}
      ${this.bars.map((n, o) => {
      let d = 0;
      const u = P + o * a + a * 0.15;
      return S`${n.parts.map((c) => {
        const m = i(d);
        d += c.value;
        const g = i(d);
        return S`<rect x="${u}" width="${a * 0.7}" y="${g}" height="${Math.max(0, m - g)}" fill="${c.color}" rx="2"><title>${n.label}: ${c.title}</title></rect>`;
      })}
        ${o % r === 0 ? S`<text class="axis" x="${u + a * 0.35}" y="${t - 6}" text-anchor="middle">${n.label}</text>` : _}`;
    })}
      ${this.limit ? S`<line x1="${P}" x2="${O - 10}" y1="${i(this.limit)}" y2="${i(this.limit)}" stroke="#e0533d" stroke-dasharray="5 4"></line>` : _}
    </svg>`;
  }
};
ee.styles = R`
    svg { width: 100%; height: auto; display: block; }
    .axis { font-size: 11px; fill: var(--secondary-text-color, #777); }
    .gridline { stroke: var(--divider-color, rgba(0,0,0,.12)); }
  `;
E([
  v({ attribute: !1 })
], ee.prototype, "bars", 2);
E([
  v({ type: Number })
], ee.prototype, "height", 2);
E([
  v()
], ee.prototype, "unit", 2);
E([
  v({ type: Number })
], ee.prototype, "limit", 2);
ee = E([
  W("sm-bars")
], ee);
var ns = Object.defineProperty, rs = Object.getOwnPropertyDescriptor, V = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? rs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && ns(e, s, i), i;
};
const se = ["#f5a623", "#e86f9b", "#8e6ce0", "#2bb3c0", "#7cb342", "#ff7043"], st = {
  solar: "#f5a623",
  night: "#5b8def",
  always_on: "#5b8def",
  legionella: "#9c27b0",
  min_soc: "#5b8def",
  peak_guard: "#e0533d",
  target_reached: "#3fb68b",
  no_surplus: "rgba(127,127,127,.35)"
}, os = (t) => {
  const e = /* @__PURE__ */ new Date(), s = new Date(e.getFullYear(), e.getMonth(), e.getDate()), a = 86400, i = s.getTime() / 1e3;
  switch (t) {
    case "yesterday":
      return [i - a, i];
    case "7d":
      return [i - 6 * a, e.getTime() / 1e3];
    case "30d":
      return [i - 29 * a, e.getTime() / 1e3];
    case "month":
      return [new Date(e.getFullYear(), e.getMonth(), 1).getTime() / 1e3, e.getTime() / 1e3];
    default:
      return [i, e.getTime() / 1e3];
  }
};
let L = class extends C {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this.peakLimit = null, this._range = "today", this._data = null, this._loading = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  updated(t) {
    t.has("loadId") && t.get("loadId") !== void 0 && this._load();
  }
  async _load() {
    if (!this.hass) return;
    this._loading = !0;
    const [t, e] = os(this._range);
    try {
      this._data = await Wt(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _setRange(t) {
    this._range = t, this._load();
  }
  _setLoad(t) {
    this.loadId = t, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: t }, bubbles: !0, composed: !0 })), this._load();
  }
  _load_(t) {
    return this.loads.find((e) => e.id === t);
  }
  _downsample(t) {
    if (t.length <= 1500) return t;
    const s = Math.ceil(t.length / 1500), a = [];
    for (let i = 0; i < t.length; i += s) {
      const r = t.slice(i, i + s), n = (d) => {
        const u = r.map(d).filter((c) => c != null);
        return u.length ? u.reduce((c, m) => c + m, 0) / u.length : null;
      }, o = {};
      for (const d of Object.keys(r[r.length - 1][3]))
        o[d] = [
          n((u) => {
            var c;
            return ((c = u[3][d]) == null ? void 0 : c[0]) ?? null;
          }),
          n((u) => {
            var c;
            return ((c = u[3][d]) == null ? void 0 : c[1]) ?? null;
          }),
          r[r.length - 1][3][d][2],
          r.some((u) => {
            var c;
            return (c = u[3][d]) == null ? void 0 : c[3];
          }) ? 1 : 0,
          n((u) => {
            var c;
            return ((c = u[3][d]) == null ? void 0 : c[4]) ?? null;
          })
        ];
      a.push([r[0][0], n((d) => d[1]), n((d) => d[2]), o]);
    }
    return a;
  }
  _timeline() {
    var r, n;
    const t = this._downsample(((n = (r = this._data) == null ? void 0 : r.timeline) == null ? void 0 : n.rows) ?? []);
    if (t.length < 2) return h`<p class="muted">${l("a.no_data")}</p>`;
    const e = t.map((o) => o[0]), s = [], a = [];
    if (this.loadId) {
      const o = this.loadId, d = this._load_(o);
      if (s.push({ label: l("a.pv"), color: "rgba(245,166,35,.35)", kind: "line", values: t.map((c) => c[1]), dashed: !0 }), s.push({ label: `${l("a.solar")}`, color: "#f5a623", kind: "area", stack: "l", values: t.map((c) => {
        var m;
        return ((m = c[3][o]) == null ? void 0 : m[1]) ?? 0;
      }) }), s.push({
        label: `${l("a.grid")}`,
        color: "#5b8def",
        kind: "area",
        stack: "l",
        values: t.map((c) => {
          var m, g;
          return Math.max(0, (((m = c[3][o]) == null ? void 0 : m[0]) ?? 0) - (((g = c[3][o]) == null ? void 0 : g[1]) ?? 0));
        })
      }), t.some((c) => {
        var m, g;
        return ((m = c[3][o]) == null ? void 0 : m[4]) !== null && ((g = c[3][o]) == null ? void 0 : g[4]) !== void 0;
      })) {
        const c = (d == null ? void 0 : d.type) === "ev";
        s.push({
          label: l(c ? "a.soc" : "a.temperature"),
          color: "#e0533d",
          kind: "line",
          axis: "right",
          unit: c ? "%" : "°C",
          values: t.map((m) => {
            var g;
            return ((g = m[3][o]) == null ? void 0 : g[4]) ?? null;
          })
        });
      }
      a.push(this._reasonBand(t, o));
    } else
      s.push({ label: l("a.pv"), color: "rgba(245,166,35,.6)", kind: "line", values: t.map((o) => o[1]) }), this.loads.forEach((o, d) => {
        s.push({
          label: o.name,
          color: se[d % se.length],
          kind: "area",
          stack: "loads",
          values: t.map((u) => {
            var c;
            return ((c = u[3][o.id]) == null ? void 0 : c[0]) ?? 0;
          })
        });
      }), s.push({ label: l("site.grid"), color: "#5b8def", kind: "line", values: t.map((o) => o[2]) }), this.loads.forEach((o) => a.push({ ...this._reasonBand(t, o.id), label: o.name.length > 11 ? o.name.slice(0, 10) + "…" : o.name }));
    const i = s.find((o) => o.axis === "right");
    return h`<sm-chart .x=${e} .series=${s} .bands=${a} .height=${280 + a.length * 18} unit="W" .rightUnit=${(i == null ? void 0 : i.unit) ?? ""}></sm-chart>`;
  }
  _reasonBand(t, e) {
    var i;
    const s = [];
    let a = null;
    for (let r = 0; r < t.length; r++) {
      const n = t[r][3][e], o = n ? n[2] : null, d = o && (n[3] || o === "peak_guard") ? st[o] ?? "rgba(127,127,127,.35)" : null, u = ((i = t[r + 1]) == null ? void 0 : i[0]) ?? t[r][0] + 60;
      d && a && a.color === d && a.title === l(`reason.${o}`) ? a.to = u : (a && s.push(a), a = d ? { from: t[r][0], to: u, color: d, title: l(`reason.${o}`) } : null);
    }
    return a && s.push(a), { label: "Status", segments: s };
  }
  _summary() {
    var a;
    const t = (a = this._data) == null ? void 0 : a.summary;
    if (!t) return _;
    if (this.loadId) {
      const i = t.loads[this.loadId];
      if (!i) return h`<p class="muted">${l("a.no_data")}</p>`;
      const r = Object.entries(i.reasons ?? {}).filter(([n]) => !["no_surplus", "mode_off", "disabled", "unavailable", "idle", "not_connected"].includes(n)).sort((n, o) => o[1] - n[1]);
      return h`
        <div class="stats">
          <div class="stat"><span class="v">${x(i.kwh)}</span><span class="l">${l("a.energy")}</span></div>
          <div class="stat"><span class="v">${x(i.solar_kwh)}</span><span class="l">${l("a.solar")}</span></div>
          <div class="stat"><span class="v">${x(i.grid_kwh)}</span><span class="l">${l("a.grid")}</span></div>
          <div class="stat"><span class="v">${de(i.solar_share)}</span><span class="l">${l("a.solar_share")}</span></div>
          <div class="stat"><span class="v">${we(i.runtime_s)}</span><span class="l">${l("a.runtime")}</span></div>
          <div class="stat"><span class="v">${i.starts}</span><span class="l">${l("a.starts")}</span></div>
          <div class="stat"><span class="v">${je(i.saving)}</span><span class="l">${l("a.saving")}</span></div>
          <div class="stat"><span class="v">${je(i.cost)}</span><span class="l">${l("a.cost")}</span></div>
        </div>
        ${r.length ? h`<h3>${l("a.why")}</h3>
              <div class="row">${r.map(([n, o]) => h`<span class="chip" style="background:${st[n] ?? "rgba(127,127,127,.2)"}33">${l(`reason.${n}`)}: ${we(o)}</span>`)}</div>` : _}
      `;
    }
    const e = t.house, s = Object.values(t.loads).reduce((i, r) => i + r.kwh, 0);
    return h`
      <div class="stats">
        <div class="stat"><span class="v">${x(e.pv_kwh, 1)}</span><span class="l">${l("a.pv")}</span></div>
        <div class="stat"><span class="v">${x(e.import_kwh, 1)}</span><span class="l">${l("a.import")}</span></div>
        <div class="stat"><span class="v">${x(e.export_kwh, 1)}</span><span class="l">${l("a.export")}</span></div>
        <div class="stat"><span class="v">${de(e.self_consumption)}</span><span class="l">${l("a.self_consumption")}</span></div>
        <div class="stat"><span class="v">${de(e.self_sufficiency)}</span><span class="l">${l("a.self_sufficiency")}</span></div>
        <div class="stat"><span class="v">${k(e.peak_w)}</span><span class="l">${l("a.peak")}</span></div>
      </div>
      <h3>${l("a.distribution")}</h3>
      <table>
        <tr><th></th><th class="num">${l("a.energy")}</th><th class="num">${l("a.solar")}</th><th class="num">${l("a.solar_share")}</th><th class="num">${l("a.runtime")}</th><th class="num">${l("a.saving")}</th></tr>
        ${this.loads.map((i, r) => {
      const n = t.loads[i.id];
      return n ? h`<tr>
            <td><span class="chip" style="background:${se[r % se.length]}44">${i.name}</span></td>
            <td class="num">${x(n.kwh)}</td><td class="num">${x(n.solar_kwh)}</td>
            <td class="num">${de(n.solar_share)}</td><td class="num">${we(n.runtime_s)}</td><td class="num">${je(n.saving)}</td>
          </tr>` : _;
    })}
        <tr><td><b>Σ</b></td><td class="num"><b>${x(s)}</b></td><td colspan="4"></td></tr>
      </table>
    `;
  }
  _daily() {
    var a;
    const t = ((a = this._data) == null ? void 0 : a.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return _;
    const s = e.map((i) => {
      const r = i.slice(8) + "/" + i.slice(5, 7);
      if (this.loadId) {
        const n = t[i].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return {
          label: r,
          parts: [
            { value: n.solar_kwh, color: "#f5a623", title: `${l("a.solar")} ${x(n.solar_kwh)}` },
            { value: Math.max(0, n.kwh - n.solar_kwh), color: "#5b8def", title: `${l("a.grid")} ${x(n.kwh - n.solar_kwh)}` }
          ]
        };
      }
      return {
        label: r,
        parts: this.loads.map((n, o) => {
          var u;
          const d = ((u = t[i].loads[n.id]) == null ? void 0 : u.kwh) ?? 0;
          return { value: d, color: se[o % se.length], title: `${n.name} ${x(d)}` };
        })
      };
    });
    return h`<div class="card"><h2>${l("a.daily")}</h2><sm-bars .bars=${s}></sm-bars></div>`;
  }
  _rhythm() {
    var s, a;
    if (!this.loadId) return _;
    const t = ((a = (s = this._data) == null ? void 0 : s.rhythm) == null ? void 0 : a[this.loadId]) ?? [];
    if (!t.some((i) => i > 0)) return _;
    const e = t.map((i, r) => ({ label: `${r}u`, parts: [{ value: i, color: "#f5a623", title: k(i) }] }));
    return h`<div class="card"><h2>${l("a.rhythm")}</h2><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div>`;
  }
  _quarters() {
    var a;
    if (this.loadId) return _;
    const t = ((a = this._data) == null ? void 0 : a.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return _;
    let s;
    return e.length === 1 ? s = t[e[0]].map(([i, r]) => ({
      label: new Date(i * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: r, color: r > (this._limit() ?? 1 / 0) ? "#e0533d" : "#5b8def", title: k(r) }]
    })) : s = e.map((i) => {
      const r = Math.max(...t[i].map((n) => n[1]));
      return { label: i.slice(8) + "/" + i.slice(5, 7), parts: [{ value: r, color: "#5b8def", title: k(r) }] };
    }), h`<div class="card"><h2>${l("a.quarters")}</h2><sm-bars .bars=${s} unit="W" .limit=${this._limit()}></sm-bars></div>`;
  }
  _limit() {
    return this.peakLimit;
  }
  _sessions() {
    var a;
    const t = this.loadId ? this._load_(this.loadId) : null;
    if (!t || t.type !== "ev") return _;
    const e = [...((a = this._data) == null ? void 0 : a.sessions) ?? []].reverse();
    if (!e.length) return _;
    const s = (i) => i ? new Date(i * 1e3).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : l("a.ongoing");
    return h`<div class="card"><h2>${l("a.sessions")}</h2>
      <table>
        <tr><th>${l("a.start")}</th><th>${l("a.end")}</th><th class="num">${l("a.energy")}</th><th class="num">${l("a.solar_share")}</th><th class="num">${l("a.soc")}</th></tr>
        ${e.map((i) => h`<tr>
          <td>${s(i.start)}</td><td>${s(i.end)}</td><td class="num">${x(i.kwh)}</td>
          <td class="num">${de(i.kwh > 0 ? i.solar_kwh / i.kwh : null)}</td>
          <td class="num">${i.soc_start ?? "–"}% → ${i.soc_end ?? "–"}%</td>
        </tr>`)}
      </table></div>`;
  }
  render() {
    const t = ["today", "yesterday", "7d", "30d", "month"];
    return h`
      <div class="toolbar">
        <select @change=${(e) => this._setLoad(e.target.value || null)}>
          <option value="" ?selected=${!this.loadId}>${l("a.all")}</option>
          ${this.loads.map((e) => h`<option value=${e.id} ?selected=${this.loadId === e.id}>${e.name}</option>`)}
        </select>
        <div class="seg">
          ${t.map((e) => h`<button class=${this._range === e ? "on" : ""} @click=${() => this._setRange(e)}>${l(`a.range.${e}`)}</button>`)}
        </div>
        ${this._loading ? h`<span class="muted">…</span>` : _}
      </div>
      <div class="card"><h2>${l("a.summary")}</h2>${this._summary()}</div>
      <div class="card"><h2>${l("a.timeline")}</h2>${this._timeline()}</div>
      ${this._daily()} ${this._rhythm()} ${this._sessions()} ${this._quarters()}
    `;
  }
};
L.styles = [
  ge,
  R`
      .toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 12px; }
      .split { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
      .share { height: 10px; border-radius: 5px; overflow: hidden; display: flex; background: rgba(127,127,127,.15); }
    `
];
V([
  v({ attribute: !1 })
], L.prototype, "hass", 2);
V([
  v({ attribute: !1 })
], L.prototype, "loads", 2);
V([
  v()
], L.prototype, "loadId", 2);
V([
  v({ type: Number })
], L.prototype, "peakLimit", 2);
V([
  y()
], L.prototype, "_range", 2);
V([
  y()
], L.prototype, "_data", 2);
V([
  y()
], L.prototype, "_loading", 2);
L = V([
  W("sm-analytics")
], L);
var ls = Object.defineProperty, ds = Object.getOwnPropertyDescriptor, I = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? ds(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && ls(e, s, i), i;
};
let j = class extends C {
  constructor() {
    super(...arguments), this.narrow = !1, this._tab = "overview", this._editing = null, this._analyticsLoad = null, this._error = "", this._subscribing = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.hass && this._init();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._unsub) == null || t.call(this), this._unsub = void 0, this._subscribing = !1;
  }
  updated(t) {
    t.has("hass") && this.hass && !this._config && !this._subscribing && this._init();
  }
  async _init() {
    if (!this._subscribing) {
      this._subscribing = !0, Bt(this.hass.language);
      try {
        await this._reload(), this._unsub = await Qe(this.hass, (t) => this._live = t);
      } catch (t) {
        this._error = (t == null ? void 0 : t.message) ?? String(t), this._subscribing = !1;
      }
    }
  }
  async _reload() {
    this._config = await Tt(this.hass), this._live = this._config.live;
  }
  async _resubscribe() {
    var t;
    (t = this._unsub) == null || t.call(this), this._unsub = void 0;
    for (let e = 0; e < 20; e++) {
      await new Promise((s) => setTimeout(s, 500));
      try {
        await this._reload(), this._unsub = await Qe(this.hass, (s) => this._live = s);
        return;
      } catch {
      }
    }
  }
  _editLoad(t) {
    const e = this._config;
    this._editing = t ? { ...e.defaults.load, ...e.loads.find((s) => s.id === t) } : { ...e.defaults.load, id: "", name: "" };
  }
  _onReorder(t) {
    const e = this._config, s = new Map(e.loads.map((a) => [a.id, a]));
    this._config = { ...e, loads: t.map((a) => s.get(a)).filter(Boolean) };
  }
  _onMode(t, e) {
    const s = this._config;
    this._config = { ...s, loads: s.loads.map((a) => a.id === t ? { ...a, mode: e } : a) };
  }
  render() {
    if (this._error) return h`<main><div class="banner">${this._error}</div></main>`;
    const t = this._config;
    return h`
      <header>
        <span class="title">☀️ SolarMind</span>
        <nav>
          ${["overview", "analytics", "settings"].map(
      (e) => h`<button class=${this._tab === e ? "on" : ""} @click=${() => {
        this._tab = e, this._editing = null;
      }}>${l(`tab.${e}`)}</button>`
    )}
        </nav>
      </header>
      <main>
        ${t ? this._renderTab(t) : h`<p>…</p>`}
      </main>
    `;
  }
  _renderTab(t) {
    var e, s;
    if (this._editing)
      return h`<sm-load-editor .hass=${this.hass} .load=${this._editing}
        @close-editor=${() => this._editing = null}
        @load-saved=${async (a) => {
        var n, o;
        const i = !((n = this._editing) != null && n.id), r = ((o = this._editing) == null ? void 0 : o.name) !== a.detail.load.name;
        this._editing = null, i || r ? await this._resubscribe() : await this._reload();
      }}
        @load-deleted=${async () => {
        this._editing = null, await this._resubscribe();
      }}
      ></sm-load-editor>`;
    switch (this._tab) {
      case "analytics":
        return h`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad}
          .peakLimit=${((s = (e = this._live) == null ? void 0 : e.site) == null ? void 0 : s.peak_limit_w) ?? null}
          @analytics-load=${(a) => this._analyticsLoad = a.detail.id}></sm-analytics>`;
      case "settings":
        return h`<sm-settings .hass=${this.hass} .settings=${t.settings}
          @settings-saved=${() => this._reload()}></sm-settings>`;
      default:
        return h`<sm-overview .hass=${this.hass} .loads=${t.loads} .live=${this._live}
          @edit-load=${(a) => this._editLoad(a.detail.id)}
          @open-analytics=${(a) => {
          this._analyticsLoad = a.detail.id, this._tab = "analytics";
        }}
          @loads-reordered=${(a) => this._onReorder(a.detail.order)}
          @load-mode=${(a) => this._onMode(a.detail.id, a.detail.mode)}
        ></sm-overview>
        ${_}`;
    }
  }
};
j.styles = [
  ge,
  R`
      :host { display: block; background: var(--primary-background-color); min-height: 100vh; }
      header {
        display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px;
        background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, #fff);
        position: sticky; top: 0; z-index: 3;
      }
      header .title { font-size: 1.25rem; flex: 1; }
      nav { display: flex; gap: 4px; }
      nav button { color: inherit; border: 0; border-radius: 0; border-bottom: 2px solid transparent; padding: 16px 10px; }
      nav button.on { border-bottom-color: currentColor; }
      main { max-width: 1100px; margin: 0 auto; padding: 16px; }
    `
];
I([
  v({ attribute: !1 })
], j.prototype, "hass", 2);
I([
  v({ type: Boolean })
], j.prototype, "narrow", 2);
I([
  y()
], j.prototype, "_config", 2);
I([
  y()
], j.prototype, "_live", 2);
I([
  y()
], j.prototype, "_tab", 2);
I([
  y()
], j.prototype, "_editing", 2);
I([
  y()
], j.prototype, "_analyticsLoad", 2);
I([
  y()
], j.prototype, "_error", 2);
j = I([
  W("solarmind-panel")
], j);
export {
  j as SolarMindPanel
};
