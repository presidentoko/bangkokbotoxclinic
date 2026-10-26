"""data/master_db.json 의 district 를 web/scripts/build_master_db.py 의
extract_district 로 다시 판정한다 (2026-10-26).

master_db.json 은 web/ 빌드 결과를 복사해 오는 파일이라 빌더를 고쳐도 다음
복사 전까지는 옛 판정이 남는다. 이 스크립트는 district 필드만 바꾸고, 바뀐
클리닉의 옛 district 를 data/district_moves.json 에 남긴다 — 클리닉 URL 슬러그에
구 이름이 들어가므로 next.config.ts 가 이 파일로 옛 슬러그를 새 슬러그로 301 한다.

실행: python scripts/apply_district_fix.py   (web-cf/ 에서)
"""
import importlib.util
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
DB = HERE / "data" / "master_db.json"
MOVES = HERE / "data" / "district_moves.json"
BUILDER = HERE.parent / "web" / "scripts" / "build_master_db.py"

spec = importlib.util.spec_from_file_location("bmd", BUILDER)
bmd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bmd)

db = json.loads(DB.read_text(encoding="utf-8"))
moves: dict[str, list[str]] = json.loads(MOVES.read_text(encoding="utf-8")) if MOVES.exists() else {}

changed = 0
for c in db["clinics"]:
    old = c.get("district") or ""
    new = bmd.extract_district(c.get("address") or "", c.get("city_label") or "Bangkok")
    if new == old:
        continue
    if old:
        seen = moves.setdefault(c["id"], [])
        if old not in seen:
            seen.append(old)
    c["district"] = new
    changed += 1

DB.write_text(json.dumps(db, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
MOVES.write_text(json.dumps(moves, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print(f"[apply_district_fix] district 변경 {changed}곳, 이력 {len(moves)}곳")
sys.exit(0)
