"""Konvy review scraper — fetches review text for all products in master_db.

Uses the same ajax_comment API that konvy_scraper.py calls during product scrape.
Handles pagination (page 1, 2, … until empty).
Saves to output/reviews/{product_id}_konvy.json in the standard snippet format.

Usage:
    python -m cosmetics.konvy_reviews
"""
from __future__ import annotations
import json, logging, time
from pathlib import Path

from cosmetics import config
from cosmetics.konvy_fetch import KonvyBrowser, reviews_url, is_socks_dead_error, is_waf_challenge
from cosmetics.konvy_parse import parse_reviews

log = logging.getLogger("cosmetics.konvy_reviews")


def _fetch_all_reviews(browser: KonvyBrowser, product_id: str, product_url: str) -> list[dict]:
    """Fetch all review pages for a product. Returns list of snippet dicts."""
    snippets: list[dict] = []
    seen_ids: set[str] = set()

    for page in range(1, 20):  # cap at 20 pages = 400 reviews
        url = reviews_url(product_id, page)
        try:
            raw = browser.fetch_json(url, referer=product_url)
        except Exception as e:
            if is_socks_dead_error(str(e)):
                raise
            log.warning("[konvy] review fetch error %s p%d: %s", product_id, page, str(e)[:80])
            break

        reviews = parse_reviews(raw)
        if not reviews:
            break

        new = 0
        for r in reviews:
            if r.review_id in seen_ids:
                continue
            seen_ids.add(r.review_id)
            if r.body and len(r.body.strip()) >= 3:
                snippets.append({
                    "text": r.body.strip()[:500],
                    "author": r.author or "",
                    "rating": float(r.rating or 0),
                    "date": r.timestamp or "",
                    "source_url": product_url,
                })
                new += 1

        if new == 0:
            break  # duplicate page = we've seen everything
        time.sleep(config.DELAY_REVIEW_SEC)

    return snippets


def _save(product_id: str, product_name: str, snippets: list[dict]) -> Path:
    out = config.REVIEWS_DIR / f"{product_id}_konvy.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    data = {
        "source": "konvy",
        "product_name": product_name,
        "review_count": len(snippets),
        "snippets": snippets,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return out


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=None, help="VPN SOCKS5 port to use")
    parser.add_argument("--shard", default=None, help="I/N e.g. 0/4 — worker index / total workers")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(message)s")

    from cosmetics import vpn_up
    ports = vpn_up.pick_active_ports()
    if not ports:
        print("ERROR: no active VPN ports"); return 1

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    products: list[dict] = list(
        json.loads(db_path.read_text(encoding="utf-8"))["products"].values()
    )

    pending = [
        p for p in products
        if p.get("product_id")
        and not (config.REVIEWS_DIR / f"{p['product_id']}_konvy.json").exists()
    ]
    total = len(products)
    skip = total - len(pending)
    done = fail = 0

    if args.shard:
        shard_i, shard_n = map(int, args.shard.split("/"))
        pending = [p for j, p in enumerate(pending) if j % shard_n == shard_i]
        print(f"Konvy reviews shard {shard_i}/{shard_n}: {len(pending)} products")
    else:
        print(f"Konvy reviews: {len(pending)} pending / {total} total / {skip} already done")

    port = args.port if args.port else ports[-1]

    while pending:
        try:
            with KonvyBrowser(port) as browser:
                while pending:
                    p = pending[0]
                    pid = str(p["product_id"])
                    purl = p.get("url", f"https://www.konvy.com/product/{pid}.html")
                    idx = total - len(pending) + 1
                    print(f"[{idx}/{total}] {pid}: {p.get('name','')[:50]}")
                    try:
                        snippets = _fetch_all_reviews(browser, pid, purl)
                        _save(pid, p.get("name", ""), snippets)
                        done += 1
                        pending.pop(0)
                        print(f"  → {len(snippets)} reviews")
                        time.sleep(config.DELAY_REVIEW_SEC)
                    except KeyboardInterrupt:
                        raise
                    except Exception as e:
                        err = str(e)
                        log.error("[konvy] %s: %s", pid, err[:100])
                        fail += 1
                        pending.pop(0)
                        if is_socks_dead_error(err):
                            raise
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.warning("[konvy] browser restart: %s", str(e)[:80])
            time.sleep(5)

    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
