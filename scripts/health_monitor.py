"""밤새 무인 운영용 health monitor.

5분마다:
  1. pantip_scraper progress.json 카운트 + heartbeat 신선도 확인
  2. watchdog/scraper 핵심 프로세스 alive 체크
  3. 디스크 사용량 (C:) 임계치 검사
  4. 최근 1시간 처리율(clinic/min) 계산

결과는 logs/health.log 에 한 줄씩 append + state/health_status.json 에 최신 스냅샷 저장.
이상 감지하면 [WARN]/[CRIT] prefix 로 로그.

watchdog Service 로 등록되어 동작.
"""
from __future__ import annotations

import json
import shutil
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOGS = ROOT / "logs"
RUN = ROOT / "run"
PANTIP_STATE = ROOT / "pantip" / "state"
HEALTH_LOG = LOGS / "health.log"
HEALTH_STATUS = PANTIP_STATE / "health_status.json"

CHECK_INTERVAL_SEC = 300        # 5분
HEARTBEAT_STALE_SEC = 900       # 15분 안 찍히면 stale
DISK_FREE_WARN_GB = 20          # 20GB 미만 WARN
DISK_FREE_CRIT_GB = 5           # 5GB 미만 CRIT
HEARTBEAT_FILE = PANTIP_STATE / "heartbeat"


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def pid_alive(pid_str: str) -> bool:
    """Windows: PID 살아있는지 (tasklist). Bash fallback: kill -0."""
    try:
        pid = int(pid_str.strip())
    except (ValueError, AttributeError):
        return False
    if pid <= 0:
        return False
    try:
        import os
        # Windows + Bash 양쪽 cover: os.kill(pid, 0) 은 Windows 에선 OSError 던질 수 있음
        os.kill(pid, 0)
        return True
    except OSError:
        # Fallback: subprocess tasklist
        import subprocess
        try:
            r = subprocess.run(
                ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
                capture_output=True, text=True, timeout=5, check=False,
            )
            return str(pid) in (r.stdout or "")
        except Exception:
            return False


def read_progress_count() -> tuple[int, int, int, int]:
    """progress.json → (total, ok, skipped, error)."""
    p = PANTIP_STATE / "progress.json"
    if not p.exists():
        return 0, 0, 0, 0
    try:
        d = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return 0, 0, 0, 0
    total = len(d)
    ok = sum(1 for v in d.values() if v.get("status") == "ok")
    skp = sum(1 for v in d.values() if v.get("status") == "skipped")
    err = sum(1 for v in d.values() if v.get("status") == "error")
    return total, ok, skp, err


def read_heartbeat_age_sec() -> int | None:
    if not HEARTBEAT_FILE.exists():
        return None
    return int(time.time() - HEARTBEAT_FILE.stat().st_mtime)


def check_disk() -> tuple[float, float]:
    """C: 디스크 free/total GB."""
    usage = shutil.disk_usage("C:\\" if Path("C:\\").exists() else "/")
    return usage.free / 1e9, usage.total / 1e9


def core_pids() -> dict[str, tuple[str | None, bool]]:
    """핵심 서비스 PID 파일들의 (pid_str, alive)."""
    services = ["watchdog", "pantip_scraper", "nordvpn_runner", "throughput_monitor",
                "auto_push_loop", "master_db_builder"]
    out: dict[str, tuple[str | None, bool]] = {}
    for s in services:
        f = RUN / f"{s}.pid"
        if f.exists():
            pid_str = f.read_text(encoding="utf-8").strip()
            out[s] = (pid_str, pid_alive(pid_str))
        else:
            out[s] = (None, False)
    return out


def append_log(line: str):
    # watchdog.py's parse_log_timestamp expects a local "YYYY-MM-DD HH:MM:SS"
    # (optionally bracketed) at the START of the line. This script's own
    # embedded timestamps are UTC ISO-8601 (now_iso()) and appear after the
    # [OK]/[WARN]/[CRIT] tag, not at position 0 — so watchdog's progress_pattern
    # (\[(OK|WARN|CRIT)) matched but the line was never parseable, and
    # progress_stale() always fell through to "stale" (kicked every ~2.5min
    # regardless of progress_stale_sec, discovered 2026-07-24). Prefix a
    # fresh local timestamp so watchdog can actually judge freshness.
    prefix = datetime.now().strftime("[%Y-%m-%d %H:%M:%S] ")
    LOGS.mkdir(parents=True, exist_ok=True)
    with HEALTH_LOG.open("a", encoding="utf-8") as f:
        f.write(prefix + line + "\n")
    print(prefix + line, flush=True)


def collect_history() -> list[tuple[str, int]]:
    """state/health_status.json 의 history (시각, 처리완료수)."""
    if not HEALTH_STATUS.exists():
        return []
    try:
        d = json.loads(HEALTH_STATUS.read_text(encoding="utf-8"))
        return d.get("history", [])
    except Exception:
        return []


def main() -> int:
    PANTIP_STATE.mkdir(parents=True, exist_ok=True)
    append_log(f"[{now_iso()}] health_monitor 시작 — interval={CHECK_INTERVAL_SEC}s")

    while True:
        try:
            ts = now_iso()
            total, ok, skp, err = read_progress_count()
            hb_age = read_heartbeat_age_sec()
            free_gb, total_gb = check_disk()
            pids = core_pids()

            # 최근 1시간 rate 계산
            history = collect_history()
            history.append((ts, total))
            # 1시간 이전 데이터 정리
            cutoff = datetime.now(timezone.utc) - timedelta(hours=1)
            history = [(t, n) for (t, n) in history
                       if datetime.strptime(t, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc) >= cutoff][-72:]
            if len(history) >= 2:
                t0 = datetime.strptime(history[0][0], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
                t1 = datetime.strptime(history[-1][0], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
                dt_min = max((t1 - t0).total_seconds() / 60, 0.01)
                rate = (history[-1][1] - history[0][1]) / dt_min
            else:
                rate = 0.0

            # 판정
            warnings: list[str] = []
            crits: list[str] = []
            if not pids.get("watchdog", (None, False))[1]:
                crits.append("watchdog DEAD")
            if not pids.get("pantip_scraper", (None, False))[1]:
                warnings.append("pantip_scraper dead (watchdog should respawn)")
            if free_gb < DISK_FREE_CRIT_GB:
                crits.append(f"disk free {free_gb:.1f}GB < {DISK_FREE_CRIT_GB}")
            elif free_gb < DISK_FREE_WARN_GB:
                warnings.append(f"disk free {free_gb:.1f}GB < {DISK_FREE_WARN_GB}")
            if hb_age is not None and hb_age > HEARTBEAT_STALE_SEC:
                warnings.append(f"pantip heartbeat stale ({hb_age}s)")
            # rate 계산은 history >= 3 (15분+ 축적) 일 때만 의미있음. 초기엔 0/min 으로
            # 떨어지는 게 정상이라 WARN 발생 막음.
            if len(history) >= 3 and rate < 0.3 and total > 50:
                warnings.append(f"pantip rate too low ({rate:.2f}/min)")

            prefix = "[CRIT]" if crits else ("[WARN]" if warnings else "[OK]  ")
            issue_str = " | ".join(crits + warnings) if (crits or warnings) else ""

            line = (
                f"{prefix} {ts} pantip={total} (ok={ok}, skp={skp}, err={err}) "
                f"rate={rate:.2f}/min hb_age={hb_age}s "
                f"disk_free={free_gb:.1f}GB "
                f"pids=" + ",".join(f"{k}:{'✓' if v[1] else '✗'}" for k, v in pids.items())
            )
            if issue_str:
                line += f" :: {issue_str}"
            append_log(line)

            # 스냅샷 저장
            try:
                HEALTH_STATUS.write_text(json.dumps({
                    "updated_at": ts,
                    "pantip": {"total": total, "ok": ok, "skipped": skp, "error": err},
                    "heartbeat_age_sec": hb_age,
                    "rate_per_min_1h": round(rate, 2),
                    "disk_free_gb": round(free_gb, 1),
                    "disk_total_gb": round(total_gb, 1),
                    "pids": {k: {"pid": v[0], "alive": v[1]} for k, v in pids.items()},
                    "warnings": warnings,
                    "criticals": crits,
                    "history": history,
                }, ensure_ascii=False, indent=2), encoding="utf-8")
            except Exception as e:
                append_log(f"[{ts}] health_status write failed: {type(e).__name__}: {e}")

        except Exception as e:
            try:
                append_log(f"[{now_iso()}] [CRIT] health_monitor loop error: {type(e).__name__}: {e}")
            except Exception:
                pass

        time.sleep(CHECK_INTERVAL_SEC)


if __name__ == "__main__":
    import sys
    sys.exit(main() or 0)
