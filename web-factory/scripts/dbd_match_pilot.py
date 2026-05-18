"""master_db 의 supplier 들을 DBD 와 매칭하는 파일럿.

사용:
    python scripts/dbd_match_pilot.py            # top 20 by trust_score
    python scripts/dbd_match_pilot.py 100        # top 100
    python scripts/dbd_match_pilot.py 100 --all  # 무작위 100 (trust_score 무시)

산출물:
    data/dbd/match_pilot.json   매칭 결과 (잡힌 거 + 안 잡힌 거 + score)
"""
from __future__ import annotations

import json
import logging
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).parent))
from lib_dbd import DbdClient, normalize_keyword, name_variants, score_match


HERE = Path(__file__).parent
DATA = HERE.parent / "data"
DBD_OUT = DATA / "dbd"
DBD_OUT.mkdir(exist_ok=True)
PILOT_OUT = DBD_OUT / "match_pilot.json"

MIN_CONFIDENCE = 60  # below this 는 unmatched 처리


def best_match(client: DbdClient, supplier: dict, log: logging.Logger) -> tuple[dict | None, int, list[str]]:
    """Returns (best_dbd_hit, score, variants_tried)."""
    variants = name_variants(supplier.get("name", ""))
    best: dict | None = None
    best_score = 0
    tried: list[str] = []
    for kw in variants:
        if not kw:
            continue
        tried.append(kw)
        try:
            hits = client.search(kw)
        except Exception as e:
            log.warning(f"  search FAIL '{kw}': {type(e).__name__}: {e!s:.80}")
            continue
        for h in hits[:10]:  # top 10 후보만 봄
            sc = score_match(supplier, h)
            if sc > best_score:
                best_score = sc
                best = h
        if best_score >= 80:
            break  # 정확 매치
    return best, best_score, tried


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    log = logging.getLogger("pilot")

    n = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    use_all = "--all" in sys.argv

    db = json.loads((DATA / "master_db.json").read_text(encoding="utf-8"))
    suppliers = db["suppliers"]
    # B2B 관련 카테고리만 — 리테일/호텔/식당/사찰 등 제거
    B2B_CATS = {
        "manufacturer", "packaging", "auto_parts", "electronics",
        "food_mfg", "machining", "plastic", "steel", "machinery",
        "rubber", "chemical", "textile", "exporter", "equipment",
    }
    suppliers = [s for s in suppliers if any(c in B2B_CATS for c in s.get("categories", []))]
    if not use_all:
        suppliers = sorted(suppliers, key=lambda s: s.get("trust_score", 0), reverse=True)
    suppliers = suppliers[:n]

    log.info(f"pilot on {len(suppliers)} suppliers")
    client = DbdClient(polite_delay=0.6)

    out: list[dict] = []
    matched = 0
    for i, sup in enumerate(suppliers, 1):
        sup_id = sup.get("id")
        name = sup.get("name", "")
        try:
            hit, score, tried = best_match(client, sup, log)
        except KeyboardInterrupt:
            log.warning("interrupted — saving partial")
            break
        except Exception as e:
            log.warning(f"  ERROR sup={sup_id} name={name!r}: {type(e).__name__}: {e!s:.80}")
            out.append({"supplier_id": sup_id, "supplier_name": name, "error": str(e)})
            continue

        if hit and score >= MIN_CONFIDENCE:
            matched += 1
            log.info(f"  [{i:3d}/{len(suppliers)}] ✓ {score:3d}  {name!r:50.50}  →  {hit.get('jpName')!r:40.40}  jpNo={hit.get('jpNo')}")
            out.append({
                "supplier_id": sup_id,
                "supplier_name": name,
                "supplier_trust": sup.get("trust_score"),
                "supplier_city": sup.get("city_label"),
                "supplier_district": sup.get("district"),
                "match_score": score,
                "variants_tried": tried,
                "dbd_jpNo": hit.get("jpNo"),
                "dbd_jpType": hit.get("jpTypeCode"),
                "dbd_name": hit.get("jpName"),
                "dbd_nameE": hit.get("jpNameE"),
                "dbd_capAmt": hit.get("capAmt"),
                "dbd_status": hit.get("jpStatusCode"),
                "dbd_businessSize": hit.get("businessSizeCode"),
                "dbd_address": hit.get("address"),
            })
        else:
            sc_str = f"{score}" if hit else "—"
            log.info(f"  [{i:3d}/{len(suppliers)}] ✗ {sc_str:>3}  {name!r:50.50}  variants={tried}")
            out.append({
                "supplier_id": sup_id,
                "supplier_name": name,
                "supplier_trust": sup.get("trust_score"),
                "match_score": score,
                "variants_tried": tried,
                "candidate_name": hit.get("jpName") if hit else None,
                "candidate_jpNo": hit.get("jpNo") if hit else None,
            })

    PILOT_OUT.write_text(json.dumps({
        "n_attempted": len(out),
        "n_matched": matched,
        "min_confidence": MIN_CONFIDENCE,
        "results": out,
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    log.info(f"\nDONE — matched {matched}/{len(out)}  ({matched/max(len(out),1)*100:.1f}%)")
    log.info(f"saved → {PILOT_OUT}")


if __name__ == "__main__":
    main()
