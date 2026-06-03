"""Cosmetics auto-deploy loop — fully automatic, no manual steps.

Watches the scraped product count. When it increases (run_forever added new products):
  1. python -m cosmetics.build_master_db  — rebuild master_db.json
  2. python -m cosmetics.gen_summaries    — LLM summaries (if ANTHROPIC_API_KEY set)
  3. vercel deploy --prod                 — deploy directly to bangkokfillers.com

The Vercel token is read automatically from the CLI's local auth file —
no manual login or env var needed as long as `vercel login` was done once.

Free plan optimization:
  - Only deploys when NEW_PRODUCTS_THRESHOLD or more new products accumulate
    (avoids wasting the 100 deployments/day limit on tiny batches)
  - git commit still runs every cycle so data is versioned regardless

Optional env vars:
  ANTHROPIC_API_KEY          — enables gen_summaries for new products
  COSMETICS_DEPLOY_POLL      — poll interval in seconds (default: 300)
  COSMETICS_MIN_NEW_PRODUCTS — min new products before deploying (default: 5)

Run via ensure_collector.ps1 (auto-started) or manually:
  python -m cosmetics.auto_deploy
"""
from __future__ import annotations
import json, logging, os, subprocess, sys, time
from pathlib import Path

WT        = Path(__file__).resolve().parent.parent
PROD_DIR  = WT / "cosmetics" / "output" / "products"
STATE_DIR = WT / "cosmetics" / "state"
WEB_DIR   = WT / "cosmetics" / "web"
STOP_FILE = STATE_DIR / "STOP"
PY        = sys.executable

POLL      = int(os.getenv("COSMETICS_DEPLOY_POLL", "300"))        # 5 min
MIN_NEW   = int(os.getenv("COSMETICS_MIN_NEW_PRODUCTS", "5"))     # free plan guard

# Vercel CLI auth file — written by `vercel login`
_VERCEL_AUTH = Path(os.getenv("APPDATA", "")) / "com.vercel.cli" / "Data" / "auth.json"

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [auto_deploy] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger(__name__)


# ── helpers ──────────────────────────────────────────────────────────────────

def product_count() -> int:
    return len(list(PROD_DIR.glob("*.json"))) if PROD_DIR.exists() else 0


def _vercel_token() -> str:
    """Read the Vercel auth token from the CLI's local config (set by vercel login)."""
    for path in [_VERCEL_AUTH,
                 Path(os.getenv("APPDATA", "")) / "xdg.data" / "com.vercel.cli" / "auth.json"]:
        try:
            raw = path.read_text(encoding="utf-8-sig")
            return json.loads(raw).get("token", "")
        except Exception:
            continue
    return os.getenv("VERCEL_TOKEN", "")


def run(cmd: list[str], cwd: Path | None = None, extra_env: dict | None = None) -> bool:
    env = {**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8",
           **(extra_env or {})}
    log.info("$ " + " ".join(cmd))
    try:
        r = subprocess.run(cmd, cwd=str(cwd or WT), timeout=720,
                           capture_output=True, text=True,
                           encoding="utf-8", errors="replace", env=env)
    except subprocess.TimeoutExpired:
        log.error("command timed out"); return False
    if r.returncode != 0:
        log.error(f"exit {r.returncode}: {(r.stderr or r.stdout or '')[-600:]}")
        return False
    if r.stdout.strip():
        log.info(r.stdout.strip()[-300:])
    return True


# ── deploy pipeline ───────────────────────────────────────────────────────────

def build_and_deploy(prev_count: int, new_count: int) -> bool:
    log.info(f"=== deploy: {prev_count} → {new_count} products ===")

    # 1. Rebuild master_db
    if not run([PY, "-m", "cosmetics.build_master_db"]):
        log.error("build_master_db failed — abort"); return False

    # 2. LLM summaries for new products (optional)
    if os.getenv("ANTHROPIC_API_KEY"):
        if not run([PY, "-m", "cosmetics.gen_summaries"]):
            log.warning("gen_summaries failed — deploying without new summaries")
    else:
        log.info("ANTHROPIC_API_KEY not set — skip gen_summaries")

    # 3. Git commit + push (version control — independent of Vercel)
    stamp = time.strftime("%Y-%m-%d %H:%M")
    run(["git", "add",
         "cosmetics/web/data/master_db.json",
         "cosmetics/state/summary_cache.json"], cwd=WT)
    diff = subprocess.run(["git", "diff", "--cached", "--name-only"],
                          capture_output=True, text=True, cwd=str(WT))
    if diff.stdout.strip():
        run(["git", "commit", "-m", f"data: {new_count} products — {stamp} [auto]"], cwd=WT)
        run(["git", "push", "origin", "HEAD"], cwd=WT)

    # 4. Vercel deploy — read token from CLI auth, no manual login needed
    token = _vercel_token()
    if not token:
        log.error("No Vercel token found. Run `vercel login` once to store credentials.")
        return False

    vercel_cmd = ["vercel", "deploy", "--prod", "--yes",
                  "--token", token,
                  "--cwd", str(WEB_DIR)]
    if not run(vercel_cmd, cwd=WEB_DIR, extra_env={"VERCEL_TOKEN": token}):
        log.error("vercel deploy failed"); return False

    log.info(f"=== ✓ bangkokfillers.com updated with {new_count} products ===")
    return True


# ── main loop ─────────────────────────────────────────────────────────────────

def main() -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    log.info(f"start PID={os.getpid()} poll={POLL}s min_new={MIN_NEW}")

    last_count   = product_count()
    pending_new  = 0   # accumulated new products not yet deployed
    log.info(f"initial: {last_count} products")

    while not STOP_FILE.exists():
        time.sleep(POLL)
        cur = product_count()
        delta = cur - last_count

        if delta > 0:
            pending_new += delta
            log.info(f"+{delta} new products (pending={pending_new}/{MIN_NEW})")

            if pending_new >= MIN_NEW:
                if build_and_deploy(last_count, cur):
                    last_count  = cur
                    pending_new = 0
                else:
                    log.warning("deploy failed — will retry next cycle")
            # else: accumulate more before paying for a deployment
        else:
            log.debug(f"no change ({cur} products)")

    log.info("STOP file seen — exit")


if __name__ == "__main__":
    main()
