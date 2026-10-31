"""머지된 DBD 매칭에 설립일·업종·사업목적·재무를 채운다.

dbd_rematch_overnight.py 는 검색 응답만 보므로 reg_no / 법인명 / 자본금 /
주소까지만 알 수 있다. supplier 페이지(app/supplier/[id]/page.tsx)가 실제로
렌더하는 것은 그보다 넓다:

    registered_date  → "Est. 1994"
    tsic_code        → 업종 분류 + "같은 TSIC 동종업체" 섹션
    purpose          → 사업목적 문단
    capital_thb      → "฿40M capital"
    reg_no           → "Reg. 0107537002133"

그래서 머지만 하면 그 세 칸이 빈 tier A 페이지가 된다. 기존 verified 305 곳은
원래 CSV 파이프라인에서 그 값을 받아 **채워진** 페이지였고, 측정된 CTR 3.05%
(전체 평균 0.91%)는 채워진 쪽의 숫자다. 빈 배지만 달면 그 레버가 아니다.

info/{jp_type}/{reg_no} 가 그 값들을 준다. 검색 1회로 끝나지 않는 이유가 이것
뿐이고, 매치된 곳만 부르면 되니 비용은 검색 패스의 1/4 이다.

함께 가져오는 것 — 전부 구글 맵 패널에 없는 것들이다:

    setupObjNameKeyin  회사가 직접 써 넣은 사업 설명. 회사마다 다른 고유 문장.
    totalIncome/Asset/netProfit/totalEquity   최근 제출 재무
    submitFinYear      재무제표를 제출한 연도들 (= 실제로 영업 중인지의 증거)
    jpStatus           ยังดำเนินกิจการอยู่ / 해산 등
    rdVatFlag          VAT 등록 여부

사용:
  python web-factory/scripts/dbd_enrich_matched.py            # 비어 있는 곳만
  python web-factory/scripts/dbd_enrich_matched.py --limit 50
  python web-factory/scripts/dbd_enrich_matched.py --all      # 이미 채워진 것도 갱신

master_db.json 을 제자리에서 고치고, 처음 실행 때 날짜별 백업을 남긴다.
"""
from __future__ import annotations

import json
import logging
import sys
import time
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
from lib_dbd import DbdClient  # noqa: E402

WEB = HERE.parent
DATA = WEB / "data"
DB_PATH = DATA / "master_db.json"
BAK = DATA / f"master_db.json.bak-pre-enrich-{date.today().isoformat()}"
LOG_FILE = WEB / "logs" / "dbd_enrich.log"


def setup_logging() -> logging.Logger:
    log = logging.getLogger("enrich")
    log.setLevel(logging.INFO)
    LOG_FILE.parent.mkdir(exist_ok=True)
    fh = logging.FileHandler(LOG_FILE, encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    log.addHandler(fh)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    log.addHandler(sh)
    return log


def _iso(v) -> str | None:
    """DBD 는 날짜를 [1994, 6, 10] 으로 준다."""
    if isinstance(v, (list, tuple)) and len(v) == 3:
        try:
            y, m, d = (int(x) for x in v)
            return f"{y:04d}-{m:02d}-{d:02d}"
        except (TypeError, ValueError):
            return None
    if isinstance(v, str) and len(v) >= 10:
        return v[:10]
    return None


def _num(v):
    return v if isinstance(v, (int, float)) else None


def enrich_block(dbd: dict, info: dict) -> list[str]:
    """info 응답을 dbd 블록에 반영한다. 바뀐 키 목록을 돌려준다."""
    changed: list[str] = []

    def put(key: str, value) -> None:
        if value in (None, "", []):
            return
        if dbd.get(key) != value:
            dbd[key] = value
            changed.append(key)

    put("registered_date", _iso(info.get("regDate")))

    # TSIC — 설립 목적 코드가 업종 분류다. 제출용 코드가 따로 있으면 그쪽이 더
    # 최신이지만, 페이지의 동종업체 비교는 설립 코드 기준으로 묶여 있다.
    tsic = info.get("setupObjCode") or info.get("submitObjCode")
    put("tsic_code", str(tsic) if tsic else None)

    obj = info.get("setupObjType") or info.get("submitObjType") or {}
    put("tsic_desc", (obj.get("objDesc") or "").strip() or None)

    # 사업목적 — 회사가 직접 써 넣은 문장이 있으면 그것, 없으면 분류 설명.
    purpose = (info.get("setupObjNameKeyin") or info.get("submitObjNameKeyin") or "").strip()
    put("purpose", purpose or (obj.get("objDesc") or "").strip() or None)

    status = info.get("jpStatus") or {}
    put("status", (status.get("jpStatDesc") or "").strip() or None)

    put("paid_capital_thb", _num(info.get("paidAmt")))
    fin = {
        "total_income": _num(info.get("totalIncome")),
        "total_asset": _num(info.get("totalAsset")),
        "net_profit": _num(info.get("netProfit")),
        "total_equity": _num(info.get("totalEquity")),
    }
    fin = {k: v for k, v in fin.items() if v is not None}
    if fin and dbd.get("financials") != fin:
        dbd["financials"] = fin
        changed.append("financials")

    years = (info.get("submitFinYear") or "").split()
    if years:
        put("filed_years", years)
    put("vat_registered", True if info.get("rdVatFlag") == "Y" else None)

    return changed


def main() -> int:
    log = setup_logging()
    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    suppliers = db["suppliers"]

    todo = []
    missing_type = 0
    for s in suppliers:
        d = s.get("dbd")
        if not d or not d.get("reg_no"):
            continue
        if "--all" not in sys.argv and d.get("registered_date"):
            continue
        if not d.get("jp_type"):
            missing_type += 1
            continue
        todo.append(s)

    if "--limit" in sys.argv:
        n = int(sys.argv[sys.argv.index("--limit") + 1])
        todo = todo[:n]

    log.info(f"보강 대상 {len(todo):,} 곳" + (f" · jp_type 없어 건너뜀 {missing_type:,}" if missing_type else ""))
    if not todo:
        return 0

    if not BAK.exists():
        BAK.write_bytes(DB_PATH.read_bytes())
        log.info(f"백업 → {BAK.name}")

    cli = DbdClient(polite_delay=0.7)
    ok = failed = 0
    t0 = time.time()
    for i, s in enumerate(todo, 1):
        d = s["dbd"]
        try:
            info = cli.info(str(d["jp_type"]), str(d["reg_no"]))
        except Exception as e:
            failed += 1
            log.warning(f"  [{i:4d}] info FAIL {d['reg_no']}: {type(e).__name__}")
            continue
        if not isinstance(info, dict):
            failed += 1
            continue
        changed = enrich_block(d, info)
        if changed:
            ok += 1

        if i % 50 == 0 or i == len(todo):
            rate = i / max(1e-9, time.time() - t0)
            eta = (len(todo) - i) / max(rate, 1e-9) / 60
            log.info(
                f"  [{i:4d}/{len(todo)}] 채움={ok} 실패={failed}  "
                f"rate={rate:.1f}/s eta={eta:.0f}min"
            )
            # 중간 저장 — 중단돼도 여기까지는 남는다.
            DB_PATH.write_text(
                json.dumps(db, ensure_ascii=False, indent=2, allow_nan=False),
                encoding="utf-8",
            )

    DB_PATH.write_text(
        json.dumps(db, ensure_ascii=False, indent=2, allow_nan=False), encoding="utf-8"
    )
    filled = sum(1 for s in suppliers if (s.get("dbd") or {}).get("registered_date"))
    log.info("=" * 56)
    log.info(f"DONE — 채움 {ok} · 실패 {failed}")
    log.info(f"registered_date 보유 supplier: {filled:,}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
