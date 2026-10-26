"""태국어 리뷰 원문 수집 — 발행 치과 1,773곳, 로그인 프로필, hl=th.

## 왜 별도 스크립트인가

`scraper.py` 를 REVIEW_HL=th 로 돌리면 두 가지가 깨진다:

1. **resume 판정이 전부 complete** — relevant+newest 둘 다 있으면 스킵이므로
   영어로 이미 끝난 1,773곳이 한 곳도 큐에 안 들어온다.
2. **영어 리뷰 CSV를 덮어쓴다** — `dental_output/*/reviews/<pid>_reviews.csv` 는
   지금 라이브로 클릭을 벌고 있는 영어 페이지의 소스다. 같은 파일에 태국어를
   쓰면 영어 본문이 사라진다. 이 레포에서 가장 자주 난 사고가 그것이다
   (feedback_scraper_monotonic_writes, feedback_dual_catalogue_silent_revert).

그래서 **추가만 한다**: 새 디렉터리 `dental_output/reviews_th/`, 키는 ChIJ id.
영어 자산은 읽지도 쓰지도 않는다.

## 왜 로컬이 가능한가 (10-15 기록 정정)

10-15 메모는 "구글이 비로그인에 limited view 를 서빙하므로 Apify 만 가능"이라고
적혀 있다. 그 다음 날 들어온 로그인 프로필 모드가 그걸 해결했는데 메모가 안 고쳐졌다.
2026-10-26 실측(ChIJ02_whiFnHTERMzbftXL8xGo): F7nice '4.9 (4,765)' 정상,
리뷰 본문 51건 전부 태국어, 중앙 123자. $28.37 불필요.

## 속도

로그인 모드는 프로필을 한 프로세스만 열 수 있고 한 계정을 여러 출구로 돌리면
계정 보안 검사에 걸리므로 **워커 1개**다. 10-21~22 로그인 런 346곳 실측 중앙값
90초/곳 — 다만 그 런은 relevant+newest 두 번 수집하고 영업시간·feature 도 읽는다.
여기는 리뷰 한 번만 읽으므로 더 빠르다.

## 재실행

파일이 있으면 스킵한다. 실패는 파일을 남기지 않으므로 다음 실행에서 자동 재시도된다
(ok 와 complete 를 구분한다 — feedback_scraper_partial_source_shrink).
"""
from __future__ import annotations

import csv
import json
import os
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PROFILE = ROOT / ".secrets" / "gmaps_profile"
MAPPING = ROOT / "apify_inputs" / "dental_thai_reviews" / "chij_to_clinic.json"
OUT_DIR = ROOT / "dental_output" / "reviews_th"
LOG_PATH = ROOT / "logs" / "dental_thai_reviews.log"

HL = "th"
# 8개를 길이로 고르는 게 하류 처방이므로(dental 깊이 작업) 40건이면 충분하다.
# Apify 입력도 maxReviews=30 이었다.
TARGET_REVIEWS = int(os.environ.get("TH_TARGET_REVIEWS", "40"))
MAX_SCROLLS = int(os.environ.get("TH_MAX_SCROLLS", "14"))
RESTART_EVERY = int(os.environ.get("TH_RESTART_EVERY", "25"))
LIMIT = int(os.environ.get("TH_LIMIT", "0"))  # 0 = 전부

THAI_RE = re.compile(r"[฀-๿]")
# 리뷰수가 괄호로 붙는다: '4.9\n(4,765)'. 괄호가 없으면 limited view 다.
COUNT_RE = re.compile(r"\(([\d,\.]+)\)")

_profile_lock_fh = None


def log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass


def acquire_profile_lock() -> bool:
    """scraper.py 와 같은 잠금 파일. 둘이 같이 돌면 서로의 크롬을 죽인다(10-21 사고)."""
    global _profile_lock_fh
    if os.name != "nt":
        return True
    import msvcrt

    path = PROFILE.with_name(PROFILE.name + ".scraper.lock")
    fh = open(path, "a+")
    try:
        fh.seek(0)
        msvcrt.locking(fh.fileno(), msvcrt.LK_NBLCK, 1)
    except OSError:
        fh.close()
        return False
    _profile_lock_fh = fh
    return True


def kill_stale_profile_chrome() -> None:
    """이 프로필을 붙잡고 있는 크롬만 정리. 사용자의 개인 크롬은 user-data-dir 가 달라 안 걸린다."""
    if os.name != "nt":
        return
    import subprocess

    prof = str(PROFILE).replace("'", "''")
    ps = (
        "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
        f"Where-Object {{ $_.CommandLine -and $_.CommandLine.Contains('{prof}') }} | "
        "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; $_.ProcessId }"
    )
    try:
        out = subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps],
            capture_output=True, text=True, timeout=60,
        ).stdout.split()
        if out:
            log(f"  프로필을 잡고 있던 크롬 {len(out)}개 정리")
            time.sleep(2)
    except Exception as e:  # noqa: BLE001
        log(f"  크롬 정리 실패: {str(e)[:80]}")


BLOCK_TYPES = {"image", "media", "font"}
BLOCK_HOSTS = (
    "doubleclick.net", "google-analytics.com", "googletagmanager.com",
    "googleadservices.com", "googlesyndication.com", "adservice.google",
    "facebook.com", "facebook.net", "fbcdn.net", "scorecardresearch.com",
)


def _block_route(route, request):
    if request.resource_type in BLOCK_TYPES:
        return route.abort()
    if any(h in request.url for h in BLOCK_HOSTS):
        return route.abort()
    return route.continue_()


def launch(pw, ua: str | None):
    kw = dict(
        channel="chrome",  # 로그인한 그 크롬과 같은 지문
        headless=True,
        locale="en-US",
        viewport={"width": 1280, "height": 900},
        args=["--disable-blink-features=AutomationControlled"],
    )
    if ua:
        kw["user_agent"] = ua
    return pw.chromium.launch_persistent_context(str(PROFILE), **kw)


def real_ua(pw) -> str:
    """헤드리스 UA('HeadlessChrome')면 로그인해 있어도 limited view 가 걸린다(10-16 실측).
    버전을 지어내지 않으려고 실제 UA 를 한 번 읽어서 고친다."""
    ctx = launch(pw, None)
    try:
        return ctx.new_page().evaluate("navigator.userAgent").replace(
            "HeadlessChrome", "Chrome")
    finally:
        ctx.close()


SCROLL_JS = """() => {
    const d = document.querySelector('div[class*="m6QErb"][class*="DxyBCb"]')
           || document.querySelector('div.m6QErb');
    if (d) d.scrollTop = d.scrollHeight;
    return document.querySelectorAll('div[data-review-id]').length;
}"""

# 리뷰 카드 한 장에서 본문·별점·작성자·상대날짜를 같이 뽑는다. 본문만 따로 뽑으면
# 행이 어긋나 작성자와 본문이 섞인다.
#
# 작성자는 카드의 aria-label 에 이름만 깔끔하게 들어온다. div.d4r55 도 같은 값이지만
# aria-label 이 DOM 클래스 변경에 덜 흔들린다.
CARDS_JS = """() => Array.from(document.querySelectorAll('div[data-review-id]')).map(c => {
    const body = c.querySelector('span.wiI7pd') || c.querySelector('div.MyEned');
    const stars = c.querySelector('span[role="img"][aria-label]');
    const name = c.querySelector('div.d4r55');
    const meta = c.querySelector('div.WNxzHc, button.al6Kxe');
    const when = c.querySelector('span.rsqaWe, span.xRkPPb');
    return {
        id: c.getAttribute('data-review-id') || '',
        text: body ? body.innerText.trim() : '',
        stars: stars ? stars.getAttribute('aria-label') : '',
        author: (c.getAttribute('aria-label') || (name ? name.innerText : '')).trim(),
        meta: meta ? meta.innerText.trim() : '',
        when: when ? when.innerText.trim() : ''
    };
}).filter(r => r.text.length > 0)"""


def scrape_one(pg, chij: str) -> tuple[str, list[dict]]:
    """(status, rows). status: ok | none | limited | error"""
    url = f"https://www.google.com/maps/place/?q=place_id:{chij}&hl={HL}"
    pg.goto(url, wait_until="domcontentloaded")
    time.sleep(3)

    rating = pg.evaluate(
        "() => { const e = document.querySelector('div.F7nice');"
        " return e ? e.innerText : null; }")
    flat = " ".join(x for x in (rating or "").splitlines() if x.strip())
    if not rating:
        return "error", []
    if not COUNT_RE.search(flat):
        # 평점만 있고 리뷰수가 없다 = limited view. 리뷰 0건과 구분해야 한다.
        log(f"    limited view (F7nice={flat!r})")
        return "limited", []

    clicked = False
    for sel in ('button[aria-label*="รีวิว"]', 'button[aria-label*="Reviews"]',
                'button[data-tab-index="1"]'):
        try:
            b = pg.query_selector(sel)
            if b:
                b.click()
                clicked = True
                break
        except Exception:  # noqa: BLE001
            continue
    if not clicked:
        return "limited", []
    time.sleep(3)

    # 카드 수로 판정한다. scrollHeight 로 끊으면 비동기 로드가 끝나기 전에 높이가
    # 같아서 한 번에 멈춘다 — 168건짜리 클리닉에서 10건만 받았던 원인이다.
    stall, last = 0, -1
    for _ in range(MAX_SCROLLS):
        n = pg.evaluate(SCROLL_JS)
        time.sleep(1.4)
        if n == last:
            stall += 1
            if stall >= 3:
                break
        else:
            stall = 0
        last = n
        if n >= TARGET_REVIEWS:
            break

    # 긴 리뷰는 접혀 있다. 펼치지 않으면 본문이 잘려 저장된다.
    for b in pg.query_selector_all(
            'button[aria-label*="เพิ่มเติม"], button[aria-label*="More"]')[:40]:
        try:
            b.click()
        except Exception:  # noqa: BLE001
            pass
    time.sleep(1)

    seen: set[str] = set()
    rows: list[dict] = []
    for c in pg.evaluate(CARDS_JS):
        key = c["id"] or c["text"][:60]
        if key in seen:
            continue
        seen.add(key)
        m = re.search(r"(\d+)", c["stars"] or "")
        # "Local Guide · 201 รีวิว · 381 รูปภาพ" — 리뷰수 단위는 번역되므로 양쪽을 읽는다.
        am = re.search(r"([\d,]+)\s*(?:reviews?|รีวิว)", c["meta"] or "")
        rows.append({
            "chij": chij,
            "review_id": c["id"],
            "author": c["author"],
            "author_reviews": (am.group(1).replace(",", "") if am else ""),
            "rating": m.group(1) if m else "",
            "relative_date": c["when"],
            "is_thai": "1" if THAI_RE.search(c["text"]) else "0",
            "text": c["text"],
        })
    return ("ok" if rows else "none"), rows


FIELDS = ["chij", "review_id", "author", "author_reviews", "rating",
          "relative_date", "is_thai", "text"]


def write_rows(chij: str, rows: list[dict]) -> None:
    tmp = OUT_DIR / f".{chij}.tmp"
    final = OUT_DIR / f"{chij}.csv"
    with open(tmp, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    os.replace(tmp, final)  # 부분 파일이 complete 로 보이지 않게 원자적 교체


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_PATH.parent.mkdir(exist_ok=True)

    if not PROFILE.is_dir():
        log(f"로그인 프로필 없음: {PROFILE}")
        return 2
    if not acquire_profile_lock():
        log("로그인 프로필을 다른 스크래퍼가 쓰는 중 — 종료")
        return 3

    mapping = json.load(open(MAPPING, encoding="utf-8"))
    todo = [c for c in sorted(mapping) if not (OUT_DIR / f"{c}.csv").exists()]
    done_already = len(mapping) - len(todo)
    if LIMIT:
        todo = todo[:LIMIT]
    log("=" * 60)
    log(f"태국어 리뷰 수집: 대상 {len(mapping)} | 기존 완료 {done_already} | 이번 큐 {len(todo)}")
    log(f"출력 {OUT_DIR}  (영어 CSV 는 건드리지 않음)")

    kill_stale_profile_chrome()
    stats = {"ok": 0, "none": 0, "limited": 0, "error": 0}
    t0 = time.time()
    rows_total = 0
    thai_total = 0

    with sync_playwright() as pw:
        ua = real_ua(pw)
        log(f"UA: {ua[:80]}")
        ctx = launch(pw, ua)
        pg = ctx.new_page()
        pg.route("**/*", _block_route)
        pg.set_default_timeout(30000)

        for i, chij in enumerate(todo, 1):
            info = mapping[chij]
            if i > 1 and (i - 1) % RESTART_EVERY == 0:
                # 42시간 런에서 크롬이 계속 자란다. 이 기계는 메모리가 빡빡하다.
                ctx.close()
                time.sleep(2)
                ctx = launch(pw, ua)
                pg = ctx.new_page()
                pg.route("**/*", _block_route)
                pg.set_default_timeout(30000)
                log(f"  [{i}] 브라우저 재시작")

            try:
                status, rows = scrape_one(pg, chij)
            except Exception as e:  # noqa: BLE001
                status, rows = "error", []
                log(f"  [{i}/{len(todo)}] {chij} 예외: {str(e)[:100]}")

            stats[status] += 1
            if status in ("ok", "none"):
                write_rows(chij, rows)
                rows_total += len(rows)
                th = sum(1 for r in rows if r["is_thai"] == "1")
                thai_total += th
                log(f"  [{i}/{len(todo)}] {info.get('name','')[:34]} "
                    f"→ {len(rows)}건 (태국어 {th})")
            else:
                # 파일을 안 남긴다 → 다음 실행에서 재시도
                log(f"  [{i}/{len(todo)}] {info.get('name','')[:34]} → {status}, 재시도 대기")

            if i % 25 == 0:
                el = time.time() - t0
                log(f"  --- {i}곳 / {el/60:.1f}분 / {el/i:.1f}초per곳 / "
                    f"리뷰 {rows_total} (태국어 {thai_total}) ---")

        ctx.close()

    el = time.time() - t0
    log(f"끝: {stats} | 리뷰 {rows_total} (태국어 {thai_total}) | {el/60:.1f}분")
    if stats["ok"] + stats["none"]:
        log(f"  곳당 {el/(stats['ok']+stats['none']):.1f}초")
    return 0


if __name__ == "__main__":
    sys.exit(main())
