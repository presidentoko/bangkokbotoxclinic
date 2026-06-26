#!/usr/bin/env python3
"""
Generate receipts for cooking class venues using Claude API.
Reads: cooking_classes/output/places.json
Writes: cooking_classes/output/receipts.json

Usage:
    cd cooking_classes
    python generate_receipts.py
"""

import json
import os
import sys
import time
import hashlib
from pathlib import Path
import anthropic

OUTPUT_DIR = Path(__file__).parent / "output"
PLACES_FILE = OUTPUT_DIR / "places.json"
RECEIPTS_FILE = OUTPUT_DIR / "receipts.json"
STATE_FILE = OUTPUT_DIR / "receipts_state.json"

SYSTEM_PROMPT = """You are the verification engine for thaigle, a Bangkok day-planner built on aggregated reviews — NOT influencer opinions. Your job: turn raw multi-source reviews for one place into a trustworthy "receipt". Thai is the primary output language.

NON-NEGOTIABLE RULES
1. No hallucination. Every claim in data_says MUST be grounded in the supplied reviews. For each claim, you must be able to point to review id(s). If reviews don't support a claim, omit it. Never invent dishes, prices, wait times, treatments, or facilities not present in the input.
2. Exclude sponsored/promotional reviews from scoring and from data_says. Treat a review as sponsored if sponsoredSignal is true OR the text shows ad markers (received free, gifted, paid partnership, affiliate/discount-code language, uniformly superlative with no specifics, copy-paste promotional tone).
3. feed_says is a SYNTHESIZED parody of the hype tone — never quote a real person, handle, or post. It compresses the exaggerated "must-visit / viral hotspot" framing into one short line.
4. data_says is ONE paragraph with three beats: (a) verdict — is the core thing real? (b) reversal — where reality diverges. (c) action — the single most useful instruction. Plain, specific, no marketing adjectives.
5. localsScore: integer 0-100 using Bayesian shrinkage toward 3.0 with m=8, source weights (google 0.8, field 1.0), recency decay ×0.5 per 180 days.
6. If fewer than 5 real reviews remain after excluding sponsored, set status "insufficient".

OUTPUT: JSON only. No prose, no markdown, no code fences."""


def hash_reviews(reviews: list) -> str:
    data = json.dumps(sorted([r.get("text", "") for r in reviews])).encode()
    return hashlib.sha256(data).hexdigest()[:16]


def build_user_prompt(place: dict) -> str:
    reviews = place.get("reviews", [])
    return f"""Place: {place['name']} (thai cooking class, category=learn)
Reviews (JSON):
{json.dumps(reviews[:100], ensure_ascii=False, indent=2)}

Return ONLY this JSON (no markdown, no fences):
{{
  "localsScore": <int 0-100>,
  "status": "ok" | "insufficient" | "needs_review",
  "scoring": {{"kept": <int>, "excludedSponsored": <int>, "weightedMean5": <float>, "variance": <float>}},
  "feed_says": {{"th": "<one hype line>", "en": "...", "ko": "..."}},
  "data_says": {{"th": "<verdict+reversal+action paragraph>", "en": "...", "ko": "..."}},
  "evidence": [{{"claim": "<claim>", "reviewIds": [<int>...]}}],
  "faq": [{{"q": {{"th": "...", "en": "...", "ko": "..."}}, "a": {{"th": "...", "en": "...", "ko": "..."}}}}]
}}"""


def generate_receipt(client: anthropic.Anthropic, place: dict, state: dict) -> dict | None:
    place_id = place.get("place_id") or place["name"]
    reviews = place.get("reviews", [])
    reviews_hash = hash_reviews(reviews)

    # 멱등성 체크 — 리뷰가 바뀌지 않았으면 스킵
    if place_id in state and state[place_id].get("hash") == reviews_hash:
        print(f"  [skip] {place['name']} — unchanged")
        return None

    print(f"  [receipt] generating for {place['name']}...")

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            temperature=0.2,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": build_user_prompt(place)}],
        )
        raw = response.content[0].text.strip()
        # 코드 펜스 제거 (모델이 붙이는 경우)
        if raw.startswith("```"):
            parts = raw.split("```")
            raw = parts[1] if len(parts) > 1 else raw
            if raw.startswith("json"):
                raw = raw[4:]
        receipt = json.loads(raw.strip())
        state[place_id] = {"hash": reviews_hash, "status": receipt.get("status")}
        return receipt

    except json.JSONDecodeError:
        # temperature=0 으로 재시도
        print(f"  [retry] JSON 파싱 실패 → temperature=0 재시도")
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1500,
                temperature=0,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": build_user_prompt(place)}],
            )
            raw = response.content[0].text.strip()
            receipt = json.loads(raw)
            state[place_id] = {"hash": reviews_hash, "status": receipt.get("status")}
            return receipt
        except Exception as e:
            print(f"  [error] {place['name']}: {e}")
            state[place_id] = {"hash": reviews_hash, "status": "needs_review", "error": str(e)}
            return None

    except anthropic.RateLimitError:
        print("  [429] rate limited, waiting 30s...")
        time.sleep(30)
        return generate_receipt(client, place, state)

    except Exception as e:
        print(f"  [error] {place['name']}: {e}")
        state[place_id] = {"hash": reviews_hash, "status": "needs_review", "error": str(e)}
        return None


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    if not PLACES_FILE.exists():
        print(f"ERROR: {PLACES_FILE} not found — run scraper.py first")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    places: list[dict] = json.loads(PLACES_FILE.read_text(encoding="utf-8"))
    state: dict = json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else {}
    receipts: dict = {}

    # 기존 receipts.json 로드 (resume)
    if RECEIPTS_FILE.exists():
        try:
            receipts = json.loads(RECEIPTS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass

    print(f"[generate_receipts] Processing {len(places)} places...")

    for i, place in enumerate(places):
        place_id = place.get("place_id") or place["name"]
        receipt = generate_receipt(client, place, state)
        if receipt:
            receipts[place_id] = {**place, "receipt": receipt}
        elif place_id in state and state[place_id].get("hash"):
            # 스킵 (변경 없음) — 기존 receipt 유지
            pass

        # 상태 증분 저장
        STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")

        print(f"  [{i+1}/{len(places)}] done")
        time.sleep(0.5)  # 부드러운 rate limit

    RECEIPTS_FILE.write_text(json.dumps(receipts, indent=2, ensure_ascii=False), encoding="utf-8")
    n_needs_review = sum(1 for s in state.values() if s.get("status") == "needs_review")
    n_insufficient = sum(1 for s in state.values() if s.get("status") == "insufficient")

    print(f"\n[done] {len(receipts)} receipts saved to {RECEIPTS_FILE}")
    print(f"  ok:           {sum(1 for s in state.values() if s.get('status') == 'ok')}")
    print(f"  insufficient: {n_insufficient}")
    print(f"  needs_review: {n_needs_review}")


if __name__ == "__main__":
    main()
