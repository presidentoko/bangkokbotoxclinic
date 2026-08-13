"""auto_rebuild.py — 폴더 watch + 자동 빌드/배포/IndexNow.

매 10분마다 Windows Task Scheduler 가 실행. 작동:
1. data 폴더들 (Desktop/Downloads/공단/...) 의 최신 mtime 확인
2. last_run.txt 에 기록된 마지막 trigger mtime 보다 새 파일 있으면:
   a. master_db rebuild
   b. next build
   c. wrangler pages deploy
   d. IndexNow ping
   e. last_run.txt 갱신
3. 변경 없으면 즉시 종료 (cheap polling)

로그: web-factory/logs/auto_rebuild.log
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

# Windows: bare "npx"/"npm" have no .exe, only a .cmd shim. subprocess.run(shell=False)
# does not resolve that shim (WinError 2), so resolve the real path once at import time.
NPX = shutil.which("npx") or "npx"
NPM = shutil.which("npm") or "npm"

ROOT = Path(__file__).resolve().parents[2]
WEB = ROOT / "web-factory"
DATA = WEB / "data"
LOGS = WEB / "logs"
LOGS.mkdir(parents=True, exist_ok=True)

LAST_RUN = WEB / ".last_auto_rebuild"
LOG_FILE = LOGS / "auto_rebuild.log"

HOME = Path.home()
WATCH_DIRS = [
    HOME / "Desktop" / "공단" / "공단" / "이름만",
    HOME / "Desktop" / "공단" / "공단" / "리뷰",
    HOME / "Downloads" / "공단" / "공단" / "이름만",
    HOME / "Downloads" / "공단" / "공단" / "리뷰",
    HOME / "Desktop" / "공단" / "공단",
    WEB / "export",  # community scraper CSVs (Pantip/Naver/YouTube)
]

PATTERNS = ["dataset_crawler-google-places_*.json",
            "dataset_google-maps-extractor_*.json",
            "dataset_Google-Maps-Reviews-Scraper_*.json",
            "factory_pantip_threads.csv",
            "factory_naver_blogs.csv",
            "factory_youtube_videos.csv"]


def log(msg: str) -> None:
    now = datetime.now(timezone.utc).isoformat()
    line = f"[{now}] {msg}\n"
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line)
    # stdout 도 동시 출력 (Task Scheduler hidden 이라 안 보이지만 명시적 run 시 도움)
    try:
        print(line, end="", flush=True)
    except UnicodeEncodeError:
        pass


def latest_mtime() -> float:
    """모든 watch dir 의 모든 매칭 파일 중 가장 늦은 mtime."""
    latest = 0.0
    for d in WATCH_DIRS:
        if not d.exists():
            continue
        for pat in PATTERNS:
            for p in d.glob(pat):
                try:
                    latest = max(latest, p.stat().st_mtime)
                except OSError:
                    continue
    return latest


def read_last_run() -> float:
    if not LAST_RUN.exists():
        return 0.0
    try:
        return float(LAST_RUN.read_text(encoding="utf-8").strip())
    except (ValueError, OSError):
        return 0.0


def write_last_run(mtime: float) -> None:
    LAST_RUN.write_text(str(mtime), encoding="utf-8")


def run(cmd: list[str], cwd: Path | None = None, timeout: int = 600) -> bool:
    log(f"RUN: {' '.join(cmd)}")
    try:
        env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
        proc = subprocess.run(
            cmd,
            cwd=str(cwd) if cwd else None,
            capture_output=True,
            text=True,
            timeout=timeout,
            env=env,
        )
        if proc.returncode != 0:
            log(f"FAIL exit={proc.returncode}: {proc.stderr[:500]}")
            return False
        # 마지막 줄 100자만 로그 (장황 방지)
        tail = proc.stdout.strip().split("\n")[-1][:200] if proc.stdout else ""
        log(f"OK: {tail}")
        return True
    except subprocess.TimeoutExpired:
        log(f"TIMEOUT after {timeout}s")
        return False
    except Exception as e:
        log(f"EXC: {type(e).__name__}: {e}")
        return False


def main() -> int:
    cur = latest_mtime()
    last = read_last_run()

    if cur == 0:
        log("no data files found — skip")
        return 0
    if cur <= last:
        # 변경 없음 — 즉시 종료
        return 0

    log(f"new data detected (mtime {cur} > last {last}) — start rebuild")

    # 1. master_db rebuild — 전체 파이프라인 (CSV → Apify → 이메일 → dead-lead → 통계).
    #
    # 여기는 예전에 build_db_from_csv.py 만 불렀다. 그건 master_db 를 CSV 로 덮어쓰는
    # 스크립트라, 2026-08-09 이 작업이 처음 성공했을 때 Apify 병합분 5,778 개를 지우고
    # 그대로 프로덕션에 배포했다. 이제 rebuild_master_db.py 가 순서를 강제하고
    # supplier 수가 하한 밑으로 떨어지면 스스로 실패한다 — 아래 return 1 이 배포를 막는다.
    if not run([sys.executable, str(WEB / "scripts" / "rebuild_master_db.py")], cwd=WEB, timeout=1800):
        log("ABORT — master_db rebuild failed (배포하지 않음)")
        return 1

    # 1b. community datasets rebuild — Pantip/Naver/YouTube CSV → JSON.
    # Cheap (<10s) and idempotent; safe to run every cycle.
    if not run(["python", str(WEB / "scripts" / "build_community_data.py")], cwd=WEB, timeout=120):
        log("WARN — community build failed (continuing)")

    # 1c. regenerate the district alias table the Pages middleware reads.
    if not run([NPX, "tsx", "scripts/gen_redirects.mts"], cwd=WEB, timeout=120):
        log("WARN — gen_redirects failed (continuing with stale aliases)")

    # 2. build — via `npm run build`, NOT `next build` directly, so npm's
    # prebuild (compare-index.json / browse-index.json regeneration) and
    # postbuild (strip_rsc_payloads.mjs, fix_html_lang.mjs) lifecycle hooks actually run.
    # 900s 였는데 supplier 가 3.3k 에서 9k 로 돌아오면서 19,281 페이지 + OG 이미지를
    # 굽느라 실측 9~12분이 걸린다. 한도에 걸려 죽으면 배포가 통째로 멈춘다.
    if not run([NPM, "run", "build"], cwd=WEB, timeout=2400):
        log("ABORT — build failed")
        return 1

    out_dir = WEB / "out"
    if not out_dir.exists():
        log("ABORT — out/ not produced")
        return 1

    # 3. wrangler deploy
    if not run(
        [NPX, "wrangler", "pages", "deploy", "out/",
         "--project-name=thaisupplyhub", "--branch=main", "--commit-dirty=true"],
        cwd=WEB, timeout=900,
    ):
        log("WARN — deploy failed, skipping IndexNow")
        return 1

    # 4. IndexNow ping
    run(["python", str(WEB / "scripts" / "indexnow_ping.py")], cwd=WEB, timeout=120)

    # 5. update last run
    write_last_run(cur)
    log(f"OK — auto rebuild cycle complete (mtime {cur})")
    return 0


if __name__ == "__main__":
    import io
    if hasattr(sys.stdout, "buffer"):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.exit(main())
