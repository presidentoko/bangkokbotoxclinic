"""스크래퍼 처리량 모니터.

매 60초 현재 활성 `*_clinics_review.log` 또는 `*_review.log`의 최근 1분 윈도우를 파싱해서
review 처리율 / VPN rotate / F7nice 실패 / "can't reach" 빈도를 집계.
`logs/throughput.log`에 한 줄씩 append. watchdog 600s kick보다 빠른 정체 감지.

활성 로그 = `run/*_review.pid`에 대응되는 로그 중 가장 최근에 수정된 것.
없으면 mtime 기준 가장 최근 review 로그로 fallback.

watchdog Service로 등록되면 알아서 재시작됨.
"""
from __future__ import annotations

import re
import time
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOG_DIR = ROOT / "logs"
RUN_DIR = ROOT / "run"
LOG_OUT = LOG_DIR / "throughput.log"

WINDOW_SEC = 60
# scraper.py 의 ROTATE_TIMEOUT_SEC 와 동일해야 cohort 매칭이 정확.
ROTATE_DEADLINE_SEC = 45
# rotate-fail cohort: 결과가 확정된 요청만 보려고 request 시각이
# [now - WINDOW - DEADLINE, now - DEADLINE] 인 cohort 를 본다.
TAIL_LINES = 5000  # cohort scan(≈105s) + per-min window 모두 cover


def active_review_log() -> Path | None:
    """현재 활성 review 스크래퍼 로그를 찾는다.

    1순위: `run/*_review.pid`가 있는 서비스 중 로그 mtime 가장 최근.
    2순위: `logs/*_review.log` 중 mtime 가장 최근 (pid 없어도 watchdog가 재시작 사이에 있을 수 있음).
    """
    if RUN_DIR.exists():
        candidates: list[Path] = []
        for pid_file in RUN_DIR.glob("*_review.pid"):
            log_path = LOG_DIR / f"{pid_file.stem}.log"
            if log_path.exists():
                candidates.append(log_path)
        if candidates:
            return max(candidates, key=lambda p: p.stat().st_mtime)
    review_logs = list(LOG_DIR.glob("*_review.log"))
    if review_logs:
        return max(review_logs, key=lambda p: p.stat().st_mtime)
    return None

TS_RE = re.compile(r"^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})")
PAT_REVIEW_DONE = re.compile(r"✓ \[\d+\].*처리율")
PAT_VPN_ROTATE_REQ = re.compile(r"VPN rotate 요청 \(idx=(\d+)")
PAT_VPN_ROTATE_OK = re.compile(r"VPN rotated idx=(\d+) ")
PAT_VPN_ROTATE_TIMEOUT = re.compile(r"VPN rotate idx=(\d+) 타임아웃")
PAT_F7NICE_FAIL = re.compile(r"F7nice 미로드")
PAT_NO_INTERNET = re.compile(r"can't reach the internet")
PAT_SKIP_LOW_REVIEWS = re.compile(r"건너뜀 \(리뷰 \d+개")
PAT_RETRY = re.compile(r"#\d+ 시작 \(try [2-9]\)")


def tail(path: Path, n: int) -> list[str]:
    """파일 끝 N 줄 빠르게 (UTF-8). 없으면 빈 리스트."""
    if not path.exists():
        return []
    with path.open("rb") as f:
        f.seek(0, 2)
        size = f.tell()
        block = 8192
        buf = b""
        pos = size
        while pos > 0 and buf.count(b"\n") <= n:
            read = min(block, pos)
            pos -= read
            f.seek(pos)
            buf = f.read(read) + buf
        text = buf.decode("utf-8", errors="replace")
    return text.splitlines()[-n:]


def parse_ts(line: str) -> datetime | None:
    m = TS_RE.match(line)
    if not m:
        return None
    try:
        return datetime.strptime(m.group(1), "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None


def collect(now: datetime, log_in: Path | None) -> dict[str, int | float | str]:
    """최근 1분 카운트 + rotate-cohort 매칭.

    rotate_fail_pct 분모/분자 cohort 정렬:
      - request 시각이 [now - WINDOW - DEADLINE, now - DEADLINE] 에 속하면
        해당 요청은 지금 시점에 이미 success/timeout 으로 확정됐어야 함.
      - 같은 idx 의 다음 OK/TIMEOUT 이벤트로 FIFO 매칭 → 같은 cohort 의
        분자/분모만 계산되어 100% 초과가 더이상 나오지 않음.
    """
    cutoff = now - timedelta(seconds=WINDOW_SEC)
    cohort_start = now - timedelta(seconds=WINDOW_SEC + ROTATE_DEADLINE_SEC)
    cohort_end = now - timedelta(seconds=ROTATE_DEADLINE_SEC)
    counts: dict[str, int | float | str] = {
        "review_done": 0,
        "vpn_rotate_req": 0,
        "rotate_resolved": 0,
        "rotate_resolved_timeout": 0,
        "f7nice_fail": 0,
        "no_internet": 0,
        "skip_low_reviews": 0,
        "retry": 0,
        "lines_in_window": 0,
    }
    if log_in is None:
        return counts

    rotate_events: list[tuple[datetime, str, int]] = []
    scan_cutoff = cohort_start
    for line in tail(log_in, TAIL_LINES):
        ts = parse_ts(line)
        if ts is None or ts < scan_cutoff:
            continue
        # 1분 윈도우 카운터 (rate 표시용)
        if ts >= cutoff:
            counts["lines_in_window"] += 1
            if PAT_REVIEW_DONE.search(line):
                counts["review_done"] += 1
            if PAT_VPN_ROTATE_REQ.search(line):
                counts["vpn_rotate_req"] += 1
            if PAT_F7NICE_FAIL.search(line):
                counts["f7nice_fail"] += 1
            if PAT_NO_INTERNET.search(line):
                counts["no_internet"] += 1
            if PAT_SKIP_LOW_REVIEWS.search(line):
                counts["skip_low_reviews"] += 1
            if PAT_RETRY.search(line):
                counts["retry"] += 1
        # cohort 매칭용 idx 이벤트 (REQ / OK / TIMEOUT)
        m = PAT_VPN_ROTATE_REQ.search(line)
        if m:
            rotate_events.append((ts, "REQ", int(m.group(1))))
            continue
        m = PAT_VPN_ROTATE_OK.search(line)
        if m:
            rotate_events.append((ts, "OK", int(m.group(1))))
            continue
        m = PAT_VPN_ROTATE_TIMEOUT.search(line)
        if m:
            rotate_events.append((ts, "TIMEOUT", int(m.group(1))))

    # idx 별 FIFO 큐로 REQ ↔ OK/TIMEOUT 매칭.
    pending: dict[int, list[datetime]] = {}
    for ts, kind, idx in rotate_events:
        if kind == "REQ":
            pending.setdefault(idx, []).append(ts)
        else:
            q = pending.get(idx)
            if not q:
                continue  # cohort 시작 전에 떨어진 stray 해소 — 무시
            req_ts = q.pop(0)
            if cohort_start <= req_ts < cohort_end:
                counts["rotate_resolved"] += 1
                if kind == "TIMEOUT":
                    counts["rotate_resolved_timeout"] += 1
    return counts


def format_line(now: datetime, c: dict[str, int | float | str], src: str) -> str:
    rd = c["review_done"]
    resolved = c["rotate_resolved"]
    if resolved:
        pct_str = f"{100 * c['rotate_resolved_timeout'] / resolved:.1f}%"
    else:
        pct_str = "n/a"
    return (
        f"[{now:%H:%M:%S}] "
        f"src={src} "
        f"review_rate={rd}/min "
        f"vpn_rotate={c['vpn_rotate_req']}/min "
        f"vpn_rotate_fail_pct={pct_str} "
        f"rotate_resolved={resolved} "
        f"f7nice_fail={c['f7nice_fail']} "
        f"no_internet={c['no_internet']} "
        f"skip_low={c['skip_low_reviews']} "
        f"retry={c['retry']} "
        f"lines_in_window={c['lines_in_window']}"
    )


def main() -> int:
    LOG_OUT.parent.mkdir(parents=True, exist_ok=True)
    print(f"throughput_monitor 시작 — auto-detect active *_review.log → {LOG_OUT.name} (window={WINDOW_SEC}s)")
    while True:
        now = datetime.now()
        log_in = active_review_log()
        src = log_in.name if log_in else "none"
        c = collect(now, log_in)
        line = format_line(now, c, src)
        print(line, flush=True)
        with LOG_OUT.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
        time.sleep(WINDOW_SEC)


if __name__ == "__main__":
    import sys
    sys.exit(main() or 0)
