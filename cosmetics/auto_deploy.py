"""Cosmetics auto-deploy loop.

Watches the scraped product count. When it increases (run_forever added new products):
  1. python -m cosmetics.build_master_db  — rebuild master_db.json
  2. python -m cosmetics.gen_summaries    — LLM summaries for new products (if key set)
  3. git add + commit + push              — triggers Vercel auto-deploy from GitHub

Set these env vars:
  ANTHROPIC_API_KEY     (optional — skip gen_summaries if missing)
  COSMETICS_GIT_BRANCH  (default: main — branch Vercel watches)
  COSMETICS_DEPLOY_POLL (default: 300 — poll interval seconds)

Run once per machine start (ensure_collector.ps1 can add this):
  python -m cosmetics.auto_deploy
"""
from __future__ import annotations
import json, logging, os, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # repo root
WT   = Path(__file__).resolve().parent.parent           # worktree = cosmetics-aeo root
PROD_DIR  = WT / "cosmetics" / "output" / "products"
STATE_DIR = WT / "cosmetics" / "state"
MASTER_DB = WT / "cosmetics" / "web" / "data" / "master_db.json"
STOP_FILE = STATE_DIR / "STOP"
PY = sys.executable

POLL = int(os.getenv("COSMETICS_DEPLOY_POLL", "300"))   # 5 min
BRANCH = os.getenv("COSMETICS_GIT_BRANCH", "main")

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [auto_deploy] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger(__name__)


def product_count() -> int:
    if not PROD_DIR.exists():
        return 0
    return len(list(PROD_DIR.glob("*.json")))


def run(cmd: list[str], cwd: Path | None = None) -> bool:
    log.info("$ " + " ".join(cmd))
    try:
        r = subprocess.run(
            cmd, cwd=str(cwd or WT),
            timeout=600, capture_output=True, text=True,
            encoding="utf-8", errors="replace",
            env={**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"},
        )
    except subprocess.TimeoutExpired:
        log.error("command timed out"); return False
    if r.returncode != 0:
        log.error(f"exit {r.returncode}: {(r.stderr or '')[-800:]}")
        return False
    if r.stdout.strip():
        log.info(r.stdout.strip()[-400:])
    return True


def build_and_push(prev_count: int, new_count: int) -> bool:
    log.info(f"=== deploy triggered: {prev_count} -> {new_count} products ===")

    # 1. Rebuild master_db
    if not run([PY, "-m", "cosmetics.build_master_db"]):
        log.error("build_master_db failed — skipping deploy"); return False

    # 2. Gen summaries (optional — needs ANTHROPIC_API_KEY)
    if os.getenv("ANTHROPIC_API_KEY"):
        if not run([PY, "-m", "cosmetics.gen_summaries"]):
            log.warning("gen_summaries failed — deploying without new summaries")
    else:
        log.info("ANTHROPIC_API_KEY not set — skipping gen_summaries")

    # 3. Git: add, commit, push
    stamp = time.strftime("%Y-%m-%d %H:%M")
    msg   = f"data: {new_count} products — {stamp} [auto]"

    if not run(["git", "add", "cosmetics/web/data/master_db.json",
                            "cosmetics/state/summary_cache.json"], cwd=WT):
        log.warning("git add warning (possibly nothing new)")

    # Check if there's anything to commit
    diff = subprocess.run(["git", "diff", "--cached", "--name-only"],
                          capture_output=True, text=True, cwd=str(WT))
    if not diff.stdout.strip():
        log.info("nothing staged — skipping commit/push"); return True

    if not run(["git", "commit", "-m", msg], cwd=WT):
        log.error("git commit failed"); return False

    # Push to the branch Vercel is watching
    # If on worktree branch, push there; Vercel must be configured to watch it
    result = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"],
                            capture_output=True, text=True, cwd=str(WT))
    current_branch = result.stdout.strip() or BRANCH
    if not run(["git", "push", "origin", current_branch], cwd=WT):
        log.error("git push failed — check remote auth"); return False

    log.info(f"=== pushed to {current_branch} — Vercel will pick it up ===")
    return True


def main() -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    log.info(f"start PID={os.getpid()} poll={POLL}s branch={BRANCH}")

    last_count = product_count()
    log.info(f"initial product count: {last_count}")

    while not STOP_FILE.exists():
        time.sleep(POLL)
        cur = product_count()
        if cur > last_count:
            log.info(f"new products detected: {last_count} -> {cur}")
            if build_and_push(last_count, cur):
                last_count = cur
            else:
                log.warning("deploy failed — will retry next cycle")
        else:
            log.info(f"no change ({cur} products)")

    log.info("STOP file found — exit")


if __name__ == "__main__":
    main()
