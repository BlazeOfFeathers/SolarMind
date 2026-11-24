/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, ot = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, rt = Symbol(), ht = /* @__PURE__ */ new WeakMap();
let jt = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== rt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ot && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = ht.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ht.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Vt = (t) => new jt(typeof t == "string" ? t : t + "", void 0, rt), P = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, a, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[o + 1], t[0]);
  return new jt(i, t, rt);
}, Ft = (t, e) => {
  if (ot) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), a = Ze.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = i.cssText, t.appendChild(s);
  }
}, pt = ot ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Vt(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Zt, defineProperty: qt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Yt, getPrototypeOf: Jt } = Object, X = globalThis, mt = X.trustedTypes, Xt = mt ? mt.emptyScript : "", Ye = X.reactiveElementPolyfillSupport, Oe = (t, e) => t, qe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Xt : null;
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
} }, nt = (t, e) => !Zt(t, e), ut = { attribute: !0, type: String, converter: qe, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), X.litPropertyMetadata ?? (X.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let $e = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ut) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(e, s, i);
      a !== void 0 && qt(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: a, set: o } = Gt(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: a, set(n) {
      const c = a == null ? void 0 : a.call(this);
      o == null || o.call(this, n), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Oe("elementProperties"))) return;
    const e = Jt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Oe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Oe("properties"))) {
      const i = this.properties, s = [...Kt(i), ...Yt(i)];
      for (const a of s) this.createProperty(a, i[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, a] of i) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const a = this._$Eu(i, s);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const a of s) i.unshift(pt(a));
    } else e !== void 0 && i.push(pt(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ft(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostConnected) == null ? void 0 : s.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostDisconnected) == null ? void 0 : s.call(i);
    });
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    var o;
    const s = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, s);
    if (a !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : qe).toAttribute(i, s.type);
      this._$Em = e, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var o, n;
    const s = this.constructor, a = s._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const c = s.getPropertyOptions(a), l = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : qe;
      this._$Em = a;
      const h = l.fromAttribute(i, c.type);
      this[a] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(a)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, a = !1, o) {
    var n;
    if (e !== void 0) {
      const c = this.constructor;
      if (a === !1 && (o = this[e]), s ?? (s = c.getPropertyOptions(e)), !((s.hasChanged ?? nt)(o, i) || s.useDefault && s.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(c._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: a, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [o, n] of a) {
        const { wrapped: c } = n, l = this[o];
        c !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, n, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (s = this._$EO) == null || s.forEach((a) => {
        var o;
        return (o = a.hostUpdate) == null ? void 0 : o.call(a);
      }), this.update(i)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
      var a;
      return (a = s.hostUpdated) == null ? void 0 : a.call(s);
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
$e.elementStyles = [], $e.shadowRootOptions = { mode: "open" }, $e[Oe("elementProperties")] = /* @__PURE__ */ new Map(), $e[Oe("finalized")] = /* @__PURE__ */ new Map(), Ye == null || Ye({ ReactiveElement: $e }), (X.reactiveElementVersions ?? (X.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ze = globalThis, _t = (t) => t, Ge = ze.trustedTypes, gt = Ge ? Ge.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ct = "$lit$", J = `lit$${Math.random().toFixed(9).slice(2)}$`, Dt = "?" + J, Qt = `<${Dt}>`, le = document, De = () => le.createComment(""), Le = (t) => t === null || typeof t != "object" && typeof t != "function", lt = Array.isArray, ei = (t) => lt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Je = `[ 	
\f\r]`, Me = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vt = /-->/g, ft = />/g, ae = RegExp(`>|${Je}(?:([^\\s"'>=/]+)(${Je}*=${Je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), bt = /'/g, yt = /"/g, Lt = /^(?:script|style|textarea|title)$/i, Nt = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Nt(1), A = Nt(2), we = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), $t = /* @__PURE__ */ new WeakMap(), re = le.createTreeWalker(le, 129);
function Tt(t, e) {
  if (!lt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return gt !== void 0 ? gt.createHTML(e) : e;
}
const ti = (t, e) => {
  const i = t.length - 1, s = [];
  let a, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Me;
  for (let c = 0; c < i; c++) {
    const l = t[c];
    let h, u, p = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, u = n.exec(l), u !== null); ) f = n.lastIndex, n === Me ? u[1] === "!--" ? n = vt : u[1] !== void 0 ? n = ft : u[2] !== void 0 ? (Lt.test(u[2]) && (a = RegExp("</" + u[2], "g")), n = ae) : u[3] !== void 0 && (n = ae) : n === ae ? u[0] === ">" ? (n = a ?? Me, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? ae : u[3] === '"' ? yt : bt) : n === yt || n === bt ? n = ae : n === vt || n === ft ? n = Me : (n = ae, a = void 0);
    const g = n === ae && t[c + 1].startsWith("/>") ? " " : "";
    o += n === Me ? l + Qt : p >= 0 ? (s.push(h), l.slice(0, p) + Ct + l.slice(p) + J + g) : l + J + (p === -2 ? c : g);
  }
  return [Tt(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Ne {
  constructor({ strings: e, _$litType$: i }, s) {
    let a;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, l = this.parts, [h, u] = ti(e, i);
    if (this.el = Ne.createElement(h, s), re.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (a = re.nextNode()) !== null && l.length < c; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const p of a.getAttributeNames()) if (p.endsWith(Ct)) {
          const f = u[n++], g = a.getAttribute(p).split(J), b = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: o, name: b[2], strings: g, ctor: b[1] === "." ? ai : b[1] === "?" ? si : b[1] === "@" ? oi : Ke }), a.removeAttribute(p);
        } else p.startsWith(J) && (l.push({ type: 6, index: o }), a.removeAttribute(p));
        if (Lt.test(a.tagName)) {
          const p = a.textContent.split(J), f = p.length - 1;
          if (f > 0) {
            a.textContent = Ge ? Ge.emptyScript : "";
            for (let g = 0; g < f; g++) a.append(p[g], De()), re.nextNode(), l.push({ type: 2, index: ++o });
            a.append(p[f], De());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Dt) l.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = a.data.indexOf(J, p + 1)) !== -1; ) l.push({ type: 7, index: o }), p += J.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const s = le.createElement("template");
    return s.innerHTML = e, s;
  }
}
function xe(t, e, i = t, s) {
  var n, c;
  if (e === we) return e;
  let a = s !== void 0 ? (n = i._$Co) == null ? void 0 : n[s] : i._$Cl;
  const o = Le(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== o && ((c = a == null ? void 0 : a._$AO) == null || c.call(a, !1), o === void 0 ? a = void 0 : (a = new o(t), a._$AT(t, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = a : i._$Cl = a), a !== void 0 && (e = xe(t, a._$AS(t, e.values), a, s)), e;
}
class ii {
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
    const { el: { content: i }, parts: s } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? le).importNode(i, !0);
    re.currentNode = a;
    let o = re.nextNode(), n = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new Ie(o, o.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (h = new ri(o, this, e)), this._$AV.push(h), l = s[++c];
      }
      n !== (l == null ? void 0 : l.index) && (o = re.nextNode(), n++);
    }
    return re.currentNode = le, a;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class Ie {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, s, a) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    e = xe(this, e, i), Le(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== we && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ei(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && Le(this._$AH) ? this._$AA.nextSibling.data = e : this.T(le.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: i, _$litType$: s } = e, a = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Ne.createElement(Tt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === a) this._$AH.p(i);
    else {
      const n = new ii(a, this), c = n.u(this.options);
      n.p(i), this.T(c), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = $t.get(e.strings);
    return i === void 0 && $t.set(e.strings, i = new Ne(e)), i;
  }
  k(e) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, a = 0;
    for (const o of e) a === i.length ? i.push(s = new Ie(this.O(De()), this.O(De()), this, this.options)) : s = i[a], s._$AI(o), a++;
    a < i.length && (this._$AR(s && s._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); e !== this._$AB; ) {
      const a = _t(e).nextSibling;
      _t(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class Ke {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, a, o) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = i, this._$AM = a, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(e, i = this, s, a) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = xe(this, e, i, 0), n = !Le(e) || e !== this._$AH && e !== we, n && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = o[0], l = 0; l < o.length - 1; l++) h = xe(this, c[s + l], i, l), h === we && (h = this._$AH[l]), n || (n = !Le(h) || h !== this._$AH[l]), h === m ? e = m : e !== m && (e += (h ?? "") + o[l + 1]), this._$AH[l] = h;
    }
    n && !a && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ai extends Ke {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class si extends Ke {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class oi extends Ke {
  constructor(e, i, s, a, o) {
    super(e, i, s, a, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = xe(this, e, i, 0) ?? m) === we) return;
    const s = this._$AH, a = e === m && s !== m || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== m && (s === m || a);
    a && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ri {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    xe(this, e);
  }
}
const Xe = ze.litHtmlPolyfillSupport;
Xe == null || Xe(Ne, Ie), (ze.litHtmlVersions ?? (ze.litHtmlVersions = [])).push("3.3.3");
const ni = (t, e, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? e;
  let a = s._$litPart$;
  if (a === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = a = new Ie(e.insertBefore(De(), o), o, void 0, i ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = globalThis;
class k extends $e {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ni(i, this.renderRoot, this.renderOptions);
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
    return we;
  }
}
var zt;
k._$litElement$ = !0, k.finalized = !0, (zt = ne.litElementHydrateSupport) == null || zt.call(ne, { LitElement: k });
const Qe = ne.litElementPolyfillSupport;
Qe == null || Qe({ LitElement: k });
(ne.litElementVersions ?? (ne.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = { attribute: !0, type: String, converter: qe, reflect: !1, hasChanged: nt }, di = (t = li, e, i) => {
  const { kind: s, metadata: a } = i;
  let o = globalThis.litPropertyMetadata.get(a);
  if (o === void 0 && globalThis.litPropertyMetadata.set(a, o = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), s === "accessor") {
    const { name: n } = i;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(c) {
      const l = this[n];
      e.call(this, c), this.requestUpdate(n, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function _(t) {
  return (e, i) => typeof i == "object" ? di(t, e, i) : ((s, a, o) => {
    const n = a.hasOwnProperty(o);
    return a.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(a, o) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(t) {
  return _({ ...t, state: !0, attribute: !1 });
}
const ci = (t) => t.connection.sendMessagePromise({ type: "solarmind/config" }), hi = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/settings/save", settings: e }), It = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/save", load: e }), pi = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/delete", load_id: e }), Wt = (t, e) => t.connection.sendMessagePromise({ type: "solarmind/loads/reorder", order: e }), mi = (t, e, i) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_mode", load_id: e, mode: i }), ui = (t, e, i) => t.connection.sendMessagePromise({ type: "solarmind/loads/set_ev_min_power", load_id: e, power_w: i }), _i = (t) => t.connection.sendMessagePromise({ type: "solarmind/notify/test" }), Ht = (t, e, i, s) => t.connection.sendMessagePromise({ type: "solarmind/analytics", start: e, end: i, load_id: s }), wt = (t, e) => t.connection.subscribeMessage(e, { type: "solarmind/subscribe" }), xt = {
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
}, gi = {
  "s.cat.notify": "Notifications",
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
let Bt = "nl";
const vi = (t) => {
  Bt = t && t.toLowerCase().startsWith("en") ? "en" : "nl";
}, r = (t) => (Bt === "en" ? gi[t] ?? xt[t] : xt[t]) ?? t, D = P`
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
`, me = P`
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
`, M = (t) => t == null || Number.isNaN(t) ? "–" : Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(2)} kW` : `${Math.round(t)} W`, Ut = (t) => t == null || Number.isNaN(t) ? ["–", ""] : Math.abs(t) >= 1e3 ? [(t / 1e3).toFixed(2), "kW"] : [String(Math.round(t)), "W"], w = (t, e = 2) => t == null ? "–" : `${t.toFixed(e)} kWh`, se = (t) => t == null ? "–" : `${Math.round(t * 100)}%`, et = (t) => {
  if (!t) return "0 min";
  const e = Math.floor(t / 3600), i = Math.round(t % 3600 / 60);
  return e ? `${e} u ${i} min` : `${i} min`;
}, fi = (t) => {
  const e = Math.max(1, Math.round(t / 60)), i = Math.floor(e / 60), s = e % 60;
  return i ? s ? `${i} u ${String(s).padStart(2, "0")}` : `${i} u` : `${s} min`;
}, Re = (t) => {
  const e = new Date(Date.now() + t * 1e3), i = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return e.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? i : `${e.toLocaleDateString([], { weekday: "short" })} ${i}`;
}, tt = (t) => t == null ? "–" : `€ ${t.toFixed(2)}`, bi = (t) => t == null ? "–" : t >= 3600 ? `${Math.round(t / 3600 * 10) / 10} u` : t >= 60 ? `${Math.round(t / 60 * 10) / 10} min` : `${t} s`, yi = {
  self: "mdi:home-battery-outline",
  solar: "mdi:solar-power-variant",
  solar_night: "mdi:weather-night",
  on: "mdi:power-plug",
  off: "mdi:power-off"
}, je = (t) => (t == null ? void 0 : t.type) === "battery", at = (t) => t === "battery" ? ["self", "solar", "solar_night", "on", "off"] : ["solar", "solar_night", "on", "off"], dt = (t, e) => e === "battery" && t !== "self" ? `mode.bat.${t}` : `mode.${t}`, Rt = (t) => at(t).map((e) => ({ value: e, label: r(dt(e, t)), icon: yi[e] })), We = (t) => t === "ev" ? "mdi:ev-station" : t === "battery" ? "mdi:home-battery" : "mdi:water-boiler", Ce = (t) => t === "solar" ? "solar" : t === "self_consumption" ? "ok" : ["night", "always_on", "legionella", "min_soc", "min_power"].includes(t) ? "grid" : t === "peak_guard" || t === "unavailable" ? "warn" : t === "target_reached" || t === "battery_full" ? "ok" : t === "reserve" ? "warn" : "", $i = (t) => ({
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
})[t] ?? "mdi:circle-small", be = ["#ff9800", "#e91e63", "#7e57c2", "#26a69a", "#8bc34a", "#ff7043"];
var wi = Object.defineProperty, xi = Object.getOwnPropertyDescriptor, He = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? xi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && wi(e, i, a), a;
};
let de = class extends k {
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
          ${t.icon ? d`<ha-icon .icon=${t.icon}></ha-icon>` : m}<span>${t.label}</span>
        </button>`
    )}
    </div>`;
  }
  _pick(t) {
    t.value !== this.value && this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: t.value }, bubbles: !0, composed: !0 }));
  }
};
de.styles = [
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
He([
  _({ attribute: !1 })
], de.prototype, "options", 2);
He([
  _({ attribute: !1 })
], de.prototype, "value", 2);
He([
  _({ reflect: !0 })
], de.prototype, "size", 2);
He([
  _({ type: Boolean, reflect: !0 })
], de.prototype, "wrap", 2);
de = He([
  C("sm-segmented")
], de);
var ki = Object.defineProperty, Si = Object.getOwnPropertyDescriptor, Be = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Si(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && ki(e, i, a), a;
};
let ce = class extends k {
  constructor() {
    super(...arguments), this.points = [], this.max = 0, this.height = 72, this.label = "";
  }
  render() {
    const t = this.points, e = 400, i = this.height;
    if (t.length < 2) return d`<svg viewBox="0 0 ${e} ${i}" preserveAspectRatio="none" style="height:${i}px"></svg>`;
    const s = t[0][0], a = t[t.length - 1][0], o = Math.max(this.max, ...t.map((p) => p[1]), 1) * 1.1, n = (p) => (p - s) / Math.max(1, a - s) * e, c = (p) => i - p / o * (i - 4), l = (p) => t.map((f, g) => `${g ? "L" : "M"}${n(f[0]).toFixed(1)},${c(p(f)).toFixed(1)}`).join(""), h = (p, f) => {
      let g = l(p);
      for (let b = t.length - 1; b >= 0; b--) g += `L${n(t[b][0]).toFixed(1)},${c(f(t[b])).toFixed(1)}`;
      return g + "Z";
    }, u = `g${Math.random().toString(36).slice(2, 8)}`;
    return d`<svg viewBox="0 0 ${e} ${i}" preserveAspectRatio="none" style="height:${i}px">
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
        ${A`<path d="${h((p) => p[2], () => 0)}" fill="url(#${u}s)"></path>
        <path d="${h((p) => p[1], (p) => p[2])}" fill="url(#${u}g)"></path>
        <path d="${l((p) => p[1])}" fill="none" stroke="var(--secondary-text-color)" stroke-opacity="0.6" stroke-width="1.2" vector-effect="non-scaling-stroke"></path>
        <path d="${l((p) => p[2])}" fill="none" stroke="var(--sm-solar)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
      </svg>
      ${this.label ? d`<span class="label">${this.label}</span>` : ""}`;
  }
};
ce.styles = [
  D,
  P`
      :host { display: block; position: relative; }
      svg { display: block; width: 100%; }
      .label { position: absolute; top: 2px; right: 8px; font-size: 11px; color: var(--secondary-text-color); }
    `
];
Be([
  _({ attribute: !1 })
], ce.prototype, "points", 2);
Be([
  _({ type: Number })
], ce.prototype, "max", 2);
Be([
  _({ type: Number })
], ce.prototype, "height", 2);
Be([
  _()
], ce.prototype, "label", 2);
ce = Be([
  C("sm-sparkline")
], ce);
var Ai = Object.defineProperty, Mi = Object.getOwnPropertyDescriptor, Se = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Mi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Ai(e, i, a), a;
};
let Q = class extends k {
  constructor() {
    super(...arguments), this.spark = [], this.priority = 1, this._minAmps = null;
  }
  _open() {
    this.dispatchEvent(new CustomEvent("open-load", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _hint() {
    const t = this.live, e = this.load;
    return t ? t.driver_error ? `${r("hint.driver_error")}: ${t.driver_error}` : je(e) ? e.mode === "solar_night" && t.night_needed === !0 ? r("hint.bat_night") : t.reason === "peak_guard" && (t.power_w ?? 0) < 0 ? r("hint.bat_peak") : t.stored_kwh != null ? `${w(t.stored_kwh, 1)} ${r("hint.bat_stored")}` : null : e.type === "ev" && t.car_state === "NoPower" ? r("hint.no_power") : t.reason === "peak_guard" ? r("hint.peak") : t.is_full ? r(e.type === "ev" ? "hint.full_ev" : "hint.full") : e.mode === "solar_night" && t.night_needed === !0 ? r("hint.night_needed") : e.mode === "solar_night" && t.night_needed === !1 ? r("hint.night_not_needed") : e.type === "ev" && t.plugged === !1 ? r("reason.not_connected") : e.type === "ev" && t.is_on && t.current_a != null ? `${r("hint.charging_at")} ${Math.round(t.current_a)} A` : null : null;
  }
  _batEta() {
    const t = this.live;
    return t ? t.eta_full_s ? d`<span class="eta"><ha-icon icon="mdi:battery-arrow-up"></ha-icon>${r("eta.bat_full").replace("{t}", Re(t.eta_full_s))}</span>` : t.eta_empty_s ? d`<span class="eta"><ha-icon icon="mdi:battery-arrow-down"></ha-icon>${r("eta.bat_empty").replace("{t}", Re(t.eta_empty_s))}</span>` : m : m;
  }
  _eta() {
    const t = this.live;
    if (je(this.load)) return this._batEta();
    if (this.load.type !== "ev" || !t || t.plugged === !1) return m;
    if (t.soc != null && t.soc < 100 && !t.battery_kwh && t.eta_full_s == null && t.eta_limit_s == null)
      return d`<span class="eta est"><ha-icon icon="mdi:timer-sand"></ha-icon>${r("eta.need_capacity")}</span>`;
    if (t.eta_full_s == null || !t.eta_full_s) return m;
    const e = !!t.eta_estimated, i = `${e ? "~" : ""}${fi(t.eta_full_s)}`, s = e ? ` ${r("eta.at_min")}` : ` (± ${Re(t.eta_full_s)})`;
    return d`<span class="eta ${e ? "est" : ""}"><ha-icon icon="mdi:timer-sand"></ha-icon>${r("eta.full").replace("{d}", i)}${s}</span>`;
  }
  _limitLine() {
    const t = this.live;
    if (this.load.type !== "ev" || !t || t.eta_limit_s == null || t.charge_limit == null || t.plugged === !1) return m;
    const e = `${t.eta_estimated ? "~" : ""}${Re(t.eta_limit_s)}`;
    return d`<div class="limit">${r("eta.limit").replace("{soc}", String(Math.round(t.charge_limit))).replace("{t}", e)}</div>`;
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
    const i = this.load.ev_min_current ?? 6, s = this.load.ev_max_current ?? 16, a = this._curAmps();
    let o = a + e;
    e > 0 && a === 0 && (o = i), e < 0 && a <= i && (o = 0), o = Math.min(s, Math.max(0, o)), o !== a && (this._minAmps = o, window.clearTimeout(this._minTimer), this._minTimer = window.setTimeout(() => {
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
    const t = this._curAmps(), e = this.load.ev_max_current ?? 16, i = t * this._wpa() / 1e3;
    return d`<div class="minp" @click=${(s) => s.stopPropagation()} title=${r("card.min_power_help")}>
      <span class="lbl"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${r("f.ev_min_power_w")}</span></span>
      <span class="stepper">
        <button ?disabled=${t === 0} @click=${(s) => this._step(s, -1)} aria-label="-">−</button>
        <span class="val ${t ? "" : "off"}">${t ? `${i.toLocaleString(void 0, { maximumFractionDigits: 1 })} kW · ${t} A` : r("card.min_power_off")}</span>
        <button ?disabled=${t >= e} @click=${(s) => this._step(s, 1)} aria-label="+">+</button>
      </span>
    </div>`;
  }
  render() {
    const t = this.load, e = this.live, i = je(t), [s, a] = Ut(i ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), o = i && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", n = (e == null ? void 0 : e.reason) ?? "idle", c = Ce(n), l = !!(e != null && e.is_on) && Math.abs((e == null ? void 0 : e.power_w) ?? 0) > 1, h = t.icon || We(t.type), u = t.type === "ev" ? (t.ev_max_current ?? 16) * 230 * (t.ev_phases ?? 1) : i ? Math.max(t.bat_max_charge_w ?? 0, t.bat_max_discharge_w ?? 0) : t.nominal_power_w, p = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null, f = this._hint();
    return d`<div class="card" @click=${this._open}>
      <div class="head">
        <ha-icon class=${l ? "active" : ""} .icon=${h}></ha-icon>
        <span class="name">${t.name}</span>
        <span class="status ${c}">
          ${c ? d`<ha-icon .icon=${$i(n)}></ha-icon>` : d`<span class="dot"></span>`}
          ${r(`reason.${n}`)}
        </span>
      </div>
      <div class="main">
        <div>
          <div class="big">${o ? d`<ha-icon class="dir" .icon=${o}></ha-icon>` : m}<span class="v">${s}</span><span class="u">${a}</span></div>
          <div class="extra">
            <span class="prio">#${this.priority}</span>
            ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : m}
            ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon .icon=${i ? "mdi:home-battery-outline" : "mdi:battery-charging"}></ha-icon>${Math.round(e.soc)}%</span>` : m}
            ${this._eta()}
            ${t.enabled ? m : d`<span>${r("reason.disabled")}</span>`}
          </div>
          ${this._limitLine()}
        </div>
        <div class="side">
          <div class="l">${r(i ? "load.charged_today" : "load.today")}</div>
          <div class="v">${w((e == null ? void 0 : e.kwh_today) ?? 0, 1)}</div>
          <div class="s">${i ? `${w((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${r("load.discharged")}` : p === null ? "" : `${Math.round(p * 100)}% ${r("load.from_solar")}`}</div>
        </div>
      </div>
      <div class="chart">
        <sm-sparkline .points=${this.spark} .max=${u} .height=${76}></sm-sparkline>
        ${f ? d`<span class="hint">${f}</span>` : m}
      </div>
      <div class="foot"><div class="seg-wrap">
        <sm-segmented .options=${Rt(t.type)} .value=${t.mode}
          @value-changed=${(g) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: g.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
      </div>
      ${t.type === "ev" && t.mode === "solar" ? this._minPowerRow() : m}
      </div>
    </div>`;
  }
};
Q.styles = [
  D,
  me,
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
Se([
  _({ attribute: !1 })
], Q.prototype, "load", 2);
Se([
  _({ attribute: !1 })
], Q.prototype, "live", 2);
Se([
  _({ attribute: !1 })
], Q.prototype, "spark", 2);
Se([
  _({ type: Number })
], Q.prototype, "priority", 2);
Se([
  y()
], Q.prototype, "_minAmps", 2);
Q = Se([
  C("sm-load-card")
], Q);
var Ei = Object.defineProperty, Pi = Object.getOwnPropertyDescriptor, ue = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Pi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Ei(e, i, a), a;
};
let F = class extends k {
  constructor() {
    super(...arguments), this.icon = "", this.heading = "", this.secondary = "", this.value = "", this.clickable = !1, this.variant = "";
  }
  render() {
    return d`<div class="row ${this.clickable ? "click" : ""}" @click=${this._click}>
      ${this.icon ? d`<div class="ic"><ha-icon .icon=${this.icon}></ha-icon></div>` : m}
      <div class="text">
        <div class="h">${this.heading}</div>
        ${this.secondary ? d`<div class="s">${this.secondary}</div>` : m}
      </div>
      ${this.value ? d`<div class="v">${this.value}</div>` : m}
      <slot></slot>
      ${this.clickable ? d`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>` : m}
    </div>`;
  }
  _click() {
    this.clickable && this.dispatchEvent(new CustomEvent("row-click", { bubbles: !0, composed: !0 }));
  }
};
F.styles = [
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
ue([
  _()
], F.prototype, "icon", 2);
ue([
  _()
], F.prototype, "heading", 2);
ue([
  _()
], F.prototype, "secondary", 2);
ue([
  _()
], F.prototype, "value", 2);
ue([
  _({ type: Boolean })
], F.prototype, "clickable", 2);
ue([
  _({ reflect: !0 })
], F.prototype, "variant", 2);
F = ue([
  C("sm-list-row")
], F);
var Oi = Object.defineProperty, zi = Object.getOwnPropertyDescriptor, _e = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? zi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Oi(e, i, a), a;
};
let Z = class extends k {
  constructor() {
    super(...arguments), this.loads = [], this.spark = {}, this.editing = !1, this._dragId = null;
  }
  _emit(t, e = {}) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  async _saveOrder(t) {
    this._emit("loads-reordered", { order: t }), await Wt(this.hass, t);
  }
  _move(t, e) {
    const i = this.loads.map((o) => o.id), s = i.indexOf(t), a = s + e;
    a < 0 || a >= i.length || ([i[s], i[a]] = [i[a], i[s]], this._saveOrder(i));
  }
  _drop(t) {
    if (!this._dragId || this._dragId === t) return;
    const e = this.loads.map((i) => i.id).filter((i) => i !== this._dragId);
    e.splice(e.indexOf(t), 0, this._dragId), this._dragId = null, this._saveOrder(e);
  }
  _pills() {
    var a;
    const t = ((a = this.live) == null ? void 0 : a.site) ?? {}, e = t.grid_w, i = e != null && e < 0, s = (t.quarter_projected_w ?? 0) > (t.peak_limit_w ?? 1 / 0) ? "warn" : "grid";
    return d`<div class="pills">
      <span class="pill"><ha-icon class="solar" icon="mdi:solar-power-variant"></ha-icon>${r("site.pv")} <b>${M(t.pv_w)}</b></span>
      <span class="pill"><ha-icon class=${i ? "export" : "grid"} icon=${i ? "mdi:transmission-tower-export" : "mdi:transmission-tower-import"}></ha-icon>
        ${r(i ? "site.export" : "site.import")} <b>${M(e == null ? null : Math.abs(e))}</b></span>
      <span class="pill"><ha-icon class="solar" icon="mdi:white-balance-sunny"></ha-icon>${r("site.surplus")} <b>${M(t.surplus_w)}</b></span>
      <span class="pill"><ha-icon icon="mdi:lightning-bolt"></ha-icon>${r("site.managed")} <b>${M(t.managed_w)}</b></span>
      <span class="pill"><ha-icon class=${s} icon="mdi:chart-bell-curve-cumulative"></ha-icon>${r("site.peak_now")}
        <b>${M(t.quarter_average_w)}</b>&nbsp;/ ${M(t.peak_limit_w)}</span>
      <span class="pill"><ha-icon icon="mdi:calendar-month"></ha-icon>${r("site.month_peak")} <b>${M(t.month_peak_w)}</b></span>
      ${t.in_night ? d`<span class="pill"><ha-icon icon="mdi:weather-night"></ha-icon>${r("site.night")}</span>` : m}
    </div>`;
  }
  _editList() {
    return d`<div class="card edit-list">
      <div class="card-head"><h2>${r("loads.title")}</h2></div>
      <div class="card-body muted" style="padding-bottom:8px">${r("loads.hint")}</div>
      ${this.loads.map(
      (t, e) => d`<div class="edit-row ${this._dragId === t.id ? "dragging" : ""}" draggable="true"
          @dragstart=${() => this._dragId = t.id} @dragend=${() => this._dragId = null}
          @dragover=${(i) => i.preventDefault()} @drop=${() => this._drop(t.id)}>
          <ha-icon class="handle" icon="mdi:drag"></ha-icon>
          <sm-list-row .icon=${t.icon || We(t.type)} .heading=${`${e + 1}. ${t.name}`}
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
    return d`
      ${t.available === !1 ? d`<div class="banner"><ha-icon icon="mdi:alert-outline"></ha-icon>${r("site.no_grid")}</div>` : m}
      ${t.enabled === !1 ? d`<div class="banner"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${r("site.disabled")}</div>` : m}
      ${this._pills()}
      ${this.editing ? this._editList() : this.loads.length ? d`<div class="grid">
              ${this.loads.map((i, s) => {
      var a, o;
      return d`<sm-load-card .load=${i} .live=${(o = (a = this.live) == null ? void 0 : a.loads) == null ? void 0 : o[i.id]} .spark=${this.spark[i.id] ?? []} .priority=${s + 1}></sm-load-card>`;
    })}
              <button class="add" @click=${() => this._emit("add-load")}><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${r("loads.add")}</button>
            </div>` : d`<div class="placeholder"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><p>${r("loads.empty")}</p>
              <button class="filled" @click=${() => this._emit("add-load")}>${r("loads.add")}</button></div>`}
    `;
  }
};
Z.styles = [
  D,
  me,
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
_e([
  _({ attribute: !1 })
], Z.prototype, "hass", 2);
_e([
  _({ attribute: !1 })
], Z.prototype, "loads", 2);
_e([
  _({ attribute: !1 })
], Z.prototype, "live", 2);
_e([
  _({ attribute: !1 })
], Z.prototype, "spark", 2);
_e([
  _({ type: Boolean })
], Z.prototype, "editing", 2);
_e([
  y()
], Z.prototype, "_dragId", 2);
Z = _e([
  C("sm-dashboard")
], Z);
var ji = Object.defineProperty, Ci = Object.getOwnPropertyDescriptor, Ae = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ci(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && ji(e, i, a), a;
};
let ee = class extends k {
  constructor() {
    super(...arguments), this.heading = "", this.saveLabel = "", this.busy = !1, this.canSave = !0, this.error = "";
  }
  render() {
    return d`<div class="scrim" @click=${(t) => t.target === t.currentTarget && this._close()}>
      <div class="dlg" role="dialog" aria-modal="true" aria-label=${this.heading}>
        <h2>${this.heading}</h2>
        <div class="body"><slot></slot>${this.error ? d`<div class="err" role="alert">${this.error}</div>` : m}</div>
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
ee.styles = [
  D,
  me,
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
Ae([
  _()
], ee.prototype, "heading", 2);
Ae([
  _()
], ee.prototype, "saveLabel", 2);
Ae([
  _({ type: Boolean })
], ee.prototype, "busy", 2);
Ae([
  _({ type: Boolean })
], ee.prototype, "canSave", 2);
Ae([
  _()
], ee.prototype, "error", 2);
ee = Ae([
  C("sm-dialog")
], ee);
var Di = Object.defineProperty, Li = Object.getOwnPropertyDescriptor, ct = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Li(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Di(e, i, a), a;
};
let Te = class extends k {
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
Te.styles = [
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
ct([
  _({ type: Boolean, reflect: !0 })
], Te.prototype, "checked", 2);
ct([
  _({ type: Boolean, reflect: !0 })
], Te.prototype, "disabled", 2);
Te = ct([
  C("sm-toggle")
], Te);
var Ni = Object.defineProperty, Ti = Object.getOwnPropertyDescriptor, Ue = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ti(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Ni(e, i, a), a;
};
let Ii = 0, he = class extends k {
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
    var n, c, l;
    const i = this._label(t);
    if (customElements.get("ha-entity-picker"))
      return d`<ha-entity-picker .hass=${this.hass} .label=${i} .value=${e ?? ""} allow-custom-entity
        .includeDomains=${t.domains} @value-changed=${(h) => this._emit(t.key, h.detail.value || null)}></ha-entity-picker>
        ${t.helper ? d`<span class="help">${t.helper}</span>` : m}`;
    const s = `sm-ents-${++Ii}`, a = e ? (c = (n = this.hass) == null ? void 0 : n.states) == null ? void 0 : c[e] : void 0, o = Object.values(((l = this.hass) == null ? void 0 : l.states) ?? {}).filter((h) => {
      var u;
      return !((u = t.domains) != null && u.length) || t.domains.includes(h.entity_id.split(".")[0]);
    }).sort((h, u) => h.entity_id.localeCompare(u.entity_id));
    return d`<label class="field">${i}
      <input list=${s} .value=${e ?? ""} placeholder="entity_id"
        @change=${(h) => this._emit(t.key, h.target.value.trim() || null)} />
      <datalist id=${s}>${o.map((h) => d`<option value=${h.entity_id}>${h.attributes.friendly_name ?? ""}</option>`)}</datalist>
      ${a ? d`<span class="ent-state">${a.attributes.friendly_name ?? ""}: ${a.state} ${a.attributes.unit_of_measurement ?? ""}</span>` : m}
      ${t.helper ? d`<span class="help">${t.helper}</span>` : m}
    </label>`;
  }
  _field(t) {
    const e = this.data;
    if (t.show && !t.show(e)) return m;
    const i = e[t.key], s = this._label(t);
    switch (t.kind) {
      case "entity":
        return d`<div>${this._entity(t, i)}</div>`;
      case "bool":
        return d`<div class="bool"><span class="txt">${s}${t.helper ? d`<span class="help">${t.helper}</span>` : m}</span>
          <sm-toggle .checked=${!!i} @change=${(a) => this._emit(t.key, a.detail.checked)}></sm-toggle></div>`;
      case "select":
        return d`<label class="field">${s}
          <select @change=${(a) => {
          const o = a.target.value;
          this._emit(t.key, typeof i == "number" ? Number(o) : o);
        }}>${(t.options ?? []).map((a) => d`<option value=${a.value} ?selected=${String(i) === a.value}>${a.label}</option>`)}</select>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : m}</label>`;
      case "number":
        return d`<label class="field">${s}
          <span class="wrap"><input type="number" step=${t.step ?? 1} .value=${i == null ? "" : String(i)}
            @change=${(a) => {
          const o = a.target.value;
          this._emit(t.key, o === "" ? t.nullable ? null : 0 : Number(o));
        }} />${t.unit ? d`<span class="unit">${t.unit}</span>` : m}</span>
          ${t.helper ? d`<span class="help">${t.helper}</span>` : m}</label>`;
      case "multi": {
        const a = Array.isArray(i) ? i : [], o = t.options ?? [];
        return d`<div class="field multi"><span>${s}</span>
          ${o.length ? o.map((n) => d`<div class="bool"><span class="txt">${n.label}</span>
                <sm-toggle .checked=${a.includes(n.value)} @change=${(c) => this._emit(t.key, c.detail.checked ? [...a, n.value] : a.filter((l) => l !== n.value))}></sm-toggle></div>`) : d`<span class="help">${r("form.no_options")}</span>`}
          ${t.helper ? d`<span class="help">${t.helper}</span>` : m}</div>`;
      }
      case "time":
        return d`<label class="field">${s}
          <input type="time" .value=${i ?? ""} @change=${(a) => this._emit(t.key, a.target.value)} /></label>`;
      default:
        return d`<label class="field">${s}
          <input type="text" .value=${i ?? ""} @change=${(a) => this._emit(t.key, a.target.value)} />
          ${t.helper ? d`<span class="help">${t.helper}</span>` : m}</label>`;
    }
  }
  render() {
    return d`${this.fields.map((t) => this._field(t))}`;
  }
};
he.styles = [
  D,
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
Ue([
  _({ attribute: !1 })
], he.prototype, "hass", 2);
Ue([
  _({ attribute: !1 })
], he.prototype, "fields", 2);
Ue([
  _({ attribute: !1 })
], he.prototype, "data", 2);
Ue([
  _()
], he.prototype, "prefix", 2);
he = Ue([
  C("sm-form")
], he);
var Wi = Object.defineProperty, Hi = Object.getOwnPropertyDescriptor, I = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Hi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Wi(e, i, a), a;
};
const B = (t) => t.type === "ev", W = (t) => B(t) && t.ev_driver === "tesla_ble_proxy", T = (t) => je(t), kt = (t) => !je(t), oe = (t) => !B(t) && !T(t), St = () => ["charge_positive", "discharge_positive"].map((t) => ({ value: t, label: r(`f.bat_sign.${t}`) })), Ee = (t) => t == null ? "–" : `${t}%`, Ve = (t) => bi(t ?? 0), H = (t, e) => {
  if (!e) return r("detail.not_set");
  const i = t.states[e];
  return i ? `${i.attributes.friendly_name ?? e}` : e;
}, Bi = (t, e) => {
  const i = e ? t.states[e] : void 0;
  return i ? i.state === "on" ? r("detail.on") : i.state === "off" ? r("detail.off") : i.state : "";
}, Fe = (t, e) => {
  if (!e) return "";
  const i = t.states[e];
  return i ? `${i.state}${i.attributes.unit_of_measurement ? " " + i.attributes.unit_of_measurement : ""}` : "?";
};
let j = class extends k {
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
            secondary: (e) => H(t, e.bat_soc_entity),
            value: (e, i) => (i == null ? void 0 : i.soc) != null ? `${Math.round(i.soc)}%` : "",
            fields: [
              { key: "bat_soc_entity", kind: "entity", domains: ["sensor"] },
              { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1 }
            ]
          },
          {
            icon: "mdi:meter-electric-outline",
            title: r("f.bat_power_entity"),
            show: T,
            secondary: (e) => `${H(t, e.bat_power_entity)} · ${r(`f.bat_sign.${e.bat_power_sign}`)}`,
            value: (e) => Fe(t, e.bat_power_entity),
            fields: [
              { key: "bat_power_entity", kind: "entity", domains: ["sensor"], helper: r("f.bat_power_entity.help") },
              { key: "bat_power_sign", kind: "select", options: St() }
            ]
          },
          {
            icon: "mdi:tune-variant",
            title: r("detail.bat_control"),
            show: T,
            secondary: (e) => e.bat_setpoint_entity ? H(t, e.bat_setpoint_entity) : e.bat_charge_entity || e.bat_discharge_entity ? `${H(t, e.bat_charge_entity)} / ${H(t, e.bat_discharge_entity)}` : r("detail.not_set"),
            value: (e, i) => (i == null ? void 0 : i.setpoint_w) != null ? M(i.setpoint_w) : "",
            fields: [
              { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], helper: r("f.bat_setpoint_entity.help") },
              { key: "bat_setpoint_sign", kind: "select", options: St(), show: (e) => !!e.bat_setpoint_entity },
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
            show: oe,
            secondary: (e) => H(t, e.switch_entity),
            value: (e) => Bi(t, e.switch_entity),
            fields: [{ key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"] }]
          },
          {
            icon: "mdi:flash",
            title: r("f.nominal_power_w"),
            show: oe,
            secondary: () => r("detail.nominal_help"),
            value: (e) => M(e.nominal_power_w),
            fields: [{ key: "nominal_power_w", kind: "number", unit: "W", step: 50 }, { key: "full_threshold_w", kind: "number", unit: "W" }]
          },
          {
            icon: "mdi:ev-plug-type2",
            title: r("f.ev_driver"),
            show: B,
            secondary: (e) => W(e) ? `${e.ev_proxy_url} · ${e.ev_vin || "VIN?"}` : H(t, e.ev_charge_switch_entity),
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
            show: kt,
            secondary: (e) => H(t, e.power_entity),
            value: (e) => Fe(t, e.power_entity),
            fields: [{ key: "power_entity", kind: "entity", domains: ["sensor"], helper: r("f.power_entity.help") }]
          },
          {
            icon: "mdi:thermometer",
            title: r("detail.temp_sensor"),
            show: oe,
            secondary: (e) => H(t, e.temperature_entity),
            value: (e) => e.max_temperature != null ? `${Fe(t, e.temperature_entity)} · max ${e.max_temperature} °C` : Fe(t, e.temperature_entity),
            fields: [
              { key: "temperature_entity", kind: "entity", domains: ["sensor"] },
              { key: "max_temperature", kind: "number", nullable: !0, unit: "°C" }
            ]
          },
          {
            icon: "mdi:battery-charging",
            title: r("f.ev_soc_entity"),
            show: B,
            secondary: (e) => e.ev_soc_entity ? H(t, e.ev_soc_entity) : W(e) ? r("detail.from_proxy") : r("detail.not_set"),
            value: (e, i) => (i == null ? void 0 : i.soc) != null ? `${Math.round(i.soc)}%` : "",
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
            secondary: (e) => r("detail.bat_limits_sub").replace("{min}", Ee(e.bat_min_soc)).replace("{max}", Ee(e.bat_max_soc)),
            value: (e) => `${Ee(e.bat_min_soc)} – ${Ee(e.bat_max_soc)}`,
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
            value: (e) => Ee(e.bat_peak_min_soc),
            fields: [{ key: "bat_peak_min_soc", kind: "number", unit: "%" }]
          }
        ]
      },
      {
        title: r("f.section.ev"),
        show: B,
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
            secondary: (e, i) => i != null && i.battery_kwh_learned ? r("detail.battery_learned").replace("{kwh}", `${i.battery_kwh_learned} kWh`) : (i == null ? void 0 : i.battery_kwh_source) === "car" && i.battery_kwh ? r("detail.battery_car").replace("{kwh}", `${i.battery_kwh} kWh`) : r("detail.battery_learning"),
            value: (e, i) => e.ev_battery_kwh ? `${e.ev_battery_kwh} kWh` : i != null && i.battery_kwh_learned ? `${i.battery_kwh_learned} kWh (${r("detail.learned")})` : "–",
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
        show: kt,
        rows: [
          {
            icon: "mdi:timer-play-outline",
            title: r("detail.start_stop"),
            secondary: (e) => r("detail.start_stop_sub").replace("{start}", Ve(e.start_delay_s)).replace("{stop}", Ve(e.stop_delay_s)),
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
            secondary: (e) => `${r("detail.on")} ${Ve(e.min_on_s)} · ${r("detail.off_short")} ${Ve(e.min_off_s)}`,
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
            secondary: (e) => T(e) ? r("detail.night_when_bat").replace("{soc}", String(e.bat_target_soc)) : B(e) && (e.ev_soc_entity || W(e)) ? r("detail.night_when_soc").replace("{soc}", String(e.ev_target_soc)) : e.night_min_temperature != null ? r("detail.night_when_temp").replace("{t}", String(e.night_min_temperature)) : r("detail.night_when_kwh").replace("{kwh}", String(e.night_min_solar_kwh)),
            fields: [
              { key: "night_min_solar_kwh", kind: "number", unit: "kWh", step: 0.1, show: (e) => oe(e) || B(e) && !(e.ev_soc_entity || W(e)) },
              { key: "night_min_temperature", kind: "number", unit: "°C", nullable: !0, show: oe },
              { key: "bat_target_soc", kind: "number", unit: "%", show: T },
              { key: "ev_target_soc", kind: "number", unit: "%", show: B }
            ]
          },
          {
            icon: "mdi:battery-arrow-up-outline",
            title: r("detail.night_amount"),
            show: oe,
            value: (e) => e.night_target_kwh ? w(e.night_target_kwh, 1) : r("detail.until_full"),
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
        show: oe,
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
      const e = await It(this.hass, { ...this.load, ...t });
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
    await pi(this.hass, this.load.id), this.dispatchEvent(new CustomEvent("load-deleted", { detail: { id: this.load.id }, bubbles: !0, composed: !0 }));
  }
  _move(t) {
    this.dispatchEvent(new CustomEvent("move-load", { detail: { id: this.load.id, delta: t }, bubbles: !0, composed: !0 }));
  }
  _hero() {
    const t = this.load, e = this.live, [i, s] = Ut(T(t) ? Math.abs((e == null ? void 0 : e.power_w) ?? 0) : (e == null ? void 0 : e.power_w) ?? 0), a = T(t) && e ? e.power_w > 1 ? "mdi:arrow-up-bold" : e.power_w < -1 ? "mdi:arrow-down-bold" : "" : "", o = (e == null ? void 0 : e.reason) ?? "idle", n = Ce(o), c = t.icon || We(t.type), l = B(t) ? t.ev_max_current * 230 * t.ev_phases : T(t) ? Math.max(t.bat_max_charge_w, t.bat_max_discharge_w) : t.nominal_power_w, h = e != null && e.kwh_today ? (e.solar_kwh_today ?? 0) / e.kwh_today : null;
    return d`<div class="card hero">
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
      <div class="big">${a ? d`<ha-icon class="dir" .icon=${a}></ha-icon>` : m}<span class="v">${i}</span><span class="u">${s}</span></div>
      <sm-sparkline .points=${this.spark} .max=${l} .height=${90} .label=${r("detail.last_6h")}></sm-sparkline>
      <div class="info">
        ${(e == null ? void 0 : e.temperature) != null ? d`<span><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature.toFixed(1)} °C</span>` : m}
        ${(e == null ? void 0 : e.soc) != null ? d`<span><ha-icon icon="mdi:battery-charging"></ha-icon>${Math.round(e.soc)}%</span>` : m}
        ${(e == null ? void 0 : e.current_a) != null && B(t) ? d`<span><ha-icon icon="mdi:current-ac"></ha-icon>${Math.round(e.current_a)} A</span>` : m}
        <span><ha-icon icon="mdi:lightning-bolt"></ha-icon>${w((e == null ? void 0 : e.kwh_today) ?? 0, 1)} ${T(t) ? r("load.charged_today") : r("load.today")}</span>
        ${T(t) ? d`<span><ha-icon icon="mdi:home-export-outline"></ha-icon>${w((e == null ? void 0 : e.discharge_kwh_today) ?? 0, 1)} ${r("load.discharged")}</span>` : m}
        ${h !== null ? d`<span><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${Math.round(h * 100)}% ${r("load.from_solar")}</span>` : m}
      </div>
      <hr />
      <div class="mode">
        <div class="l">${r("f.mode")}</div>
        <sm-segmented .options=${Rt(t.type)} .value=${t.mode}
          @value-changed=${(u) => this.dispatchEvent(new CustomEvent("set-mode", { detail: { id: t.id, mode: u.detail.value }, bubbles: !0, composed: !0 }))}></sm-segmented>
        <div class="d">${r(`${dt(t.mode, t.type)}.desc`)}</div>
      </div>
    </div>`;
  }
  _controlCard() {
    const t = this.load;
    return d`<div class="card list">
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
    if (t.show && !t.show(e)) return m;
    const i = t.rows.filter((s) => !s.show || s.show(e));
    return d`<div class="card list">
      <div class="card-head"><h2>${t.title}</h2>${t.meta && t.meta(e) ? d`<span class="meta">${t.meta(e)}</span>` : m}</div>
      ${i.map(
      (s) => {
        var a, o, n;
        return s.toggle ? d`<sm-list-row .icon=${s.icon} .heading=${s.title} .secondary=${((a = s.secondary) == null ? void 0 : a.call(s, e, this.live)) ?? ""}>
              <sm-toggle .checked=${!!e[s.toggle]} @change=${(c) => this._save({ [s.toggle]: c.detail.checked })}></sm-toggle>
            </sm-list-row>` : d`<sm-list-row .icon=${s.icon} .heading=${s.title} .secondary=${((o = s.secondary) == null ? void 0 : o.call(s, e, this.live)) ?? ""} .value=${((n = s.value) == null ? void 0 : n.call(s, e, this.live)) ?? ""}
              clickable @row-click=${() => this._openDialog(s.title, s.fields ?? [])}></sm-list-row>`;
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
          </sm-dialog>` : m}
    `;
  }
};
j.styles = [
  D,
  me,
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
], j.prototype, "hass", 2);
I([
  _({ attribute: !1 })
], j.prototype, "load", 2);
I([
  _({ attribute: !1 })
], j.prototype, "live", 2);
I([
  _({ attribute: !1 })
], j.prototype, "spark", 2);
I([
  _({ type: Number })
], j.prototype, "priority", 2);
I([
  _({ type: Number })
], j.prototype, "count", 2);
I([
  y()
], j.prototype, "_dialog", 2);
I([
  y()
], j.prototype, "_draft", 2);
I([
  y()
], j.prototype, "_busy", 2);
I([
  y()
], j.prototype, "_error", 2);
I([
  y()
], j.prototype, "_confirmDelete", 2);
j = I([
  C("sm-load-detail")
], j);
var Ui = Object.defineProperty, Ri = Object.getOwnPropertyDescriptor, ge = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ri(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Ui(e, i, a), a;
};
const At = (t, e) => e.map((i) => ({ value: i, label: r(`s.${t}.${i}`) })), Mt = (t, e) => {
  var i;
  return e ? ((i = t.states[e]) == null ? void 0 : i.attributes.friendly_name) ?? e : r("detail.not_set");
}, Vi = (t) => {
  var e;
  return Object.keys(((e = t.services) == null ? void 0 : e.notify) ?? {}).filter((i) => !["send_message", "persistent_notification"].includes(i)).sort((i, s) => Number(s.startsWith("mobile_app_")) - Number(i.startsWith("mobile_app_")) || i.localeCompare(s)).map((i) => ({
    value: `notify.${i}`,
    label: i.startsWith("mobile_app_") ? `📱 ${i.slice(11).replace(/_/g, " ")}` : i.replace(/_/g, " ")
  }));
}, Fi = (t) => [
  {
    id: "general",
    icon: "mdi:cog-outline",
    fields: [{ key: "enabled", kind: "bool", helper: r("s.enabled.help") }],
    summary: (e) => `${e.enabled ? r("s.enabled") : r("site.disabled")} · ${r("s.version").replace("{v}", "0.2.2")}`
  },
  {
    id: "meter",
    icon: "mdi:meter-electric-outline",
    fields: [
      { key: "grid_mode", kind: "select", options: At("grid_mode", ["single", "split"]) },
      { key: "grid_power_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode !== "split" },
      { key: "grid_sign", kind: "select", options: At("grid_sign", ["import_positive", "export_positive"]), show: (e) => e.grid_mode !== "split" },
      { key: "grid_import_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "grid_export_entity", kind: "entity", domains: ["sensor"], show: (e) => e.grid_mode === "split" },
      { key: "voltage", kind: "number", unit: "V" }
    ],
    summary: (e, i) => Mt(i, e.grid_mode === "split" ? e.grid_import_entity : e.grid_power_entity)
  },
  {
    id: "pv",
    icon: "mdi:solar-power-variant",
    fields: [
      { key: "pv_power_entity", kind: "entity", domains: ["sensor"] },
      { key: "pv_forecast_today_entity", kind: "entity", domains: ["sensor"], helper: r("s.forecast.help") },
      { key: "pv_forecast_tomorrow_entity", kind: "entity", domains: ["sensor"] }
    ],
    summary: (e, i) => Mt(i, e.pv_power_entity)
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
      { key: "notify_services", kind: "multi", options: Vi(t), helper: r("s.notify_services.help") },
      { key: "notify_peak", kind: "bool", helper: r("s.notify_peak.help") },
      { key: "notify_ev", kind: "bool", helper: r("s.notify_ev.help") },
      { key: "notify_faults", kind: "bool", helper: r("s.notify_faults.help") }
    ],
    summary: (e) => {
      const i = (e.notify_services ?? []).length;
      return i ? r("s.notify.summary").replace("{n}", String(i)) : r("detail.off");
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
  }
];
let q = class extends k {
  constructor() {
    super(...arguments), this.narrow = !1, this._cat = null, this._draft = {}, this._testMsg = "";
  }
  willUpdate(t) {
    t.has("settings") && (this._draft = { ...this.settings }), this._cat === null && !this.narrow && (this._cat = "meter");
  }
  async _change(t, e) {
    this._draft = { ...this._draft, [t]: e }, this.dispatchEvent(new CustomEvent("saving", { bubbles: !0, composed: !0 }));
    try {
      await hi(this.hass, { [t]: e }), this.dispatchEvent(new CustomEvent("settings-saved", { detail: { settings: this._draft }, bubbles: !0, composed: !0 }));
    } catch (i) {
      this.dispatchEvent(new CustomEvent("save-error", { detail: { error: (i == null ? void 0 : i.message) ?? String(i) }, bubbles: !0, composed: !0 }));
    }
  }
  async _test() {
    this._testMsg = "";
    try {
      await _i(this.hass), this._testMsg = r("s.notify.test_sent");
    } catch (t) {
      this._testMsg = (t == null ? void 0 : t.message) ?? String(t);
    }
  }
  render() {
    const t = Fi(this.hass), e = t.find((a) => a.id === this._cat), i = !this.narrow || !e, s = !!e;
    return d`<div class="md ${this.narrow ? "single" : ""}">
      ${i ? d`<div class="card nav">
            ${t.map(
      (a) => d`<sm-list-row class=${a.id === this._cat && !this.narrow ? "sel" : ""} .icon=${a.icon} .heading=${r(`s.cat.${a.id}`)}
                .secondary=${a.summary(this._draft, this.hass)} clickable @row-click=${() => this._cat = a.id}></sm-list-row>`
    )}
          </div>` : ""}
      ${s ? d`<div class="card detail">
            <div class="card-head">
              ${this.narrow ? d`<button class="icon" @click=${() => this._cat = null}><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
              <h2>${r(`s.cat.${e.id}`)}</h2>
            </div>
            <div class="card-body">
              <p class="desc">${r(`s.cat.${e.id}.desc`)}</p>
              <sm-form .hass=${this.hass} prefix="s" .fields=${e.fields} .data=${this._draft}
                @value-changed=${(a) => this._change(a.detail.key, a.detail.value)}></sm-form>
              ${e.id === "notify" ? d`<div class="test"><button class="text" ?disabled=${!(this._draft.notify_services ?? []).length}
                    @click=${this._test}>${r("s.notify.test")}</button><span>${this._testMsg}</span></div>` : ""}
            </div>
          </div>` : ""}
    </div>`;
  }
};
q.styles = [
  D,
  me,
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
ge([
  _({ attribute: !1 })
], q.prototype, "hass", 2);
ge([
  _({ attribute: !1 })
], q.prototype, "settings", 2);
ge([
  _({ type: Boolean })
], q.prototype, "narrow", 2);
ge([
  y()
], q.prototype, "_cat", 2);
ge([
  y()
], q.prototype, "_draft", 2);
ge([
  y()
], q.prototype, "_testMsg", 2);
q = ge([
  C("sm-settings")
], q);
var Zi = Object.defineProperty, qi = Object.getOwnPropertyDescriptor, G = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? qi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Zi(e, i, a), a;
};
const Y = 1e3, x = 64, V = 16, Et = 18, it = 14, Pt = 12, Gi = (t) => {
  const e = Math.pow(10, Math.floor(Math.log10(t))), i = t / e;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 2.5 ? 2.5 : i <= 5 ? 5 : 10) * e;
}, st = (t, e) => e === "W" ? Math.abs(t) >= 1e3 ? `${(t / 1e3).toFixed(1)} kW` : `${Math.round(t)} W` : `${Math.round(t * 10) / 10}${e ? " " + e : ""}`;
let ke = class extends k {
  constructor() {
    super(...arguments), this.x = [], this.panels = [], this._hover = null;
  }
  render() {
    var N, S;
    const t = this.x.length;
    if (t < 2) return d`<slot></slot>`;
    const e = this.x[0], i = this.x[t - 1], s = (v) => x + (v - e) / Math.max(1, i - e) * (Y - x - V);
    let a = 0;
    const o = [], n = [];
    for (const v of this.panels) {
      const $ = a + Et, ve = v.height;
      n.push([$, ve]), o.push(A`<text class="ptitle" x="${x}" y="${a + 12}">${v.title}</text>`), o.push(A`<rect class="plot" x="${x}" y="${$}" width="${Y - x - V}" height="${ve}" rx="2"></rect>`), (N = v.series) != null && N.length && o.push(this._series(v, $, ve, s)), (S = v.bands) != null && S.length && v.bands.forEach((fe, ie) => {
        const K = $ + 4 + ie * (Pt + 4);
        o.push(A`<text class="axis" x="${x - 8}" y="${K + 10}" text-anchor="end">${fe.label}</text>`), fe.segments.forEach(
          (R) => o.push(A`<rect x="${s(R.from)}" y="${K}" width="${Math.max(1, s(R.to) - s(R.from))}" height="${Pt}" fill="${R.color}" rx="2"><title>${R.title}</title></rect>`)
        );
      }), a = $ + ve + it;
    }
    const c = i - e, l = c <= 1.5 * 86400 ? 3 * 3600 : c <= 8 * 86400 ? 86400 : 7 * 86400, h = [], u = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
    for (let v = Math.ceil((e - u) / l) * l + u; v <= i; v += l) h.push(v);
    const p = (v) => {
      const $ = new Date(v * 1e3);
      return l < 86400 ? $.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : $.toLocaleDateString([], { weekday: "short", day: "numeric" });
    }, f = a - it + 16, g = f + 6;
    h.forEach((v) => {
      o.push(A`<line class="gridline" x1="${s(v)}" x2="${s(v)}" y1="${Et}" y2="${a - it}" stroke-dasharray="2 4"></line>`), o.push(A`<text class="axis" x="${s(v)}" y="${f}" text-anchor="middle">${p(v)}</text>`);
    });
    const b = this._hover;
    b !== null && n.forEach(
      ([v, $]) => o.push(A`<line x1="${s(this.x[b])}" x2="${s(this.x[b])}" y1="${v}" y2="${v + $}" stroke="var(--primary-text-color)" stroke-opacity="0.35"></line>`)
    );
    const L = (v) => {
      const $ = v.currentTarget.getBoundingClientRect(), ve = (v.clientX - $.left) / $.width * Y, fe = e + (ve - x) / (Y - x - V) * (i - e);
      let ie = 0, K = t - 1;
      for (; K - ie > 1; ) {
        const R = ie + K >> 1;
        this.x[R] < fe ? ie = R : K = R;
      }
      this._hover = Math.abs(this.x[ie] - fe) < Math.abs(this.x[K] - fe) ? ie : K;
    }, z = this.panels.flatMap((v) => (v.series ?? []).map(($) => ({ ...$, unit: $.unit ?? v.unit })));
    return d`
      <svg viewBox="0 0 ${Y} ${g}" @mousemove=${L} @mouseleave=${() => this._hover = null}>${o}</svg>
      ${b !== null ? d`<div class="tip" style="${s(this.x[b]) > Y / 2 ? "left:72px" : "right:24px"}">
            <div><b>${new Date(this.x[b] * 1e3).toLocaleString([], { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></div>
            ${z.map((v) => {
      const $ = v.values[b];
      return $ == null ? m : d`<div><span class="dot" style="background:${v.color}"></span>${v.label}: ${st($, v.unit)}</div>`;
    })}
          </div>` : m}
      <div class="legend">
        ${z.filter((v) => v.legend !== !1).map((v) => d`<span><span class="dot" style="background:${v.color}"></span>${v.label}</span>`)}
        <slot name="legend"></slot>
      </div>
    `;
  }
  _series(t, e, i, s) {
    const a = this.x.length, o = {}, n = [], c = [];
    for (const g of t.series)
      if (g.kind === "area" && g.stack) {
        const b = o[g.stack] ?? new Array(a).fill(0), L = b.map((z, N) => z + Math.max(0, g.values[N] ?? 0));
        c.push(b), n.push(L), o[g.stack] = L;
      } else
        c.push(new Array(a).fill(0)), n.push(g.values.map((b) => b ?? 0));
    let l = -1 / 0, h = 1 / 0;
    t.series.forEach((g, b) => {
      for (let L = 0; L < a; L++) {
        const z = g.values[L];
        z != null && (l = Math.max(l, g.kind === "area" ? n[b][L] : z), h = Math.min(h, g.kind === "area" ? 0 : z));
      }
    }), l === -1 / 0 && (l = 1, h = 0), t.zero !== !1 && (h = Math.min(h, 0), l = Math.max(l, 0));
    const u = Gi((l - h) / 3 || 1);
    l = Math.ceil((l + (l - h) * 0.04) / u) * u, h = Math.floor(h / u) * u;
    const p = (g) => e + i - (g - h) / (l - h) * i, f = [];
    for (let g = h; g <= l + u / 2; g += u)
      f.push(A`<line class="gridline" x1="${x}" x2="${Y - V}" y1="${p(g)}" y2="${p(g)}"></line>
        <text class="axis" x="${x - 8}" y="${p(g) + 4}" text-anchor="end">${st(g, t.unit)}</text>`);
    return h < 0 && f.push(A`<line x1="${x}" x2="${Y - V}" y1="${p(0)}" y2="${p(0)}" stroke="var(--secondary-text-color)" stroke-opacity="0.5"></line>`), t.series.forEach((g, b) => {
      if (g.kind === "area") {
        let N = "";
        for (let S = 0; S < a; S++) N += `${S ? "L" : "M"}${s(this.x[S]).toFixed(1)},${p(n[b][S]).toFixed(1)}`;
        for (let S = a - 1; S >= 0; S--) N += `L${s(this.x[S]).toFixed(1)},${p(c[b][S]).toFixed(1)}`;
        f.push(A`<path d="${N}Z" fill="${g.color}" fill-opacity="0.45" stroke="${g.color}" stroke-width="1"></path>`);
        return;
      }
      let L = "", z = !1;
      for (let N = 0; N < a; N++) {
        const S = g.values[N];
        if (S == null) {
          z = !1;
          continue;
        }
        const v = s(this.x[N]).toFixed(1), $ = p(S).toFixed(1);
        g.kind === "step" && z ? L += `H${v}V${$}` : L += `${z ? "L" : "M"}${v},${$}`, z = !0;
      }
      f.push(A`<path d="${L}" fill="none" stroke="${g.color}" stroke-width="1.8" stroke-dasharray="${g.dashed ? "5 4" : ""}"></path>`);
    }), f;
  }
};
ke.styles = [
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
G([
  _({ attribute: !1 })
], ke.prototype, "x", 2);
G([
  _({ attribute: !1 })
], ke.prototype, "panels", 2);
G([
  y()
], ke.prototype, "_hover", 2);
ke = G([
  C("sm-chart")
], ke);
let pe = class extends k {
  constructor() {
    super(...arguments), this.bars = [], this.height = 180, this.unit = "kWh", this.limit = null;
  }
  render() {
    if (!this.bars.length) return d`<slot></slot>`;
    const t = this.height, e = t - 26, i = (l) => l.parts.reduce((h, u) => h + u.value, 0), s = Math.max(this.limit ?? 0, ...this.bars.map(i), 1e-3) * 1.1, a = 640, o = (a - x - V) / this.bars.length, n = (l) => e - l / s * e, c = Math.ceil(this.bars.length / 10);
    return d`<svg viewBox="0 0 ${a} ${t}">
      <rect class="plot" x="${x}" y="0" width="${a - x - V}" height="${e}" rx="2"></rect>
      ${[0, 1, 2, 3].map((l) => {
      const h = s / 1.1 * (l / 3);
      return A`<line class="gridline" x1="${x}" x2="${a - V}" y1="${n(h)}" y2="${n(h)}"></line>
          <text class="axis" x="${x - 8}" y="${n(h) + 4}" text-anchor="end">${st(h, this.unit)}</text>`;
    })}
      ${this.bars.map((l, h) => {
      let u = 0;
      const p = x + h * o + o * 0.18;
      return A`${l.parts.map((f) => {
        const g = n(u);
        u += f.value;
        const b = n(u);
        return A`<rect x="${p}" width="${o * 0.64}" y="${b}" height="${Math.max(0, g - b)}" fill="${f.color}" rx="2"><title>${l.label}: ${f.title}</title></rect>`;
      })}${h % c === 0 ? A`<text class="axis" x="${p + o * 0.32}" y="${t - 6}" text-anchor="middle">${l.label}</text>` : m}`;
    })}
      ${this.limit ? A`<line x1="${x}" x2="${a - V}" y1="${n(this.limit)}" y2="${n(this.limit)}" stroke="var(--sm-err)" stroke-dasharray="6 4"></line>` : m}
    </svg>`;
  }
};
pe.styles = [
  D,
  P`
      svg { width: 100%; height: auto; display: block; }
      .axis { font-size: 12px; fill: var(--secondary-text-color); }
      .plot { fill: var(--sm-fill); }
      .gridline { stroke: var(--sm-border); }
    `
];
G([
  _({ attribute: !1 })
], pe.prototype, "bars", 2);
G([
  _({ type: Number })
], pe.prototype, "height", 2);
G([
  _()
], pe.prototype, "unit", 2);
G([
  _({ type: Number })
], pe.prototype, "limit", 2);
pe = G([
  C("sm-bars")
], pe);
var Ki = Object.defineProperty, Yi = Object.getOwnPropertyDescriptor, te = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Yi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Ki(e, i, a), a;
};
const Pe = "var(--sm-solar)", ye = "var(--sm-grid)", Ot = {
  solar: "var(--sm-solar)",
  grid: "var(--sm-grid)",
  warn: "var(--sm-err)",
  ok: "var(--sm-ok)"
}, Ji = (t) => {
  const e = /* @__PURE__ */ new Date(), i = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() / 1e3, s = e.getTime() / 1e3;
  switch (t) {
    case "yesterday":
      return [i - 86400, i];
    case "7d":
      return [i - 6 * 86400, s];
    case "30d":
      return [i - 29 * 86400, s];
    case "month":
      return [new Date(e.getFullYear(), e.getMonth(), 1).getTime() / 1e3, s];
    default:
      return [i, s];
  }
};
let U = class extends k {
  constructor() {
    super(...arguments), this.loads = [], this.loadId = null, this.peakLimit = null, this._range = "today", this._data = null, this._loading = !1, this._loadedFor = "";
  }
  updated(t) {
    const e = `${this.loadId}|${this._range}`;
    (t.has("loadId") || t.has("hass")) && this.hass && e !== this._loadedFor && this._fetch();
  }
  async _fetch() {
    this._loadedFor = `${this.loadId}|${this._range}`, this._loading = !0;
    const [t, e] = Ji(this._range);
    try {
      this._data = await Ht(this.hass, t, e, this.loadId);
    } finally {
      this._loading = !1;
    }
  }
  _downsample(t) {
    if (t.length <= 1200) return t;
    const i = Math.ceil(t.length / 1200), s = [];
    for (let a = 0; a < t.length; a += i) {
      const o = t.slice(a, a + i), n = (h) => {
        const u = o.map(h).filter((p) => p != null);
        return u.length ? u.reduce((p, f) => p + f, 0) / u.length : null;
      }, c = o[o.length - 1], l = {};
      for (const h of Object.keys(c[3]))
        l[h] = [n((u) => {
          var p;
          return (p = u[3][h]) == null ? void 0 : p[0];
        }), n((u) => {
          var p;
          return (p = u[3][h]) == null ? void 0 : p[1];
        }), c[3][h][2], o.some((u) => {
          var p;
          return (p = u[3][h]) == null ? void 0 : p[3];
        }) ? 1 : 0, n((u) => {
          var p;
          return (p = u[3][h]) == null ? void 0 : p[4];
        })];
      s.push([o[0][0], n((h) => h[1]), n((h) => h[2]), l]);
    }
    return s;
  }
  _band(t, e, i) {
    var o;
    const s = [];
    let a = null;
    for (let n = 0; n < t.length; n++) {
      const c = t[n][3][e], l = c ? c[2] : null, h = l ? Ce(l) : "", p = l && (c[3] || l === "peak_guard") && h ? Ot[h] : null, f = l ? r(`reason.${l}`) : "", g = ((o = t[n + 1]) == null ? void 0 : o[0]) ?? t[n][0] + 60;
      p && a && a.color === p && a.title === f ? a.to = g : (a && s.push(a), a = p ? { from: t[n][0], to: g, color: p, title: f } : null);
    }
    return a && s.push(a), { label: i, segments: s };
  }
  _history() {
    var s, a;
    const t = this._downsample(((a = (s = this._data) == null ? void 0 : s.timeline) == null ? void 0 : a.rows) ?? []);
    if (t.length < 2) return d`<div class="empty">${r("a.no_data")}</div>`;
    const e = t.map((o) => o[0]), i = [];
    if (this.loadId) {
      const o = this.loadId, n = this.loads.find((l) => l.id === o), c = [
        { label: r("a.from_solar"), color: Pe, kind: "area", stack: "l", values: t.map((l) => {
          var h;
          return ((h = l[3][o]) == null ? void 0 : h[1]) ?? 0;
        }) },
        { label: r("a.from_grid"), color: ye, kind: "area", stack: "l", values: t.map((l) => {
          var h, u;
          return Math.max(0, (((h = l[3][o]) == null ? void 0 : h[0]) ?? 0) - (((u = l[3][o]) == null ? void 0 : u[1]) ?? 0));
        }) },
        ...(n == null ? void 0 : n.type) === "battery" ? [{ label: r("a.discharged"), color: "var(--sm-ok)", kind: "area", stack: "d", values: t.map((l) => {
          var h;
          return Math.max(0, -(((h = l[3][o]) == null ? void 0 : h[0]) ?? 0));
        }) }] : [],
        { label: r("a.pv"), color: "var(--secondary-text-color)", kind: "line", dashed: !0, values: t.map((l) => l[1]) }
      ];
      if (i.push({ title: `${r("a.power")} (W)`, unit: "W", height: 220, series: c }), t.some((l) => {
        var h;
        return ((h = l[3][o]) == null ? void 0 : h[4]) != null;
      })) {
        const l = (n == null ? void 0 : n.type) === "ev" || (n == null ? void 0 : n.type) === "battery";
        i.push({
          title: l ? `${r("a.soc")} (%)` : `${r("a.temperature")} (°C)`,
          unit: l ? "%" : "°C",
          height: 90,
          zero: !1,
          series: [{ label: r(l ? "a.soc" : "a.temperature"), color: "var(--sm-err)", kind: "line", values: t.map((h) => {
            var u;
            return ((u = h[3][o]) == null ? void 0 : u[4]) ?? null;
          }) }]
        });
      }
      i.push({ title: r("a.why"), unit: "", height: 22, bands: [this._band(t, o, "")] });
    } else {
      const o = this.loads.map((n, c) => ({
        label: n.name,
        color: be[c % be.length],
        kind: "area",
        stack: "loads",
        values: t.map((l) => {
          var h;
          return Math.max(0, ((h = l[3][n.id]) == null ? void 0 : h[0]) ?? 0);
        })
      }));
      o.push({ label: r("a.pv"), color: Pe, kind: "line", values: t.map((n) => n[1]) }), i.push({ title: `${r("a.power")} (W)`, unit: "W", height: 220, series: o }), i.push({
        title: `${r("site.grid")} (W) · + ${r("a.import").toLowerCase()} / − ${r("a.export").toLowerCase()}`,
        unit: "W",
        height: 90,
        series: [{ label: r("site.grid"), color: ye, kind: "line", values: t.map((n) => n[2]) }]
      }), i.push({
        title: r("a.why"),
        unit: "",
        height: this.loads.length * 16 + 6,
        bands: this.loads.map((n) => this._band(t, n.id, n.name.length > 9 ? n.name.slice(0, 8) + "…" : n.name))
      });
    }
    return d`<sm-chart .x=${e} .panels=${i}></sm-chart>`;
  }
  _tile(t, e, i) {
    return d`<div class="tile"><div class="v">${t}</div><div class="l">${e}</div>
      ${i ? d`<div class="bar"><div style="width:${i[0] * 100}%;background:${Pe}"></div><div style="width:${i[1] * 100}%;background:${ye}"></div></div>` : m}</div>`;
  }
  _summary() {
    var i;
    const t = (i = this._data) == null ? void 0 : i.summary;
    if (!t) return m;
    if (this.loadId) {
      const s = t.loads[this.loadId];
      if (!s) return d`<div class="empty">${r("a.no_data")}</div>`;
      const a = s.solar_share ?? 0, o = this.loads.find((c) => c.id === this.loadId);
      if ((o == null ? void 0 : o.type) === "battery") {
        const c = o.bat_capacity_kwh || 0;
        return d`<div class="tiles">
          ${this._tile(w(s.kwh), r("a.charged"), s.kwh > 0 ? [a, 1 - a] : void 0)}
          ${this._tile(se(s.solar_share), r("a.solar_share"))}
          ${this._tile(w(s.discharge_kwh ?? 0), r("a.discharged"))}
          ${this._tile(se(s.efficiency ?? null), r("a.efficiency"))}
          ${this._tile(c ? ((s.discharge_kwh ?? 0) / c).toFixed(1) : "–", r("a.cycles"))}
          ${this._tile(tt(s.saving), r("a.saving"))}
        </div>`;
      }
      const n = Object.entries(s.reasons ?? {}).filter(([c]) => Ce(c)).sort((c, l) => l[1] - c[1]);
      return d`<div class="tiles">
          ${this._tile(w(s.kwh), r("a.energy"), s.kwh > 0 ? [a, 1 - a] : void 0)}
          ${this._tile(se(s.solar_share), r("a.solar_share"))}
          ${this._tile(w(s.grid_kwh), r("a.grid"))}
          ${this._tile(et(s.runtime_s), r("a.runtime"))}
          ${this._tile(String(s.starts), r("a.starts"))}
          ${this._tile(tt(s.saving), r("a.saving"))}
        </div>
        ${n.length ? d`<div class="why">${n.map(([c, l]) => d`<span class="pill"><span class="swatch" style="background:${Ot[Ce(c)]}"></span>${r(`reason.${c}`)} <b>${et(l)}</b></span>`)}</div>` : m}`;
    }
    const e = t.house;
    return d`<div class="tiles">
        ${this._tile(w(e.pv_kwh, 1), r("a.pv"))}
        ${this._tile(se(e.self_consumption), r("a.self_consumption"))}
        ${this._tile(se(e.self_sufficiency), r("a.self_sufficiency"))}
        ${this._tile(w(e.import_kwh, 1), r("a.import"))}
        ${this._tile(w(e.export_kwh, 1), r("a.export"))}
        ${this._tile(M(e.peak_w), r("a.peak"))}
      </div>
      <table>
        <tr><th>${r("a.distribution")}</th><th class="num">${r("a.energy")}</th><th class="num">${r("a.solar_share")}</th><th class="num">${r("a.runtime")}</th><th class="num">${r("a.saving")}</th></tr>
        ${this.loads.map((s, a) => {
      const o = t.loads[s.id];
      return o ? d`<tr><td><span class="swatch" style="background:${be[a % be.length]}"></span>${s.name}</td>
            <td class="num">${w(o.kwh)}</td><td class="num">${se(o.solar_share)}</td><td class="num">${et(o.runtime_s)}</td><td class="num">${tt(o.saving)}</td></tr>` : m;
    })}
      </table>`;
  }
  _daily() {
    var s;
    const t = ((s = this._data) == null ? void 0 : s.days) ?? {}, e = Object.keys(t).sort();
    if (e.length < 2) return m;
    const i = e.map((a) => {
      const o = `${Number(a.slice(8))}/${Number(a.slice(5, 7))}`;
      if (this.loadId) {
        const n = t[a].loads[this.loadId] ?? { kwh: 0, solar_kwh: 0 };
        return { label: o, parts: [
          { value: n.solar_kwh, color: Pe, title: `${r("a.solar")} ${w(n.solar_kwh)}` },
          { value: Math.max(0, n.kwh - n.solar_kwh), color: ye, title: `${r("a.grid")} ${w(n.kwh - n.solar_kwh)}` }
        ] };
      }
      return { label: o, parts: this.loads.map((n, c) => {
        var h;
        const l = ((h = t[a].loads[n.id]) == null ? void 0 : h.kwh) ?? 0;
        return { value: l, color: be[c % be.length], title: `${n.name} ${w(l)}` };
      }) };
    });
    return d`<div class="card"><div class="card-head"><h2>${r("a.daily")}</h2></div><div class="card-body"><sm-bars .bars=${i}></sm-bars></div></div>`;
  }
  _rhythm() {
    var i, s;
    if (!this.loadId) return m;
    const t = ((s = (i = this._data) == null ? void 0 : i.rhythm) == null ? void 0 : s[this.loadId]) ?? [];
    if (!t.some((a) => a > 0)) return m;
    const e = t.map((a, o) => ({ label: `${o}u`, parts: [{ value: a, color: Pe, title: M(a) }] }));
    return d`<div class="card"><div class="card-head"><h2>${r("a.rhythm")}</h2><span class="meta">${r("a.rhythm_meta")}</span></div>
      <div class="card-body"><sm-bars .bars=${e} unit="W" .height=${150}></sm-bars></div></div>`;
  }
  _quarters() {
    var a;
    if (this.loadId) return m;
    const t = ((a = this._data) == null ? void 0 : a.quarters) ?? {}, e = Object.keys(t).sort();
    if (!e.length) return m;
    const i = this.peakLimit, s = e.length === 1 ? t[e[0]].map(([o, n]) => ({
      label: new Date(o * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      parts: [{ value: n, color: i && n > i ? "var(--sm-err)" : ye, title: M(n) }]
    })) : e.map((o) => {
      const n = Math.max(...t[o].map((c) => c[1]));
      return { label: `${Number(o.slice(8))}/${Number(o.slice(5, 7))}`, parts: [{ value: n, color: i && n > i ? "var(--sm-err)" : ye, title: M(n) }] };
    });
    return d`<div class="card"><div class="card-head"><h2>${r("a.quarters")}</h2><span class="meta">${r("site.peak_limit")} ${M(i)}</span></div>
      <div class="card-body"><sm-bars .bars=${s} unit="W" .limit=${i}></sm-bars></div></div>`;
  }
  _sessions() {
    var s;
    const t = this.loadId ? this.loads.find((a) => a.id === this.loadId) : null;
    if (!t || t.type !== "ev") return m;
    const e = [...((s = this._data) == null ? void 0 : s.sessions) ?? []].reverse();
    if (!e.length) return m;
    const i = (a) => a ? new Date(a * 1e3).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : r("a.ongoing");
    return d`<div class="card"><div class="card-head"><h2>${r("a.sessions")}</h2><span class="meta">${e.length}</span></div>
      <table>
        <tr><th>${r("a.start")}</th><th>${r("a.end")}</th><th class="num">${r("a.energy")}</th><th class="num">${r("a.solar_share")}</th><th class="num">${r("a.soc")}</th></tr>
        ${e.map((a) => d`<tr><td>${i(a.start)}</td><td>${i(a.end)}</td><td class="num">${w(a.kwh)}</td>
          <td class="num">${se(a.kwh > 0 ? a.solar_kwh / a.kwh : null)}</td><td class="num">${a.soc_start ?? "–"}% → ${a.soc_end ?? "–"}%</td></tr>`)}
      </table></div>`;
  }
  render() {
    const t = [{ value: "", label: r("a.all"), icon: "mdi:home-lightning-bolt-outline" }].concat(
      this.loads.map((i) => ({ value: i.id, label: i.name, icon: i.icon || We(i.type) }))
    ), e = ["today", "yesterday", "7d", "30d", "month"];
    return d`
      <div class="toolbar">
        <sm-segmented class="loads" wrap .options=${t} .value=${this.loadId ?? ""}
          @value-changed=${(i) => {
      this.loadId = i.detail.value || null, this.dispatchEvent(new CustomEvent("analytics-load", { detail: { id: this.loadId }, bubbles: !0, composed: !0 }));
    }}></sm-segmented>
        <sm-segmented class="range" size="sm" .options=${e.map((i) => ({ value: i, label: r(`a.range.${i}`) }))} .value=${this._range}
          @value-changed=${(i) => {
      this._range = i.detail.value, this._fetch();
    }}></sm-segmented>
      </div>
      <div class="card"><div class="card-head"><h2>${r("a.summary")}</h2>${this._loading ? d`<span class="meta">…</span>` : m}</div>${this._summary()}</div>
      <div class="card"><div class="card-head"><h2>${r("a.timeline")}</h2></div><div class="card-body">${this._history()}</div></div>
      ${this._sessions()}
      <div class="two">${this._daily()}${this._rhythm()}${this._quarters()}</div>
    `;
  }
};
U.styles = [
  D,
  me,
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
te([
  _({ attribute: !1 })
], U.prototype, "hass", 2);
te([
  _({ attribute: !1 })
], U.prototype, "loads", 2);
te([
  _()
], U.prototype, "loadId", 2);
te([
  _({ type: Number })
], U.prototype, "peakLimit", 2);
te([
  y()
], U.prototype, "_range", 2);
te([
  y()
], U.prototype, "_data", 2);
te([
  y()
], U.prototype, "_loading", 2);
U = te([
  C("sm-analytics")
], U);
var Xi = Object.defineProperty, Qi = Object.getOwnPropertyDescriptor, O = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Qi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Xi(e, i, a), a;
};
const ea = 6 * 3600;
let E = class extends k {
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
    this._started = !0, vi(this.hass.language);
    try {
      await this._reload(), this._unsub = await wt(this.hass, (t) => this._live = t), this._loadSpark(), this._sparkTimer = window.setInterval(() => this._loadSpark(), 6e4);
    } catch (t) {
      this._error = (t == null ? void 0 : t.message) ?? String(t), this._started = !1;
    }
  }
  async _reload() {
    this._config = await ci(this.hass), this._live = this._config.live;
  }
  async _loadSpark() {
    const t = Date.now() / 1e3;
    try {
      const e = await Ht(this.hass, t - ea, t, null), i = {};
      for (const s of e.timeline.rows)
        for (const [a, o] of Object.entries(s[3]))
          (i[a] ?? (i[a] = [])).push([s[0], Math.abs(o[0] ?? 0), o[1] ?? 0]);
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
        await this._reload(), this._unsub = await wt(this.hass, (i) => this._live = i);
        return;
      } catch {
      }
    }
  }
  _flashSave(t) {
    this._save = t, window.clearTimeout(this._saveTimer), t === "saved" && (this._saveTimer = window.setTimeout(() => this._save = "", 2500));
  }
  _setOrder(t) {
    const e = this._config, i = new Map(e.loads.map((s) => [s.id, s]));
    this._config = { ...e, loads: t.map((s) => i.get(s)).filter(Boolean) };
  }
  async _setMode(t, e) {
    const i = this._config;
    this._config = { ...i, loads: i.loads.map((s) => s.id === t ? { ...s, mode: e } : s) }, this._flashSave("saving"), await mi(this.hass, t, e), this._flashSave("saved");
  }
  async _setMinPower(t, e) {
    const i = this._config;
    this._config = { ...i, loads: i.loads.map((s) => s.id === t ? { ...s, ev_min_power_w: e } : s) }, this._flashSave("saving"), await ui(this.hass, t, e), this._flashSave("saved");
  }
  async _moveLoad(t, e) {
    const i = this._config.loads.map((o) => o.id), s = i.indexOf(t), a = s + e;
    a < 0 || a >= i.length || ([i[s], i[a]] = [i[a], i[s]], this._setOrder(i), await Wt(this.hass, i));
  }
  _addFields() {
    var a;
    const t = (o) => o.type === "ev", e = (o) => o.type === "battery", i = (o) => !t(o) && !e(o), s = (o) => t(o) && o.ev_driver === "tesla_ble_proxy";
    return [
      { key: "name", kind: "text" },
      { key: "type", kind: "select", options: ["switch", "ev", "battery"].map((o) => ({ value: o, label: r(`type.${o}`) })) },
      { key: "switch_entity", kind: "entity", domains: ["switch", "input_boolean", "light"], show: i },
      { key: "nominal_power_w", kind: "number", unit: "W", step: 50, show: i },
      { key: "bat_soc_entity", kind: "entity", domains: ["sensor"], show: e },
      { key: "bat_power_entity", kind: "entity", domains: ["sensor"], show: e, helper: r("f.bat_power_entity.help") },
      { key: "bat_power_sign", kind: "select", show: e, options: ["charge_positive", "discharge_positive"].map((o) => ({ value: o, label: r(`f.bat_sign.${o}`) })) },
      { key: "bat_setpoint_entity", kind: "entity", domains: ["number", "input_number"], show: e, helper: r("f.bat_setpoint_entity.help") },
      { key: "bat_capacity_kwh", kind: "number", unit: "kWh", step: 0.1, show: e },
      { key: "ev_driver", kind: "select", options: ["tesla_ble_proxy", "entities"].map((o) => ({ value: o, label: r(`f.ev_driver.${o}`) })), show: t },
      { key: "ev_proxy_url", kind: "text", show: s, helper: r("f.ev_proxy_url.help") },
      { key: "ev_vin", kind: "text", show: s },
      { key: "ev_charge_switch_entity", kind: "entity", domains: ["switch", "input_boolean"], show: (o) => t(o) && !s(o) },
      { key: "ev_current_entity", kind: "entity", domains: ["number", "input_number"], show: (o) => t(o) && !s(o) },
      { key: "power_entity", kind: "entity", domains: ["sensor"], helper: r("f.power_entity.help"), show: (o) => !e(o) },
      { key: "mode", kind: "select", options: at((a = this._adding) == null ? void 0 : a.type).map((o) => {
        var n;
        return { value: o, label: r(dt(o, (n = this._adding) == null ? void 0 : n.type)) };
      }) }
    ];
  }
  _startAdd() {
    this._addError = "", this._adding = { ...this._config.defaults.load, id: "", name: "", ev_driver: "tesla_ble_proxy" };
  }
  async _saveAdd() {
    const t = { ...this._adding };
    t.type !== "switch" && (!t.icon || t.icon === "mdi:water-boiler") && (t.icon = We(t.type)), at(t.type).includes(t.mode) || (t.mode = t.type === "battery" ? "self" : "solar"), this._addBusy = !0;
    try {
      const e = await It(this.hass, t);
      this._adding = null, await this._resubscribe(), this._detail = e.load.id;
    } catch (e) {
      this._addError = (e == null ? void 0 : e.message) ?? String(e);
    } finally {
      this._addBusy = !1;
    }
  }
  _menuButton() {
    return this.narrow && customElements.get("ha-menu-button") ? d`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : m;
  }
  _saveIndicator() {
    if (!this._save) return m;
    const t = this._save === "saving" ? "mdi:cloud-upload-outline" : this._save === "saved" ? "mdi:check-circle-outline" : "mdi:alert-circle-outline";
    return d`<span class="save ${this._save}"><ha-icon .icon=${t}></ha-icon>${r(`save.${this._save}`)}</span>`;
  }
  _toolbar() {
    const t = this._config, e = this._detail ? t == null ? void 0 : t.loads.find((i) => i.id === this._detail) : void 0;
    return e ? d`<div class="toolbar">
        <button class="icon" @click=${() => this._detail = null} title=${r("nav.back")}><ha-icon icon="mdi:arrow-left"></ha-icon></button>
        <span class="title pad">${e.name}</span>
        ${this._saveIndicator()}
        <button class="icon" title=${r("load.analytics")} @click=${() => {
      this._analyticsLoad = e.id, this._detail = null, this._tab = "analytics";
    }}>
          <ha-icon icon="mdi:chart-line"></ha-icon></button>
      </div>` : d`<div class="toolbar">
        ${this._menuButton()}
        <span class="title ${this.narrow ? "" : "pad"}">SolarMind</span>
        ${this._saveIndicator()}
        ${this._tab === "loads" && (t != null && t.loads.length) ? d`<button class="icon" title=${this._editing ? r("nav.done") : r("nav.reorder")} @click=${() => this._editing = !this._editing}>
              <ha-icon .icon=${this._editing ? "mdi:check" : "mdi:pencil"}></ha-icon></button>` : m}
      </div>
      <nav class="tabs">
        ${["loads", "analytics", "settings"].map(
      (i) => d`<button class="tab ${this._tab === i ? "on" : ""}" @click=${() => {
        this._tab = i, this._editing = !1;
      }}>${r(`tab.${i}`)}</button>`
    )}
      </nav>`;
  }
  _content(t) {
    var i, s, a, o;
    const e = this._detail ? t.loads.findIndex((n) => n.id === this._detail) : -1;
    if (e >= 0) {
      const n = { ...t.defaults.load, ...t.loads[e] };
      return d`<sm-load-detail .hass=${this.hass} .load=${n} .live=${(s = (i = this._live) == null ? void 0 : i.loads) == null ? void 0 : s[n.id]} .spark=${this._spark[n.id] ?? []}
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
        return d`<sm-analytics .hass=${this.hass} .loads=${t.loads} .loadId=${this._analyticsLoad} .peakLimit=${((o = (a = this._live) == null ? void 0 : a.site) == null ? void 0 : o.peak_limit_w) ?? null}
          @analytics-load=${(n) => this._analyticsLoad = n.detail.id}></sm-analytics>`;
      case "settings":
        return d`<sm-settings .hass=${this.hass} .settings=${t.settings} .narrow=${this.narrow}
          @saving=${() => this._flashSave("saving")}
          @settings-saved=${(n) => {
          this._config = { ...t, settings: { ...t.settings, ...n.detail.settings } }, this._flashSave("saved");
        }}
          @save-error=${() => this._flashSave("error")}></sm-settings>`;
      default:
        return d`<sm-dashboard .hass=${this.hass} .loads=${t.loads} .live=${this._live} .spark=${this._spark} .editing=${this._editing}
          @open-load=${(n) => this._detail = n.detail.id}
          @set-mode=${(n) => this._setMode(n.detail.id, n.detail.mode)}
        @set-min-power=${(n) => this._setMinPower(n.detail.id, n.detail.power_w)}
          @loads-reordered=${(n) => this._setOrder(n.detail.order)}
          @add-load=${this._startAdd}></sm-dashboard>`;
    }
  }
  render() {
    if (this._error) return d`<div class="err">${this._error}</div>`;
    const t = this._config;
    return d`
      ${this._toolbar()}
      ${t && t.version && t.version !== "0.2.2" ? d`<div class="stale"><ha-icon icon="mdi:update"></ha-icon>
            <span>${r("panel.stale").replace("{server}", t.version).replace("{panel}", "0.2.2")}</span>
            <button class="text" @click=${() => location.reload()}>${r("panel.reload")}</button></div>` : m}
      <main>${t ? this._content(t) : m}</main>
      ${this._adding ? d`<sm-dialog .heading=${r("loads.add")} .saveLabel=${r("load.add_save")} .busy=${this._addBusy} .error=${this._addError}
            .canSave=${!!this._adding.name} @closed=${() => this._adding = null} @save=${this._saveAdd}>
            <sm-form .hass=${this.hass} .fields=${this._addFields()} .data=${this._adding}
              @value-changed=${(e) => this._adding = { ...this._adding, [e.detail.key]: e.detail.value }}></sm-form>
          </sm-dialog>` : m}
    `;
  }
};
E.styles = [
  D,
  me,
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
O([
  _({ attribute: !1 })
], E.prototype, "hass", 2);
O([
  _({ type: Boolean })
], E.prototype, "narrow", 2);
O([
  y()
], E.prototype, "_config", 2);
O([
  y()
], E.prototype, "_live", 2);
O([
  y()
], E.prototype, "_tab", 2);
O([
  y()
], E.prototype, "_detail", 2);
O([
  y()
], E.prototype, "_editing", 2);
O([
  y()
], E.prototype, "_analyticsLoad", 2);
O([
  y()
], E.prototype, "_spark", 2);
O([
  y()
], E.prototype, "_adding", 2);
O([
  y()
], E.prototype, "_addBusy", 2);
O([
  y()
], E.prototype, "_addError", 2);
O([
  y()
], E.prototype, "_save", 2);
O([
  y()
], E.prototype, "_error", 2);
E = O([
  C("solarmind-panel")
], E);
export {
  E as SolarMindPanel
};
