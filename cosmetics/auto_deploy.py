"""Cosmetics auto-deploy loop — fully automatic, no manual steps.

Watches the scraped product count. When it increases (run_forever added new products):
  1. python -m cosmetics.build_master_db  — rebuild master_db.json
  2. python -m cosmetics.gen_summaries    — LLM summaries (if ANTHROPIC_API_KEY set)
  3. vercel deploy --prod                 — deploy directly to bangkokfillers.com

The Vercel token is resolved by trying every source and keeping the first that
actually authenticates: COSMETICS_VERCEL_TOKEN or VERCEL_TOKEN (real env vars
first, then the repo's .env), then whatever `vercel login` left in auth.json.
Validating rather than trusting matters — an expired auth.json used to shadow a
working token and fail every deploy silently.

Free plan optimization:
  - Only deploys when MIN_NEW_PRODUCTS or more new products accumulate, AND at
    least MIN_INTERVAL_HOURS have passed since the last deploy.
  - git commit still runs every cycle so data is versioned regardless

  Why both gates: a deploy rebuilds every prerendered page (~3,555 of them as
  of 2026-08-19), and Next writes several cache objects per route, so one
  deploy costs on the order of 14K ISR writes. The Hobby budget is 200K/month
  — roughly 14 deploys. The old settings (5 new products, no interval) let the
  scraper trigger a deploy every few hours and put ISR Writes at 406K/200K.
  Deploying is now the scarce resource, not the product count.

  A second, tighter limit turned up on 2026-09-10: Deployment Storage hit
  25.63GB against a 10GB cap. Every deploy of this site weighs ~1.1GB (5,878
  prerendered routes: 21K .rsc payloads, 2.3K .html, 1.2K OG images) and
  Vercel had kept all 23 of them, back to 2026-07-13. The project carries a
  retention policy (30 days, keep 10) but Hobby does not enforce it — the
  API returns the setting and ignores it. At 1.1GB each the cap allows only
  nine retained deploys, which is tighter than the ISR write budget, so the
  pruning below is not housekeeping: without it deploys eventually fail.

Optional env vars:
  ANTHROPIC_API_KEY            — enables gen_summaries for new products
  COSMETICS_DEPLOY_POLL        — poll interval in seconds (default: 300)
  COSMETICS_MIN_NEW_PRODUCTS   — min new products before deploying (default: 40)
  COSMETICS_MIN_INTERVAL_HOURS — min hours between deploys (default: 72)
  COSMETICS_KEEP_DEPLOYMENTS   — deploys retained after pruning (default: 3)

Run via ensure_collector.ps1 (auto-started) or manually:
  python -m cosmetics.auto_deploy
"""
from __future__ import annotations
import json, logging, os, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

WT        = Path(__file__).resolve().parent.parent
PROD_DIR  = WT / "cosmetics" / "output" / "products"
STATE_DIR = WT / "cosmetics" / "state"
WEB_DIR   = WT / "cosmetics" / "web"
STOP_FILE = STATE_DIR / "STOP"
PY        = sys.executable

POLL      = int(os.getenv("COSMETICS_DEPLOY_POLL", "300"))         # 5 min
MIN_NEW   = int(os.getenv("COSMETICS_MIN_NEW_PRODUCTS", "40"))    # ISR write guard
MIN_HOURS = int(os.getenv("COSMETICS_MIN_INTERVAL_HOURS", "72"))  # ISR write guard
KEEP_DEPLOYS = int(os.getenv("COSMETICS_KEEP_DEPLOYMENTS", "3"))  # storage guard
LAST_DEPLOY = STATE_DIR / "last_deploy.json"

# Vercel CLI auth file — written by `vercel login`
_VERCEL_AUTH = Path(os.getenv("APPDATA", "")) / "com.vercel.cli" / "Data" / "auth.json"

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [auto_deploy] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger(__name__)


# ── helpers ──────────────────────────────────────────────────────────────────

def product_count() -> int:
    return len(list(PROD_DIR.glob("*.json"))) if PROD_DIR.exists() else 0


def _hours_since_last_deploy() -> float:
    """Hours since the last successful deploy, or a large number if unknown.

    Survives a restart of this loop: without the file the first deploy after a
    restart would always be allowed, which is how the interval gate would get
    silently bypassed by a watchdog restart cycle.
    """
    try:
        ts = json.loads(LAST_DEPLOY.read_text(encoding="utf-8"))["ts"]
    except Exception:
        return 1e9
    return (time.time() - float(ts)) / 3600.0


def _record_deploy() -> None:
    try:
        LAST_DEPLOY.write_text(json.dumps({"ts": time.time()}), encoding="utf-8")
    except Exception as exc:
        log.warning(f"could not record deploy time: {exc}")


def _env_file() -> dict:
    """Read KEY=VALUE pairs out of the repo's .env.

    ensure_collector.ps1 starts this loop with Start-Process, which inherits the
    launching service's environment rather than a shell that sourced .env, so
    anything stored there never arrives as a real env var. Reading the file here
    is the only way secrets kept in .env reach this process.
    """
    out: dict[str, str] = {}
    try:
        raw = (WT / ".env").read_text(encoding="utf-8-sig")
    except Exception:
        return out
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def _token_works(token: str) -> bool:
    try:
        _vercel_api(token, "/v2/user")
        return True
    except Exception:
        return False


def _vercel_token() -> str:
    """Return the first Vercel token that actually authenticates.

    The previous version returned the first token it could *read*, which is a
    different thing. `vercel login` leaves auth.json in place forever, so once
    that token expired it shadowed every other source — including a perfectly
    good VERCEL_TOKEN — and every deploy failed with "Not authorized" while the
    working credential sat one branch away, unused (observed 2026-09-10).

    Each candidate is now spent on a cheap /v2/user call before being trusted,
    and the winning source is logged so a stale credential is visible in the log
    rather than silent.
    """
    envf = _env_file()
    candidates = [
        ("COSMETICS_VERCEL_TOKEN (env)",  os.getenv("COSMETICS_VERCEL_TOKEN", "")),
        ("VERCEL_TOKEN (env)",            os.getenv("VERCEL_TOKEN", "")),
        ("COSMETICS_VERCEL_TOKEN (.env)", envf.get("COSMETICS_VERCEL_TOKEN", "")),
        ("VERCEL_TOKEN (.env)",           envf.get("VERCEL_TOKEN", "")),
    ]
    for path in [_VERCEL_AUTH,
                 Path(os.getenv("APPDATA", "")) / "xdg.data" / "com.vercel.cli" / "auth.json"]:
        try:
            tok = json.loads(path.read_text(encoding="utf-8-sig")).get("token", "")
        except Exception:
            continue
        candidates.append((f"vercel login ({path.parent.name})", tok))

    for source, token in candidates:
        if not token:
            continue
        if _token_works(token):
            log.info(f"vercel auth: using {source}")
            return token
        log.warning(f"vercel auth: {source} rejected — trying next source")
    return ""


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


def _vercel_api(token: str, path: str, method: str = "GET"):
    req = urllib.request.Request(f"https://api.vercel.com{path}",
                                 headers={"Authorization": f"Bearer {token}"},
                                 method=method)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read() or b"{}")


def prune_deployments(token: str) -> None:
    """Delete every deployment past the newest KEEP_DEPLOYS, sparing aliased ones.

    Hobby ignores the project's retention policy, so nothing expires on its own
    and Deployment Storage climbs by ~1.1GB per deploy against a 10GB cap.

    What counts as "live" is the alias table, not the deployment record. Every
    production deployment's own `alias` field lists the hostnames it was given
    when it was created, so all 23 of them claimed bangkokfillers.com and a
    guard reading that field refuses to delete anything. /v4/aliases is the
    only view that says where a hostname points *now*; any deployment still
    referenced there is spared regardless of age.
    """
    try:
        link = json.loads((WEB_DIR / ".vercel" / "project.json").read_text(encoding="utf-8"))
        team, proj = link["orgId"], link["projectId"]
    except Exception as e:
        log.warning(f"prune skipped — cannot read .vercel/project.json ({e})")
        return

    try:
        aliases = _vercel_api(token, f"/v4/aliases?teamId={team}&projectId={proj}&limit=100")
        pinned = {a.get("deploymentId") for a in aliases.get("aliases", [])}
        deploys = _vercel_api(token, f"/v6/deployments?teamId={team}&projectId={proj}&limit=100")
        ordered = sorted(deploys.get("deployments", []), key=lambda d: -d["created"])
    except Exception as e:
        log.warning(f"prune skipped — Vercel API unreachable ({e})")
        return

    stale = [d for d in ordered[KEEP_DEPLOYS:] if d["uid"] not in pinned]
    if not stale:
        log.info(f"prune: {len(ordered)} deployments, nothing to remove")
        return

    removed = 0
    for d in stale:
        try:
            _vercel_api(token, f"/v13/deployments/{d['uid']}?teamId={team}", method="DELETE")
            removed += 1
        except Exception as e:
            log.warning(f"prune: could not delete {d['uid']} ({e})")
    log.info(f"prune: removed {removed}/{len(stale)}, "
             f"{len(ordered) - removed} deployments retained")


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

    prune_deployments(token)

    log.info(f"=== ✓ bangkokfillers.com updated with {new_count} products ===")
    return True


# ── main loop ─────────────────────────────────────────────────────────────────

def main() -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    log.info(f"start PID={os.getpid()} poll={POLL}s min_new={MIN_NEW} min_interval={MIN_HOURS}h")

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
                waited = _hours_since_last_deploy()
                if waited < MIN_HOURS:
                    log.info(f"{pending_new} new products ready but only "
                             f"{waited:.1f}h since last deploy (need {MIN_HOURS}h) "
                             f"— holding")
                elif build_and_deploy(last_count, cur):
                    _record_deploy()
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
