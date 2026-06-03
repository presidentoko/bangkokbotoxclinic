# -*- coding: utf-8 -*-
"""Pantip review-mention aggregation for cosmetics products.

Second review source (beyond Konvy) — differentiator.
Uses plain httpx via pantip/scraper.py; no Playwright/proxy needed.

Public API
----------
find_mentions(client, product_name, brand, max_pages, max_threads) -> dict
extract_mentions(thread, tokens) -> list[dict]           # pure, unit-testable
save_pantip(product_id, data) -> Path
main()                                                   # batch, optional
"""
from __future__ import annotations

import json
import logging
import sys
import time
from pathlib import Path
from typing import Any

# Adjust sys.path so that 'pantip' package (sibling of 'cosmetics') is importable
# when this module is run from the repo root or cosmetics/ directory.
_REPO_ROOT = Path(__file__).parent.parent
_PANTIP_DIR = _REPO_ROOT / "pantip"
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))
# pantip/scraper.py uses bare `import config` and `import namekit`, so the
# pantip/ directory itself must also be on sys.path.
if str(_PANTIP_DIR) not in sys.path:
    sys.path.insert(0, str(_PANTIP_DIR))

from pantip.scraper import (  # noqa: E402
    Thread,
    Comment,
    make_client,
    search,
    fetch_thread_full,
)
from pantip.namekit import (  # noqa: E402
    build_queries,
    build_match_tokens,
    text_contains_any,
)
from cosmetics import config as cosmetics_config  # noqa: E402

log = logging.getLogger("cosmetics.pantip_reviews")

# ── Snippet extraction ─────────────────────────────────────────────────────


def extract_mentions(thread: Thread, tokens: list[str]) -> list[dict]:
    """Scan a Thread's OP body and all comments for token matches.

    Returns a list of snippet dicts (up to one per matching text block):
        {"text": str, "topic_id": str, "author": str, "timestamp": str}

    This function is pure (no network calls) and is unit-tested directly.
    """
    if not tokens:
        return []

    results: list[dict] = []

    # ── OP body ──────────────────────────────────────────────────────────
    if thread.op_body:
        hit, _ = text_contains_any(thread.op_body, tokens)
        if hit:
            # Extract a context window around the first matching token
            snippet_text = _extract_window(thread.op_body, tokens)
            results.append({
                "text": snippet_text,
                "topic_id": thread.topic_id,
                "author": thread.op_author,
                "timestamp": thread.op_timestamp,
            })

    # ── Comments (and flat-replies already embedded) ──────────────────────
    for comment in (thread.comments or []):
        if not comment.body:
            continue
        hit, _ = text_contains_any(comment.body, tokens)
        if hit:
            results.append({
                "text": _extract_window(comment.body, tokens),
                "topic_id": thread.topic_id,
                "author": comment.author,
                "timestamp": comment.timestamp,
            })

    return results


def _extract_window(text: str, tokens: list[str], window: int = 120) -> str:
    """Return a context window (±window chars) around the first token hit."""
    text_l = text.lower()
    for tok in tokens:
        idx = text_l.find(tok.lower())
        if idx == -1:
            # Try no-space variant
            import re
            tok_ns = re.sub(r"\s+", "", tok)
            text_ns = re.sub(r"\s+", "", text_l)
            ns_idx = text_ns.find(tok_ns.lower())
            if ns_idx != -1:
                # Map back to original text approximately
                idx = min(ns_idx, len(text) - 1)
        if idx != -1:
            start = max(0, idx - window)
            end = min(len(text), idx + len(tok) + window)
            snippet = text[start:end].replace("\n", " ").strip()
            return f"...{snippet}..."
    # Fallback: first 200 chars
    return text[:200].replace("\n", " ").strip()


# ── Main aggregation function ──────────────────────────────────────────────


def find_mentions(
    client: Any,
    product_name: str,
    brand: str,
    max_pages: int = 2,
    max_threads: int = 4,
) -> dict:
    """Search Pantip for mentions of a cosmetics product.

    Parameters
    ----------
    client:       httpx.Client returned by pantip.scraper.make_client()
    product_name: Full product name (e.g. "PROVAMED Bio Peptide Anti Acne Serum")
    brand:        Brand name (e.g. "PROVAMED") — combined with product_name for queries
    max_pages:    Max Pantip search pages per query (polite default: 2)
    max_threads:  Max threads to fully fetch and scan (polite default: 4)

    Returns
    -------
    dict with keys: source, product_name, thread_count, mention_count,
                    snippets (list, up to 8), fetched_at
    """
    # Build search queries and match tokens
    # Combine brand + product name so namekit can pick the best tokens
    combined_name = f"{brand} {product_name}".strip() if brand else product_name
    queries = build_queries(combined_name)
    # Also try the bare product name if brand query produces nothing different
    product_queries = build_queries(product_name)
    for q in product_queries:
        if q not in queries:
            queries.append(q)

    tokens = build_match_tokens(combined_name)
    if not tokens:
        # Fallback: use the brand alone as a token if it's long enough
        if brand and len(brand) >= 4:
            tokens = [brand]
        else:
            log.warning(f"find_mentions: no usable tokens for {product_name!r}")
            return _empty_result(product_name)

    log.info(f"[pantip] {product_name!r} queries={queries} tokens={tokens}")

    # ── Search phase ──────────────────────────────────────────────────────
    all_hits: list = []
    seen_tids: set[str] = set()
    for q in queries[:4]:  # cap at 4 queries to stay polite
        hits = search(client, q, max_pages)
        for h in hits:
            if h.topic_id not in seen_tids:
                seen_tids.add(h.topic_id)
                all_hits.append(h)

    log.info(f"[pantip]   candidate threads: {len(all_hits)}")

    if not all_hits:
        return _empty_result(product_name)

    # ── Fetch + scan phase ────────────────────────────────────────────────
    all_snippets: list[dict] = []
    threads_with_mention: set[str] = set()

    for hit in all_hits[:max_threads]:
        try:
            time.sleep(0.5)  # polite inter-thread delay
            thread = fetch_thread_full(client, hit.topic_id)
            if thread is None:
                continue
            snippets = extract_mentions(thread, tokens)
            if snippets:
                threads_with_mention.add(hit.topic_id)
                all_snippets.extend(snippets)
                log.info(
                    f"[pantip]   tid={hit.topic_id} → {len(snippets)} snippet(s)"
                )
        except Exception as exc:
            log.warning(f"[pantip]   tid={hit.topic_id} error: {exc}")
            continue

    fetched_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    return {
        "source": "pantip",
        "product_name": product_name,
        "thread_count": len(threads_with_mention),
        "mention_count": len(all_snippets),
        "snippets": all_snippets[:8],
        "fetched_at": fetched_at,
    }


def _empty_result(product_name: str) -> dict:
    return {
        "source": "pantip",
        "product_name": product_name,
        "thread_count": 0,
        "mention_count": 0,
        "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


# ── Persistence ───────────────────────────────────────────────────────────


def save_pantip(product_id: str, data: dict) -> Path:
    """Write data to cosmetics/output/reviews/<product_id>_pantip.json.

    Mirrors the Konvy review file location/pattern defined in cosmetics.config.
    """
    reviews_dir = cosmetics_config.REVIEWS_DIR
    reviews_dir.mkdir(parents=True, exist_ok=True)
    out_path = reviews_dir / f"{product_id}_pantip.json"
    out_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2, default=str),
        encoding="utf-8",
    )
    log.info(f"[pantip] saved → {out_path}")
    return out_path


# ── Batch main ────────────────────────────────────────────────────────────


def main() -> int:
    """Batch: iterate products, fetch Pantip mentions for those missing _pantip.json.

    Polite and resumable — skips products that already have a _pantip.json file.
    Does NOT run during tests; invoke manually:

        python -m cosmetics.pantip_reviews
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    master_db_path = cosmetics_config.ROOT / "web" / "data" / "master_db.json"
    products_dir = cosmetics_config.OUTPUT_DIR / "products"
    reviews_dir = cosmetics_config.REVIEWS_DIR

    # Load products — prefer master_db.json if it exists, else scan products/*.json
    products: list[dict] = []
    if master_db_path.exists():
        db = json.loads(master_db_path.read_text(encoding="utf-8"))
        products = list(db.get("products", {}).values())
        log.info(f"Loaded {len(products)} products from master_db.json")
    elif products_dir.exists():
        for p in sorted(products_dir.glob("*.json")):
            try:
                products.append(json.loads(p.read_text(encoding="utf-8")))
            except Exception:
                continue
        log.info(f"Loaded {len(products)} products from output/products/")
    else:
        log.error("No product source found (master_db.json or output/products/)")
        return 1

    n_done = 0
    n_skip = 0
    n_fail = 0

    with make_client() as client:
        for i, product in enumerate(products, 1):
            product_id = str(product.get("product_id") or product.get("sku") or "")
            if not product_id:
                continue

            out_path = reviews_dir / f"{product_id}_pantip.json"
            if out_path.exists():
                n_skip += 1
                continue

            name = product.get("name") or ""
            brand = product.get("brand") or ""
            if not name:
                log.warning(f"[{product_id}] no name, skipping")
                continue

            print(f"[{i}/{len(products)}] {product_id}: {name[:60]}")
            try:
                data = find_mentions(client, name, brand)
                save_pantip(product_id, data)
                n_done += 1
                print(
                    f"  → threads={data['thread_count']} "
                    f"mentions={data['mention_count']}"
                )
                # Polite inter-product delay
                time.sleep(2.0)
            except KeyboardInterrupt:
                log.warning("Interrupted — progress is already saved per-product.")
                break
            except Exception as exc:
                n_fail += 1
                log.error(f"[{product_id}] FAILED: {exc}")
                continue

    print(
        f"\nDone. fetched={n_done}  skipped={n_skip}  failed={n_fail}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
