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
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WEB = Path(__file__).resolve().parent.parent
DATA = WEB / "data"
DB_PATH = DATA / "master_db.json"
# 날짜별 백업. 고정 이름 하나에 `if not exists` 를 걸면, 그 파일이 한 번
# 생긴 뒤로는 백업이 영구히 건너뛰어진다 — bak-pre-rematch 는 2026-05-19
# 의 8.8MB 사본이었고, 그걸 "백업했다"고 믿은 채 25MB 를 덮어쓸 참이었다.
BAK = DATA / f"master_db.json.bak-pre-rematch-{date.today().isoformat()}"
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
            # 등기 유형 코드. info/{jp_type}/{reg_no} 를 부를 때 필요하고, 그게
            # 설립일·TSIC·사업목적·재무를 가져오는 유일한 경로다. 저장하지
            # 않으면 보강 패스가 사라진 후보 파일에 의존하게 된다.
            "jp_type": c.get("dbd_jpType"),
            "legal_name": c.get("dbd_name"),
            # 등기부 영문명. 이게 없으면 이 머지는 다음 rebuild 에서 되돌려진다:
            # reject_bad_dbd_matches 는 상호를 legal_name 과만 비교하는데, 이
            # 후보들은 대부분 영문명으로 일치한 것이라 (2026-10-31 실측 929건
            # 중 대부분) 태국어 legal_name 과는 문자 체계가 달라 영원히
            # 불일치다. 저쪽 가드도 같은 날 legal_name_en 을 보도록 고쳤다.
            "legal_name_en": c.get("dbd_name_e"),
            "capital_thb": c.get("dbd_capAmt"),
            # 아래 셋은 search 응답에 없고 info/{jp_type}/{reg_no} 에만 있다.
            # scripts/dbd_enrich_matched.py 가 머지 후에 채운다 — 비워두면
            # supplier 페이지의 "Est. YYYY", 업종 분류, 동종업체 섹션,
            # 사업목적 문단이 모두 빈칸인 tier A 페이지가 된다.
            "registered_date": None,
            "tsic_code": None,
            "purpose": None,
            "address": c.get("dbd_address"),
            "match_score": float(c["score"]),
            "match_kind": c.get("name_match"),
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
