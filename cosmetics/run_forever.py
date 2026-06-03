"""Durable multi-day driver: re-runs the supervisor pass after pass, forever, so
failed (waf/timeout/error) products get retried on later passes as the tunnel pool
varies, and any newly-listed products get picked up. Completed ("ok") products are
skipped via progress.json, so passes get cheaper over time.

Stops cleanly when cosmetics/state/STOP exists. Safe to kill/relaunch (idempotent).

Run detached (survives the controlling session):
    set COSMETICS_PORT_LIST=2090,2091,2086,2087
    python -m cosmetics.run_forever
"""
from __future__ import annotations
import json, os, subprocess, sys, time
from pathlib import Path

from cosmetics import config

PY = sys.executable
PASS_GAP = int(os.getenv("COSMETICS_PASS_GAP", "180"))   # rest between full passes
STOP_FILE = config.STATE_DIR / "STOP"
LOG = config.STATE_DIR / "forever.log"


def _log(msg: str) -> None:
    line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} [forever] {msg}"
    print(line, flush=True)
    try:
        with LOG.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def _ok_count() -> int:
    try:
        prog = json.loads((config.STATE_DIR / "progress.json").read_text(encoding="utf-8"))
        return sum(1 for v in prog.values() if v.get("status") == "ok")
    except Exception:
        return 0


def main() -> int:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ, PYTHONUTF8="1", PYTHONIOENCODING="utf-8")
    pass_no = 0
    _log(f"start. ports={os.getenv('COSMETICS_PORT_LIST', '2090,2091')} gap={PASS_GAP}s")
    while not STOP_FILE.exists():
        pass_no += 1
        before = _ok_count()
        _log(f"pass {pass_no} begin (ok so far={before})")
        try:
            subprocess.run([PY, "-m", "cosmetics.konvy_supervise"], env=env,
                           cwd=str(Path(__file__).resolve().parents[1]))
        except Exception as e:
            _log(f"pass {pass_no} supervisor error: {str(e)[:120]}")
        after = _ok_count()
        _log(f"pass {pass_no} end (ok now={after}, +{after - before})")
        if STOP_FILE.exists():
            break
        time.sleep(PASS_GAP)
    _log("STOP file seen -> exit")
    return 0


if __name__ == "__main__":
    sys.exit(main())
