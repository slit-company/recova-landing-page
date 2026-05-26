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
  const TYPOGRAPHY_SCALE = 1;
  const TYPOGRAPHY_WEIGHT_BUMP = 0;
  const HOME_STYLE_ID = "__recova-home-ko-tune";
  const HOME_ROUTE_STYLE_ID = "__recova-home-route-fixes";
  const PUBLIC_ROUTE_STYLE_ID = "__recova-public-route-fixes";
  const LEGACY_HOME_ROUTE_STYLE_SELECTOR = 'style[data-recova-hide-home]';
  const HERO_DASHBOARD_FIGURE_SELECTOR =
    '#herosection [data-framer-name="Dashboard"] [data-framer-name="Dashboard "] [data-framer-name="Image"]';
  const HOME_REMOVAL_SELECTORS = [
    '[data-framer-name="Ticker Section"]',
    '[data-framer-name="Testimonials Section"]',
    '[data-framer-name="Blog Section"]',
  ];
  const HOME_ROUTE_STYLE = `
[data-framer-name="Testimonials Section"],
[data-framer-name="Blog Section"],
[data-framer-name="Ticker Section"],
[data-framer-name="Ticker"],
[data-framer-name="Hero Section"] form label,
[data-framer-name="FAQ 6"],
[data-framer-name="Brading Cards"] {
  display: none !important;
}

[data-framer-name="Hero Section"] form {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  gap: 0 !important;
}

[data-framer-name="Hero Section"] form>* {
  flex: 0 0 auto !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

[data-framer-name="Hero Section"] form>div {
  position: static !important;
  top: auto !important;
  right: auto !important;
  bottom: auto !important;
  left: auto !important;
  transform: none !important;
  margin: 0 auto !important;
  align-self: center !important;
  width: auto !important;
}

[data-framer-name="Hero Section"] form button[type="submit"] {
  margin-left: auto !important;
  margin-right: auto !important;
  transition: transform 0.15s ease, background-color 0.15s ease !important;
}

[data-framer-name="Hero Section"] form button[type="submit"]:hover {
  background-color: #1a1a1a !important;
  transform: translateY(-1px) !important;
}

[data-framer-name="Hero Section"] form button[type="submit"]:active {
  background-color: #000 !important;
  transform: translateY(0) !important;
}

[data-framer-name="Hero Section"] form button[type="submit"] .framer-tx356n {
  position: relative !important;
  overflow: hidden !important;
}

[data-framer-name="Hero Section"] form button[type="submit"] .framer-tx356n > p {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
  will-change: transform;
}

[data-framer-name="Hero Section"] form button[type="submit"] .framer-tx356n > p[data-recova-roll-clone] {
  position: absolute !important;
  inset: 0 !important;
  margin: 0 !important;
  transform: translateY(100%);
}

[data-framer-name="Hero Section"] form button[type="submit"]:hover .framer-tx356n > p:not([data-recova-roll-clone]) {
  transform: translateY(-100%) !important;
}

[data-framer-name="Hero Section"] form button[type="submit"]:hover .framer-tx356n > p[data-recova-roll-clone] {
  transform: translateY(0) !important;
}

#herosection [data-framer-name="Tag"].framer-s8uhv8 {
  width: auto !important;
  max-width: calc(100% - 40px) !important;
}

#herosection [data-framer-name="Tag"].framer-s8uhv8 .framer-1gm3lg7 {
  width: auto !important;
  flex: none !important;
  white-space: nowrap !important;
}

/* Integration Section CTA: widen Title & Details to fit KO copy on 2 lines */
@media (min-width: 1200px) {
  [data-framer-name="Integration Section"] .framer-insmmd,
  [data-framer-name="Integration Section"] .framer-1desmqf {
    width: 560px !important;
    max-width: 560px !important;
  }
}

p,h1,h2,h3,h4,h5,h6,[data-framer-component-type="RichTextContainer"] * {
  word-break: keep-all !important;
  line-break: strict !important;
  overflow-wrap: break-word !important;
}

[data-framer-name="Hero Section"] form .framer-form-input-wrapper,
[data-framer-name="Hero Section"] form .framer-form-text-input,
[data-framer-name="Hero Section"] form label {
  display: none !important;
}

[data-framer-name="Features Section"] p[data-framer-component-type="RichTextContainer"]:not([data-framer-name="Title"]) .framer-text,
[data-framer-name="Pricing Section"] p[data-framer-component-type="RichTextContainer"]:not([data-framer-name="Title"]) .framer-text,
[data-framer-name="Benifits Section"] p[data-framer-component-type="RichTextContainer"]:not([data-framer-name="Title"]) .framer-text,
[data-framer-name="Integration Section"] p[data-framer-component-type="RichTextContainer"]:not([data-framer-name="Title"]) .framer-text,
[data-framer-name="FAQ Section"] p[data-framer-component-type="RichTextContainer"]:not([data-framer-name="Title"]) .framer-text,
[data-framer-name="CTA Section"] p[data-framer-component-type="RichTextContainer"]:not([data-framer-name="Title"]) .framer-text {
  font-size: 20px !important;
  line-height: 1.55 !important;
}
`;
  const KO_HOME_FONT_STACK =
    '"Pretendard Variable","Pretendard","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
  const HOME_KO_STYLE = `
html[lang="ko"] {
  --framer-font-family: ${KO_HOME_FONT_STACK} !important;
}

html[lang="ko"] .framer-text,
html[lang="ko"] button,
html[lang="ko"] input,
html[lang="ko"] textarea,
html[lang="ko"] select {
  font-family: ${KO_HOME_FONT_STACK} !important;
  word-break: keep-all !important;
  overflow-wrap: break-word !important;
}

/* Default Heading 1 globally */
html[lang="ko"] .framer-styles-preset-68jbxw {
  font-size: 62px !important;
  letter-spacing: -0.045em !important;
  line-height: 1.14 !important;
  font-weight: 900 !important;
  text-wrap: balance !important;
  word-break: keep-all !important;
}

/* Hero Heading 1 Override */
html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-68jbxw {
  font-size: 78px !important;
  line-height: 1.14 !important;
  letter-spacing: -0.05em !important;
  font-weight: 900 !important;
  text-wrap: balance !important;
  word-break: keep-all !important;
}

/* Subheadings / Labels */
html[lang="ko"] .framer-styles-preset-yv7cwu {
  font-size: 17px !important;
  line-height: 1.42 !important;
  letter-spacing: -0.02em !important;
  font-weight: 700 !important;
}

/* Default Body text globally */
html[lang="ko"] .framer-styles-preset-1yyvqsw {
  font-size: 22px !important;
  line-height: 1.58 !important;
  letter-spacing: -0.025em !important;
  font-weight: 600 !important;
  word-break: keep-all !important;
}

/* Hero Body Text Override */
html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-1yyvqsw {
  font-size: 27px !important;
  line-height: 1.52 !important;
  letter-spacing: -0.03em !important;
  font-weight: 700 !important;
  max-width: 860px !important;
  word-break: keep-all !important;
}

/* Navigation Link Override */
html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-1yyvqsw {
  font-size: 19px !important;
  line-height: 1.45 !important;
  letter-spacing: -0.02em !important;
  font-weight: 700 !important;
}

html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-b6gn3k {
  font-size: 19px !important;
  font-weight: 700 !important;
}

/* Nav hover-swap offset: must match KO line-height (1.45 × font-size) */
html[lang="ko"] [data-framer-name="Navigation"] .framer-3q23c:not(.hover) .framer-47t6iw {
  bottom: -28px !important;
}
html[lang="ko"] [data-framer-name="Navigation"] .framer-3q23c.hover .framer-p8ekez {
  top: -28px !important;
}

/* Heading 2 */
html[lang="ko"] .framer-styles-preset-sg69os {
  font-size: 66px !important;
  letter-spacing: -0.045em !important;
  line-height: 1.14 !important;
  font-weight: 900 !important;
  word-break: keep-all !important;
  white-space: pre-wrap !important;
}

/* Alternate Heading 2 */
html[lang="ko"] .framer-styles-preset-13jnss0 {
  font-size: 54px !important;
  letter-spacing: -0.04em !important;
  line-height: 1.16 !important;
  font-weight: 900 !important;
  word-break: keep-all !important;
  white-space: pre-wrap !important;
}

html[lang="ko"] [data-framer-name="Integration Section"] .framer-styles-preset-13jnss0 {
  font-size: 66px !important;
}

/* Heading 3 */
html[lang="ko"] .framer-styles-preset-1nwa64o,
html[lang="ko"] .framer-styles-preset-74b5v3,
html[lang="ko"] .framer-styles-preset-fla00d {
  font-size: 30px !important;
  letter-spacing: -0.03em !important;
  line-height: 1.24 !important;
  font-weight: 800 !important;
  text-wrap: balance !important;
}

/* Heading 4 */
html[lang="ko"] .framer-styles-preset-qtfn3q,
html[lang="ko"] .framer-styles-preset-hxmspp {
  font-size: 36px !important;
  line-height: 1.28 !important;
  letter-spacing: -0.03em !important;
  font-weight: 800 !important;
  word-break: keep-all !important;
}

/* Heading 6 */
html[lang="ko"] .framer-styles-preset-txongm {
  font-size: 18px !important;
  line-height: 1.4 !important;
  letter-spacing: -0.02em !important;
  font-weight: 700 !important;
  word-break: keep-all !important;
}

/* Body Large / Body 1 */
html[lang="ko"] .framer-styles-preset-1pvoa8m {
  font-size: 24px !important;
  line-height: 1.55 !important;
  letter-spacing: -0.025em !important;
  font-weight: 600 !important;
  word-break: keep-all !important;
}

/* Body Small / Body 3 */
html[lang="ko"] .framer-styles-preset-v983n9 {
  font-size: 18px !important;
  line-height: 1.5 !important;
  letter-spacing: -0.02em !important;
  font-weight: 500 !important;
  word-break: keep-all !important;
}

/* Buttons / Actions / Navigation Badges */
html[lang="ko"] .framer-styles-preset-iok9as,
html[lang="ko"] .framer-styles-preset-wxkv3q {
  font-size: 17px !important;
  line-height: 1.4 !important;
  letter-spacing: -0.02em !important;
  font-weight: 800 !important;
  white-space: nowrap !important;
  word-break: normal !important;
}

html[lang="ko"] .framer-styles-preset-iok9as {
  font-size: 20px !important;
}

html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-wxkv3q {
  font-size: 20px !important;
  line-height: 1.45 !important;
  letter-spacing: -0.02em !important;
}

html[lang="ko"] [data-framer-name="Hero Section"] input {
  font-size: 18px !important;
  letter-spacing: -0.02em !important;
  font-weight: 600 !important;
}

@media (max-width: 1439px) and (min-width: 810px) {
  /* Tablet Hero Overrides */
  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-68jbxw {
    font-size: 66px !important;
  }
  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-1yyvqsw {
    font-size: 24px !important;
  }
  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-b6gn3k {
    font-size: 17px !important;
  }

  /* Tablet Global Presets */
  html[lang="ko"] .framer-styles-preset-68jbxw,
  html[lang="ko"] .framer-styles-preset-sg69os,
  html[lang="ko"] .framer-styles-preset-13jnss0 {
    font-size: 52px !important;
  }
  html[lang="ko"] .framer-styles-preset-1yyvqsw {
    font-size: 20px !important;
  }
  html[lang="ko"] .framer-styles-preset-1nwa64o,
  html[lang="ko"] .framer-styles-preset-74b5v3,
  html[lang="ko"] .framer-styles-preset-fla00d {
    font-size: 26px !important;
  }
  html[lang="ko"] .framer-styles-preset-qtfn3q,
  html[lang="ko"] .framer-styles-preset-hxmspp {
    font-size: 30px !important;
  }
  html[lang="ko"] .framer-styles-preset-txongm {
    font-size: 17px !important;
  }
  html[lang="ko"] .framer-styles-preset-1pvoa8m {
    font-size: 21px !important;
  }
  html[lang="ko"] .framer-styles-preset-v983n9 {
    font-size: 16px !important;
  }
  html[lang="ko"] .framer-styles-preset-iok9as {
    font-size: 18px !important;
  }
}

@media (max-width: 809px) {
  /* Mobile Hero Overrides */
  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-68jbxw {
    font-size: 50px !important;
    line-height: 1.18 !important;
  }
  html[lang="ko"] [data-framer-name="Hero Section"] .framer-styles-preset-1yyvqsw {
    font-size: 22px !important;
    line-height: 1.56 !important;
  }
  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-1yyvqsw,
  html[lang="ko"] [data-framer-name="Navigation"] .framer-styles-preset-b6gn3k {
    font-size: 16px !important;
  }

  /* Mobile Global Presets */
  html[lang="ko"] .framer-styles-preset-yv7cwu {
    font-size: 16px !important;
  }
  html[lang="ko"] .framer-styles-preset-1yyvqsw {
    font-size: 18px !important;
  }
  html[lang="ko"] .framer-styles-preset-68jbxw,
  html[lang="ko"] .framer-styles-preset-sg69os,
  html[lang="ko"] .framer-styles-preset-13jnss0 {
    font-size: 42px !important;
  }
  html[lang="ko"] .framer-styles-preset-1nwa64o,
  html[lang="ko"] .framer-styles-preset-74b5v3,
  html[lang="ko"] .framer-styles-preset-fla00d {
    font-size: 24px !important;
  }
  html[lang="ko"] .framer-styles-preset-qtfn3q,
  html[lang="ko"] .framer-styles-preset-hxmspp {
    font-size: 26px !important;
  }
  html[lang="ko"] .framer-styles-preset-txongm {
    font-size: 16px !important;
  }
  html[lang="ko"] .framer-styles-preset-1pvoa8m {
    font-size: 18px !important;
  }
  html[lang="ko"] .framer-styles-preset-v983n9 {
    font-size: 15px !important;
  }
  html[lang="ko"] .framer-styles-preset-iok9as,
  html[lang="ko"] .framer-styles-preset-wxkv3q,
  html[lang="ko"] input {
    font-size: 18px !important;
  }
}

/* Korean line-break polish — balance headings, smooth body, preserve word units */
html[lang="ko"] h1,
html[lang="ko"] h2,
html[lang="ko"] h3,
html[lang="ko"] h4 {
  text-wrap: balance;
}
html[lang="ko"] p,
html[lang="ko"] .framer-text {
  text-wrap: pretty;
}

/* FAQ heading: English layout used a hard <br> ("Your Questions / Answered")
   that orphans "질문" in Korean. Let KO flow naturally and let balance pick. */
html[lang="ko"] [data-framer-name="FAQ Section"] h1 br,
html[lang="ko"] [data-framer-name="FAQ Section"] h2 br,
html[lang="ko"] [data-framer-name="FAQ Section"] h3 br {
  display: none !important;
}
`;;

  const state = {
    lang: "en",
    maps: { ko: {}, en: {} },
    map: {},
    reverseSet: new Set(),
    reverseAttrSet: new Set(),
    reverseMap: {},
    ready: false,
    observer: null,
    routePath: "",
    routeTimer: null,
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
    const hinted = document.documentElement.getAttribute("data-recova-preferred-lang");
    if (hinted === "ko" || hinted === "en") return hinted;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("ko") ? "ko" : "en";
  }

  function isKoreanPending() {
    return document.documentElement.getAttribute("data-recova-i18n-pending") === "1";
  }

  function clearI18nPending() {
    if (window.__recovaI18nPendingTimeout) {
      window.clearTimeout(window.__recovaI18nPendingTimeout);
      window.__recovaI18nPendingTimeout = null;
    }
    if (typeof window.__recovaClearI18nPending === "function") {
      window.__recovaClearI18nPending();
      return;
    }
    document.documentElement.removeAttribute("data-recova-i18n-pending");
  }



  function getNormalizedPath() {
    const path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    return path === "/index.html" ? "/" : path;
  }

  function syncPublicRouteStyle() {
    const path = getNormalizedPath();
    const rules = [];
    if (path === "/about") {
      rules.push('[data-framer-name="Image Section"]{display:none!important;}');
      rules.push('[data-framer-name="Perform Section"]{display:none!important;}');
      rules.push('[data-framer-name="Team Section"]{display:none!important;}');
      rules.push('[data-framer-name="Testimonials Section"]{display:none!important;}');
    }
    if (path === "/features") {
      rules.push('[data-framer-name="Ticker Section"]{display:none!important;}');
      rules.push('[data-framer-name="Monitoring Section"]{display:none!important;}');
      rules.push('[data-framer-name="Testimonials Section"]{display:none!important;}');
    }
    let style = document.getElementById(PUBLIC_ROUTE_STYLE_ID);
    if (!rules.length) {
      if (style) style.remove();
      return;
    }
    if (!style) {
      style = document.createElement("style");
      style.id = PUBLIC_ROUTE_STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = rules.join("\n");
  }

  function annotateDeemphasizedLinks(root) {
    const links = root.querySelectorAll('a[href^="/blogs"], a[href^="/integrations"], a[href^="/career"]');
    for (const link of links) {
      const txt = (link.textContent || '').trim();
      if (/파일럿 상담|Talk to us about a pilot|pilot/i.test(txt)) continue;
      const inAuxNav = !!link.closest('footer, [role="contentinfo"], nav');
      if (!inAuxNav) continue;
      if (link.dataset.recovaAuxLink === "1") continue;
      link.dataset.recovaAuxLink = "1";
      link.style.opacity = "0.58";
      if (txt && !/준비 중|Resources|Coming soon/i.test(txt)) {
        link.textContent = state.lang === 'ko' ? `${txt} · 준비 중` : `${txt} · later`;
      }
    }
  }

  function normalizePricingLanguage(root) {
    if (!["/pricing", "/"].includes(getNormalizedPath())) return;
    const swaps = new Map([
      ["$", ""],
      ["39", state.lang === "ko" ? "도입 범위 협의" : "Scope based"],
      ["29", state.lang === "ko" ? "도입 범위 협의" : "Scope based"],
      ["/월", ""],
      ["/month", ""],
      ["5GB", state.lang === "ko" ? "파일럿 범위 기준" : "Pilot scope"],
      ["100GB", state.lang === "ko" ? "운영 범위 기준" : "Ops scope"],
      ["5", state.lang === "ko" ? "최대 5석" : "Up to 5 seats"],
      ["25", state.lang === "ko" ? "최대 25석" : "Up to 25 seats"],
      ["예", "포함"],
      ["아니요", "선택"],
      ["Yes", "Included"],
      ["No", "Optional"],
    ]);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    for (const node of textNodes) {
      const raw = node.nodeValue;
      const trimmed = raw && raw.trim();
      if (!trimmed || !swaps.has(trimmed)) continue;
      node.nodeValue = raw.replace(trimmed, swaps.get(trimmed));
    }
  }



  function normalizePilotCtas(root) {
    const links = root.querySelectorAll('a[href^="/integrations"], a[href^="/pricing"], a[href^="/contact"]');
    for (const link of links) {
      const txt = (link.textContent || '').trim();
      if (!/파일럿 상담|Talk to us about a pilot|pilot/i.test(txt)) continue;
      link.setAttribute('href', '/contact/');
      link.dataset.recovaAuxLink = '0';
      link.style.opacity = '';
      if (/준비 중|later/i.test(txt)) {
        link.textContent = state.lang === 'ko' ? '파일럿 상담하기' : 'Talk to us about a pilot';
      }
    }
  }



  function normalizeRouteTitle() {
    const path = getNormalizedPath();
    const titles = {
      '/': 'Recova | AI overdue-call automation for rental and subscription teams',
      '/about': 'About Recova | Operating principles for AI overdue calls',
      '/features': 'Recova Features | AI overdue-call operations',
      '/pricing': 'Recova Rollout | Pilot to operations',
      '/contact': 'Contact Recova | Pilot inquiry',
      '/privacy-policy': 'Recova Privacy Policy | SLIT',
      '/terms-and-conditions': 'Recova Terms | SLIT',
    };
    if (titles[path]) document.title = titles[path];
  }

  function normalizePublicRoutes(root) {
    syncPublicRouteStyle();
    annotateDeemphasizedLinks(root);
    normalizePilotCtas(root);
    normalizePricingLanguage(root);
    normalizeRouteTitle();
  }

  function isHomePage() {
    const path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    return path === "/" || path === "/index.html";
  }

  function removeStyleById(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function removeLegacyHomeRouteStyles() {
    const legacy = document.querySelectorAll(LEGACY_HOME_ROUTE_STYLE_SELECTOR);
    for (const el of legacy) el.remove();
  }

  function syncHomeRouteStyle() {
    removeLegacyHomeRouteStyles();
    if (!isHomePage()) {
      removeStyleById(HOME_ROUTE_STYLE_ID);
      return;
    }
    let style = document.getElementById(HOME_ROUTE_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = HOME_ROUTE_STYLE_ID;
      style.textContent = HOME_ROUTE_STYLE;
      document.head.appendChild(style);
    }
  }

  function ensureHomeLandingStyle() {
    let style = document.getElementById(HOME_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = HOME_STYLE_ID;
      style.textContent = HOME_KO_STYLE;
      document.head.appendChild(style);
    }
  }

  function buildHeroDashboardPlaceholder() {
    const root = document.createElement("div");
    root.className = "recova-dashboard-placeholder";
    root.setAttribute("aria-hidden", "true");

    const canvas = document.createElement("div");
    canvas.className = "recova-dashboard-placeholder__canvas";

    const windowDots = document.createElement("div");
    windowDots.className = "recova-dashboard-placeholder__window";
    canvas.appendChild(windowDots);

    const header = document.createElement("div");
    header.className = "recova-dashboard-placeholder__header";
    canvas.appendChild(header);

    const sidebar = document.createElement("div");
    sidebar.className = "recova-dashboard-placeholder__sidebar";
    canvas.appendChild(sidebar);

    const cards = document.createElement("div");
    cards.className = "recova-dashboard-placeholder__cards";
    for (let i = 0; i < 4; i += 1) {
      const card = document.createElement("div");
      card.className = "recova-dashboard-placeholder__card";
      if (i === 0) card.classList.add("is-primary");
      cards.appendChild(card);
    }
    canvas.appendChild(cards);

    const chart = document.createElement("div");
    chart.className = "recova-dashboard-placeholder__chart";
    const chartLine = document.createElement("div");
    chartLine.className = "recova-dashboard-placeholder__chart-line";
    chart.appendChild(chartLine);
    canvas.appendChild(chart);

    const gauge = document.createElement("div");
    gauge.className = "recova-dashboard-placeholder__gauge";
    const gaugeRing = document.createElement("div");
    gaugeRing.className = "recova-dashboard-placeholder__gauge-ring";
    gauge.appendChild(gaugeRing);
    canvas.appendChild(gauge);

    const table = document.createElement("div");
    table.className = "recova-dashboard-placeholder__table";
    for (let i = 0; i < 3; i += 1) {
      const row = document.createElement("div");
      row.className = "recova-dashboard-placeholder__table-row";
      table.appendChild(row);
    }
    canvas.appendChild(table);

    root.appendChild(canvas);
    return root;
  }

  function syncHeroDashboardPlaceholder() {
    if (!isHomePage() || !document.body) return;
    const figures = document.querySelectorAll(HERO_DASHBOARD_FIGURE_SELECTOR);
    for (const figure of figures) {
      const onlyChild = figure.firstElementChild;
      const placeholderReady =
        figure.children.length === 1 &&
        onlyChild &&
        onlyChild.classList.contains("recova-dashboard-placeholder") &&
        onlyChild.querySelector(".recova-dashboard-placeholder__canvas");
      if (placeholderReady) continue;
      figure.replaceChildren(buildHeroDashboardPlaceholder());
    }
  }

  function removeHomeSections() {
    if (!isHomePage() || !document.body) return;
    for (const selector of HOME_REMOVAL_SELECTORS) {
      const nodes = document.querySelectorAll(selector);
      for (const node of nodes) node.remove();
    }
  }

  function shouldTuneTypography(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest && el.closest("#__recova-lang-toggle")) return false;
    return el.matches(TYPOGRAPHY_SELECTOR);
  }

  function normalizeInternalHref(raw) {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) return null;
    if (/^(?:[a-z]+:)?\/\//i.test(trimmed)) return null;
    if (/^(?:mailto:|tel:|javascript:)/i.test(trimmed)) return null;

    const match = trimmed.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
    if (!match) return null;
    let [, path, query = "", hash = ""] = match;
    if (!path) return null;

    if (path === "./" || path === ".") path = "/";
    else if (path.startsWith("./")) path = "/" + path.slice(2);
    else if (path.startsWith("../")) return null;
    else if (!path.startsWith("/")) path = "/" + path;

    if (path !== "/" && !path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path)) {
      path += "/";
    }

    path = path.replace(/\/{2,}/g, "/");
    return `${path}${query}${hash}`;
  }

  function normalizeLinkElement(el) {
    if (!el || el.nodeType !== 1 || el.tagName !== "A") return;
    const raw = el.getAttribute("href");
    const normalized = normalizeInternalHref(raw);
    if (normalized && normalized !== raw) {
      el.setAttribute("href", normalized);
    }
  }

  function normalizeInternalLinks(root) {
    if (!root) return;
    if (root.nodeType === 1 && root.tagName === "A") normalizeLinkElement(root);
    if (root.nodeType !== 1) return;
    const links = root.querySelectorAll("a[href]");
    for (const el of links) normalizeLinkElement(el);
  }

  function normalizeHeroCta(root) {
    if (!root || !document.body) return;
    const form = document.querySelector("form.framer-ywjlf0");
    const button = form ? form.querySelector('button[type="submit"]') : null;
    if (!form || !button) return;

    form.setAttribute("novalidate", "novalidate");
    form.setAttribute("action", "/contact/");

    if (!button.dataset.recovaHeroBound) {
      button.dataset.recovaHeroBound = "1";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = "/contact/";
      });
    }

    if (!button.dataset.recovaHeroRoll) {
      const container = button.querySelector(".framer-tx356n");
      const original = container ? container.querySelector("p") : null;
      if (container && original) {
        const clone = original.cloneNode(true);
        clone.setAttribute("data-recova-roll-clone", "1");
        container.appendChild(clone);
        button.dataset.recovaHeroRoll = "1";
      }
    }
  }

  function normalizeLogoNavigation(root) {
    if (!document.body) return;
    const logos = document.querySelectorAll('a[data-framer-name="Logo"]');
    for (const logo of logos) {
      logo.setAttribute("href", "/");
      if (!logo.dataset.recovaLogoBound) {
        logo.dataset.recovaLogoBound = "1";
        logo.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          } else {
            window.location.assign("/");
          }
        });
      }
    }
  }

  function normalizeAppearAnimations(root) {
    if (!root || root.nodeType !== 1) return;
    const nodes = [];
    if (root.hasAttribute && root.hasAttribute("data-framer-appear-id")) nodes.push(root);
    for (const el of root.querySelectorAll("[data-framer-appear-id]")) nodes.push(el);
    for (const el of nodes) {
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("transform", "none", "important");
      el.style.setProperty("will-change", "auto", "important");
    }
  }

  function normalizeHiddenNamedBlocks(root) {
    if (!root || root.nodeType !== 1) return;
    const nodes = [];
    if (root.hasAttribute && root.hasAttribute("data-framer-name")) nodes.push(root);
    for (const el of root.querySelectorAll("[data-framer-name]")) nodes.push(el);
    for (const el of nodes) {
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (parseFloat(cs.opacity) < 0.5 && rect.height > 0 && rect.width > 0 && cs.display !== "none") {
        el.style.setProperty("opacity", "1", "important");
        if (cs.transform && cs.transform !== "none") {
          el.style.setProperty("transform", "none", "important");
        }
        el.style.setProperty("will-change", "auto", "important");
      }
    }
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
    if (TYPOGRAPHY_SCALE === 1 && TYPOGRAPHY_WEIGHT_BUMP === 0) return;
    const base = getOriginalTypography(el);
    const nextSize = Math.max(12, base.size * TYPOGRAPHY_SCALE);
    const nextWeight = Math.min(900, Math.max(400, base.weight) + TYPOGRAPHY_WEIGHT_BUMP);
    el.style.setProperty("font-size", `${nextSize.toFixed(2)}px`, "important");
    el.style.setProperty("font-weight", String(nextWeight), "important");
  }

  function applyTypographyTuning(root) {
    if (!root) return;
    if (TYPOGRAPHY_SCALE === 1 && TYPOGRAPHY_WEIGHT_BUMP === 0) return;
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
    const live = t.textContent.trim();
    if (live.includes("|")) {
      originalText.set(t, live);
      document.title = applyBrandRewrites(live);
      return;
    }
    if (!originalText.has(t)) {
      const reverseEnglish = state.reverseMap && state.reverseMap[live];
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
      syncHomeRouteStyle();
      syncPublicRouteStyle();
      ensureHomeLandingStyle();
      document.documentElement.lang = state.lang;
      selectMapForLang();
      translateSubtree(document.body);
      translateDocumentTitle();
      normalizeInternalLinks(document.body);
      normalizeHeroCta(document.body);
      normalizeLogoNavigation(document.body);
      applyTypographyTuning(document.body);
      normalizePublicRoutes(document.body);
      removeHomeSections();
      syncHeroDashboardPlaceholder();
    } finally {
      clearI18nPending();
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
      let needsDashboardSync = false;
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
              normalizeInternalLinks(node);
              normalizeHeroCta(node);
              normalizeLogoNavigation(node);
              applyTypographyTuning(node);
              needsDashboardSync = true;
            }
            else if (node.nodeType === 3) translateTextNode(node);
          }
        } else if (rec.type === "attributes" && rec.target.nodeType === 1) {
          translateAttrs(rec.target);
          normalizeInternalLinks(rec.target);
          normalizeHeroCta(rec.target);
          normalizeLogoNavigation(rec.target);
          applyTypographyTuning(rec.target);
          needsDashboardSync = true;
        }
      }
      if (needsDashboardSync) {
        removeHomeSections();
        syncHeroDashboardPlaceholder();
      }
    });
    startObserver();
  }

  function getCurrentRoutePath() {
    return (window.location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function handleRouteChange() {
    const nextPath = getCurrentRoutePath();
    if (nextPath === state.routePath) return;
    state.routePath = nextPath;
    syncHomeRouteStyle();
    ensureHomeLandingStyle();
    if (!state.ready) return;
    if (state.routeTimer) window.clearTimeout(state.routeTimer);
    state.routeTimer = window.setTimeout(() => {
      applyAll();
      createToggle();
    }, 60);
    window.setTimeout(() => {
      if (state.routePath === nextPath) applyAll();
    }, 600);
    window.setTimeout(() => {
      if (state.routePath === nextPath) applyAll();
    }, 1600);
  }

  function installRouteHooks() {
    state.routePath = getCurrentRoutePath();
    const wrap = (method) => {
      const original = history[method];
      if (typeof original !== "function") return;
      history[method] = function () {
        const result = original.apply(this, arguments);
        window.setTimeout(handleRouteChange, 0);
        return result;
      };
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
  }

  async function init() {
    state.lang = detectInitialLang();
    syncHomeRouteStyle();
    ensureHomeLandingStyle();
    state.map = await loadTranslations();
    rebuildReverseSet();
    state.ready = true;
    applyAll();
    createToggle();
    setupObserver();
    setTimeout(applyAll, 1500);
    setTimeout(applyAll, 3500);
    setTimeout(translateDocumentTitle, 5500);
  }

  function queueInit() {
    const run = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          init().catch((err) => {
            clearI18nPending();
            console.error("[i18n] init failed", err);
          });
        });
      });
    };

    if (document.readyState === "complete") {
      run();
    } else {
      if (isKoreanPending()) {
        document.addEventListener("DOMContentLoaded", run, { once: true });
      } else {
        window.addEventListener("load", run, { once: true });
      }
    }
  }

  installRouteHooks();
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
