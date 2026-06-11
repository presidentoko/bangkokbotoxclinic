"""HDmall.co.th anti-bot probe.

검색 URL을 헤드리스 Playwright로 1회 hit해서:
- 응답 HTML 크기, title, 캡차/Cloudflare/DataDome 흔적, 결과 카드 존재 여부 확인.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR = Path(__file__).parent
DEBUG_HTML = OUT_DIR / "probe_response.html"
RESULT_JSON = OUT_DIR / "probe_result.json"

TEST_QUERIES = [
    "https://hdmall.co.th/",
    "https://hdmall.co.th/search?q=clinic",
    "https://hdmall.co.th/search?q=Bangkok+Hospital",
]

SIGNATURES = {
    "datadome": ["captcha-delivery", "DataDome"],
    "cloudflare": ["cf-ray", "Just a moment", "challenge-platform"],
    "perimeterx": ["px-captcha", "_pxhd"],
    "recaptcha": ["g-recaptcha", "recaptcha/api"],
}


def detect(html: str) -> list[str]:
    hits = []
    for name, pats in SIGNATURES.items():
        if any(p in html for p in pats):
            hits.append(name)
    return hits


def main() -> int:
    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
        )
        ctx = browser.new_context(
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
            extra_http_headers={"Accept-Language": "th,en;q=0.9"},
        )
        ctx.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )
        page = ctx.new_page()
        page.set_default_timeout(30000)

        for url in TEST_QUERIES:
            entry = {"url": url}
            try:
                resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
                entry["status"] = resp.status if resp else None
                entry["final_url"] = page.url
                entry["title"] = page.title()
                html = page.content()
                entry["html_size"] = len(html)
                entry["detect"] = detect(html)
                # 결과 카드/링크 후보 카운트
                entry["a_count"] = len(page.query_selector_all("a"))
                entry["img_count"] = len(page.query_selector_all("img"))
                entry["body_snippet"] = page.inner_text("body")[:300] if page.query_selector("body") else ""
                # 첫 페이지만 HTML 저장
                if url == TEST_QUERIES[0]:
                    DEBUG_HTML.write_text(html, encoding="utf-8")
            except Exception as e:
                entry["error"] = f"{type(e).__name__}: {str(e)[:200]}"
            results.append(entry)
            print(json.dumps(entry, ensure_ascii=False, indent=2))
            print("---")

        ctx.close()
        browser.close()

    RESULT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved: {RESULT_JSON}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
