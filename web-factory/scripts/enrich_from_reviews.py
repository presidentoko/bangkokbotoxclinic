"""
data/reviews/ 폴더의 Google-Maps-Reviews-Scraper JSON으로
기존 master_db.json 공급사 리뷰 데이터를 보강.

실행: python scripts/enrich_from_reviews.py
"""
from __future__ import annotations

import json
import math
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEWS_DIR = ROOT / "data" / "reviews"
MASTER_DB   = ROOT / "data" / "master_db.json"

_PLACE_ID_RE = re.compile(r"query_place_id=([\w-]+)")

_THAI_RE    = re.compile(r"[฀-๿]")
_LATIN_RE   = re.compile(r"[A-Za-z]")
_KOREAN_RE  = re.compile(r"[가-힣ᄀ-ᇿ]")
_JAPANESE_RE = re.compile(r"[ぁ-ゟ゠-ヿ]")
_CHINESE_RE = re.compile(r"[一-鿿]")

_TOPIC_PATTERNS: dict[str, list[str]] = {
    "high_quality":      ["high quality", "great quality", "premium quality", "excellent quality"],
    "poor_quality":      ["poor quality", "bad quality", "defective", "low quality"],
    "on_time":           ["on time", "fast delivery", "quick turnaround", "delivered on time"],
    "delayed":           ["delayed", "late delivery", "slow delivery"],
    "english_support":   ["english speaking", "english support", "speak english", "english staff"],
    "korean_support":    ["korean speaking", "한국어", "korean staff"],
    "responsive":        ["responsive", "quick reply", "fast response", "reply quickly"],
    "unresponsive":      ["no response", "unresponsive", "ignored", "never replied"],
    "competitive_price": ["competitive price", "good price", "affordable", "reasonable price"],
    "expensive":         ["expensive", "overpriced", "high price"],
    "low_moq":           ["low moq", "low minimum", "small order", "small batch"],
    "oem_odm":           ["oem", "odm", "private label", "custom order", "custom design"],
    "export_ready":      ["export", "shipping worldwide", "international shipping"],
    "iso_certified":     ["iso certified", "iso 9001", "iso 14001", "certified"],
    "food_safety":       ["haccp", "fssc 22000", "gmp certified", "halal"],
    "factory_tour":      ["factory tour", "factory visit", "showroom visit"],
    "experienced":       ["experienced", "since 19", "since 20", "decades", "established"],
    "modern_machinery":  ["modern machinery", "state of the art", "advanced equipment"],
    "friendly_staff":    ["friendly staff", "helpful staff", "professional team"],
    "good_packaging":    ["packaging", "packed well", "well packed"],
    "bulk_orders":       ["bulk order", "wholesale", "large order"],
    "samples_available": ["sample", "samples available", "free sample"],
    "clean_facility":    ["clean facility", "clean factory", "well organized"],
}


def detect_lang(text: str) -> str:
    if not text:
        return "other"
    total = max(len(text), 1)
    if len(_KOREAN_RE.findall(text)) / total > 0.15:   return "ko"
    if len(_THAI_RE.findall(text)) / total > 0.3:      return "th"
    if len(_JAPANESE_RE.findall(text)) / total > 0.2:  return "ja"
    if len(_CHINESE_RE.findall(text)) / total > 0.3:   return "zh"
    if len(_LATIN_RE.findall(text)) / total > 0.3:     return "en"
    return "other"


def extract_topics(text: str) -> list[dict]:
    tl = text.lower()
    out = [{"topic": t, "count": sum(tl.count(p) for p in pats)}
           for t, pats in _TOPIC_PATTERNS.items()
           if any(p in tl for p in pats)]
    out.sort(key=lambda x: -x["count"])
    return out


def trust_score(rating: float, total_reviews: int,
                scraped: int = 0, avg_len: float = 0) -> float:
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    return round(
        (rating / 5.0) * 50
        + min(40, math.log10(max(1, total_reviews)) * 12)
        + min(5, (scraped / max(1, total_reviews)) * 50)
        + min(5, math.log10(max(1, avg_len)) * 1.5),
        1,
    )


def pick_samples(chunks: list[tuple[str, int, str]], n: int = 3) -> list[dict]:
    good = [(t, r, a) for t, r, a in chunks if 60 <= len(t) <= 350 and r >= 4]
    good.sort(key=lambda x: -x[1])
    return [{"text": t, "rating": r, "author": a or "Google reviewer"}
            for t, r, a in good[:n]]


def load_reviews() -> dict[str, list[dict]]:
    """place_id → review list"""
    by_pid: dict[str, list[dict]] = defaultdict(list)
    seen: set[tuple] = set()
    total = 0

    files = sorted(REVIEWS_DIR.glob("dataset_Google-Maps-Reviews-Scraper_*.json"))
    print(f"리뷰 파일: {len(files)}개")

    for path in files:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        for r in data:
            total += 1
            url  = r.get("url") or r.get("reviewUrl") or ""
            text = (r.get("text") or "").strip()
            stars = r.get("stars")
            name  = r.get("name") or ""

            # 중복 제거
            key = (url[:80], stars, text[:80], name)
            if key in seen:
                continue
            seen.add(key)

            # 필터: 너무 짧은 리뷰
            if len(text) < 15:
                continue

            m = _PLACE_ID_RE.search(url)
            if not m:
                continue
            by_pid[m.group(1)].append(r)

    matched = sum(len(v) for v in by_pid.values())
    print(f"총 리뷰: {total:,} → 중복/무텍스트 제거 후: {matched:,}건 ({len(by_pid)}개 장소)")
    return by_pid


def main():
    # 1. 기존 DB 로드
    with open(MASTER_DB, encoding="utf-8") as f:
        db = json.load(f)
    suppliers = db["suppliers"]
    print(f"기존 공급사: {len(suppliers):,}개")

    # 2. 리뷰 로드
    reviews_by_pid = load_reviews()

    # 3. 매칭 & 보강
    enriched = 0
    for s in suppliers:
        pid = s.get("id") or s.get("place_id")
        revs = reviews_by_pid.get(pid, [])
        if not revs:
            continue

        # 언어별 분류
        lang_count = {"th": 0, "en": 0, "ko": 0, "ja": 0, "zh": 0, "other": 0}
        chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {k: [] for k in lang_count}

        all_text_parts = []
        text_lengths = []

        for r in revs:
            text = (r.get("text") or "").strip()
            if not text:
                continue
            lang = detect_lang(text)
            lang_count[lang] += 1
            try:
                stars = int(r.get("stars") or 0)
            except (ValueError, TypeError):
                stars = 0
            chunks_by_lang[lang].append((text, stars, r.get("name") or ""))
            all_text_parts.append(text)
            text_lengths.append(len(text))

        all_text = " ".join(all_text_parts)
        avg_len  = sum(text_lengths) / len(text_lengths) if text_lengths else 0

        # 기존 값보다 리뷰 많으면 업데이트
        if len(revs) > s.get("scraped_review_count", 0):
            lang_compat = {k: lang_count.get(k, 0) for k in ("th", "en", "ko", "ja", "other")}
            lang_compat["other"] += lang_count.get("zh", 0)

            s["scraped_review_count"] = len(revs)
            s["language_breakdown"]   = lang_compat
            s["mentioned_topics"]     = extract_topics(all_text)
            s["sample_reviews_th"]    = pick_samples(chunks_by_lang["th"])
            s["sample_reviews_en"]    = pick_samples(chunks_by_lang["en"])
            s["sample_reviews_ko"]    = pick_samples(chunks_by_lang["ko"])
            s["trust_score"]          = trust_score(
                s.get("rating", 0), s.get("total_reviews", 0), len(revs), avg_len
            )
            enriched += 1

    # 4. 정렬 & 저장
    suppliers.sort(key=lambda x: (-x["trust_score"], -x["total_reviews"]))

    db["generated_at"] = datetime.now(timezone.utc).isoformat()
    db["with_reviews_scraped"] = sum(1 for s in suppliers if s.get("scraped_review_count", 0) > 0)
    db["language_total"] = {
        lang: sum(s.get("language_breakdown", {}).get(lang, 0) for s in suppliers)
        for lang in ("th", "en", "ko", "ja", "other")
    }

    with open(MASTER_DB, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"\n[완료] 보강된 공급사: {enriched:,}개")
    print(f"  리뷰 있는 공급사: {db['with_reviews_scraped']:,}개")
    print(f"  언어 분포: {db['language_total']}")
    print(f"  저장: {MASTER_DB}")


if __name__ == "__main__":
    main()
