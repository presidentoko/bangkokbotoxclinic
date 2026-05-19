"""rematch_candidates.json (≥90) → master_db.json 머지.

각 candidate 의 dbd info 를 supplier 에 적용 + verified=True 마킹.
이미 verified 인 supplier 는 skip (기존 데이터 우선).

산출:
    data/master_db.json — 4건 신규 verified 추가
    data/master_db.json.bak-pre-rematch — 백업
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WEB = Path(__file__).resolve().parent.parent
DATA = WEB / "data"
DB_PATH = DATA / "master_db.json"
BAK = DATA / "master_db.json.bak-pre-rematch"
CAND = DATA / "dbd" / "rematch_candidates.json"


def main() -> None:
    if not BAK.exists():
        BAK.write_bytes(DB_PATH.read_bytes())
        print(f"backup → {BAK}")

    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    cands = json.loads(CAND.read_text(encoding="utf-8"))
    print(f"candidates to merge: {len(cands)}")

    by_id = {s["id"]: s for s in db["suppliers"]}
    merged = 0
    skipped = 0
    for c in cands:
        sid = c["supplier_id"]
        sup = by_id.get(sid)
        if not sup:
            print(f"  ✗ supplier not found: {sid}")
            continue
        if sup.get("verified"):
            print(f"  · already verified, skip: {sup['name'][:40]}")
            skipped += 1
            continue
        sup["verified"] = True
        sup["dbd"] = {
            "reg_no": c.get("dbd_jpNo"),
            "legal_name": c.get("dbd_name"),
            "capital_thb": c.get("dbd_capAmt"),
            "registered_date": None,   # only in /info/{type}/{regno} call, not in search
            "tsic_code": None,
            "purpose": None,
            "address": c.get("dbd_address"),
            "match_score": float(c["score"]),
        }
        merged += 1
        print(f"  ✓ merged: {sup['name'][:40]:40}  → {c.get('dbd_name','')[:35]}  cap={c.get('dbd_capAmt')}")

    # Update top-level counts
    db["verified_count"] = sum(1 for s in db["suppliers"] if s.get("verified"))
    db["with_dbd"]       = sum(1 for s in db["suppliers"] if s.get("dbd"))

    DB_PATH.write_text(json.dumps(db, ensure_ascii=False, indent=2, allow_nan=False), encoding="utf-8")
    print()
    print(f"DONE — merged {merged} new, skipped {skipped}")
    print(f"verified_count now: {db['verified_count']}")


if __name__ == "__main__":
    main()
