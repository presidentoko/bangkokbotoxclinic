"""Auto-label is_korean_friendly + compute korean_score from review signals.

Signals (weighted into korean_score):
- mentioned_topics.korean_caddy count      × 12 (Apify topic extraction — strongest)
- 'korean' / '한국' / '코리아' regex match  × 8 (explicit mention anywhere in review text)
- korean_blogs count                       × 5 (Naver blog matched to course)
- language_breakdown.ko (count)            × 1 (Korean reviewers volume)
- sample_reviews_ko count                  × 1.5 (curated Korean reviews)
- reviewer name in Hangul (scraped_reviews) × 0.5 (each — weak but valid)
- existing is_korean_friendly=True         × 30 (hand-curated preserve)

is_korean_friendly final rule (any of the below):
  - korean_score >= 6.0                    (broad acceptance — Korean traffic exists)
  - OR mentioned_topics.korean_caddy >= 1  (explicit caddy mention)
  - OR korean_blogs >= 1                   (Naver blog covers the course)
  - OR keyword 'korean caddy' / '한국 캐디' (specific phrase)

Goal: lift the flag from 5 hand-curated to ~70-100 Google-derived courses without
forfeiting the brand promise. Lower the threshold further only after we audit
the false-positive rate (visible at /best/korean-friendly).
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "master_db.json"

# Broad Korean mention — catches both English and Korean script
_KW_BROAD = re.compile(r"korean|한국|코리아", re.IGNORECASE)
# Explicit caddy phrase
_KW_CADDY = re.compile(
    r"korean[\s-]?caddy|korean[\s-]?speaking|"
    r"한국\s*캐디|한국어\s*캐디|한국인\s*캐디|"
    r"korean[\s-]?(staff|menu|sign|speaking)",
    re.IGNORECASE,
)
_HANGUL = re.compile(r"[가-힣]")


def collect_review_blob(c: dict) -> str:
    parts: list[str] = []
    for sr in c.get("scraped_reviews", []) or []:
        if sr.get("text"):
            parts.append(sr["text"])
    for k in ("sample_reviews_th", "sample_reviews_en", "sample_reviews_ko"):
        for r in c.get(k, []) or []:
            if r.get("text"):
                parts.append(r["text"])
    if c.get("reviews_concat"):
        parts.append(c["reviews_concat"])
    if c.get("top_review_text"):
        parts.append(c["top_review_text"])
    return " ".join(parts)


def topic_count(c: dict, topic: str) -> int:
    for t in c.get("mentioned_topics") or []:
        if t.get("topic") == topic:
            return int(t.get("count") or 0)
    return 0


def hangul_reviewer_count(c: dict) -> int:
    n = 0
    for sr in c.get("scraped_reviews") or []:
        if _HANGUL.search(sr.get("reviewer") or ""):
            n += 1
    return n


def compute_korean_score(c: dict) -> tuple[float, dict]:
    """Return (score, signals_dict) so we can report what fired."""
    blob = collect_review_blob(c)
    has_kw_broad = bool(_KW_BROAD.search(blob))
    has_kw_caddy = bool(_KW_CADDY.search(blob))
    topic_n = topic_count(c, "korean_caddy")
    blog_n = len(c.get("korean_blogs") or [])
    lang_ko = (c.get("language_breakdown") or {}).get("ko", 0) or 0
    sample_ko = len(c.get("sample_reviews_ko") or [])
    hangul_revs = hangul_reviewer_count(c)
    existing = bool(c.get("is_korean_friendly"))

    score = 0.0
    score += topic_n * 12.0
    if has_kw_caddy:
        score += 15.0
    elif has_kw_broad:
        score += 8.0
    score += blog_n * 5.0
    score += lang_ko * 1.0
    score += sample_ko * 1.5
    score += hangul_revs * 0.5
    if existing:
        score += 30.0

    signals = {
        "topic_korean_caddy": topic_n,
        "kw_caddy_phrase": has_kw_caddy,
        "kw_broad_mention": has_kw_broad,
        "korean_blogs": blog_n,
        "language_breakdown_ko": lang_ko,
        "sample_reviews_ko": sample_ko,
        "hangul_reviewer_count": hangul_revs,
        "existed_before": existing,
    }
    return round(score, 2), signals


def should_label_friendly(score: float, signals: dict) -> bool:
    if signals["topic_korean_caddy"] >= 1:
        return True
    if signals["kw_caddy_phrase"]:
        return True
    if signals["korean_blogs"] >= 1:
        return True
    if score >= 6.0:
        return True
    return False


def main():
    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    courses = db.get("courses") or []

    promoted = 0
    demoted = 0
    kept = 0
    score_buckets = {"<3": 0, "3-6": 0, "6-12": 0, "12-30": 0, "30+": 0}
    top_courses = []

    for c in courses:
        score, signals = compute_korean_score(c)
        c["korean_score"] = score
        was = bool(c.get("is_korean_friendly"))
        is_now = should_label_friendly(score, signals)
        c["is_korean_friendly"] = is_now
        if is_now and not was:
            promoted += 1
        elif not is_now and was:
            demoted += 1
        elif is_now and was:
            kept += 1
        # bucket
        if score < 3: score_buckets["<3"] += 1
        elif score < 6: score_buckets["3-6"] += 1
        elif score < 12: score_buckets["6-12"] += 1
        elif score < 30: score_buckets["12-30"] += 1
        else: score_buckets["30+"] += 1
        if is_now:
            top_courses.append((score, c.get("name", "?"), c.get("city_label", "?"), signals))

    DB_PATH.write_text(
        json.dumps(db, ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )

    total_friendly = sum(1 for c in courses if c.get("is_korean_friendly"))
    top_courses.sort(reverse=True)

    print(f"Total: {len(courses)}")
    print(f"is_korean_friendly: now {total_friendly} (kept {kept} + promoted {promoted}; demoted {demoted})")
    print(f"score buckets: {score_buckets}")
    print()
    print("Top 15 by korean_score:")
    for sc, nm, city, sig in top_courses[:15]:
        flag = "ko_caddy" if sig["topic_korean_caddy"] else ("caddy_kw" if sig["kw_caddy_phrase"] else ("blog" if sig["korean_blogs"] else "ko_volume"))
        print(f"  {sc:>6.1f}  [{flag:>9}]  {nm[:50]:<50}  {city}  ko={sig['language_breakdown_ko']}")


if __name__ == "__main__":
    main()
