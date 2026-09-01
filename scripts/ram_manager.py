"""
RAM-aware scraper manager.
여유 RAM 기준으로 브라우저를 띄우는 스크래퍼를 자동 pause/resume.

메모리를 실제로 먹는 것은 scraper.py 가 띄우는 chromium 이다(브라우저 1개당
약 450MB). 그래서 사다리에는 **지금 실제로 돌면서 브라우저를 띄우는 서비스**만
올린다. 여기 이름이 run/ 의 서비스 이름과 어긋나면 pause 호출이 아무 일도
하지 않는데 로그에는 여전히 "OK" 가 찍혀서, 여유 0.3GB 에서 아무것도 안 하고
OS 가 프로세스를 임의로 죽이게 둔다 — 2026-08-09 에 실제로 그 상태였다.
그래서 시작할 때 대상 존재 여부를 검증하고 로그로 남긴다.

끄는 순서는 "잃어도 되는 것부터". bangkok_clinics 는 이 레포의 핵심 파이프라인
이라 마지막이고, 그마저 꺼야 할 정도면 이미 OS 가 뭔가를 죽이고 있는 상황이다.
"""
from __future__ import annotations

import ctypes
import subprocess
import sys
import time
from pathlib import Path

CHECK_INTERVAL = 60   # 초
RESUME_STREAK  = 5    # resume 전에 여유가 연속으로 유지돼야 하는 틱 수 (=5분)

ROOT = Path(__file__).parent.parent
RUN  = ROOT / "run"

# pause 는 여유가 적은 순으로, resume 은 충분한 순으로 — 사이를 벌려 히스테리시스.
# 2026-09-01: bangkok_review 를 2.0 에서 1.2 로 내렸다. 사용자 지시 —
# "램을 1G 남길 때까지 쓰자". 2.0 은 이 머신에서 지나치게 보수적이라, 여유가
# 1.2~2.0 사이일 때 식당 스크래퍼를 멈춰 세워두고 메모리를 놀렸다.
#
# 1.0 이 아니라 1.2 인 이유: 이 파일 맨 위 주석이 기록하듯 여유 0.3GB 대에서는
# OS 가 프로세스를 임의로 죽인다(2026-08-09 실측). pause 판정과 실제 정지
# 사이에 한 틱(60초)이 있고 그 사이 브라우저가 더 뜰 수 있어, 바닥에서
# 0.9GB 는 남겨둬야 그 구간에 안 빠진다.
PAUSE_THRESHOLDS = [
    ("bangkok_review",         1.2),
    ("pattaya_review",         1.5),
    ("spa_review_pattaya",     1.5),
    ("dental_review_bangkok",  1.2),
    ("bangkok_clinics_review", 0.8),   # 핵심 파이프라인 — 마지막 수단
]
# resume 값은 이 머신이 실제로 도달하는 범위 안에 있어야 한다. 그렇지 않으면
# pause 는 걸리는데 resume 은 영원히 안 걸려서, "일시정지"가 사실상 영구정지가
# 된다. 되살리려면 사람이 run/<name>.disabled 를 지워주는 수밖에 없고, 그
# 사실이 로그 어디에도 안 남는다 — ram_manager 는 이미 꺼진 것으로 보고 매 틱
# "OK" 만 찍는다.
#
# bangkok_review 가 그 상태였다. pause 2.0 / resume 4.5 인데 이 머신은
# 브라우저 스크래퍼가 여럿 돌 때 2.0~2.6GB 대에서 산다. 2026-09-01 관측으로
# 25틱 연속 1.3~2.6GB, 4.5GB 는 한 번도 없었다. 그래서 한 번 2.0 밑으로
# 내려가면 다시는 못 올라왔다.
#
# 값을 고를 때 주의할 점: resume 은 pause 보다 "그 서비스가 실제로 쓰는 양"
# 이상 높아야 한다. bangkok_review 는 워커 2개로 브라우저 2개(약 1GB)를 문다.
# resume 을 2.8 로 두면 — 꺼진 상태에서 3.0 이 되어 resume, 켜자마자 2.0 으로
# 떨어져 다시 pause — 6분 주기로 진동하며 매번 진행 중이던 작업을 버린다.
# 3.2 면 켠 뒤에도 2.2 정도로 pause 선(2.0) 위에 남는다.
#
# pause 순서는 일부러 그대로 둔다 — 메모리가 모자라면 식당이 먼저 양보하는
# 우선순위 자체는 유효하다. 바꾸는 건 "여유가 생겼을 때 돌아올 수 있는가"뿐.
RESUME_THRESHOLDS = [
    ("bangkok_clinics_review", 2.5),
    ("dental_review_bangkok",  3.0),
    ("spa_review_pattaya",     3.5),
    ("pattaya_review",         3.5),
    ("bangkok_review",         2.4),
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


def _audit_targets() -> None:
    """사다리에 올린 이름이 실제 서비스와 맞는지 시작할 때 확인.

    watchdog 은 run/<name>.pid 를 쓰므로 그 파일이 한 번도 없었다는 건 이름이
    틀렸거나 없어진 서비스라는 뜻이다. 이게 조용히 어긋나 있으면 pause 가
    아무 일도 안 하면서 로그에는 정상으로 보인다.
    """
    names = [n for n, _ in PAUSE_THRESHOLDS]
    unknown = [n for n in names if not (RUN / f"{n}.pid").exists()
               and not (RUN / f"{n}.disabled").exists()]
    log(f"관리 대상 {len(names)}개: {', '.join(names)}")
    if unknown:
        log(f"⚠ run/ 에 흔적이 없는 대상 {len(unknown)}개 — 이름 확인 필요: "
            f"{', '.join(unknown)}")


def main():
    log("RAM manager 시작")
    _audit_targets()
    good_streak: dict[str, int] = {}
    while True:
        free = free_ram_gb()
        if free is None:
            log("[tick] 여유=? | 조회 실패, 이번 틱은 아무것도 안 함")
            time.sleep(CHECK_INTERVAL)
            continue
        actions = []

        # pause — 한 틱에 하나만. 여러 개를 한꺼번에 내리면 그 합만큼 RAM 이
        # 튀어올라 곧바로 resume 임계값을 넘고, 다음 틱에 도로 켜졌다가 다시
        # 말라붙는다. 하나 내리고 그 효과를 다음 틱에 재는 편이 낫다.
        for name, threshold in PAUSE_THRESHOLDS:
            if free < threshold and not is_paused(name):
                pause(name)
                actions.append(f"pause:{name}")
                break

        # resume — 여유가 임계값 위로 RESUME_STREAK 틱 연속 유지될 때만.
        # 한 번 넘겼다고 바로 켜면 스크래퍼가 브라우저를 띄우는 순간 다시
        # 말라서, 진동만 하고 진도는 안 나간다.
        if actions:
            good_streak.clear()
        else:
            for name, threshold in RESUME_THRESHOLDS:
                if not is_paused(name):
                    good_streak.pop(name, None)
                    continue
                if free > threshold:
                    good_streak[name] = good_streak.get(name, 0) + 1
                    if good_streak[name] >= RESUME_STREAK:
                        resume(name)
                        actions.append(f"resume:{name}")
                        good_streak.pop(name, None)
                        break   # 켠 효과도 마찬가지로 다음 틱에 잰다
                else:
                    good_streak.pop(name, None)

        status = f"여유={free:.1f}GB" + (f" | {','.join(actions)}" if actions else " | OK")
        log(f"[tick] {status}")
        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
