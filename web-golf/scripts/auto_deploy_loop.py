"""Watch master_db / photos and auto-deploy to Cloudflare Pages.

When data/master_db.json or data/course_photos.json changes:
  1. Rebuild static export with `next build`
  2. Strip RSC payload .txt files (preserve llms.txt/robots.txt) to stay under
     CF Pages 20k file limit
  3. Deploy with wrangler pages deploy

Set these env vars before launching:
  CLOUDFLARE_API_TOKEN
  CLOUDFLARE_ACCOUNT_ID
  NEXT_PUBLIC_SITE_URL  (default: https://thailandgolfguide.com)
  NEXT_PUBLIC_BRAND     (default: Thailand Golf Guide)

Polls every 10 minutes. Skips if no changes.
"""
from __future__ import annotations

import logging
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILES = [ROOT / "data" / "master_db.json", ROOT / "data" / "course_photos.json"]
OUT_DIR = ROOT / "out"
KEEP_TXT = {"llms.txt", "llms-full.txt", "robots.txt"}

POLL_INTERVAL = 600  # 10 min
PROJECT_NAME = "thailandgolfguide"

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def latest_mtime() -> float:
    times = [p.stat().st_mtime for p in DATA_FILES if p.exists()]
    return max(times) if times else 0.0


def run(cmd: list[str], cwd: Path | None = None, env: dict | None = None) -> bool:
    log.info("$ " + " ".join(cmd))
    try:
        r = subprocess.run(cmd, cwd=cwd or ROOT, env=env, timeout=900, capture_output=True, text=True, encoding="utf-8")
    except subprocess.TimeoutExpired:
        log.error("Timeout")
        return False
    if r.returncode != 0:
        log.error(f"Exit {r.returncode}")
        log.error((r.stderr or "")[-1500:])
        return False
    return True


def strip_rsc_txt() -> None:
    """Strip Next.js RSC payload .txt files; keep llms.txt/llms-full.txt/robots.txt."""
    if not OUT_DIR.exists():
        return
    removed = 0
    for p in OUT_DIR.rglob("*.txt"):
        if p.name in KEEP_TXT:
            continue
        p.unlink()
        removed += 1
    log.info(f"Stripped {removed} RSC .txt files")


def build_and_deploy() -> bool:
    log.info("=== build + deploy starting ===")
    t0 = time.time()

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)

    env = os.environ.copy()
    env.setdefault("NEXT_PUBLIC_SITE_URL", "https://thailandgolfguide.com")
    env.setdefault("NEXT_PUBLIC_BRAND", "Thailand Golf Guide")

    if not run(["npx", "next", "build"], env=env):
        return False

    strip_rsc_txt()

    if not (env.get("CLOUDFLARE_API_TOKEN") and env.get("CLOUDFLARE_ACCOUNT_ID")):
        log.error("CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID missing — skipping deploy")
        return False

    deploy_ok = run(
        ["npx", "wrangler@latest", "pages", "deploy", "out",
         f"--project-name={PROJECT_NAME}", "--branch=main", "--commit-dirty=true"],
        env=env,
    )
    log.info(f"=== done ({time.time() - t0:.0f}s) ===")
    return deploy_ok


def main() -> None:
    log.info(f"auto_deploy_loop start PID={os.getpid()} (poll={POLL_INTERVAL}s)")

    last = latest_mtime()
    if last == 0:
        log.warning("No data files found — exiting")
        sys.exit(1)

    # First-run deploy if requested
    if "--deploy-now" in sys.argv:
        build_and_deploy()

    while True:
        time.sleep(POLL_INTERVAL)
        cur = latest_mtime()
        if cur > last:
            log.info(f"Change detected (+{cur - last:.0f}s)")
            if build_and_deploy():
                last = cur
        else:
            log.info("No change")


if __name__ == "__main__":
    main()
