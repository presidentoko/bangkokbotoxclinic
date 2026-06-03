"""Recon: harvest Konvy category IDs. Fetches a set of nav/category pages in a
fresh browser (per page, to dodge WAF escalation) and extracts every
list.php?param=<catId>-... link with its anchor text, plus the product count each
listing yields. Output -> cosmetics/state/categories.json for review.

Run via the supervisor's worker wrapper or directly under a hard-kill timeout.
"""
from __future__ import annotations
import json, re, sys, time
from collections import OrderedDict

from cosmetics import konvy_fetch, konvy_parse, vpn_up

PARAM_RE = re.compile(r"/mall/list\.php\?param=(\d+)-")
POOL = [2090, 2091, 2086, 2087]
# Drill the skincare + makeup hubs (their sidebars carry the sub-category links
# where acne / whitening / serum / etc. live). 113=skincare, 116=body, 114=makeup.
SEED_PAGES = [
    "https://www.konvy.com/mall/list.php?param=113-0-0-0&from=category",
    "https://www.konvy.com/mall/list.php?param=116-0-0-0&from=category",
    "https://www.konvy.com/mall/list.php?param=114-0-0-0&from=category",
    "https://www.konvy.com/",
]


def fetch_with_retry(url: str, attempts: int = 8) -> str:
    """Cycle the combined pool, skip WAF/dead exits, return a real page or ''."""
    for i in range(attempts):
        port = vpn_up.pick_healthy_port(POOL, i)
        if port is None:
            time.sleep(10); continue
        try:
            with konvy_fetch.KonvyBrowser(port) as b:
                html = b.fetch_html(url, scroll=3)
                if html and not konvy_fetch.is_waf_challenge(html):
                    print(f"  ok via {port} ({len(html)}b)", flush=True)
                    return html
                print(f"  WAF/empty via {port} -> retry", flush=True)
        except Exception as e:
            print(f"  err via {port}: {str(e)[:70]}", flush=True)
        time.sleep(3)
    return ""


def extract_categories(html: str) -> "OrderedDict[str,str]":
    """catId -> a representative anchor text (best-effort, Thai/EN)."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "lxml")
    out: "OrderedDict[str,str]" = OrderedDict()
    for a in soup.select("a[href*='list.php?param=']"):
        m = PARAM_RE.search(a.get("href", ""))
        if not m:
            continue
        cid = m.group(1)
        txt = " ".join(a.get_text(" ", strip=True).split())[:60]
        if cid not in out or (not out[cid] and txt):
            out[cid] = txt
    return out


def main() -> int:
    cats: "OrderedDict[str,str]" = OrderedDict()
    for url in SEED_PAGES:
        print(f"[fetch] {url}", flush=True)
        html = fetch_with_retry(url)
        if not html:
            print(f"  GAVE UP on {url}", flush=True); continue
        found = extract_categories(html)
        for cid, txt in found.items():
            if cid not in cats or (not cats[cid] and txt):
                cats[cid] = txt
        print(f"  -> {len(found)} cat links (total {len(cats)})", flush=True)
        time.sleep(2)
    from cosmetics import config
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    outp = config.STATE_DIR / "categories.json"
    outp.write_text(json.dumps(cats, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"RESULT {len(cats)} categories -> {outp}", flush=True)
    # echo a compact table to stdout for quick eyeballing
    for cid, txt in cats.items():
        print(f"  {cid}\t{txt}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
