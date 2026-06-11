"""HDmall 검색 결과 페이지 구조 빠른 분석."""
import re
from collections import Counter
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "search_response.html"

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True)
    p = b.new_page()
    p.set_default_timeout(30000)
    p.goto("https://hdmall.co.th/search?q=Bangkok+Hospital", wait_until="domcontentloaded")
    try:
        p.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    html = p.content()
    OUT.write_text(html, encoding="utf-8")
    print(f"saved {OUT} ({len(html)} bytes)")

    hrefs = re.findall(r'href="([^"]+)"', html)
    rel = [h for h in hrefs if h.startswith("/") and not h.startswith("/_") and not h.startswith("/assets")]
    # 패턴 분류
    pat_counter = Counter()
    sample_by_pattern: dict[str, list[str]] = {}
    for h in rel:
        seg = h.split("/")[1] if "/" in h[1:] else h.strip("/")
        key = f"/{seg}/..." if "/" in h.lstrip("/") else h
        # 더 세부 — 두 번째 segment까지
        parts = h.lstrip("/").split("/")
        if len(parts) >= 2:
            key = f"/{parts[0]}/<slug>"
        else:
            key = f"/<slug>"
        pat_counter[key] += 1
        sample_by_pattern.setdefault(key, []).append(h)

    print("\ntop URL patterns in search response:")
    for k, n in pat_counter.most_common(15):
        examples = sample_by_pattern[k][:3]
        print(f"  {n:>4}x  {k}    e.g. {examples}")

    # provider/clinic 카드 후보 — h2/h3 + 근처 링크
    headings = p.query_selector_all("h1, h2, h3, h4")
    print(f"\nheadings found: {len(headings)} (first 15):")
    for h in headings[:15]:
        try:
            t = (h.inner_text() or "").strip()
            if t:
                print(f"  - {t[:80]}")
        except Exception:
            pass

    b.close()
