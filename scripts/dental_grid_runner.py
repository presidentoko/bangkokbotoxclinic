"""
치과 전용 그리드 러너 — 태국 전역 13개 도시, 도시별 5개 핵심 쿼리.

워커: 2개 (포트 2080-2081)
출력: dental_output/<city>/discovered_places.csv
흐름: phuket_clinics_grid 일시 정지 → 전 도시 완료 → phuket 재개
"""
import csv
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent.parent
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"
GRID_SCRIPT = ROOT / "bangkok_clinics" / "scraper_grid.py"
BASE_OUT = ROOT / "dental_output"
CHECKPOINT = BASE_OUT / "cities_done.txt"
PHUKET_DIS = ROOT / "run" / "phuket_clinics_grid.disabled"

# 외국인 치과 수요 순서
CITIES = [
    {"name": "bangkok",    "lat": "13.7462890", "lng": "100.5346890", "radius": "30000", "en": "bangkok",    "th": "กรุงเทพ",   "ko": "방콕"},
    {"name": "phuket",     "lat": "7.8804",     "lng": "98.3923",     "radius": "20000", "en": "phuket",     "th": "ภูเก็ต",    "ko": "푸켓"},
    {"name": "pattaya",    "lat": "12.9236",    "lng": "100.8825",    "radius": "20000", "en": "pattaya",    "th": "พัทยา",     "ko": "파타야"},
    {"name": "chiang_mai", "lat": "18.7883",    "lng": "98.9853",     "radius": "20000", "en": "chiang mai", "th": "เชียงใหม่", "ko": "치앙마이"},
    {"name": "koh_samui",  "lat": "9.5018",     "lng": "99.9648",     "radius": "15000", "en": "koh samui",  "th": "เกาะสมุย",  "ko": "코사무이"},
    {"name": "krabi",      "lat": "8.0863",     "lng": "98.9063",     "radius": "15000", "en": "krabi",      "th": "กระบี่",    "ko": "끄라비"},
    {"name": "hua_hin",    "lat": "12.5684",    "lng": "99.9577",     "radius": "12000", "en": "hua hin",    "th": "หัวหิน",    "ko": "후아힌"},
    {"name": "chiang_rai", "lat": "19.9105",    "lng": "99.8406",     "radius": "15000", "en": "chiang rai", "th": "เชียงราย",  "ko": "치앙라이"},
    {"name": "ayutthaya",  "lat": "14.3532",    "lng": "100.5689",    "radius": "15000", "en": "ayutthaya",  "th": "อยุธยา",    "ko": "아유타야"},
    {"name": "khon_kaen",  "lat": "16.4419",    "lng": "102.8359",    "radius": "15000", "en": "khon kaen",  "th": "ขอนแก่น",   "ko": "콘깬"},
    {"name": "korat",      "lat": "14.9799",    "lng": "102.0978",    "radius": "15000", "en": "korat",      "th": "โคราช",     "ko": "코랏"},
    {"name": "hat_yai",    "lat": "7.0084",     "lng": "100.4747",    "radius": "12000", "en": "hat yai",    "th": "หาดใหญ่",   "ko": "핫야이"},
    {"name": "udon_thani", "lat": "17.4138",    "lng": "102.7872",    "radius": "12000", "en": "udon thani", "th": "อุดรธานี",  "ko": "우돈타니"},
]

QUERY_TEMPLATES = [
    # 영어 — 지리 그리드가 도시 한정하므로 도시명 불필요
    ("dental clinic",   "en_clinic"),
    ("dental implant",  "en_implant"),
    # 태국어
    ("คลินิกทันตกรรม", "th_clinic"),
    ("จัดฟัน",          "th_braces"),
    # 한국어
    ("치과",            "ko_dental"),
]


def load_done() -> set[str]:
    if CHECKPOINT.exists():
        return set(CHECKPOINT.read_text(encoding="utf-8").splitlines())
    return set()


def mark_done(city_name: str):
    with open(CHECKPOINT, "a", encoding="utf-8") as f:
        f.write(city_name + "\n")


def pause_phuket():
    if not PHUKET_DIS.exists():
        PHUKET_DIS.write_text("dental_grid 실행 중 — 완료 후 자동 재개", encoding="utf-8")
        print("[dental_grid] phuket_clinics_grid 일시 정지")


def resume_phuket():
    if PHUKET_DIS.exists():
        PHUKET_DIS.unlink()
        print("[dental_grid] phuket_clinics_grid 재개")


def run_query(query: str, tag: str, idx: int, total: int, city_env: dict) -> bool:
    print(f"[dental_grid] {idx}/{total} 쿼리: {query!r} (tag={tag})")
    env = os.environ.copy()
    env.update(city_env)
    env["SEARCH_QUERY"] = query
    env["SEARCH_TAG"] = tag
    r = subprocess.run(
        [str(VENV_PY), str(GRID_SCRIPT)],
        cwd=str(ROOT / "bangkok_clinics"),
        env=env,
    )
    ok = r.returncode == 0
    print(f"[dental_grid] {'OK' if ok else 'FAIL'}: {query!r}")
    return ok


def dedup_csv(path: Path) -> int:
    if not path.exists():
        return 0
    seen: set[str] = set()
    rows: list[dict] = []
    with open(path, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        for row in reader:
            pid = row.get("place_id", "")
            if pid and pid not in seen:
                seen.add(pid)
                rows.append(row)
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    return len(rows)


def main():
    BASE_OUT.mkdir(exist_ok=True)
    # phuket clinic은 별도 포트(2082-2087)로 병행 가능 — 일시정지 안 함
    # pause_phuket()

    done = load_done()
    skipped = [c["name"] for c in CITIES if c["name"] in done]
    if skipped:
        print(f"[dental_grid] 체크포인트 복원 — 완료 도시 스킵: {skipped}")

    total_cities = len(CITIES)
    grand_total = 0
    grand_fails = 0
    print(f"[dental_grid] 시작 — {total_cities}개 도시 × {len(QUERY_TEMPLATES)}개 쿼리 = {total_cities * len(QUERY_TEMPLATES)} 총 쿼리")

    for ci, city in enumerate(CITIES, 1):
        if city["name"] in done:
            continue

        out_dir = BASE_OUT / city["name"]
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "reviews").mkdir(exist_ok=True)

        city_env = {
            "CITY_LAT":         city["lat"],
            "CITY_LNG":         city["lng"],
            "CITY_RADIUS_M":    city["radius"],
            "CITY_OUTPUT_DIR":  str(out_dir),
            "GRID_N_WORKERS":   "2",
            "GRID_PROXY_PORT":  "2080",
            "PYTHONIOENCODING": "utf-8",
        }

        queries = [(tmpl, tag) for tmpl, tag in QUERY_TEMPLATES]
        total_q = len(queries)
        print(f"\n[dental_grid] === 도시 {ci}/{total_cities}: {city['name']} ({total_q}개 쿼리) ===")

        fails = 0
        for i, (query, tag) in enumerate(queries, 1):
            if not run_query(query, tag, i, total_q, city_env):
                fails += 1
        grand_fails += fails

        unique = dedup_csv(out_dir / "discovered_places.csv")
        grand_total += unique
        print(f"[dental_grid] {city['name']}: {unique}개 발견 (실패 {fails}개)")
        mark_done(city["name"])

    print(f"\n[dental_grid] 전체 완료 — 총 {grand_total}개 치과 (실패 {grand_fails}개)")
    # resume_phuket()  # pause_phuket 비활성화로 불필요
    print("[dental_grid] 처리할 포인트 없음. 종료.")  # watchdog grid_done 트리거


if __name__ == "__main__":
    main()
