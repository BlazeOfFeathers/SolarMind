/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = globalThis, dt = qe.ShadowRoot && (qe.ShadyCSS === void 0 || qe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), _t = /* @__PURE__ */ new WeakMap();
let It = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (dt && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = _t.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && _t.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Yt = (t) => new It(typeof t == "string" ? t : t + "", void 0, ct), z = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, a, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[r + 1], t[0]);
  return new It(s, t, ct);
}, Jt = (t, e) => {
  if (dt) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), a = qe.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = s.cssText, t.appendChild(i);
  }
}, gt = dt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Yt(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xt, defineProperty: Qt, getOwnPropertyDescriptor: es, getOwnPropertyNames: ts, getOwnPropertySymbols: ss, getPrototypeOf: as } = Object, Q = globalThis, vt = Q.trustedTypes, is = vt ? vt.emptyScript : "", Qe = Q.reactiveElementPolyfillSupport, Ce = (t, e) => t, Ye = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? is : null;
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
} }, pt = (t, e) => !Xt(t, e), ft = { attribute: !0, type: String, converter: Ye, reflect: !1, useDefault: !1, hasChanged: pt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Q.litPropertyMetadata ?? (Q.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let xe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = ft) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(e, i, s);
      a !== void 0 && Qt(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: a, set: r } = es(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: a, set(n) {
      const c = a == null ? void 0 : a.call(this);
      r == null || r.call(this, n), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ft;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ce("elementProperties"))) return;
    const e = as(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ce("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ce("properties"))) {
      const s = this.properties, i = [...ts(s), ...ss(s)];
      for (const a of i) this.createProperty(a, s[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, a] of s) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const a = this._$Eu(s, i);
      a !== void 0 && this._$Eh.set(a, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) s.unshift(gt(a));
    } else e !== void 0 && s.push(gt(e));
    return s;
  }
  static _$Eu(e, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const i of s.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Jt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostConnected) == null ? void 0 : i.call(s);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostDisconnected) == null ? void 0 : i.call(s);
    });
  }
  attributeChangedCallback(e, s, i) {
    this._$AK(e, i);
  }
  _$ET(e, s) {
    var r;
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const n = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : Ye).toAttribute(s, i.type);
      this._$Em = e, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var r, n;
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const c = i.getPropertyOptions(a), l = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((r = c.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? c.converter : Ye;
      this._$Em = a;
      const p = l.fromAttribute(s, c.type);
      this[a] = p ?? ((n = this._$Ej) == null ? void 0 : n.get(a)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, a = !1, r) {
    var n;
    if (e !== void 0) {
      const c = this.constructor;
      if (a === !1 && (r = this[e]), i ?? (i = c.getPropertyOptions(e)), !((i.hasChanged ?? pt)(r, s) || i.useDefault && i.reflect && r === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(c._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: a, wrapped: r }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, n] of a) {
        const { wrapped: c } = n, l = this[r];
        c !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (i = this._$EO) == null || i.forEach((a) => {
        var r;
        return (r = a.hostUpdate) == null ? void 0 : r.call(a);
      }), this.update(s)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((i) => {
      var a;
      return (a = i.hostUpdated) == null ? void 0 : a.call(i);
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
xe.elementStyles = [], xe.shadowRootOptions = { mode: "open" }, xe[Ce("elementProperties")] = /* @__PURE__ */ new Map(), xe[Ce("finalized")] = /* @__PURE__ */ new Map(), Qe == null || Qe({ ReactiveElement: xe }), (Q.reactiveElementVersions ?? (Q.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = globalThis, bt = (t) => t, Je = je.trustedTypes, yt = Je ? Je.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Wt = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, Rt = "?" + X, os = `<${Rt}>`, pe = document, Ne = () => pe.createComment(""), Te = (t) => t === null || typeof t != "object" && typeof t != "function", ht = Array.isArray, rs = (t) => ht(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, ze = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, $t = /-->/g, wt = />/g, re = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), xt = /'/g, kt = /"/g, Ht = /^(?:script|style|textarea|title)$/i, Bt = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = Bt(1), A = Bt(2), ke = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), St = /* @__PURE__ */ new WeakMap(), de = pe.createTreeWalker(pe, 129);
function Ut(t, e) {
  if (!ht(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(e) : e;
}
const ns = (t, e) => {
  const s = t.length - 1, i = [];
  let a, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = ze;
  for (let c = 0; c < s; c++) {
    const l = t[c];
    let p, m, h = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, m = n.exec(l), m !== null); ) f = n.lastIndex, n === ze ? m[1] === "!--" ? n = $t : m[1] !== void 0 ? n = wt : m[2] !== void 0 ? (Ht.test(m[2]) && (a = RegExp("</" + m[2], "g")), n = re) : m[3] !== void 0 && (n = re) : n === re ? m[0] === ">" ? (n = a ?? ze, h = -1) : m[1] === void 0 ? h = -2 : (h = n.lastIndex - m[2].length, p = m[1], n = m[3] === void 0 ? re : m[3] === '"' ? kt : xt) : n === kt || n === xt ? n = re : n === $t || n === wt ? n = ze : (n = re, a = void 0);
    const g = n === re && t[c + 1].startsWith("/>") ? " " : "";
    r += n === ze ? l + os : h >= 0 ? (i.push(p), l.slice(0, h) + Wt + l.slice(h) + X + g) : l + X + (h === -2 ? c : g);
  }
  return [Ut(t, r + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Ie {
  constructor({ strings: e, _$litType$: s }, i) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const c = e.length - 1, l = this.parts, [p, m] = ns(e, s);
    if (this.el = Ie.createElement(p, i), de.currentNode = this.el.content, s === 2 || s === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = de.nextNode()) !== null && l.length < c; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(Wt)) {
          const f = m[n++], g = a.getAttribute(h).split(X), y = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: y[2], strings: g, ctor: y[1] === "." ? ds : y[1] === "?" ? cs : y[1] === "@" ? ps : Xe }), a.removeAttribute(h);
        } else h.startsWith(X) && (l.push({ type: 6, index: r }), a.removeAttribute(h));
        if (Ht.test(a.tagName)) {
          const h = a.textContent.split(X), f = h.length - 1;
          if (f > 0) {
            a.textContent = Je ? Je.emptyScript : "";
            for (let g = 0; g < f; g++) a.append(h[g], Ne()), de.nextNode(), l.push({ type: 2, index: ++r });
            a.append(h[f], Ne());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Rt) l.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(X, h + 1)) !== -1; ) l.push({ type: 7, index: r }), h += X.length - 1;
      }
      r++;
    }
  }
  static createElement(e, s) {
    const i = pe.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Se(t, e, s = t, i) {
  var n, c;
  if (e === ke) return e;
  let a = i !== void 0 ? (n = s._$Co) == null ? void 0 : n[i] : s._$Cl;
  const r = Te(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== r && ((c = a == null ? void 0 : a._$AO) == null || c.call(a, !1), r === void 0 ? a = void 0 : (a = new r(t), a._$AT(t, s, i)), i !== void 0 ? (s._$Co ?? (s._$Co = []))[i] = a : s._$Cl = a), a !== void 0 && (e = Se(t, a._$AS(t, e.values), a, i)), e;
}
class ls {
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
    const { el: { content: s }, parts: i } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? pe).importNode(s, !0);
    de.currentNode = a;
    let r = de.nextNode(), n = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let p;
        l.type === 2 ? p = new Re(r, r.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (p = new hs(r, this, e)), this._$AV.push(p), l = i[++c];
      }
      n !== (l == null ? void 0 : l.index) && (r = de.nextNode(), n++);
    }
    return de.currentNode = pe, a;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Re {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, i, a) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    e = Se(this, e, s), Te(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== ke && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : rs(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && Te(this._$AH) ? this._$AA.nextSibling.data = e : this.T(pe.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: s, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Ie.createElement(Ut(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === a) this._$AH.p(s);
    else {
      const n = new ls(a, this), c = n.u(this.options);
      n.p(s), this.T(c), this._$AH = n;
    }
  }
  _$AC(e) {
    let s = St.get(e.strings);
    return s === void 0 && St.set(e.strings, s = new Ie(e)), s;
  }
  k(e) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, a = 0;
    for (const r of e) a === s.length ? s.push(i = new Re(this.O(Ne()), this.O(Ne()), this, this.options)) : i = s[a], i._$AI(r), a++;
    a < s.length && (this._$AR(i && i._$AB.nextSibling, a), s.length = a);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, s); e !== this._$AB; ) {
      const a = bt(e).nextSibling;
      bt(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Xe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, a, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = s, this._$AM = a, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(e, s = this, i, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = Se(this, e, s, 0), n = !Te(e) || e !== this._$AH && e !== ke, n && (this._$AH = e);
    else {
      const c = e;
      let l, p;
      for (e = r[0], l = 0; l < r.length - 1; l++) p = Se(this, c[i + l], s, l), p === ke && (p = this._$AH[l]), n || (n = !Te(p) || p !== this._$AH[l]), p === u ? e = u : e !== u && (e += (p ?? "") + r[l + 1]), this._$AH[l] = p;
    }
    n && !a && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ds extends Xe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class cs extends Xe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class ps extends Xe {
  constructor(e, s, i, a, r) {
    super(e, s, i, a, r), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = Se(this, e, s, 0) ?? u) === ke) return;
    const i = this._$AH, a = e === u && i !== u || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== u && (i === u || a);
    a && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class hs {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Se(this, e);
  }
}
const tt = je.litHtmlPolyfillSupport;
tt == null || tt(Ie, Re), (je.litHtmlVersions ?? (je.litHtmlVersions = [])).push("3.3.3");
const us = (t, e, s) => {
  const i = (s == null ? void 0 : s.renderBefore) ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const r = (s == null ? void 0 : s.renderBefore) ?? null;
    i._$litPart$ = a = new Re(e.insertBefore(Ne(), r), r, void 0, s ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = us(s, this.renderRoot, this.renderOptions);
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
var Tt;
w._$litElement$ = !0, w.finalized = !0, (Tt = ce.litElementHydrateSupport) == null || Tt.call(ce, { LitElement: w });
const st = ce.litElementPolyfillSupport;
st == null || st({ LitElement: w });
(ce.litElementVersions ?? (ce.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ms = { attribute: !0, type: String, converter: Ye, reflect: !1, hasChanged: pt }, _s = (t = ms, e, s) => {
  const { kind: i, metadata: a } = s;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(s.name, t), i === "accessor") {
    const { name: n } = s;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(c) {
      const l = this[n];
      e.call(this, c), this.requestUpdate(n, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function _(t) {
  return (e, s) => typeof s == "object" ? _s(t, e, s) : ((i, a, r) => {
    const n = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(a, r) : void 0;
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
const gs = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), vs = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), Vt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), fs = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Ft = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), bs = (t, e, s) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: s }), ys = (t, e, s) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_ev_min_power", load_id: e, power_w: s }), $s = (t) => t.connection.sendMessagePromise({ type: "solarmind/notify/test" }), Gt = (t, e, s, i) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: s, load_id: i }), At = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), ws = (t) => t.connection.sendMessagePromise({ type: "solarmind/logs" }), xs = (t) => t.connection.sendMessagePromise({ type: "solarmind/logs/clear" }), ks = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/logs/verbose", enabled: e }), Mt = {
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
  "site.ev_first": "Auto eerst (zonnige dag)"
}, Ss = {
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
  "site.ev_first": "Car first (sunny day)"
};
let Zt = "nl";
const As = (t) => {
  Zt = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, o = (t) => (Zt === "en" ? Ss[t] ?? Mt[t] : Mt[t]) ?? t, O = z`
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
`, se = z`
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
`, M = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, qt = (t) => t == null || Number.isNaN(t) ? ["–", ""] : Math.abs(t) >= 1e3 ? [(t / 1e3).toFixed(2), "kW"] : [String(Math.round(t)), "W"], x = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, ne = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, at = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), s = Math.round(t % 3600 / 60);
  return e ? `${e} u ${s} min` : `${s} min`;
}, Ms = (t) => {
  const e = Math.max(1, Math.round(t / 60)), s = Math.floor(e / 60), i = e % 60;
  return s ? i ? `${s} u ${String(i).padStart(2, "0")}` : `${s} u` : `${i} min`;
}, Fe = (t) => {
  const e = new Date(Date.now() + t * 1e3), s = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return e.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? s : `${e.toLocaleDateString([], { weekday: "short" })} ${s}`;
}, it = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`, Es = (t) => t == null ? "–" : t >= 3600 ? `${Math.round(t / 3600 * 10) / 10} u` : t >= 60 ? `${Math.round(t / 60 * 10) / 10} min` : `${t} s`, zs = {
  self: "mdi:home-battery-outline",
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off"
}, Le = (t) => (t == null ? void 0 : t.type) === "battery", nt = (t) => t === "battery" ? ["self", "solar", "solar_night", "on", "off"] : ["solar", "solar_night", "on", "off"], ut = (t, e) => e === "battery" && t !== "self" ? `mode.bat.${t}` : `mode.${t}`, Kt = (t) => nt(t).map((e) => ({ value: e, label: o(ut(e, t)), icon: zs[e] })), He = (t) => t === "ev" ? "mdi:ev-station" : t === "battery" ? "mdi:home-battery" : "mdi:water-boiler", De = (t) => t === "solar" ? "solar" : t === "self_consumption" ? "ok" : ["night", "always_on", "legionella", "min_soc", "min_power"].includes(t) ? "grid" : t === "peak_guard" || t === "unavailable" ? "warn" : t === "target_reached" || t === "battery_full" ? "ok" : t === "reserve" ? "warn" : "", Ps = (t) => ({
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
var Os = Object.defineProperty, Cs = Object.getOwnPropertyDescriptor, Be = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Cs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Os(e, s, a), a;
};
let he = class extends w {
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
he.styles = [
  O,
  z`
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
  P("sm-segmented")
], he);
var js = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, Ue = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Ls(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && js(e, s, a), a;
};
let ue = class extends w {
  constructor() {
    super(...arguments), this.points = [], this.max = 0, this.height = 72, this.label = "";
  }
  render() {
    const t = this.points, e = 400, s = this.height;
    if (t.length < 2) return d`<svg viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" style="height:${s}px"></svg>`;
    const i = t[0][0], a = t[t.length - 1][0], r = Math.max(this.max, ...t.map((h) => h[1]), 1) * 1.1, n = (h) => (h - i) / Math.max(1, a - i) * e, c = (h) => s - h / r * (s - 4), l = (h) => t.map((f, g) => `${g ? "L" : "M"}${n(f[0]).toFixed(1)},${c(h(f)).toFixed(1)}`).join(""), p = (h, f) => {
      let g = l(h);
      for (let y = t.length - 1; y >= 0; y--) g += `L${n(t[y][0]).toFixed(1)},${c(f(t[y])).toFixed(1)}`;
      return g + "Z";
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
        ${A`<path d="${p((h) => h[2], () => 0)}" fill="url(#${m}s)"></path>
        <path d="${p((h) => h[1], (h) => h[2])}" fill="url(#${m}g)"></path>
        <path d="${l((h) => h[1])}" fill="none" stroke="var(--secondary-text-color)" stroke-opacity="0.6" stroke-width="1.2" vector-effect="non-scaling-stroke"></path>
        <path d="${l((h) => h[2])}" fill="none" stroke="var(--sm-solar)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
      </svg>
      ${this.label ? d`<span class="label">${this.label}</span>` : ""}`;
  }
};
ue.styles = [
  O,
  z`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `
];
Ue([
  _({ attribute: !1 })
], ue.prototype, "points", 2);
Ue([
  _({ type: Number })
], ue.prototype, "max", 2);
Ue([
  _({ type: Number })
], ue.prototype, "height", 2);
Ue([
  _()
], ue.prototype, "label", 2);
ue = Ue([
  P("sm-sparkline")
], ue);
var Ds = Object.defineProperty, Ns = Object.getOwnPropertyDescriptor, Me = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Ns(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Ds(e, s, a), a;
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
    return t ? t.driver_error ? `${o("hint.driver_error")}: ${t.driver_error}` : Le(e) ? e.mode === "solar_night" && t.night_needed === !0 ? o("hint.bat_night") : t.reason === "peak_guard" && (t.power_w ?? 0) < 0 ? o("hint.bat_peak") : t.stored_kwh != null ? `${x(t.stored_kwh, 1)} ${o("hint.bat_stored")}` : null : e.type === "ev" && t.car_state === "NoPower" ? o("hint.no_power") : t.reason === "peak_guard" ? o("hint.peak") : t.is_full ? o(e.type === "ev" ? "hint.full_ev" : "hint.full") : e.mode === "solar_night" && t.night_needed === !0 ? o("hint.night_needed") : e.mode === "solar_night" && t.night_needed === !1 ? o("hint.night_not_needed") : e.type === "ev" && t.plugged === !1 ? o("reason.not_connected") : e.type === "ev" && t.is_on && t.current_a != null ? `${o("hint.charging_at")} ${Math.round(t.current_a)} A` : null : null;
  }
  _batEta() {
    const t = this.live;
    return t ? t.eta_full_s ? d`<span class="eta"><ha-icon icon="mdi:battery-arrow-up"></ha-icon>${o("eta.bat_full").replace("{t}", Fe(t.eta_full_s))}</span>` : t.eta_empty_s ? d`<span class="eta"><ha-icon icon="mdi:battery-arrow-down"></ha-icon>${o("eta.bat_empty").replace("{t}", Fe(t.eta_empty_s))}</span>` : u : u;
  }
  _eta() {
    const t = this.live;
    if (Le(this.load)) return this._batEta();
    if (this.load.type !== "ev" || !t || t.plugged === !1) return u;
    if (t.soc != null && t.soc < 100 && !t.battery_kwh && t.eta_full_s == null && t.eta_limit_s == null)
      return d`<span class="eta est"><ha-icon icon="mdi:timer-sand"></ha-icon>${o("eta.need_capacity")}</span>`;
    if (t.eta_full_s == null || !t.eta_full_s) return u;
    const e = !!t.eta_estimated, s = `${e ? "~" : ""}${Ms(t.eta_full_s)}`, i = e ? ` ${o("eta.at_min")}` : ` (± ${Fe(t.eta_full_s)})`;
    return d`<span class="eta ${e ? "est" : ""}"><ha-icon icon="mdi:timer-sand"></ha-icon>${o("eta.full").replace("{d}", s)}${i}</span>`;
  }
  _limitLine() {
    const t = this.live;
    if (this.load.type !== "ev" || !t || t.eta_limit_s == null || t.charge_limit == null || t.plugged === !1) return u;
    const e = `${t.eta_estimated ? "~" : ""}${Fe(t.eta_limit_s)}`;
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
    const e = this.load.ev_min_current ?? 6, s = this.load.ev_max_current ?? 16;
    return Math.max(e, Math.min(s, Math.ceil(t / this._wpa() - 1e-9)));
  }
  _step(t, e) {
    t.stopPropagation();
    const s = this.load.ev_min_current ?? 6, i = this.load.ev_max_current ?? 16, a = this._curAmps();
    let r = a + e;
    e > 0 && a === 0 && (r = s), e < 0 && a <= s && (r = 0), r = Math.min(i, Math.max(0, r)), r !== a && (this._minAmps = r, window.clearTimeout(this._minTimer), this._minTimer = window.setTimeout(() => {
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
    return d`<div class="minp" @click=${(i) => i.stopPropagation()} title=${o("card.min_power_help")}>
      <span class="lbl"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${o("f.ev_min_power_w")}</span></span>
      <span class="stepper">
        <button ?disabled=${t === 0} @click=${(i) => this._step(i, -1)} aria-label="-">−</button>
        <span class="val ${t ? "" : "off"}">${t ? `${s.toLocaleString(void 0, { maximumFractionDigits: 1 })} kW · ${t} A` : o("card.min_power_off")}</span>
        <button ?disabled=${t >= e} @click=${(i) => this._step(i, 1)} aria-label="+">+</button>
      </span>
    </div>`;
  }
  render() {
    const t = this.load, e = this.live, s = Le(t), [i, a] = qt(s ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), r = s && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", n = (e == null ? void 0 : e.reason) ?? "idle", c = De(n), l = !!(e != null && e.is_on) && Math.abs((e == null ? void 0 : e.power_w) ?? 0) > 1, p = t.icon || He(t.type), m = t.type === "ev" ? (t.ev_max_current ?? 16) * 230 * (t.ev_phases ?? 1) : s ? Math.max(t.bat_max_charge_w ?? 0, t.bat_max_discharge_w ?? 0) : t.nominal_power_w, h = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null, f = this._hint();
    return d`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${l ? "active" : ""} .icon=${p}></ha-icon>
        <span class="name">${t.name}</span>
        <span class="status ${c}">
          ${c ? d`<ha-icon .icon=${Ps(n)}></ha-icon>` : d`<span class="dot"></span>`}
          ${o(`reason.${n}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big">${r ? d`<ha-icon class="dir" .icon=${r}></ha-icon>` : u}<span class="v">${i}</span><span class="u">${a}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
            ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon .icon=${s ? "mdi:home-battery-outline" : "mdi:battery-charging"}></ha-icon>${Math.round(e.soc)}%</span>` : u}
            ${this._eta()}
            ${t.enabled ? u : d`<span>${o("reason.disabled")}</span>`}
          </div>
          ${this._limitLine()}
        </div>
        <div class="side">
          <div class="l">${o(s ? "load.charged_today" : "load.today")}</div>
          <div class="v">${x((e == null ? void 0 : e.kwh_today) ?? 0, 1)}</div>
          <div class="s">${s ? `${x((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${o("load.discharged")}` : h === null ? "" : `${Math.round(h * 100)}% ${o("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${m} .height=${76}></sm-sparkline>
        ${f ? d`<span class="hint">${f}</span>` : u}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${Kt(t.type)} .value=${t.mode}
          @value-changed=${(g) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: g.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
      </div>
      ${t.type === "ev" && t.mode === "solar" ? this._minPowerRow() : u}
      </div>
    </div>`;
  }
};
ee.styles = [
  O,
  se,
  z`
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
  P("sm-load-card")
], ee);
var Ts = Object.defineProperty, Is = Object.getOwnPropertyDescriptor, ge = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Is(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Ts(e, s, a), a;
};
let G = class extends w {
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
G.styles = [
  O,
  z`
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
ge([
  _()
], G.prototype, "icon", 2);
ge([
  _()
], G.prototype, "heading", 2);
ge([
  _()
], G.prototype, "secondary", 2);
ge([
  _()
], G.prototype, "value", 2);
ge([
  _({ type: Boolean })
], G.prototype, "clickable", 2);
ge([
  _({ reflect: !0 })
], G.prototype, "variant", 2);
G = ge([
  P("sm-list-row")
], G);
var Ws = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, ve = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Rs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Ws(e, s, a), a;
};
let Z = class extends w {
  constructor() {
    super(...arguments), this.loads = [], this.spark = {}, this.editing = !1, this._dragId = null;
  }
  _emit(t, e = {}) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  async _saveOrder(t) {
    this._emit("loads-reordered", { order: t }), await Ft(this.hass, t);
  }
  _move(t, e) {
    const s = this.loads.map((r) => r.id), i = s.indexOf(t), a = i + e;
    a < 0 || a >= s.length || ([s[i], s[a]] = [s[a], s[i]], this._saveOrder(s));
  }
  _drop(t) {
    if (!this._dragId || this._dragId === t) return;
    const e = this.loads.map((s) => s.id).filter((s) => s !== this._dragId);
    e.splice(e.indexOf(t), 0, this._dragId), this._dragId = null, this._saveOrder(e);
  }
  _pills() {
    var a, r;
    const t = ((a = this.live) == null ? void 0 : a.site) ?? {}, e = t.grid_w, s = e != null && e < 0, i = (t.quarter_projected_w ?? 0) > (t.peak_limit_w ?? 1 / 0) ? "warn" : "grid";
    return d`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${o("site.pv")} <b>${M(t.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${s ? "export" : "grid"} icon=${s ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${o(s ? "site.export" : "site.import")} <b>${M(e == null ? null : Math.abs(e))}</b></span>
      <span class="pill"><ha-icon class="solar" icon="mdi:white-balance-sunny"></ha-icon>${o("site.surplus")} <b>${M(t.surplus_w)}</b></span>
      <span class="pill"><ha-icon icon="mdi:lightning-bolt"></ha-icon>${o("site.managed")} <b>${M(t.managed_w)}</b></span>
      <span class="pill"><ha-icon class=${i} icon="mdi:chart-bell-curve-cumulative"></ha-icon>${o("site.peak_now")}
        <b>${M(t.quarter_average_w)}</b>&nbsp;/ ${M(t.peak_limit_w)}</span>
      <span class="pill"><ha-icon icon="mdi:calendar-month"></ha-icon>${o("site.month_peak")} <b>${M(t.month_peak_w)}</b></span>
      ${(r = t.forecast) != null && r.ev_first ? d`<span class="pill"><ha-icon class="solar" icon="mdi:car-electric"></ha-icon>${o("site.ev_first")}</span>` : u}
      ${t.in_night ? d`<span class="pill"><ha-icon icon="mdi:weather-night"></ha-icon>${o("site.night")}</span>` : u}
    </div>`;
  }
  _editList() {
    return d`<div class="card edit-list">
      <div class="card-head"><h2>${o("loads.title")}</h2></div>
      <div class="card-body muted" style="padding-bottom:8px">${o("loads.hint")}</div>
      ${this.loads.map(
      (t, e) => d`<div class="edit-row ${this._dragId === t.id ? "dragging" : ""}" draggable="true"
          @dragstart=${() => this._dragId = t.id} @dragend=${() => this._dragId = null}
          @dragover=${(s) => s.preventDefault()} @drop=${() => this._drop(t.id)}>
          <ha-icon class="handle" icon="mdi:drag"></ha-icon>
          <sm-list-row .icon=${t.icon || He(t.type)} .heading=${`${e + 1}. ${t.name}`}
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
      ${t.available === !1 ? d`<div class="banner"><ha-icon icon="mdi:alert-outline"></ha-icon>${o("site.no_grid")}</div>` : u}
      ${t.enabled === !1 ? d`<div class="banner"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${o("site.disabled")}</div>` : u}
      ${this._pills()}
      ${this.editing ? this._editList() : this.loads.length ? d`<div class="grid">
              ${this.loads.map((s, i) => {
      var a, r;
      return d`<sm-load-card .load=${s} .live=${(r = (a = this.live) == null ? void 0 : a.loads) == null ? void 0 : r[s.id]} .spark=${this.spark[s.id] ?? []} .priority=${i + 1}></sm-load-card>`;
    })}
              <button class="add" @click=${() => this._emit("add-load")}><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${o("loads.add")}</button>
            </div>` : d`<div class="placeholder"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><p>${o("loads.empty")}</p>
              <button class="filled" @click=${() => this._emit("add-load")}>${o("loads.add")}</button></div>`}
    `;
  }
};
Z.styles = [
  O,
  se,
  z`
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
ve([
  _({ attribute: !1 })
], Z.prototype, "hass", 2);
ve([
  _({ attribute: !1 })
], Z.prototype, "loads", 2);
ve([
  _({ attribute: !1 })
], Z.prototype, "live", 2);
ve([
  _({ attribute: !1 })
], Z.prototype, "spark", 2);
ve([
  _({ type: Boolean })
], Z.prototype, "editing", 2);
ve([
  b()
], Z.prototype, "_dragId", 2);
Z = ve([
  P("sm-dashboard")
], Z);
var Hs = Object.defineProperty, Bs = Object.getOwnPropertyDescriptor, Ee = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Bs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Hs(e, s, a), a;
};
let te = class extends w {
  constructor() {
    super(...arguments), this.heading = "", this.saveLabel = "", this.busy = !1, this.canSave = !0, this.error = "";
  }
  render() {
    return d`<div class="scrim" @click=${(t) => t.target === t.currentTarget && this._close()}>
      <div class="dlg" role="dialog" aria-modal="true" aria-label=${this.heading}>
        <h2>${this.heading}</h2>
        <div class="body"><slot></slot>${this.error ? d`<div class="err" role="alert">${this.error}</div>` : u}</div>
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
te.styles = [
  O,
  se,
  z`
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
  P("sm-dialog")
], te);
var Us = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, mt = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Vs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Us(e, s, a), a;
};
let We = class extends w {
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
We.styles = [
  O,
  z`
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
mt([
  _({ type: Boolean, reflect: !0 })
], We.prototype, "checked", 2);
mt([
  _({ type: Boolean, reflect: !0 })
], We.prototype, "disabled", 2);
We = mt([
  P("sm-toggle")
], We);
var Fs = Object.defineProperty, Gs = Object.getOwnPropertyDescriptor, Ve = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Gs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Fs(e, s, a), a;
};
let Zs = 0, me = class extends w {
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
    var n, c, l;
    const s = this._label(t);
    if (customElements.get("ha-entity-picker"))
      return d`<ha-entity-picker .hass=${this.hass} .label=${s} .value=${e ?? ""} allow-custom-entity
        .includeDomains=${t.domains} @value-changed=${(p) => this._emit(t.key, p.detail.value || null)}></ha-entity-picker>
        ${t.helper ? d`<span class="help">${t.helper}</span>` : u}`;
    const i = `sm-ents-${++Zs}`, a = e ? (c = (n = this.hass) == null ? void 0 : n.states) == null ? void 0 : c[e] : void 0, r = Object.values(((l = this.hass) == null ? void 0 : l.states) ?? {}).filter((p) => {
      var m;
      return !((m = t.domains) != null && m.length) || t.domains.includes(p.entity_id.split(".")[0]);
    }).sort((p, m) => p.entity_id.localeCompare(m.entity_id));
    return d`<label class="field">${s}
      <input list=${i} .value=${e ?? ""} placeholder="entity_id"
        @change=${(p) => this._emit(t.key, p.target.value.trim() || null)} />
      <datalist id=${i}>${r.map((p) => d`<option value=${p.entity_id}>${p.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${a ? d`<span class="ent-state">${a.attributes.friendly_name ?? ""}: ${a.state} ${a.attributes.unit_of_measurement ?? ""}</span>` : u}
      ${t.helper ? d`<span class="help">${t.helper}</span>` : u}
    </label>`;
  }
  _field(t) {
    const e = this.data;
    if (t.show && !t.show(e)) return u;
    const s = e[t.key], i = this._label(t);
    switch (t.kind) {
      case "entity":
        return d`<div>${this._entity(t, s)}</div>`;
      case "bool":
        return d`<div class="bool"><span class="txt">${i}${t.helper ? d`<span class="help">${t.helper}</span>` : u}</span>
          <sm-toggle .checked=${!!s} @change=${(a) => this._emit(t.key, a.detail.checked)}></sm-toggle></div>`;
      case "select":
        return d`<label class="field">${i}
          <select @change=${(a) => {
          const r = a.target.value;
          this._emit(t.key, typeof s == "number" ? Number(r) : r);
        }}>${(t.options ?? []).map((a) => d`<option value=${a.value} ?selected=${String(s) === a.value}>${a.label}</option>`)}</select>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
      case "number":
        return d`<label class="field">${i}
          <span class="wrap"><input type="number" step=${t.step ?? 1} .value=${s == null ? "" : String(s)}
            @change=${(a) => {
          const r = a.target.value;
          this._emit(t.key, r === "" ? t.nullable ? null : 0 : Number(r));
        }} />${t.unit ? d`<span class="unit">${t.unit}</span>` : u}</span>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
      case "multi": {
        const a = Array.isArray(s) ? s : [], r = t.options ?? [];
        return d`<div class="field multi"><span>${i}</span>
          ${r.length ? r.map((n) => d`<div class="bool"><span class="txt">${n.label}</span>
                <sm-toggle .checked=${a.includes(n.value)} @change=${(c) => this._emit(t.key, c.detail.checked ? [...a, n.value] : a.filter((l) => l !== n.value))}></sm-toggle></div>`) : d`<span class="help">${o("form.no_options")}</span>`}
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</div>`;
      }
      case "time":
        return d`<label class="field">${i}
          <input type="time" .value=${s ?? ""} @change=${(a) => this._emit(t.key, a.target.value)} /></label>`;
      default:
        return d`<label class="field">${i}
          <input type="text" .value=${s ?? ""} @change=${(a) => this._emit(t.key, a.target.value)} />
          ${t.helper ? d`<span class="help">${t.helper}</span>` : u}</label>`;
    }
  }
  render() {
    return d`${this.fields.map((t) => this._field(t))}`;
  }
};
me.styles = [
  O,
  z`
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
], me.prototype, "hass", 2);
Ve([
  _({ attribute: !1 })
], me.prototype, "fields", 2);
Ve([
  _({ attribute: !1 })
], me.prototype, "data", 2);
Ve([
  _()
], me.prototype, "prefix", 2);
me = Ve([
  P("sm-form")
], me);
var qs = Object.defineProperty, Ks = Object.getOwnPropertyDescriptor, I = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Ks(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && qs(e, s, a), a;
};
const H = (t) => t.type === "ev", W = (t) => H(t) && t.ev_driver === "tesla_ble_proxy", T = (t) => Le(t), Et = (t) => !Le(t), le = (t) => !H(t) && !T(t), zt = () => ["charge_positive", "discharge_positive"].map((t) => ({ value: t, label: o(`f.bat_sign.${t}`) })), Pe = (t) => t == null ? "–" : `${t}%`, Ge = (t) => Es(t ?? 0), R = (t, e) => {
  if (!e) return o("detail.not_set");
  const s = t.states[e];
  return s ? `${s.attributes.friendly_name ?? e}` : e;
}, Ys = (t, e) => {
  const s = e ? t.states[e] : void 0;
  return s ? s.state === "on" ? o("detail.on") : s.state === "off" ? o("detail.off") : s.state : "";
}, Ze = (t, e) => {
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
        title: o("detail.device"),
        rows: [
          {
            icon: "mdi:home-battery-outline",
            title: o("f.bat_soc_entity"),
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
            title: o("f.bat_power_entity"),
            show: T,
            secondary: (e) => `${R(t, e.bat_power_entity)} · ${o(`f.bat_sign.${e.bat_power_sign}`)}`,
            value: (e) => Ze(t, e.bat_power_entity),
            fields: [
              { key: "bat_power_entity", kind: "entity", domains: ["sensor"], helper: o("f.bat_power_entity.help") },
              { key: "bat_power_sign", kind: "select", options: zt() }
            ]
          },
          {
            icon: "mdi:tune-variant",
            title: o("detail.bat_control"),
            show: T,
            secondary: (e) => e.bat_setpoint_entity ? R(t, e.bat_setpoint_entity) : e.bat_charge_entity || e.bat_discharge_entity ? `${R(t, e.bat_charge_entity)} / ${R(t, e.bat_discharge_entity)}` : o("detail.not_set"),
            value: (e, s) => (s == null ? void 0 : s.setpoint_w) != null ? M(s.setpoint_w) : "",
            fields: [
              { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], helper: o("f.bat_setpoint_entity.help") },
              { key: "bat_setpoint_sign", kind: "select", options: zt(), show: (e) => !!e.bat_setpoint_entity },
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
            show: le,
            secondary: (e) => R(t, e.switch_entity),
            value: (e) => Ys(t, e.switch_entity),
            fields: [{ key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"] }]
          },
          {
            icon: "mdi:flash",
            title: o("f.nominal_power_w"),
            show: le,
            secondary: () => o("detail.nominal_help"),
            value: (e) => M(e.nominal_power_w),
            fields: [{ key: "nominal_power_w", kind: "number", unit: "W", step: 50 }, { key: "full_threshold_w", kind: "number", unit: "W" }]
          },
          {
            icon: "mdi:ev-plug-type2",
            title: o("f.ev_driver"),
            show: H,
            secondary: (e) => W(e) ? `${e.ev_proxy_url} · ${e.ev_vin || "VIN?"}` : R(t, e.ev_charge_switch_entity),
            value: (e) => o(`f.ev_driver.${e.ev_driver}`),
            fields: [
              { key: "ev_driver", kind: "select", options: ["entities", "tesla_ble_proxy"].map((e) => ({ value: e, label: o(`f.ev_driver.${e}`) })) },
              { key: "ev_proxy_url", kind: "text", show: W, helper: o("f.ev_proxy_url.help") },
              { key: "ev_vin", kind: "text", show: W },
              { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (e) => !W(e) },
              { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (e) => !W(e) },
              { key: "ev_plugged_entity", kind: "entity", domains: ["binary_sensor", "sensor"], show: (e) => !W(e) }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: o("detail.power_sensor"),
            show: Et,
            secondary: (e) => R(t, e.power_entity),
            value: (e) => Ze(t, e.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: o("f.power_entity.help") }]
          },
          {
            icon: "mdi:thermometer",
            title: o("detail.temp_sensor"),
            show: le,
            secondary: (e) => R(t, e.temperature_entity),
            value: (e) => e.max_temperature != null ? `${Ze(t, e.temperature_entity)} · max ${e.max_temperature} °C` : Ze(t, e.temperature_entity),
            fields: [
              { key: "temperature_entity", kind: "entity", domains: ["sensor"] },
              { key: "max_temperature", kind: "number", nullable: !0, unit: "°C" }
            ]
          },
          {
            icon: "mdi:battery-charging",
            title: o("f.ev_soc_entity"),
            show: H,
            secondary: (e) => e.ev_soc_entity ? R(t, e.ev_soc_entity) : W(e) ? o("detail.from_proxy") : o("detail.not_set"),
            value: (e, s) => (s == null ? void 0 : s.soc) != null ? `${Math.round(s.soc)}%` : "",
            fields: [
              { key: "ev_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "ev_charge_limit_entity", kind: "entity", domains: ["sensor", "number", "input_number"], show: (e) => !W(e) }
            ]
          }
        ]
      },
      {
        title: o("f.section.battery"),
        show: T,
        rows: [
          {
            icon: "mdi:battery-charging-high",
            title: o("detail.bat_power"),
            secondary: () => o("detail.bat_power_sub"),
            value: (e) => `↑ ${M(e.bat_max_charge_w)} · ↓ ${M(e.bat_max_discharge_w)}`,
            fields: [
              { key: "bat_max_charge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_max_discharge_w", kind: "number", unit: "W", step: 100 },
              { key: "bat_deadband_w", kind: "number", unit: "W", step: 10, helper: o("f.bat_deadband_w.help") }
            ]
          },
          {
            icon: "mdi:battery-10",
            title: o("detail.bat_limits"),
            secondary: (e) => o("detail.bat_limits_sub").replace("{min}", Pe(e.bat_min_soc)).replace("{max}", Pe(e.bat_max_soc)),
            value: (e) => `${Pe(e.bat_min_soc)} – ${Pe(e.bat_max_soc)}`,
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
            value: (e) => Pe(e.bat_peak_min_soc),
            fields: [{ key: "bat_peak_min_soc", kind: "number", unit: "%" }]
          }
        ]
      },
      {
        title: o("f.section.ev"),
        show: H,
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
            secondary: (e, s) => s != null && s.battery_kwh_learned ? o("detail.battery_learned").replace("{kwh}", `${s.battery_kwh_learned} kWh`) : (s == null ? void 0 : s.battery_kwh_source) === "car" && s.battery_kwh ? o("detail.battery_car").replace("{kwh}", `${s.battery_kwh} kWh`) : o("detail.battery_learning"),
            value: (e, s) => e.ev_battery_kwh ? `${e.ev_battery_kwh} kWh` : s != null && s.battery_kwh_learned ? `${s.battery_kwh_learned} kWh (${o("detail.learned")})` : "–",
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
        show: Et,
        rows: [
          {
            icon: "mdi:timer-play-outline",
            title: o("detail.start_stop"),
            secondary: (e) => o("detail.start_stop_sub").replace("{start}", Ge(e.start_delay_s)).replace("{stop}", Ge(e.stop_delay_s)),
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
            secondary: (e) => `${o("detail.on")} ${Ge(e.min_on_s)} · ${o("detail.off_short")} ${Ge(e.min_off_s)}`,
            fields: [
              { key: "min_on_s", kind: "number", unit: "s" },
              { key: "min_off_s", kind: "number", unit: "s" }
            ]
          },
          {
            icon: "mdi:transmission-tower-import",
            title: o("f.allowed_import_w"),
            secondary: () => o("detail.allowed_import_help"),
            value: (e) => M(e.allowed_import_w),
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
            secondary: (e) => T(e) ? o("detail.night_when_bat").replace("{soc}", String(e.bat_target_soc)) : H(e) && (e.ev_soc_entity || W(e)) ? o("detail.night_when_soc").replace("{soc}", String(e.ev_target_soc)) : e.night_min_temperature != null ? o("detail.night_when_temp").replace("{t}", String(e.night_min_temperature)) : o("detail.night_when_kwh").replace("{kwh}", String(e.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (e) => le(e) || H(e) && !(e.ev_soc_entity || W(e)) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: !0, show: le },
              { key: "bat_target_soc", kind: "number", unit: "%", show: T },
              { key: "ev_target_soc", kind: "number", unit: "%", show: H }
            ]
          },
          {
            icon: "mdi:battery-arrow-up-outline",
            title: o("detail.night_amount"),
            show: le,
            value: (e) => e.night_target_kwh ? x(e.night_target_kwh, 1) : o("detail.until_full"),
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
        title: o("f.section.legionella"),
        show: le,
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
      const e = await Vt(this.hass, { ...this.load, ...t });
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
    await fs(this.hass, this.load.id), this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _move(t) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta: t }, bubbles: !0, composed: !0 }));
  }
  _hero() {
    const t = this.load, e = this.live, [s, i] = qt(T(t) ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), a = T(t) && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", r = (e == null ? void 0 : e.reason) ?? "idle", n = De(r), c = t.icon || He(t.type), l = H(t) ? t.ev_max_current * 230 * t.ev_phases : T(t) ? Math.max(t.bat_max_charge_w, t.bat_max_discharge_w) : t.nominal_power_w, p = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null;
    return d`<div class="card hero">
      <div class="hero-head">
        <div class="hero-ic ${e != null && e.is_on && ((e == null ? void 0 : e.power_w) ?? 0) > 1 ? "active" : ""}"><ha-icon .icon=${c}></ha-icon></div>
        <div>
          <div class="hero-name">${t.name}
            <button class="icon" title=${o("load.edit")} @click=${() => this._openDialog(o("detail.name_icon"), [
      { key: "name", kind: "text" },
      { key: "icon", kind: "text", helper: o("f.icon.help") }
    ])}><ha-icon icon="mdi:pencil"></ha-icon></button>
          </div>
          <div class="hero-sub"><span class="status ${n}">${o(`reason.${r}`)}</span> · ${o(`type.${t.type}`)}</div>
        </div>
      </div>
      <div class="big">${a ? d`<ha-icon class="dir" .icon=${a}></ha-icon>` : u}<span class="v">${s}</span><span class="u">${i}</span></div>
      <sm-sparkline .points=${this.spark} .max=${l} .height=${90} .label=${o("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : u}
        ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : u}
        ${(e == null ? void 0 : e.current_a) != null && H(t) ? d`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(e.current_a)} A</span>` : u}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${x((e == null ? void 0 : e.kwh_today) ?? 0, 1)} ${T(t) ? o("load.charged_today") : o("load.today")}</span>
        ${T(t) ? d`<span><ha-icon icon="mdi:home-export-outline"></ha-icon>${x((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${o("load.discharged")}</span>` : u}
        ${p !== null ? d`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(p * 100)}% ${o("load.from_solar")}</span>` : u}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${o("f.mode")}</div>
        <sm-segmented .options=${Kt(t.type)} .value=${t.mode}
          @value-changed=${(m) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: m.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
        <div class="d">${o(`${ut(t.mode, t.type)}.desc`)}</div>
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
    if (t.show && !t.show(e)) return u;
    const s = t.rows.filter((i) => !i.show || i.show(e));
    return d`<div class="card list">
      <div class="card-head"><h2>${t.title}</h2>${t.meta && t.meta(e) ? d`<span class="meta">${t.meta(e)}</span>` : u}</div>
      ${s.map(
      (i) => {
        var a, r, n;
        return i.toggle ? d`<sm-list-row .icon=${i.icon} .heading=${i.title} .secondary=${((a = i.secondary) == null ? void 0 : a.call(i, e, this.live)) ?? ""}>
              <sm-toggle .checked=${!!e[i.toggle]} @change=${(c) => this._save({ [i.toggle]: c.detail.checked })}></sm-toggle>
            </sm-list-row>` : d`<sm-list-row .icon=${i.icon} .heading=${i.title} .secondary=${((r = i.secondary) == null ? void 0 : r.call(i, e, this.live)) ?? ""} .value=${((n = i.value) == null ? void 0 : n.call(i, e, this.live)) ?? ""}
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
          </sm-dialog>` : u}
    `;
  }
};
L.styles = [
  O,
  se,
  z`
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
  P("sm-load-detail")
], L);
var Js = Object.defineProperty, Xs = Object.getOwnPropertyDescriptor, fe = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Xs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Js(e, s, a), a;
};
const Pt = { DEBUG: 10, INFO: 20, WARNING: 30, ERROR: 40, CRITICAL: 50 }, Ot = (t) => {
  const e = new Date(t * 1e3), s = (i, a = 2) => String(i).padStart(a, "0");
  return `${s(e.getDate())}/${s(e.getMonth() + 1)} ${s(e.getHours())}:${s(e.getMinutes())}:${s(e.getSeconds())}`;
};
let q = class extends w {
  constructor() {
    super(...arguments), this._data = null, this._level = "all", this._query = "", this._msg = "", this._auto = !0, this._load = () => this._run(() => ws(this.hass));
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
    const t = this._level === "all" ? 0 : Pt[this._level] ?? 0, e = this._query.trim().toLowerCase();
    return (((s = this._data) == null ? void 0 : s.entries) ?? []).filter((i) => (Pt[i.level] ?? 0) >= t).filter((i) => !e || i.message.toLowerCase().includes(e) || i.source.toLowerCase().includes(e)).reverse();
  }
  async _copy() {
    const t = this._filtered().slice().reverse().map((e) => `${Ot(e.ts)} ${e.level} [${e.source}] ${e.message}`).join(`
`);
    try {
      await navigator.clipboard.writeText(t), this._msg = o("logs.copied");
    } catch {
      this._msg = o("logs.copy_failed");
    }
    window.setTimeout(() => this._msg = "", 3e3);
  }
  render() {
    var s, i;
    const t = this._filtered(), e = ((s = this._data) == null ? void 0 : s.entries.length) ?? 0;
    return d`
      <div class="row">
        <div class="grow">
          <div class="lbl">${o("logs.verbose")}</div>
          <div class="help">${o("logs.verbose.help")}</div>
        </div>
        <sm-toggle ?checked=${((i = this._data) == null ? void 0 : i.verbose) ?? !1}
          @change=${(a) => this._run(() => ks(this.hass, a.detail.checked))}></sm-toggle>
      </div>
      <div class="row">
        <sm-segmented size="sm" .value=${this._level}
          .options=${["all", "INFO", "WARNING", "ERROR"].map((a) => ({ value: a, label: o(`logs.level.${a}`) }))}
          @value-changed=${(a) => {
      a.stopPropagation(), this._level = a.detail.value;
    }}></sm-segmented>
        <input class="search" type="search" placeholder=${o("logs.search")} .value=${this._query}
          @input=${(a) => this._query = a.target.value} />
      </div>
      <div class="row actions">
        <button class="text" @click=${this._load}>${o("logs.refresh")}</button>
        <button class="text" ?disabled=${!t.length} @click=${this._copy}>${o("logs.copy")}</button>
        <button class="text" ?disabled=${!e} @click=${() => this._run(() => xs(this.hass))}>${o("logs.clear")}</button>
        <label class="help"><input type="checkbox" .checked=${this._auto}
          @change=${(a) => this._auto = a.target.checked} /> ${o("logs.auto")}</label>
        <span class="muted">${this._msg || o("logs.count").replace("{n}", String(t.length)).replace("{t}", String(e))}</span>
      </div>
      <div class="log">
        ${t.length ? t.map(
      (a) => d`<div class="e"><span class="ts">${Ot(a.ts)}</span><span class="lv ${a.level}">${a.level}</span>
                <span class="m"><span class="src">[${a.source}]</span> ${a.message}</span></div>`
    ) : d`<div class="empty">${this._data ? o("logs.empty") : o("logs.loading")}</div>`}
      </div>
    `;
  }
};
q.styles = [
  O,
  se,
  z`
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
fe([
  _({ attribute: !1 })
], q.prototype, "hass", 2);
fe([
  b()
], q.prototype, "_data", 2);
fe([
  b()
], q.prototype, "_level", 2);
fe([
  b()
], q.prototype, "_query", 2);
fe([
  b()
], q.prototype, "_msg", 2);
fe([
  b()
], q.prototype, "_auto", 2);
q = fe([
  P("sm-logs")
], q);
var Qs = Object.defineProperty, ea = Object.getOwnPropertyDescriptor, ae = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ea(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Qs(e, s, a), a;
};
const ta = ["measure", "control", "info", "system"], Ke = (t) => t == null ? "–" : `${t.toFixed(1)} kWh`, Ct = (t) => !!(t.forecast_ev_priority || t.forecast_ev_floor_pause), jt = (t, e) => e.map((s) => ({ value: s, label: o(`s.${t}.${s}`) })), ot = (t, e) => {
  var s;
  return e ? ((s = t.states[e]) == null ? void 0 : s.attributes.friendly_name) ?? e : o("detail.not_set");
}, sa = (t) => {
  var e;
  return Object.keys(((e = t.services) == null ? void 0 : e.notify) ?? {}).filter((s) => !["send_message", "persistent_notification"].includes(s)).sort((s, i) => Number(i.startsWith("mobile_app_")) - Number(s.startsWith("mobile_app_")) || s.localeCompare(i)).map((s) => ({
    value: `notify.${s}`,
    label: s.startsWith("mobile_app_") ? `📱 ${s.slice(11).replace(/_/g, " ")}` : s.replace(/_/g, " ")
  }));
}, aa = (t) => [
  // Meten
  {
    id: "meter",
    group: "measure",
    icon: "mdi:meter-electric-outline",
    fields: [
      { key: "grid_mode", kind: "select", options: jt("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: jt("grid_sign", ["import_positive", "export_positive"]), show: (e) => e.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" }
    ],
    summary: (e, s) => ot(s, e.grid_mode === "split" ? e.grid_import_entity : e.grid_power_entity)
  },
  {
    id: "pv",
    group: "measure",
    icon: "mdi:solar-power-variant",
    fields: [{ key: "pv_power_entity", kind: "entity", domains: ["sensor"], helper: o("s.pv_power_entity.help") }],
    summary: (e, s) => ot(s, e.pv_power_entity)
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
      { key: "forecast_factor_pct", kind: "number", unit: "%", step: 5, helper: o("s.forecast_factor_pct.help"), show: Ct },
      { key: "forecast_house_kwh", kind: "number", unit: "kWh", step: 0.5, helper: o("s.forecast_house_kwh.help"), show: Ct }
    ],
    summary: (e, s, i) => {
      const a = i == null ? void 0 : i.forecast;
      return (a == null ? void 0 : a.remaining_kwh) != null ? o("s.forecast.summary").replace("{kwh}", Ke(a.remaining_kwh)) : e.pv_forecast_remaining_entity || e.pv_forecast_today_entity ? ot(s, e.pv_forecast_remaining_entity || e.pv_forecast_today_entity) : o("detail.not_set");
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
      { key: "notify_services", kind: "multi", options: sa(t), helper: o("s.notify_services.help") },
      { key: "notify_peak", kind: "bool", helper: o("s.notify_peak.help") },
      { key: "notify_ev", kind: "bool", helper: o("s.notify_ev.help") },
      { key: "notify_faults", kind: "bool", helper: o("s.notify_faults.help") }
    ],
    summary: (e) => {
      const s = (e.notify_services ?? []).length;
      return s ? o("s.notify.summary").replace("{n}", String(s)) : o("detail.off");
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
let B = class extends w {
  constructor() {
    super(...arguments), this.site = {}, this.narrow = !1, this._cat = null, this._draft = {}, this._testMsg = "";
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings }), this._cat === null && !this.narrow && (this._cat = "meter");
  }
  async _change(t, e) {
    this._draft = { ...this._draft, [t]: e }, this.dispatchEvent(new CustomEvent("saving", { bubbles: !0, composed: !0 }));
    try {
      await vs(this.hass, { [t]: e }), this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
    } catch (s) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: (s == null ? void 0 : s.message) ?? String(s) }, bubbles: !0, composed: !0 }));
    }
  }
  async _test() {
    this._testMsg = "";
    try {
      await $s(this.hass), this._testMsg = o("s.notify.test_sent");
    } catch (t) {
      this._testMsg = (t == null ? void 0 : t.message) ?? String(t);
    }
  }
  /** What the forecast planning decides right now. */
  _plan() {
    var s;
    const t = (s = this.site) == null ? void 0 : s.forecast;
    if (!t || t.remaining_kwh == null) return d`<div class="plan">${o("s.plan.none")}</div>`;
    const e = (i) => d`<b class=${i ? "on" : ""}>${o(i ? "s.plan.yes" : "s.plan.no")}</b>`;
    return d`<div class="plan">
      ${o("s.plan.remaining")} <b>${Ke(t.remaining_kwh)}</b>, ${o("s.plan.usable")} <b>${Ke(t.usable_kwh)}</b><br />
      ${o("s.plan.boilers")} <b>${Ke(t.boiler_need_kwh)}</b><br />
      ${this._draft.forecast_ev_priority ? d`${o("s.plan.ev_first")} ${e(t.ev_first)}<br />` : ""}
      ${this._draft.forecast_ev_floor_pause ? d`${o("s.plan.floor_paused")} ${e(t.ev_floor_paused)}` : ""}
    </div>`;
  }
  render() {
    const t = aa(this.hass), e = t.find((a) => a.id === this._cat), s = !this.narrow || !e, i = !!e;
    return d`<div class="md ${this.narrow ? "single" : ""}">
      ${s ? d`<div class="card nav">
            ${ta.map(
      (a, r) => d`${r ? d`<hr />` : ""}<div class="group">${o(`s.group.${a}`)}</div>
                ${t.filter((n) => n.group === a).map(
        (n) => d`<sm-list-row class=${n.id === this._cat && !this.narrow ? "sel" : ""} .icon=${n.icon} .heading=${o(`s.cat.${n.id}`)}
                    .secondary=${n.summary(this._draft, this.hass, this.site ?? {})} clickable @row-click=${() => this._cat = n.id}></sm-list-row>`
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
                    @value-changed=${(a) => this._change(a.detail.key, a.detail.value)}></sm-form>`}
              ${e.id === "notify" ? d`<div class="test"><button class="text" ?disabled=${!(this._draft.notify_services ?? []).length}
                    @click=${this._test}>${o("s.notify.test")}</button><span>${this._testMsg}</span></div>` : ""}
            </div>
          </div>` : ""}
    </div>`;
  }
};
B.styles = [
  O,
  se,
  z`
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
ae([
  _({ attribute: !1 })
], B.prototype, "hass", 2);
ae([
  _({ attribute: !1 })
], B.prototype, "settings", 2);
ae([
  _({ attribute: !1 })
], B.prototype, "site", 2);
ae([
  _({ type: Boolean })
], B.prototype, "narrow", 2);
ae([
  b()
], B.prototype, "_cat", 2);
ae([
  b()
], B.prototype, "_draft", 2);
ae([
  b()
], B.prototype, "_testMsg", 2);
B = ae([
  P("sm-settings")
], B);
var ia = Object.defineProperty, oa = Object.getOwnPropertyDescriptor, K = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? oa(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && ia(e, s, a), a;
};
const J = 1e3, k = 64, F = 16, Lt = 18, rt = 14, Dt = 12, ra = (t) => {
  const e = Math.pow(10, Math.floor(Math.log10(t))), s = t / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 2.5 ? 2.5 : s <= 5 ? 5 : 10) * e;
}, lt = (t, e) => e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
let Ae = class extends w {
  constructor() {
    super(...arguments), this.x = [], this.panels = [], this._hover = null;
  }
  render() {
    var N, S;
    const t = this.x.length;
    if (t < 2) return d`<slot></slot>`;
    const e = this.x[0], s = this.x[t - 1], i = (v) => k + (v - e) / Math.max(1, s - e) * (J - k - F);
    let a = 0;
    const r = [], n = [];
    for (const v of this.panels) {
      const $ = a + Lt, be = v.height;
      n.push([$, be]), r.push(A`<text class="ptitle" x="${k}" y="${a + 12}">${v.title}</text>`), r.push(A`<rect class="plot" x="${k}" y="${$}" width="${J - k - F}" height="${be}" rx="2"></rect>`), (N = v.series) != null && N.length && r.push(this._series(v, $, be, i)), (S = v.bands) != null && S.length && v.bands.forEach((ye, oe) => {
        const Y = $ + 4 + oe * (Dt + 4);
        r.push(A`<text class="axis" x="${k - 8}" y="${Y + 10}" text-anchor="end">${ye.label}</text>`), ye.segments.forEach(
          (V) => r.push(A`<rect x="${i(V.from)}" y="${Y}" width="${Math.max(1, i(V.to) - i(V.from))}" height="${Dt}" fill="${V.color}" rx="2"><title>${V.title}</title></rect>`)
        );
      }), a = $ + be + rt;
    }
    const c = s - e, l = c <= 1.5 * 86400 ? 3 * 3600 : c <= 8 * 86400 ? 86400 : 7 * 86400, p = [], m = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
    for (let v = Math.ceil((e - m) / l) * l + m; v <= s; v += l) p.push(v);
    const h = (v) => {
      const $ = new Date(v * 1e3);
      return l < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { weekday: "short", day: "numeric" });
    }, f = a - rt + 16, g = f + 6;
    p.forEach((v) => {
      r.push(A`<line class="gridline" x1="${i(v)}" x2="${i(v)}" y1="${Lt}" y2="${a - rt}" stroke-dasharray="2 4"></line>`), r.push(A`<text class="axis" x="${i(v)}" y="${f}" text-anchor="middle">${h(v)}</text>`);
    });
    const y = this._hover;
    y !== null && n.forEach(
      ([v, $]) => r.push(A`<line x1="${i(this.x[y])}" x2="${i(this.x[y])}" y1="${v}" y2="${v + $}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`)
    );
    const D = (v) => {
      const $ = v.currentTarget.getBoundingClientRect(), be = (v.clientX - $.left) / $.width * J, ye = e + (be - k) / (J - k - F) * (s - e);
      let oe = 0, Y = t - 1;
      for (; Y - oe > 1; ) {
        const V = oe + Y >> 1;
        this.x[V] < ye ? oe = V : Y = V;
      }
      this._hover = Math.abs(this.x[oe] - ye) < Math.abs(this.x[Y] - ye) ? oe : Y;
    }, j = this.panels.flatMap((v) => (v.series ?? []).map(($) => ({ ...$, unit: $.unit ?? v.unit })));
    return d`
      <svg viewBox="0 0 ${J} ${g}" @mousemove=${D} @mouseleave=${() => this._hover = null}>${r}</svg>
      ${y !== null ? d`<div class="tip" style="${i(this.x[y]) > J / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[y] * 1e3).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${j.map((v) => {
      const $ = v.values[y];
      return $ == null ? u : d`<div><span class="dot" style="background:${v.color}"></span>${v.label}: ${lt($, v.unit)}</div>`;
    })}
          </div>` : u}
      <div class="legend">
        ${j.filter((v) => v.legend !== !1).map((v) => d`<span><span class="dot" style="background:${v.color}"></span>${v.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }
  _series(t, e, s, i) {
    const a = this.x.length, r = {}, n = [], c = [];
    for (const g of t.series)
      if (g.kind === "area" && g.stack) {
        const y = r[g.stack] ?? new Array(a).fill(0), D = y.map((j, N) => j + Math.max(0, g.values[N] ?? 0));
        c.push(y), n.push(D), r[g.stack] = D;
      } else
        c.push(new Array(a).fill(0)), n.push(g.values.map((y) => y ?? 0));
    let l = -1 / 0, p = 1 / 0;
    t.series.forEach((g, y) => {
      for (let D = 0; D < a; D++) {
        const j = g.values[D];
        j != null && (l = Math.max(l, g.kind === "area" ? n[y][D] : j), p = Math.min(p, g.kind === "area" ? 0 : j));
      }
    }), l === -1 / 0 && (l = 1, p = 0), t.zero !== !1 && (p = Math.min(p, 0), l = Math.max(l, 0));
    const m = ra((l - p) / 3 || 1);
    l = Math.ceil((l + (l - p) * 0.04) / m) * m, p = Math.floor(p / m) * m;
    const h = (g) => e + s - (g - p) / (l - p) * s, f = [];
    for (let g = p; g <= l + m / 2; g += m)
      f.push(A`<line class="gridline" x1="${k}" x2="${J - F}" y1="${h(g)}" y2="${h(g)}"></line>
        <text class="axis" x="${k - 8}" y="${h(g) + 4}" text-anchor="end">${lt(g, t.unit)}</text>`);
    return p < 0 && f.push(A`<line x1="${k}" x2="${J - F}" y1="${h(0)}" y2="${h(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`), t.series.forEach((g, y) => {
      if (g.kind === "area") {
        let N = "";
        for (let S = 0; S < a; S++) N += `${S ? "L" : "M"}${i(this.x[S]).toFixed(1)},${h(n[y][S]).toFixed(1)}`;
        for (let S = a - 1; S >= 0; S--) N += `L${i(this.x[S]).toFixed(1)},${h(c[y][S]).toFixed(1)}`;
        f.push(A`<path d="${N}Z" fill="${g.color}" fill-opacity="0.45" stroke="${g.color}" stroke-width="1"></path>`);
        return;
      }
      let D = "", j = !1;
      for (let N = 0; N < a; N++) {
        const S = g.values[N];
        if (S == null) {
          j = !1;
          continue;
        }
        const v = i(this.x[N]).toFixed(1), $ = h(S).toFixed(1);
        g.kind === "step" && j ? D += `H${v}V${$}` : D += `${j ? "L" : "M"}${v},${$}`, j = !0;
      }
      f.push(A`<path d="${D}" fill="none" stroke="${g.color}" stroke-width="1.8" stroke-dasharray="${g.dashed ? "5 4" : ""}"></path>`);
    }), f;
  }
};
Ae.styles = [
  O,
  z`
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
], Ae.prototype, "x", 2);
K([
  _({ attribute: !1 })
], Ae.prototype, "panels", 2);
K([
  b()
], Ae.prototype, "_hover", 2);
Ae = K([
  P("sm-chart")
], Ae);
let _e = class extends w {
  constructor() {
    super(...arguments), this.bars = [], this.height = 180, this.unit = "kWh", this.limit = null;
  }
  render() {
    if (!this.bars.length) return d`<slot></slot>`;
    const t = this.height, e = t - 26, s = (l) => l.parts.reduce((p, m) => p + m.value, 0), i = Math.max(this.limit ?? 0, ...this.bars.map(s), 1e-3) * 1.1, a = 640, r = (a - k - F) / this.bars.length, n = (l) => e - l / i * e, c = Math.ceil(this.bars.length / 10);
    return d`<svg viewBox="0 0 ${a} ${t}">
      <rect class="plot" x="${k}" y="0" width="${a - k - F}" height="${e}" rx="2"></rect>
      ${[0, 1, 2, 3].map((l) => {
      const p = i / 1.1 * (l / 3);
      return A`<line class="gridline" x1="${k}" x2="${a - F}" y1="${n(p)}" y2="${n(p)}"></line>
          <text class="axis" x="${k - 8}" y="${n(p) + 4}" text-anchor="end">${lt(p, this.unit)}</text>`;
    })}
      ${this.bars.map((l, p) => {
      let m = 0;
      const h = k + p * r + r * 0.18;
      return A`${l.parts.map((f) => {
        const g = n(m);
        m += f.value;
        const y = n(m);
        return A`<rect x="${h}" width="${r * 0.64}" y="${y}" height="${Math.max(0, g - y)}" fill="${f.color}" rx="2"><title>${l.label}: ${f.title}</title></rect>`;
      })}${p % c === 0 ? A`<text class="axis" x="${h + r * 0.32}" y="${t - 6}" text-anchor="middle">${l.label}</text>` : u}`;
    })}
      ${this.limit ? A`<line x1="${k}" x2="${a - F}" y1="${n(this.limit)}" y2="${n(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : u}
    </svg>`;
  }
};
_e.styles = [
  O,
  z`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `
];
K([
  _({ attribute: !1 })
], _e.prototype, "bars", 2);
K([
  _({ type: Number })
], _e.prototype, "height", 2);
K([
  _()
], _e.prototype, "unit", 2);
K([
  _({ type: Number })
], _e.prototype, "limit", 2);
_e = K([
  P("sm-bars")
], _e);
var na = Object.defineProperty, la = Object.getOwnPropertyDescriptor, ie = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? la(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && na(e, s, a), a;
};
const Oe = "var(--sm-solar)", we = "var(--sm-grid)", Nt = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)"
}, da = (t) => {
  const e = /* @__PURE__ */ new Date(), s = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() / 1e3, i = e.getTime() / 1e3;
  switch (t) {
    case "yesterday":
      return [s - 86400, s];
    case "7d":
      return [s - 6 * 86400, i];
    case "30d":
      return [s - 29 * 86400, i];
    case "month":
      return [new Date(e.getFullYear(), e.getMonth(), 1).getTime() / 1e3, i];
    default:
      return [s, i];
  }
};
let U = class extends w {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this.peakLimit = null, this._range = "today", this._data = null, this._loading = !1, this._loadedFor = "";
  }
  updated(t) {
    const e = `${this.loadId}|${this._range}`;
    (t.has("loadId") || t.has("hass")) && this.hass && e !== this._loadedFor && this._fetch();
  }
  async _fetch() {
    this._loadedFor = `${this.loadId}|${this._range}`, this._loading = !0;
    const [t, e] = da(this._range);
    try {
      this._data = await Gt(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _downsample(t) {
    if (t.length <= 1200) return t;
    const s = Math.ceil(t.length / 1200), i = [];
    for (let a = 0; a < t.length; a += s) {
      const r = t.slice(a, a + s), n = (p) => {
        const m = r.map(p).filter((h) => h != null);
        return m.length ? m.reduce((h, f) => h + f, 0) / m.length : null;
      }, c = r[r.length - 1], l = {};
      for (const p of Object.keys(c[3]))
        l[p] = [n((m) => {
          var h;
          return (h = m[3][p]) == null ? void 0 : h[0];
        }), n((m) => {
          var h;
          return (h = m[3][p]) == null ? void 0 : h[1];
        }), c[3][p][2], r.some((m) => {
          var h;
          return (h = m[3][p]) == null ? void 0 : h[3];
        }) ? 1 : 0, n((m) => {
          var h;
          return (h = m[3][p]) == null ? void 0 : h[4];
        })];
      i.push([r[0][0], n((p) => p[1]), n((p) => p[2]), l]);
    }
    return i;
  }
  _band(t, e, s) {
    var r;
    const i = [];
    let a = null;
    for (let n = 0; n < t.length; n++) {
      const c = t[n][3][e], l = c ? c[2] : null, p = l ? De(l) : "", h = l && (c[3] || l === "peak_guard") && p ? Nt[p] : null, f = l ? o(`reason.${l}`) : "", g = ((r = t[n + 1]) == null ? void 0 : r[0]) ?? t[n][0] + 60;
      h && a && a.color === h && a.title === f ? a.to = g : (a && i.push(a), a = h ? { from: t[n][0], to: g, color: h, title: f } : null);
    }
    return a && i.push(a), { label: s, segments: i };
  }
  _history() {
    var i, a;
    const t = this._downsample(((a = (i = this._data) == null ? void 0 : i.timeline) == null ? void 0 : a.rows) ?? []);
    if (t.length < 2) return d`<div class="empty">${o("a.no_data")}</div>`;
    const e = t.map((r) => r[0]), s = [];
    if (this.loadId) {
      const r = this.loadId, n = this.loads.find((l) => l.id === r), c = [
        { label: o("a.from_solar"), color: Oe, kind: "area", stack: "l", values: t.map((l) => {
          var p;
          return ((p = l[3][r]) == null ? void 0 : p[1]) ?? 0;
        }) },
        { label: o("a.from_grid"), color: we, kind: "area", stack: "l", values: t.map((l) => {
          var p, m;
          return Math.max(0, (((p = l[3][r]) == null ? void 0 : p[0]) ?? 0) - (((m = l[3][r]) == null ? void 0 : m[1]) ?? 0));
        }) },
        ...(n == null ? void 0 : n.type) === "battery" ? [{ label: o("a.discharged"), color: "var(--sm-ok)", kind: "area", stack: "d", values: t.map((l) => {
          var p;
          return Math.max(0, -(((p = l[3][r]) == null ? void 0 : p[0]) ?? 0));
        }) }] : [],
        { label: o("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: t.map((l) => l[1]) }
      ];
      if (s.push({ title: `${o("a.power")} (W)`, unit: "W", height: 220, series: c }), t.some((l) => {
        var p;
        return ((p = l[3][r]) == null ? void 0 : p[4]) != null;
      })) {
        const l = (n == null ? void 0 : n.type) === "ev" || (n == null ? void 0 : n.type) === "battery";
        s.push({
          title: l ? `${o("a.soc")} (%)` : `${o("a.temperature")} (°C)`,
          unit: l ? "%" : "°C",
          height: 90,
          zero: !1,
          series: [{ label: o(l ? "a.soc" : "a.temperature"), color: "var(--sm-err)", kind: "line", values: t.map((p) => {
            var m;
            return ((m = p[3][r]) == null ? void 0 : m[4]) ?? null;
          }) }]
        });
      }
      s.push({ title: o("a.why"), unit: "", height: 22, bands: [this._band(t, r, "")] });
    } else {
      const r = this.loads.map((n, c) => ({
        label: n.name,
        color: $e[c % $e.length],
        kind: "area",
        stack: "loads",
        values: t.map((l) => {
          var p;
          return Math.max(0, ((p = l[3][n.id]) == null ? void 0 : p[0]) ?? 0);
        })
      }));
      r.push({ label: o("a.pv"), color: Oe, kind: "line", values: t.map((n) => n[1]) }), s.push({ title: `${o("a.power")} (W)`, unit: "W", height: 220, series: r }), s.push({
        title: `${o("site.grid")} (W) · + ${o("a.import").toLowerCase()} / − ${o("a.export").toLowerCase()}`,
        unit: "W",
        height: 90,
        series: [{ label: o("site.grid"), color: we, kind: "line", values: t.map((n) => n[2]) }]
      }), s.push({
        title: o("a.why"),
        unit: "",
        height: this.loads.length * 16 + 6,
        bands: this.loads.map((n) => this._band(t, n.id, n.name.length > 9 ? n.name.slice(0, 8) + "…" : n.name))
      });
    }
    return d`<sm-chart .x=${e} .panels=${s}></sm-chart>`;
  }
  _tile(t, e, s) {
    return d`<div class="tile"><div class="v">${t}</div><div class="l">${e}</div>
      ${s ? d`<div class="bar"><div style="width:${s[0] * 100}%;background:${Oe}"></div><div style="width:${s[1] * 100}%;background:${we}"></div></div>` : u}</div>`;
  }
  _summary() {
    var s;
    const t = (s = this._data) == null ? void 0 : s.summary;
    if (!t) return u;
    if (this.loadId) {
      const i = t.loads[this.loadId];
      if (!i) return d`<div class="empty">${o("a.no_data")}</div>`;
      const a = i.solar_share ?? 0, r = this.loads.find((c) => c.id === this.loadId);
      if ((r == null ? void 0 : r.type) === "battery") {
        const c = r.bat_capacity_kwh || 0;
        return d`<div class="tiles">
          ${this._tile(x(i.kwh), o("a.charged"), i.kwh > 0 ? [a, 1 - a] : void 0)}
          ${this._tile(ne(i.solar_share), o("a.solar_share"))}
          ${this._tile(x(i.discharge_kwh ?? 0), o("a.discharged"))}
          ${this._tile(ne(i.efficiency ?? null), o("a.efficiency"))}
          ${this._tile(c ? ((i.discharge_kwh ?? 0) / c).toFixed(1) : "–", o("a.cycles"))}
          ${this._tile(it(i.saving), o("a.saving"))}
        </div>`;
      }
      const n = Object.entries(i.reasons ?? {}).filter(([c]) => De(c)).sort((c, l) => l[1] - c[1]);
      return d`<div class="tiles">
          ${this._tile(x(i.kwh), o("a.energy"), i.kwh > 0 ? [a, 1 - a] : void 0)}
          ${this._tile(ne(i.solar_share), o("a.solar_share"))}
          ${this._tile(x(i.grid_kwh), o("a.grid"))}
          ${this._tile(at(i.runtime_s), o("a.runtime"))}
          ${this._tile(String(i.starts), o("a.starts"))}
          ${this._tile(it(i.saving), o("a.saving"))}
        </div>
        ${n.length ? d`<div class="why">${n.map(([c, l]) => d`<span class="pill"><span class="swatch" style="background:${Nt[De(c)]}"></span>${o(`reason.${c}`)} <b>${at(l)}</b></span>`)}</div>` : u}`;
    }
    const e = t.house;
    return d`<div class="tiles">
        ${this._tile(x(e.pv_kwh, 1), o("a.pv"))}
        ${this._tile(ne(e.self_consumption), o("a.self_consumption"))}
        ${this._tile(ne(e.self_sufficiency), o("a.self_sufficiency"))}
        ${this._tile(x(e.import_kwh, 1), o("a.import"))}
        ${this._tile(x(e.export_kwh, 1), o("a.export"))}
        ${this._tile(M(e.peak_w), o("a.peak"))}
      </div>
      <table>
        <tr><th>${o("a.distribution")}</th><th class="num">${o("a.energy")}</th><th class="num">${o("a.solar_share")}</th><th class="num">${o("a.runtime")}</th><th class="num">${o("a.saving")}</th></tr>
        ${this.loads.map((i, a) => {
      const r = t.loads[i.id];
      return r ? d`<tr><td><span class="swatch" style="background:${$e[a % $e.length]}"></span>${i.name}</td>
            <td class="num">${x(r.kwh)}</td><td class="num">${ne(r.solar_share)}</td><td class="num">${at(r.runtime_s)}</td><td class="num">${it(r.saving)}</td></tr>` : u;
    })}
      </table>`;
  }
  _daily() {
    var i;
    const t = ((i = this._data) == null ? void 0 : i.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return u;
    const s = e.map((a) => {
      const r = `${Number(a.slice(8))}/${Number(a.slice(5, 7))}`;
      if (this.loadId) {
        const n = t[a].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label: r, parts: [
          { value: n.solar_kwh, color: Oe, title: `${o("a.solar")} ${x(n.solar_kwh)}` },
          { value: Math.max(0, n.kwh - n.solar_kwh), color: we, title: `${o("a.grid")} ${x(n.kwh - n.solar_kwh)}` }
        ] };
      }
      return { label: r, parts: this.loads.map((n, c) => {
        var p;
        const l = ((p = t[a].loads[n.id]) == null ? void 0 : p.kwh) ?? 0;
        return { value: l, color: $e[c % $e.length], title: `${n.name} ${x(l)}` };
      }) };
    });
    return d`<div class="card"><div class="card-head"><h2>${o("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${s}></sm-bars></div></div>`;
  }
  _rhythm() {
    var s, i;
    if (!this.loadId) return u;
    const t = ((i = (s = this._data) == null ? void 0 : s.rhythm) == null ? void 0 : i[this.loadId]) ?? [];
    if (!t.some((a) => a > 0)) return u;
    const e = t.map((a, r) => ({ label: `${r}u`, parts: [{ value: a, color: Oe, title: M(a) }] }));
    return d`<div class="card"><div class="card-head"><h2>${o("a.rhythm")}</h2><span class="meta">${o("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div></div>`;
  }
  _quarters() {
    var a;
    if (this.loadId) return u;
    const t = ((a = this._data) == null ? void 0 : a.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return u;
    const s = this.peakLimit, i = e.length === 1 ? t[e[0]].map(([r, n]) => ({
      label: new Date(r * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: n, color: s && n > s ? "var(--sm-err)" : we, title: M(n) }]
    })) : e.map((r) => {
      const n = Math.max(...t[r].map((c) => c[1]));
      return { label: `${Number(r.slice(8))}/${Number(r.slice(5, 7))}`, parts: [{ value: n, color: s && n > s ? "var(--sm-err)" : we, title: M(n) }] };
    });
    return d`<div class="card"><div class="card-head"><h2>${o("a.quarters")}</h2><span class="meta">${o("site.peak_limit")} ${M(s)}</span></div>
      <div class="card-body"><sm-bars .bars=${i} unit="W" .limit=${s}></sm-bars></div></div>`;
  }
  _sessions() {
    var i;
    const t = this.loadId ? this.loads.find((a) => a.id === this.loadId) : null;
    if (!t || t.type !== "ev") return u;
    const e = [...((i = this._data) == null ? void 0 : i.sessions) ?? []].reverse();
    if (!e.length) return u;
    const s = (a) => a ? new Date(a * 1e3).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : o("a.ongoing");
    return d`<div class="card"><div class="card-head"><h2>${o("a.sessions")}</h2><span class="meta">${e.length}</span></div>
      <table>
        <tr><th>${o("a.start")}</th><th>${o("a.end")}</th><th class="num">${o("a.energy")}</th><th class="num">${o("a.solar_share")}</th><th class="num">${o("a.soc")}</th></tr>
        ${e.map((a) => d`<tr><td>${s(a.start)}</td><td>${s(a.end)}</td><td class="num">${x(a.kwh)}</td>
          <td class="num">${ne(a.kwh > 0 ? a.solar_kwh / a.kwh : null)}</td><td class="num">${a.soc_start ?? "–"}% → ${a.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }
  render() {
    const t = [{ value: "", label: o("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((s) => ({ value: s.id, label: s.name, icon: s.icon || He(s.type) }))
    ), e = ["today", "yesterday", "7d", "30d", "month"];
    return d`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${t} .value=${this.loadId ?? ""}
          @value-changed=${(s) => {
      this.loadId = s.detail.value || null, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: !0, composed: !0 }));
    }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${e.map((s) => ({ value: s, label: o(`a.range.${s}`) }))} .value=${this._range}
          @value-changed=${(s) => {
      this._range = s.detail.value, this._fetch();
    }}></sm-segmented>
      </div>
      <div class="card"><div class="card-head"><h2>${o("a.summary")}</h2>${this._loading ? d`<span class="meta">…</span>` : u}</div>${this._summary()}</div>
      <div class="card"><div class="card-head"><h2>${o("a.timeline")}</h2></div><div class="card-body">${this._history()}</div></div>
      ${this._sessions()}
      <div class="two">${this._daily()}${this._rhythm()}${this._quarters()}</div>
    `;
  }
};
U.styles = [
  O,
  se,
  z`
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
], U.prototype, "hass", 2);
ie([
  _({ attribute: !1 })
], U.prototype, "loads", 2);
ie([
  _()
], U.prototype, "loadId", 2);
ie([
  _({ type: Number })
], U.prototype, "peakLimit", 2);
ie([
  b()
], U.prototype, "_range", 2);
ie([
  b()
], U.prototype, "_data", 2);
ie([
  b()
], U.prototype, "_loading", 2);
U = ie([
  P("sm-analytics")
], U);
var ca = Object.defineProperty, pa = Object.getOwnPropertyDescriptor, C = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? pa(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && ca(e, s, a), a;
};
const ha = 6 * 3600;
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
    this._started = !0, As(this.hass.language);
    try {
      await this._reload(), this._unsub = await At(this.hass, (t) => this._live = t), this._loadSpark(), this._sparkTimer = window.setInterval(() => this._loadSpark(), 6e4);
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t), this._started = !1;
    }
  }
  async _reload() {
    this._config = await gs(this.hass), this._live = this._config.live;
  }
  async _loadSpark() {
    const t = Date.now() / 1e3;
    try {
      const e = await Gt(this.hass, t - ha, t, null), s = {};
      for (const i of e.timeline.rows)
        for (const [a, r] of Object.entries(i[3]))
          (s[a] ?? (s[a] = [])).push([i[0], Math.abs(r[0] ?? 0), r[1] ?? 0]);
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
        await this._reload(), this._unsub = await At(this.hass, (s) => this._live = s);
        return;
      } catch {
      }
    }
  }
  _flashSave(t) {
    this._save = t, window.clearTimeout(this._saveTimer), t === "saved" && (this._saveTimer = window.setTimeout(() => this._save = "", 2500));
  }
  _setOrder(t) {
    const e = this._config, s = new Map(e.loads.map((i) => [i.id, i]));
    this._config = { ...e, loads: t.map((i) => s.get(i)).filter(Boolean) };
  }
  async _setMode(t, e) {
    const s = this._config;
    this._config = { ...s, loads: s.loads.map((i) => i.id === t ? { ...i, mode: e } : i) }, this._flashSave("saving"), await bs(this.hass, t, e), this._flashSave("saved");
  }
  async _setMinPower(t, e) {
    const s = this._config;
    this._config = { ...s, loads: s.loads.map((i) => i.id === t ? { ...i, ev_min_power_w: e } : i) }, this._flashSave("saving"), await ys(this.hass, t, e), this._flashSave("saved");
  }
  async _moveLoad(t, e) {
    const s = this._config.loads.map((r) => r.id), i = s.indexOf(t), a = i + e;
    a < 0 || a >= s.length || ([s[i], s[a]] = [s[a], s[i]], this._setOrder(s), await Ft(this.hass, s));
  }
  _addFields() {
    var a;
    const t = (r) => r.type === "ev", e = (r) => r.type === "battery", s = (r) => !t(r) && !e(r), i = (r) => t(r) && r.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev", "battery"].map((r) => ({ value: r, label: o(`type.${r}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: s },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: s },
      { key: "bat_soc_entity", kind: "entity", domains: ["sensor"], show: e },
      { key: "bat_power_entity", kind: "entity", domains: ["sensor"], show: e, helper: o("f.bat_power_entity.help") },
      { key: "bat_power_sign", kind: "select", show: e, options: ["charge_positive", "discharge_positive"].map((r) => ({ value: r, label: o(`f.bat_sign.${r}`) })) },
      { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], show: e, helper: o("f.bat_setpoint_entity.help") },
      { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1, show: e },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((r) => ({ value: r, label: o(`f.ev_driver.${r}`) })), show: t },
      { key: "ev_proxy_url", kind: "text", show: i, helper: o("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: i },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (r) => t(r) && !i(r) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (r) => t(r) && !i(r) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: o("f.power_entity.help"), show: (r) => !e(r) },
      { key: "mode", kind: "select", options: nt((a = this._adding) == null ? void 0 : a.type).map((r) => {
        var n;
        return { value: r, label: o(ut(r, (n = this._adding) == null ? void 0 : n.type)) };
      }) }
    ];
  }
  _startAdd() {
    this._addError = "", this._adding = { ...this._config.defaults.load, id: "", name: "", ev_driver: "tesla_ble_proxy" };
  }
  async _saveAdd() {
    const t = { ...this._adding };
    t.type !== "switch" && (!t.icon || t.icon === "mdi:water-boiler") && (t.icon = He(t.type)), nt(t.type).includes(t.mode) || (t.mode = t.type === "battery" ? "self" : "solar"), this._addBusy = !0;
    try {
      const e = await Vt(this.hass, t);
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
    return d`<span class="save ${this._save}"><ha-icon .icon=${t}></ha-icon>${o(`save.${this._save}`)}</span>`;
  }
  _toolbar() {
    const t = this._config, e = this._detail ? t == null ? void 0 : t.loads.find((s) => s.id === this._detail) : void 0;
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
              <ha-icon .icon=${this._editing ? "mdi:check" : "mdi:pencil"}></ha-icon></button>` : u}
      </div>
      <nav class="tabs">
        ${["loads", "analytics", "settings"].map(
      (s) => d`<button class="tab ${this._tab === s ? "on" : ""}" @click=${() => {
        this._tab = s, this._editing = !1;
      }}>${o(`tab.${s}`)}</button>`
    )}
      </nav>`;
  }
  _content(t) {
    var s, i, a, r, n;
    const e = this._detail ? t.loads.findIndex((c) => c.id === this._detail) : -1;
    if (e >= 0) {
      const c = { ...t.defaults.load, ...t.loads[e] };
      return d`<sm-load-detail .hass=${this.hass} .load=${c} .live=${(i = (s = this._live) == null ? void 0 : s.loads) == null ? void 0 : i[c.id]} .spark=${this._spark[c.id] ?? []}
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
        return d`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad} .peakLimit=${((r = (a = this._live) == null ? void 0 : a.site) == null ? void 0 : r.peak_limit_w) ?? null}
          @analytics-load=${(c) => this._analyticsLoad = c.detail.id}></sm-analytics>`;
      case "settings":
        return d`<sm-settings .hass=${this.hass} .settings=${t.settings} .site=${(n = this._live) == null ? void 0 : n.site} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(c) => {
          this._config = { ...t, settings: { ...t.settings, ...c.detail.settings } }, this._flashSave("saved");
        }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return d`<sm-dashboard .hass=${this.hass} .loads=${t.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(c) => this._detail = c.detail.id}
          @set-mode=${(c) => this._setMode(c.detail.id, c.detail.mode)}
        @set-min-power=${(c) => this._setMinPower(c.detail.id, c.detail.power_w)}
          @loads-reordered=${(c) => this._setOrder(c.detail.order)}
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
            <button class="text" @click=${() => location.reload()}>${o("panel.reload")}</button></div>` : u}
      <main>${t ? this._content(t) : u}</main>
      ${this._adding ? d`<sm-dialog .heading=${o("loads.add")} .saveLabel=${o("load.add_save")} .busy=${this._addBusy} .error=${this._addError}
            .canSave=${!!this._adding.name} @closed=${() => this._adding = null} @save=${this._saveAdd}>
            <sm-form .hass=${this.hass} .fields=${this._addFields()} .data=${this._adding}
              @value-changed=${(e) => this._adding = { ...this._adding, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : u}
    `;
  }
};
E.styles = [
  O,
  se,
  z`
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
C([
  _({ attribute: !1 })
], E.prototype, "hass", 2);
C([
  _({ type: Boolean })
], E.prototype, "narrow", 2);
C([
  b()
], E.prototype, "_config", 2);
C([
  b()
], E.prototype, "_live", 2);
C([
  b()
], E.prototype, "_tab", 2);
C([
  b()
], E.prototype, "_detail", 2);
C([
  b()
], E.prototype, "_editing", 2);
C([
  b()
], E.prototype, "_analyticsLoad", 2);
C([
  b()
], E.prototype, "_spark", 2);
C([
  b()
], E.prototype, "_adding", 2);
C([
  b()
], E.prototype, "_addBusy", 2);
C([
  b()
], E.prototype, "_addError", 2);
C([
  b()
], E.prototype, "_save", 2);
C([
  b()
], E.prototype, "_error", 2);
E = C([
  P("solarmind-panel")
], E);
export {
  E as SolarMindPanel
};
