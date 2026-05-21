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

import os
import re
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
RUN = ROOT / "run"
LOGS = ROOT / "logs"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

CHECK_INTERVAL = 10      # 초 (Tier1 업그레이드: 20→10)
MAX_RESTARTS_PER_MIN = 5
GRID_DONE_MARKER = "처리할 포인트 없음. 종료."
REVIEW_DONE_MARKER = "수집 중단/완료 → 워커 정리"  # scraper.py가 큐 비면 graceful exit 직전에 찍는 라인

# 그리드는 SOCKS 포트 2080 한 개를 공유 → 동시에 한 도시만 가동.
# 앞 도시가 자연 종료되면 다음 도시의 .disabled 마커 제거하여 깨움.
GRID_CHAIN = [
    # 클리닉 외국인 인기 순서 chain. Pattaya 끝나면 자동으로 다음 도시 진입.
    # 2026-05-21 update: 영업이 방콕 우선이라 Pattaya 다음 Bangkok 재실행 추가.
    # Bangkok grid는 새 클리닉 discovery (Fiona 등 누락분 보강), review는 신규/기존 보강.
    "pattaya_clinics_grid",
    "pattaya_clinics_review",
    "bangkok_clinics_grid",
    "bangkok_clinics_review",
    "phuket_clinics_grid",
    "phuket_clinics_review",
    "chiang_mai_clinics_grid",
    "chiang_mai_clinics_review",
    "koh_samui_clinics_grid",
    "koh_samui_clinics_review",
    "krabi_clinics_grid",
    "krabi_clinics_review",
    "hua_hin_clinics_grid",
    "hua_hin_clinics_review",
]

# 로그 타임스탬프 패턴 두 종류 지원:
#  - scraper / telegram_monitor (logging 모듈): "YYYY-MM-DD HH:MM:SS,mmm [LEVEL] ..."
#  - nordvpn_runner (직접 print): "[HH:MM:SS] ..."
_LOG_TS_RE_FULL = re.compile(r"^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})")
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

    # 진행률 health check — PID 살아있어도 실제 작업 진척 없으면 hang 으로 판정.
    # progress_pattern: 매 성공 작업마다 로그에 찍히는 패턴.
    # progress_stale_sec: 이 시간 동안 패턴 안 보이면 hang.
    # progress_grace_sec: 시작/재시작 후 이 시간은 progress 검사 면제.
    progress_pattern: re.Pattern | None = None
    progress_stale_sec: int = 300
    progress_grace_sec: int = 300

    restarts: list[float] = field(default_factory=list)
    disabled: bool = False
    disabled_reason: str = ""
    last_started_at: float = 0.0
    last_progress_kick_at: float = 0.0

    @property
    def pid_file(self) -> Path:
        return RUN / f"{self.name}.pid"

    @property
    def disabled_marker(self) -> Path:
        return RUN / f"{self.name}.disabled"

    def is_paused(self) -> bool:
        """run/<name>.disabled 파일 있으면 watchdog 건너뜀 (수동 일시정지)."""
        return self.disabled_marker.exists()

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
        for line in reversed(tail.splitlines()):
            if self.progress_pattern.search(line):
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
            )
        except (subprocess.SubprocessError, OSError):
            pass
        # launcher (parent) 도 같이 정리 — 외로워진 venv 런처 zombie 방지
        try:
            out = subprocess.check_output(
                ["wmic", "process", "where", f"ProcessId={pid}",
                 "get", "ParentProcessId", "/format:list"],
                stderr=subprocess.DEVNULL, text=True, timeout=10,
            )
            for line in out.splitlines():
                line = line.strip()
                if line.startswith("ParentProcessId="):
                    parent = int(line.split("=", 1)[1])
                    if parent > 4:  # PID 4 는 System
                        subprocess.run(
                            ["taskkill", "/F", "/T", "/PID", str(parent)],
                            stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, timeout=10,
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

    def restart(self) -> bool:
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

        log_f = open(self.log_file, "a", buffering=1, encoding="utf-8")
        log_f.write(f"\n=== watchdog 재시작 {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")

        # CREATE_NO_WINDOW: console 안 띄우는 백그라운드 (cmd 깜빡임 방지)
        # CREATE_NEW_PROCESS_GROUP: ctrl+c 등 부모 시그널 격리
        # CREATE_BREAKAWAY_FROM_JOB: schtasks/conhost 의 job 객체에서 분리되어 부모 죽어도 생존
        CREATE_NO_WINDOW = 0x08000000
        CREATE_NEW_PROCESS_GROUP = 0x00000200
        CREATE_BREAKAWAY_FROM_JOB = 0x01000000
        creationflags = CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP | CREATE_BREAKAWAY_FROM_JOB

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


def _pid_alive(pid: int) -> bool:
    """Windows tasklist 기반 PID 체크."""
    try:
        out = subprocess.check_output(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            stderr=subprocess.DEVNULL, text=True, timeout=10,
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
    }
    pattaya_env = {
        "CITY_LAT": "12.9236",
        "CITY_LNG": "100.8825",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../pattaya/output",
    }
    chiang_mai_env = {
        "CITY_LAT": "18.7883",
        "CITY_LNG": "98.9853",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../chiang_mai/output",
    }
    phuket_env = {
        "CITY_LAT": "7.8804",
        "CITY_LNG": "98.3923",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../phuket/output",
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
    # grid는 2080-2081 (default), review는 2082-2087 (default). 각 도시 grid → review 순.
    pattaya_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "12.9236",
        "CITY_LNG": "100.8825",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../pattaya/clinics_output",
    }
    phuket_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "7.8804",
        "CITY_LNG": "98.3923",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../phuket/clinics_output",
    }
    chiang_mai_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "18.7883",
        "CITY_LNG": "98.9853",
        "CITY_RADIUS_M": "20000",
        "CITY_OUTPUT_DIR": "../chiang_mai/clinics_output",
    }
    koh_samui_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "9.5018",
        "CITY_LNG": "99.9648",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../koh_samui/clinics_output",
    }
    krabi_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "8.0863",
        "CITY_LNG": "98.9063",
        "CITY_RADIUS_M": "15000",
        "CITY_OUTPUT_DIR": "../krabi/clinics_output",
    }
    hua_hin_clinics_env = {
        "SEARCH_QUERY": "clinic",
        "SEARCH_TAG": "en",
        "CITY_LAT": "12.5684",
        "CITY_LNG": "99.9577",
        "CITY_RADIUS_M": "12000",
        "CITY_OUTPUT_DIR": "../hua_hin/clinics_output",
    }
    bangkok_clinics_env = {
        "SEARCH_QUERY": "clinic",
        # Bangkok grid 자연 종료 후 → review에 모든 8 포트 몰아주기 (default 6→8).
        "N_WORKERS": "8",
        "PROXY_PORT_BASE": "2080",
        # 다음 도시(Pattaya) 클리닉 grid 시작 시 자동으로 default(6+2082)로 환원.
        "SEARCH_TAG": "en",
        "CITY_LAT": "13.7462890",
        "CITY_LNG": "100.5346890",
        "CITY_RADIUS_M": "30000",
        "CITY_OUTPUT_DIR": "output",
    }

    # progress 패턴 (각 서비스의 "실제 작업 진척" 시그널)
    PROG_REVIEW = re.compile(r"✓ \[\d+\].*처리율")  # scraper 한 건 완료 라인
    PROG_GRID   = re.compile(r"\| 결과 \d+ 신규 \d+")  # grid 한 점 처리 라인
    # nordvpn_runner 는 평소엔 조용함. 15분 주기 server fetch + READY 가 시그널.
    PROG_VPN    = re.compile(r"(READY|bootstrap 완료|서버 리스트 fetch)")
    # master_db builder: 5분마다 폴링/빌드 — "변경 없음 — 스킵" 또는 "재빌드 완료"
    PROG_MDB    = re.compile(r"(변경 없음|재빌드 완료|입력 변경)")

    return [
        Service(
            name="nordvpn_runner",
            cmd=["nordvpn_runner.py", "--ports", "8", "--base-port", "2080",
                 "--auth", "nordvpn/auth.txt", "--proto", "tcp"],
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
                # dental 은 2 워커만 (dental_grid 끝난 뒤 같은 ports 2080-2081 재사용)
                "N_WORKERS": "2",
                "PROXY_PORT_BASE": "2080",
            },
            log_file=LOGS / "dental_review_bangkok.log",
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
            review_done_check=True,   # 큐 비면 자연 종료 → chain promotion (Pattaya로)
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
            review_done_check=True, progress_pattern=PROG_REVIEW,
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
            review_done_check=True, progress_pattern=PROG_REVIEW,
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
            review_done_check=True, progress_pattern=PROG_REVIEW,
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
            review_done_check=True, progress_pattern=PROG_REVIEW,
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
            review_done_check=True, progress_pattern=PROG_REVIEW,
            progress_stale_sec=600, progress_grace_sec=420,
        ),
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
            name="throughput_monitor",
            cmd=["scripts/throughput_monitor.py"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "throughput_monitor.log",
            progress_pattern=re.compile(r"review_rate=\d+/min"),
            progress_stale_sec=180,   # 60s 주기라 3분 안 찍히면 죽은 것
            progress_grace_sec=90,
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
    """이미 다른 watchdog 프로세스가 살아있으면 True (중복 실행 방지)."""
    self_pid = os.getpid()
    pid_file = RUN / "watchdog.pid"
    if not pid_file.exists():
        return False
    try:
        prev = int(pid_file.read_text().strip())
    except (ValueError, OSError):
        return False
    if prev == self_pid:
        return False
    return _pid_alive(prev)


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

    if _already_running():
        log("이미 다른 watchdog 인스턴스가 실행 중 — 종료")
        return 0

    _write_self_pid()
    import atexit
    atexit.register(_clear_self_pid)

    services = build_services()
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

    while True:
        time.sleep(CHECK_INTERVAL)
        if stop_marker.exists():
            log("stop_watchdog 마커 감지 → 종료")
            stop_marker.unlink()
            return 0

        any_action = False
        for s in services:
            if s.disabled:
                continue
            if s.is_paused():
                continue
            if s.is_alive():
                # 살아있어도 진행 정체면 강제 재시작
                if s.progress_stale():
                    s.kick(f"progress 정체 ({s.progress_stale_sec}s)")
                    any_action = True
                continue
            if s.grid_naturally_done():
                s.disabled = True
                s.disabled_reason = "grid 자연 종료"
                log(f"[{s.name}] {s.disabled_reason} — 더 이상 재시작 안 함")
                any_action = True
                continue
            if s.review_naturally_done():
                s.disabled = True
                s.disabled_reason = "review 자연 종료"
                log(f"[{s.name}] {s.disabled_reason} — 큐 비움, 더 이상 재시작 안 함")
                any_action = True
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
            status = ", ".join(f"{s.name}={_state(s)}" for s in services)
            log(f"heartbeat: {status}")
            last_heartbeat = now


if __name__ == "__main__":
    sys.exit(main())
