/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, nt = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = Symbol(), ut = /* @__PURE__ */ new WeakMap();
let Nt = class {
  constructor(e, s, a) {
    if (this._$cssResult$ = !0, a !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (nt && e === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (e = ut.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && ut.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Zt = (t) => new Nt(typeof t == "string" ? t : t + "", void 0, lt), P = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((a, i, o) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[o + 1], t[0]);
  return new Nt(s, t, lt);
}, Kt = (t, e) => {
  if (nt) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const a = document.createElement("style"), i = Ze.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = s.cssText, t.appendChild(a);
  }
}, mt = nt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const a of e.cssRules) s += a.cssText;
  return Zt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Yt, defineProperty: Jt, getOwnPropertyDescriptor: Xt, getOwnPropertyNames: Qt, getOwnPropertySymbols: es, getPrototypeOf: ts } = Object, Q = globalThis, _t = Q.trustedTypes, ss = _t ? _t.emptyScript : "", Xe = Q.reactiveElementPolyfillSupport, ze = (t, e) => t, Ke = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ss : null;
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
} }, dt = (t, e) => !Yt(t, e), gt = { attribute: !0, type: String, converter: Ke, reflect: !1, useDefault: !1, hasChanged: dt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Q.litPropertyMetadata ?? (Q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let xe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = gt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(e, a, s);
      i !== void 0 && Jt(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, s, a) {
    const { get: i, set: o } = Xt(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: i, set(n) {
      const c = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(e, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? gt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ze("elementProperties"))) return;
    const e = ts(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ze("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ze("properties"))) {
      const s = this.properties, a = [...Qt(s), ...es(s)];
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
      for (const i of a) s.unshift(mt(i));
    } else e !== void 0 && s.push(mt(e));
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
    return Kt(e, this.constructor.elementStyles), e;
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
    var o;
    const a = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, a);
    if (i !== void 0 && a.reflect === !0) {
      const n = (((o = a.converter) == null ? void 0 : o.toAttribute) !== void 0 ? a.converter : Ke).toAttribute(s, a.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var o, n;
    const a = this.constructor, i = a._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const c = a.getPropertyOptions(i), d = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : Ke;
      this._$Em = i;
      const h = d.fromAttribute(s, c.type);
      this[i] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, s, a, i = !1, o) {
    var n;
    if (e !== void 0) {
      const c = this.constructor;
      if (i === !1 && (o = this[e]), a ?? (a = c.getPropertyOptions(e)), !((a.hasChanged ?? dt)(o, s) || a.useDefault && a.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(c._$Eu(e, a)))) return;
      this.C(e, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: a, reflect: i, wrapped: o }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (s = void 0), this._$AL.set(e, s)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: c } = n, d = this[o];
        c !== !0 || this._$AL.has(o) || d === void 0 || this.C(o, void 0, n, d);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (a = this._$EO) == null || a.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
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
xe.elementStyles = [], xe.shadowRootOptions = { mode: "open" }, xe[ze("elementProperties")] = /* @__PURE__ */ new Map(), xe[ze("finalized")] = /* @__PURE__ */ new Map(), Xe == null || Xe({ ReactiveElement: xe }), (Q.reactiveElementVersions ?? (Q.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = globalThis, vt = (t) => t, Ye = je.trustedTypes, ft = Ye ? Ye.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Tt = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, It = "?" + X, is = `<${It}>`, ce = document, Ne = () => ce.createComment(""), Te = (t) => t === null || typeof t != "object" && typeof t != "function", ct = Array.isArray, as = (t) => ct(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Qe = `[ 	
\f\r]`, Pe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, yt = />/g, oe = RegExp(`>|${Qe}(?:([^\\s"'>=/]+)(${Qe}*=${Qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $t = /'/g, wt = /"/g, Wt = /^(?:script|style|textarea|title)$/i, Rt = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), l = Rt(1), S = Rt(2), ke = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), xt = /* @__PURE__ */ new WeakMap(), le = ce.createTreeWalker(ce, 129);
function Ht(t, e) {
  if (!ct(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(e) : e;
}
const os = (t, e) => {
  const s = t.length - 1, a = [];
  let i, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Pe;
  for (let c = 0; c < s; c++) {
    const d = t[c];
    let h, m, p = -1, f = 0;
    for (; f < d.length && (n.lastIndex = f, m = n.exec(d), m !== null); ) f = n.lastIndex, n === Pe ? m[1] === "!--" ? n = bt : m[1] !== void 0 ? n = yt : m[2] !== void 0 ? (Wt.test(m[2]) && (i = RegExp("</" + m[2], "g")), n = oe) : m[3] !== void 0 && (n = oe) : n === oe ? m[0] === ">" ? (n = i ?? Pe, p = -1) : m[1] === void 0 ? p = -2 : (p = n.lastIndex - m[2].length, h = m[1], n = m[3] === void 0 ? oe : m[3] === '"' ? wt : $t) : n === wt || n === $t ? n = oe : n === bt || n === yt ? n = Pe : (n = oe, i = void 0);
    const g = n === oe && t[c + 1].startsWith("/>") ? " " : "";
    o += n === Pe ? d + is : p >= 0 ? (a.push(h), d.slice(0, p) + Tt + d.slice(p) + X + g) : d + X + (p === -2 ? c : g);
  }
  return [Ht(t, o + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class Ie {
  constructor({ strings: e, _$litType$: s }, a) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, d = this.parts, [h, m] = os(e, s);
    if (this.el = Ie.createElement(h, a), le.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = le.nextNode()) !== null && d.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(Tt)) {
          const f = m[n++], g = i.getAttribute(p).split(X), y = /([.?@])?(.*)/.exec(f);
          d.push({ type: 1, index: o, name: y[2], strings: g, ctor: y[1] === "." ? ns : y[1] === "?" ? ls : y[1] === "@" ? ds : Je }), i.removeAttribute(p);
        } else p.startsWith(X) && (d.push({ type: 6, index: o }), i.removeAttribute(p));
        if (Wt.test(i.tagName)) {
          const p = i.textContent.split(X), f = p.length - 1;
          if (f > 0) {
            i.textContent = Ye ? Ye.emptyScript : "";
            for (let g = 0; g < f; g++) i.append(p[g], Ne()), le.nextNode(), d.push({ type: 2, index: ++o });
            i.append(p[f], Ne());
          }
        }
      } else if (i.nodeType === 8) if (i.data === It) d.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(X, p + 1)) !== -1; ) d.push({ type: 7, index: o }), p += X.length - 1;
      }
      o++;
    }
  }
  static createElement(e, s) {
    const a = ce.createElement("template");
    return a.innerHTML = e, a;
  }
}
function Ae(t, e, s = t, a) {
  var n, c;
  if (e === ke) return e;
  let i = a !== void 0 ? (n = s._$Co) == null ? void 0 : n[a] : s._$Cl;
  const o = Te(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), o === void 0 ? i = void 0 : (i = new o(t), i._$AT(t, s, a)), a !== void 0 ? (s._$Co ?? (s._$Co = []))[a] = i : s._$Cl = i), i !== void 0 && (e = Ae(t, i._$AS(t, e.values), i, a)), e;
}
class rs {
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
    const { el: { content: s }, parts: a } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? ce).importNode(s, !0);
    le.currentNode = i;
    let o = le.nextNode(), n = 0, c = 0, d = a[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let h;
        d.type === 2 ? h = new Re(o, o.nextSibling, this, e) : d.type === 1 ? h = new d.ctor(o, d.name, d.strings, this, e) : d.type === 6 && (h = new cs(o, this, e)), this._$AV.push(h), d = a[++c];
      }
      n !== (d == null ? void 0 : d.index) && (o = le.nextNode(), n++);
    }
    return le.currentNode = ce, i;
  }
  p(e) {
    let s = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, s), s += a.strings.length - 2) : a._$AI(e[s])), s++;
  }
}
class Re {
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
    e = Ae(this, e, s), Te(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== ke && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : as(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && Te(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ce.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: s, _$litType$: a } = e, i = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = Ie.createElement(Ht(a.h, a.h[0]), this.options)), a);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(s);
    else {
      const n = new rs(i, this), c = n.u(this.options);
      n.p(s), this.T(c), this._$AH = n;
    }
  }
  _$AC(e) {
    let s = xt.get(e.strings);
    return s === void 0 && xt.set(e.strings, s = new Ie(e)), s;
  }
  k(e) {
    ct(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, i = 0;
    for (const o of e) i === s.length ? s.push(a = new Re(this.O(Ne()), this.O(Ne()), this, this.options)) : a = s[i], a._$AI(o), i++;
    i < s.length && (this._$AR(a && a._$AB.nextSibling, i), s.length = i);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, s); e !== this._$AB; ) {
      const i = vt(e).nextSibling;
      vt(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Je {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, a, i, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = s, this._$AM = i, this.options = o, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = u;
  }
  _$AI(e, s = this, a, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = Ae(this, e, s, 0), n = !Te(e) || e !== this._$AH && e !== ke, n && (this._$AH = e);
    else {
      const c = e;
      let d, h;
      for (e = o[0], d = 0; d < o.length - 1; d++) h = Ae(this, c[a + d], s, d), h === ke && (h = this._$AH[d]), n || (n = !Te(h) || h !== this._$AH[d]), h === u ? e = u : e !== u && (e += (h ?? "") + o[d + 1]), this._$AH[d] = h;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ns extends Je {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class ls extends Je {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class ds extends Je {
  constructor(e, s, a, i, o) {
    super(e, s, a, i, o), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = Ae(this, e, s, 0) ?? u) === ke) return;
    const a = this._$AH, i = e === u && a !== u || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, o = e !== u && (a === u || i);
    i && this.element.removeEventListener(this.name, this, a), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class cs {
  constructor(e, s, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Ae(this, e);
  }
}
const et = je.litHtmlPolyfillSupport;
et == null || et(Ie, Re), (je.litHtmlVersions ?? (je.litHtmlVersions = [])).push("3.3.3");
const hs = (t, e, s) => {
  const a = (s == null ? void 0 : s.renderBefore) ?? e;
  let i = a._$litPart$;
  if (i === void 0) {
    const o = (s == null ? void 0 : s.renderBefore) ?? null;
    a._$litPart$ = i = new Re(e.insertBefore(Ne(), o), o, void 0, s ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis;
class w extends xe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = hs(s, this.renderRoot, this.renderOptions);
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
    return ke;
  }
}
var Dt;
w._$litElement$ = !0, w.finalized = !0, (Dt = de.litElementHydrateSupport) == null || Dt.call(de, { LitElement: w });
const tt = de.litElementPolyfillSupport;
tt == null || tt({ LitElement: w });
(de.litElementVersions ?? (de.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ps = { attribute: !0, type: String, converter: Ke, reflect: !1, hasChanged: dt }, us = (t = ps, e, s) => {
  const { kind: a, metadata: i } = s;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(s.name, t), a === "accessor") {
    const { name: n } = s;
    return { set(c) {
      const d = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, d, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (a === "setter") {
    const { name: n } = s;
    return function(c) {
      const d = this[n];
      e.call(this, c), this.requestUpdate(n, d, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function _(t) {
  return (e, s) => typeof s == "object" ? us(t, e, s) : ((a, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, a), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return _({ ...t, state: !0, attribute: !1 });
}
const ms = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), _s = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), Bt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), gs = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Ut = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), vs = (t, e, s) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: s }), fs = (t, e, s) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_ev_min_power", load_id: e, power_w: s }), bs = (t) => t.connection.sendMessagePromise({ type: "solarmind/notify/test" }), Vt = (t, e, s, a) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: s, load_id: a }), kt = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), ys = (t) => t.connection.sendMessagePromise({ type: "solarmind/logs" }), $s = (t) => t.connection.sendMessagePromise({ type: "solarmind/logs/clear" }), ws = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/logs/verbose", enabled: e }), At = {
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
  "a.cycles": "Volle cycli"
}, xs = {
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
  "a.cycles": "Full cycles"
};
let Ft = "nl";
const ks = (t) => {
  Ft = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, r = (t) => (Ft === "en" ? xs[t] ?? At[t] : At[t]) ?? t, C = P`
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
`, se = P`
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
`, M = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, Gt = (t) => t == null || Number.isNaN(t) ? ["–", ""] : Math.abs(t) >= 1e3 ? [(t / 1e3).toFixed(2), "kW"] : [String(Math.round(t)), "W"], x = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, re = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, st = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), s = Math.round(t % 3600 / 60);
  return e ? `${e} u ${s} min` : `${s} min`;
}, As = (t) => {
  const e = Math.max(1, Math.round(t / 60)), s = Math.floor(e / 60), a = e % 60;
  return s ? a ? `${s} u ${String(a).padStart(2, "0")}` : `${s} u` : `${a} min`;
}, Fe = (t) => {
  const e = new Date(Date.now() + t * 1e3), s = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return e.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? s : `${e.toLocaleDateString([], { weekday: "short" })} ${s}`;
}, it = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`, Ss = (t) => t == null ? "–" : t >= 3600 ? `${Math.round(t / 3600 * 10) / 10} u` : t >= 60 ? `${Math.round(t / 60 * 10) / 10} min` : `${t} s`, Ms = {
  self: "mdi:home-battery-outline",
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off"
}, Le = (t) => (t == null ? void 0 : t.type) === "battery", ot = (t) => t === "battery" ? ["self", "solar", "solar_night", "on", "off"] : ["solar", "solar_night", "on", "off"], ht = (t, e) => e === "battery" && t !== "self" ? `mode.bat.${t}` : `mode.${t}`, qt = (t) => ot(t).map((e) => ({ value: e, label: r(ht(e, t)), icon: Ms[e] })), He = (t) => t === "ev" ? "mdi:ev-station" : t === "battery" ? "mdi:home-battery" : "mdi:water-boiler", De = (t) => t === "solar" ? "solar" : t === "self_consumption" ? "ok" : ["night", "always_on", "legionella", "min_soc", "min_power"].includes(t) ? "grid" : t === "peak_guard" || t === "unavailable" ? "warn" : t === "target_reached" || t === "battery_full" ? "ok" : t === "reserve" ? "warn" : "", Es = (t) => ({
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
  battery_full: "mdi:battery"
})[t] ?? "mdi:circle-small", $e = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
var Ps = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, Be = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Os(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Ps(e, s, i), i;
};
let he = class extends w {
  constructor() {
    super(...arguments), this.options = [], this.value = null, this.size = "md", this.wrap = !1;
  }
  render() {
    return l`<div class="seg" role="radiogroup">
      ${this.options.map(
      (t) => l`<button role="radio" aria-checked=${t.value === this.value ? "true" : "false"} title=${t.label}
          @click=${(e) => {
        e.stopPropagation(), this._pick(t);
      }}>
          ${t.icon ? l`<ha-icon .icon=${t.icon}></ha-icon>` : u}<span>${t.label}</span>
        </button>`
    )}
    </div>`;
  }
  _pick(t) {
    t.value !== this.value && this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: t.value }, bubbles: !0, composed: !0 }));
  }
};
he.styles = [
  C,
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
Be([
  _({ attribute: !1 })
], he.prototype, "options", 2);
Be([
  _({ attribute: !1 })
], he.prototype, "value", 2);
Be([
  _({ reflect: !0 })
], he.prototype, "size", 2);
Be([
  _({ type: Boolean, reflect: !0 })
], he.prototype, "wrap", 2);
he = Be([
  O("sm-segmented")
], he);
var Cs = Object.defineProperty, zs = Object.getOwnPropertyDescriptor, Ue = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? zs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Cs(e, s, i), i;
};
let pe = class extends w {
  constructor() {
    super(...arguments), this.points = [], this.max = 0, this.height = 72, this.label = "";
  }
  render() {
    const t = this.points, e = 400, s = this.height;
    if (t.length < 2) return l`<svg viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" style="height:${s}px"></svg>`;
    const a = t[0][0], i = t[t.length - 1][0], o = Math.max(this.max, ...t.map((p) => p[1]), 1) * 1.1, n = (p) => (p - a) / Math.max(1, i - a) * e, c = (p) => s - p / o * (s - 4), d = (p) => t.map((f, g) => `${g ? "L" : "M"}${n(f[0]).toFixed(1)},${c(p(f)).toFixed(1)}`).join(""), h = (p, f) => {
      let g = d(p);
      for (let y = t.length - 1; y >= 0; y--) g += `L${n(t[y][0]).toFixed(1)},${c(f(t[y])).toFixed(1)}`;
      return g + "Z";
    }, m = `g${Math.random().toString(36).slice(2, 8)}`;
    return l`<svg viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" style="height:${s}px">
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
        ${S`<path d="${h((p) => p[2], () => 0)}" fill="url(#${m}s)"></path>
        <path d="${h((p) => p[1], (p) => p[2])}" fill="url(#${m}g)"></path>
        <path d="${d((p) => p[1])}" fill="none" stroke="var(--secondary-text-color)" stroke-opacity="0.6" stroke-width="1.2" vector-effect="non-scaling-stroke"></path>
        <path d="${d((p) => p[2])}" fill="none" stroke="var(--sm-solar)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
      </svg>
      ${this.label ? l`<span class="label">${this.label}</span>` : ""}`;
  }
};
pe.styles = [
  C,
  P`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `
];
Ue([
  _({ attribute: !1 })
], pe.prototype, "points", 2);
Ue([
  _({ type: Number })
], pe.prototype, "max", 2);
Ue([
  _({ type: Number })
], pe.prototype, "height", 2);
Ue([
  _()
], pe.prototype, "label", 2);
pe = Ue([
  O("sm-sparkline")
], pe);
var js = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, Me = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ls(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && js(e, s, i), i;
};
let ee = class extends w {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this._minAmps = null;
  }
  _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _hint() {
    const t = this.live, e = this.load;
    return t ? t.driver_error ? `${r("hint.driver_error")}: ${t.driver_error}` : Le(e) ? e.mode === "solar_night" && t.night_needed === !0 ? r("hint.bat_night") : t.reason === "peak_guard" && (t.power_w ?? 0) < 0 ? r("hint.bat_peak") : t.stored_kwh != null ? `${x(t.stored_kwh, 1)} ${r("hint.bat_stored")}` : null : e.type === "ev" && t.car_state === "NoPower" ? r("hint.no_power") : t.reason === "peak_guard" ? r("hint.peak") : t.is_full ? r(e.type === "ev" ? "hint.full_ev" : "hint.full") : e.mode === "solar_night" && t.night_needed === !0 ? r("hint.night_needed") : e.mode === "solar_night" && t.night_needed === !1 ? r("hint.night_not_needed") : e.type === "ev" && t.plugged === !1 ? r("reason.not_connected") : e.type === "ev" && t.is_on && t.current_a != null ? `${r("hint.charging_at")} ${Math.round(t.current_a)} A` : null : null;
  }
  _batEta() {
    const t = this.live;
    return t ? t.eta_full_s ? l`<span class="eta"><ha-icon icon="mdi:battery-arrow-up"></ha-icon>${r("eta.bat_full").replace("{t}", Fe(t.eta_full_s))}</span>` : t.eta_empty_s ? l`<span class="eta"><ha-icon icon="mdi:battery-arrow-down"></ha-icon>${r("eta.bat_empty").replace("{t}", Fe(t.eta_empty_s))}</span>` : u : u;
  }
  _eta() {
    const t = this.live;
    if (Le(this.load)) return this._batEta();
    if (this.load.type !== "ev" || !t || t.plugged === !1) return u;
    if (t.soc != null && t.soc < 100 && !t.battery_kwh && t.eta_full_s == null && t.eta_limit_s == null)
      return l`<span class="eta est"><ha-icon icon="mdi:timer-sand"></ha-icon>${r("eta.need_capacity")}</span>`;
    if (t.eta_full_s == null || !t.eta_full_s) return u;
    const e = !!t.eta_estimated, s = `${e ? "~" : ""}${As(t.eta_full_s)}`, a = e ? ` ${r("eta.at_min")}` : ` (± ${Fe(t.eta_full_s)})`;
    return l`<span class="eta ${e ? "est" : ""}"><ha-icon icon="mdi:timer-sand"></ha-icon>${r("eta.full").replace("{d}", s)}${a}</span>`;
  }
  _limitLine() {
    const t = this.live;
    if (this.load.type !== "ev" || !t || t.eta_limit_s == null || t.charge_limit == null || t.plugged === !1) return u;
    const e = `${t.eta_estimated ? "~" : ""}${Fe(t.eta_limit_s)}`;
    return l`<div class="limit">${r("eta.limit").replace("{soc}", String(Math.round(t.charge_limit))).replace("{t}", e)}</div>`;
  }
  _wpa() {
    return 230 * (this.load.ev_phases ?? 1);
  }
  /** Current minimum in amps (0 = off), from the pending click or the saved watts. */
  _curAmps() {
    if (this._minAmps !== null) return this._minAmps;
    const t = this.load.ev_min_power_w;
    if (!t) return 0;
    const e = this.load.ev_min_current ?? 6, s = this.load.ev_max_current ?? 16;
    return Math.max(e, Math.min(s, Math.ceil(t / this._wpa() - 1e-9)));
  }
  _step(t, e) {
    t.stopPropagation();
    const s = this.load.ev_min_current ?? 6, a = this.load.ev_max_current ?? 16, i = this._curAmps();
    let o = i + e;
    e > 0 && i === 0 && (o = s), e < 0 && i <= s && (o = 0), o = Math.min(a, Math.max(0, o)), o !== i && (this._minAmps = o, window.clearTimeout(this._minTimer), this._minTimer = window.setTimeout(() => {
      const n = this._minAmps ?? 0;
      this.dispatchEvent(new CustomEvent("set-min-power", {
        detail: { id: this.load.id, power_w: n ? n * this._wpa() : null },
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
    const t = this._curAmps(), e = this.load.ev_max_current ?? 16, s = t * this._wpa() / 1e3;
    return l`<div class="minp" @click=${(a) => a.stopPropagation()} title=${r("card.min_power_help")}>
      <span class="lbl"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${r("f.ev_min_power_w")}</span></span>
      <span class="stepper">
        <button ?disabled=${t === 0} @click=${(a) => this._step(a, -1)} aria-label="-">−</button>
        <span class="val ${t ? "" : "off"}">${t ? `${s.toLocaleString(void 0, { maximumFractionDigits: 1 })} kW · ${t} A` : r("card.min_power_off")}</span>
        <button ?disabled=${t >= e} @click=${(a) => this._step(a, 1)} aria-label="+">+</button>
      </span>
    </div>`;
  }
  render() {
    const t = this.load, e = this.live, s = Le(t), [a, i] = Gt(s ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), o = s && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", n = (e == null ? void 0 : e.reason) ?? "idle", c = De(n), d = !!(e != null && e.is_on) && Math.abs((e == null ? void 0 : e.power_w) ?? 0) > 1, h = t.icon || He(t.type), m = t.type === "ev" ? (t.ev_max_current ?? 16) * 230 * (t.ev_phases ?? 1) : s ? Math.max(t.bat_max_charge_w ?? 0, t.bat_max_discharge_w ?? 0) : t.nominal_power_w, p = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null, f = this._hint();
    return l`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${d ? "active" : ""} .icon=${h}></ha-icon>
        <span class="name">${t.name}</span>
        <span class="status ${c}">
          ${c ? l`<ha-icon .icon=${Es(n)}></ha-icon>` : l`<span class="dot"></span>`}
          ${r(`reason.${n}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big">${o ? l`<ha-icon class="dir" .icon=${o}></ha-icon>` : u}<span class="v">${a}</span><span class="u">${i}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${(e == null ? void 0 : e.temperature) != null ? l`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
            ${(e == null ? void 0 : e.soc) != null ? l`<span><ha-icon .icon=${s ? "mdi:home-battery-outline" : "mdi:battery-charging"}></ha-icon>${Math.round(e.soc)}%</span>` : u}
            ${this._eta()}
            ${t.enabled ? u : l`<span>${r("reason.disabled")}</span>`}
          </div>
          ${this._limitLine()}
        </div>
        <div class="side">
          <div class="l">${r(s ? "load.charged_today" : "load.today")}</div>
          <div class="v">${x((e == null ? void 0 : e.kwh_today) ?? 0, 1)}</div>
          <div class="s">${s ? `${x((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${r("load.discharged")}` : p === null ? "" : `${Math.round(p * 100)}% ${r("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${m} .height=${76}></sm-sparkline>
        ${f ? l`<span class="hint">${f}</span>` : u}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${qt(t.type)} .value=${t.mode}
          @value-changed=${(g) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: g.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
      </div>
      ${t.type === "ev" && t.mode === "solar" ? this._minPowerRow() : u}
      </div>
    </div>`;
  }
};
ee.styles = [
  C,
  se,
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
Me([
  _({ attribute: !1 })
], ee.prototype, "load", 2);
Me([
  _({ attribute: !1 })
], ee.prototype, "live", 2);
Me([
  _({ attribute: !1 })
], ee.prototype, "spark", 2);
Me([
  _({ type: Number })
], ee.prototype, "priority", 2);
Me([
  b()
], ee.prototype, "_minAmps", 2);
ee = Me([
  O("sm-load-card")
], ee);
var Ds = Object.defineProperty, Ns = Object.getOwnPropertyDescriptor, _e = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ns(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Ds(e, s, i), i;
};
let F = class extends w {
  constructor() {
    super(...arguments), this.icon = "", this.heading = "", this.secondary = "", this.value = "", this.clickable = !1, this.variant = "";
  }
  render() {
    return l`<div class="row ${this.clickable ? "click" : ""}" @click=${this._click}>
      ${this.icon ? l`<div class="ic"><ha-icon .icon=${this.icon}></ha-icon></div>` : u}
      <div class="text">
        <div class="h">${this.heading}</div>
        ${this.secondary ? l`<div class="s">${this.secondary}</div>` : u}
      </div>
      ${this.value ? l`<div class="v">${this.value}</div>` : u}
      <slot></slot>
      ${this.clickable ? l`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : u}
    </div>`;
  }
  _click() {
    this.clickable && this.dispatchEvent(new CustomEvent("row-click", { bubbles: !0, composed: !0 }));
  }
};
F.styles = [
  C,
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
_e([
  _()
], F.prototype, "icon", 2);
_e([
  _()
], F.prototype, "heading", 2);
_e([
  _()
], F.prototype, "secondary", 2);
_e([
  _()
], F.prototype, "value", 2);
_e([
  _({ type: Boolean })
], F.prototype, "clickable", 2);
_e([
  _({ reflect: !0 })
], F.prototype, "variant", 2);
F = _e([
  O("sm-list-row")
], F);
var Ts = Object.defineProperty, Is = Object.getOwnPropertyDescriptor, ge = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Is(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Ts(e, s, i), i;
};
let G = class extends w {
  constructor() {
    super(...arguments), this.loads = [], this.spark = {}, this.editing = !1, this._dragId = null;
  }
  _emit(t, e = {}) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  async _saveOrder(t) {
    this._emit("loads-reordered", { order: t }), await Ut(this.hass, t);
  }
  _move(t, e) {
    const s = this.loads.map((o) => o.id), a = s.indexOf(t), i = a + e;
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
    return l`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${r("site.pv")} <b>${M(t.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${s ? "export" : "grid"} icon=${s ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${r(s ? "site.export" : "site.import")} <b>${M(e == null ? null : Math.abs(e))}</b></span>
      <span class="pill"><ha-icon class="solar" icon="mdi:white-balance-sunny"></ha-icon>${r("site.surplus")} <b>${M(t.surplus_w)}</b></span>
      <span class="pill"><ha-icon icon="mdi:lightning-bolt"></ha-icon>${r("site.managed")} <b>${M(t.managed_w)}</b></span>
      <span class="pill"><ha-icon class=${a} icon="mdi:chart-bell-curve-cumulative"></ha-icon>${r("site.peak_now")}
        <b>${M(t.quarter_average_w)}</b>&nbsp;/ ${M(t.peak_limit_w)}</span>
      <span class="pill"><ha-icon icon="mdi:calendar-month"></ha-icon>${r("site.month_peak")} <b>${M(t.month_peak_w)}</b></span>
      ${t.in_night ? l`<span class="pill"><ha-icon icon="mdi:weather-night"></ha-icon>${r("site.night")}</span>` : u}
    </div>`;
  }
  _editList() {
    return l`<div class="card edit-list">
      <div class="card-head"><h2>${r("loads.title")}</h2></div>
      <div class="card-body muted" style="padding-bottom:8px">${r("loads.hint")}</div>
      ${this.loads.map(
      (t, e) => l`<div class="edit-row ${this._dragId === t.id ? "dragging" : ""}" draggable="true"
          @dragstart=${() => this._dragId = t.id} @dragend=${() => this._dragId = null}
          @dragover=${(s) => s.preventDefault()} @drop=${() => this._drop(t.id)}>
          <ha-icon class="handle" icon="mdi:drag"></ha-icon>
          <sm-list-row .icon=${t.icon || He(t.type)} .heading=${`${e + 1}. ${t.name}`}
            .secondary=${r(`mode.${t.mode}`)}>
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
    return l`
      ${t.available === !1 ? l`<div class="banner"><ha-icon icon="mdi:alert-outline"></ha-icon>${r("site.no_grid")}</div>` : u}
      ${t.enabled === !1 ? l`<div class="banner"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${r("site.disabled")}</div>` : u}
      ${this._pills()}
      ${this.editing ? this._editList() : this.loads.length ? l`<div class="grid">
              ${this.loads.map((s, a) => {
      var i, o;
      return l`<sm-load-card .load=${s} .live=${(o = (i = this.live) == null ? void 0 : i.loads) == null ? void 0 : o[s.id]} .spark=${this.spark[s.id] ?? []} .priority=${a + 1}></sm-load-card>`;
    })}
              <button class="add" @click=${() => this._emit("add-load")}><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${r("loads.add")}</button>
            </div>` : l`<div class="placeholder"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><p>${r("loads.empty")}</p>
              <button class="filled" @click=${() => this._emit("add-load")}>${r("loads.add")}</button></div>`}
    `;
  }
};
G.styles = [
  C,
  se,
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
ge([
  _({ attribute: !1 })
], G.prototype, "hass", 2);
ge([
  _({ attribute: !1 })
], G.prototype, "loads", 2);
ge([
  _({ attribute: !1 })
], G.prototype, "live", 2);
ge([
  _({ attribute: !1 })
], G.prototype, "spark", 2);
ge([
  _({ type: Boolean })
], G.prototype, "editing", 2);
ge([
  b()
], G.prototype, "_dragId", 2);
G = ge([
  O("sm-dashboard")
], G);
var Ws = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, Ee = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Rs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Ws(e, s, i), i;
};
let te = class extends w {
  constructor() {
    super(...arguments), this.heading = "", this.saveLabel = "", this.busy = !1, this.canSave = !0, this.error = "";
  }
  render() {
    return l`<div class="scrim" @click=${(t) => t.target === t.currentTarget && this._close()}>
      <div class="dlg" role="dialog" aria-modal="true" aria-label=${this.heading}>
        <h2>${this.heading}</h2>
        <div class="body"><slot></slot>${this.error ? l`<div class="err" role="alert">${this.error}</div>` : u}</div>
        <div class="actions">
          <button class="text" @click=${this._close}>${r("load.cancel")}</button>
          <button class="filled" ?disabled=${this.busy || !this.canSave}
            @click=${() => this.dispatchEvent(new CustomEvent("save"))}>${this.saveLabel || r("load.save")}</button>
        </div>
      </div>
    </div>`;
  }
  _close() {
    this.dispatchEvent(new CustomEvent("closed"));
  }
};
te.styles = [
  C,
  se,
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
Ee([
  _()
], te.prototype, "heading", 2);
Ee([
  _()
], te.prototype, "saveLabel", 2);
Ee([
  _({ type: Boolean })
], te.prototype, "busy", 2);
Ee([
  _({ type: Boolean })
], te.prototype, "canSave", 2);
Ee([
  _()
], te.prototype, "error", 2);
te = Ee([
  O("sm-dialog")
], te);
var Hs = Object.defineProperty, Bs = Object.getOwnPropertyDescriptor, pt = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Bs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Hs(e, s, i), i;
};
let We = class extends w {
  constructor() {
    super(...arguments), this.checked = !1, this.disabled = !1;
  }
  render() {
    return l`<button role="switch" aria-checked=${this.checked ? "true" : "false"} ?disabled=${this.disabled}
      @click=${(t) => {
      t.stopPropagation(), this.checked = !this.checked, this.dispatchEvent(new CustomEvent("change", { detail: { checked: this.checked }, bubbles: !0, composed: !0 }));
    }}></button>`;
  }
};
We.styles = [
  C,
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
pt([
  _({ type: Boolean, reflect: !0 })
], We.prototype, "checked", 2);
pt([
  _({ type: Boolean, reflect: !0 })
], We.prototype, "disabled", 2);
We = pt([
  O("sm-toggle")
], We);
var Us = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, Ve = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Vs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Us(e, s, i), i;
};
let Fs = 0, ue = class extends w {
  constructor() {
    super(...arguments), this.fields = [], this.data = {}, this.prefix = "f";
  }
  _emit(t, e) {
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { key: t, value: e }, bubbles: !0, composed: !0 }));
  }
  _label(t) {
    return t.label ?? r(`${this.prefix}.${t.key}`);
  }
  _entity(t, e) {
    var n, c, d;
    const s = this._label(t);
    if (customElements.get("ha-entity-picker"))
      return l`<ha-entity-picker .hass=${this.hass} .label=${s} .value=${e ?? ""} allow-custom-entity
        .includeDomains=${t.domains} @value-changed=${(h) => this._emit(t.key, h.detail.value || null)}></ha-entity-picker>
        ${t.helper ? l`<span class="help">${t.helper}</span>` : u}`;
    const a = `sm-ents-${++Fs}`, i = e ? (c = (n = this.hass) == null ? void 0 : n.states) == null ? void 0 : c[e] : void 0, o = Object.values(((d = this.hass) == null ? void 0 : d.states) ?? {}).filter((h) => {
      var m;
      return !((m = t.domains) != null && m.length) || t.domains.includes(h.entity_id.split(".")[0]);
    }).sort((h, m) => h.entity_id.localeCompare(m.entity_id));
    return l`<label class="field">${s}
      <input list=${a} .value=${e ?? ""} placeholder="entity_id"
        @change=${(h) => this._emit(t.key, h.target.value.trim() || null)} />
      <datalist id=${a}>${o.map((h) => l`<option value=${h.entity_id}>${h.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${i ? l`<span class="ent-state">${i.attributes.friendly_name ?? ""}: ${i.state} ${i.attributes.unit_of_measurement ?? ""}</span>` : u}
      ${t.helper ? l`<span class="help">${t.helper}</span>` : u}
    </label>`;
  }
  _field(t) {
    const e = this.data;
    if (t.show && !t.show(e)) return u;
    const s = e[t.key], a = this._label(t);
    switch (t.kind) {
      case "entity":
        return l`<div>${this._entity(t, s)}</div>`;
      case "bool":
        return l`<div class="bool"><span class="txt">${a}${t.helper ? l`<span class="help">${t.helper}</span>` : u}</span>
          <sm-toggle .checked=${!!s} @change=${(i) => this._emit(t.key, i.detail.checked)}></sm-toggle></div>`;
      case "select":
        return l`<label class="field">${a}
          <select @change=${(i) => {
          const o = i.target.value;
          this._emit(t.key, typeof s == "number" ? Number(o) : o);
        }}>${(t.options ?? []).map((i) => l`<option value=${i.value} ?selected=${String(s) === i.value}>${i.label}</option>`)}</select>
          ${t.helper ? l`<span class="help">${t.helper}</span>` : u}</label>`;
      case "number":
        return l`<label class="field">${a}
          <span class="wrap"><input type="number" step=${t.step ?? 1} .value=${s == null ? "" : String(s)}
            @change=${(i) => {
          const o = i.target.value;
          this._emit(t.key, o === "" ? t.nullable ? null : 0 : Number(o));
        }} />${t.unit ? l`<span class="unit">${t.unit}</span>` : u}</span>
          ${t.helper ? l`<span class="help">${t.helper}</span>` : u}</label>`;
      case "multi": {
        const i = Array.isArray(s) ? s : [], o = t.options ?? [];
        return l`<div class="field multi"><span>${a}</span>
          ${o.length ? o.map((n) => l`<div class="bool"><span class="txt">${n.label}</span>
                <sm-toggle .checked=${i.includes(n.value)} @change=${(c) => this._emit(t.key, c.detail.checked ? [...i, n.value] : i.filter((d) => d !== n.value))}></sm-toggle></div>`) : l`<span class="help">${r("form.no_options")}</span>`}
          ${t.helper ? l`<span class="help">${t.helper}</span>` : u}</div>`;
      }
      case "time":
        return l`<label class="field">${a}
          <input type="time" .value=${s ?? ""} @change=${(i) => this._emit(t.key, i.target.value)} /></label>`;
      default:
        return l`<label class="field">${a}
          <input type="text" .value=${s ?? ""} @change=${(i) => this._emit(t.key, i.target.value)} />
          ${t.helper ? l`<span class="help">${t.helper}</span>` : u}</label>`;
    }
  }
  render() {
    return l`${this.fields.map((t) => this._field(t))}`;
  }
};
ue.styles = [
  C,
  P`
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
Ve([
  _({ attribute: !1 })
], ue.prototype, "hass", 2);
Ve([
  _({ attribute: !1 })
], ue.prototype, "fields", 2);
Ve([
  _({ attribute: !1 })
], ue.prototype, "data", 2);
Ve([
  _()
], ue.prototype, "prefix", 2);
ue = Ve([
  O("sm-form")
], ue);
var Gs = Object.defineProperty, qs = Object.getOwnPropertyDescriptor, I = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? qs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Gs(e, s, i), i;
};
const H = (t) => t.type === "ev", W = (t) => H(t) && t.ev_driver === "tesla_ble_proxy", T = (t) => Le(t), St = (t) => !Le(t), ne = (t) => !H(t) && !T(t), Mt = () => ["charge_positive", "discharge_positive"].map((t) => ({ value: t, label: r(`f.bat_sign.${t}`) })), Oe = (t) => t == null ? "–" : `${t}%`, Ge = (t) => Ss(t ?? 0), R = (t, e) => {
  if (!e) return r("detail.not_set");
  const s = t.states[e];
  return s ? `${s.attributes.friendly_name ?? e}` : e;
}, Zs = (t, e) => {
  const s = e ? t.states[e] : void 0;
  return s ? s.state === "on" ? r("detail.on") : s.state === "off" ? r("detail.off") : s.state : "";
}, qe = (t, e) => {
  if (!e) return "";
  const s = t.states[e];
  return s ? `${s.state}${s.attributes.unit_of_measurement ? " " + s.attributes.unit_of_measurement : ""}` : "?";
};
let L = class extends w {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this.count = 1, this._dialog = null, this._draft = {}, this._busy = !1, this._error = "", this._confirmDelete = !1;
  }
  get _sections() {
    const t = this.hass;
    return [
      {
        title: r("detail.device"),
        rows: [
          {
            icon: "mdi:home-battery-outline",
            title: r("f.bat_soc_entity"),
            show: T,
            secondary: (e) => R(t, e.bat_soc_entity),
            value: (e, s) => (s == null ? void 0 : s.soc) != null ? `${Math.round(s.soc)}%` : "",
            fields: [
              { key: "bat_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1 }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: r("f.bat_power_entity"),
            show: T,
            secondary: (e) => `${R(t, e.bat_power_entity)} · ${r(`f.bat_sign.${e.bat_power_sign}`)}`,
            value: (e) => qe(t, e.bat_power_entity),
            fields: [
              { key: "bat_power_entity", kind: "entity", domains: ["sensor"], helper: r("f.bat_power_entity.help") },
              { key: "bat_power_sign", kind: "select", options: Mt() }
            ]
          },
          {
            icon: "mdi:tune-variant",
            title: r("detail.bat_control"),
            show: T,
            secondary: (e) => e.bat_setpoint_entity ? R(t, e.bat_setpoint_entity) : e.bat_charge_entity || e.bat_discharge_entity ? `${R(t, e.bat_charge_entity)} / ${R(t, e.bat_discharge_entity)}` : r("detail.not_set"),
            value: (e, s) => (s == null ? void 0 : s.setpoint_w) != null ? M(s.setpoint_w) : "",
            fields: [
              { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], helper: r("f.bat_setpoint_entity.help") },
              { key: "bat_setpoint_sign", kind: "select", options: Mt(), show: (e) => !!e.bat_setpoint_entity },
              { key: "bat_charge_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !e.bat_setpoint_entity },
              { key: "bat_discharge_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !e.bat_setpoint_entity },
              { key: "bat_mode_entity", kind: "entity", domains: ["select", "input_select"], helper: r("f.bat_mode_entity.help") },
              { key: "bat_mode_remote_option", kind: "text", show: (e) => !!e.bat_mode_entity },
              { key: "bat_mode_auto_option", kind: "text", show: (e) => !!e.bat_mode_entity }
            ]
          },
          {
            icon: "mdi:power-socket-eu",
            title: r("f.switch_entity"),
            show: ne,
            secondary: (e) => R(t, e.switch_entity),
            value: (e) => Zs(t, e.switch_entity),
            fields: [{ key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"] }]
          },
          {
            icon: "mdi:flash",
            title: r("f.nominal_power_w"),
            show: ne,
            secondary: () => r("detail.nominal_help"),
            value: (e) => M(e.nominal_power_w),
            fields: [{ key: "nominal_power_w", kind: "number", unit: "W", step: 50 }, { key: "full_threshold_w", kind: "number", unit: "W" }]
          },
          {
            icon: "mdi:ev-plug-type2",
            title: r("f.ev_driver"),
            show: H,
            secondary: (e) => W(e) ? `${e.ev_proxy_url} · ${e.ev_vin || "VIN?"}` : R(t, e.ev_charge_switch_entity),
            value: (e) => r(`f.ev_driver.${e.ev_driver}`),
            fields: [
              { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"].map((e) => ({ value: e, label: r(`f.ev_driver.${e}`) })) },
              { key: "ev_proxy_url", kind: "text", show: W, helper: r("f.ev_proxy_url.help") },
              { key: "ev_vin", kind: "text", show: W },
              { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (e) => !W(e) },
              { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !W(e) },
              { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: (e) => !W(e) }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: r("detail.power_sensor"),
            show: St,
            secondary: (e) => R(t, e.power_entity),
            value: (e) => qe(t, e.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: r("f.power_entity.help") }]
          },
          {
            icon: "mdi:thermometer",
            title: r("detail.temp_sensor"),
            show: ne,
            secondary: (e) => R(t, e.temperature_entity),
            value: (e) => e.max_temperature != null ? `${qe(t, e.temperature_entity)} · max ${e.max_temperature} °C` : qe(t, e.temperature_entity),
            fields: [
              { key: "temperature_entity", kind: "entity", domains: ["sensor"] },
              { key: "max_temperature", kind: "number", nullable: !0, unit: "°C" }
            ]
          },
          {
            icon: "mdi:battery-charging",
            title: r("f.ev_soc_entity"),
            show: H,
            secondary: (e) => e.ev_soc_entity ? R(t, e.ev_soc_entity) : W(e) ? r("detail.from_proxy") : r("detail.not_set"),
            value: (e, s) => (s == null ? void 0 : s.soc) != null ? `${Math.round(s.soc)}%` : "",
            fields: [
              { key: "ev_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "ev_charge_limit_entity", kind: "entity", domains: ["sensor", "number", "input_number"], show: (e) => !W(e) }
            ]
          }
        ]
      },
      {
        title: r("f.section.battery"),
        show: T,
        rows: [
          {
            icon: "mdi:battery-charging-high",
            title: r("detail.bat_power"),
            secondary: () => r("detail.bat_power_sub"),
            value: (e) => `↑ ${M(e.bat_max_charge_w)} · ↓ ${M(e.bat_max_discharge_w)}`,
            fields: [
              { key: "bat_max_charge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_max_discharge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_deadband_w", kind: "number", unit: "W", step: 10, helper: r("f.bat_deadband_w.help") }
            ]
          },
          {
            icon: "mdi:battery-10",
            title: r("detail.bat_limits"),
            secondary: (e) => r("detail.bat_limits_sub").replace("{min}", Oe(e.bat_min_soc)).replace("{max}", Oe(e.bat_max_soc)),
            value: (e) => `${Oe(e.bat_min_soc)} – ${Oe(e.bat_max_soc)}`,
            fields: [
              { key: "bat_min_soc", kind: "number", unit: "%", helper: r("f.bat_min_soc.help") },
              { key: "bat_max_soc", kind: "number", unit: "%" },
              { key: "bat_target_soc", kind: "number", unit: "%", helper: r("f.bat_target_soc.help") }
            ]
          },
          {
            icon: "mdi:home-lightning-bolt-outline",
            title: r("f.bat_discharge_for"),
            secondary: () => r("detail.bat_for_help"),
            value: (e) => r(`f.bat_for.${e.bat_discharge_for}`),
            fields: [{
              key: "bat_discharge_for",
              kind: "select",
              options: ["house", "house_switch", "all"].map((e) => ({ value: e, label: r(`f.bat_for.${e}`) }))
            }]
          },
          { icon: "mdi:transmission-tower", title: r("f.bat_peak_support"), secondary: () => r("detail.bat_peak_help"), toggle: "bat_peak_support" },
          {
            icon: "mdi:battery-lock-outline",
            title: r("f.bat_peak_min_soc"),
            show: (e) => !!e.bat_peak_support,
            secondary: () => r("detail.bat_peak_min_help"),
            value: (e) => Oe(e.bat_peak_min_soc),
            fields: [{ key: "bat_peak_min_soc", kind: "number", unit: "%" }]
          }
        ]
      },
      {
        title: r("f.section.ev"),
        show: H,
        rows: [
          {
            icon: "mdi:current-ac",
            title: r("detail.current"),
            secondary: (e) => `${e.ev_phases} ${r("detail.phase")} · ${r("detail.step")} ${e.ev_current_step_interval_s} s`,
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
            title: r("f.ev_battery_kwh"),
            secondary: (e, s) => s != null && s.battery_kwh_learned ? r("detail.battery_learned").replace("{kwh}", `${s.battery_kwh_learned} kWh`) : (s == null ? void 0 : s.battery_kwh_source) === "car" && s.battery_kwh ? r("detail.battery_car").replace("{kwh}", `${s.battery_kwh} kWh`) : r("detail.battery_learning"),
            value: (e, s) => e.ev_battery_kwh ? `${e.ev_battery_kwh} kWh` : s != null && s.battery_kwh_learned ? `${s.battery_kwh_learned} kWh (${r("detail.learned")})` : "–",
            fields: [{ key: "ev_battery_kwh", kind: "number", nullable: !0, unit: "kWh" }]
          },
          {
            icon: "mdi:battery-alert-variant-outline",
            title: r("f.ev_min_soc"),
            secondary: () => r("detail.min_soc_help"),
            value: (e) => e.ev_min_soc != null ? `${e.ev_min_soc}%` : r("detail.off"),
            fields: [{ key: "ev_min_soc", kind: "number", nullable: !0, unit: "%" }]
          }
        ]
      },
      {
        title: r("detail.behaviour"),
        show: St,
        rows: [
          {
            icon: "mdi:timer-play-outline",
            title: r("detail.start_stop"),
            secondary: (e) => r("detail.start_stop_sub").replace("{start}", Ge(e.start_delay_s)).replace("{stop}", Ge(e.stop_delay_s)),
            value: (e) => `+${e.start_margin_w} W`,
            fields: [
              { key: "start_delay_s", kind: "number", unit: "s" },
              { key: "stop_delay_s", kind: "number", unit: "s" },
              { key: "start_margin_w", kind: "number", unit: "W" }
            ]
          },
          {
            icon: "mdi:timer-lock-outline",
            title: r("detail.min_times"),
            secondary: (e) => `${r("detail.on")} ${Ge(e.min_on_s)} · ${r("detail.off_short")} ${Ge(e.min_off_s)}`,
            fields: [
              { key: "min_on_s", kind: "number", unit: "s" },
              { key: "min_off_s", kind: "number", unit: "s" }
            ]
          },
          {
            icon: "mdi:transmission-tower-import",
            title: r("f.allowed_import_w"),
            secondary: () => r("detail.allowed_import_help"),
            value: (e) => M(e.allowed_import_w),
            fields: [{ key: "allowed_import_w", kind: "number", unit: "W", step: 50 }]
          },
          { icon: "mdi:chart-bell-curve-cumulative", title: r("f.peak_shed"), secondary: () => r("detail.peak_shed_help"), toggle: "peak_shed" }
        ]
      },
      {
        title: r("f.section.night"),
        meta: (e) => e.mode === "solar_night" ? "" : r("detail.night_inactive"),
        rows: [
          {
            icon: "mdi:weather-night",
            title: r("detail.night_when"),
            secondary: (e) => T(e) ? r("detail.night_when_bat").replace("{soc}", String(e.bat_target_soc)) : H(e) && (e.ev_soc_entity || W(e)) ? r("detail.night_when_soc").replace("{soc}", String(e.ev_target_soc)) : e.night_min_temperature != null ? r("detail.night_when_temp").replace("{t}", String(e.night_min_temperature)) : r("detail.night_when_kwh").replace("{kwh}", String(e.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (e) => ne(e) || H(e) && !(e.ev_soc_entity || W(e)) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: !0, show: ne },
              { key: "bat_target_soc", kind: "number", unit: "%", show: T },
              { key: "ev_target_soc", kind: "number", unit: "%", show: H }
            ]
          },
          {
            icon: "mdi:battery-arrow-up-outline",
            title: r("detail.night_amount"),
            show: ne,
            value: (e) => e.night_target_kwh ? x(e.night_target_kwh, 1) : r("detail.until_full"),
            fields: [{ key: "night_target_kwh", kind: "number", unit: "kWh", step: 0.1 }]
          },
          {
            icon: "mdi:weather-sunny-alert",
            title: r("detail.forecast_skip"),
            secondary: () => r("detail.forecast_skip_help"),
            value: (e) => e.night_skip_forecast_kwh ? `> ${e.night_skip_forecast_kwh} kWh` : r("detail.off"),
            fields: [{ key: "night_skip_forecast_kwh", kind: "number", unit: "kWh", nullable: !0, step: 0.5 }]
          }
        ]
      },
      {
        title: r("f.section.legionella"),
        show: ne,
        rows: [
          { icon: "mdi:bacteria-outline", title: r("f.legionella_enabled"), secondary: () => r("f.legionella.hint"), toggle: "legionella_enabled" },
          {
            icon: "mdi:thermometer-high",
            title: r("detail.legionella_rule"),
            show: (e) => !!e.legionella_enabled,
            value: (e) => `${e.legionella_temperature} °C / ${e.legionella_interval_days} d`,
            fields: [
              { key: "legionella_temperature", kind: "number", unit: "°C" },
              { key: "legionella_interval_days", kind: "number", unit: r("detail.days") }
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
      const e = await Bt(this.hass, { ...this.load, ...t });
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
    await gs(this.hass, this.load.id), this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _move(t) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta: t }, bubbles: !0, composed: !0 }));
  }
  _hero() {
    const t = this.load, e = this.live, [s, a] = Gt(T(t) ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), i = T(t) && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", o = (e == null ? void 0 : e.reason) ?? "idle", n = De(o), c = t.icon || He(t.type), d = H(t) ? t.ev_max_current * 230 * t.ev_phases : T(t) ? Math.max(t.bat_max_charge_w, t.bat_max_discharge_w) : t.nominal_power_w, h = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null;
    return l`<div class="card hero">
      <div class="hero-head">
        <div class="hero-ic ${e != null && e.is_on && ((e == null ? void 0 : e.power_w) ?? 0) > 1 ? "active" : ""}"><ha-icon .icon=${c}></ha-icon></div>
        <div>
          <div class="hero-name">${t.name}
            <button class="icon" title=${r("load.edit")} @click=${() => this._openDialog(r("detail.name_icon"), [
      { key: "name", kind: "text" },
      { key: "icon", kind: "text", helper: r("f.icon.help") }
    ])}><ha-icon icon="mdi:pencil"></ha-icon></button>
          </div>
          <div class="hero-sub"><span class="status ${n}">${r(`reason.${o}`)}</span> · ${r(`type.${t.type}`)}</div>
        </div>
      </div>
      <div class="big">${i ? l`<ha-icon class="dir" .icon=${i}></ha-icon>` : u}<span class="v">${s}</span><span class="u">${a}</span></div>
      <sm-sparkline .points=${this.spark} .max=${d} .height=${90} .label=${r("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${(e == null ? void 0 : e.temperature) != null ? l`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
        ${(e == null ? void 0 : e.soc) != null ? l`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : u}
        ${(e == null ? void 0 : e.current_a) != null && H(t) ? l`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(e.current_a)} A</span>` : u}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${x((e == null ? void 0 : e.kwh_today) ?? 0, 1)} ${T(t) ? r("load.charged_today") : r("load.today")}</span>
        ${T(t) ? l`<span><ha-icon icon="mdi:home-export-outline"></ha-icon>${x((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${r("load.discharged")}</span>` : u}
        ${h !== null ? l`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(h * 100)}% ${r("load.from_solar")}</span>` : u}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${r("f.mode")}</div>
        <sm-segmented .options=${qt(t.type)} .value=${t.mode}
          @value-changed=${(m) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: m.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
        <div class="d">${r(`${ht(t.mode, t.type)}.desc`)}</div>
      </div>
    </div>`;
  }
  _controlCard() {
    const t = this.load;
    return l`<div class="card list">
      <sm-list-row icon="mdi:power" variant="primary" .heading=${r("f.enabled")} .secondary=${r("detail.enabled_help")}>
        <sm-toggle .checked=${t.enabled} @change=${(e) => this._save({ enabled: e.detail.checked })}></sm-toggle>
      </sm-list-row>
      <sm-list-row icon="mdi:sort-numeric-ascending" .heading=${r("detail.priority")}
        .secondary=${r("detail.priority_sub").replace("{n}", String(this.priority)).replace("{c}", String(this.count))}>
        <button class="icon" ?disabled=${this.priority <= 1} @click=${() => this._move(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon" ?disabled=${this.priority >= this.count} @click=${() => this._move(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
      </sm-list-row>
      <sm-list-row icon="mdi:chart-line" .heading=${r("load.analytics")} .secondary=${r("detail.analytics_sub")} clickable
        @row-click=${() => this.dispatchEvent(new CustomEvent("open-analytics", { detail: { id: t.id }, bubbles: !0, composed: !0 }))}></sm-list-row>
      <sm-list-row icon="mdi:delete-outline" variant="danger" .heading=${this._confirmDelete ? r("load.delete_confirm") : r("load.delete")}
        clickable @row-click=${this._delete}></sm-list-row>
    </div>`;
  }
  _section(t) {
    const e = this.load;
    if (t.show && !t.show(e)) return u;
    const s = t.rows.filter((a) => !a.show || a.show(e));
    return l`<div class="card list">
      <div class="card-head"><h2>${t.title}</h2>${t.meta && t.meta(e) ? l`<span class="meta">${t.meta(e)}</span>` : u}</div>
      ${s.map(
      (a) => {
        var i, o, n;
        return a.toggle ? l`<sm-list-row .icon=${a.icon} .heading=${a.title} .secondary=${((i = a.secondary) == null ? void 0 : i.call(a, e, this.live)) ?? ""}>
              <sm-toggle .checked=${!!e[a.toggle]} @change=${(c) => this._save({ [a.toggle]: c.detail.checked })}></sm-toggle>
            </sm-list-row>` : l`<sm-list-row .icon=${a.icon} .heading=${a.title} .secondary=${((o = a.secondary) == null ? void 0 : o.call(a, e, this.live)) ?? ""} .value=${((n = a.value) == null ? void 0 : n.call(a, e, this.live)) ?? ""}
              clickable @row-click=${() => this._openDialog(a.title, a.fields ?? [])}></sm-list-row>`;
      }
    )}
    </div>`;
  }
  render() {
    const t = this._sections;
    return l`
      <div class="layout">
        <div class="col">${this._hero()}${this._controlCard()}</div>
        <div class="col">${t.map((e) => this._section(e))}</div>
      </div>
      ${this._dialog ? l`<sm-dialog .heading=${this._dialog.title} .busy=${this._busy} .error=${this._error}
            @closed=${() => this._dialog = null} @save=${() => this._save(this._draft)}>
            <sm-form .hass=${this.hass} .fields=${this._dialog.fields} .data=${this._draft}
              @value-changed=${(e) => this._draft = { ...this._draft, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : u}
    `;
  }
};
L.styles = [
  C,
  se,
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
I([
  _({ attribute: !1 })
], L.prototype, "hass", 2);
I([
  _({ attribute: !1 })
], L.prototype, "load", 2);
I([
  _({ attribute: !1 })
], L.prototype, "live", 2);
I([
  _({ attribute: !1 })
], L.prototype, "spark", 2);
I([
  _({ type: Number })
], L.prototype, "priority", 2);
I([
  _({ type: Number })
], L.prototype, "count", 2);
I([
  b()
], L.prototype, "_dialog", 2);
I([
  b()
], L.prototype, "_draft", 2);
I([
  b()
], L.prototype, "_busy", 2);
I([
  b()
], L.prototype, "_error", 2);
I([
  b()
], L.prototype, "_confirmDelete", 2);
L = I([
  O("sm-load-detail")
], L);
var Ks = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, ve = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ys(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Ks(e, s, i), i;
};
const Et = { DEBUG: 10, INFO: 20, WARNING: 30, ERROR: 40, CRITICAL: 50 }, Pt = (t) => {
  const e = new Date(t * 1e3), s = (a, i = 2) => String(a).padStart(i, "0");
  return `${s(e.getDate())}/${s(e.getMonth() + 1)} ${s(e.getHours())}:${s(e.getMinutes())}:${s(e.getSeconds())}`;
};
let q = class extends w {
  constructor() {
    super(...arguments), this._data = null, this._level = "all", this._query = "", this._msg = "", this._auto = !0, this._load = () => this._run(() => ys(this.hass));
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
    var s;
    const t = this._level === "all" ? 0 : Et[this._level] ?? 0, e = this._query.trim().toLowerCase();
    return (((s = this._data) == null ? void 0 : s.entries) ?? []).filter((a) => (Et[a.level] ?? 0) >= t).filter((a) => !e || a.message.toLowerCase().includes(e) || a.source.toLowerCase().includes(e)).reverse();
  }
  async _copy() {
    const t = this._filtered().slice().reverse().map((e) => `${Pt(e.ts)} ${e.level} [${e.source}] ${e.message}`).join(`
`);
    try {
      await navigator.clipboard.writeText(t), this._msg = r("logs.copied");
    } catch {
      this._msg = r("logs.copy_failed");
    }
    window.setTimeout(() => this._msg = "", 3e3);
  }
  render() {
    var s, a;
    const t = this._filtered(), e = ((s = this._data) == null ? void 0 : s.entries.length) ?? 0;
    return l`
      <div class="row">
        <div class="grow">
          <div class="lbl">${r("logs.verbose")}</div>
          <div class="help">${r("logs.verbose.help")}</div>
        </div>
        <sm-toggle ?checked=${((a = this._data) == null ? void 0 : a.verbose) ?? !1}
          @change=${(i) => this._run(() => ws(this.hass, i.detail.checked))}></sm-toggle>
      </div>
      <div class="row">
        <sm-segmented size="sm" .value=${this._level}
          .options=${["all", "INFO", "WARNING", "ERROR"].map((i) => ({ value: i, label: r(`logs.level.${i}`) }))}
          @value-changed=${(i) => {
      i.stopPropagation(), this._level = i.detail.value;
    }}></sm-segmented>
        <input class="search" type="search" placeholder=${r("logs.search")} .value=${this._query}
          @input=${(i) => this._query = i.target.value} />
      </div>
      <div class="row actions">
        <button class="text" @click=${this._load}>${r("logs.refresh")}</button>
        <button class="text" ?disabled=${!t.length} @click=${this._copy}>${r("logs.copy")}</button>
        <button class="text" ?disabled=${!e} @click=${() => this._run(() => $s(this.hass))}>${r("logs.clear")}</button>
        <label class="help"><input type="checkbox" .checked=${this._auto}
          @change=${(i) => this._auto = i.target.checked} /> ${r("logs.auto")}</label>
        <span class="muted">${this._msg || r("logs.count").replace("{n}", String(t.length)).replace("{t}", String(e))}</span>
      </div>
      <div class="log">
        ${t.length ? t.map(
      (i) => l`<div class="e"><span class="ts">${Pt(i.ts)}</span><span class="lv ${i.level}">${i.level}</span>
                <span class="m"><span class="src">[${i.source}]</span> ${i.message}</span></div>`
    ) : l`<div class="empty">${this._data ? r("logs.empty") : r("logs.loading")}</div>`}
      </div>
    `;
  }
};
q.styles = [
  C,
  se,
  P`
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
ve([
  _({ attribute: !1 })
], q.prototype, "hass", 2);
ve([
  b()
], q.prototype, "_data", 2);
ve([
  b()
], q.prototype, "_level", 2);
ve([
  b()
], q.prototype, "_query", 2);
ve([
  b()
], q.prototype, "_msg", 2);
ve([
  b()
], q.prototype, "_auto", 2);
q = ve([
  O("sm-logs")
], q);
var Js = Object.defineProperty, Xs = Object.getOwnPropertyDescriptor, fe = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Xs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && Js(e, s, i), i;
};
const Ot = (t, e) => e.map((s) => ({ value: s, label: r(`s.${t}.${s}`) })), Ct = (t, e) => {
  var s;
  return e ? ((s = t.states[e]) == null ? void 0 : s.attributes.friendly_name) ?? e : r("detail.not_set");
}, Qs = (t) => {
  var e;
  return Object.keys(((e = t.services) == null ? void 0 : e.notify) ?? {}).filter((s) => !["send_message", "persistent_notification"].includes(s)).sort((s, a) => Number(a.startsWith("mobile_app_")) - Number(s.startsWith("mobile_app_")) || s.localeCompare(a)).map((s) => ({
    value: `notify.${s}`,
    label: s.startsWith("mobile_app_") ? `📱 ${s.slice(11).replace(/_/g, " ")}` : s.replace(/_/g, " ")
  }));
}, ei = (t) => [
  {
    id: "general",
    icon: "mdi:cog-outline",
    fields: [{ key: "enabled", kind: "bool", helper: r("s.enabled.help") }],
    summary: (e) => `${e.enabled ? r("s.enabled") : r("site.disabled")} · ${r("s.version").replace("{v}", "0.2.4")}`
  },
  {
    id: "meter",
    icon: "mdi:meter-electric-outline",
    fields: [
      { key: "grid_mode", kind: "select", options: Ot("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: Ot("grid_sign", ["import_positive", "export_positive"]), show: (e) => e.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" }
    ],
    summary: (e, s) => Ct(s, e.grid_mode === "split" ? e.grid_import_entity : e.grid_power_entity)
  },
  {
    id: "pv",
    icon: "mdi:solar-power-variant",
    fields: [
      { key: "pv_power_entity", kind: "entity", domains: ["sensor"] },
      { key: "pv_forecast_today_entity", kind: "entity", domains: ["sensor"], helper: r("s.forecast.help") },
      { key: "pv_forecast_tomorrow_entity", kind: "entity", domains: ["sensor"] }
    ],
    summary: (e, s) => Ct(s, e.pv_power_entity)
  },
  {
    id: "peak",
    icon: "mdi:chart-bell-curve-cumulative",
    fields: [
      { key: "peak_guard_enabled", kind: "bool", helper: r("s.peak.help") },
      { key: "peak_limit_w", kind: "number", unit: "W", step: 100, show: (e) => e.peak_guard_enabled },
      { key: "peak_margin_w", kind: "number", unit: "W", step: 50, show: (e) => e.peak_guard_enabled },
      { key: "peak_follow_month_max", kind: "bool", helper: r("s.peak_follow.help"), show: (e) => e.peak_guard_enabled }
    ],
    summary: (e) => e.peak_guard_enabled ? `${(e.peak_limit_w / 1e3).toFixed(1)} kW` : r("detail.off")
  },
  {
    id: "night",
    icon: "mdi:weather-night",
    fields: [
      { key: "night_start", kind: "time" },
      { key: "night_end", kind: "time" }
    ],
    summary: (e) => `${e.night_start} – ${e.night_end}`
  },
  {
    id: "notify",
    icon: "mdi:bell-outline",
    fields: [
      { key: "notify_services", kind: "multi", options: Qs(t), helper: r("s.notify_services.help") },
      { key: "notify_peak", kind: "bool", helper: r("s.notify_peak.help") },
      { key: "notify_ev", kind: "bool", helper: r("s.notify_ev.help") },
      { key: "notify_faults", kind: "bool", helper: r("s.notify_faults.help") }
    ],
    summary: (e) => {
      const s = (e.notify_services ?? []).length;
      return s ? r("s.notify.summary").replace("{n}", String(s)) : r("detail.off");
    }
  },
  {
    id: "prices",
    icon: "mdi:currency-eur",
    fields: [
      { key: "price_import", kind: "number", unit: "€/kWh", step: 0.01 },
      { key: "price_export", kind: "number", unit: "€/kWh", step: 0.01 }
    ],
    summary: (e) => `€ ${e.price_import} / € ${e.price_export}`
  },
  {
    id: "debug",
    icon: "mdi:bug-outline",
    fields: [],
    summary: () => r("s.cat.debug.summary")
  }
];
let Z = class extends w {
  constructor() {
    super(...arguments), this.narrow = !1, this._cat = null, this._draft = {}, this._testMsg = "";
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings }), this._cat === null && !this.narrow && (this._cat = "meter");
  }
  async _change(t, e) {
    this._draft = { ...this._draft, [t]: e }, this.dispatchEvent(new CustomEvent("saving", { bubbles: !0, composed: !0 }));
    try {
      await _s(this.hass, { [t]: e }), this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
    } catch (s) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: (s == null ? void 0 : s.message) ?? String(s) }, bubbles: !0, composed: !0 }));
    }
  }
  async _test() {
    this._testMsg = "";
    try {
      await bs(this.hass), this._testMsg = r("s.notify.test_sent");
    } catch (t) {
      this._testMsg = (t == null ? void 0 : t.message) ?? String(t);
    }
  }
  render() {
    const t = ei(this.hass), e = t.find((i) => i.id === this._cat), s = !this.narrow || !e, a = !!e;
    return l`<div class="md ${this.narrow ? "single" : ""}">
      ${s ? l`<div class="card nav">
            ${t.map(
      (i) => l`<sm-list-row class=${i.id === this._cat && !this.narrow ? "sel" : ""} .icon=${i.icon} .heading=${r(`s.cat.${i.id}`)}
                .secondary=${i.summary(this._draft, this.hass)} clickable @row-click=${() => this._cat = i.id}></sm-list-row>`
    )}
          </div>` : ""}
      ${a ? l`<div class="card detail">
            <div class="card-head">
              ${this.narrow ? l`<button class="icon" @click=${() => this._cat = null}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
              <h2>${r(`s.cat.${e.id}`)}</h2>
            </div>
            <div class="card-body">
              <p class="desc">${r(`s.cat.${e.id}.desc`)}</p>
              ${e.id === "debug" ? l`<sm-logs .hass=${this.hass}></sm-logs>` : l`<sm-form .hass=${this.hass} prefix="s" .fields=${e.fields} .data=${this._draft}
                    @value-changed=${(i) => this._change(i.detail.key, i.detail.value)}></sm-form>`}
              ${e.id === "notify" ? l`<div class="test"><button class="text" ?disabled=${!(this._draft.notify_services ?? []).length}
                    @click=${this._test}>${r("s.notify.test")}</button><span>${this._testMsg}</span></div>` : ""}
            </div>
          </div>` : ""}
    </div>`;
  }
};
Z.styles = [
  C,
  se,
  P`
      :host { display: block; }
      .md { display: grid; grid-template-columns: minmax(0, 360px) minmax(0, 1fr); gap: 16px; align-items: start; }
      .md.single { grid-template-columns: 1fr; max-width: 720px; }
      .nav { padding: 8px 0; }
      sm-list-row.sel { background: var(--sm-fill-primary); }
      .detail .card-body { padding-top: 4px; }
      .back { display: flex; align-items: center; gap: 4px; }
      .test { display: flex; align-items: center; gap: 12px; margin-top: 16px; font-size: 13px; color: var(--secondary-text-color); }
      .desc { font-size: 14px; color: var(--secondary-text-color); margin: 0 0 16px; line-height: 1.5; }
    `
];
fe([
  _({ attribute: !1 })
], Z.prototype, "hass", 2);
fe([
  _({ attribute: !1 })
], Z.prototype, "settings", 2);
fe([
  _({ type: Boolean })
], Z.prototype, "narrow", 2);
fe([
  b()
], Z.prototype, "_cat", 2);
fe([
  b()
], Z.prototype, "_draft", 2);
fe([
  b()
], Z.prototype, "_testMsg", 2);
Z = fe([
  O("sm-settings")
], Z);
var ti = Object.defineProperty, si = Object.getOwnPropertyDescriptor, K = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? si(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && ti(e, s, i), i;
};
const J = 1e3, k = 64, V = 16, zt = 18, at = 14, jt = 12, ii = (t) => {
  const e = Math.pow(10, Math.floor(Math.log10(t))), s = t / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 2.5 ? 2.5 : s <= 5 ? 5 : 10) * e;
}, rt = (t, e) => e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
let Se = class extends w {
  constructor() {
    super(...arguments), this.x = [], this.panels = [], this._hover = null;
  }
  render() {
    var N, A;
    const t = this.x.length;
    if (t < 2) return l`<slot></slot>`;
    const e = this.x[0], s = this.x[t - 1], a = (v) => k + (v - e) / Math.max(1, s - e) * (J - k - V);
    let i = 0;
    const o = [], n = [];
    for (const v of this.panels) {
      const $ = i + zt, be = v.height;
      n.push([$, be]), o.push(S`<text class="ptitle" x="${k}" y="${i + 12}">${v.title}</text>`), o.push(S`<rect class="plot" x="${k}" y="${$}" width="${J - k - V}" height="${be}" rx="2"></rect>`), (N = v.series) != null && N.length && o.push(this._series(v, $, be, a)), (A = v.bands) != null && A.length && v.bands.forEach((ye, ae) => {
        const Y = $ + 4 + ae * (jt + 4);
        o.push(S`<text class="axis" x="${k - 8}" y="${Y + 10}" text-anchor="end">${ye.label}</text>`), ye.segments.forEach(
          (U) => o.push(S`<rect x="${a(U.from)}" y="${Y}" width="${Math.max(1, a(U.to) - a(U.from))}" height="${jt}" fill="${U.color}" rx="2"><title>${U.title}</title></rect>`)
        );
      }), i = $ + be + at;
    }
    const c = s - e, d = c <= 1.5 * 86400 ? 3 * 3600 : c <= 8 * 86400 ? 86400 : 7 * 86400, h = [], m = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
    for (let v = Math.ceil((e - m) / d) * d + m; v <= s; v += d) h.push(v);
    const p = (v) => {
      const $ = new Date(v * 1e3);
      return d < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { weekday: "short", day: "numeric" });
    }, f = i - at + 16, g = f + 6;
    h.forEach((v) => {
      o.push(S`<line class="gridline" x1="${a(v)}" x2="${a(v)}" y1="${zt}" y2="${i - at}" stroke-dasharray="2 4"></line>`), o.push(S`<text class="axis" x="${a(v)}" y="${f}" text-anchor="middle">${p(v)}</text>`);
    });
    const y = this._hover;
    y !== null && n.forEach(
      ([v, $]) => o.push(S`<line x1="${a(this.x[y])}" x2="${a(this.x[y])}" y1="${v}" y2="${v + $}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`)
    );
    const D = (v) => {
      const $ = v.currentTarget.getBoundingClientRect(), be = (v.clientX - $.left) / $.width * J, ye = e + (be - k) / (J - k - V) * (s - e);
      let ae = 0, Y = t - 1;
      for (; Y - ae > 1; ) {
        const U = ae + Y >> 1;
        this.x[U] < ye ? ae = U : Y = U;
      }
      this._hover = Math.abs(this.x[ae] - ye) < Math.abs(this.x[Y] - ye) ? ae : Y;
    }, j = this.panels.flatMap((v) => (v.series ?? []).map(($) => ({ ...$, unit: $.unit ?? v.unit })));
    return l`
      <svg viewBox="0 0 ${J} ${g}" @mousemove=${D} @mouseleave=${() => this._hover = null}>${o}</svg>
      ${y !== null ? l`<div class="tip" style="${a(this.x[y]) > J / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[y] * 1e3).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${j.map((v) => {
      const $ = v.values[y];
      return $ == null ? u : l`<div><span class="dot" style="background:${v.color}"></span>${v.label}: ${rt($, v.unit)}</div>`;
    })}
          </div>` : u}
      <div class="legend">
        ${j.filter((v) => v.legend !== !1).map((v) => l`<span><span class="dot" style="background:${v.color}"></span>${v.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }
  _series(t, e, s, a) {
    const i = this.x.length, o = {}, n = [], c = [];
    for (const g of t.series)
      if (g.kind === "area" && g.stack) {
        const y = o[g.stack] ?? new Array(i).fill(0), D = y.map((j, N) => j + Math.max(0, g.values[N] ?? 0));
        c.push(y), n.push(D), o[g.stack] = D;
      } else
        c.push(new Array(i).fill(0)), n.push(g.values.map((y) => y ?? 0));
    let d = -1 / 0, h = 1 / 0;
    t.series.forEach((g, y) => {
      for (let D = 0; D < i; D++) {
        const j = g.values[D];
        j != null && (d = Math.max(d, g.kind === "area" ? n[y][D] : j), h = Math.min(h, g.kind === "area" ? 0 : j));
      }
    }), d === -1 / 0 && (d = 1, h = 0), t.zero !== !1 && (h = Math.min(h, 0), d = Math.max(d, 0));
    const m = ii((d - h) / 3 || 1);
    d = Math.ceil((d + (d - h) * 0.04) / m) * m, h = Math.floor(h / m) * m;
    const p = (g) => e + s - (g - h) / (d - h) * s, f = [];
    for (let g = h; g <= d + m / 2; g += m)
      f.push(S`<line class="gridline" x1="${k}" x2="${J - V}" y1="${p(g)}" y2="${p(g)}"></line>
        <text class="axis" x="${k - 8}" y="${p(g) + 4}" text-anchor="end">${rt(g, t.unit)}</text>`);
    return h < 0 && f.push(S`<line x1="${k}" x2="${J - V}" y1="${p(0)}" y2="${p(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`), t.series.forEach((g, y) => {
      if (g.kind === "area") {
        let N = "";
        for (let A = 0; A < i; A++) N += `${A ? "L" : "M"}${a(this.x[A]).toFixed(1)},${p(n[y][A]).toFixed(1)}`;
        for (let A = i - 1; A >= 0; A--) N += `L${a(this.x[A]).toFixed(1)},${p(c[y][A]).toFixed(1)}`;
        f.push(S`<path d="${N}Z" fill="${g.color}" fill-opacity="0.45" stroke="${g.color}" stroke-width="1"></path>`);
        return;
      }
      let D = "", j = !1;
      for (let N = 0; N < i; N++) {
        const A = g.values[N];
        if (A == null) {
          j = !1;
          continue;
        }
        const v = a(this.x[N]).toFixed(1), $ = p(A).toFixed(1);
        g.kind === "step" && j ? D += `H${v}V${$}` : D += `${j ? "L" : "M"}${v},${$}`, j = !0;
      }
      f.push(S`<path d="${D}" fill="none" stroke="${g.color}" stroke-width="1.8" stroke-dasharray="${g.dashed ? "5 4" : ""}"></path>`);
    }), f;
  }
};
Se.styles = [
  C,
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
K([
  _({ attribute: !1 })
], Se.prototype, "x", 2);
K([
  _({ attribute: !1 })
], Se.prototype, "panels", 2);
K([
  b()
], Se.prototype, "_hover", 2);
Se = K([
  O("sm-chart")
], Se);
let me = class extends w {
  constructor() {
    super(...arguments), this.bars = [], this.height = 180, this.unit = "kWh", this.limit = null;
  }
  render() {
    if (!this.bars.length) return l`<slot></slot>`;
    const t = this.height, e = t - 26, s = (d) => d.parts.reduce((h, m) => h + m.value, 0), a = Math.max(this.limit ?? 0, ...this.bars.map(s), 1e-3) * 1.1, i = 640, o = (i - k - V) / this.bars.length, n = (d) => e - d / a * e, c = Math.ceil(this.bars.length / 10);
    return l`<svg viewBox="0 0 ${i} ${t}">
      <rect class="plot" x="${k}" y="0" width="${i - k - V}" height="${e}" rx="2"></rect>
      ${[0, 1, 2, 3].map((d) => {
      const h = a / 1.1 * (d / 3);
      return S`<line class="gridline" x1="${k}" x2="${i - V}" y1="${n(h)}" y2="${n(h)}"></line>
          <text class="axis" x="${k - 8}" y="${n(h) + 4}" text-anchor="end">${rt(h, this.unit)}</text>`;
    })}
      ${this.bars.map((d, h) => {
      let m = 0;
      const p = k + h * o + o * 0.18;
      return S`${d.parts.map((f) => {
        const g = n(m);
        m += f.value;
        const y = n(m);
        return S`<rect x="${p}" width="${o * 0.64}" y="${y}" height="${Math.max(0, g - y)}" fill="${f.color}" rx="2"><title>${d.label}: ${f.title}</title></rect>`;
      })}${h % c === 0 ? S`<text class="axis" x="${p + o * 0.32}" y="${t - 6}" text-anchor="middle">${d.label}</text>` : u}`;
    })}
      ${this.limit ? S`<line x1="${k}" x2="${i - V}" y1="${n(this.limit)}" y2="${n(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : u}
    </svg>`;
  }
};
me.styles = [
  C,
  P`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `
];
K([
  _({ attribute: !1 })
], me.prototype, "bars", 2);
K([
  _({ type: Number })
], me.prototype, "height", 2);
K([
  _()
], me.prototype, "unit", 2);
K([
  _({ type: Number })
], me.prototype, "limit", 2);
me = K([
  O("sm-bars")
], me);
var ai = Object.defineProperty, oi = Object.getOwnPropertyDescriptor, ie = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? oi(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && ai(e, s, i), i;
};
const Ce = "var(--sm-solar)", we = "var(--sm-grid)", Lt = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)"
}, ri = (t) => {
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
let B = class extends w {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this.peakLimit = null, this._range = "today", this._data = null, this._loading = !1, this._loadedFor = "";
  }
  updated(t) {
    const e = `${this.loadId}|${this._range}`;
    (t.has("loadId") || t.has("hass")) && this.hass && e !== this._loadedFor && this._fetch();
  }
  async _fetch() {
    this._loadedFor = `${this.loadId}|${this._range}`, this._loading = !0;
    const [t, e] = ri(this._range);
    try {
      this._data = await Vt(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _downsample(t) {
    if (t.length <= 1200) return t;
    const s = Math.ceil(t.length / 1200), a = [];
    for (let i = 0; i < t.length; i += s) {
      const o = t.slice(i, i + s), n = (h) => {
        const m = o.map(h).filter((p) => p != null);
        return m.length ? m.reduce((p, f) => p + f, 0) / m.length : null;
      }, c = o[o.length - 1], d = {};
      for (const h of Object.keys(c[3]))
        d[h] = [n((m) => {
          var p;
          return (p = m[3][h]) == null ? void 0 : p[0];
        }), n((m) => {
          var p;
          return (p = m[3][h]) == null ? void 0 : p[1];
        }), c[3][h][2], o.some((m) => {
          var p;
          return (p = m[3][h]) == null ? void 0 : p[3];
        }) ? 1 : 0, n((m) => {
          var p;
          return (p = m[3][h]) == null ? void 0 : p[4];
        })];
      a.push([o[0][0], n((h) => h[1]), n((h) => h[2]), d]);
    }
    return a;
  }
  _band(t, e, s) {
    var o;
    const a = [];
    let i = null;
    for (let n = 0; n < t.length; n++) {
      const c = t[n][3][e], d = c ? c[2] : null, h = d ? De(d) : "", p = d && (c[3] || d === "peak_guard") && h ? Lt[h] : null, f = d ? r(`reason.${d}`) : "", g = ((o = t[n + 1]) == null ? void 0 : o[0]) ?? t[n][0] + 60;
      p && i && i.color === p && i.title === f ? i.to = g : (i && a.push(i), i = p ? { from: t[n][0], to: g, color: p, title: f } : null);
    }
    return i && a.push(i), { label: s, segments: a };
  }
  _history() {
    var a, i;
    const t = this._downsample(((i = (a = this._data) == null ? void 0 : a.timeline) == null ? void 0 : i.rows) ?? []);
    if (t.length < 2) return l`<div class="empty">${r("a.no_data")}</div>`;
    const e = t.map((o) => o[0]), s = [];
    if (this.loadId) {
      const o = this.loadId, n = this.loads.find((d) => d.id === o), c = [
        { label: r("a.from_solar"), color: Ce, kind: "area", stack: "l", values: t.map((d) => {
          var h;
          return ((h = d[3][o]) == null ? void 0 : h[1]) ?? 0;
        }) },
        { label: r("a.from_grid"), color: we, kind: "area", stack: "l", values: t.map((d) => {
          var h, m;
          return Math.max(0, (((h = d[3][o]) == null ? void 0 : h[0]) ?? 0) - (((m = d[3][o]) == null ? void 0 : m[1]) ?? 0));
        }) },
        ...(n == null ? void 0 : n.type) === "battery" ? [{ label: r("a.discharged"), color: "var(--sm-ok)", kind: "area", stack: "d", values: t.map((d) => {
          var h;
          return Math.max(0, -(((h = d[3][o]) == null ? void 0 : h[0]) ?? 0));
        }) }] : [],
        { label: r("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: t.map((d) => d[1]) }
      ];
      if (s.push({ title: `${r("a.power")} (W)`, unit: "W", height: 220, series: c }), t.some((d) => {
        var h;
        return ((h = d[3][o]) == null ? void 0 : h[4]) != null;
      })) {
        const d = (n == null ? void 0 : n.type) === "ev" || (n == null ? void 0 : n.type) === "battery";
        s.push({
          title: d ? `${r("a.soc")} (%)` : `${r("a.temperature")} (°C)`,
          unit: d ? "%" : "°C",
          height: 90,
          zero: !1,
          series: [{ label: r(d ? "a.soc" : "a.temperature"), color: "var(--sm-err)", kind: "line", values: t.map((h) => {
            var m;
            return ((m = h[3][o]) == null ? void 0 : m[4]) ?? null;
          }) }]
        });
      }
      s.push({ title: r("a.why"), unit: "", height: 22, bands: [this._band(t, o, "")] });
    } else {
      const o = this.loads.map((n, c) => ({
        label: n.name,
        color: $e[c % $e.length],
        kind: "area",
        stack: "loads",
        values: t.map((d) => {
          var h;
          return Math.max(0, ((h = d[3][n.id]) == null ? void 0 : h[0]) ?? 0);
        })
      }));
      o.push({ label: r("a.pv"), color: Ce, kind: "line", values: t.map((n) => n[1]) }), s.push({ title: `${r("a.power")} (W)`, unit: "W", height: 220, series: o }), s.push({
        title: `${r("site.grid")} (W) · + ${r("a.import").toLowerCase()} / − ${r("a.export").toLowerCase()}`,
        unit: "W",
        height: 90,
        series: [{ label: r("site.grid"), color: we, kind: "line", values: t.map((n) => n[2]) }]
      }), s.push({
        title: r("a.why"),
        unit: "",
        height: this.loads.length * 16 + 6,
        bands: this.loads.map((n) => this._band(t, n.id, n.name.length > 9 ? n.name.slice(0, 8) + "…" : n.name))
      });
    }
    return l`<sm-chart .x=${e} .panels=${s}></sm-chart>`;
  }
  _tile(t, e, s) {
    return l`<div class="tile"><div class="v">${t}</div><div class="l">${e}</div>
      ${s ? l`<div class="bar"><div style="width:${s[0] * 100}%;background:${Ce}"></div><div style="width:${s[1] * 100}%;background:${we}"></div></div>` : u}</div>`;
  }
  _summary() {
    var s;
    const t = (s = this._data) == null ? void 0 : s.summary;
    if (!t) return u;
    if (this.loadId) {
      const a = t.loads[this.loadId];
      if (!a) return l`<div class="empty">${r("a.no_data")}</div>`;
      const i = a.solar_share ?? 0, o = this.loads.find((c) => c.id === this.loadId);
      if ((o == null ? void 0 : o.type) === "battery") {
        const c = o.bat_capacity_kwh || 0;
        return l`<div class="tiles">
          ${this._tile(x(a.kwh), r("a.charged"), a.kwh > 0 ? [i, 1 - i] : void 0)}
          ${this._tile(re(a.solar_share), r("a.solar_share"))}
          ${this._tile(x(a.discharge_kwh ?? 0), r("a.discharged"))}
          ${this._tile(re(a.efficiency ?? null), r("a.efficiency"))}
          ${this._tile(c ? ((a.discharge_kwh ?? 0) / c).toFixed(1) : "–", r("a.cycles"))}
          ${this._tile(it(a.saving), r("a.saving"))}
        </div>`;
      }
      const n = Object.entries(a.reasons ?? {}).filter(([c]) => De(c)).sort((c, d) => d[1] - c[1]);
      return l`<div class="tiles">
          ${this._tile(x(a.kwh), r("a.energy"), a.kwh > 0 ? [i, 1 - i] : void 0)}
          ${this._tile(re(a.solar_share), r("a.solar_share"))}
          ${this._tile(x(a.grid_kwh), r("a.grid"))}
          ${this._tile(st(a.runtime_s), r("a.runtime"))}
          ${this._tile(String(a.starts), r("a.starts"))}
          ${this._tile(it(a.saving), r("a.saving"))}
        </div>
        ${n.length ? l`<div class="why">${n.map(([c, d]) => l`<span class="pill"><span class="swatch" style="background:${Lt[De(c)]}"></span>${r(`reason.${c}`)} <b>${st(d)}</b></span>`)}</div>` : u}`;
    }
    const e = t.house;
    return l`<div class="tiles">
        ${this._tile(x(e.pv_kwh, 1), r("a.pv"))}
        ${this._tile(re(e.self_consumption), r("a.self_consumption"))}
        ${this._tile(re(e.self_sufficiency), r("a.self_sufficiency"))}
        ${this._tile(x(e.import_kwh, 1), r("a.import"))}
        ${this._tile(x(e.export_kwh, 1), r("a.export"))}
        ${this._tile(M(e.peak_w), r("a.peak"))}
      </div>
      <table>
        <tr><th>${r("a.distribution")}</th><th class="num">${r("a.energy")}</th><th class="num">${r("a.solar_share")}</th><th class="num">${r("a.runtime")}</th><th class="num">${r("a.saving")}</th></tr>
        ${this.loads.map((a, i) => {
      const o = t.loads[a.id];
      return o ? l`<tr><td><span class="swatch" style="background:${$e[i % $e.length]}"></span>${a.name}</td>
            <td class="num">${x(o.kwh)}</td><td class="num">${re(o.solar_share)}</td><td class="num">${st(o.runtime_s)}</td><td class="num">${it(o.saving)}</td></tr>` : u;
    })}
      </table>`;
  }
  _daily() {
    var a;
    const t = ((a = this._data) == null ? void 0 : a.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return u;
    const s = e.map((i) => {
      const o = `${Number(i.slice(8))}/${Number(i.slice(5, 7))}`;
      if (this.loadId) {
        const n = t[i].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label: o, parts: [
          { value: n.solar_kwh, color: Ce, title: `${r("a.solar")} ${x(n.solar_kwh)}` },
          { value: Math.max(0, n.kwh - n.solar_kwh), color: we, title: `${r("a.grid")} ${x(n.kwh - n.solar_kwh)}` }
        ] };
      }
      return { label: o, parts: this.loads.map((n, c) => {
        var h;
        const d = ((h = t[i].loads[n.id]) == null ? void 0 : h.kwh) ?? 0;
        return { value: d, color: $e[c % $e.length], title: `${n.name} ${x(d)}` };
      }) };
    });
    return l`<div class="card"><div class="card-head"><h2>${r("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${s}></sm-bars></div></div>`;
  }
  _rhythm() {
    var s, a;
    if (!this.loadId) return u;
    const t = ((a = (s = this._data) == null ? void 0 : s.rhythm) == null ? void 0 : a[this.loadId]) ?? [];
    if (!t.some((i) => i > 0)) return u;
    const e = t.map((i, o) => ({ label: `${o}u`, parts: [{ value: i, color: Ce, title: M(i) }] }));
    return l`<div class="card"><div class="card-head"><h2>${r("a.rhythm")}</h2><span class="meta">${r("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div></div>`;
  }
  _quarters() {
    var i;
    if (this.loadId) return u;
    const t = ((i = this._data) == null ? void 0 : i.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return u;
    const s = this.peakLimit, a = e.length === 1 ? t[e[0]].map(([o, n]) => ({
      label: new Date(o * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: n, color: s && n > s ? "var(--sm-err)" : we, title: M(n) }]
    })) : e.map((o) => {
      const n = Math.max(...t[o].map((c) => c[1]));
      return { label: `${Number(o.slice(8))}/${Number(o.slice(5, 7))}`, parts: [{ value: n, color: s && n > s ? "var(--sm-err)" : we, title: M(n) }] };
    });
    return l`<div class="card"><div class="card-head"><h2>${r("a.quarters")}</h2><span class="meta">${r("site.peak_limit")} ${M(s)}</span></div>
      <div class="card-body"><sm-bars .bars=${a} unit="W" .limit=${s}></sm-bars></div></div>`;
  }
  _sessions() {
    var a;
    const t = this.loadId ? this.loads.find((i) => i.id === this.loadId) : null;
    if (!t || t.type !== "ev") return u;
    const e = [...((a = this._data) == null ? void 0 : a.sessions) ?? []].reverse();
    if (!e.length) return u;
    const s = (i) => i ? new Date(i * 1e3).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : r("a.ongoing");
    return l`<div class="card"><div class="card-head"><h2>${r("a.sessions")}</h2><span class="meta">${e.length}</span></div>
      <table>
        <tr><th>${r("a.start")}</th><th>${r("a.end")}</th><th class="num">${r("a.energy")}</th><th class="num">${r("a.solar_share")}</th><th class="num">${r("a.soc")}</th></tr>
        ${e.map((i) => l`<tr><td>${s(i.start)}</td><td>${s(i.end)}</td><td class="num">${x(i.kwh)}</td>
          <td class="num">${re(i.kwh > 0 ? i.solar_kwh / i.kwh : null)}</td><td class="num">${i.soc_start ?? "–"}% → ${i.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }
  render() {
    const t = [{ value: "", label: r("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((s) => ({ value: s.id, label: s.name, icon: s.icon || He(s.type) }))
    ), e = ["today", "yesterday", "7d", "30d", "month"];
    return l`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${t} .value=${this.loadId ?? ""}
          @value-changed=${(s) => {
      this.loadId = s.detail.value || null, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: !0, composed: !0 }));
    }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${e.map((s) => ({ value: s, label: r(`a.range.${s}`) }))} .value=${this._range}
          @value-changed=${(s) => {
      this._range = s.detail.value, this._fetch();
    }}></sm-segmented>
      </div>
      <div class="card"><div class="card-head"><h2>${r("a.summary")}</h2>${this._loading ? l`<span class="meta">…</span>` : u}</div>${this._summary()}</div>
      <div class="card"><div class="card-head"><h2>${r("a.timeline")}</h2></div><div class="card-body">${this._history()}</div></div>
      ${this._sessions()}
      <div class="two">${this._daily()}${this._rhythm()}${this._quarters()}</div>
    `;
  }
};
B.styles = [
  C,
  se,
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
ie([
  _({ attribute: !1 })
], B.prototype, "hass", 2);
ie([
  _({ attribute: !1 })
], B.prototype, "loads", 2);
ie([
  _()
], B.prototype, "loadId", 2);
ie([
  _({ type: Number })
], B.prototype, "peakLimit", 2);
ie([
  b()
], B.prototype, "_range", 2);
ie([
  b()
], B.prototype, "_data", 2);
ie([
  b()
], B.prototype, "_loading", 2);
B = ie([
  O("sm-analytics")
], B);
var ni = Object.defineProperty, li = Object.getOwnPropertyDescriptor, z = (t, e, s, a) => {
  for (var i = a > 1 ? void 0 : a ? li(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (a ? n(e, s, i) : n(i)) || i);
  return a && i && ni(e, s, i), i;
};
const di = 6 * 3600;
let E = class extends w {
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
    this._started = !0, ks(this.hass.language);
    try {
      await this._reload(), this._unsub = await kt(this.hass, (t) => this._live = t), this._loadSpark(), this._sparkTimer = window.setInterval(() => this._loadSpark(), 6e4);
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t), this._started = !1;
    }
  }
  async _reload() {
    this._config = await ms(this.hass), this._live = this._config.live;
  }
  async _loadSpark() {
    const t = Date.now() / 1e3;
    try {
      const e = await Vt(this.hass, t - di, t, null), s = {};
      for (const a of e.timeline.rows)
        for (const [i, o] of Object.entries(a[3]))
          (s[i] ?? (s[i] = [])).push([a[0], Math.abs(o[0] ?? 0), o[1] ?? 0]);
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
        await this._reload(), this._unsub = await kt(this.hass, (s) => this._live = s);
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
    this._config = { ...s, loads: s.loads.map((a) => a.id === t ? { ...a, mode: e } : a) }, this._flashSave("saving"), await vs(this.hass, t, e), this._flashSave("saved");
  }
  async _setMinPower(t, e) {
    const s = this._config;
    this._config = { ...s, loads: s.loads.map((a) => a.id === t ? { ...a, ev_min_power_w: e } : a) }, this._flashSave("saving"), await fs(this.hass, t, e), this._flashSave("saved");
  }
  async _moveLoad(t, e) {
    const s = this._config.loads.map((o) => o.id), a = s.indexOf(t), i = a + e;
    i < 0 || i >= s.length || ([s[a], s[i]] = [s[i], s[a]], this._setOrder(s), await Ut(this.hass, s));
  }
  _addFields() {
    var i;
    const t = (o) => o.type === "ev", e = (o) => o.type === "battery", s = (o) => !t(o) && !e(o), a = (o) => t(o) && o.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev", "battery"].map((o) => ({ value: o, label: r(`type.${o}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: s },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: s },
      { key: "bat_soc_entity", kind: "entity", domains: ["sensor"], show: e },
      { key: "bat_power_entity", kind: "entity", domains: ["sensor"], show: e, helper: r("f.bat_power_entity.help") },
      { key: "bat_power_sign", kind: "select", show: e, options: ["charge_positive", "discharge_positive"].map((o) => ({ value: o, label: r(`f.bat_sign.${o}`) })) },
      { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], show: e, helper: r("f.bat_setpoint_entity.help") },
      { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1, show: e },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((o) => ({ value: o, label: r(`f.ev_driver.${o}`) })), show: t },
      { key: "ev_proxy_url", kind: "text", show: a, helper: r("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: a },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (o) => t(o) && !a(o) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (o) => t(o) && !a(o) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: r("f.power_entity.help"), show: (o) => !e(o) },
      { key: "mode", kind: "select", options: ot((i = this._adding) == null ? void 0 : i.type).map((o) => {
        var n;
        return { value: o, label: r(ht(o, (n = this._adding) == null ? void 0 : n.type)) };
      }) }
    ];
  }
  _startAdd() {
    this._addError = "", this._adding = { ...this._config.defaults.load, id: "", name: "", ev_driver: "tesla_ble_proxy" };
  }
  async _saveAdd() {
    const t = { ...this._adding };
    t.type !== "switch" && (!t.icon || t.icon === "mdi:water-boiler") && (t.icon = He(t.type)), ot(t.type).includes(t.mode) || (t.mode = t.type === "battery" ? "self" : "solar"), this._addBusy = !0;
    try {
      const e = await Bt(this.hass, t);
      this._adding = null, await this._resubscribe(), this._detail = e.load.id;
    } catch (e) {
      this._addError = (e == null ? void 0 : e.message) ?? String(e);
    } finally {
      this._addBusy = !1;
    }
  }
  _menuButton() {
    return this.narrow && customElements.get("ha-menu-button") ? l`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : u;
  }
  _saveIndicator() {
    if (!this._save) return u;
    const t = this._save === "saving" ? "mdi:cloud-upload-outline" : this._save === "saved" ? "mdi:check-circle-outline" : "mdi:alert-circle-outline";
    return l`<span class="save ${this._save}"><ha-icon .icon=${t}></ha-icon>${r(`save.${this._save}`)}</span>`;
  }
  _toolbar() {
    const t = this._config, e = this._detail ? t == null ? void 0 : t.loads.find((s) => s.id === this._detail) : void 0;
    return e ? l`<div class="toolbar">
        <button class="icon" @click=${() => this._detail = null} title=${r("nav.back")}><ha-icon icon="mdi:arrow-left"></ha-icon></button>
        <span class="title pad">${e.name}</span>
        ${this._saveIndicator()}
        <button class="icon" title=${r("load.analytics")} @click=${() => {
      this._analyticsLoad = e.id, this._detail = null, this._tab = "analytics";
    }}>
          <ha-icon icon="mdi:chart-line"></ha-icon></button>
      </div>` : l`<div class="toolbar">
        ${this._menuButton()}
        <span class="title ${this.narrow ? "" : "pad"}">SolarMind</span>
        ${this._saveIndicator()}
        ${this._tab === "loads" && (t != null && t.loads.length) ? l`<button class="icon" title=${this._editing ? r("nav.done") : r("nav.reorder")} @click=${() => this._editing = !this._editing}>
              <ha-icon .icon=${this._editing ? "mdi:check" : "mdi:pencil"}></ha-icon></button>` : u}
      </div>
      <nav class="tabs">
        ${["loads", "analytics", "settings"].map(
      (s) => l`<button class="tab ${this._tab === s ? "on" : ""}" @click=${() => {
        this._tab = s, this._editing = !1;
      }}>${r(`tab.${s}`)}</button>`
    )}
      </nav>`;
  }
  _content(t) {
    var s, a, i, o;
    const e = this._detail ? t.loads.findIndex((n) => n.id === this._detail) : -1;
    if (e >= 0) {
      const n = { ...t.defaults.load, ...t.loads[e] };
      return l`<sm-load-detail .hass=${this.hass} .load=${n} .live=${(a = (s = this._live) == null ? void 0 : s.loads) == null ? void 0 : a[n.id]} .spark=${this._spark[n.id] ?? []}
        .priority=${e + 1} .count=${t.loads.length}
        @set-mode=${(c) => this._setMode(c.detail.id, c.detail.mode)}
        @set-min-power=${(c) => this._setMinPower(c.detail.id, c.detail.power_w)}
        @move-load=${(c) => this._moveLoad(c.detail.id, c.detail.delta)}
        @open-analytics=${(c) => {
        this._analyticsLoad = c.detail.id, this._detail = null, this._tab = "analytics";
      }}
        @load-saved=${async (c) => {
        this._flashSave("saved"), c.detail.renamed ? await this._resubscribe() : await this._reload();
      }}
        @load-deleted=${async () => {
        this._detail = null, await this._resubscribe();
      }}></sm-load-detail>`;
    }
    switch (this._tab) {
      case "analytics":
        return l`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad} .peakLimit=${((o = (i = this._live) == null ? void 0 : i.site) == null ? void 0 : o.peak_limit_w) ?? null}
          @analytics-load=${(n) => this._analyticsLoad = n.detail.id}></sm-analytics>`;
      case "settings":
        return l`<sm-settings .hass=${this.hass} .settings=${t.settings} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(n) => {
          this._config = { ...t, settings: { ...t.settings, ...n.detail.settings } }, this._flashSave("saved");
        }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return l`<sm-dashboard .hass=${this.hass} .loads=${t.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(n) => this._detail = n.detail.id}
          @set-mode=${(n) => this._setMode(n.detail.id, n.detail.mode)}
        @set-min-power=${(n) => this._setMinPower(n.detail.id, n.detail.power_w)}
          @loads-reordered=${(n) => this._setOrder(n.detail.order)}
          @add-load=${this._startAdd}></sm-dashboard>`;
    }
  }
  render() {
    if (this._error) return l`<div class="err">${this._error}</div>`;
    const t = this._config;
    return l`
      ${this._toolbar()}
      ${t && t.version && t.version !== "0.2.4" ? l`<div class="stale"><ha-icon icon="mdi:update"></ha-icon>
            <span>${r("panel.stale").replace("{server}", t.version).replace("{panel}", "0.2.4")}</span>
            <button class="text" @click=${() => location.reload()}>${r("panel.reload")}</button></div>` : u}
      <main>${t ? this._content(t) : u}</main>
      ${this._adding ? l`<sm-dialog .heading=${r("loads.add")} .saveLabel=${r("load.add_save")} .busy=${this._addBusy} .error=${this._addError}
            .canSave=${!!this._adding.name} @closed=${() => this._adding = null} @save=${this._saveAdd}>
            <sm-form .hass=${this.hass} .fields=${this._addFields()} .data=${this._adding}
              @value-changed=${(e) => this._adding = { ...this._adding, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : u}
    `;
  }
};
E.styles = [
  C,
  se,
  P`
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
z([
  _({ attribute: !1 })
], E.prototype, "hass", 2);
z([
  _({ type: Boolean })
], E.prototype, "narrow", 2);
z([
  b()
], E.prototype, "_config", 2);
z([
  b()
], E.prototype, "_live", 2);
z([
  b()
], E.prototype, "_tab", 2);
z([
  b()
], E.prototype, "_detail", 2);
z([
  b()
], E.prototype, "_editing", 2);
z([
  b()
], E.prototype, "_analyticsLoad", 2);
z([
  b()
], E.prototype, "_spark", 2);
z([
  b()
], E.prototype, "_adding", 2);
z([
  b()
], E.prototype, "_addBusy", 2);
z([
  b()
], E.prototype, "_addError", 2);
z([
  b()
], E.prototype, "_save", 2);
z([
  b()
], E.prototype, "_error", 2);
E = z([
  O("solarmind-panel")
], E);
export {
  E as SolarMindPanel
};
