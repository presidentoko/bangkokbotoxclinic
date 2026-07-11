"""
치과 전용 그리드 러너 — Bangkok 만 처리 (B 옵션, 2026-05-18 결정).

워커: 2개 (포트 2080-2081)
출력: dental_output/bangkok/discovered_places.csv
흐름: Bangkok 5쿼리 완료 → dental_review_bangkok.disabled 마커 제거
     → watchdog 가 review scraper 자동 가동 (같은 2 포트 재사용)
     → 다른 12개 도시는 처리 안 함 (영업 시 필요하면 별도 결정)
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

# B 옵션: Bangkok 만. 4500+ dental clinics 면 영업 시작 충분.
# 나머지 12개 도시는 미래 데이터 보강 시 별도 enable.
CITIES = [
    {"name": "bangkok",     "lat": "13.7462890", "lng": "100.5346890", "radius": "30000", "en": "bangkok",     "th": "กรุงเทพ",   "ko": "방콕"},
    {"name": "pattaya",     "lat": "12.9236",    "lng": "100.8825",    "radius": "20000", "en": "pattaya",     "th": "พัทยา",      "ko": "파타야"},
    {"name": "chiang_mai",  "lat": "18.7883",    "lng": "98.9853",     "radius": "20000", "en": "chiang_mai",  "th": "เชียงใหม่", "ko": "치앙마이"},
    {"name": "phuket",      "lat": "7.8804",     "lng": "98.3923",     "radius": "20000", "en": "phuket",      "th": "ภูเก็ต",    "ko": "푸켓"},
    {"name": "koh_samui",   "lat": "9.5018",     "lng": "99.9648",     "radius": "15000", "en": "koh_samui",   "th": "เกาะสมุย", "ko": "꼬사무이"},
]

# Trimmed 2026-05-18: en_clinic 으로 충분한 cover (~4500 unique), th_clinic/
# en_implant 는 80%+ 중복. ko_dental 만 추가 — 한국인 타겟 unique 클리닉
# 식별 (한국인 의료관광 마케팅 데이터).
QUERY_TEMPLATES = [
    ("dental clinic", "en_clinic"),
    ("치과",          "ko_dental"),
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
    # 원자적 쓰기 — 프로세스가 중간에 죽어도 discovered_places.csv 가
    # 빈 파일로 남지 않도록 tmp에 먼저 쓰고 교체
    tmp_path = path.with_suffix(".csv.tmp")
    with open(tmp_path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    os.replace(tmp_path, path)
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
            "GRID_N_WORKERS":   "4",
            "GRID_PROXY_PORT":  "2084",  # nordvpn_runner 8포트(2080-2087) 범위 내 필수 — 2090+ 는 리스너 없음
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

        if unique == 0:
            # 전부 실패(VPN/프록시 죽음 등) — done 마킹 안 함, 다음 실행 때 재시도
            print(f"[dental_grid] {city['name']}: 0개 — done 마킹 스킵, 다음 실행에 재시도")
            continue

        mark_done(city["name"])

        # 도시별 review 스크래퍼 활성화 (.disabled 마커 제거) — 실제로 뭔가
        # 발견됐을 때만. 0개인데 활성화하면 review 워커가 빈 큐로 crash-loop
        # 돌다 watchdog에 영구 disabled 되는 문제가 있었음.
        review_disabled = ROOT / "run" / f"dental_review_{city['name']}.disabled"
        if review_disabled.exists():
            try:
                review_disabled.unlink()
                print(f"[dental_grid] dental_review_{city['name']} 활성화 — watchdog 가 다음 tick 에 가동")
            except OSError as e:
                print(f"[dental_grid] review 마커 제거 실패: {e}")

    print(f"\n[dental_grid] 전체 완료 — 총 {grand_total}개 치과 (실패 {grand_fails}개)")

    print("[dental_grid] 처리할 포인트 없음. 종료.")  # watchdog grid_done 트리거


if __name__ == "__main__":
    main()
