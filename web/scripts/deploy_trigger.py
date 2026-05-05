"""Vercel deploy hook trigger.

watchdog 가 30분마다 실행 — master_db.json 이 직전 deploy 이후 변경됐으면
Vercel deploy hook URL 호출해서 prod 재배포 트리거.

VERCEL_DEPLOY_HOOK 환경변수 필요. Vercel dashboard → Settings → Git →
Deploy Hooks 에서 생성.
"""
from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
STATE_FILE = ROOT / "run" / "deploy_trigger.state"


def main():
    hook = os.environ.get("VERCEL_DEPLOY_HOOK", "").strip()
    if not hook:
        print("[deploy_trigger] VERCEL_DEPLOY_HOOK 미설정 — 종료", file=sys.stderr)
        sys.exit(0)

    if not MASTER_DB.exists():
        print(f"[deploy_trigger] {MASTER_DB} 없음 — 종료", file=sys.stderr)
        sys.exit(0)

    # State: 직전 trigger 시 master_db mtime
    last_mtime = 0.0
    if STATE_FILE.exists():
        try:
            last_mtime = float(STATE_FILE.read_text().strip())
        except (OSError, ValueError):
            last_mtime = 0.0

    cur_mtime = MASTER_DB.stat().st_mtime
    if cur_mtime <= last_mtime:
        print(f"[deploy_trigger] 변경 없음 (mtime {cur_mtime:.0f}) — 스킵")
        return

    # POST to Vercel deploy hook
    print(f"[deploy_trigger] master_db 변경 감지 → Vercel deploy 트리거 (mtime {cur_mtime:.0f})")
    try:
        req = Request(hook, data=b"", method="POST",
                      headers={"User-Agent": "bangkokclinics-deploy-trigger/1.0"})
        with urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8", errors="replace")[:500]
            print(f"[deploy_trigger] Vercel response {resp.status}: {body}")
    except URLError as e:
        print(f"[deploy_trigger] 트리거 실패: {e}", file=sys.stderr)
        sys.exit(1)

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(str(cur_mtime))
    print(f"[deploy_trigger] state 저장: {cur_mtime:.0f}")


if __name__ == "__main__":
    main()
