"""각 골프장 website 가서 그린피, 홀, 영업정보 추출.

전략:
- requests + regex (가벼움)
- Facebook URL 스킵 (page scrape 어려움)
- 동적 사이트 (JS-heavy) 는 일단 스킵 (Phase 2: Playwright 추가)
- 결과: data/website_enrichment.json (place_id → 추출 정보)
- master_db rebuild 시 merge 됨 (apify_to_master_db.py 가 import)

추출:
- holes (9 / 18 / 27 / 36)
- par
- green_fees (weekday/weekend, foreigner price 가능)
- designer
- year_opened
- booking_url
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web-golf" / "data" / "master_db.json"
OUT_FILE = ROOT / "web-golf" / "data" / "website_enrichment.json"
TIMEOUT = 12  # seconds per fetch
MAX_WORKERS = 6
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 BangkokGolfBot/1.0"

# 추출 패턴
_HOLES_RE = re.compile(r"\b(9|18|27|36)[\s-]?holes?\b", re.IGNORECASE)
_PAR_RE = re.compile(r"\bpar[\s-]?(60|68|70|71|72|73|74)\b", re.IGNORECASE)
_FEE_RE = re.compile(r"(?:green\s*fee|fee)[^.\n]{0,80}?(฿|baht|thb|usd|\$)\s*([\d,]+)",
                     re.IGNORECASE)
_FEE_BAHT_RE = re.compile(r"(฿|baht|thb)\s*([\d,]{3,6})", re.IGNORECASE)
_DESIGNER_RE = re.compile(
    r"design(?:ed)?\s*(?:by)?\s*[:\-]?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})",
    re.IGNORECASE,
)
_YEAR_RE = re.compile(r"(?:opened|established|founded)[^.]{0,30}?(19|20)(\d{2})", re.IGNORECASE)
_BOOKING_KEY_RE = re.compile(r"book(?:ing)?|reservation|tee[\s-]?time", re.IGNORECASE)


def is_skip(url: str) -> bool:
    """Facebook / Instagram / 비고정 / 빈 URL 스킵."""
    if not url:
        return True
    u = url.lower()
    return any(s in u for s in [
        "facebook.com", "fb.com", "instagram.com", "twitter.com", "x.com",
        "youtube.com", "tiktok.com", "line.me",
    ])


def fetch(url: str, timeout: float = TIMEOUT) -> str:
    """간단 HTTP fetch. 실패 시 빈 문자열."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content_type = resp.headers.get("Content-Type", "").lower()
            if "html" not in content_type and "text" not in content_type:
                return ""
            raw = resp.read(500_000)  # 500KB 한도
            # encoding heuristic
            for enc in ("utf-8", "utf-8-sig", "iso-8859-1", "tis-620"):
                try:
                    return raw.decode(enc)
                except UnicodeDecodeError:
                    continue
            return raw.decode("utf-8", errors="replace")
    except Exception:
        return ""


def extract(html: str) -> dict:
    """HTML에서 패턴 추출. 빈 dict 면 의미 있는 정보 없음."""
    if not html:
        return {}
    # 빠른 strip (no BS4)
    text = re.sub(r"<script.*?</script>", " ", html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)

    out: dict = {}

    m = _HOLES_RE.search(text)
    if m:
        out["holes"] = int(m.group(1))

    m = _PAR_RE.search(text)
    if m:
        out["par"] = int(m.group(1))

    fees: list[str] = []
    for m in _FEE_RE.finditer(text):
        cur = m.group(1)
        amt = m.group(2).replace(",", "")
        fees.append(f"{cur}{amt}")
    if not fees:
        for m in _FEE_BAHT_RE.finditer(text):
            cur = m.group(1)
            amt = m.group(2).replace(",", "")
            try:
                if 200 <= int(amt) <= 50000:  # 그린피 그럴싸한 범위
                    fees.append(f"{cur}{amt}")
            except ValueError:
                pass
    if fees:
        out["fee_mentions"] = list(dict.fromkeys(fees))[:10]  # dedupe + 상한 10

    m = _DESIGNER_RE.search(text)
    if m:
        candidate = m.group(1).strip()
        if 5 <= len(candidate) <= 60 and candidate.lower() not in ("by", "the"):
            out["designer"] = candidate

    m = _YEAR_RE.search(text)
    if m:
        try:
            out["year_opened"] = int(f"{m.group(1)}{m.group(2)}")
        except ValueError:
            pass

    # Booking link 후보 (a href 쪽 — 단순 추출)
    booking_candidates = []
    for m in re.finditer(r'<a\s[^>]*href="([^"]+)"[^>]*>([^<]{0,50})</a>',
                         html, re.IGNORECASE):
        href = m.group(1)
        label = m.group(2).strip()
        if _BOOKING_KEY_RE.search(label) or _BOOKING_KEY_RE.search(href):
            if len(booking_candidates) < 3:
                booking_candidates.append({"href": href, "label": label})
    if booking_candidates:
        out["booking_links"] = booking_candidates

    return out


def process(course: dict) -> tuple[str, dict]:
    pid = course["place_id"]
    url = course.get("website") or ""
    if is_skip(url):
        return pid, {"skipped": "facebook_or_social"}
    html = fetch(url)
    if not html:
        return pid, {"skipped": "fetch_failed_or_blocked"}
    data = extract(html)
    return pid, data


def main():
    if not MASTER_DB.exists():
        print(f"NOT FOUND: {MASTER_DB}", file=sys.stderr)
        sys.exit(1)
    with open(MASTER_DB, "r", encoding="utf-8") as f:
        db = json.load(f)
    courses = db.get("courses", db.get("restaurants", []))

    # 기존 enrichment 있으면 로드 (idempotent)
    existing: dict = {}
    if OUT_FILE.exists():
        with open(OUT_FILE, "r", encoding="utf-8") as f:
            existing = json.load(f)

    todo = [c for c in courses if c.get("website") and not is_skip(c.get("website"))]
    print(f"Total courses: {len(courses)}")
    print(f"To enrich (have website): {len(todo)}")
    print(f"Already done: {sum(1 for c in todo if c['place_id'] in existing and existing[c['place_id']].get('skipped') is None)}")

    results = dict(existing)
    started = time.time()
    done_count = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(process, c): c for c in todo if c["place_id"] not in existing}
        total_jobs = len(futures)
        for fut in as_completed(futures):
            c = futures[fut]
            try:
                pid, data = fut.result()
                results[pid] = data
                done_count += 1
                if done_count % 10 == 0:
                    elapsed = time.time() - started
                    print(f"  {done_count}/{total_jobs} done ({elapsed:.0f}s, "
                          f"avg {elapsed/done_count:.1f}s/site)")
                    # interim save
                    with open(OUT_FILE, "w", encoding="utf-8") as f:
                        json.dump(results, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"  ERROR for {c.get('name', '?')}: {e}", file=sys.stderr)
                results[c["place_id"]] = {"error": str(e)[:200]}

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # 통계
    n = len(results)
    n_holes = sum(1 for v in results.values() if v.get("holes"))
    n_par = sum(1 for v in results.values() if v.get("par"))
    n_fees = sum(1 for v in results.values() if v.get("fee_mentions"))
    n_designer = sum(1 for v in results.values() if v.get("designer"))
    n_year = sum(1 for v in results.values() if v.get("year_opened"))
    n_booking = sum(1 for v in results.values() if v.get("booking_links"))
    n_skipped = sum(1 for v in results.values() if v.get("skipped"))
    print(f"\n[OK] {OUT_FILE}")
    print(f"  total enriched: {n}")
    print(f"  with holes: {n_holes}")
    print(f"  with par: {n_par}")
    print(f"  with fee mentions: {n_fees}")
    print(f"  with designer: {n_designer}")
    print(f"  with year: {n_year}")
    print(f"  with booking links: {n_booking}")
    print(f"  skipped (FB/social/dead): {n_skipped}")


if __name__ == "__main__":
    main()
