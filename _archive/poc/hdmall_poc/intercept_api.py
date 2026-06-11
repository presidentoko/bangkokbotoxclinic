"""Intercept network requests on sitemap/brands pages to find API endpoint."""
from __future__ import annotations
import json, sys, re, time
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

OUT_DIR = Path(__file__).parent / "debug_html"
OUT_DIR.mkdir(exist_ok=True)

API_LOG: list[dict] = []


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=[
            "--disable-blink-features=AutomationControlled",
        ])
        ctx = browser.new_context(
            locale="th-TH",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            extra_http_headers={"Accept-Language": "th,en;q=0.9"},
        )
        ctx.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )

        def on_response(response):
            url = response.url
            # Capture XHR/fetch that look like data APIs
            if any(x in url for x in ["api", "brand", "clinic", "search", "hd.co.th/api", "graphql"]):
                try:
                    body = response.body()
                    ct = response.headers.get("content-type", "")
                    entry = {"url": url, "status": response.status, "content_type": ct, "size": len(body)}
                    if "json" in ct and len(body) < 500000:
                        try:
                            data = json.loads(body)
                            entry["json_keys"] = list(data.keys()) if isinstance(data, dict) else f"list[{len(data)}]"
                            # Save if it looks like brand data
                            if isinstance(data, (dict, list)) and any(
                                k in str(data)[:1000] for k in ["brand", "clinic", "name", "slug", "rating"]
                            ):
                                slug = re.sub(r"[^a-z0-9]+", "_", url.split("//")[-1])[:60]
                                (OUT_DIR / f"api_{slug}.json").write_bytes(body)
                                entry["saved"] = True
                        except Exception:
                            pass
                    API_LOG.append(entry)
                except Exception:
                    pass

        page = ctx.new_page()
        page.on("response", on_response)
        page.set_default_timeout(25000)

        # Try the brands sitemap page
        for url in [
            "https://hdmall.co.th/sitemap/beauty/brands",
            "https://hdmall.co.th/sitemap/dental-clinics/brands",
        ]:
            print(f"\nLoading {url}")
            API_LOG.clear()
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=25000)
                try:
                    page.wait_for_load_state("networkidle", timeout=10000)
                except PWTimeout:
                    pass
                time.sleep(2)  # extra wait for lazy loads
            except Exception as e:
                print(f"  ERROR: {e}")

            print(f"  captured {len(API_LOG)} API responses")
            for e in sorted(API_LOG, key=lambda x: -x.get("size", 0))[:20]:
                saved = " [SAVED]" if e.get("saved") else ""
                keys = e.get("json_keys", "")
                print(f"  {e['status']} {e['size']:>8}b {e['url'][:80]}  keys={keys}{saved}")

        ctx.close()
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
