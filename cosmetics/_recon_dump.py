"""Fetch the skincare hub page and dump raw HTML to a file for local inspection."""
import sys
from cosmetics import konvy_fetch, vpn_up
from cosmetics._recon_categories import fetch_with_retry
from cosmetics import config

URL = sys.argv[1] if len(sys.argv) > 1 else "https://www.konvy.com/mall/list.php?param=113-0-0-0&from=category"
OUT = config.STATE_DIR / (sys.argv[2] if len(sys.argv) > 2 else "skincare_113.html")

def main() -> int:
    html = fetch_with_retry(URL)
    if not html:
        print("FAILED"); return 1
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"SAVED {len(html)}b -> {OUT}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
