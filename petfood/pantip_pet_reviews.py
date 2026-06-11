"""
Pantip 반려동물 리뷰 수집기

펫푸드 브랜드 + 병원명으로 Pantip 검색 → 언급 스레드 수집
결과: data/petreviews.json

구조:
  {
    "foods": {
      "<food_id>": {
        "mention_count": N,
        "positive_snippets": ["...", ...],
        "negative_snippets": ["...", ...],
        "threads": [{"tid": "...", "title": "...", "url": "...", "replies": N}]
      }
    },
    "hospitals": { "<hospital_id>": { ... } }
  }

Run: python -m petfood.pantip_pet_reviews
     python -m petfood.pantip_pet_reviews --hospitals  # 병원만
     python -m petfood.pantip_pet_reviews --foods       # 음식만
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
from pathlib import Path

_REPO_ROOT = Path(__file__).parent.parent
_PANTIP_DIR = _REPO_ROOT / "pantip"
for p in [str(_REPO_ROOT), str(_PANTIP_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from pantip.scraper import make_client, search, fetch_thread_full  # noqa: E402

log = logging.getLogger("petfood.pantip")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

ROOT = Path(__file__).parent.parent
FOOD_JSON = ROOT / "data" / "petfood.json"
HOSPITAL_JSON = ROOT / "data" / "hospitals.json"
OUTPUT = ROOT / "data" / "petreviews.json"

MAX_SEARCH_PAGES = 3   # per keyword
MAX_THREADS_PER_ENTITY = 10
DELAY_SEC = 1.5

# Pantip pet-related forum IDs (สัตว์เลี้ยง)
PET_FORUMS = ["pet", "สัตว์เลี้ยง"]

# ── Sentiment keywords ────────────────────────────────────────────────────────

POSITIVE_TH = [
    "ดี", "ชอบ", "แนะนำ", "ดีมาก", "โอเค", "ผ่าน", "อร่อย", "กินหมด",
    "ขนสวย", "สุขภาพดี", "กระตือรือร้น", "happy", "ดีงาม", "เยี่ยม",
    "ประทับใจ", "คุ้มค่า", "น้องชอบ", "กินดี",
]
NEGATIVE_TH = [
    "ไม่ดี", "แย่", "ไม่ชอบ", "ท้องเสีย", "อาเจียน", "แพ้", "ผิวหนัง",
    "ขนร่วง", "ไม่กิน", "เบื่อ", "แพง", "ไม่แนะนำ", "ระวัง", "อันตราย",
    "ผลข้างเคียง", "น้องป่วย",
]


def _sentiment(text: str) -> str:
    t = text.lower()
    pos = sum(1 for w in POSITIVE_TH if w in t)
    neg = sum(1 for w in NEGATIVE_TH if w in t)
    if neg > pos:
        return "negative"
    if pos > 0:
        return "positive"
    return "neutral"


def _extract_snippet(text: str, signal: str, window: int = 80) -> str:
    """Extract a short snippet around the signal word."""
    idx = text.lower().find(signal.lower())
    if idx < 0:
        return text[:100].strip()
    start = max(0, idx - 30)
    end = min(len(text), idx + window)
    snippet = text[start:end].strip()
    if start > 0:
        snippet = "…" + snippet
    if end < len(text):
        snippet = snippet + "…"
    return snippet


def _build_queries(name_en: str, name_th: str, brand: str) -> list[str]:
    queries: list[str] = []
    # Thai name (most effective for Pantip)
    if name_th and name_th != name_en:
        queries.append(name_th[:30])
    # Brand + English model code (from parentheses)
    m = re.search(r"\(([A-Z][A-Z0-9 ]+)\)", name_en)
    if m:
        queries.append(f"{brand} {m.group(1)}")
    # Brand only as fallback
    if brand not in queries:
        queries.append(brand)
    return queries[:3]


def _search_entity(client, queries: list[str], signals: list[str]) -> list[dict]:
    """Search Pantip and return matching threads."""
    seen_tids: set[str] = set()
    threads: list[dict] = []

    for query in queries:
        try:
            hits = search(client, query, MAX_SEARCH_PAGES)
        except Exception as e:
            log.debug(f"  search '{query}': {e}")
            continue

        for hit in hits:
            tid = str(hit.topic_id)
            if tid in seen_tids:
                continue
            seen_tids.add(tid)

            # Quick relevance check from title/snippet
            combined = (hit.title + " " + hit.snippet).lower()
            if not any(s.lower() in combined for s in signals):
                continue

            try:
                thread = fetch_thread_full(client, tid)
                if thread is None:
                    continue
                full_text = thread.op_body + " " + " ".join(c.body for c in thread.comments[:20])
                if not any(s.lower() in full_text.lower() for s in signals):
                    continue

                sent = _sentiment(full_text)
                snippet = _extract_snippet(full_text, signals[0])
                threads.append({
                    "tid": tid,
                    "title": hit.title,
                    "url": f"https://pantip.com/topic/{tid}",
                    "replies": hit.reply_count,
                    "snippet": snippet,
                    "sentiment": sent,
                })
                log.info(f"    ✓ [{tid}] {hit.title[:50]} ({sent})")

                if len(threads) >= MAX_THREADS_PER_ENTITY:
                    return threads
                time.sleep(DELAY_SEC)
            except Exception as e:
                log.debug(f"    thread fetch {tid}: {e}")

    return threads


def _make_review_entry(threads: list[dict]) -> dict:
    pos = [t["snippet"] for t in threads if t["sentiment"] == "positive"][:3]
    neg = [t["snippet"] for t in threads if t["sentiment"] == "negative"][:2]
    return {
        "mention_count": len(threads),
        "positive_count": sum(1 for t in threads if t["sentiment"] == "positive"),
        "negative_count": sum(1 for t in threads if t["sentiment"] == "negative"),
        "positive_snippets": pos,
        "negative_snippets": neg,
        "threads": threads[:5],
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def _process_foods(client, foods: list[dict]) -> dict:
    results: dict = {}

    # Group by brand — search once per brand, share results across all products
    from collections import defaultdict
    by_brand: dict[str, list[dict]] = defaultdict(list)
    for food in foods:
        by_brand[food.get("brand", "")].append(food)

    brand_threads: dict[str, list[dict]] = {}
    for brand, brand_foods in by_brand.items():
        log.info(f"=== Brand: {brand} ({len(brand_foods)} products) ===")
        brand_signals = [brand]
        brand_queries = [brand, f"{brand} อาหารสัตว์เลี้ยง"]
        threads = _search_entity(client, brand_queries, brand_signals)
        brand_threads[brand] = threads
        log.info(f"  brand '{brand}': {len(threads)} threads")

    # Assign brand-level threads to each product (shared)
    for food in foods:
        food_id = food["id"]
        brand = food.get("brand", "")
        threads = brand_threads.get(brand, [])
        if threads:
            results[food_id] = _make_review_entry(threads)

    return results


def _process_hospitals(client, hospitals: list[dict]) -> dict:
    results: dict = {}

    for i, h in enumerate(hospitals, 1):
        hid = h["id"]
        name_th = h.get("name_th", "")
        name_en = h.get("name_en", "")
        if not name_th and not name_en:
            continue

        log.info(f"[{i}/{len(hospitals)}] {name_th or name_en}")

        signals = []
        if name_th:
            signals.append(name_th[:20])
        if name_en:
            signals.append(name_en.split()[0])  # first word of English name
        if not signals:
            continue

        queries = [name_th or name_en, f"โรงพยาบาลสัตว์ {(name_th or name_en)[:15]}"]
        threads = _search_entity(client, queries[:2], signals)

        if threads:
            pos = [t["snippet"] for t in threads if t["sentiment"] == "positive"][:3]
            neg = [t["snippet"] for t in threads if t["sentiment"] == "negative"][:2]
            results[hid] = {
                "mention_count": len(threads),
                "positive_count": sum(1 for t in threads if t["sentiment"] == "positive"),
                "negative_count": sum(1 for t in threads if t["sentiment"] == "negative"),
                "positive_snippets": pos,
                "negative_snippets": neg,
                "threads": threads[:5],
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }

    return results


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--foods", action="store_true")
    parser.add_argument("--hospitals", action="store_true")
    parser.add_argument("--limit", type=int, default=0, help="limit N items (0=all)")
    args = parser.parse_args()

    do_foods = args.foods or not args.hospitals
    do_hospitals = args.hospitals or not args.foods

    # Load existing results
    existing: dict = {"foods": {}, "hospitals": {}}
    if OUTPUT.exists():
        with open(OUTPUT, encoding="utf-8") as f:
            existing = json.load(f)

    client = make_client()

    if do_foods:
        with open(FOOD_JSON, encoding="utf-8") as f:
            foods = json.load(f)
        if args.limit:
            foods = foods[:args.limit]
        log.info(f"=== Processing {len(foods)} foods ===")
        food_results = _process_foods(client, foods)
        existing["foods"].update(food_results)

    if do_hospitals:
        with open(HOSPITAL_JSON, encoding="utf-8") as f:
            hospitals = json.load(f)
        # Only scrape hospitals with high ratings or 24h (higher chance of Pantip mentions)
        notable = [h for h in hospitals if (h.get("google_rating") or 0) >= 4.3 or h.get("is_24h")]
        if args.limit:
            notable = notable[:args.limit]
        log.info(f"=== Processing {len(notable)} notable hospitals ===")
        hosp_results = _process_hospitals(client, notable)
        existing["hospitals"].update(hosp_results)

    OUTPUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
    food_count = len(existing.get("foods", {}))
    hosp_count = len(existing.get("hospitals", {}))
    log.info(f"\n✓ Saved: {food_count} food reviews, {hosp_count} hospital reviews → {OUTPUT}")


if __name__ == "__main__":
    main()
