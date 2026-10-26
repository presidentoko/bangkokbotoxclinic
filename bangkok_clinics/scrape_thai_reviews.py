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

## 왜 감시자가 필요한가 (2026-10-26 실측)

첫 런이 35곳째에서 **9분 넘게 조용히 멈췄다.** 프로세스는 살아 있고 메모리도
2.0GB 여유였으니 OOM 이 아니라, playwright 호출이 `set_default_timeout` 을 지키지
않은 것이다 (크롬 렌더러가 먹히면 그렇게 된다). 곳당 데드라인이 없으면 한 곳이
9시간 런 전체를 세우고, 무인 실행이므로 아무도 모른다.

그래서 두 층이다:
- **워커**: 곳당 DEADLINE 을 넘기면 감시 스레드가 `os._exit` 한다. CSV 쓰기는
  `os.replace` 라 원자적이므로 강제 종료가 파일을 깨지 않는다.
- **감시자**(`--supervise`): 워커를 배치 단위로 다시 띄운다. 큐 선두가 두 번
  연속 진행을 못 만들면 그 곳에 `_hung` 표시를 달아 큐에서 뺀다 — 안 그러면
  같은 곳을 영원히 재시도한다.
"""
from __future__ import annotations

import csv
import json
import os
import re
import subprocess
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PROFILE = ROOT / ".secrets" / "gmaps_profile"
MAPPING = ROOT / "apify_inputs" / "dental_thai_reviews" / "chij_to_clinic.json"
OUT_DIR = ROOT / "dental_output" / "reviews_th"
HUNG_DIR = OUT_DIR / "_hung"
GONE_DIR = OUT_DIR / "_gone"   # place_id 가 구글에서 안 풀리는 곳
LOG_PATH = ROOT / "logs" / "dental_thai_reviews.log"

# 곳당 상한. 정상은 13~20초이므로 90초는 "확실히 걸렸다"는 뜻이다.
DEADLINE_SEC = int(os.environ.get("TH_DEADLINE", "90"))
# 감시자가 워커 한 번에 맡기는 곳 수. 작게 하면 크롬이 자주 새로 뜨고(메모리에
# 좋다) 걸렸을 때 잃는 시간도 짧다.
BATCH = int(os.environ.get("TH_BATCH", "40"))

HL = "th"
# 8개를 길이로 고르는 게 하류 처방이므로(dental 깊이 작업) 40건이면 충분하다.
# Apify 입력도 maxReviews=30 이었다.
TARGET_REVIEWS = int(os.environ.get("TH_TARGET_REVIEWS", "40"))
MAX_SCROLLS = int(os.environ.get("TH_MAX_SCROLLS", "14"))
RESTART_EVERY = int(os.environ.get("TH_RESTART_EVERY", "12"))
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
        # 이 기계는 여유 메모리가 1~3GB 뿐이고 다른 스크래퍼가 같이 돈다. 기본
        # 설정의 크롬이 1.8GB 를 쓰면 남의 작업을 죽인다. 렌더러 수와 JS 힙을
        # 묶는다 — 리뷰 패널 하나만 읽으므로 탭이 여러 개일 필요가 없다.
        args=[
            "--disable-blink-features=AutomationControlled",
            "--renderer-process-limit=2",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-background-networking",
            "--disable-features=Translate,MediaRouter,OptimizationHints",
            "--js-flags=--max-old-space-size=192",
        ],
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
    """(status, rows). status: ok | none | limited | gone | error"""
    url = f"https://www.google.com/maps/place/?q=place_id:{chij}&hl={HL}"

    # place_id 가 안 풀리면 구글은 지도 홈 `/maps/place//@lat,lng` 으로 떨어진다.
    # 리스팅이 삭제·병합된 경우가 대부분이지만 일시적일 수도 있어 한 번 더 본다.
    # scraper.py 에도 같은 신호의 재시도가 있는데 로그인 모드에서는 꺼져 있다
    # (scraper.py:915 의 `and not config.GMAPS_PROFILE`).
    #
    # URL 을 고정 대기 후에 읽으면 안 된다 — 리다이렉트가 SPA 라서 3초로는 아직
    # 원본 `?q=place_id:` 인 채라, 소멸한 곳이 "F7nice 없음"=error 로 잘못 분류됐다.
    # 평점 블록이 나타날 때까지 기다리고, 안 나타나면 그때 URL 로 판정한다.
    rating = None
    for attempt in (1, 2):
        pg.goto(url, wait_until="domcontentloaded")
        try:
            el = pg.wait_for_selector("div.F7nice", timeout=12000)
            rating = el.inner_text() if el else None
        except Exception:  # noqa: BLE001  — 타임아웃이면 아래에서 URL 로 판정
            rating = None
        if rating:
            break
        if "/maps/place//" in pg.url and attempt == 2:
            return "gone", []
        time.sleep(2)
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


def load_mapping() -> dict:
    return json.load(open(MAPPING, encoding="utf-8"))


def queue(mapping: dict) -> list[str]:
    """아직 없고, 걸린 곳으로 격리되지도 않은 것."""
    return [
        c for c in sorted(mapping)
        if not (OUT_DIR / f"{c}.csv").exists()
        and not (HUNG_DIR / c).exists()
        and not (GONE_DIR / c).exists()
    ]


class Deadline:
    """곳당 상한을 넘기면 프로세스를 끝낸다.

    `os._exit` 을 쓴다 — 예외를 던져봐야 playwright 가 블록된 상태라 받을 주체가
    없고, 정상 종료를 시도하면 그 종료가 또 블록된다. CSV 는 os.replace 로만
    쓰므로 이 시점에 깨질 파일이 없다. 감시자가 다시 띄운다.
    """

    def __init__(self, seconds: int):
        self.seconds = seconds
        self.what = ""
        self.started = 0.0
        self._stop = threading.Event()
        self._t = threading.Thread(target=self._loop, daemon=True)

    def start(self) -> None:
        self._t.start()

    def begin(self, what: str) -> None:
        self.what = what
        self.started = time.time()

    def end(self) -> None:
        self.started = 0.0

    def _loop(self) -> None:
        while not self._stop.wait(5):
            s = self.started
            if s and time.time() - s > self.seconds:
                log(f"  !! {self.what} 가 {self.seconds}초를 넘겼다 — 프로세스 종료, 감시자가 재시작")
                sys.stdout.flush()
                os._exit(4)


def supervise() -> int:
    """워커를 배치 단위로 다시 띄우고, 걸린 곳을 격리한다."""
    mapping = load_mapping()
    HUNG_DIR.mkdir(parents=True, exist_ok=True)
    strikes: dict[str, int] = {}
    log("=" * 60)
    log(f"감시 모드: 배치 {BATCH}곳, 곳당 상한 {DEADLINE_SEC}초")

    while True:
        q = queue(mapping)
        if not q:
            log(f"감시 종료: 남은 곳 0 (완료 {len(mapping) - len(list(HUNG_DIR.glob('*')))}, "
                f"격리 {len(list(HUNG_DIR.glob('*')))})")
            return 0
        head = q[0]
        # 워커가 걸려 죽어도 배치 전체 시간은 상한 × 곳수 안에 들어온다.
        timeout = DEADLINE_SEC * min(BATCH, len(q)) + 120
        try:
            subprocess.run(
                [sys.executable, "-I", str(Path(__file__).resolve()),
                 "--worker", "--limit", str(BATCH)],
                timeout=timeout, cwd=str(ROOT),
            )
        except subprocess.TimeoutExpired:
            log(f"  !! 워커가 배치 상한 {timeout}초를 넘겼다 — 강제 정리")
            kill_stale_profile_chrome()

        left = queue(mapping)
        if len(left) == len(q):
            strikes[head] = strikes.get(head, 0) + 1
            log(f"  진행 0 — {head} ({mapping[head].get('name','')[:30]}) strike {strikes[head]}")
            if strikes[head] >= 2:
                # 같은 곳을 영원히 재시도하면 큐가 영원히 안 비운다.
                (HUNG_DIR / head).write_text(
                    f"{time.strftime('%Y-%m-%d %H:%M:%S')} deadline\n", encoding="utf-8")
                log(f"  격리: {head} — 나머지를 계속한다")
        else:
            strikes.clear()


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    HUNG_DIR.mkdir(parents=True, exist_ok=True)
    GONE_DIR.mkdir(parents=True, exist_ok=True)
    LOG_PATH.parent.mkdir(exist_ok=True)

    if not PROFILE.is_dir():
        log(f"로그인 프로필 없음: {PROFILE}")
        return 2

    if "--supervise" in sys.argv:
        if not acquire_profile_lock():
            log("로그인 프로필을 다른 스크래퍼가 쓰는 중 — 종료")
            return 3
        # 자식 워커가 같은 잠금을 다시 잡을 수 없으므로 여기서 놓는다. 잠금의
        # 목적은 scraper.py 와의 동시 실행을 막는 것이고, 감시자가 살아 있는
        # 동안 워커는 한 번에 하나뿐이다.
        global _profile_lock_fh
        if _profile_lock_fh:
            _profile_lock_fh.close()
            _profile_lock_fh = None
        return supervise()

    if not acquire_profile_lock():
        log("로그인 프로필을 다른 스크래퍼가 쓰는 중 — 종료")
        return 3

    mapping = load_mapping()
    todo = queue(mapping)
    done_already = len(mapping) - len(todo)
    limit = LIMIT
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])
    if limit:
        todo = todo[:limit]
    log("=" * 60)
    log(f"태국어 리뷰 수집: 대상 {len(mapping)} | 기존 완료 {done_already} | 이번 큐 {len(todo)}")
    log(f"출력 {OUT_DIR}  (영어 CSV 는 건드리지 않음)")

    kill_stale_profile_chrome()
    stats = {"ok": 0, "none": 0, "limited": 0, "gone": 0, "error": 0}
    t0 = time.time()
    rows_total = 0
    thai_total = 0
    deadline = Deadline(DEADLINE_SEC)
    deadline.start()

    with sync_playwright() as pw:
        deadline.begin("브라우저 기동")
        ua = real_ua(pw)
        log(f"UA: {ua[:80]}")
        ctx = launch(pw, ua)
        pg = ctx.new_page()
        pg.route("**/*", _block_route)
        pg.set_default_timeout(25000)
        deadline.end()

        for i, chij in enumerate(todo, 1):
            info = mapping[chij]
            if i > 1 and (i - 1) % RESTART_EVERY == 0:
                # 크롬이 계속 자란다. 이 기계는 여유 메모리가 1~3GB 뿐이다.
                # 재시작 자체도 걸릴 수 있으므로 데드라인 안에서 한다.
                deadline.begin(f"[{i}] 브라우저 재시작")
                ctx.close()
                time.sleep(2)
                ctx = launch(pw, ua)
                pg = ctx.new_page()
                pg.route("**/*", _block_route)
                pg.set_default_timeout(25000)
                deadline.end()
                log(f"  [{i}] 브라우저 재시작")

            deadline.begin(f"[{i}/{len(todo)}] {chij}")
            try:
                status, rows = scrape_one(pg, chij)
            except Exception as e:  # noqa: BLE001
                status, rows = "error", []
                log(f"  [{i}/{len(todo)}] {chij} 예외: {str(e)[:100]}")
            finally:
                deadline.end()

            stats[status] += 1
            if status in ("ok", "none"):
                write_rows(chij, rows)
                rows_total += len(rows)
                th = sum(1 for r in rows if r["is_thai"] == "1")
                thai_total += th
                log(f"  [{i}/{len(todo)}] {info.get('name','')[:34]} "
                    f"→ {len(rows)}건 (태국어 {th})")
            elif status == "gone":
                # place_id 가 두 번 다 안 풀렸다. 재시도해도 같으므로 격리한다 —
                # 안 그러면 감시자가 이 곳에서 큐를 비우지 못한다. 사이트가 닫힌
                # 클리닉 페이지를 발행하고 있다는 뜻이기도 하니 따로 센다.
                GONE_DIR.mkdir(parents=True, exist_ok=True)
                (GONE_DIR / chij).write_text(
                    f"{time.strftime('%Y-%m-%d %H:%M:%S')}\t{info.get('name','')}\n",
                    encoding="utf-8")
                log(f"  [{i}/{len(todo)}] {info.get('name','')[:34]} → place_id 소멸, 격리")
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
