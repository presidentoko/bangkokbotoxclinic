#!/usr/bin/env python3
"""drainage_nlp.py — master_db.json 의 리뷰 텍스트에서 배수 점수를 계산한다."""

import json
from pathlib import Path

DRAINAGE_BAD = [
    "waterlogged", "flooded", "water logged", "soggy", "swampy",
    "น้ำท่วม", "ระบายน้ำไม่ดี", "น้ำขัง",
    "수중전", "물 고임", "배수 안", "침수", "물난리",
]
DRAINAGE_GOOD = [
    "drains well", "fast drainage", "good drainage", "well drained",
    "ระบายน้ำดี", "ระบายน้ำได้ดี",
    "배수 좋", "배수 잘", "배수 양호",
]

def compute_drainage(reviews: list) -> dict:
    text = " ".join(r.lower() for r in reviews if r)
    bad = [kw for kw in DRAINAGE_BAD if kw in text]
    good_count = sum(1 for kw in DRAINAGE_GOOD if kw in text)
    score = max(0, min(100, 100 - len(bad) * 15 + good_count * 10))
    return {
        "drainage_score": score,
        "drainage_keywords": bad,
        "drainage_mentions": len(bad),
    }

def extract_review_texts(course: dict) -> list:
    texts = []
    for field in ("sample_reviews_en", "sample_reviews_th", "sample_reviews_ko"):
        for r in course.get(field) or []:
            if isinstance(r, dict) and r.get("text"):
                texts.append(r["text"])
    for r in course.get("scraped_reviews") or []:
        if isinstance(r, dict) and r.get("text"):
            texts.append(r["text"])
    return texts

def main():
    db_path = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    db = json.loads(db_path.read_text(encoding="utf-8"))
    updated = 0
    for course in db["courses"]:
        texts = extract_review_texts(course)
        if texts:
            result = compute_drainage(texts)
            course.update(result)
            updated += 1
        else:
            course.setdefault("drainage_score", 50)
            course.setdefault("drainage_keywords", [])
            course.setdefault("drainage_mentions", 0)
    db_path.write_text(
        json.dumps(db, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"drainage_nlp: updated {updated}/{len(db['courses'])} courses")

if __name__ == "__main__":
    main()
