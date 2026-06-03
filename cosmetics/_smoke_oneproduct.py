"""One-shot smoke: pick a healthy port, fetch the listing, grab ONE product +
its reviews, print a compact result, exit. Meant to be run under an EXTERNAL
hard-kill timeout (PowerShell) to validate the 'short-lived process per product'
design against Playwright/SOCKS wedge hangs."""
from __future__ import annotations
import sys, time, json
from cosmetics import config, konvy_parse, konvy_fetch, vpn_up

def main() -> int:
    ports = vpn_up.dedicated_ports()
    port = vpn_up.pick_healthy_port(ports, 0)
    if port is None:
        print("NO_HEALTHY_PORT"); return 2
    print(f"port={port}", flush=True)
    t0 = time.time()
    with konvy_fetch.KonvyBrowser(port) as b:
        print(f"browser_up t={time.time()-t0:.1f}", flush=True)
        list_url = (f"https://www.konvy.com/mall/list.php?param=113-0-0-0&from=category")
        html = b.fetch_html(list_url, scroll=4)
        urls = konvy_parse.parse_listing(html)
        print(f"listing={len(urls)} t={time.time()-t0:.1f}", flush=True)
        if not urls:
            print("NO_LISTING"); return 3
        purl = urls[0]
        print(f"product_url={purl}", flush=True)
        phtml = b.fetch_html(purl, scroll=2)
        prod = konvy_parse.parse_product(phtml, purl)
        print(f"product_html t={time.time()-t0:.1f}", flush=True)
        reviews = []
        try:
            raw = b.fetch_json(konvy_fetch.reviews_url(prod.product_id), referer=purl)
            reviews = konvy_parse.parse_reviews(raw)
        except Exception as e:
            print(f"reviews_err={str(e)[:80]}", flush=True)
        print("RESULT " + json.dumps({
            "id": prod.product_id, "name": (prod.name or "")[:60], "brand": prod.brand,
            "price_thb": prod.price_thb, "ingredients": len(prod.ingredients),
            "konvy_rating": prod.konvy_rating, "konvy_review_count": prod.konvy_review_count,
            "reviews_parsed": len(reviews), "elapsed": round(time.time()-t0, 1),
        }, ensure_ascii=False), flush=True)
    return 0

if __name__ == "__main__":
    sys.exit(main())
