#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import html
import json
import mimetypes
import re
import shutil
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import deque
from dataclasses import dataclass
from pathlib import Path

DEFAULT_URL = "https://serene-blackberry-401048.framer.app/"
OUTPUT_ROOT = Path(".")
MIRROR_DIRNAME = "mirror"
MANIFEST_PATH = Path("clone-manifest.json")

DOWNLOADABLE_DOMAINS = {
    "serene-blackberry-401048.framer.app",
    "framerusercontent.com",
    "events.framer.com",
    "fonts.gstatic.com",
}

TEXT_EXTENSIONS = {
    ".css",
    ".csv",
    ".html",
    ".htm",
    ".js",
    ".json",
    ".map",
    ".md",
    ".mjs",
    ".svg",
    ".txt",
    ".xml",
}

SCAN_EXTENSIONS = {
    ".css",
    ".html",
    ".htm",
    ".js",
    ".mjs",
    ".svg",
}

TEXT_CONTENT_TYPES = (
    "application/javascript",
    "application/json",
    "application/ld+json",
    "application/xml",
    "image/svg+xml",
    "text/",
)

SKIP_PREFIXES = ("data:", "javascript:", "mailto:", "tel:", "#")

URL_ATTR_RE = re.compile(
    r"""(?P<attr>action|content|data-src|data-href|href|poster|src)\s*=\s*(?P<quote>["'])(?P<value>.*?)(?P=quote)""",
    re.IGNORECASE | re.DOTALL,
)
SRCSET_RE = re.compile(
    r"""(?P<attr>imagesrcset|srcset)\s*=\s*(?P<quote>["'])(?P<value>.*?)(?P=quote)""",
    re.IGNORECASE | re.DOTALL,
)
CSS_URL_RE = re.compile(r"""url\(\s*(?P<quote>["']?)(?P<value>.*?)(?P=quote)\s*\)""", re.IGNORECASE)
ABSOLUTE_URL_RE = re.compile(r"""https?://[^\s"'`,<>{}\\]+""", re.IGNORECASE)
STATIC_IMPORT_RE = re.compile(
    r"""from\s*(?P<quote>["'`])(?P<spec>(?:\./|\.\./|/)[^"'`\s]+)(?P=quote)""",
    re.IGNORECASE,
)
DYNAMIC_IMPORT_RE = re.compile(
    r"""import\(\s*(?P<quote>["'`])(?P<spec>(?:\./|\.\./|/)[^"'`\s]+)(?P=quote)\s*\)""",
    re.IGNORECASE,
)
NEW_URL_RE = re.compile(
    r"""new\s+URL\(\s*(?P<quote>["'`])(?P<spec>(?:\./|\.\./|/)[^"'`\s]+)(?P=quote)\s*,\s*import\.meta\.url\s*\)""",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class DiscoveredRef:
    exact: str
    resolved: str
    rewrite: bool


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Mirror a published landing page into a static local clone.")
    parser.add_argument("--url", default=DEFAULT_URL, help="Entry URL to clone")
    parser.add_argument(
        "--output",
        default=str(OUTPUT_ROOT),
        help="Output directory. Defaults to the current working directory.",
    )
    return parser.parse_args()


def normalize_url(raw_url: str, base_url: str | None = None) -> str | None:
    candidate = html.unescape(raw_url.strip())
    if not candidate or candidate.startswith(SKIP_PREFIXES):
        return None

    while candidate:
        last = candidate[-1]
        if last in ".,;":
            candidate = candidate[:-1]
            continue
        if last == ")" and candidate.count("(") < candidate.count(")"):
            candidate = candidate[:-1]
            continue
        if last == "]" and candidate.count("[") < candidate.count("]"):
            candidate = candidate[:-1]
            continue
        if last == "}" and candidate.count("{") < candidate.count("}"):
            candidate = candidate[:-1]
            continue
        break

    resolved = urllib.parse.urljoin(base_url or "", candidate)
    parsed = urllib.parse.urlsplit(resolved)

    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return None

    clean = parsed._replace(fragment="")
    return urllib.parse.urlunsplit(clean)


def should_download(url: str, entry_url: str) -> bool:
    parsed = urllib.parse.urlsplit(url)
    if not parsed.netloc:
        return False

    allowed_domain = any(
        parsed.netloc == domain or parsed.netloc.endswith(f".{domain}")
        for domain in DOWNLOADABLE_DOMAINS
    )
    if not allowed_domain:
        return False

    if parsed.path in {"", "/"} and not parsed.query and url != entry_url:
        return False

    entry_netloc = urllib.parse.urlsplit(entry_url).netloc
    if parsed.netloc == entry_netloc:
        return True

    return True


def make_local_relpath(url: str) -> Path:
    parsed = urllib.parse.urlsplit(url)
    raw_path = urllib.parse.unquote(parsed.path or "/")
    path = Path(raw_path.lstrip("/"))

    if raw_path.endswith("/") or not path.name or "." not in path.name:
        path = path / "index.html"

    suffix = "".join(path.suffixes)
    stem = path.name[: -len(suffix)] if suffix else path.name
    query_hash = ""
    if parsed.query:
        query_hash = f"__q_{hashlib.sha256(parsed.query.encode('utf-8')).hexdigest()[:12]}"

    final_name = f"{stem}{query_hash}{suffix}"
    return Path(MIRROR_DIRNAME) / parsed.netloc / path.parent / final_name


def make_public_relpath(url: str, entry_netloc: str) -> Path:
    parsed = urllib.parse.urlsplit(url)
    if parsed.netloc != entry_netloc:
        return make_local_relpath(url)

    raw_path = urllib.parse.unquote(parsed.path or "/")
    path = Path(raw_path.lstrip("/"))
    if raw_path.endswith("/") or not path.name or "." not in path.name:
        path = path / "index.html"
    if not path.parts:
        return Path("index.html")
    return path


def path_to_browser_url(rel_path: Path) -> str:
    posix = rel_path.as_posix()
    if posix == "index.html":
        return "/"
    if posix.endswith("/index.html"):
        return "/" + posix[: -len("index.html")]
    return "/" + posix


def local_url_for(url: str, entry_netloc: str) -> str:
    return path_to_browser_url(make_public_relpath(url, entry_netloc))


def local_url_for_exact(exact: str, resolved_url: str, entry_netloc: str) -> str:
    local = local_url_for(resolved_url, entry_netloc)
    fragment = urllib.parse.urlsplit(html.unescape(exact.strip())).fragment
    if fragment:
        return f"{local}#{fragment}"
    return local


def is_text_asset(path: Path, content_type: str, payload: bytes) -> bool:
    suffix = path.suffix.lower()
    if suffix in TEXT_EXTENSIONS:
        return True

    if any(content_type.startswith(prefix) for prefix in TEXT_CONTENT_TYPES):
        return True

    if not payload:
        return False

    sample = payload[:1024]
    return b"\x00" not in sample


def discover_refs(text: str, base_url: str, entry_url: str) -> list[DiscoveredRef]:
    refs: list[DiscoveredRef] = []
    seen: set[tuple[str, str]] = set()
    base_suffix = Path(urllib.parse.urlsplit(base_url).path).suffix.lower()

    def looks_like_url_reference(candidate: str) -> bool:
        stripped = html.unescape(candidate.strip())
        return stripped.startswith(("http://", "https://", "/", "./", "../"))

    def add(exact: str, *, rewrite: bool, require_url_shape: bool = False) -> None:
        if require_url_shape and not looks_like_url_reference(exact):
            return
        resolved = normalize_url(exact, base_url)
        if not resolved or not should_download(resolved, entry_url):
            return
        key = (exact, resolved)
        if key in seen:
            return
        seen.add(key)
        refs.append(DiscoveredRef(exact=exact, resolved=resolved, rewrite=rewrite))

    if base_suffix in {".html", ".htm", ".svg", ""}:
        for match in URL_ATTR_RE.finditer(text):
            add(
                match.group("value"),
                rewrite=True,
                require_url_shape=match.group("attr").lower() == "content",
            )

        for match in SRCSET_RE.finditer(text):
            for candidate in match.group("value").split(","):
                part = candidate.strip()
                if not part:
                    continue
                add(part.split()[0], rewrite=True)

        for match in CSS_URL_RE.finditer(text):
            add(match.group("value"), rewrite=True)

        for match in ABSOLUTE_URL_RE.finditer(text):
            add(match.group(0), rewrite=True)
    elif base_suffix == ".css":
        for match in CSS_URL_RE.finditer(text):
            add(match.group("value"), rewrite=True)

        for match in ABSOLUTE_URL_RE.finditer(text):
            add(match.group(0), rewrite=True)
    elif base_suffix in {".js", ".mjs"}:
        for match in ABSOLUTE_URL_RE.finditer(text):
            add(match.group(0), rewrite=True)

        for pattern in (STATIC_IMPORT_RE, DYNAMIC_IMPORT_RE, NEW_URL_RE):
            for match in pattern.finditer(text):
                add(match.group("spec"), rewrite=False)
    else:
        for match in ABSOLUTE_URL_RE.finditer(text):
            add(match.group(0), rewrite=True)

    return refs


def fetch_url(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; landing-recova-cloner/1.0)",
            "Accept": "*/*",
        },
    )
    with urllib.request.urlopen(request) as response:
        content_type = response.headers.get_content_type() or "application/octet-stream"
        return response.read(), content_type


def rewrite_text(text: str, replacements: dict[str, str]) -> str:
    if not replacements:
        return text

    rewritten = text
    for original, local_path in sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True):
        rewritten = rewritten.replace(original, local_path)
    return rewritten


def should_scan_text_asset(path: Path) -> bool:
    return path.suffix.lower() in SCAN_EXTENSIONS


def clone_site(entry_url: str, output_root: Path) -> dict[str, object]:
    queue: deque[str] = deque([entry_url])
    visited: set[str] = set()
    file_replacements: dict[Path, dict[str, str]] = {}
    downloaded: list[dict[str, str]] = []
    errors: list[dict[str, str]] = []

    mirror_root = output_root / MIRROR_DIRNAME
    if mirror_root.exists():
        shutil.rmtree(mirror_root)

    while queue:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)

        rel_path = make_local_relpath(url)
        public_rel_path = make_public_relpath(url, urllib.parse.urlsplit(entry_url).netloc)
        out_path = output_root / rel_path
        public_out_path = output_root / public_rel_path
        out_path.parent.mkdir(parents=True, exist_ok=True)
        public_out_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            payload, content_type = fetch_url(url)
        except urllib.error.URLError as error:
            errors.append({"url": url, "error": str(error)})
            continue

        text_asset = is_text_asset(rel_path, content_type, payload)
        replacements: dict[str, str] = {}

        if text_asset:
            text = payload.decode("utf-8", errors="ignore")
            if should_scan_text_asset(rel_path):
                refs = discover_refs(text, url, entry_url)
                for ref in refs:
                    if ref.resolved not in visited:
                        queue.append(ref.resolved)
                    if ref.rewrite and urllib.parse.urlsplit(ref.resolved).netloc == urllib.parse.urlsplit(entry_url).netloc:
                        replacements[ref.exact] = local_url_for_exact(
                            ref.exact,
                            ref.resolved,
                            urllib.parse.urlsplit(entry_url).netloc,
                        )

            rewritten_text = rewrite_text(text, replacements)
            out_path.write_text(rewritten_text, encoding="utf-8")
            public_out_path.write_text(rewritten_text, encoding="utf-8")
            if replacements:
                file_replacements[rel_path] = replacements
        else:
            out_path.write_bytes(payload)
            public_out_path.write_bytes(payload)

        downloaded.append(
            {
                "url": url,
                "path": rel_path.as_posix(),
                "content_type": content_type,
            }
        )

    root_index = output_root / "index.html"

    manifest: dict[str, object] = {
        "entry_url": entry_url,
        "root_index": root_index.as_posix(),
        "downloaded_files": downloaded,
        "rewritten_files": {
            path.as_posix(): replacements
            for path, replacements in sorted(file_replacements.items(), key=lambda item: item[0].as_posix())
        },
        "errors": errors,
    }
    manifest["recova_patches"] = apply_recova_patches(output_root)

    (output_root / MANIFEST_PATH).write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    return manifest


BASE_STYLE_TAG = (
    '<style data-recova-hide>'
    '[data-framer-name="Remove This Buy Promo"],'
    '[data-framer-name="Design By"],'
    '[data-framer-name="Designed  by"],'
    '[data-framer-name="Designed by"],'
    '[data-framer-name="Designed Company"],'
    '#__framer-badge-container,'
    '[id^="__framer-editorbar"]'
    '{display:none!important}'
    'img[src*="kq857rH86cqGviBRliG7ERQy3MU"],'
    'img[src*="ffnslfTs7Y5SIcEE2EqFkMWCMXA"],'
    'img[src*="C7Zy7gR9F6aRLgmI8rdtenyW4"],'
    'img[src*="61WHQWZqzjWYfo1MWf1nJyU6WU"]'
    '{display:none!important}'
    '[data-framer-name="Company Name"]{position:relative!important;min-width:80px;min-height:32px}'
    '[data-framer-name="Company Name"]::after{content:"slit";position:absolute!important;left:0;top:50%;transform:translateY(-50%);font:700 28px/1 -apple-system,BlinkMacSystemFont,"Pretendard","Segoe UI",sans-serif;color:#fff;letter-spacing:-0.02em;white-space:nowrap;pointer-events:none}'
    '[data-framer-name="Logo & Details"] [data-framer-name="Company Logo"]{position:relative!important;min-width:48px;min-height:48px;background:rgba(255,255,255,0.08);border-radius:12px}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Button Selector"]{display:none!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Desktop Monthly"]{width:100%!important;max-width:960px!important;margin:0 auto!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Cards"]{width:100%!important;display:block!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Cards"]>[data-framer-name="Monthly Card"]+ [data-framer-name="Monthly Card"]{display:none!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Monthly Card"]{width:100%!important;max-width:none!important;margin:0 auto!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Top Content"]{min-height:340px!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Bottom Content"]{padding-top:28px!important;overflow:visible!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name="Features Menu"]{flex:1 1 0!important;justify-content:flex-start!important;align-items:flex-start!important;overflow:visible!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name^="Features Point"]{width:100%!important;overflow:visible!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name^="Features Point"] [data-framer-name="Default"]{width:100%!important;justify-content:flex-start!important}'
    '[data-framer-name="Pricing Section"] [data-framer-name^="Features Point"] [data-framer-name="Title"]{flex:1 1 auto!important;min-width:0!important}'
    'a[data-framer-name="Logo"]{position:relative!important}'
    'a[data-framer-name="Logo"]::after{content:"slit";position:absolute!important;left:0;top:50%;transform:translateY(-50%);font:700 22px/1 -apple-system,BlinkMacSystemFont,"Pretendard","Segoe UI",sans-serif;color:#fff;letter-spacing:-0.02em;white-space:nowrap;pointer-events:none}'
    'html[lang="ko"] .framer-kAyMd .framer-1g5q2vj,'
    'html[lang="ko"] .framer-kAyMd .framer-1we9bz9,'
    'html[lang="ko"] .framer-kAyMd.framer-v-m3pu6j .framer-1jwm4ji'
    '{word-break:keep-all!important;overflow-wrap:break-word!important}'
    'html[lang="ko"] .framer-kAyMd .framer-g57tu6'
    '{width:100%!important;max-width:760px!important;margin:0 auto!important}'
    '</style>'
)
HIDE_STYLE_BLOCK_RE = re.compile(r'<style data-recova-hide(?:-(?:home|promo))?\b[^>]*>[^<]*</style>')
HIDE_STYLE_INSERT_AFTER = "<head>"

I18N_SCRIPT_TAG = '<script src="/assets/i18n.js" defer data-recova-i18n></script>'
I18N_BOOTSTRAP_TAG = (
    '<script data-recova-i18n-bootstrap>'
    '(function(){'
    'try{'
    'var key="recova_lang";'
    'var lang=localStorage.getItem(key);'
    'if(lang!=="ko"&&lang!=="en"){lang=((navigator.language||"en").toLowerCase().indexOf("ko")===0)?"ko":"en";}'
    'document.documentElement.lang=lang;'
    'document.documentElement.setAttribute("data-recova-preferred-lang",lang);'
    'if(lang==="ko"){document.documentElement.setAttribute("data-recova-i18n-pending","1");}'
    'window.__recovaClearI18nPending=function(){document.documentElement.removeAttribute("data-recova-i18n-pending");};'
    'window.__recovaI18nPendingTimeout=window.setTimeout(window.__recovaClearI18nPending,3000);'
    '}catch(e){}'
    '})();'
    '</script>'
    '<style data-recova-i18n-guard>'
    'html[data-recova-i18n-pending="1"] body{visibility:hidden!important}'
    '</style>'
)
I18N_SCRIPT_BLOCK_RE = re.compile(r'<script [^>]*data-recova-i18n[^>]*></script>')
I18N_BOOTSTRAP_BLOCK_RE = re.compile(
    r'<script data-recova-i18n-bootstrap>.*?</script>|<style data-recova-i18n-guard>.*?</style>',
    re.DOTALL,
)
I18N_SCRIPT_INSERT_BEFORE = "</head>"

BRAND_REPLACEMENTS: tuple[tuple[str, str], ...] = (
    ("FlowSuite", "slit"),
    ("Flowsuite", "slit"),
    ("flowsuite", "slit"),
    ("Recova", "slit"),
)


def apply_brand_rename(text: str) -> tuple[str, int]:
    n = 0
    for old, new in BRAND_REPLACEMENTS:
        if old in text:
            n += text.count(old)
            text = text.replace(old, new)
    return text, n


def inject_hide_style(html_text: str, rel_path: Path) -> tuple[str, bool]:
    cleaned = HIDE_STYLE_BLOCK_RE.sub("", html_text)
    pos = cleaned.find(HIDE_STYLE_INSERT_AFTER)
    if pos == -1:
        return html_text, False
    insert_at = pos + len(HIDE_STYLE_INSERT_AFTER)
    updated = cleaned[:insert_at] + BASE_STYLE_TAG + cleaned[insert_at:]
    return updated, updated != html_text


def inject_i18n_script(html_text: str) -> tuple[str, bool]:
    cleaned = I18N_BOOTSTRAP_BLOCK_RE.sub("", html_text)
    cleaned = I18N_SCRIPT_BLOCK_RE.sub("", cleaned)
    pos = cleaned.find(I18N_SCRIPT_INSERT_BEFORE)
    if pos == -1:
        return html_text, False
    updated = cleaned[:pos] + I18N_BOOTSTRAP_TAG + I18N_SCRIPT_TAG + cleaned[pos:]
    return updated, updated != html_text


def apply_recova_patches(output_root: Path) -> dict[str, list[str]]:
    styled: list[str] = []
    scripted: list[str] = []
    rebranded: list[str] = []
    skipped: list[str] = []

    for html_path in sorted(output_root.rglob("*.html")):
        try:
            rel = html_path.relative_to(output_root)
        except ValueError:
            continue
        if rel.parts and rel.parts[0] in {MIRROR_DIRNAME, ".tmp_compare", ".git", ".playwright-mcp", "assets"}:
            continue

        try:
            original = html_path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            skipped.append(rel.as_posix())
            continue

        text = original
        text, did_style = inject_hide_style(text, rel)
        text, did_script = inject_i18n_script(text)
        text, brand_hits = apply_brand_rename(text)

        if text != original:
            html_path.write_text(text, encoding="utf-8")
        if brand_hits > 0:
            rebranded.append(f"{rel.as_posix()} (-{brand_hits})")
        if did_style:
            styled.append(rel.as_posix())
        if did_script:
            scripted.append(rel.as_posix())

    return {
        "injected_hide_style": styled,
        "injected_i18n_script": scripted,
        "rebranded": rebranded,
        "skipped": skipped,
    }


def main() -> int:
    args = parse_args()
    output_root = Path(args.output).resolve()
    output_root.mkdir(parents=True, exist_ok=True)

    entry_url = normalize_url(args.url)
    if not entry_url:
        print(f"Invalid URL: {args.url}", file=sys.stderr)
        return 1

    manifest = clone_site(entry_url, output_root)
    print(
        json.dumps(
            {
                "entry_url": manifest["entry_url"],
                "downloaded_count": len(manifest["downloaded_files"]),
                "error_count": len(manifest["errors"]),
                "root_index": manifest["root_index"],
            },
            indent=2,
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
