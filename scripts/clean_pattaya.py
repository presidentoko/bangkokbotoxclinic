"""
pattaya/output 안에 섞여 들어간 Bangkok 데이터 제거.

전제:
- pattaya 중심 12.9236, 100.8825, 반경 20km
- Bangkok 중심 13.7462, 100.5346 (90km 이상 떨어짐)
- 유효 영역: lat [12.7, 13.1], lng [100.7, 101.1]
- 영역 밖 데이터는 모두 ../output_bangkok_corrupted/ 로 백업 후 제거

처리 순서:
1. discovered_places.csv 분리 (first_seen_lat/lng 기준)
2. 유효 place_id set 추출
3. restaurants.csv, restaurant_hours.csv, restaurant_features.csv 필터
4. reviews/*.csv 중 무효 place_id 파일 백업/삭제
5. discovered_places.checkpoint 삭제 (grid 재시작 시 처음부터)
"""
from __future__ import annotations

import csv
import shutil
import sys
from pathlib import Path

csv.field_size_limit(2**30)

OUTPUT = Path(__file__).parent.parent / "pattaya" / "output"
BACKUP = Path(__file__).parent.parent / "pattaya" / "output_bangkok_corrupted"

LAT_MIN, LAT_MAX = 12.7, 13.1
LNG_MIN, LNG_MAX = 100.7, 101.1


def in_bounds(lat: float, lng: float) -> bool:
    return LAT_MIN <= lat <= LAT_MAX and LNG_MIN <= lng <= LNG_MAX


def fnum(s: str) -> float | None:
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def split_csv(src: Path, dst_keep: Path, dst_drop: Path,
              decide_keep) -> tuple[int, int]:
    """decide_keep(row_dict) -> bool. row_dict는 컬럼명 → 값."""
    with open(src, newline="", encoding="utf-8-sig", errors="replace") as f:
        r = csv.DictReader(f)
        fieldnames = r.fieldnames
        keep_rows, drop_rows = [], []
        for row in r:
            (keep_rows if decide_keep(row) else drop_rows).append(row)

    def _write(path: Path, rows: list[dict]):
        with open(path, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_NONNUMERIC)
            w.writeheader()
            for row in rows:
                w.writerow(row)

    _write(dst_keep, keep_rows)
    if drop_rows:
        _write(dst_drop, drop_rows)
    return len(keep_rows), len(drop_rows)


def main() -> int:
    if not OUTPUT.exists():
        print(f"output not found: {OUTPUT}", file=sys.stderr)
        return 1

    BACKUP.mkdir(exist_ok=True)
    (BACKUP / "reviews").mkdir(exist_ok=True)

    # ── 1. discovered_places.csv ──
    src = OUTPUT / "discovered_places.csv"
    dropped = BACKUP / "discovered_places.csv"
    print(f"[1/5] {src.name} 분리 중...")
    keep, drop = split_csv(
        src, src, dropped,
        lambda row: (
            (lat := fnum(row.get("first_seen_lat", ""))) is not None
            and (lng := fnum(row.get("first_seen_lng", ""))) is not None
            and in_bounds(lat, lng)
        ),
    )
    print(f"  유지 {keep:,} / 제거 {drop:,}")

    # 유효 place_id set
    valid_ids: set[str] = set()
    with open(src, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            pid = row.get("place_id", "").strip()
            if pid:
                valid_ids.add(pid)
    print(f"  유효 place_id: {len(valid_ids):,}")

    # ── 2. restaurants.csv ──
    src = OUTPUT / "restaurants.csv"
    if src.exists():
        dropped = BACKUP / "restaurants.csv"
        print(f"[2/5] {src.name} 필터 중...")
        keep, drop = split_csv(
            src, src, dropped,
            lambda row: row.get("place_id", "").strip() in valid_ids,
        )
        print(f"  유지 {keep:,} / 제거 {drop:,}")

    # ── 3. restaurant_hours.csv ──
    src = OUTPUT / "restaurant_hours.csv"
    if src.exists():
        dropped = BACKUP / "restaurant_hours.csv"
        print(f"[3/5] {src.name} 필터 중...")
        keep, drop = split_csv(
            src, src, dropped,
            lambda row: row.get("place_id", "").strip() in valid_ids,
        )
        print(f"  유지 {keep:,} / 제거 {drop:,}")

    # ── 4. restaurant_features.csv ──
    src = OUTPUT / "restaurant_features.csv"
    if src.exists():
        dropped = BACKUP / "restaurant_features.csv"
        print(f"[4/5] {src.name} 필터 중...")
        keep, drop = split_csv(
            src, src, dropped,
            lambda row: row.get("place_id", "").strip() in valid_ids,
        )
        print(f"  유지 {keep:,} / 제거 {drop:,}")

    # ── 5. reviews/ ──
    reviews_dir = OUTPUT / "reviews"
    if reviews_dir.exists():
        print(f"[5/5] reviews/ 정리 중...")
        kept = dropped = 0
        for f in reviews_dir.iterdir():
            if not f.is_file():
                continue
            # 파일명 형식: <place_id>_<reviews|meta>.csv
            stem = f.stem  # e.g. 0x30e29916f7bc1a6b_0xd7abaa5b13a1d242_reviews
            # place_id 는 형식이 0xHEX:0xHEX 또는 ChIJ... — 파일명에서는 콜론이 _ 로 치환된 듯
            # 일단 안전하게: stem 끝에서 _reviews/_meta 떼고 _ 를 : 로 첫 1개만 치환
            for suffix in ("_reviews", "_meta"):
                if stem.endswith(suffix):
                    head = stem[: -len(suffix)]
                    break
            else:
                head = stem
            # head 안의 첫 _ 를 : 로 바꿔서 place_id 복원 (0xAAAA_0xBBBB → 0xAAAA:0xBBBB)
            if head.count("_") >= 1 and head.startswith("0x"):
                pid = head.replace("_", ":", 1)
            else:
                pid = head
            if pid in valid_ids:
                kept += 1
            else:
                shutil.move(str(f), str(BACKUP / "reviews" / f.name))
                dropped += 1
        print(f"  유지 {kept:,} / 백업 {dropped:,}")

    # ── 6. checkpoint 삭제 ──
    cp = OUTPUT / "discovered_places.checkpoint"
    if cp.exists():
        shutil.move(str(cp), str(BACKUP / "discovered_places.checkpoint"))
        print(f"[+] discovered_places.checkpoint 백업/삭제")

    print("\n완료. 백업 위치:", BACKUP)
    return 0


if __name__ == "__main__":
    sys.exit(main())
