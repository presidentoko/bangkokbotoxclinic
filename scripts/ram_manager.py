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

import ctypes
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


class _MEMORYSTATUSEX(ctypes.Structure):
    _fields_ = [
        ("dwLength", ctypes.c_ulong),
        ("dwMemoryLoad", ctypes.c_ulong),
        ("ullTotalPhys", ctypes.c_ulonglong),
        ("ullAvailPhys", ctypes.c_ulonglong),
        ("ullTotalPageFile", ctypes.c_ulonglong),
        ("ullAvailPageFile", ctypes.c_ulonglong),
        ("ullTotalVirtual", ctypes.c_ulonglong),
        ("ullAvailVirtual", ctypes.c_ulonglong),
        ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
    ]


def free_ram_gb() -> float | None:
    """여유 물리 RAM(GB). 알 수 없으면 None.

    GlobalMemoryStatusEx 직접 호출 — wmic 은 Windows 11 에서 폐기 예정인 데다
    서브프로세스라 정작 메모리가 말라 응답이 필요한 순간에 타임아웃이 났다.
    이 API 는 프로세스를 안 띄우므로 부하와 무관하게 즉시 답한다.
    """
    try:
        st = _MEMORYSTATUSEX()
        st.dwLength = ctypes.sizeof(_MEMORYSTATUSEX)
        if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(st)):
            return st.ullAvailPhys / 1024 ** 3
    except Exception:
        pass
    try:
        out = subprocess.check_output(
            ["wmic", "OS", "get", "FreePhysicalMemory", "/Value"],
            text=True, timeout=10,
            creationflags=0x08000000,
        )
        for line in out.splitlines():
            if "FreePhysicalMemory=" in line:
                return int(line.split("=")[1].strip()) / 1024 / 1024
    except Exception:
        pass
    # 예전엔 여기서 99.0 을 돌려줬다 — "잘못 kill 하느니 넉넉하다고 치자"는
    # 뜻이었지만, 99GB 는 모든 resume 임계값을 넘기므로 조회가 실패할 때마다
    # 일시정지된 스크래퍼를 전부 되살렸다. 실제로 여유 0.5GB 인 상태에서
    # 그렇게 됐다(2026-08-09 11:57 로그). 모르면 아무것도 하지 않는 게 맞다.
    return None


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
        if free is None:
            log("[tick] 여유=? | 조회 실패, 이번 틱은 아무것도 안 함")
            time.sleep(CHECK_INTERVAL)
            continue
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
