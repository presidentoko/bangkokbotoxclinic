"""master_db 클리닉의 Google Maps 사진 스크래퍼.

scrape_photos_hair.py 패턴 재사용. 보톡스/덴탈/기타 사이트 노출 클리닉 대상.
출력: web/data/photos/{cid}.json (PhotoGallery 가 읽음)

사용법:
  python scripts/scrape_clinic_photos.py --focus botox,dental --top 300 --workers 4
  python scripts/scrape_clinic_photos.py --all --workers 4   # 전체

resume 지원: 이미 사진 있는 클리닉은 자동 스킵.
"""
from __future__ import annotations

import argparse
import json
import random
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from threading import Lock

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

ROOT = Path(__file__).resolve().parents[1]
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
PHOTOS_DIR = ROOT / "web" / "data" / "photos"
STATE_FILE = ROOT / "run" / "clinic_photos_state.json"
LOG_FILE = ROOT / "logs" / "clinic_photos.log"

PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

_log_lock = Lock()


def log(msg: str, lvl: str = "INFO") -> None:
    line = f"{datetime.now():%Y-%m-%d %H:%M:%S} [{lvl}] {msg}"
    with _log_lock:
        print(line, flush=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")


def cid_safe(cid: str) -> str:
    return cid.replace(":", "_")


def already_have(cid: str) -> bool:
    return (PHOTOS_DIR / f"{cid_safe(cid)}.json").exists()


def select_clinics(focuses: list[str] | None, top: int | None, do_all: bool) -> list[dict]:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    candidates: list[dict] = []
    for c in db["clinics"]:
        if not c.get("maps_url"):
            continue
        cats = c.get("categories", [])
        sm = c.get("service_mentions", {})
        included = False
        if do_all:
            included = True
        elif focuses:
            for f in focuses:
                if f in cats:
                    included = True
                    break
                if (sm.get(f, 0) or 0) >= 3:
                    included = True
                    break
        if included:
            candidates.append({
                "id": c["id"],
                "name": c["name"],
                "maps_url": c["maps_url"],
                "trust_score": c.get("trust_score", 0),
            })
    # Trust score 내림차순 + 이미 있는 건 제외
    candidates.sort(key=lambda c: -c["trust_score"])
    candidates = [c for c in candidates if not already_have(c["id"])]
    if top:
        candidates = candidates[:top]
    return candidates


def dismiss_consent(page) -> None:
    for sel in ['button[aria-label*="Accept"]', 'button:has-text("Accept all")']:
        try:
            b = page.locator(sel).first
            if b.is_visible(timeout=1200):
                b.click(timeout=1500)
                page.wait_for_timeout(800)
                return
        except Exception:
            pass


def scrape_one(page, place_id: str, name: str, url: str, max_photos: int = 6) -> list[str]:
    """maps_url 에서 사진 URL 추출. 반환: googleusercontent URL 리스트."""
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(random.randint(2500, 4000))
    except PWTimeout:
        return []
    dismiss_consent(page)

    # 첫 place 링크 클릭 (검색 결과 페이지일 경우)
    try:
        first = page.locator('a[href*="/place/"]').first
        if first.is_visible(timeout=2000):
            first.click(timeout=2500)
            page.wait_for_timeout(random.randint(2000, 3500))
    except Exception:
        pass

    # "Photos" 버튼 클릭 — 사진 갤러리 열기
    for sel in [
        'button[aria-label*="Photo of"]',
        'button[aria-label*="photo"]',
        'button[jsaction*="photo"]',
        'button:has-text("Photos")',
    ]:
        try:
            b = page.locator(sel).first
            if b.is_visible(timeout=2000):
                b.click(timeout=2000)
                page.wait_for_timeout(random.randint(2500, 4000))
                break
        except Exception:
            continue

    # 스크롤 — lazy-load 사진 트리거
    for _ in range(3):
        try:
            page.evaluate("window.scrollBy(0,800)")
        except Exception:
            pass
        page.wait_for_timeout(random.randint(900, 1500))

    # 사진 URL 수집
    photos: set[str] = set()
    ST = 800
    try:
        for n in page.locator('div[style*="background-image"]').all()[: max_photos * 3]:
            try:
                style = n.get_attribute("style", timeout=ST) or ""
                m = re.search(r"url\((['\"]?)(https?://[^)'\"]+)\1", style)
                if m:
                    u = m.group(2)
                    if "googleusercontent" in u and "=w" in u:
                        photos.add(u)
                        if len(photos) >= max_photos:
                            break
            except Exception:
                pass
    except Exception:
        pass
    if len(photos) < max_photos:
        try:
            for img in page.locator('img[src*="googleusercontent"]').all()[: max_photos * 3]:
                try:
                    src = img.get_attribute("src", timeout=ST) or ""
                    if "googleusercontent" in src and src not in photos:
                        photos.add(src)
                        if len(photos) >= max_photos:
                            break
                except Exception:
                    pass
        except Exception:
            pass
    return list(photos)[:max_photos]


def normalise_photo(url: str) -> dict:
    """URL의 size suffix(=w203-h270-...)를 thumb/large 두 가지로 정규화."""
    base = re.sub(r"=w\d+-h\d+-[^=]*$", "", url).rstrip("=")
    return {
        "thumb": f"{base}=w400-h300-k-no",
        "large": f"{base}=w1200-h900-k-no",
    }


def write_clinic_photos(cid: str, name: str, raw_urls: list[str]) -> bool:
    photos = []
    for i, u in enumerate(raw_urls):
        n = normalise_photo(u)
        photos.append({"idx": i, "thumb": n["thumb"], "large": n["large"]})
    if not photos:
        return False
    out_file = PHOTOS_DIR / f"{cid_safe(cid)}.json"
    out_file.write_text(json.dumps({
        "place_id": cid,
        "source": "google_maps",
        "supplier_name": name,
        "photos": photos,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    return True


def worker(worker_id: int, clinics: list[dict], max_photos: int) -> dict:
    counts = {"scraped": 0, "empty": 0, "error": 0}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            locale="en-US",
            viewport={"width": 1366, "height": 900},
        )
        page = ctx.new_page()
        for c in clinics:
            try:
                if already_have(c["id"]):
                    continue
                urls = scrape_one(page, c["id"], c["name"], c["maps_url"], max_photos=max_photos)
                if urls and write_clinic_photos(c["id"], c["name"], urls):
                    counts["scraped"] += 1
                    log(f"[W{worker_id}] OK  {c['name'][:40]:40} → {len(urls)} photos")
                else:
                    counts["empty"] += 1
                    log(f"[W{worker_id}] -   {c['name'][:40]:40} (no photos)")
                # 폴라이트 딜레이 — 너무 빠르면 Google이 차단
                time.sleep(random.uniform(2.0, 4.0))
            except Exception as e:
                counts["error"] += 1
                log(f"[W{worker_id}] ERR {c['name'][:40]:40} {str(e)[:80]}", lvl="WARN")
        browser.close()
    return counts


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--focus", default="botox,dental", help="콤마구분 focus list (or 'all')")
    ap.add_argument("--all", action="store_true", help="모든 클리닉 (focus 무시)")
    ap.add_argument("--top", type=int, default=None, help="trust_score 상위 N개 만")
    ap.add_argument("--workers", type=int, default=4, help="병렬 워커 수")
    ap.add_argument("--max-photos", type=int, default=6, help="클리닉당 사진 수")
    args = ap.parse_args()

    focuses = None if args.all else [s.strip() for s in args.focus.split(",") if s.strip()]
    log(f"Start: focus={focuses if focuses else 'all'} top={args.top} workers={args.workers} max_photos={args.max_photos}")

    clinics = select_clinics(focuses, args.top, args.all)
    if not clinics:
        log("스크랩 대상 0 — 이미 다 처리됐거나 필터 결과 없음")
        return 0

    log(f"클리닉 {len(clinics)} 개 — 워커당 {len(clinics) // args.workers + 1} 개")

    # 워커별 라운드로빈 분배
    buckets: list[list[dict]] = [[] for _ in range(args.workers)]
    for i, c in enumerate(clinics):
        buckets[i % args.workers].append(c)

    total = {"scraped": 0, "empty": 0, "error": 0}
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = {ex.submit(worker, i + 1, buckets[i], args.max_photos): i + 1 for i in range(args.workers)}
        for fut in as_completed(futs):
            wid = futs[fut]
            try:
                r = fut.result()
                log(f"[W{wid}] DONE scraped={r['scraped']} empty={r['empty']} error={r['error']}")
                for k in total:
                    total[k] += r[k]
            except Exception as e:
                log(f"[W{wid}] CRASH {e}", lvl="ERROR")

    log(f"전체 완료: scraped={total['scraped']} empty={total['empty']} error={total['error']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
