"""Ship a data update to production, then tell IndexNow about it.

Why this exists: neither the `2nd` nor the `chicpreowned` Vercel project is
connected to a git repo (`link: null` on both). The price samplers commit and
push their `items_db.json` daily and stop there, on the assumption that a push
triggers a Vercel build — it cannot. Between 2026-07-18 and 2026-08-18 both
sites served a month-old build while fresh price commits piled up in git, and
nothing surfaced the gap: the scrapers reported success every single day.

So a push is not a deploy here. Call this right after the push.

    from scripts.deploy_after_data import deploy
    deploy("2nd")          # or "3rd"

Needs a Vercel token for the *yunmin* team (both projects live there). Reads
VERCEL_TOKEN_YUNMIN from the repo-root .env, falling back to the environment.
The name is deliberately not plain VERCEL_TOKEN: .env already holds several
account-scoped tokens, and the bare one belongs to a different account that
gets 403 on these two projects — silently deploying nothing, or worse, to the
wrong place.

Without a token this prints a loud warning and returns False rather than
raising — a failed deploy must not take the scraper down with it, but it must
never look like a success either.
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# The samplers are launched by watchdog.py, which just copies os.environ and
# never loads .env — so read it here rather than assuming the parent shell did.
try:
    from dotenv import load_dotenv

    load_dotenv(ROOT / ".env")
except ImportError:
    pass

# site key -> (directory under ROOT, indexnow_ping.py site id)
SITES = {
    "2nd": ("2nd", "luxury2nd"),
    "3rd": ("3rd", "chicpreowned"),
}


def deploy(site: str) -> bool:
    entry = SITES.get(site)
    if entry is None:
        print(f"[deploy] unknown site {site!r}; expected one of {sorted(SITES)}")
        return False
    subdir, indexnow_id = entry

    token = os.environ.get("VERCEL_TOKEN_YUNMIN")
    if not token:
        print(
            "[deploy] VERCEL_TOKEN_YUNMIN not set (add it to the repo-root "
            ".env) — data is committed and pushed but NOT deployed. The live "
            "site still serves the previous build.",
            file=sys.stderr,
        )
        return False

    cwd = ROOT / subdir
    print(f"[deploy] deploying {site} from {cwd}")
    result = subprocess.run(
        [
            "npx", "vercel", "deploy",
            "--prod", "--yes", "--archive=tgz",
            f"--token={token}",
        ],
        cwd=cwd,
        capture_output=True,
        text=True,
        shell=(os.name == "nt"),
    )
    if result.returncode != 0:
        print(f"[deploy] {site} deploy FAILED:\n{result.stderr[-2000:]}", file=sys.stderr)
        return False
    print(f"[deploy] {site} deployed")

    # Only worth pinging once the new build is actually live.
    ping = ROOT / "scripts" / "indexnow_ping.py"
    if ping.exists():
        subprocess.run([sys.executable, str(ping), indexnow_id], check=False)
    return True


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else ""
    sys.exit(0 if deploy(target) else 1)
