"""Gemini 2.5 Flash 로 클리닉별 양국어 (TH/EN) 위키 요약 생성.

목표:
  - master_db.json의 각 clinic 에 대해 unique 200-400자 요약 2개 (TH + EN)
  - thin content 회피: 실 데이터(별점, Pantip 인용, 의사, 카테고리)를 prompt에 박아넣어
    각 클리닉마다 서로 다른 응답이 나오게.

출력: web/data/wiki_summaries/<clinic_id>.json

운영:
  - 무료 tier: 15 RPM, 1500 RPD → 750 clinics/day
  - resume-safe (progress.json)
  - watchdog Service 로 등록되어 자동 재시작

작성: 2026-05-23
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# .env 로드 (GOOGLE_API_KEY)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except Exception:
    pass

from google import genai
from google.genai import types as gtypes

ROOT = Path(__file__).resolve().parent.parent
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
OUTPUT_DIR = ROOT / "web" / "data" / "wiki_summaries"
STATE_DIR = ROOT / "wiki_generator" / "state"
STATE_FILE = STATE_DIR / "progress.json"
HEARTBEAT = STATE_DIR / "heartbeat"

# Gemini 3.1 Flash-Lite — 2026-05 기준 free tier OK (이 키에서 200 OK 확인).
# 2.0/2.5 Flash 는 free tier quota 가 작거나 0 이라 못 씀. 3.1 lite 가 안정적.
# 처음엔 보수적으로 throttle, 운영 중 429 안 뜨면 조정.
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
RPM = int(os.getenv("GEMINI_RPM", "15"))             # 보수적 — 첫날 모니터링 후 조정
RPD = int(os.getenv("GEMINI_RPD", "1400"))           # 1500 추정, 안전마진
PER_REQUEST_DELAY_SEC = 60.0 / max(RPM - 2, 1)       # 추가 2 안전마진

MAX_RETRIES = 5
BACKOFF_BASE = 8  # 첫 backoff 8초, 이후 8/16/32/64/128

# Prompt 출력 자수
TARGET_CHARS_MIN = 200
TARGET_CHARS_MAX = 400

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("wiki_gen")


# ── 입력 데이터 정리 ──────────────────────────────────────────


def _shrink_clinic(c: dict) -> dict:
    """LLM 에 보낼 dict — 토큰 절감 + relevant 데이터만."""
    out = {
        "name": c.get("name") or "",
        "city": c.get("city_label") or "",
        "district": c.get("district") or "",
        "primary_type": c.get("primary_type") or "",
        "categories": c.get("categories") or [],
        "rating": c.get("rating"),
        "total_reviews": c.get("total_reviews"),
        "trust_score": c.get("trust_score"),
        "scraped_review_count": c.get("scraped_review_count"),
    }
    # 의사 (top 2 by mentions)
    docs = (c.get("doctor_stats") or [])[:]
    docs.sort(key=lambda d: (d.get("mentions") or 0), reverse=True)
    out["doctors"] = [{"name": d.get("name"), "mentions": d.get("mentions"),
                       "experience": d.get("experience_signals") or []}
                      for d in docs[:2]]
    # 서비스 mention top 5
    sm = c.get("service_mentions") or {}
    out["top_services"] = sorted(sm.items(), key=lambda x: -x[1])[:5]
    # Pantip mention summary
    p = c.get("pantip") or {}
    if p.get("mention_count"):
        out["pantip"] = {
            "mention_count": p.get("mention_count"),
            "branch_specific_count": p.get("branch_specific_count"),
            "top_3_titles": [m.get("title", "")[:120] for m in (p.get("top_mentions") or [])[:3]],
        }
    # 샘플 리뷰 (TH/EN 각 1-2개, 너무 길면 cut)
    out["sample_th"] = [
        (sr.get("text") or "")[:200] for sr in (c.get("sample_reviews_th") or [])[:2]
    ]
    out["sample_en"] = [
        (sr.get("text") or "")[:200] for sr in (c.get("sample_reviews_en") or [])[:2]
    ]
    # 가격 (HDmall)
    pricing = c.get("pricing") or []
    if pricing:
        prices = []
        for p in pricing[:5]:
            if isinstance(p, dict):
                title = p.get("name") or p.get("service") or ""
                price = p.get("price_thb") or p.get("price") or ""
                if title and price:
                    prices.append({"service": title[:60], "thb": price})
        out["pricing"] = prices
    return {k: v for k, v in out.items() if v}


# ── Prompt ────────────────────────────────────────────────────


PROMPT_SYSTEM = (
    "You are writing factual, objective summaries for a clinic directory wiki page. "
    "Use ONLY data provided. Do NOT invent facts. "
    "Be specific to THIS clinic — avoid generic phrases that could apply to any clinic. "
    "If data is missing, write less rather than padding. "
    "Output JSON only."
)

PROMPT_USER_TEMPLATE = """Generate two summaries for this clinic — one in Thai (summary_th), one in English (summary_en).

Each summary: 200-400 characters, 2-3 sentences. Highlight what's UNIQUE based on the data.
If Pantip mentions exist, reference them ("Pantip 후기 X건" or "N Pantip discussions").
If specific doctors are mentioned, name them.
If pricing data exists, mention price range.
Avoid filler like "is a great clinic" — be data-driven.

Clinic data:
{data}

Output JSON exactly in this shape:
{{"summary_th": "...태국어 요약...", "summary_en": "...English summary..."}}"""


# ── 클라이언트 ─────────────────────────────────────────────────


def make_client() -> genai.Client:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY missing in env / .env")
    return genai.Client(api_key=api_key)


# ── Throttle / progress ───────────────────────────────────────


def load_progress() -> dict:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    if not STATE_FILE.exists():
        return {"done": {}, "daily": {}, "started_at": datetime.now(timezone.utc).isoformat()}
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {"done": {}, "daily": {}, "started_at": datetime.now(timezone.utc).isoformat()}


def save_progress(prog: dict):
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = STATE_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(prog, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, STATE_FILE)


def today_key() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def daily_count(prog: dict) -> int:
    return int((prog.get("daily") or {}).get(today_key(), 0))


def incr_daily(prog: dict):
    d = prog.setdefault("daily", {})
    k = today_key()
    d[k] = int(d.get(k, 0)) + 1


def write_heartbeat():
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    try:
        HEARTBEAT.write_text(datetime.now(timezone.utc).isoformat(), encoding="utf-8")
    except Exception:
        pass


# ── Gemini 호출 ───────────────────────────────────────────────


def _seconds_to_utc_midnight() -> int:
    now = datetime.now(timezone.utc)
    nxt = now.replace(hour=0, minute=0, second=0, microsecond=0)
    nxt = nxt.replace(day=now.day + 1) if now.day < 28 else nxt.replace(month=now.month + 1, day=1)
    return int((nxt - now).total_seconds())


def call_gemini(client: genai.Client, clinic_data: dict) -> dict | None:
    """단일 클리닉 dict → {'summary_th': ..., 'summary_en': ...}.

    실패 (rate limit / network) 시 backoff + retry. 최종 실패면 None.
    """
    user = PROMPT_USER_TEMPLATE.format(data=json.dumps(clinic_data, ensure_ascii=False))
    for attempt in range(MAX_RETRIES):
        try:
            resp = client.models.generate_content(
                model=MODEL,
                config=gtypes.GenerateContentConfig(
                    system_instruction=PROMPT_SYSTEM,
                    response_mime_type="application/json",
                    temperature=0.5,
                    max_output_tokens=2000,    # Thai 3-byte chars + EN + JSON 여유
                ),
                contents=user,
            )
            text = (resp.text or "").strip()
            if not text:
                log.warning(f"  empty response (attempt {attempt+1})")
                time.sleep(BACKOFF_BASE * (2 ** attempt))
                continue
            try:
                data = json.loads(text)
            except json.JSONDecodeError as je:
                # 1) markdown 감싸인 케이스
                m = re.search(r"\{.*\}", text, re.DOTALL)
                if m:
                    try:
                        data = json.loads(m.group(0))
                    except json.JSONDecodeError:
                        log.warning(f"  JSON partial parse fail tail={text[-80:]!r}")
                        time.sleep(BACKOFF_BASE * (2 ** attempt))
                        continue
                else:
                    log.warning(f"  no JSON in response: {text[:120]!r} ... {text[-80:]!r}")
                    time.sleep(BACKOFF_BASE * (2 ** attempt))
                    continue
            if "summary_th" in data and "summary_en" in data:
                return data
            log.warning(f"  malformed JSON keys: {list(data.keys())}")
            return None
        except Exception as e:
            msg = str(e)
            if "429" in msg or "RESOURCE_EXHAUSTED" in msg:
                # Gemini가 "Please retry in Xs" 정확히 명시 → 그 값을 신뢰.
                m = re.search(r"retry in ([\d.]+)s", msg)
                retry_s = float(m.group(1)) if m else None
                # PerDayPerProjectPerModel 인 경우만 자정까지 sleep.
                quota_metric_per_day = ("PerDayPerProjectPerModel" in msg
                                        or "PerDayPerProject" in msg
                                        or "requests per day" in msg.lower())
                if quota_metric_per_day and (retry_s is None or retry_s > 600):
                    sleep_s = _seconds_to_utc_midnight() + 60
                    log.warning(f"  DAILY QUOTA hit — sleeping {sleep_s}s until UTC midnight + 1m")
                    time.sleep(sleep_s)
                    continue
                # 그 외 (RPM, TPM 등): retry-after 가 짧으면 그것 + 안전 마진
                if retry_s is not None:
                    wait = retry_s + 3 + random.uniform(0, 2)
                    log.warning(f"  rate limit 429 — Gemini retry={retry_s:.1f}s, sleeping {wait:.1f}s")
                else:
                    wait = max(60.0, BACKOFF_BASE * (2 ** attempt)) + random.uniform(0, 5)
                    log.warning(f"  rate limit 429 (attempt {attempt+1}) — fallback sleep {wait:.1f}s : {msg[:160]}")
                time.sleep(wait)
                continue
            log.warning(f"  API error (attempt {attempt+1}): {type(e).__name__}: {msg[:200]}")
            time.sleep(BACKOFF_BASE * (2 ** attempt))
    return None


# ── 메인 루프 ────────────────────────────────────────────────


# Pantip 스크래퍼와 동일한 시드 필터 — 쇼핑몰/호텔 등 비클리닉 제외.
TARGET_CATEGORIES = {"dental", "facial", "laser", "botox", "filler",
                     "hifu", "hair_transplant", "eye"}
TARGET_PRIMARY_TYPES = {
    "Dental clinic", "Dentist", "Medical clinic", "Skin care clinic",
    "Plastic surgery clinic", "Beauty salon", "Hair transplantation clinic",
    "Dermatologist", "Cosmetic dentist", "Doctor", "Clinic", "Medical office",
    "Specialized clinic", "Wellness center", "Medical Center", "Cosmetics industry",
    "Beauty product supplier", "Hair removal service", "Eye care center",
    "Ophthalmologist", "Orthodontist", "Oral surgeon", "Endodontist",
    "Periodontist", "Prosthodontist", "Aesthetics", "Physical therapy clinic",
    "Acupuncture clinic", "Hospital",
}


def eligible_clinics() -> list[dict]:
    """master_db 의 클리닉 — 필터 + 데이터 풍부도 기반 정렬.

    필터:
      1) categories 가 의료/뷰티 카테고리와 겹침
      2) primary_type 이 의료/뷰티 화이트리스트
    정렬:
      data_score = trust_score
        + 50 × log(1 + pantip mention count)         # Pantip 인용 풍부 = unique content↑
        + 20 × log(1 + scraped_review_count)         # 리뷰 분석 깊이
        + 10 × log(1 + total_reviews)                # 인기도
        + (50 if has pricing else 0)                 # HDmall 가격 = SEO 자료
    """
    import math
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    out: list[dict] = []
    for c in db.get("clinics") or []:
        cats = set(c.get("categories") or [])
        if not (cats & TARGET_CATEGORIES):
            continue
        if c.get("primary_type") not in TARGET_PRIMARY_TYPES:
            continue
        if not (c.get("name") or "").strip():
            continue
        out.append(c)

    def score(c: dict) -> float:
        ts = c.get("trust_score") or 0
        pmc = ((c.get("pantip") or {}).get("mention_count")) or 0
        src = c.get("scraped_review_count") or 0
        tr = c.get("total_reviews") or 0
        has_pricing = 1 if (c.get("pricing")) else 0
        return (
            ts
            + 50 * math.log(1 + pmc)
            + 20 * math.log(1 + src)
            + 10 * math.log(1 + tr)
            + 50 * has_pricing
        )

    out.sort(key=score, reverse=True)
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None, help="총 처리할 클리닉 수 제한 (테스트용)")
    ap.add_argument("--redo", action="store_true", help="이미 done 인 것도 재생성")
    args = ap.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    STATE_DIR.mkdir(parents=True, exist_ok=True)

    client = make_client()
    progress = load_progress()

    clinics = eligible_clinics()
    log.info(f"eligible: {len(clinics)} clinics")
    if args.limit:
        clinics = clinics[:args.limit]
        log.info(f"  limit={args.limit}")

    n_ok = n_skip = n_fail = 0
    consecutive_fails = 0

    for i, c in enumerate(clinics, 1):
        cid = c.get("id")
        if not cid:
            n_skip += 1
            continue

        # heartbeat 매번 갱신
        write_heartbeat()

        # 이미 처리됐고 redo 아니면 skip
        if not args.redo and cid in (progress.get("done") or {}):
            n_skip += 1
            continue

        # daily quota 보호: 오늘 처리량 한도 임박이면 다음날 새벽까지 sleep
        if daily_count(progress) >= RPD:
            sleep_s = _seconds_to_utc_midnight() + 60
            log.warning(f"daily cap {RPD} reached — sleep {sleep_s}s till UTC midnight + 1m")
            save_progress(progress)
            time.sleep(sleep_s)

        clinic_data = _shrink_clinic(c)
        log.info(f"[{i}/{len(clinics)}] {c.get('name','?')[:60]} (daily={daily_count(progress)}/{RPD})")
        result = call_gemini(client, clinic_data)
        if result is None:
            n_fail += 1
            consecutive_fails += 1
            log.warning(f"  ✗ failed after retries")
            if consecutive_fails >= 8:
                log.error(f"  too many consecutive failures — sleep 10 min")
                save_progress(progress)
                time.sleep(600)
                consecutive_fails = 0
            continue

        consecutive_fails = 0
        # 저장
        payload = {
            "clinic_id": cid,
            "name": c.get("name"),
            "summary_th": result.get("summary_th", "").strip(),
            "summary_en": result.get("summary_en", "").strip(),
            "model": MODEL,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
        out_path = OUTPUT_DIR / f"{cid}.json"
        out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

        progress.setdefault("done", {})[cid] = payload["generated_at"]
        incr_daily(progress)
        n_ok += 1

        if i % 10 == 0:
            save_progress(progress)
            log.info(f"=== checkpoint {i}/{len(clinics)} ok={n_ok} skip={n_skip} fail={n_fail} ===")

        # rate limit throttle
        time.sleep(PER_REQUEST_DELAY_SEC)

    save_progress(progress)
    log.info(f"=== DONE: ok={n_ok} skip={n_skip} fail={n_fail} / total={len(clinics)} ===")
    # 끝났어도 watchdog 가 죽음 감지 안 하게 sleep loop
    log.info("entering daemon mode — sleep 1h, then re-poll for new clinics")
    while True:
        write_heartbeat()
        time.sleep(3600)


if __name__ == "__main__":
    sys.exit(main())
