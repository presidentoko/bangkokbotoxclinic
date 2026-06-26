"""
fetch.py — download each hospital's checkup page and save extracted body text to cache/.
Playwright fallback if httpx yields < MIN_CHARS characters (JS-rendered page).
"""
import os
import time
import pymysql
import httpx
from selectolax.parser import HTMLParser
from config import DB_CONFIG

CACHE_DIR = "cache"
MIN_CHARS = 500
SLEEP_SEC = 2

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/125.0.0.0 Safari/537.36"
)
STRIP_TAGS = ("script", "style", "nav", "footer", "header", "noscript", "svg")


def extract_text(html: str) -> str:
    tree = HTMLParser(html)
    for tag in STRIP_TAGS:
        for node in tree.css(tag):
            node.decompose()
    body = tree.css_first("body")
    if not body:
        return tree.text(separator=" ", strip=True)
    return body.text(separator=" ", strip=True)


def fetch_with_playwright(url: str) -> str:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(user_agent=UA)
        page.goto(url, wait_until="networkidle", timeout=30000)
        html = page.content()
        browser.close()
    return extract_text(html)


def fetch_hospital(slug: str, url: str) -> None:
    out_path = os.path.join(CACHE_DIR, f"{slug}.txt")
    print(f"[fetch] {slug} ← {url}")
    try:
        with httpx.Client(headers={"User-Agent": UA}, follow_redirects=True, timeout=20) as client:
            resp = client.get(url)
            resp.raise_for_status()
            text = extract_text(resp.text)

        if len(text) < MIN_CHARS:
            print(f"  → too short ({len(text)} chars), trying playwright…")
            text = fetch_with_playwright(url)

        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"  → {len(text):,} chars saved to {out_path}")
    except Exception as exc:
        print(f"  ✗ {exc}")


def main():
    os.makedirs(CACHE_DIR, exist_ok=True)
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor(pymysql.cursors.DictCursor) as cur:
        cur.execute("SELECT slug, checkup_url FROM hospitals WHERE checkup_url IS NOT NULL")
        rows = cur.fetchall()
    conn.close()

    for i, row in enumerate(rows):
        fetch_hospital(row["slug"], row["checkup_url"])
        if i < len(rows) - 1:
            time.sleep(SLEEP_SEC)

    print(f"\nDone — {len(rows)} hospital(s) fetched.")


if __name__ == "__main__":
    main()
