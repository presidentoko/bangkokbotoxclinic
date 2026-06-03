"""Verify the Konvy keyword-search listing (/list/?title=<kw>) yields products and
how far scroll paginates. Tests acne/whitening Thai keywords."""
import sys, time, json, urllib.parse
from cosmetics import konvy_fetch, konvy_parse, vpn_up
from cosmetics._recon_categories import POOL

KEYWORDS = {
    "acne": ["สิว", "รักษาสิว", "แต้มสิว"],
    "whitening": ["ฝ้า", "จุดด่างดำ", "ผิวกระจ่างใส", "วิตามินซี"],
}

def fetch_search(kw: str, scroll: int):
    url = "https://www.konvy.com/list/?title=" + urllib.parse.quote(kw)
    for i in range(6):
        port = vpn_up.pick_healthy_port(POOL, i)
        if port is None:
            time.sleep(8); continue
        try:
            with konvy_fetch.KonvyBrowser(port) as b:
                html = b.fetch_html(url, scroll=scroll)
                if html and not konvy_fetch.is_waf_challenge(html):
                    return konvy_parse.parse_listing(html), port, len(html)
        except Exception as e:
            print(f"  err {port}: {str(e)[:60]}", flush=True)
        time.sleep(3)
    return [], None, 0

def main() -> int:
    for concern, kws in KEYWORDS.items():
        for kw in kws:
            urls, port, n = fetch_search(kw, scroll=5)
            print(f"[{concern}] {kw!r}: {len(urls)} products (via {port}, {n}b)", flush=True)
            for u in urls[:2]:
                print(f"    {u}", flush=True)
            time.sleep(2)
    # pagination probe: same keyword, shallow vs deep scroll
    a, _, _ = fetch_search("สิว", scroll=2)
    b, _, _ = fetch_search("สิว", scroll=12)
    print(f"PAGINATION สิว: scroll2={len(a)} scroll12={len(b)}", flush=True)
    return 0

if __name__ == "__main__":
    sys.exit(main())
