# -*- coding: utf-8 -*-
"""Pantip review-mention aggregation for cosmetics products.

Second review source (beyond Konvy) — differentiator.
Uses plain httpx via pantip/scraper.py; no Playwright/proxy needed.

Public API
----------
find_mentions(client, product_name, brand, max_pages, max_threads) -> dict
extract_mentions(thread, brand, product_name) -> list[dict]   # pure, unit-testable
save_pantip(product_id, data) -> Path
main()                                                         # batch, optional
"""
from __future__ import annotations

import json
import logging
import re
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
    normalize,
)
from cosmetics import config as cosmetics_config  # noqa: E402

log = logging.getLogger("cosmetics.pantip_reviews")

# ── Cosmetics-specific match signal builder ────────────────────────────────

# Generic words that appear in almost every product name — not distinctive
_GENERIC_PRODUCT_WORDS = {
    # English
    "serum", "cream", "gel", "lotion", "toner", "essence", "mask",
    "cleanser", "scrub", "mist", "oil", "balm", "moisturizer", "sunscreen",
    "spf", "ml", "oz", "skin", "face", "body", "eye", "lip", "anti",
    "care", "repair", "whitening", "bright", "glow", "plus", "pro",
    "advanced", "daily", "night", "day", "new", "ultra", "super",
    # Thai
    "ครีม", "เซรั่ม", "โลชั่น", "โทนเนอร์", "มาส์ก", "สกิน", "หน้า",
}


def _build_brand_signals(brand: str) -> list[str]:
    """Return a list of brand match strings (lowercase, for substring matching).

    Includes:
      - Raw brand (lowercased, stripped)
      - Brand with possessive stripped (Kiehl's → kiehls)
      - Brand with hyphens stripped (La Roche-Posay → la rochePosay)
      - All of the above with non-alphanumeric chars removed
    """
    if not brand:
        return []
    signals: list[str] = []
    b = brand.strip()
    # base lowercase
    b_lower = b.lower()
    signals.append(b_lower)
    # strip possessive apostrophe: Kiehl's → kiehls
    b_no_apos = re.sub(r"[''`']s?\b", "", b_lower).strip()
    if b_no_apos and b_no_apos != b_lower:
        signals.append(b_no_apos)
    # strip hyphens: La Roche-Posay → la roche posay, then also no-space
    b_no_hyphen = b_lower.replace("-", " ").replace("  ", " ").strip()
    if b_no_hyphen and b_no_hyphen != b_lower:
        signals.append(b_no_hyphen)
    # fully alphanum-only (all punctuation and spaces removed)
    b_alnum = re.sub(r"[^a-z0-9ก-๙]", "", b_lower)
    if b_alnum and b_alnum not in signals and len(b_alnum) >= 3:
        signals.append(b_alnum)
    # deduplicate keeping order
    seen: set[str] = set()
    out: list[str] = []
    for s in signals:
        if s and s not in seen:
            seen.add(s)
            out.append(s)
    return out


def _build_product_signals(product_name: str, brand: str) -> list[str]:
    """Return distinctive product word signals (lowercase) from product_name.

    Strips brand prefix, tokenises on whitespace/punctuation, excludes generics
    and very short tokens (len < 4).  Numbers and purely numeric tokens excluded.
    """
    # Remove brand from product name to avoid adding it twice
    name = product_name
    if brand:
        # Remove brand (case-insensitive) from the beginning
        pat = re.compile(re.escape(brand), re.IGNORECASE)
        name = pat.sub("", name, count=1).strip()
    name_lower = name.lower()
    # Tokenise on whitespace and common punctuation
    tokens = re.split(r"[\s\-/,.()+]+", name_lower)
    signals: list[str] = []
    for tok in tokens:
        tok = tok.strip("'\"")
        if not tok:
            continue
        if re.fullmatch(r"[\d.]+", tok):  # pure numbers / decimals
            continue
        if len(tok) < 4:
            continue
        if tok in _GENERIC_PRODUCT_WORDS:
            continue
        signals.append(tok)
    return signals


def _text_contains_signal(text: str, signal: str) -> bool:
    """True if signal appears in text (case-insensitive substring).

    For Latin signals: also enforces word-boundary on the right to avoid
    matching 'smooth' inside 'smoother'. Left boundary is loose (brand can
    appear after non-alpha like quotes or Thai chars).
    For Thai signals: pure substring.
    """
    if not text or not signal:
        return False
    text_l = text.lower()
    sig_l = signal.lower()
    # pure Thai signal — substring OK
    if re.fullmatch(r"[ก-๙\s]+", sig_l):
        return sig_l in text_l
    # Latin / mixed: right word boundary (don't match 'kiehls' inside 'kiehls123')
    # Also try no-space version of text for signals that have spaces
    # e.g. "la roche posay" should match "larochePosay" in text
    pat = re.compile(re.escape(sig_l) + r"(?![a-z0-9])", re.IGNORECASE)
    if pat.search(text):
        return True
    # try with spaces removed from both
    sig_ns = re.sub(r"\s+", "", sig_l)
    if len(sig_ns) >= 4:
        text_ns = re.sub(r"\s+", "", text_l)
        pat_ns = re.compile(re.escape(sig_ns) + r"(?![a-z0-9])", re.IGNORECASE)
        if pat_ns.search(text_ns):
            return True
    return False


def _is_brand_short(brand: str) -> bool:
    """Brand names <= 2 significant chars are considered generic/too short."""
    alnum = re.sub(r"[^a-z0-9ก-๙]", "", brand.lower())
    return len(alnum) <= 2


# ── Snippet extraction ─────────────────────────────────────────────────────


def extract_mentions(
    thread: Thread,
    brand: str,
    product_name: str,
) -> list[dict]:
    """Scan a Thread's OP body and all comments for cosmetics product mentions.

    Matching strategy (looser than clinic full-name matching):
      - Build brand signals (brand name and obvious variants).
      - Build distinctive product-word signals from product_name.
      - A text block is a MENTION if:
          (a) any brand signal appears in it, OR
          (b) any distinctive product word appears in it.
        Exception: if the brand is very short (<=2 alphanum chars), both (a)
        AND (b) must hold to avoid false positives.
      - Snippets capped at 8, deduped by author+topic.

    Returns a list of snippet dicts:
        {"text": str, "topic_id": str, "author": str, "timestamp": str}

    This function is pure (no network calls) and is unit-tested directly.
    """
    brand_signals = _build_brand_signals(brand)
    product_signals = _build_product_signals(product_name, brand)
    brand_short = _is_brand_short(brand)

    if not brand_signals and not product_signals:
        return []

    def _matches(text: str) -> bool:
        if not text:
            return False
        brand_hit = any(_text_contains_signal(text, sig) for sig in brand_signals)
        product_hit = any(_text_contains_signal(text, sig) for sig in product_signals)
        if brand_short:
            # Short brand: require both brand AND a product word to avoid noise
            return brand_hit and product_hit
        # Normal: brand alone is enough; or a distinctive product word alone
        return brand_hit or product_hit

    all_signals = brand_signals + product_signals
    results: list[dict] = []
    seen_keys: set[str] = set()

    # ── OP body ──────────────────────────────────────────────────────────
    if thread.op_body and _matches(thread.op_body):
        key = f"{thread.topic_id}:{thread.op_author}"
        if key not in seen_keys:
            seen_keys.add(key)
            results.append({
                "text": _extract_window(thread.op_body, all_signals),
                "topic_id": thread.topic_id,
                "author": thread.op_author,
                "timestamp": thread.op_timestamp,
            })

    # ── Comments (and flat-replies already embedded) ──────────────────────
    for comment in (thread.comments or []):
        if not comment.body:
            continue
        if _matches(comment.body):
            key = f"{thread.topic_id}:{comment.author}:{comment.comment_no}"
            if key not in seen_keys:
                seen_keys.add(key)
                results.append({
                    "text": _extract_window(comment.body, all_signals),
                    "topic_id": thread.topic_id,
                    "author": comment.author,
                    "timestamp": comment.timestamp,
                })
        if len(results) >= 8:
            break

    return results[:8]


def _extract_window(text: str, signals: list[str], window: int = 120) -> str:
    """Return a context window (±window chars) around the first signal hit."""
    text_l = text.lower()
    text_ns = re.sub(r"\s+", "", text_l)
    for sig in signals:
        sig_l = sig.lower()
        # try normal
        idx = text_l.find(sig_l)
        if idx == -1:
            # try no-space
            sig_ns = re.sub(r"\s+", "", sig_l)
            ns_idx = text_ns.find(sig_ns)
            if ns_idx != -1:
                idx = min(ns_idx, len(text) - 1)
        if idx != -1:
            start = max(0, idx - window)
            end = min(len(text), idx + len(sig) + window)
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
    brand:        Brand name (e.g. "PROVAMED") — used for brand-led matching
    max_pages:    Max Pantip search pages per query (polite default: 2)
    max_threads:  Max threads to fully fetch and scan (polite default: 4)

    Returns
    -------
    dict with keys: source, product_name, thread_count, mention_count,
                    snippets (list, up to 8), fetched_at
    """
    # Build search queries using namekit (for search phase only).
    # Start with the bare brand (best Pantip search hit rate), then product-specific
    # queries.  Avoid duplicating the brand inside combined_name if the product name
    # already starts with it.
    queries: list[str] = []
    if brand and len(brand) >= 4:
        queries.append(brand)
    # product-name-only queries (brand-stripped product name if product starts with brand)
    pn_strip = product_name
    if brand and product_name.lower().startswith(brand.lower()):
        pn_strip = product_name[len(brand):].strip(" -")
    for q in build_queries(pn_strip or product_name):
        if q not in queries:
            queries.append(q)
    # full product name queries as fallback
    for q in build_queries(product_name):
        if q not in queries:
            queries.append(q)

    if not queries:
        log.warning(f"find_mentions: no usable queries for {product_name!r}")
        return _empty_result(product_name)

    log.info(f"[pantip] {product_name!r} queries={queries}")

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
            snippets = extract_mentions(thread, brand, product_name)
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
