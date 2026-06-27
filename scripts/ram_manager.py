"""
RAM-aware scraper manager.
여유 RAM 기준으로 식당 스크래퍼를 자동 pause/resume.

우선순위 (나중에 꺼짐):
  1. bangkok_review  (16k items, 오래 걸림)
  2. pattaya_review  (소규모, 곧 끝남)

임계값:
  < 2.0 GB 여유 → bangkok_review pause
  < 1.5 GB 여유 → pattaya_review pause
  > 3.5 GB 여유 → pattaya_review resume
  > 4.5 GB 여유 → bangkok_review resume
"""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

CHECK_INTERVAL = 60   # 초

ROOT = Path(__file__).parent.parent
RUN  = ROOT / "run"

PAUSE_THRESHOLDS = [
    ("bangkok_review",  2.0),   # < 2.0 GB → pause
    ("pattaya_review",  1.5),   # < 1.5 GB → pause
]
RESUME_THRESHOLDS = [
    ("pattaya_review",  3.5),   # > 3.5 GB → resume
    ("bangkok_review",  4.5),   # > 4.5 GB → resume
]


def free_ram_gb() -> float:
    try:
        out = subprocess.check_output(
            ["wmic", "OS", "get", "FreePhysicalMemory", "/Value"],
            text=True, timeout=10,
            creationflags=0x08000000,
        )
        for line in out.splitlines():
            if "FreePhysicalMemory=" in line:
                kb = int(line.split("=")[1].strip())
                return kb / 1024 / 1024
    except Exception:
        pass
    return 99.0   # 오류 시 충분하다고 가정 (잘못 kill 방지)


def is_paused(name: str) -> bool:
    return (RUN / f"{name}.disabled").exists()


def is_done(name: str) -> bool:
    """review 자연 종료 여부 — 이미 끝난 것은 resume 시도 안 함."""
    pid_file = RUN / f"{name}.pid"
    if not pid_file.exists():
        return False
    # watchdog log에서 "review 자연 종료" 확인하는 대신,
    # 단순히 disabled 파일에 "자연 종료" 텍스트가 없는 경우에만 resume.
    # (watchdog이 chain으로 끈 것은 건드리지 않음)
    return False   # ram_manager가 끈 것은 항상 resume 대상


def pause(name: str):
    marker = RUN / f"{name}.disabled"
    if not marker.exists():
        marker.write_text("ram_manager")
        print(f"[RAM] pause {name} (여유 RAM 부족)", flush=True)


def resume(name: str):
    marker = RUN / f"{name}.disabled"
    if marker.exists() and marker.read_text().strip() == "ram_manager":
        marker.unlink()
        print(f"[RAM] resume {name} (여유 RAM 충분)", flush=True)


def log(msg: str):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def main():
    log("RAM manager 시작")
    while True:
        free = free_ram_gb()
        actions = []

        # pause 체크
        for name, threshold in PAUSE_THRESHOLDS:
            if free < threshold and not is_paused(name):
                pause(name)
                actions.append(f"pause:{name}")

        # resume 체크
        for name, threshold in RESUME_THRESHOLDS:
            if free > threshold and is_paused(name):
                resume(name)
                actions.append(f"resume:{name}")

        status = f"여유={free:.1f}GB" + (f" | {','.join(actions)}" if actions else " | OK")
        log(f"[tick] {status}")
        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
