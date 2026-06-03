"""Short-lived Konvy worker — ONE browser session, then exit. Spawned by
konvy_supervise under an external hard-kill timeout so a Playwright/SOCKS *wedge*
(which ignores Playwright's own navigation timeout) only loses this one task.

Two subcommands, both opening a FRESH browser so the target is the *first*
navigation on that context — this is what passes the Aliyun WAF (listing->product
on one reused context escalates to the slider CAPTCHA and returns an empty page):

    python -m cosmetics.konvy_worker discover <port>
        -> prints 'URLS <json:[[url,concern],...]>'
    python -m cosmetics.konvy_worker product <url> <concern> <port>
        -> prints 'RESULT <json:product-row>'  (also writes reviews json)

stdout carries the result line; the supervisor parses it. Any wedge -> the
supervisor kills the process tree and moves on.
"""
from __future__ import annotations
import os, sys, json, time
from dataclasses import asdict

from cosmetics import config, konvy_parse, konvy_fetch, vpn_up
from cosmetics.konvy_scraper import listing_urls_for, save_reviews

# How many review pages to pull per product (corpus for sentiment/keyword AEO).
# Bounded so the worker stays under the supervisor's hard-kill window.
REVIEW_PAGES = int(os.getenv("COSMETICS_REVIEW_PAGES", "6"))


def _do_discover(port: int) -> int:
    pairs: list[tuple[str, str]] = []
    with konvy_fetch.KonvyBrowser(port) as b:
        for concern in config.CONCERNS:
            for list_url in listing_urls_for(concern):
                html = b.fetch_html(list_url, scroll=6)
                for u in konvy_parse.parse_listing(html):
                    pairs.append((u, concern))
    seen, out = set(), []
    for u, c in pairs:
        if u not in seen:
            seen.add(u); out.append([u, c])
    print("URLS " + json.dumps(out, ensure_ascii=False), flush=True)
    return 0


def _do_listing(url: str, port: int) -> int:
    """Fetch ONE listing/search page in a fresh browser, print 'URLS <json:[url,...]>'.
    Fresh context = the listing is the first navigation (WAF-safe); the supervisor
    fans this out per keyword so no single context does many sequential listings."""
    with konvy_fetch.KonvyBrowser(port) as b:
        html = b.fetch_html(url, scroll=5)
        if konvy_fetch.is_waf_challenge(html):
            print("WAF_BLOCKED", flush=True); return 4
        urls = konvy_parse.parse_listing(html)
        print("URLS " + json.dumps(urls, ensure_ascii=False), flush=True)
    return 0


def _do_product(url: str, concern: str, port: int) -> int:
    with konvy_fetch.KonvyBrowser(port) as b:
        html = b.fetch_html(url, scroll=2)
        if konvy_fetch.is_waf_challenge(html):
            print("WAF_BLOCKED", flush=True); return 4
        prod = konvy_parse.parse_product(html, url)
        if not prod.name:
            print("EMPTY_PARSE", flush=True); return 5
        prod.concern_seeds = [concern] if concern else []
        # Product mode = metadata only (fast + reliable). Reviews are a SEPARATE phase
        # (own time budget) so the product-fetch hard-kill never costs us the corpus.
        row = asdict(prod)
        row["ingredients"] = "|".join(prod.ingredients)
        row["images"] = "|".join(prod.images)
        row["concern_seeds"] = "|".join(prod.concern_seeds)
        row.pop("ingredients_raw", None)
        print("RESULT " + json.dumps(row, ensure_ascii=False), flush=True)
    return 0


def _do_reviews(product_id: str, url: str, port: int) -> int:
    """Dedicated review-corpus pull: open the product page (sets WAF cookies), then
    page through ajax_comment, save to output/reviews/<id>_konvy.json. Runs in its
    own subprocess with its own hard-kill budget — no contention with product fetch."""
    with konvy_fetch.KonvyBrowser(port) as b:
        # navigate to the product page first so in-page fetch carries WAF cookies
        html = b.fetch_html(url, scroll=0)
        if konvy_fetch.is_waf_challenge(html):
            print("WAF_BLOCKED", flush=True); return 4
        all_reviews = []
        for page in range(1, REVIEW_PAGES + 1):
            raw = b.fetch_json(konvy_fetch.reviews_url(product_id, page=page),
                               referer=url if page == 1 else "", fetch_timeout_ms=15000)
            page_reviews = konvy_parse.parse_reviews(raw)
            if not page_reviews:
                break
            all_reviews.extend(page_reviews)
            time.sleep(0.6)
        if all_reviews:
            save_reviews(product_id, all_reviews)
        print(f"REVIEWS {len(all_reviews)}", flush=True)
    return 0


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: konvy_worker discover <port> | product <url> <concern> <port>"); return 64
    mode = sys.argv[1]
    if mode == "discover":
        return _do_discover(int(sys.argv[2]))
    if mode == "listing":
        url, port = sys.argv[2], int(sys.argv[3])
        return _do_listing(url, port)
    if mode == "product":
        url, concern, port = sys.argv[2], sys.argv[3], int(sys.argv[4])
        return _do_product(url, concern, port)
    if mode == "reviews":
        product_id, url, port = sys.argv[2], sys.argv[3], int(sys.argv[4])
        return _do_reviews(product_id, url, port)
    print(f"unknown mode {mode}"); return 64


if __name__ == "__main__":
    sys.exit(main())
