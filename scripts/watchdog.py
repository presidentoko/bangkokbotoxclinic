"""
Windows 친화적 watchdog.

run.sh 의 bash watchdog 은 `kill -0 <pid>` 가 Git Bash 에서 Windows native PID 를
인식하지 못해서 항상 "죽음" 으로 오판 → 무한 재시작 cascade 가 됨.
이 스크립트는 `tasklist` 로 직접 확인.

대상:
  - nordvpn_runner    : 죽으면 즉시 재시작 (인프라)
  - bangkok_review    : 죽으면 재시작 (long-running)
  - pattaya_grid      : 죽으면 재시작 (단, "처리할 포인트 없음" 자연 종료면 멈춤)
  - pattaya_review    : 죽으면 재시작

자연 종료 감지:
  - 로그 마지막 30줄에 GRID_DONE_MARKER 가 있으면 grid 는 더 이상 재시작 안 함
  - review 는 자연 종료 마커가 모호하므로 항상 재시작 (큐 비면 워커가 idle 로 대기)

재시작 폭주 방지:
  - 60초 내 5회 이상 재시작되면 해당 항목 비활성 (수동 점검 필요)
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

_WNOW = 0x08000000  # CREATE_NO_WINDOW — 모든 subprocess 호출에 적용해 cmd 창 깜빡임 방지

ROOT = Path(__file__).parent.parent
RUN = ROOT / "run"
LOGS = ROOT / "logs"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

CHECK_INTERVAL = 10      # 초 (Tier1 업그레이드: 20→10)
MAX_RESTARTS_PER_MIN = 5

# _kill_stray_instances 가 안전하게 스캔해도 되는 스크립트 basename 집합.
# main() 에서 build_services() 직후 채워짐 — 정확히 서비스 1개만 쓰는
# 스크립트만 포함 (scraper.py/scraper_grid.py/price_sampler.py 등은 도시별로
# env_extra 만 다르고 동일 스크립트를 20개+ 서비스가 공유해서, basename 매칭으론
# 서로 다른 서비스의 정상 프로세스를 "stray"로 오인해 죽이는 교차살상이 발생함
# — 2026-07-17 사고: hair/dental/clinics review 8개 서비스가 서로를 25초마다
# taskkill 하며 전멸).
_STRAY_KILL_SAFE_SCRIPTS: set[str] = set()
CHROME_SOFT_LIMIT = 60   # 이 이상이면 chrome_heavy 서비스 재시작 보류
CHROME_HARD_LIMIT = 90   # 이 이상이면 chrome 전체 강제 kill
                         # (2026-07-07: 111개에서 RAM 2.7GB까지 고갈됐는데
                         #  구 임계 120이라 가드 미발동 → 하향)
GRID_DONE_MARKER = "처리할 포인트 없음. 종료."
REVIEW_DONE_MARKER = "수집 중단/완료 → 워커 정리"  # scraper.py가 큐 비면 graceful exit 직전에 찍는 라인
# pantip/scraper.py 종료 요약 라인. eligible 전부 이미 progress.json 에 ok 면
# ok=0 fail=0 으로 즉시 정상 종료 — 이걸 "죽음"으로 오판해 17~20초 간격
# 무한 재시작하는 사고가 있었음 (2026-07-19, RAM 압박 동반).
PANTIP_DONE_RE = re.compile(r"DONE: ok=(\d+) skip=(\d+) fail=(\d+) / total=(\d+)")

# scraper.py 메인 루프가 큐 고갈로 대기할 때 60초마다 찍는 라인.
# 이건 "정체"가 아니라 "할 일이 없어서 정상 종료를 카운트다운 중"이라는
# 살아있음의 증거다. progress 로 인정하지 않으면 watchdog 이 정상 종료보다
# 먼저 kick 해버려서 REVIEW_DONE_MARKER 가 영영 안 찍히고, 그 결과
# review_naturally_done() 이 도달 불가능해져 무한 재시작이 된다.
# (2026-08-07: massage_review_bangkok 이 이 구조로 5시간에 60회 재시작.
#  후보 1221개 중 신규 5개뿐인 사실상 완료된 서비스였는데, 성공 0 = 정체로
#  오판돼 매 사이클 크롬 2대를 새로 띄우고 있었다.)
IDLE_ALIVE_RE = re.compile(r"대기 중…")

# 그리드는 SOCKS 포트 2080 한 개를 공유 → 동시에 한 도시만 가동.
# 앞 도시가 자연 종료되면 다음 도시의 .disabled 마커 제거하여 깨움.
GRID_CHAIN = [
    # 클리닉 외국인 인기 순서 chain. Pattaya 끝나면 자동으로 다음 도시 진입.
    # 2026-07-13: bangkok_clinics_grid/review 둘 다 완전 종료(신규 처리 대상 0) 확인 후
    # 체인에서 제거 — grid가 영구 "자연 종료" 상태라 review에 .disabled 마커를 걸어도
    # 매 루프 체인 프로모션이 즉시 다시 벗겨내던 문제(끄고 싶어도 안 꺼짐) 해결.
    "pattaya_clinics_grid",
    "pattaya_clinics_review",
    "phuket_clinics_grid",
    "phuket_clinics_review",
    # 2026-07-18: chiang_mai/koh_samui/krabi/hua_hin clinics_grid 는 전부 이미
    # 자연 종료라, 체인에 남겨두면 review 에 .disabled 걸어도 다음 루프에
    # 즉시 다시 벗겨져 pattaya/phuket review 랑 5개 동시 가동 → chrome 102개로
    # ram-guard 전체 kill 트리거 (bangkok 제거 때와 동일한 문제, 62-64행 참고).
    # pattaya/phuket clinics_review 가 실제로 끝난 뒤 수동으로 재추가할 것 —
    # .disabled 마커는 run/ 에 남아있어 그때까지 안 깨어남.
]

# 로그 타임스탬프 패턴 세 종류 지원:
#  - scraper / telegram_monitor (logging 모듈): "YYYY-MM-DD HH:MM:SS,mmm [LEVEL] ..."
#  - nordvpn_runner (직접 print): "[HH:MM:SS] ..."
#  - ram_manager / chillanel_refresher / thaigle_refresher (직접 print):
#    "[YYYY-MM-DD HH:MM:SS] ..." — 대괄호 있는 전체 날짜시간. 기존
#    _LOG_TS_RE_FULL엔 대괄호가 없어서 이 세 서비스는 단 한 줄도 파싱된 적
#    없이 항상 stale=True로 판정되어 grace 끝나자마자 계속 킥당했음
#    (2026-07-24, 실측 로그로 확인 — 표면적으로는 진행 중처럼 보이는 로그도
#    파싱 실패하면 매치 0건과 동일하게 취급됨).
_LOG_TS_RE_FULL = re.compile(r"^\[?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]?")
_LOG_TS_RE_TIME = re.compile(r"^\[(\d{2}:\d{2}:\d{2})\]")


def parse_log_timestamp(line: str) -> float | None:
    m = _LOG_TS_RE_FULL.match(line)
    if m:
        try:
            return datetime.strptime(m.group(1), "%Y-%m-%d %H:%M:%S").timestamp()
        except ValueError:
            return None
    m = _LOG_TS_RE_TIME.match(line)
    if m:
        try:
            t = datetime.strptime(m.group(1), "%H:%M:%S").time()
            now = datetime.now()
            dt = now.replace(hour=t.hour, minute=t.minute, second=t.second, microsecond=0)
            # 미래로 보이면 어제 일자로 간주 (자정 롤오버)
            if dt > now:
                from datetime import timedelta
                dt -= timedelta(days=1)
            return dt.timestamp()
        except ValueError:
            return None
    return None


@dataclass
class Service:
    name: str
    cmd: list[str]                       # python 다음 인자 (cwd 기준)
    cwd: Path
    env_extra: dict[str, str]
    log_file: Path
    grid_done_check: bool = False        # 로그에 grid 자연 종료 마커 보면 비활성
    review_done_check: bool = False      # 로그에 review 자연 종료 마커 보면 비활성 (scraper.py 큐 빔)
    pantip_done_check: bool = False      # DONE 요약이 ok=0 fail=0 이면 (남은 미완료 항목 없음) 비활성

    # 진행률 health check — PID 살아있어도 실제 작업 진척 없으면 hang 으로 판정.
    # progress_pattern: 매 성공 작업마다 로그에 찍히는 패턴.
    # progress_stale_sec: 이 시간 동안 패턴 안 보이면 hang.
    # progress_grace_sec: 시작/재시작 후 이 시간은 progress 검사 면제.
    progress_pattern: re.Pattern | None = None
    progress_stale_sec: int = 300
    progress_grace_sec: int = 300

    # chrome_heavy=True인 서비스는 chrome 과부하 시 재시작 보류 (리뷰 스크래퍼 등 브라우저 多사용)
    chrome_heavy: bool = False

    restarts: list[float] = field(default_factory=list)
    disabled: bool = False
    disabled_reason: str = ""
    last_started_at: float = 0.0
    last_progress_kick_at: float = 0.0
    last_launcher_pid: int = 0

    @property
    def pid_file(self) -> Path:
        return RUN / f"{self.name}.pid"

    @property
    def disabled_marker(self) -> Path:
        return RUN / f"{self.name}.disabled"

    def is_paused(self) -> bool:
        """run/<name>.disabled 파일 있으면 watchdog 건너뜀 (수동 일시정지)."""
        return self.disabled_marker.exists()

    def _persist_disabled_marker(self) -> None:
        """자연 종료 상태를 파일로 영속화.
        2026-07-18: grid_naturally_done/review_naturally_done 은 in-memory
        s.disabled 만 세팅 — watchdog 프로세스가 재시작되면(하루 여러 번 발생)
        이 플래그가 초기화되어 이미 끝난 서비스가 되살아나 포트 재경합 발생
        (파타야/치앙마이/코사무이/크라비 clinics_review 가 며칠씩 0건 수확한 원인).
        마커 파일로 써두면 재시작 후에도 is_paused() 로 계속 걸러짐."""
        try:
            self.disabled_marker.write_text(self.disabled_reason, encoding="utf-8")
        except OSError:
            pass

    def get_pid(self) -> int | None:
        if not self.pid_file.exists():
            return None
        try:
            pid = int(self.pid_file.read_text().strip())
            return pid if pid > 0 else None
        except (ValueError, OSError):
            return None

    def is_alive(self) -> bool:
        pid = self.get_pid()
        if not pid:
            return False
        return _pid_alive(pid)

    def _grace_anchor(self) -> float:
        """progress 검사 grace 기간 기준 시각.
        watchdog 이 띄운 거면 last_started_at, 외부에서 띄워서 모르면 PID 파일 mtime."""
        if self.last_started_at > 0:
            return self.last_started_at
        try:
            return self.pid_file.stat().st_mtime
        except OSError:
            return 0

    def progress_stale(self) -> bool:
        """로그에 progress 패턴 마지막 출현이 progress_stale_sec 보다 오래됐으면 True."""
        if self.progress_pattern is None:
            return False
        now = time.time()
        # 방금 progress 때문에 죽인 거면 잠시 쿨다운
        if now - self.last_progress_kick_at < 90:
            return False
        # 시작/재시작 grace
        if now - self._grace_anchor() < self.progress_grace_sec:
            return False
        if not self.log_file.exists():
            return False
        try:
            with open(self.log_file, "rb") as f:
                f.seek(0, 2)
                size = f.tell()
                f.seek(max(0, size - 65536))
                tail = f.read().decode("utf-8", errors="replace")
        except OSError:
            return False
        # 뒤에서부터 매치 검색 — 파싱 안 되는 줄은 건너뛰고 계속.
        # progress 패턴뿐 아니라 "큐 고갈 대기" 라인도 살아있음으로 인정한다
        # (IDLE_ALIVE_RE 주석 참고). 둘 중 더 최근 것이 기준이 된다.
        for line in reversed(tail.splitlines()):
            if self.progress_pattern.search(line) or IDLE_ALIVE_RE.search(line):
                ts = parse_log_timestamp(line)
                if ts is None:
                    continue  # 다음 매치 시도
                return ts < (now - self.progress_stale_sec)
        # 64KB 안에 progress 패턴 0건 (혹은 모두 파싱 불가) → stale
        return True

    def kick(self, reason: str) -> bool:
        """진행 정체 등으로 강제 종료. PID 트리 통째로 죽이고 watchdog 다음 tick 에 부활."""
        pid = self.get_pid()
        if pid is None:
            return False
        log(f"[{self.name}] kick: {reason} (PID {pid} 트리 종료)")
        self.last_progress_kick_at = time.time()
        try:
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(pid)],
                stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, timeout=15,
                creationflags=_WNOW,
            )
        except (subprocess.SubprocessError, OSError):
            pass
        # launcher (parent) 도 같이 정리 — 외로워진 venv 런처 zombie 방지
        try:
            out = subprocess.check_output(
                ["wmic", "process", "where", f"ProcessId={pid}",
                 "get", "ParentProcessId", "/format:list"],
                stderr=subprocess.DEVNULL, text=True, timeout=10,
                creationflags=_WNOW,
            )
            for line in out.splitlines():
                line = line.strip()
                if line.startswith("ParentProcessId="):
                    parent = int(line.split("=", 1)[1])
                    if parent > 4:  # PID 4 는 System
                        subprocess.run(
                            ["taskkill", "/F", "/T", "/PID", str(parent)],
                            stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, timeout=10,
                            creationflags=_WNOW,
                        )
                    break
        except (subprocess.SubprocessError, OSError, ValueError):
            pass
        try:
            self.pid_file.unlink()
        except OSError:
            pass
        return True

    def grid_naturally_done(self) -> bool:
        if not self.grid_done_check or not self.log_file.exists():
            return False
        try:
            with open(self.log_file, "rb") as f:
                f.seek(0, os.SEEK_END)
                size = f.tell()
                back = min(size, 8192)
                f.seek(size - back)
                tail = f.read().decode("utf-8", errors="replace")
        except OSError:
            return False
        return any(GRID_DONE_MARKER in line for line in tail.splitlines()[-30:])

    def review_naturally_done(self) -> bool:
        """클리닉 review 워커가 큐 비워서 graceful exit 했는지. 16KB tail에 REVIEW_DONE_MARKER 보면 True."""
        if not self.review_done_check or not self.log_file.exists():
            return False
        try:
            with open(self.log_file, "rb") as f:
                f.seek(0, os.SEEK_END)
                size = f.tell()
                back = min(size, 16384)
                f.seek(size - back)
                tail = f.read().decode("utf-8", errors="replace")
        except OSError:
            return False
        return any(REVIEW_DONE_MARKER in line for line in tail.splitlines()[-50:])

    def pantip_naturally_done(self) -> bool:
        """pantip_scraper 가 이번 실행에서 새로 처리한 것도 실패한 것도 없이
        (ok=0, fail=0) 끝났는지 — eligible_clinics() 전부 이미 progress.json
        에 ok 로 기록돼 있어 할 일이 없다는 뜻. 새 clinic 이 master_db 에
        추가되면 사람이 run/pantip_scraper.disabled 를 지워서 재개해야 함
        (grid/review 자연 종료와 동일한 관례)."""
        if not self.pantip_done_check or not self.log_file.exists():
            return False
        try:
            with open(self.log_file, "rb") as f:
                f.seek(0, os.SEEK_END)
                size = f.tell()
                back = min(size, 8192)
                f.seek(size - back)
                tail = f.read().decode("utf-8", errors="replace")
        except OSError:
            return False
        for line in reversed(tail.splitlines()):
            m = PANTIP_DONE_RE.search(line)
            if m:
                ok, _skip, fail, _total = (int(x) for x in m.groups())
                return ok == 0 and fail == 0
        return False

    def _kill_stray_instances(self):
        """restart() 직전에 같은 스크립트를 실행 중인 python.exe 가 이미 떠있으면
        (PID 파일과 무관하게, launcher/worker 쌍 다 포함해) 죽인다. PID 파일이
        죽음으로 잘못 판정되거나 _resolve_worker_pid 가 엉뚱한 PID를 기록했을 때,
        이전 인스턴스가 살아있는 채로 새 인스턴스가 또 뜨는 경우 방지
        (2026-07-14: nordvpn_runner 가 이렇게 중복 실행되어 SOCKS 8포트가 두
        매니저에게 동시에 잡히면서 alive=0/8 전멸)."""
        script = Path(self.cmd[0]).name if self.cmd else ""
        if not script or script not in _STRAY_KILL_SAFE_SCRIPTS:
            return
        self_worker_pid = self.get_pid()
        for pid, ppid in _find_script_instances(script):
            # self_worker_pid 만으로 비교하면, _resolve_worker_pid 가 5초
            # 안에 진짜 워커 자식을 못 찾고 launcher_pid 로 fallback 했다가
            # (venv 런처는 자식 spawn 후 곧 종료되는 경우가 흔함) 그 launcher
            # 가 먼저 죽어버리면, 정상적으로 살아서 일하고 있는 진짜 워커가
            # "추적 불가한 stray"로 오인되어 taskkill 당하는 자멸 루프가 생김
            # (2026-07-17: hair_review/phuket_clinics_review 등 8개 서비스가
            # 시작하자마자 25초마다 킬당해 리뷰 수집이 전멸 상태였음).
            # 그래서 내 launcher 의 자식(ppid 매치)도 "나"로 인정해야 함.
            if pid == self_worker_pid or pid == self.last_launcher_pid or ppid == self.last_launcher_pid:
                continue
            log(f"[{self.name}] stray 인스턴스 발견 (PID {pid}) — 정리")
            try:
                subprocess.run(
                    ["taskkill", "/F", "/T", "/PID", str(pid)],
                    stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, timeout=15,
                    creationflags=_WNOW,
                )
            except (subprocess.SubprocessError, OSError):
                pass

    def restart(self) -> bool:
        self._kill_stray_instances()
        # 폭주 차단
        now = time.time()
        self.restarts = [t for t in self.restarts if now - t < 60]
        if len(self.restarts) >= MAX_RESTARTS_PER_MIN:
            self.disabled = True
            self.disabled_reason = f"60초 내 {len(self.restarts)}회 재시작 — 비활성"
            log(f"[{self.name}] {self.disabled_reason}")
            return False
        self.restarts.append(now)

        env = os.environ.copy()
        env.update(self.env_extra)
        env["PYTHONIOENCODING"] = "utf-8"

        # 로그 로테이션 — 장기 무인 운행 시 개별 로그가 100MB+ 로 비대해져
        # tail 기반 done-체크가 느려지고 디스크를 잠식. 재시작 시점에 50MB
        # 넘으면 .old 로 교체 (서비스당 최대 ~100MB 로 상한).
        try:
            if self.log_file.exists() and self.log_file.stat().st_size > 50 * 1024 * 1024:
                old = self.log_file.with_suffix(self.log_file.suffix + ".old")
                if old.exists():
                    old.unlink()
                self.log_file.rename(old)
        except OSError:
            pass

        log_f = open(self.log_file, "a", buffering=1, encoding="utf-8")
        log_f.write(f"\n=== watchdog 재시작 {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")

        # CREATE_NO_WINDOW: console 안 띄우는 백그라운드 (cmd 깜빡임 방지)
        # CREATE_NEW_PROCESS_GROUP: ctrl+c 등 부모 시그널 격리
        # CREATE_BREAKAWAY_FROM_JOB: schtasks/conhost 의 job 객체에서 분리되어 부모 죽어도 생존
        # BELOW_NORMAL_PRIORITY_CLASS: CPU 100% 지속시 OS가 자동 양보 → thermal shutdown 방지
        CREATE_NO_WINDOW = 0x08000000
        CREATE_NEW_PROCESS_GROUP = 0x00000200
        CREATE_BREAKAWAY_FROM_JOB = 0x01000000
        BELOW_NORMAL_PRIORITY_CLASS = 0x00004000
        creationflags = CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP | CREATE_BREAKAWAY_FROM_JOB | BELOW_NORMAL_PRIORITY_CLASS

        proc = subprocess.Popen(
            [str(VENV_PY)] + self.cmd,
            cwd=str(self.cwd),
            env=env,
            stdout=log_f,
            stderr=subprocess.STDOUT,
            creationflags=creationflags,
            close_fds=True,
        )

        # venv 런처는 system python 을 spawn 후 곧 종료될 수 있음.
        # 진짜 작업하는 system python child PID 를 찾아 그걸 추적.
        actual_pid = self._resolve_worker_pid(proc.pid)
        self.pid_file.write_text(str(actual_pid))
        self.last_started_at = time.time()
        self.last_launcher_pid = proc.pid
        log(f"[{self.name}] 재시작 launcher={proc.pid} worker={actual_pid}")
        return True

    @staticmethod
    def _resolve_worker_pid(launcher_pid: int) -> int:
        """venv 런처가 spawn 한 system python 자식 PID 찾기.
        주의: 런처는 python child 외에도 node.exe 같은 다른 자식을 띄울 수 있어서
        반드시 Name='python.exe' 필터 필수 (없으면 node 잡혀서 cascade).
        5초까지 대기. 못 찾으면 런처 PID 반환 (단순 스크립트 케이스 — 런처가 곧 워커)."""
        deadline = time.time() + 5.0
        while time.time() < deadline:
            try:
                out = subprocess.check_output(
                    ["wmic", "process", "where",
                     f"ParentProcessId={launcher_pid} and Name='python.exe'",
                     "get", "ProcessId", "/format:list"],
                    stderr=subprocess.DEVNULL, text=True, timeout=5,
                    creationflags=_WNOW,
                )
                for line in out.splitlines():
                    line = line.strip()
                    if line.startswith("ProcessId="):
                        try:
                            child = int(line.split("=", 1)[1])
                            if child > 0:
                                return child
                        except ValueError:
                            pass
            except (subprocess.SubprocessError, OSError):
                pass
            time.sleep(0.3)
        return launcher_pid


def _chrome_count() -> int:
    """현재 실행 중인 chrome-headless-shell 프로세스 수."""
    try:
        out = subprocess.check_output(
            ["tasklist", "/FI", "IMAGENAME eq chrome-headless-shell.exe", "/NH"],
            stderr=subprocess.DEVNULL, text=True, timeout=10, creationflags=_WNOW,
        )
        return sum(1 for ln in out.splitlines() if "chrome-headless-shell" in ln.lower())
    except (subprocess.SubprocessError, OSError):
        return 0


def _find_script_instances(script_name: str) -> list[tuple[int, int]]:
    """script_name 을 cmdline 에 포함한 python.exe 프로세스 (pid, ppid) 목록."""
    try:
        out = subprocess.check_output(
            ["wmic", "process", "where", "name='python.exe'",
             "get", "ProcessId,ParentProcessId,CommandLine", "/format:csv"],
            text=True, errors="replace", timeout=30,
        )
    except (subprocess.SubprocessError, OSError):
        return []
    found = []
    for line in out.splitlines():
        if script_name not in line:
            continue
        parts = line.rsplit(",", 2)  # CSV: Node,CommandLine,ParentProcessId,ProcessId 꼴
        try:
            ppid, pid = int(parts[-2]), int(parts[-1])
            found.append((pid, ppid))
        except (ValueError, IndexError):
            continue
    return found


def _singleton_guard() -> None:
    """watchdog 중복 실행 방지 — 이미 다른 인스턴스가 살아있으면 조용히 종료.

    2026-07-07 사고 재발방지: 수동 재시작 + 5분 주기 스케줄러가 겹치며
    watchdog 2개 → nordvpn_runner 10개 중복 → VPN 계정 동시연결 폭주로
    전 터널 붕괴. venv 런처(부모)와 그 워커(자식)는 한 쌍으로 취급."""
    me, my_parent = os.getpid(), os.getppid()
    for pid, ppid in _find_script_instances("watchdog.py"):
        if pid in (me, my_parent) or ppid in (me, my_parent):
            continue
        log(f"[싱글턴] 기존 watchdog(PID {pid}) 감지 — 이번 인스턴스(PID {me}) 종료")
        sys.exit(0)


def _validate_proxy_ports(services: list["Service"]) -> None:
    """모든 서비스의 프록시 포트가 nordvpn_runner 터널 범위 안인지 부팅 시 검증.

    2026-07-08~10 사고 재발방지: nordvpn --ports 를 16→8로 줄이면서
    dental(2090-2093)/hair(2092-2095) 리뷰가 리스너 없는 포트를 3일간
    두드려 수확 0. 범위 위반은 조용한 아사로 이어지므로 fail-fast."""
    vpn = next((s for s in services if s.name == "nordvpn_runner"), None)
    if not vpn:
        return
    try:
        n_ports = int(vpn.cmd[vpn.cmd.index("--ports") + 1])
        base = int(vpn.cmd[vpn.cmd.index("--base-port") + 1])
    except (ValueError, IndexError):
        log("[포트검증] nordvpn_runner cmd 파싱 실패 — 검증 스킵")
        return
    lo, hi = base, base + n_ports - 1
    bad: list[str] = []
    for s in services:
        env = s.env_extra or {}
        ranges: list[tuple[int, int]] = []
        if "PROXY_PORT_BASE" in env:
            b = int(env["PROXY_PORT_BASE"])
            n = int(env.get("N_WORKERS", "4"))
            ranges.append((b, b + n - 1))
        if "GRID_PROXY_PORT" in env:
            b = int(env["GRID_PROXY_PORT"])
            n = int(env.get("GRID_N_WORKERS", "4"))
            ranges.append((b, b + n - 1))
        if "HAIR_PROXY_PORT" in env:
            b = int(env["HAIR_PROXY_PORT"])
            ranges.append((b, b))
        for a, z in ranges:
            if a < lo or z > hi:
                bad.append(f"{s.name}: 포트 {a}-{z} — 터널 범위({lo}-{hi}) 밖")
    if bad:
        for line in bad:
            log(f"[포트검증] ❌ {line}")
        log(f"[포트검증] 리스너 없는 포트를 쓰는 서비스 {len(bad)}개 — 조용한 아사 방지 위해 watchdog 시작 거부. 포트 설정 수정 필요.")
        sys.exit(1)
    log(f"[포트검증] ✅ 전 서비스 프록시 포트가 터널 범위({lo}-{hi}) 내")


def _vpn_alive_count() -> int:
    """/tmp/vpn_status.json 기준 살아있는 터널 수. 읽기 실패 시 -1 (판단 보류)."""
    try:
        import tempfile
        data = json.loads((Path(tempfile.gettempdir()) / "vpn_status.json").read_text())
        return sum(1 for p in data.get("ports", []) if p.get("alive"))
    except Exception:
        return -1


def _kill_all_chrome():
    """chrome-headless-shell 전체 강제 종료 (좀비 포함)."""
    try:
        subprocess.run(
            ["taskkill", "/F", "/IM", "chrome-headless-shell.exe"],
            stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, timeout=15, creationflags=_WNOW,
        )
    except (subprocess.SubprocessError, OSError):
        pass


def _pid_alive(pid: int) -> bool:
    """Windows tasklist 기반 PID 체크."""
    try:
        out = subprocess.check_output(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            stderr=subprocess.DEVNULL, text=True, timeout=10,
            creationflags=_WNOW,
        )
    except (subprocess.SubprocessError, OSError):
        return False
    return bool(re.search(rf"\b{pid}\b", out))


def log(msg: str):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def build_services() -> list[Service]:
    bangkok_env = {
        "CITY_LAT": "13.7462890",
        "CITY_LNG": "100.5346890",
        "CITY_RADIUS_M": "30000",
        "CITY_OUTPUT_DIR": "output",
        "N_WORKERS": "2",
        "PROXY_PORT_BASE": "2080",
    }
    pattaya_env = {
        "CITY_LAT": "12.9236",
        "CITY_LNG": "100.8825",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../pattaya/output",
        "N_WORKERS": "2",
        "PROXY_PORT_BASE": "2082",
    }
    chiang_mai_env = {
        "CITY_LAT": "18.7883",
        "CITY_LNG": "98.9853",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../chiang_mai/output",
        # chiang_mai_review 추가하면서 phuket_review 와 기본 포트(2081~2085)가
        # 겹쳐 VPN 터널을 서로 뺏던 문제 → 전용 포트 배정 (2026-07-23 감사).
        "N_WORKERS": "2", "PROXY_PORT_BASE": "2084",
    }
    phuket_env = {
        "CITY_LAT": "7.8804",
        "CITY_LNG": "98.3923",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../phuket/output",
        "N_WORKERS": "2", "PROXY_PORT_BASE": "2086",
    }
    ayutthaya_env = {
        "CITY_LAT": "14.3532",
        "CITY_LNG": "100.5689",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../ayutthaya/output",
    }
    hua_hin_env = {
        "CITY_LAT": "12.5684",
        "CITY_LNG": "99.9577",
        "CITY_RADIUS_M": "12000",
        "CITY_OUTPUT_DIR": "../hua_hin/output",
    }
    krabi_env = {
        "CITY_LAT": "8.0863",
        "CITY_LNG": "98.9063",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../krabi/output",
    }
    koh_samui_env = {
        "CITY_LAT": "9.5018",
        "CITY_LNG": "99.9648",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../koh_samui/output",
    }
    chiang_rai_env = {
        "CITY_LAT": "19.9105",
        "CITY_LNG": "99.8406",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../chiang_rai/output",
    }
    khon_kaen_env = {
        "CITY_LAT": "16.4419",
        "CITY_LNG": "102.8359",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../khon_kaen/output",
    }
    korat_env = {
        "CITY_LAT": "14.9799",
        "CITY_LNG": "102.0978",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../korat/output",
    }
    hat_yai_env = {
        "CITY_LAT": "7.0084",
        "CITY_LNG": "100.4747",
        "CITY_RADIUS_M": "12000",
        "CITY_OUTPUT_DIR": "../hat_yai/output",
    }
    udon_thani_env = {
        "CITY_LAT": "17.4138",
        "CITY_LNG": "102.7872",
        "CITY_RADIUS_M": "12000",
        "CITY_OUTPUT_DIR": "../udon_thani/output",
    }
    bk_reviews = ROOT / "bangkok_reviews"
    bk_clinics = ROOT / "bangkok_clinics"
    for _city in (
        "chiang_mai", "phuket", "ayutthaya", "hua_hin", "krabi",
        "koh_samui", "chiang_rai", "khon_kaen", "korat", "hat_yai", "udon_thani",
    ):
        (ROOT / _city / "output" / "reviews").mkdir(parents=True, exist_ok=True)
    (bk_clinics / "output" / "reviews").mkdir(parents=True, exist_ok=True)
    # 도시별 클리닉 output 폴더 (식당 데이터와 분리). 외국인 인기 순서.
    for _city in ("pattaya", "phuket", "chiang_mai", "koh_samui", "krabi", "hua_hin"):
        (ROOT / _city / "clinics_output" / "reviews").mkdir(parents=True, exist_ok=True)

    # 도시별 클리닉 env. 외국인 인기 순서로 chain 자동 promotion 됨.
    # grid는 GRID_PROXY_PORT/GRID_N_WORKERS. review는 N_WORKERS/PROXY_PORT_BASE
    # 명시 — 전부 config.py 기본값(6워커·2082)에 맡기면 6개 도시가 전부 같은
    # 4개 포트에 몰려 워커 36개 겹침 (2026-07-12 chrome 과부하 원인) → 서비스별
    # 소수 워커 + 2080-2087 순환 분산으로 명시.
    pattaya_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "12.9236",
        "CITY_LNG": "100.8825",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../pattaya/clinics_output",
        # 2026-07-18: N_WORKERS=2 로 재기동할 때마다 브라우저 launch 가 영구 행
        # (chrome-headless-shell 자체가 안 뜸, node.exe 드라이버만 존재) — 포트를
        # dental_grid 안 겹치게 옮겨도 재발, N_WORKERS=1 로 낮춘 서비스들만 정상
        # 동작 확인됨 (Windows Playwright sync API 멀티스레드 launch 이슈로 추정).
        # 1워커로 낮춰서 확실히 진행되게 함 — 처리량은 줄지만 완전 정지보다 나음.
        "N_WORKERS": "1",
        "PROXY_PORT_BASE": "2080",
    }
    phuket_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "7.8804",
        "CITY_LNG": "98.3923",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../phuket/clinics_output",
        "N_WORKERS": "1",
        "PROXY_PORT_BASE": "2086",
    }
    chiang_mai_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "18.7883",
        "CITY_LNG": "98.9853",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../chiang_mai/clinics_output",
        "GRID_PROXY_PORT": "2080",
        "GRID_N_WORKERS": "4",
        # 2026-07-18: N_WORKERS=2 review 서비스가 launch 행 되는 문제 있어 1로 낮춤
        # (pattaya_clinics_env 주석 참고). 이 서비스는 아직 체인 대기 중이라
        # 시작 안 했지만 나중에 시작될 때 같은 문제 피하도록 미리 수정.
        "N_WORKERS": "1",
        "PROXY_PORT_BASE": "2085",
    }
    koh_samui_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "9.5018",
        "CITY_LNG": "99.9648",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../koh_samui/clinics_output",
        "GRID_PROXY_PORT": "2084",
        "GRID_N_WORKERS": "4",
        "N_WORKERS": "1",
        "PROXY_PORT_BASE": "2086",
    }
    krabi_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "8.0863",
        "CITY_LNG": "98.9063",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../krabi/clinics_output",
        "GRID_PROXY_PORT": "2084",
        "GRID_N_WORKERS": "4",
        "N_WORKERS": "1",
        "PROXY_PORT_BASE": "2081",
    }
    hua_hin_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "12.5684",
        "CITY_LNG": "99.9577",
        "CITY_RADIUS_M": "12000",
        "CITY_OUTPUT_DIR": "../hua_hin/clinics_output",
        "GRID_PROXY_PORT": "2084",
        "GRID_N_WORKERS": "4",
        "N_WORKERS": "1",
        "PROXY_PORT_BASE": "2084",
    }
    bangkok_clinics_env = {
        "SEARCH_QUERY": "clinic",
        # 2026-07-12: 13개 chrome_heavy 서비스가 동시 가동되며 워커 합계 66개 →
        # chrome-headless-shell 246개까지 폭증, ram-guard 하드리밋(90) 초과로
        # 7분마다 전체 kill → 재기동 스래싱 (throughput 사실상 0). 전 서비스
        # 워커를 1~3개로 줄이고 포트를 2080-2087 8개에 고르게 분산.
        "N_WORKERS": "3",
        "PROXY_PORT_BASE": "2080",
        "SEARCH_TAG": "en",
        "CITY_LAT": "13.7462890",
        "CITY_LNG": "100.5346890",
        "CITY_RADIUS_M": "30000",
        "CITY_OUTPUT_DIR": "output",
    }
    # 스파/웰니스 — 신규 버티컬 1호 (2026-07-23). 방콕부터, 완료되면
    # 요가/무에타이/쿠킹/코워킹/다이빙 순으로 확장 예정.
    # 우선순위 스왑 (2026-07-23): 식당은 후보가 너무 많아 오래 걸리니
    # 스파부터 먼저 끝내기로 함 — 식당 4개 서비스 전부 일시정지, VPN
    # 8포트 전부(2080~2087) 스파+마사지에 절반씩 할당해서 빠르게 처리.
    # "spa" 검색만으로는 카테고리가 Massage로만 잡히는 순수 마사지샵이
    # 안 걸릴 수 있어 "massage" 2차 쿼리 추가 (같은 output dir 공유,
    # SEARCH_TAG로 checkpoint만 분리 — dental 2-query 패턴과 동일).
    spa_bangkok_env = {
        "SEARCH_QUERY": "spa",
        "SEARCH_TAG": "spa_bangkok",
        "CITY_LAT": "13.7462890",
        "CITY_LNG": "100.5346890",
        "CITY_RADIUS_M": "30000",
        "CITY_OUTPUT_DIR": "../spa_output/bangkok",
        # 2026-08-07: 4→2. review 워커 1개당 chrome 약 4~5개가 붙어서, 방콕
        # spa+massage review 2개가 8워커를 돌리면 chrome 38~46개 / RAM 89%까지
        # 갔다(ram-guard 소프트리밋 60 상시 초과 → chrome_heavy 재시작이 계속
        # 보류됨). 하나를 통째로 끄는 대신 양쪽을 반으로 줄여서 두 파이프라인을
        # 다 살린다. 포트 점유도 2080-2083 → 2080-2081 로 줄어 터널 부하가 준다.
        "N_WORKERS": "2",
        "PROXY_PORT_BASE": "2080",
        # 그리드 단계는 review 아직 안 도는 동안 포트가 노는 게 아까워서
        # 2→3워커로 증설 (2026-07-23, RAM 여유 보고 절반만 증설 — 8개 풀로
        # 가면 chrome이 ram-guard 하드리밋 90 근처까지 가서 위험).
        "GRID_PROXY_PORT": "2080",
        "GRID_N_WORKERS": "2",
    }
    massage_bangkok_env = {
        "SEARCH_QUERY": "massage",
        "SEARCH_TAG": "massage_bangkok",
        "CITY_LAT": "13.7462890",
        "CITY_LNG": "100.5346890",
        "CITY_RADIUS_M": "30000",
        "CITY_OUTPUT_DIR": "../spa_output/bangkok",
        "N_WORKERS": "2",  # 2026-08-07: 4→2 (spa_bangkok_env 주석 참고). 2084-2085
        "PROXY_PORT_BASE": "2084",
        "GRID_PROXY_PORT": "2082",
        "GRID_N_WORKERS": "2",
    }

    # massage/spa 타 도시 확장 (2026-07-29) — 방콕과 완전히 동일한 패턴,
    # 좌표/반경만 기존 {city}_env 재사용. 기본 포트는 방콕 것과 그대로 겹침
    # (2080-2087) — 아직 순서를 못 받은 도시는 run/*.disabled로 꺼둔 채 대기.
    #
    # 2026-07-30: nordvpn_runner가 실제로는 --ports 10 (2080-2089)으로 뜨는데
    # 8포트(2080-2087)만 다들 나눠 쓰느라 2088-2089는 완전히 유휴 상태였음.
    # 파타야를 방콕과 "포트 나눠서 동시 진행"시키기로 하면서, 기존 8포트를
    # 재분배하는 대신 이 유휴 2포트를 파타야 전용으로 새로 배정 — 방콕/덴탈/
    # 헤어 등 이미 돌고 있는 어떤 서비스와도 안 겹침. spa_proxy_base 등
    # kwarg로 오버라이드 가능하게 해서, 다음 도시 차례 때도 이런 식으로
    # 유휴 포트를 찾아 지정할 수 있게 함 (기본값은 여전히 방콕과 충돌하는
    # 값이라 오버라이드 없이 켜면 위험 — 반드시 여유 포트 확인 후 지정할 것).
    def _spa_massage_env(
        city_tag: str, lat: str, lng: str, radius: str, out_dir: str,
        spa_proxy_base: str = "2080", spa_grid_port: str = "2080",
        massage_proxy_base: str = "2084", massage_grid_port: str = "2082",
        n_workers: str = "4", grid_n_workers: str = "2",
    ) -> tuple[dict, dict]:
        spa = {
            "SEARCH_QUERY": "spa", "SEARCH_TAG": f"spa_{city_tag}",
            "CITY_LAT": lat, "CITY_LNG": lng, "CITY_RADIUS_M": radius,
            "CITY_OUTPUT_DIR": out_dir,
            "N_WORKERS": n_workers, "PROXY_PORT_BASE": spa_proxy_base,
            "GRID_PROXY_PORT": spa_grid_port, "GRID_N_WORKERS": grid_n_workers,
        }
        massage = {
            "SEARCH_QUERY": "massage", "SEARCH_TAG": f"massage_{city_tag}",
            "CITY_LAT": lat, "CITY_LNG": lng, "CITY_RADIUS_M": radius,
            "CITY_OUTPUT_DIR": out_dir,
            "N_WORKERS": n_workers, "PROXY_PORT_BASE": massage_proxy_base,
            "GRID_PROXY_PORT": massage_grid_port, "GRID_N_WORKERS": grid_n_workers,
        }
        return spa, massage

    # 파타야 전용: 유휴 포트 2088(spa) / 2089(massage-grid). review는 spa/massage가
    # 같은 CITY_OUTPUT_DIR(candidate queue)을 공유하는 기존 방콕 패턴 그대로라
    # PROXY_PORT_BASE=2088 + N_WORKERS=2 로 2088-2089를 함께 씀 — 방콕 review
    # (2080-83/2084-87)와는 완전히 분리된 범위.
    spa_pattaya_env, massage_pattaya_env = _spa_massage_env(
        "pattaya", "12.9236", "100.8825", "20000", "../spa_output/pattaya",
        spa_proxy_base="2085", spa_grid_port="2085",
        massage_proxy_base="2085", massage_grid_port="2086",
        n_workers="2", grid_n_workers="1")
    spa_phuket_env, massage_phuket_env = _spa_massage_env(
        "phuket", "7.8804", "98.3923", "20000", "../spa_output/phuket")
    spa_chiang_mai_env, massage_chiang_mai_env = _spa_massage_env(
        "chiang_mai", "18.7883", "98.9853", "20000", "../spa_output/chiang_mai")
    spa_koh_samui_env, massage_koh_samui_env = _spa_massage_env(
        "koh_samui", "9.5018", "99.9648", "15000", "../spa_output/koh_samui")
    spa_hua_hin_env, massage_hua_hin_env = _spa_massage_env(
        "hua_hin", "12.5684", "99.9577", "12000", "../spa_output/hua_hin")
    spa_krabi_env, massage_krabi_env = _spa_massage_env(
        "krabi", "8.0863", "98.9063", "15000", "../spa_output/krabi")

    # progress 패턴 (각 서비스의 "실제 작업 진척" 시그널)
    PROG_REVIEW = re.compile(r"✓ \[\d+\].*처리율")  # scraper 한 건 완료 라인
    PROG_GRID   = re.compile(r"\| 결과 \d+ 신규 \d+")  # grid 한 점 처리 라인
    # nordvpn_runner 는 평소엔 조용함. 15분 주기 server fetch + READY 가 시그널.
    PROG_VPN    = re.compile(r"(READY|bootstrap 완료|서버 리스트 fetch)")
    # master_db builder: 5분마다 폴링/빌드 — "변경 없음 — 스킵" 또는 "재빌드 완료"
    PROG_MDB    = re.compile(r"(변경 없음|재빌드 완료|입력 변경)")

    return [
        # --ports 8 은 임의의 숫자가 아니라 NordVPN 계정의 동시접속 한도다.
        # 2026-08-06까지 10개(2080-2089)를 띄우고 있었는데, 한도를 2개 넘긴
        # 상태라 NordVPN이 초과분을 서버측에서 끊었다. 어느 터널이 끊길지는
        # 무작위여서 사망이 10개 포트에 고르게 퍼졌고(포트당 4-6회/시간),
        # "특정 서버가 불량"처럼 보였지만 실제로는 계정 레벨 신호였다. 그
        # 결과 review 스크래퍼가 ERR_PROXY_CONNECTION_FAILED /
        # ERR_SOCKS_CONNECTION_FAILED 로 실패율 60%대를 찍었다.
        #
        # 8보다 더 줄이려면 _validate_proxy_ports() 를 먼저 통과해야 한다 —
        # massage_* 20개 서비스가 PROXY_PORT_BASE=2084 + N_WORKERS=4 로
        # 2084-2087 을 쓰기 때문에, 7로 내리면 부팅이 거부된다(fail-fast).
        # 즉 8 은 "포트 재배정 없이 한도를 지킬 수 있는" 유일한 값이다.
        Service(
            name="nordvpn_runner",
            cmd=["nordvpn_runner.py", "--ports", "8", "--base-port", "2080",
                 "--auth", "nordvpn/auth.txt", "--proto", "mixed"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "nordvpn_runner.log",
            progress_pattern=PROG_VPN,
            progress_stale_sec=1500,  # 25분 (15분 fetch 한 번 놓치는 정도 허용)
            progress_grace_sec=120,
        ),
        Service(
            name="bangkok_review",
            cmd=["scraper.py"],
            cwd=bk_reviews,
            env_extra=bangkok_env,
            log_file=LOGS / "bangkok_review.log",
            chrome_heavy=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,   # 10분 (느린 작업 / VPN 회전 고려)
            progress_grace_sec=420,   # 7분 (cold start: 워커 부팅 + 첫 작업)
        ),
        Service(
            name="pattaya_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=pattaya_env,
            log_file=LOGS / "pattaya_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,   # 5분
            progress_grace_sec=180,
        ),
        Service(
            name="chiang_mai_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=chiang_mai_env,
            log_file=LOGS / "chiang_mai_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="phuket_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=phuket_env,
            log_file=LOGS / "phuket_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="ayutthaya_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=ayutthaya_env,
            log_file=LOGS / "ayutthaya_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="hua_hin_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=hua_hin_env,
            log_file=LOGS / "hua_hin_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="krabi_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=krabi_env,
            log_file=LOGS / "krabi_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="koh_samui_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=koh_samui_env,
            log_file=LOGS / "koh_samui_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="chiang_rai_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=chiang_rai_env,
            log_file=LOGS / "chiang_rai_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="khon_kaen_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=khon_kaen_env,
            log_file=LOGS / "khon_kaen_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="korat_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=korat_env,
            log_file=LOGS / "korat_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="hat_yai_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=hat_yai_env,
            log_file=LOGS / "hat_yai_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="udon_thani_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_reviews,
            env_extra=udon_thani_env,
            log_file=LOGS / "udon_thani_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            # 치과 전용 grid — 2워커(ports 2080-2081) × Bangkok only (B 옵션).
            # 클리닉 grid는 default(2082-2087)이라 포트 충돌 없음.
            # Bangkok 완료 시 dental_grid_runner 가 dental_review_bangkok.disabled 제거 → review 가동.
            name="dental_grid",
            cmd=["scripts/dental_grid_runner.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "dental_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            # Dental review scraper — bangkok_clinics/scraper.py 재사용.
            # Input: dental_output/bangkok/discovered_places.csv (grid 가 만든)
            # Output: dental_output/bangkok/clinics.csv + reviews/ (full review data)
            # 처음엔 .disabled 마커로 paused → dental_grid 가 Bangkok 끝내면 마커 제거 → 활성.
            name="dental_review_bangkok",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "dental",  # 메타데이터 — scraper.py 사용 안 함
                "SEARCH_TAG": "dental",
                "CITY_LAT": "13.7462890",
                "CITY_LNG": "100.5346890",
                "CITY_RADIUS_M": "30000",
                "CITY_OUTPUT_DIR": "../dental_output/bangkok",
                # 2026-07-12: 2080-2087 8포트에 분산 (기존 전 dental 서비스가
                # 2084 고정이라 워커 겹침의 주범이었음)
                # 2026-07-18: N_WORKERS=2 는 browser launch 영구 행 유발 확인 —
                # 1로 낮춤 (pattaya_clinics_env 주석 참고, 근본 원인은 포트가 아니라
                # Windows Playwright sync API 멀티스레드 launch 로 추정).
                "N_WORKERS": "1",
                "PROXY_PORT_BASE": "2082",
            },
            log_file=LOGS / "dental_review_bangkok.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="dental_review_pattaya",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "dental", "SEARCH_TAG": "dental",
                "CITY_LAT": "12.9236", "CITY_LNG": "100.8825", "CITY_RADIUS_M": "20000",
                "CITY_OUTPUT_DIR": "../dental_output/pattaya",
                "N_WORKERS": "1", "PROXY_PORT_BASE": "2086",
            },
            log_file=LOGS / "dental_review_pattaya.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="dental_review_chiang_mai",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "dental", "SEARCH_TAG": "dental",
                "CITY_LAT": "18.7883", "CITY_LNG": "98.9853", "CITY_RADIUS_M": "20000",
                "CITY_OUTPUT_DIR": "../dental_output/chiang_mai",
                # 2026-07-18: 실측 결과 포트 문제가 아니라 N_WORKERS=2 자체가
                # browser launch 영구 행 유발 (dental_review_bangkok 도 동일 증상,
                # candidate 0개인데도 chrome 프로세스 자체가 안 뜸). 1워커로 낮춤.
                "N_WORKERS": "1", "PROXY_PORT_BASE": "2084",
            },
            log_file=LOGS / "dental_review_chiang_mai.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="dental_review_phuket",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "dental", "SEARCH_TAG": "dental",
                "CITY_LAT": "7.8804", "CITY_LNG": "98.3923", "CITY_RADIUS_M": "20000",
                "CITY_OUTPUT_DIR": "../dental_output/phuket",
                "N_WORKERS": "1", "PROXY_PORT_BASE": "2081",
            },
            log_file=LOGS / "dental_review_phuket.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="dental_review_koh_samui",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "dental", "SEARCH_TAG": "dental",
                "CITY_LAT": "9.5018", "CITY_LNG": "99.9648", "CITY_RADIUS_M": "15000",
                "CITY_OUTPUT_DIR": "../dental_output/koh_samui",
                "N_WORKERS": "1", "PROXY_PORT_BASE": "2086",
            },
            log_file=LOGS / "dental_review_koh_samui.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="pattaya_review",
            cmd=["scraper.py"],
            cwd=bk_reviews,
            env_extra=pattaya_env,
            log_file=LOGS / "pattaya_review.log",
            chrome_heavy=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="chiang_mai_review",
            cmd=["scraper.py"],
            cwd=bk_reviews,
            env_extra=chiang_mai_env,
            log_file=LOGS / "chiang_mai_review.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="phuket_review",
            cmd=["scraper.py"],
            cwd=bk_reviews,
            env_extra=phuket_env,
            log_file=LOGS / "phuket_review.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="bangkok_clinics_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=bangkok_clinics_env,
            log_file=LOGS / "bangkok_clinics_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=180,   # Tier1: 300→180
            progress_grace_sec=120,   # Tier1: 180→120
        ),
        Service(
            name="bangkok_clinics_review",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=bangkok_clinics_env,
            log_file=LOGS / "bangkok_clinics_review.log",
            chrome_heavy=True,
            review_done_check=True,   # 큐 비면 자연 종료 → chain promotion (Pattaya로)
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_bangkok",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_bangkok_env,
            log_file=LOGS / "spa_grid_bangkok.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_bangkok",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_bangkok_env,
            log_file=LOGS / "spa_review_bangkok.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_bangkok",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_bangkok_env,
            log_file=LOGS / "massage_grid_bangkok.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_bangkok",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_bangkok_env,
            log_file=LOGS / "massage_review_bangkok.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_pattaya",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_pattaya_env,
            log_file=LOGS / "spa_grid_pattaya.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_pattaya",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_pattaya_env,
            log_file=LOGS / "spa_review_pattaya.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_pattaya",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_pattaya_env,
            log_file=LOGS / "massage_grid_pattaya.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_pattaya",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_pattaya_env,
            log_file=LOGS / "massage_review_pattaya.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_phuket",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_phuket_env,
            log_file=LOGS / "spa_grid_phuket.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_phuket",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_phuket_env,
            log_file=LOGS / "spa_review_phuket.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_phuket",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_phuket_env,
            log_file=LOGS / "massage_grid_phuket.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_phuket",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_phuket_env,
            log_file=LOGS / "massage_review_phuket.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_chiang_mai",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_chiang_mai_env,
            log_file=LOGS / "spa_grid_chiang_mai.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_chiang_mai",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_chiang_mai_env,
            log_file=LOGS / "spa_review_chiang_mai.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_chiang_mai",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_chiang_mai_env,
            log_file=LOGS / "massage_grid_chiang_mai.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_chiang_mai",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_chiang_mai_env,
            log_file=LOGS / "massage_review_chiang_mai.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_koh_samui",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_koh_samui_env,
            log_file=LOGS / "spa_grid_koh_samui.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_koh_samui",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_koh_samui_env,
            log_file=LOGS / "spa_review_koh_samui.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_koh_samui",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_koh_samui_env,
            log_file=LOGS / "massage_grid_koh_samui.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_koh_samui",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_koh_samui_env,
            log_file=LOGS / "massage_review_koh_samui.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_hua_hin",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_hua_hin_env,
            log_file=LOGS / "spa_grid_hua_hin.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_hua_hin",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_hua_hin_env,
            log_file=LOGS / "spa_review_hua_hin.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_hua_hin",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_hua_hin_env,
            log_file=LOGS / "massage_grid_hua_hin.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_hua_hin",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_hua_hin_env,
            log_file=LOGS / "massage_review_hua_hin.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="spa_grid_krabi",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=spa_krabi_env,
            log_file=LOGS / "spa_grid_krabi.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="spa_review_krabi",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=spa_krabi_env,
            log_file=LOGS / "spa_review_krabi.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="massage_grid_krabi",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=massage_krabi_env,
            log_file=LOGS / "massage_grid_krabi.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="massage_review_krabi",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=massage_krabi_env,
            log_file=LOGS / "massage_review_krabi.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="pattaya_clinics_grid",
            cmd=["scraper_grid.py"],
            cwd=bk_clinics,
            env_extra=pattaya_clinics_env,
            log_file=LOGS / "pattaya_clinics_grid.log",
            grid_done_check=True,
            progress_pattern=PROG_GRID,
            progress_stale_sec=300,
            progress_grace_sec=180,
        ),
        Service(
            name="pattaya_clinics_review",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra=pattaya_clinics_env,
            log_file=LOGS / "pattaya_clinics_review.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="phuket_clinics_grid",
            cmd=["scraper_grid.py"], cwd=bk_clinics, env_extra=phuket_clinics_env,
            log_file=LOGS / "phuket_clinics_grid.log",
            grid_done_check=True, progress_pattern=PROG_GRID,
            progress_stale_sec=300, progress_grace_sec=180,
        ),
        Service(
            name="phuket_clinics_review",
            cmd=["scraper.py"], cwd=bk_clinics, env_extra=phuket_clinics_env,
            log_file=LOGS / "phuket_clinics_review.log",
            chrome_heavy=True, review_done_check=True, progress_pattern=PROG_REVIEW,
            progress_stale_sec=600, progress_grace_sec=420,
        ),
        Service(
            name="chiang_mai_clinics_grid",
            cmd=["scraper_grid.py"], cwd=bk_clinics, env_extra=chiang_mai_clinics_env,
            log_file=LOGS / "chiang_mai_clinics_grid.log",
            grid_done_check=True, progress_pattern=PROG_GRID,
            progress_stale_sec=300, progress_grace_sec=180,
        ),
        Service(
            name="chiang_mai_clinics_review",
            cmd=["scraper.py"], cwd=bk_clinics, env_extra=chiang_mai_clinics_env,
            log_file=LOGS / "chiang_mai_clinics_review.log",
            chrome_heavy=True, review_done_check=True, progress_pattern=PROG_REVIEW,
            progress_stale_sec=600, progress_grace_sec=420,
        ),
        Service(
            name="koh_samui_clinics_grid",
            cmd=["scraper_grid.py"], cwd=bk_clinics, env_extra=koh_samui_clinics_env,
            log_file=LOGS / "koh_samui_clinics_grid.log",
            grid_done_check=True, progress_pattern=PROG_GRID,
            progress_stale_sec=300, progress_grace_sec=180,
        ),
        Service(
            name="koh_samui_clinics_review",
            cmd=["scraper.py"], cwd=bk_clinics, env_extra=koh_samui_clinics_env,
            log_file=LOGS / "koh_samui_clinics_review.log",
            chrome_heavy=True, review_done_check=True, progress_pattern=PROG_REVIEW,
            progress_stale_sec=600, progress_grace_sec=420,
        ),
        Service(
            name="krabi_clinics_grid",
            cmd=["scraper_grid.py"], cwd=bk_clinics, env_extra=krabi_clinics_env,
            log_file=LOGS / "krabi_clinics_grid.log",
            grid_done_check=True, progress_pattern=PROG_GRID,
            progress_stale_sec=300, progress_grace_sec=180,
        ),
        Service(
            name="krabi_clinics_review",
            cmd=["scraper.py"], cwd=bk_clinics, env_extra=krabi_clinics_env,
            log_file=LOGS / "krabi_clinics_review.log",
            chrome_heavy=True, review_done_check=True, progress_pattern=PROG_REVIEW,
            progress_stale_sec=600, progress_grace_sec=420,
        ),
        Service(
            name="hua_hin_clinics_grid",
            cmd=["scraper_grid.py"], cwd=bk_clinics, env_extra=hua_hin_clinics_env,
            log_file=LOGS / "hua_hin_clinics_grid.log",
            grid_done_check=True, progress_pattern=PROG_GRID,
            progress_stale_sec=300, progress_grace_sec=180,
        ),
        Service(
            name="hua_hin_clinics_review",
            cmd=["scraper.py"], cwd=bk_clinics, env_extra=hua_hin_clinics_env,
            log_file=LOGS / "hua_hin_clinics_review.log",
            chrome_heavy=True, review_done_check=True, progress_pattern=PROG_REVIEW,
            progress_stale_sec=600, progress_grace_sec=420,
        ),
        # ── 모발이식 전용 파이프라인 ──────────────────────────────────────────────
        # hair_direct_search → discovered_places.csv → hair_review_* → clinics.csv + reviews/
        # hair_data_builder → thaihairguide_master.csv → clinics.json → Vercel deploy
        Service(
            name="hair_grid",
            cmd=["scripts/hair_direct_search.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "hair_grid.log",
            grid_done_check=True,
            progress_stale_sec=1800,
            progress_grace_sec=300,
        ),
        Service(
            name="hair_review_bangkok",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "hair transplant clinic",
                "SEARCH_TAG": "hair",
                "CITY_LAT": "13.7462890",
                "CITY_LNG": "100.5346890",
                "CITY_RADIUS_M": "30000",
                "CITY_OUTPUT_DIR": "../hair_output/bangkok",
                "N_WORKERS": "1",
                "PROXY_PORT_BASE": "2085",
            },
            log_file=LOGS / "hair_review_bangkok.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="hair_review_phuket",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "hair transplant clinic",
                "SEARCH_TAG": "hair",
                "CITY_LAT": "7.8804",
                "CITY_LNG": "98.3923",
                "CITY_RADIUS_M": "20000",
                "CITY_OUTPUT_DIR": "../hair_output/phuket",
                "N_WORKERS": "1",
                "PROXY_PORT_BASE": "2080",
            },
            log_file=LOGS / "hair_review_phuket.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="hair_review_chiang_mai",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "hair transplant clinic",
                "SEARCH_TAG": "hair",
                "CITY_LAT": "18.7883",
                "CITY_LNG": "98.9853",
                "CITY_RADIUS_M": "20000",
                "CITY_OUTPUT_DIR": "../hair_output/chiang_mai",
                "N_WORKERS": "1",
                "PROXY_PORT_BASE": "2083",
            },
            log_file=LOGS / "hair_review_chiang_mai.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="hair_review_pattaya",
            cmd=["scraper.py"],
            cwd=bk_clinics,
            env_extra={
                "SEARCH_QUERY": "hair transplant clinic",
                "SEARCH_TAG": "hair",
                "CITY_LAT": "12.9236",
                "CITY_LNG": "100.8825",
                "CITY_RADIUS_M": "15000",
                "CITY_OUTPUT_DIR": "../hair_output/pattaya",
                "N_WORKERS": "1",
                "PROXY_PORT_BASE": "2086",
            },
            log_file=LOGS / "hair_review_pattaya.log",
            chrome_heavy=True,
            review_done_check=True,
            progress_pattern=PROG_REVIEW,
            progress_stale_sec=600,
            progress_grace_sec=420,
        ),
        Service(
            name="hair_data_builder",
            cmd=["scripts/hair_data_builder_loop.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "hair_data_builder.log",
            progress_pattern=re.compile(r"(완료|스킵|클리닉 →)"),
            progress_stale_sec=14400,   # 4h — 6h 주기 루프
            progress_grace_sec=300,
        ),
        Service(
            name="hair_done_watcher",
            cmd=["scripts/hair_done_watcher.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "hair_done_watcher.log",
            grid_done_check=True,
            progress_stale_sec=1800,
            progress_grace_sec=300,
        ),
        # ── 모발이식 파이프라인 끝 ──────────────────────────────────────────────
        Service(
            name="master_db_builder",
            cmd=["web/scripts/watch_and_build.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "master_db_builder.log",
            progress_pattern=PROG_MDB,
            progress_stale_sec=600,
            progress_grace_sec=120,
        ),
        Service(
            name="restaurants_db_builder",
            cmd=["web-restaurants/scripts/watch_and_build.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "restaurants_db_builder.log",
            progress_pattern=PROG_MDB,
            progress_stale_sec=600,
            progress_grace_sec=120,
        ),
        Service(
            name="hdmall_scraper",
            cmd=["hdmall_clinics/scraper.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "hdmall_scraper.log",
            progress_pattern=re.compile(r"\[hdmall\]"),
            # 2026-05-18: stale/grace 늘림. Stage 1 cold start (Playwright + 전체 surgery
            # 카탈로그 fetch) 가 길어 15min stale 내 [hdmall] 마커 못 찍고 watchdog kick
            # 받는 crashloop 발생. external_reviews 진척이 30분간 정체된 사례.
            progress_stale_sec=1800,  # 30min
            progress_grace_sec=1200,  # 20min cold start
        ),
        Service(
            name="auto_push_loop",
            cmd=["web/scripts/auto_push_loop.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "auto_push_loop.log",
            # 10분 주기라 stale 검사 무의미. PID 살아있는지만.
        ),
        Service(
            name="telegram_monitor",
            cmd=["telegram_monitor.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "telegram_monitor.log",
            # progress 패턴 없음 — telegram_monitor 는 조용히 polling 만 함.
            # PID 살아있는지만 검사.
        ),
        Service(
            name="clinic_bot",
            cmd=["clinic_bot.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "clinic_bot.log",
        ),
        Service(
            name="throughput_monitor",
            cmd=["scripts/throughput_monitor.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "throughput_monitor.log",
            progress_pattern=re.compile(r"review_rate=\d+/min"),
            progress_stale_sec=180,   # 60s 주기라 3분 안 찍히면 죽은 것
            progress_grace_sec=90,
        ),
        Service(
            # Pantip 클리닉 리뷰/언급 수집기. master_db 의 2933 eligible clinics 를
            # 검색 → 토픽 본문/댓글 추출 → 클리닉명 매칭 → 정확도 스코어 부여.
            # 결과: pantip/output/threads/, pantip/output/clinics/, pantip/state/progress.json
            # 자체 재시작 안전 (progress.json 으로 resume).
            name="pantip_scraper",
            cmd=["scraper.py"],
            cwd=ROOT / "pantip",
            env_extra={},
            log_file=LOGS / "pantip_scraper.log",
            # 클리닉당 ~30s 처리 — 진행 시그널: '[<clinic_id>] <name>' 라인
            progress_pattern=re.compile(r"\[0x[0-9a-f]+_0x[0-9a-f]+\] "),
            progress_stale_sec=600,    # 10분 안 찍히면 죽은 것 (대형 토픽 처리 + retry 고려)
            progress_grace_sec=180,
            pantip_done_check=True,    # eligible 전부 이미 ok 면 (ok=0 fail=0) 재시작 대신 비활성
        ),
        Service(
            name="ram_manager",
            cmd=["scripts/ram_manager.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "ram_manager.log",
            progress_pattern=re.compile(r"\[RAM\]|\[20\d\d-"),
            # 2026-07-24: 60초 tick인데도 180s/30s 마진으로 ~90초 간격
            # 재시작 루프 발견 (실측 시 최신 tick이 16~36초밖에 안 됐는데도
            # kick됨 — 정확한 레이스 원인은 특정 못함, chrome_heavy 다수 동시
            # 가동 중 CPU 경합/스케줄링 지연 추정). tick 주기(60s) 대비
            # 10배 마진으로 확대 — 다른 안정적 서비스들(PROG_VPN 등)과
            # 동일한 여유율 패턴.
            progress_stale_sec=600,
            progress_grace_sec=90,
        ),
        Service(
            # Health monitor — 무인 운영 중 시스템 상태 5분 주기로 체크/로깅.
            # pantip 진행률, 디스크, 핵심 PID, heartbeat 신선도.
            # logs/health.log + pantip/state/health_status.json
            name="health_monitor",
            cmd=["scripts/health_monitor.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "health_monitor.log",
            progress_pattern=re.compile(r"\[(OK|WARN|CRIT)"),
            progress_stale_sec=900,    # 5분 주기 → 15분 안 찍히면 죽은 것
            progress_grace_sec=120,
        ),
        Service(
            # Wiki summary generator — Gemini 2.5 Flash 무료 tier 로 양국어 요약 생성.
            # 클리닉당 ~4초 (API call + throttle). 1450 calls/day → 5095 clinics ≈ 4일.
            # 한도 도달 시 UTC 자정까지 자동 sleep. progress.json 으로 resume-safe.
            # 끝난 후엔 daemon 모드 (1h sleep) 로 새 클리닉 추가 시 처리.
            name="wiki_summary_gen",
            cmd=["wiki_generator/summary_generator.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "wiki_summary_gen.log",
            # 진행 시그널: "[<i>/<total>] <name>" 라인. ~4-8 초마다 한 줄.
            progress_pattern=re.compile(r"\[\d+/\d+\]\s+"),
            progress_stale_sec=1200,   # 20분 안 찍히면 죽은 것 (rate limit 백오프 + 일일 한도 sleep 고려)
            progress_grace_sec=120,
        ),
        Service(
            # web-thaigle 데이터 갱신기 — data.zip 변경 감지 → by-niche JSON 추출 → vercel --prod 배포.
            # 5분 주기 폴링. data.zip 이 바뀔 때만 배포 트리거.
            # progress 시그널: "[watcher] ✓ no change" 또는 "[refresh] ✓ Deployed"
            name="thaigle_refresher",
            cmd=["scripts/refresh_thaigle.py", "--watch", "--interval", "300"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "thaigle_refresher.log",
            progress_pattern=re.compile(r"\[watcher\]"),
            progress_stale_sec=900,   # 15분 안 찍히면 죽은 것 (5분 간격 × 3 = 여유)
            progress_grace_sec=120,
        ),
        Service(
            # chillanel 데이터 갱신기 — spa_output/bangkok/clinics.csv 변경 감지 →
            # build-data.mjs 재실행 → vercel --prod 배포. 5분 주기 폴링.
            # cmd 는 .mjs 스크립트라 VENV_PY(python) 로 직접 실행 불가 —
            # python -c 로 subprocess.call(['node', ...]) 를 감싸서 node 로 위임.
            name="chillanel_refresher",
            cmd=["-c", "import subprocess,sys; sys.exit(subprocess.call(['node', 'chillanel/scripts/refresh-and-deploy.mjs']))"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "chillanel_refresher.log",
            progress_pattern=re.compile(r"(감시 시작|배포 완료|변경 감지|변경 없음)"),
            progress_stale_sec=1500,
            progress_grace_sec=120,
        ),
        Service(
            # secondluxuryitems.com 주간 가격 샘플러 — Vestiaire Collective 검색 →
            # 2nd/data/items_db.json price_samples/price_ranges 갱신 → git push.
            # 스크립트 내부에서 168h(7일) sleep 루프 → 프로세스 상시 생존, watchdog은 PID만 감시.
            # interval_hours: 168 (weekly)
            name="price_sampler",
            cmd=["2nd/scraper/price_sampler.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "price_sampler.log",
            # 진행 시그널: "[price_sampler] run start ..."
            progress_pattern=re.compile(r"\[price_sampler\]"),
            progress_stale_sec=604800,  # 7일 (168h) — 한 사이클 안에 찍혀야 함
            progress_grace_sec=300,
        ),
        Service(
            # chicpreowned.com 주간 가격 샘플러 — Vestiaire USD → THB 환율 변환 →
            # 3rd/data/items_db.json price_samples/price_ranges 갱신 → git push.
            # 스크립트 내부에서 168h(7일) sleep 루프.
            name="price_sampler_chic",
            cmd=["3rd/scraper/price_sampler.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "price_sampler_chic.log",
            progress_pattern=re.compile(r"\[price_sampler_chic\]"),
            progress_stale_sec=604800,  # 7일
            progress_grace_sec=300,
        ),
    ]


def _promote_next_in_chain(services: list[Service]) -> bool:
    """앞 그리드가 자연 종료되면 다음 그리드의 .disabled 마커 제거하여 가동.
    True 반환 시 호출자는 heartbeat 트리거 권장."""
    by_name = {s.name: s for s in services}
    for prev_name, next_name in zip(GRID_CHAIN, GRID_CHAIN[1:]):
        prev = by_name.get(prev_name)
        nxt = by_name.get(next_name)
        if not prev or not nxt:
            continue
        if not (prev.disabled and "자연 종료" in prev.disabled_reason):
            continue
        if nxt.disabled and "자연 종료" in nxt.disabled_reason:
            continue  # next already done — don't re-enable
        if not nxt.is_paused():
            continue
        try:
            nxt.disabled_marker.unlink()
        except OSError:
            continue
        log(f"[chain] {prev_name} 자연 종료 → {next_name} 가동 (.disabled 제거)")
        return True
    return False


def _already_running() -> bool:
    """이미 다른 watchdog 프로세스가 살아있으면 True (중복 실행 방지).

    PID 파일 체크(기존) + tasklist 프로세스명 직접 검색(추가)으로 이중 검증.
    두 watchdog이 동시에 뜰 때의 레이스 컨디션을 완전히 막진 못하지만,
    PID 파일 없이도 이미 실행 중인 watchdog을 감지해 중복을 크게 줄인다.
    """
    self_pid = os.getpid()

    # 1차: PID 파일 기반 체크 (기존 로직)
    pid_file = RUN / "watchdog.pid"
    if pid_file.exists():
        try:
            prev = int(pid_file.read_text().strip())
            if prev != self_pid and _pid_alive(prev):
                return True
        except (ValueError, OSError):
            pass

    # 2차: tasklist에서 watchdog.py 실행 중인 python 프로세스 직접 검색
    # PID 파일 없이 동시에 뜨는 경우 대비
    try:
        out = subprocess.check_output(
            ["wmic", "process", "where",
             "Name='python.exe'",
             "get", "ProcessId,CommandLine", "/format:list"],
            stderr=subprocess.DEVNULL, text=True, timeout=10,
            creationflags=_WNOW,
        )
        for block in out.split("\n\n"):
            if "watchdog.py" not in block:
                continue
            m = re.search(r"ProcessId=(\d+)", block)
            if not m:
                continue
            other_pid = int(m.group(1))
            if other_pid != self_pid:
                return True
    except (subprocess.SubprocessError, OSError):
        pass

    return False


def _acquire_singleton_lock() -> bool:
    """Atomically claim run/watchdog.pid. False means another live watchdog holds it.

    _already_running() below checks, then main() writes the pid — two separate
    steps, so two watchdogs launched close together both read "nobody home" and
    both proceed. That is exactly what happened on 2026-08-13: PID 5148 (.venv
    python) and PID 8952 (system python) started 62 ms apart and ran as a pair,
    each supervising the same jobs and racing on the same per-job pid files.

    O_CREAT|O_EXCL makes claim-and-write a single atomic operation, so the loser
    of the race cannot mistake the gap for an empty slot. A stale lock left by a
    crashed watchdog is reclaimed once, after verifying its owner is really gone.
    """
    RUN.mkdir(exist_ok=True)
    lock = RUN / "watchdog.pid"
    self_pid = os.getpid()
    for _ in range(2):
        try:
            fd = os.open(str(lock), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            with os.fdopen(fd, "w") as f:
                f.write(str(self_pid))
            return True
        except FileExistsError:
            try:
                prev = int(lock.read_text().strip())
            except (ValueError, OSError):
                prev = 0
            if prev and prev != self_pid and _pid_alive(prev):
                return False
            # Stale (owner dead / unreadable) — drop it and retry once.
            try:
                lock.unlink()
            except OSError:
                return False
        except OSError:
            return False
    return False


def _write_self_pid():
    RUN.mkdir(exist_ok=True)
    (RUN / "watchdog.pid").write_text(str(os.getpid()))


def _clear_self_pid():
    pid_file = RUN / "watchdog.pid"
    try:
        if pid_file.exists() and pid_file.read_text().strip() == str(os.getpid()):
            pid_file.unlink()
    except OSError:
        pass


def main():
    if not VENV_PY.exists():
        log(f"venv python 못 찾음: {VENV_PY}")
        return 1

    # Order matters. The process-table scan runs FIRST because it exits via
    # sys.exit(0) — if it ran after the lock was taken, the departing instance's
    # atexit would delete the pid file it legitimately owned, and the survivor
    # would be left running with no lock recorded. (Observed live 2026-08-13:
    # three launchers — the DeliverableWatchdogCheck scheduled task, the
    # DeliverableWatchdog.lnk and start_watchdog.vbs startup entries — race at
    # boot, so this path is exercised constantly.)
    _singleton_guard()

    # Then the atomic claim, which is the actual authority: the scan above is a
    # read-then-act check and two instances milliseconds apart can both pass it,
    # which is how PID 5148 and 8952 ended up supervising the same jobs.
    if not _acquire_singleton_lock():
        log("이미 다른 watchdog 인스턴스가 실행 중 — 종료 (lock)")
        return 0

    # Registered only after the claim succeeds, so an instance that never owned
    # the lock can never remove it.
    import atexit
    atexit.register(_clear_self_pid)

    services = build_services()

    # 2026-07-18: 이전 프로세스 수명에서 자연 종료로 영속화된 .disabled 마커를
    # in-memory 상태로 되읽음 — _promote_next_in_chain() 이 재시작 후에도
    # "prev 자연 종료" 를 올바르게 판단하도록.
    for s in services:
        if s.is_paused():
            try:
                reason = s.disabled_marker.read_text(encoding="utf-8").strip()
            except OSError:
                reason = ""
            if "자연 종료" in reason:
                s.disabled = True
                s.disabled_reason = reason

    global _STRAY_KILL_SAFE_SCRIPTS
    _script_counts: dict[str, int] = {}
    for s in services:
        if s.cmd:
            n = Path(s.cmd[0]).name
            _script_counts[n] = _script_counts.get(n, 0) + 1
    _STRAY_KILL_SAFE_SCRIPTS = {n for n, c in _script_counts.items() if c == 1}
    log(f"[stray-guard] 단독 스크립트 {len(_STRAY_KILL_SAFE_SCRIPTS)}개만 stray 정리 대상: "
        f"{sorted(_STRAY_KILL_SAFE_SCRIPTS)}")

    _validate_proxy_ports(services)
    log(f"watchdog 시작 PID={os.getpid()} — {len(services)}개 서비스 감시, {CHECK_INTERVAL}초 주기")
    for s in services:
        pid = s.get_pid()
        alive = "alive" if s.is_alive() else "dead"
        log(f"  · {s.name}: pid={pid} ({alive})")

    stop_marker = RUN / "stop_watchdog"
    if stop_marker.exists():
        stop_marker.unlink()

    HEARTBEAT_EVERY = 30 * 60  # 30분
    last_heartbeat = time.time()
    last_chrome_check = 0.0
    CHROME_CHECK_INTERVAL = 30  # 30초마다 chrome 수 체크
    last_dup_check = 0.0
    DUP_CHECK_INTERVAL = 120  # 2분마다 — nordvpn_runner 등 공유자원 중복 인스턴스 능동 감시

    while True:
        time.sleep(CHECK_INTERVAL)
        if stop_marker.exists():
            log("stop_watchdog 마커 감지 → 종료")
            stop_marker.unlink()
            return 0

        # ── chrome 과부하 가드 ──────────────────────────────────
        now = time.time()
        chrome_n = 0
        if now - last_chrome_check >= CHROME_CHECK_INTERVAL:
            last_chrome_check = now
            chrome_n = _chrome_count()
            if chrome_n > CHROME_HARD_LIMIT:
                log(f"[ram-guard] chrome {chrome_n}개 > {CHROME_HARD_LIMIT} → 전체 kill")
                _kill_all_chrome()
                chrome_n = 0
            elif chrome_n > CHROME_SOFT_LIMIT:
                log(f"[ram-guard] chrome {chrome_n}개 > {CHROME_SOFT_LIMIT} — chrome_heavy 재시작 보류")

        # ── 중복 인스턴스 능동 감시 (2026-07-14 사고 재발방지) ──────
        # restart() 시점의 _kill_stray_instances() 만으로는 watchdog 밖에서
        # 발생한 중복(예: PID 추적이 어긋난 채 이전 인스턴스가 살아남은 경우)을
        # 못 잡음. 공유 SOCKS 8포트를 쓰는 nordvpn_runner 는 중복 시 blast
        # radius 가 전체 chrome_heavy 서비스라 매 tick 능동 스캔.
        if now - last_dup_check >= DUP_CHECK_INTERVAL:
            last_dup_check = now
            vpn_svc = next((s for s in services if s.name == "nordvpn_runner"), None)
            if vpn_svc is not None:
                script = Path(vpn_svc.cmd[0]).name
                instances = _find_script_instances(script)
                # launcher/worker 는 부모-자식 쌍이라 최대 2개 PID가 정상 —
                # 서로 다른 쌍(양쪽 다 launcher 이거나, 서로 다른 부모를 가진
                # worker)이 섞여 있으면 3개 이상 잡힘.
                if len(instances) > 2:
                    keep_pid = vpn_svc.get_pid()
                    log(f"[dup-guard] nordvpn_runner 인스턴스 {len(instances)}개 감지 "
                        f"(정상 2개) — keep={keep_pid}")
                    for pid, _ppid in instances:
                        if pid == keep_pid:
                            continue
                        try:
                            subprocess.run(
                                ["taskkill", "/F", "/T", "/PID", str(pid)],
                                stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                timeout=15, creationflags=_WNOW,
                            )
                            log(f"[dup-guard] PID {pid} 정리")
                        except (subprocess.SubprocessError, OSError):
                            pass

        any_action = False
        for s in services:
            if s.disabled:
                continue
            if s.is_paused():
                continue
            if s.is_alive():
                # 살아있어도 진행 정체면 강제 재시작
                if s.progress_stale():
                    # VPN 터널 전멸 상태의 브라우저 스크래퍼는 킥 보류 —
                    # 재시작해봤자 똑같이 정체되고, 재시작마다 같은 재시도 대상
                    # 재수집 + 브라우저 재기동 낭비만 생김 (2026-07-11: 이 킥
                    # 폭풍으로 서비스당 하루 110~140회 재시작, 완료 로그 ~900건이
                    # 실제론 동일 클리닉 18개 반복이었음).
                    if s.chrome_heavy and _vpn_alive_count() == 0:
                        continue  # VPN 복구되면 자연히 진행 재개
                    s.kick(f"progress 정체 ({s.progress_stale_sec}s)")
                    any_action = True
                continue
            if s.grid_naturally_done():
                s.disabled = True
                s.disabled_reason = "grid 자연 종료"
                s._persist_disabled_marker()
                log(f"[{s.name}] {s.disabled_reason} — 더 이상 재시작 안 함")
                any_action = True
                continue
            if s.review_naturally_done():
                s.disabled = True
                s.disabled_reason = "review 자연 종료"
                s._persist_disabled_marker()
                log(f"[{s.name}] {s.disabled_reason} — 큐 비움, 더 이상 재시작 안 함")
                any_action = True
                continue
            if s.pantip_naturally_done():
                s.disabled = True
                s.disabled_reason = "pantip 완료 (남은 미완료 항목 없음)"
                s._persist_disabled_marker()
                log(f"[{s.name}] {s.disabled_reason} — 더 이상 재시작 안 함 (재개하려면 run/{s.name}.disabled 삭제)")
                any_action = True
                continue
            # chrome 과부하면 브라우저 많이 쓰는 서비스 재시작 보류
            if s.chrome_heavy and chrome_n > CHROME_SOFT_LIMIT:
                continue
            log(f"[{s.name}] 죽음 감지 → 재시작 시도")
            s.restart()
            any_action = True

        if _promote_next_in_chain(services):
            any_action = True

        now = time.time()
        if any_action or now - last_heartbeat >= HEARTBEAT_EVERY:
            def _state(s: Service) -> str:
                if s.is_paused():
                    return "paused"
                if s.is_alive():
                    return "on"
                if s.disabled:
                    return f"off:{s.disabled_reason}"
                return "down"
            # Only the services that aren't quietly paused. Naming all ~88
            # every 20s wrote a 4 KB line — about 10 MB of log a day, ~95% of
            # it the same list of paused scrapers — which is how watchdog.log
            # reached 124 MB and became too slow to grep when something
            # actually broke. Paused is the steady state and carries no
            # information; on/down/off does.
            noteworthy = [s for s in services if not s.is_paused()]
            status = ", ".join(f"{s.name}={_state(s)}" for s in noteworthy)
            log(f"heartbeat: {status}  (+{len(services) - len(noteworthy)} paused)")
            last_heartbeat = now


if __name__ == "__main__":
    sys.exit(main())
