"""Cold outreach 타겟 클리닉 선정.

기준 (각 클리닉이 만족해야 함):
  1. Trust Score >= 70 (이미 reputation 신경 쓰는 곳 — 우리 가치를 이해할 가능성 높음)
  2. 외국인 리뷰 (en+ko+ja) >= 20건 (foreigner-facing 클리닉 → SEO 가치 인식)
  3. 답변 안 한 부정 리뷰 ≥ 1건 (우리 hook — "이거 답변 안했죠, 우리가 매번 해드림")
  4. website 또는 phone 둘 중 하나는 있음 (연락 채널)
  5. Bangkok 클리닉 (Sukhumvit 지역 우선 — Pathum Wan/Watthana/Khlong Toei/Vadhana 등)

출력: outreach_targets.csv — 클리닉별 row, 개인화 필드 포함:
  clinic_name, district, trust_score, rating, total_reviews,
  foreign_review_count, primary_foreign_lang,
  dashboard_url, clinic_url,
  negative_review_quote (≤ 200 chars),
  ai_reply_category, ai_reply_draft (≤ 300 chars),
  contact_phone, contact_website, maps_url,
  top_doctor_name (있으면 — 개인화 보너스)

사용:
  python find_outreach_targets.py [--limit 20] [--out outreach_targets.csv]
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
SITE_BASE = "https://www.bangkokbotoxclinic.com"

# Sukhumvit + 외국인 밀집 district 우선
PRIORITY_DISTRICTS = {
    "Watthana", "Khlong Toei", "Vadhana",       # Sukhumvit corridor
    "Phaya Thai", "Pathum Wan", "Bang Rak",     # Siam / Silom
    "Phra Khanong", "Suan Luang",
}

# crisis_alert.py 의 reply rules 동일 (영어/태국어/한국어 키워드)
REPLY_RULES = [
    (["wait", "waiting", "slow", "delay", "long time", "기다", "느리", "오래", "ช้า", "รอ"], "wait_time"),
    (["rude", "unprofessional", "attitude", "ignored", "staff", "service", "불친", "무례", "친절", "หยาบ", "พนักงาน"], "service"),
    (["expensive", "overcharg", "price", "cost", "money", "extra fee", "비싸", "가격", "추가요금", "แพง", "ราคา"], "price"),
    (["didn't work", "no effect", "weak", "no result", "ineffective", "효과 없", "안 좋", "ไม่ได้ผล", "ไม่ดี"], "result"),
    (["english", "korean", "thai only", "communicate", "language", "barrier", "영어", "한국어", "소통", "สื่อสาร", "ภาษา"], "communication"),
]

TEMPLATES = {
    "wait_time": "Dear {r}, we sincerely apologize for the long wait at {c}. We've added a consultation room during peak hours. Please contact us on LINE for a priority booking next visit so we can demonstrate the improvement.",
    "service":   "Dear {r}, this is not the experience we want any patient to have at {c}. Our manager has been notified and the team member involved is being retrained. Please DM us on LINE so we can speak with you personally.",
    "price":     "Hi {r}, thank you for the feedback on pricing at {c}. We confirm full pricing in writing before any procedure to avoid surprises — if this didn't happen for your visit, that's a process gap on our side. Please contact us to review and offer a credit toward your next visit.",
    "result":    "Dear {r}, we're sorry the result didn't meet your expectations at {c}. We offer a complimentary touch-up within 14 days for botox/filler/HIFU. Please come back so our doctor can assess and provide a free correction. DM us on LINE to schedule.",
    "communication": "Dear {r}, we apologize for the communication difficulty at {c}. We have English- and Korean-speaking staff available — we'll ensure one is your primary contact next visit. Please book via LINE mentioning your language preference.",
    "generic":   "Dear {r}, thank you for the honest review of {c}. We take every piece of feedback seriously — please reach out on LINE so a senior team member can address your concerns personally.",
}


def classify(text: str) -> str:
    low = text.lower()
    for keywords, category in REPLY_RULES:
        if any(k in low for k in keywords):
            return category
    return "generic"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=30)
    parser.add_argument("--out", default="outreach_targets.csv")
    parser.add_argument("--min-trust", type=int, default=70)
    parser.add_argument("--min-foreign-reviews", type=int, default=20)
    args = parser.parse_args()

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db["clinics"]

    candidates = []
    for c in clinics:
        if c.get("city_label") != "Bangkok":
            continue
        if c.get("trust_score", 0) < args.min_trust:
            continue
        lc = c.get("language_breakdown", {})
        foreign = lc.get("en", 0) + lc.get("ko", 0) + lc.get("ja", 0)
        if foreign < args.min_foreign_reviews:
            continue
        negatives = c.get("sample_reviews_negative") or []
        if not negatives:
            continue
        if not (c.get("website") or c.get("phone")):
            continue
        candidates.append((c, foreign, negatives[0]))

    # 우선순위: priority district + 외국인 리뷰 많은 순 + trust 높은 순
    def score(item):
        c, foreign, _ = item
        pri_boost = 50 if c.get("district") in PRIORITY_DISTRICTS else 0
        return -(c["trust_score"] + pri_boost + foreign / 10)

    candidates.sort(key=score)
    candidates = candidates[:args.limit]

    out_path = ROOT / "web" / args.out
    with open(out_path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow([
            "rank", "clinic_name", "district", "trust_score", "rating", "total_reviews",
            "foreign_review_count", "primary_foreign_lang",
            "dashboard_url", "clinic_url",
            "negative_review_quote", "ai_reply_category", "ai_reply_draft",
            "contact_phone", "contact_website", "maps_url",
            "top_doctor_name", "top_doctor_url",
        ])
        for i, (c, foreign, neg) in enumerate(candidates, 1):
            lc = c.get("language_breakdown", {})
            primary_foreign = max(
                [("en", lc.get("en", 0)), ("ko", lc.get("ko", 0)), ("ja", lc.get("ja", 0))],
                key=lambda x: x[1],
            )[0]
            cat = classify(neg.get("text", ""))
            reviewer = neg.get("author") or "Valued patient"
            draft = TEMPLATES[cat].format(c=c["name"], r=reviewer)
            quote = neg.get("text", "")[:200] + ("…" if len(neg.get("text", "")) > 200 else "")

            top_doc = ""
            top_doc_url = ""
            ds = c.get("doctor_stats") or []
            if ds:
                d = ds[0]
                top_doc = d["name"]
                # build_master_db.py 가 미리 계산한 composite_slug 사용 — TS slugify 와 일치 보장
                composite = d.get("composite_slug") or f"{d['slug']}-at-{c['id'][:16]}"
                top_doc_url = f"{SITE_BASE}/doctor/{composite}"

            w.writerow([
                i, c["name"], c.get("district", ""), c["trust_score"],
                f"{c['rating']:.1f}", c["total_reviews"],
                foreign, primary_foreign,
                f"{SITE_BASE}/dashboard/{c['id']}",
                f"{SITE_BASE}/clinic/{c['id']}",
                quote, cat, draft,
                c.get("phone", ""), c.get("website", ""), c.get("maps_url", ""),
                top_doc, top_doc_url,
            ])

    print(f"[OK] {len(candidates)} 클리닉 → {out_path}")
    print(f"  미리보기 (top 5):")
    for i, (c, foreign, neg) in enumerate(candidates[:5], 1):
        print(f"  {i}. {c['name'][:50]:50s} | Trust {c['trust_score']} | {foreign} foreign reviews | {c.get('district','?')}")


if __name__ == "__main__":
    main()
