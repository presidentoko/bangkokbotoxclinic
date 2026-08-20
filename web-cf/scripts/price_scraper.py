"""클리닉 website 에서 published 가격 추출.

전략:
  1. master_db.json 의 website 가진 클리닉만 대상
  2. homepage + /price /pricing /services /treatments /menu 경로 시도
  3. HTML 파싱 → service keyword 주변 ฿/THB/baht 숫자 regex 추출
  4. service category 별 min/max 결정 → web/data/pricing/{clinic_id}.json
  5. 일주일 이내 캐시 skip (last_checked 기준)
  6. 동시성 8개, request timeout 15s, 실패 silent skip

usage:
  python price_scraper.py                  # 모든 클리닉
  python price_scraper.py --limit 50       # 50개만
  python price_scraper.py --force          # 캐시 무시 재스크랩
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
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB_DATA = ROOT / "web" / "data"
MASTER_DB = WEB_DATA / "master_db.json"
OUT_DIR = WEB_DATA / "pricing"

UA = "Mozilla/5.0 (compatible; ClinicPriceBot/1.0; +https://bangkokbotoxclinic.com/bot)"
TIMEOUT = 15
PATHS = ["", "/price", "/pricing", "/prices", "/services", "/treatments", "/menu", "/cost", "/rates", "/fee", "/promotion"]
CACHE_DAYS = 7

# 시장 최저가 floor (이하는 false positive 로 간주). false-positive 제거용.
SERVICE_MIN_THB = {
    "botox": 1500, "filler": 3000, "hifu": 5000, "facial": 800,
    "laser": 1500, "dental": 2000, "hair_transplant": 15000, "eye": 10000,
}
# 시장 최고가 ceiling (이상은 false positive — 패키지 가격이 아닌 한)
SERVICE_MAX_THB = {
    "botox": 80000, "filler": 80000, "hifu": 100000, "facial": 30000,
    "laser": 100000, "dental": 500000, "hair_transplant": 600000, "eye": 200000,
}

# Service keyword → category
SERVICE_KEYWORDS = {
    "botox": ["botox", "botulinum", "보톡스", "โบท็อก"],
    "filler": ["filler", "hyaluronic", "필러", "ฟิลเลอร์"],
    "hifu": ["hifu", "ulthera", "ultraformer", "ulthera", "하이푸", "ไฮฟู"],
    "facial": ["facial", "hydrafacial", "skin care", "skincare", "페이셜", "ทรีตเมนต์"],
    "laser": ["laser", "ipl", "fraxel", "co2 laser", "레이저", "เลเซอร์"],
    "dental": ["dental", "implant", "veneer", "치과", "ทันตกรรม"],
    "hair_transplant": ["hair transplant", "fue", "fut", "모발이식", "ปลูกผม"],
    "eye": ["lasik", "ophthal", "ico", "lens", "안과", "เลสิก"],
}

# ฿15,000 / 15,000 baht / THB 15000 / 15K THB
PRICE_RE = re.compile(
    r"(?:(?:฿|THB|baht)\s*([\d,]{3,9})(?:\s*(?:k|K))?"  # ฿15,000 or THB 15K
    r"|([\d,]{3,9})(?:\s*(?:k|K))?\s*(?:THB|baht|฿))",  # 15,000 THB
    re.IGNORECASE,
)
HTML_TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def fetch(url: str) -> str | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en,th;q=0.9,ko;q=0.8"})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            ct = r.headers.get("Content-Type", "")
            if "text/html" not in ct and "application/xhtml" not in ct:
                return None
            raw = r.read(2_000_000)  # cap 2MB
            charset = "utf-8"
            if "charset=" in ct:
                charset = ct.split("charset=", 1)[1].split(";")[0].strip() or "utf-8"
            try:
                return raw.decode(charset, errors="ignore")
            except LookupError:
                return raw.decode("utf-8", errors="ignore")
    except Exception:
        return None


def normalize_url(base: str) -> str:
    if not base.startswith("http"):
        base = "https://" + base
    return base.rstrip("/")


def parse_price_token(m: re.Match) -> int | None:
    raw = m.group(1) or m.group(2)
    if not raw:
        return None
    cleaned = raw.replace(",", "")
    try:
        v = int(cleaned)
    except ValueError:
        return None
    full = m.group(0).lower()
    if "k" in full:
        v *= 1000
    # 100 미만 또는 1,000,000 초과 outlier 제거
    if v < 100 or v > 1_000_000:
        return None
    return v


def extract_prices_from_html(html: str, source_url: str) -> list[dict]:
    """HTML 에서 service category 별 price range 추출."""
    text = HTML_TAG_RE.sub(" ", html)
    text = WS_RE.sub(" ", text).lower()

    by_service: dict[str, list[int]] = {}
    for service, keywords in SERVICE_KEYWORDS.items():
        prices: list[int] = []
        for kw in keywords:
            # keyword 좌우 ±250자 윈도우 안에서 가격 검색
            for kw_match in re.finditer(re.escape(kw.lower()), text):
                start = max(0, kw_match.start() - 250)
                end = min(len(text), kw_match.end() + 250)
                window = text[start:end]
                for pm in PRICE_RE.finditer(window):
                    p = parse_price_token(pm)
                    if p is not None:
                        prices.append(p)
        if prices:
            by_service[service] = prices

    results: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()
    for service, prices in by_service.items():
        # service 별 floor/ceiling 필터링
        floor = SERVICE_MIN_THB.get(service, 500)
        ceil_v = SERVICE_MAX_THB.get(service, 1_000_000)
        prices = [p for p in prices if floor <= p <= ceil_v]
        if not prices:
            continue
        prices.sort()
        # outlier 제거: 상하 25 percentile 트림 (가격이 5개 이상일 때만)
        if len(prices) >= 5:
            q = len(prices) // 4
            prices = prices[q:-q] if q > 0 else prices
        pmin, pmax = prices[0], prices[-1]
        results.append({
            "service": service,
            "unit_label": "per session",  # crude default
            "price_min_thb": pmin,
            "price_max_thb": pmax,
            "source_url": source_url,
            "last_checked": now,
        })
    return results


def scrape_clinic(clinic: dict) -> tuple[str, list[dict] | None]:
    cid = clinic["id"]
    website = clinic.get("website", "").strip()
    if not website:
        return cid, None
    try:
        base = normalize_url(website)
        all_prices: dict[str, dict] = {}  # service → 가장 좋은 결과
        for path in PATHS:
            url = base + path
            html = fetch(url)
            if not html:
                continue
            prices = extract_prices_from_html(html, url)
            for p in prices:
                cur = all_prices.get(p["service"])
                if cur is None:
                    all_prices[p["service"]] = p
                else:
                    cur["price_min_thb"] = min(cur["price_min_thb"], p["price_min_thb"])
                    cur["price_max_thb"] = max(cur["price_max_thb"], p["price_max_thb"])
            if len(all_prices) >= 5:
                break  # 충분
            time.sleep(0.3)  # 같은 도메인 부담 방지
        return cid, list(all_prices.values()) if all_prices else []
    except Exception as e:
        log.error(f"scrape {cid} failed: {e}")
        return cid, None


def is_cached_recent(cid: str) -> bool:
    f = OUT_DIR / f"{cid}.json"
    if not f.exists():
        return False
    try:
        age = time.time() - f.stat().st_mtime
        return age < CACHE_DAYS * 86400
    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="최대 처리 클리닉 수 (0=무제한)")
    parser.add_argument("--force", action="store_true", help="캐시 무시 재스크랩")
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    if not MASTER_DB.exists():
        log.error(f"master_db.json 없음: {MASTER_DB}")
        return 1

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db.get("clinics", [])
    candidates = [c for c in clinics if c.get("website")]
    if not args.force:
        candidates = [c for c in candidates if not is_cached_recent(c["id"])]
    if args.limit > 0:
        candidates = candidates[:args.limit]

    log.info(f"price scrape 대상: {len(candidates)} / {len(clinics)} (workers={args.workers}, force={args.force})")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    saved = 0
    empty = 0
    failed = 0
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = [ex.submit(scrape_clinic, c) for c in candidates]
        for i, fut in enumerate(as_completed(futures), 1):
            cid, prices = fut.result()
            if prices is None:
                failed += 1
            elif not prices:
                empty += 1
                # empty 도 캐시해서 다음 7일간 skip
                (OUT_DIR / f"{cid}.json").write_text(json.dumps([], ensure_ascii=False), encoding="utf-8")
            else:
                (OUT_DIR / f"{cid}.json").write_text(
                    json.dumps(prices, ensure_ascii=False, indent=2), encoding="utf-8"
                )
                saved += 1
            if i % 25 == 0:
                log.info(f"  진행 {i}/{len(candidates)} (saved={saved}, empty={empty}, fail={failed})")

    elapsed = time.time() - t0
    log.info(f"완료 ({elapsed:.1f}s) saved={saved} empty={empty} failed={failed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
