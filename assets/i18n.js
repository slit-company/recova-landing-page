(function () {
  "use strict";

  if (window.__recovaI18nBooted) {
    console.warn("[i18n] duplicate bootstrap ignored");
    return;
  }
  window.__recovaI18nBooted = true;

  const STORAGE_KEY = "recova_lang";
  const TRANSLATION_URLS = {
    ko: "/assets/translations.ko.json",
    en: "/assets/translations.en.json",
  };
  const ATTR_KEYS = ["placeholder", "alt", "aria-label", "title", "value"];
  const TYPOGRAPHY_SELECTOR = ".framer-text,input,textarea,select";
  const TYPOGRAPHY_SCALE = 1.1;
  const TYPOGRAPHY_WEIGHT_BUMP = 100;
  const HOME_STYLE_ID = "__recova-home-ko-tune";
  const KO_HOME_FONT_STACK =
    '"Pretendard Variable","Pretendard","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
  const HOME_KO_STYLE = `
html[lang="ko"] [data-framer-name="Hero Section"] .framer-text,
html[lang="ko"] [data-framer-name="Navigation"] .framer-text,
html[lang="ko"] [data-framer-name="Features Section"] .framer-text,
html[lang="ko"] [data-framer-name="Pricing Section"] .framer-text,
html[lang="ko"] [data-framer-name="Benifits Section"] .framer-text,
html[lang="ko"] [data-framer-name="Integration Section"] .framer-text,
html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-text,
html[lang="ko"] [data-framer-name="Blog Section"] .framer-text,
html[lang="ko"] [data-framer-name="FAQ Section"] .framer-text,
html[lang="ko"] [data-framer-name="CTA Section"] .framer-text,
html[lang="ko"] [data-framer-name="Hero Section"] input,
html[lang="ko"] [data-framer-name="Navigation"] button,
html[lang="ko"] [data-framer-name="Hero Section"] button,
html[lang="ko"] [data-framer-name="CTA Section"] button {
  font-family: ${KO_HOME_FONT_STACK} !important;
  word-break: keep-all;
}

html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-68jbxw {
  font-size: 78px !important;
  line-height: 1.14 !important;
  letter-spacing: -0.05em !important;
  font-weight: 900 !important;
  text-wrap: balance;
}

html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="Benifits Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="Integration Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-yv7cwu,
html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-yv7cwu {
  font-size: 17px !important;
  line-height: 1.42 !important;
  letter-spacing: -0.02em !important;
  font-weight: 700 !important;
}

html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-1yyvqsw {
  font-size: 27px !important;
  line-height: 1.52 !important;
  letter-spacing: -0.03em !important;
  font-weight: 700 !important;
  max-width: 860px;
  text-wrap: pretty;
}

html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-1yyvqsw {
  font-size: 16px !important;
  line-height: 1.45 !important;
  letter-spacing: -0.02em !important;
  font-weight: 700 !important;
}

html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-b6gn3k {
  font-weight: 700 !important;
}

html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-1yyvqsw,
html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-1yyvqsw,
html[lang="ko"] [data-framer-name="Integration Section"] .framer-styles-preset-1yyvqsw,
html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-1yyvqsw,
html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-1yyvqsw,
html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-1yyvqsw,
html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-1yyvqsw {
  font-size: 22px !important;
  line-height: 1.58 !important;
  letter-spacing: -0.025em !important;
  font-weight: 600 !important;
  color: #525d6d !important;
  text-wrap: pretty;
}

html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-sg69os,
html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-sg69os,
html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-sg69os,
html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-sg69os,
html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-sg69os {
  font-size: 66px !important;
  letter-spacing: -0.045em !important;
  line-height: 1.14 !important;
  font-weight: 900 !important;
  text-wrap: balance;
}

html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-68jbxw {
  font-size: 62px !important;
  letter-spacing: -0.045em !important;
  line-height: 1.14 !important;
  font-weight: 900 !important;
  text-wrap: balance;
}

html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-1nwa64o,
html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-fla00d {
  font-size: 30px !important;
  letter-spacing: -0.03em !important;
  line-height: 1.24 !important;
  font-weight: 800 !important;
  text-wrap: balance;
}

html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-iok9as,
html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-iok9as,
html[lang="ko"] .framer-styles-preset-wxkv3q {
  font-size: 17px !important;
  line-height: 1.4 !important;
  letter-spacing: -0.02em !important;
  font-weight: 800 !important;
}

html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-iok9as,
html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-iok9as,
html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-wxkv3q {
  font-size: 20px !important;
}

html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-wxkv3q,
html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-wxkv3q {
  line-height: 1.45 !important;
  letter-spacing: -0.02em !important;
}

html[lang="ko"] [data-framer-name="Hero Section"] input {
  font-size: 18px !important;
  letter-spacing: -0.02em !important;
  font-weight: 600 !important;
}

@media (max-width: 1439px) and (min-width: 810px) {
  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-68jbxw {
    font-size: 66px !important;
  }

  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-1yyvqsw {
    font-size: 24px !important;
  }

  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-1yyvqsw {
    font-size: 15px !important;
  }

  html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-68jbxw {
    font-size: 52px !important;
  }

  html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Integration Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-1yyvqsw {
    font-size: 20px !important;
  }
}

@media (max-width: 809px) {
  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-68jbxw {
    font-size: 50px !important;
    line-height: 1.18 !important;
  }

  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="Integration Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-yv7cwu,
  html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-yv7cwu {
    font-size: 16px !important;
  }

  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-1yyvqsw {
    font-size: 22px !important;
    line-height: 1.56 !important;
  }

  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-1yyvqsw {
    font-size: 14px !important;
  }

  html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Integration Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-1yyvqsw {
    font-size: 18px !important;
  }

  html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="Pricing Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="Testimonials Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="Blog Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-sg69os,
  html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-68jbxw {
    font-size: 42px !important;
  }

  html[lang="ko"] [data-framer-name="Features Section"] .framer-styles-preset-1nwa64o,
  html[lang="ko"] [data-framer-name="FAQ Section"] .framer-styles-preset-fla00d {
    font-size: 24px !important;
  }

  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-iok9as,
  html[lang="ko"] [data-framer-name="CTA Section"] .framer-styles-preset-iok9as,
  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-wxkv3q,
  html[lang="ko"] [data-framer-name="Hero Section"] input {
    font-size: 18px !important;
  }
}
`;

  const state = {
    lang: "en",
    maps: { ko: {}, en: {} },
    map: {},
    reverseSet: new Set(),
    reverseAttrSet: new Set(),
    reverseMap: {},
    ready: false,
    observer: null,
  };

  const BRAND_REWRITES = [
    ["Flowsuite", "Recova"],
    ["FlowSuite", "Recova"],
  ];

  function applyBrandRewrites(text) {
    if (!text) return text;
    let out = text;
    for (const [from, to] of BRAND_REWRITES) {
      if (out.indexOf(from) !== -1) out = out.split(from).join(to);
    }
    return out;
  }

  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const originalTypography = new WeakMap();

  function detectInitialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("ko") ? "ko" : "en";
  }

  function isHomePage() {
    const path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    return path === "/" || path === "/index.html";
  }

  function ensureHomeLandingStyle() {
    if (!isHomePage()) return;
    let style = document.getElementById(HOME_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = HOME_STYLE_ID;
      style.textContent = HOME_KO_STYLE;
      document.head.appendChild(style);
    }
  }

  function shouldTuneTypography(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest && el.closest("#__recova-lang-toggle")) return false;
    return el.matches(TYPOGRAPHY_SELECTOR);
  }

  function getOriginalTypography(el) {
    if (!originalTypography.has(el)) {
      const cs = window.getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const parsedWeight = parseInt(cs.fontWeight, 10);
      originalTypography.set(el, {
        size: Number.isFinite(size) ? size : 16,
        weight: Number.isFinite(parsedWeight) ? parsedWeight : 400,
      });
    }
    return originalTypography.get(el);
  }

  function applyTypographyToElement(el) {
    if (!shouldTuneTypography(el)) return;
    const base = getOriginalTypography(el);
    const nextSize = Math.max(12, base.size * TYPOGRAPHY_SCALE);
    const nextWeight = Math.min(900, Math.max(400, base.weight) + TYPOGRAPHY_WEIGHT_BUMP);
    el.style.setProperty("font-size", `${nextSize.toFixed(2)}px`, "important");
    el.style.setProperty("font-weight", String(nextWeight), "important");
  }

  function applyTypographyTuning(root) {
    if (!root) return;
    if (root.nodeType === 1 && shouldTuneTypography(root)) {
      applyTypographyToElement(root);
    }
    if (root.nodeType !== 1) return;
    const nodes = root.querySelectorAll(TYPOGRAPHY_SELECTOR);
    for (const el of nodes) applyTypographyToElement(el);
  }

  async function loadOne(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) return {};
      const data = await resp.json();
      return data && typeof data === "object" ? data : {};
    } catch (err) {
      console.warn("[i18n] fetch failed", url, err);
      return {};
    }
  }

  async function loadTranslations() {
    const [ko, en] = await Promise.all([
      loadOne(TRANSLATION_URLS.ko),
      loadOne(TRANSLATION_URLS.en),
    ]);
    state.maps.ko = ko;
    state.maps.en = en;
    return ko;
  }

  function selectMapForLang() {
    state.map = state.maps[state.lang] || {};
  }

  function rebuildReverseSet() {
    selectMapForLang();
    const allValues = [
      ...Object.values(state.maps.ko || {}),
      ...Object.values(state.maps.en || {}),
    ];
    state.reverseSet = new Set(allValues);
    state.reverseAttrSet = new Set(allValues);
    state.reverseMap = {};
    const koVals = state.maps.ko || {};
    for (const k in koVals) state.reverseMap[koVals[k]] = k;
    const enVals = state.maps.en || {};
    for (const k in enVals) state.reverseMap[enVals[k]] = k;
  }

  function shouldSkipNode(node) {
    const p = node.parentElement;
    if (!p) return true;
    const tag = p.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return true;
    if (p.closest("#__recova-lang-toggle")) return true;
    return false;
  }

  function translateTextNode(node) {
    if (shouldSkipNode(node)) return;
    const raw = node.nodeValue;
    if (!raw) return;
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (!originalText.has(node)) {
      const reverseEnglish = state.reverseMap && state.reverseMap[trimmed];
      if (reverseEnglish) {
        const lead = raw.match(/^\s*/)[0];
        const tail = raw.match(/\s*$/)[0];
        originalText.set(node, lead + reverseEnglish + tail);
      } else {
        originalText.set(node, raw);
      }
    }
    const orig = originalText.get(node);
    const origTrim = orig.trim();

    let display = origTrim;
    const lookupKey = applyBrandRewrites(origTrim);
    const tx = state.map[lookupKey] || state.map[origTrim];
    if (tx) display = tx;
    display = applyBrandRewrites(display);
    const lead = orig.match(/^\s*/)[0];
    const tail = orig.match(/\s*$/)[0];
    const next = lead + display + tail;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function translateAttrs(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.closest && el.closest("#__recova-lang-toggle")) return;
    let store = originalAttrs.get(el);
    for (const attr of ATTR_KEYS) {
      if (!el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr);
      if (!current || !current.trim()) continue;
      if (!store) {
        store = {};
        originalAttrs.set(el, store);
      }
      if (!(attr in store)) {
        const reverseEnglish = state.reverseMap && state.reverseMap[current.trim()];
        store[attr] = reverseEnglish || current;
      }
      const orig = store[attr];
      let display = orig.trim();
      const lookupKey = applyBrandRewrites(display);
      const tx = state.map[lookupKey] || state.map[display];
      if (tx) display = tx;
      display = applyBrandRewrites(display);
      if (current !== display) el.setAttribute(attr, display);
    }
  }

  function translateSubtree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) translateTextNode(n);
  }

  function translateDocumentTitle() {
    const t = document.querySelector("title");
    if (!t) return;
    if (!originalText.has(t)) {
      const reverseEnglish = state.reverseMap && state.reverseMap[t.textContent.trim()];
      originalText.set(t, reverseEnglish || t.textContent);
    }
    const orig = originalText.get(t);
    let display = orig.trim();
    const lookupKey = applyBrandRewrites(display);
    const tx = state.map[lookupKey] || state.map[display];
    if (tx) display = tx;
    document.title = applyBrandRewrites(display);
  }

  function applyAll() {
    stopObserver();
    try {
      document.documentElement.lang = state.lang;
      selectMapForLang();
      translateSubtree(document.body);
      translateDocumentTitle();
      applyTypographyTuning(document.body);
    } finally {
      startObserver();
    }
  }

  function setLang(next) {
    if (next !== "ko" && next !== "en") return;
    state.lang = next;
    localStorage.setItem(STORAGE_KEY, next);
    selectMapForLang();
    applyAll();
    updateToggleButton();
  }

  function updateToggleButton() {
    const btn = document.getElementById("__recova-lang-toggle");
    if (!btn) return;
    btn.textContent = state.lang === "ko" ? "EN" : "한";
    btn.setAttribute("aria-label", state.lang === "ko" ? "Switch to English" : "한국어로 전환");
  }

  const HEADER_STYLE = [
    "all:unset",
    "box-sizing:border-box",
    "display:inline-flex",
    "align-items:center",
    "justify-content:center",
    "min-width:42px",
    "height:32px",
    "padding:0 12px",
    "margin-left:8px",
    "background:rgba(0,0,0,0.06)",
    "color:#111",
    "border:1px solid rgba(0,0,0,0.08)",
    "border-radius:999px",
    "font:600 13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    "cursor:pointer",
    "transition:background-color 0.15s ease,transform 0.15s ease",
    "user-select:none",
    "-webkit-user-select:none",
    "flex-shrink:0",
  ].join(";");

  const FLOAT_STYLE = [
    "all:unset",
    "box-sizing:border-box",
    "position:fixed",
    "bottom:20px",
    "right:20px",
    "z-index:2147483647",
    "display:inline-flex",
    "align-items:center",
    "justify-content:center",
    "min-width:48px",
    "height:40px",
    "padding:0 14px",
    "background:#111",
    "color:#fff",
    "border:none",
    "border-radius:999px",
    "font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    "cursor:pointer",
    "box-shadow:0 6px 20px rgba(0,0,0,0.18),0 2px 6px rgba(0,0,0,0.12)",
    "transition:transform 0.15s ease",
    "user-select:none",
    "-webkit-user-select:none",
  ].join(";");

  function makeToggleButton() {
    const btn = document.createElement("button");
    btn.id = "__recova-lang-toggle";
    btn.type = "button";
    btn.setAttribute("data-recova-toggle", "1");
    btn.addEventListener("mouseenter", () => {
      if (btn.dataset.placement === "header") btn.style.backgroundColor = "rgba(0,0,0,0.12)";
      else btn.style.transform = "translateY(-1px)";
    });
    btn.addEventListener("mouseleave", () => {
      if (btn.dataset.placement === "header") btn.style.backgroundColor = "rgba(0,0,0,0.06)";
      else btn.style.transform = "";
    });
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setLang(state.lang === "ko" ? "en" : "ko");
    });
    return btn;
  }

  function findHeaderTarget() {
    const candidates = [
      '[data-framer-name="Log in & Button"]',
      '[data-framer-name="Navigation"]',
      '[data-framer-name="Logo & Menu"]',
      "header",
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.getBoundingClientRect().top < 200) return el;
    }
    return null;
  }

  function ensureToggle() {
    let btn = document.getElementById("__recova-lang-toggle");
    const header = findHeaderTarget();
    if (!btn) btn = makeToggleButton();

    if (header) {
      btn.style.cssText = HEADER_STYLE;
      btn.dataset.placement = "header";
      if (header.lastElementChild !== btn) header.appendChild(btn);
    } else if (!btn.isConnected) {
      btn.style.cssText = FLOAT_STYLE;
      btn.dataset.placement = "float";
      document.body.appendChild(btn);
    }
    updateToggleButton();
  }

  function createToggle() {
    ensureToggle();
    setTimeout(ensureToggle, 800);
    setTimeout(ensureToggle, 2000);
    setTimeout(ensureToggle, 4000);
  }

  const OBSERVER_CONFIG = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTR_KEYS,
  };

  function startObserver() {
    if (!state.observer) return;
    state.observer.observe(document.body, OBSERVER_CONFIG);
  }

  function stopObserver() {
    if (!state.observer) return;
    state.observer.disconnect();
  }

  function setupObserver() {
    state.observer = new MutationObserver((records) => {
      for (const rec of records) {
        if (rec.type === "characterData" && rec.target.parentElement) {
          const v = rec.target.nodeValue ? rec.target.nodeValue.trim() : "";
          if (v && state.map[v] === undefined && state.reverseSet.has(v)) {
            const orig = state.reverseMap[v];
            const expected = state.map[orig];
            if (expected === v) continue;
          }
          translateTextNode(rec.target);
        } else if (rec.type === "childList") {
          for (const node of rec.addedNodes) {
            if (node.nodeType === 1) {
              translateSubtree(node);
              applyTypographyTuning(node);
            }
            else if (node.nodeType === 3) translateTextNode(node);
          }
        } else if (rec.type === "attributes" && rec.target.nodeType === 1) {
          translateAttrs(rec.target);
          applyTypographyTuning(rec.target);
        }
      }
    });
    startObserver();
  }

  async function init() {
    state.lang = detectInitialLang();
    ensureHomeLandingStyle();
    state.map = await loadTranslations();
    rebuildReverseSet();
    state.ready = true;
    applyAll();
    createToggle();
    setupObserver();
    setTimeout(applyAll, 1500);
    setTimeout(applyAll, 3500);
  }

  function queueInit() {
    const run = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          init().catch((err) => {
            console.error("[i18n] init failed", err);
          });
        });
      });
    };

    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
  }

  queueInit();

  window.__recovaI18n = {
    get lang() {
      return state.lang;
    },
    setLang,
    reload: async () => {
      state.map = await loadTranslations();
      rebuildReverseSet();
      applyAll();
    },
  };
})();
