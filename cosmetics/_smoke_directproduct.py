"""Fetch a product detail page DIRECTLY in a fresh browser (no listing first),
to test whether a clean first-navigation passes the WAF where listing->product
on the same context escalates. Run under an external hard-kill timeout."""
from __future__ import annotations
import sys, time, json
from cosmetics import konvy_parse, konvy_fetch, vpn_up

URL = sys.argv[1] if len(sys.argv) > 1 else \
    "https://www.konvy.com/nu-formula/nu-formula-jimmy-secret-fan-box-barrier-boost-1-set-130002.html"

def main() -> int:
    port = vpn_up.pick_healthy_port(vpn_up.dedicated_ports(), 0)
    if port is None:
        print("NO_HEALTHY_PORT"); return 2
    print(f"port={port} url={URL}", flush=True)
    t0 = time.time()
    with konvy_fetch.KonvyBrowser(port) as b:
        html = b.fetch_html(URL, scroll=2)
        waf = konvy_fetch.is_waf_challenge(html)
        prod = konvy_parse.parse_product(html, URL)
        print(f"html_len={len(html)} is_waf={waf} t={time.time()-t0:.1f}", flush=True)
        print("RESULT " + json.dumps({
            "id": prod.product_id, "name": (prod.name or "")[:60], "brand": prod.brand,
            "price_thb": prod.price_thb, "ingredients": len(prod.ingredients),
            "konvy_review_count": prod.konvy_review_count,
        }, ensure_ascii=False), flush=True)
    return 0

if __name__ == "__main__":
    sys.exit(main())
