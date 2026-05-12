"""클리닉 website 의 doctor 페이지에서 의사 이름 등장 URL 찾기 (cross-link 만, 콘텐츠 카피 X).

전략:
  1. master_db.json 에서 doctor_stats 있는 클리닉 + website 있는 곳 대상
  2. 후보 경로 (/our-doctors, /doctors, /team 등) 순회
  3. 페이지 텍스트에 `Dr. {name}` 패턴 매칭 → URL 저장
  4. 클리닉별 web/data/doctor_xref/{clinic_id}.json 저장: { doctor_name: url, ... }
  5. build_master_db.py 가 merge → doctor_stat.clinic_doctor_url
  6. 의사 페이지에 "View official bio at [clinic]" 버튼 노출

캐시: 14일 (의사 이동 드물어서 장기 캐시 OK)
동시성: 6 workers, request timeout 12s
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
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[2]
WEB_DATA = ROOT / "web" / "data"
MASTER_DB = WEB_DATA / "master_db.json"
OUT_DIR = WEB_DATA / "doctor_xref"

UA = "Mozilla/5.0 (compatible; ClinicDoctorXrefBot/1.0; +https://bangkokbotoxclinic.com/bot)"
TIMEOUT = 12
CACHE_DAYS = 14

# 의사 정보가 자주 노출되는 경로
DOCTOR_PATHS = [
    "", "/our-doctors", "/doctors", "/our-team", "/team", "/staff",
    "/about-us", "/about", "/our-staff", "/team-doctors", "/meet-our-team",
    "/our-physicians", "/physicians", "/specialists", "/our-specialists",
    "/en/team", "/en/doctors", "/en/our-team",  # multilingual fallback
]

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
            raw = r.read(1_500_000)  # 1.5MB cap
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


def text_from_html(html: str) -> str:
    text = HTML_TAG_RE.sub(" ", html)
    return WS_RE.sub(" ", text).lower()


def scrape_clinic(clinic: dict) -> tuple[str, dict[str, str]]:
    cid = clinic["id"]
    website = clinic.get("website", "").strip()
    if not website:
        return cid, {}
    doc_names = [d["name"] for d in clinic.get("doctor_stats", []) if d.get("name")]
    if not doc_names:
        return cid, {}

    base = normalize_url(website)
    found: dict[str, str] = {}

    for path in DOCTOR_PATHS:
        url = base + path
        html = fetch(url)
        if not html:
            continue
        text = text_from_html(html)
        for name in doc_names:
            if name in found:
                continue
            # `Dr. {name}` 또는 `Dr {name}` 또는 `Doctor {name}` 매칭
            pattern = re.compile(rf"\b(?:dr\.?|doctor)\s+{re.escape(name.lower())}\b")
            if pattern.search(text):
                found[name] = url
        if len(found) == len(doc_names):
            break  # 모두 찾음
        time.sleep(0.3)  # 같은 도메인 부담 방지
    return cid, found


def is_cached_recent(cid: str) -> bool:
    f = OUT_DIR / f"{cid}.json"
    if not f.exists():
        return False
    try:
        return (time.time() - f.stat().st_mtime) < CACHE_DAYS * 86400
    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    if not MASTER_DB.exists():
        log.error(f"master_db.json not found: {MASTER_DB}")
        return 1

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db.get("clinics", [])
    # 대상: website + doctor_stats 둘 다 있는 클리닉
    candidates = [c for c in clinics if c.get("website") and c.get("doctor_stats")]
    if not args.force:
        candidates = [c for c in candidates if not is_cached_recent(c["id"])]
    if args.limit > 0:
        candidates = candidates[:args.limit]

    log.info(f"doctor xref 대상: {len(candidates)} clinics (workers={args.workers}, force={args.force})")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    matched_clinics = 0
    matched_doctors = 0
    empty = 0
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = [ex.submit(scrape_clinic, c) for c in candidates]
        for i, fut in enumerate(as_completed(futures), 1):
            cid, xref = fut.result()
            out_file = OUT_DIR / f"{cid}.json"
            if xref:
                out_file.write_text(json.dumps(xref, ensure_ascii=False, indent=2), encoding="utf-8")
                matched_clinics += 1
                matched_doctors += len(xref)
            else:
                empty += 1
                if not out_file.exists():
                    out_file.write_text("{}", encoding="utf-8")  # 캐시 (다음 14일 skip)
            if i % 20 == 0:
                log.info(f"  진행 {i}/{len(candidates)} (matched clinics={matched_clinics}, doctors={matched_doctors}, empty={empty})")

    elapsed = time.time() - t0
    log.info(f"완료 ({elapsed:.1f}s) matched clinics={matched_clinics}, doctors={matched_doctors}, empty={empty}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
