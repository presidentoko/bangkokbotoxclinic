"""스크래퍼 처리량 모니터.

매 60초 `logs/bangkok_clinics_review.log`의 최근 1분 윈도우를 파싱해서
review 처리율 / VPN rotate / F7nice 실패 / "can't reach" 빈도를 집계.
`logs/throughput.log`에 한 줄씩 append. watchdog 600s kick보다 빠른 정체 감지.

watchdog Service로 등록되면 알아서 재시작됨.
"""
from __future__ import annotations

import re
import time
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOG_IN = ROOT / "logs" / "bangkok_clinics_review.log"
LOG_OUT = ROOT / "logs" / "throughput.log"

WINDOW_SEC = 60
TAIL_LINES = 5000  # 1분 윈도우 충분 cover

TS_RE = re.compile(r"^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})")
PAT_REVIEW_DONE = re.compile(r"✓ \[\d+\].*처리율")
PAT_VPN_ROTATE_REQ = re.compile(r"VPN rotate 요청")
PAT_VPN_ROTATE_TIMEOUT = re.compile(r"VPN rotate idx=\d+ 타임아웃")
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


def collect(now: datetime) -> dict[str, int | float | str]:
    cutoff = now - timedelta(seconds=WINDOW_SEC)
    counts = {
        "review_done": 0,
        "vpn_rotate_req": 0,
        "vpn_rotate_timeout": 0,
        "f7nice_fail": 0,
        "no_internet": 0,
        "skip_low_reviews": 0,
        "retry": 0,
        "lines_in_window": 0,
    }
    for line in tail(LOG_IN, TAIL_LINES):
        ts = parse_ts(line)
        if ts is None or ts < cutoff:
            continue
        counts["lines_in_window"] += 1
        if PAT_REVIEW_DONE.search(line):
            counts["review_done"] += 1
        if PAT_VPN_ROTATE_REQ.search(line):
            counts["vpn_rotate_req"] += 1
        if PAT_VPN_ROTATE_TIMEOUT.search(line):
            counts["vpn_rotate_timeout"] += 1
        if PAT_F7NICE_FAIL.search(line):
            counts["f7nice_fail"] += 1
        if PAT_NO_INTERNET.search(line):
            counts["no_internet"] += 1
        if PAT_SKIP_LOW_REVIEWS.search(line):
            counts["skip_low_reviews"] += 1
        if PAT_RETRY.search(line):
            counts["retry"] += 1
    return counts


def format_line(now: datetime, c: dict[str, int | float | str]) -> str:
    rd = c["review_done"]
    rotate_fail_pct = (
        100 * c["vpn_rotate_timeout"] / c["vpn_rotate_req"] if c["vpn_rotate_req"] else 0.0
    )
    return (
        f"[{now:%H:%M:%S}] "
        f"review_rate={rd}/min "
        f"vpn_rotate={c['vpn_rotate_req']}/min "
        f"vpn_rotate_fail_pct={rotate_fail_pct:.1f}% "
        f"f7nice_fail={c['f7nice_fail']} "
        f"no_internet={c['no_internet']} "
        f"skip_low={c['skip_low_reviews']} "
        f"retry={c['retry']} "
        f"lines_in_window={c['lines_in_window']}"
    )


def main() -> int:
    LOG_OUT.parent.mkdir(parents=True, exist_ok=True)
    print(f"throughput_monitor 시작 — input={LOG_IN.name} → {LOG_OUT.name} (window={WINDOW_SEC}s)")
    while True:
        now = datetime.now()
        c = collect(now)
        line = format_line(now, c)
        print(line, flush=True)
        with LOG_OUT.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
        time.sleep(WINDOW_SEC)


if __name__ == "__main__":
    import sys
    sys.exit(main() or 0)
