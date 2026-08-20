"""클리닉 외부 플랫폼 review 데이터 수집.

대상 플랫폼 (V1):
  - WhatClinic  — 의료 listing, 공개 HTML
  - Trustpilot  — 일반 비즈니스 review, 공개 HTML

전략 (clinic name + city 로 검색 → 첫 hit 매칭):
  1. master_db.json 의 클리닉 목록
  2. 각 클리닉마다 platform 별 search query 실행
  3. 첫 결과의 review count + rating 추출
  4. data/external_reviews/{clinic_id}.json 저장
  5. 7일 캐시
  6. WhatClinic/Trustpilot 모두 anti-bot 약함 — HTTP requests + regex 로 충분

매칭 검증:
  - 검색 첫 hit 가 정말 같은 클리닉인지 확인하려면 이름 fuzzy match (Jaccard >= 0.4)
  - 너무 약하면 skip

V1 한계:
  - TripAdvisor / Facebook 은 anti-bot 강함 → 별도 스크립트로 Playwright 사용해야 함 (Phase 2)
  - Bookimed 도 별도

usage:
  python external_review_scraper.py [--limit N] [--force] [--platform whatclinic]
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
import urllib.parse
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB_DATA = ROOT / "web" / "data"
MASTER_DB = WEB_DATA / "master_db.json"
OUT_DIR = WEB_DATA / "external_reviews"

UA = "Mozilla/5.0 (compatible; ClinicReputationBot/1.0; +https://bangkokbotoxclinic.com/bot)"
TIMEOUT = 15
CACHE_DAYS = 7

HTML_TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def fetch(url: str, retries: int = 1) -> str | None:
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en;q=0.9"})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                raw = r.read(3_000_000)
                ct = r.headers.get("Content-Type", "")
                charset = "utf-8"
                if "charset=" in ct:
                    charset = ct.split("charset=", 1)[1].split(";")[0].strip() or "utf-8"
                try:
                    return raw.decode(charset, errors="ignore")
                except LookupError:
                    return raw.decode("utf-8", errors="ignore")
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries:
                time.sleep(3)
                continue
            return None
        except Exception:
            return None
    return None


def normalize_name(s: str) -> set[str]:
    s = re.sub(r"[^a-z0-9\s]", " ", s.lower())
    tokens = {t for t in s.split() if len(t) > 2}
    stop = {"the", "and", "for", "clinic", "center", "centre", "bangkok", "med", "medical"}
    return tokens - stop


def jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


# ── WhatClinic ─────────────────────────────────────────────
WHATCLINIC_SEARCH = "https://www.whatclinic.com/search.aspx?searchterm={q}&country=th"

def scrape_whatclinic(name: str, city: str) -> dict | None:
    q = urllib.parse.quote_plus(f"{name} {city}")
    url = WHATCLINIC_SEARCH.format(q=q)
    html = fetch(url)
    if not html:
        return None
    # 첫 listing 의 URL 추출 — listing href 패턴 "/listings/.../"
    m = re.search(r'href="(/clinics/[^"]+)"[^>]*>\s*<[^>]+>([^<]+)', html)
    if not m:
        m = re.search(r'<a[^>]+href="(/clinics/[^"]+)"[^>]*>([^<]+)</a>', html)
    if not m:
        return None
    href, listed_name = m.group(1), HTML_TAG_RE.sub("", m.group(2)).strip()
    # 이름 매칭 검증
    sim = jaccard(normalize_name(name), normalize_name(listed_name))
    if sim < 0.3:
        return None
    detail_url = "https://www.whatclinic.com" + href
    detail = fetch(detail_url)
    if not detail:
        return None
    # rating + count 패턴 (WhatClinic HTML 구조)
    rating = None
    count = 0
    rm = re.search(r'"ratingValue"\s*:\s*"?([\d.]+)"?', detail)
    cm = re.search(r'"reviewCount"\s*:\s*"?(\d+)"?', detail)
    if rm:
        try: rating = float(rm.group(1))
        except: pass
    if cm:
        try: count = int(cm.group(1))
        except: pass
    if count == 0 and rating is None:
        return None
    return {
        "url": detail_url,
        "rating": rating,
        "count": count,
        "last_checked": datetime.now(timezone.utc).isoformat(),
    }


# ── Trustpilot ─────────────────────────────────────────────
TRUSTPILOT_SEARCH = "https://www.trustpilot.com/search?query={q}&country=TH"

def scrape_trustpilot(name: str, city: str) -> dict | None:
    q = urllib.parse.quote_plus(f"{name} {city}")
    url = TRUSTPILOT_SEARCH.format(q=q)
    html = fetch(url)
    if not html:
        return None
    # Trustpilot 첫 hit 의 business URL 패턴
    m = re.search(r'href="(/review/[^"?#]+)"', html)
    if not m:
        return None
    href = m.group(1)
    detail_url = "https://www.trustpilot.com" + href
    detail = fetch(detail_url)
    if not detail:
        return None
    # 이름 검증
    nm = re.search(r'<h1[^>]*>([^<]+)</h1>', detail)
    listed_name = HTML_TAG_RE.sub("", nm.group(1)).strip() if nm else ""
    if listed_name and jaccard(normalize_name(name), normalize_name(listed_name)) < 0.3:
        return None
    rating = None
    count = 0
    rm = re.search(r'"ratingValue"\s*:\s*"?([\d.]+)"?', detail)
    cm = re.search(r'"reviewCount"\s*:\s*"?(\d+)"?', detail)
    if rm:
        try: rating = float(rm.group(1))
        except: pass
    if cm:
        try: count = int(cm.group(1))
        except: pass
    if count == 0 and rating is None:
        return None
    return {
        "url": detail_url,
        "rating": rating,
        "count": count,
        "last_checked": datetime.now(timezone.utc).isoformat(),
    }


PLATFORM_SCRAPERS = {
    "whatclinic": scrape_whatclinic,
    "trustpilot": scrape_trustpilot,
}


def scrape_clinic(clinic: dict, platforms: list[str]) -> tuple[str, dict]:
    cid = clinic["id"]
    name = clinic.get("name", "")
    city = clinic.get("city_label", "Bangkok")
    result: dict = {}
    for plat in platforms:
        fn = PLATFORM_SCRAPERS.get(plat)
        if not fn:
            continue
        try:
            data = fn(name, city)
            if data:
                result[plat] = data
        except Exception as e:
            log.error(f"{cid} {plat} err: {e}")
        time.sleep(0.5)  # platform 간 backoff
    return cid, result


def is_cached_recent(cid: str) -> bool:
    f = OUT_DIR / f"{cid}.json"
    if not f.exists():
        return False
    try:
        return (time.time() - f.stat().st_mtime) < CACHE_DAYS * 86400
    except Exception:
        return False


def merge_existing(cid: str, new_data: dict) -> dict:
    """기존 파일이 있으면 platform 별 merge (다른 platform 새로 추가, 같은 platform 덮어쓰기)."""
    f = OUT_DIR / f"{cid}.json"
    existing = {}
    if f.exists():
        try:
            existing = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            existing = {}
    return {**existing, **new_data}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--platform", action="append", choices=list(PLATFORM_SCRAPERS.keys()),
                        help="기본=모두. 여러번 지정 가능.")
    args = parser.parse_args()

    platforms = args.platform if args.platform else list(PLATFORM_SCRAPERS.keys())

    if not MASTER_DB.exists():
        log.error(f"master_db.json 없음: {MASTER_DB}")
        return 1

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db.get("clinics", [])
    candidates = clinics
    if not args.force:
        candidates = [c for c in candidates if not is_cached_recent(c["id"])]
    if args.limit > 0:
        candidates = candidates[:args.limit]

    log.info(f"external reviews 대상: {len(candidates)} / {len(clinics)} platforms={platforms}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    found = 0
    empty = 0
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = [ex.submit(scrape_clinic, c, platforms) for c in candidates]
        for i, fut in enumerate(as_completed(futures), 1):
            cid, data = fut.result()
            if data:
                merged = merge_existing(cid, data)
                (OUT_DIR / f"{cid}.json").write_text(
                    json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8"
                )
                found += 1
            else:
                empty += 1
                # empty 도 빈 객체로 캐시 (있는 듯 처리해서 다음 7일 skip)
                f = OUT_DIR / f"{cid}.json"
                if not f.exists():
                    f.write_text("{}", encoding="utf-8")
            if i % 25 == 0:
                log.info(f"  진행 {i}/{len(candidates)} (found={found}, empty={empty})")

    elapsed = time.time() - t0
    log.info(f"완료 ({elapsed:.1f}s) found={found} empty={empty}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
