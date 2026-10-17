"""치앙마이·푸켓 Wongnai 수집을 watchdog 서비스로 돌린다.

이틀짜리 작업이라 nohup 으로 띄워두면 죽어도 아무도 되살리지 않는다. watchdog
에 올리면 죽으면 재시작하고, RAM 이 모자라면 양보하다 다시 켜진다.

watchdog 은 `python <스크립트>` 한 줄만 실행하므로, 도시를 순서대로 도는
진입점이 필요하다. wongnai_crawl.py 를 import 해서 쓰고 로직은 복제하지 않는다.

다 끝나면 run/wongnai_cities.disabled 를 직접 써서 재시작을 멈춘다. 내용은
"ram_manager" 가 아니어야 한다 — ram_manager 의 resume 은 자기가 쓴 마커만
지우므로, 다른 문구면 RAM 이 넉넉해져도 되살아나지 않는다.

진행 줄을 5곳마다 찍는 이유: 403 재시도(20~60초 대기)가 섞여 실측 2.2곳/분까지
떨어진다. 25곳마다 찍으면 11분에 한 줄이라 watchdog 이 정체로 오판한다.
"""
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent

spec = importlib.util.spec_from_file_location("wongnai_crawl", HERE / "wongnai_crawl.py")
wc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wc)

CITIES = ["chiang_mai", "phuket"]
DELAY = 3.0
PAGES = 600


def remaining(region: str) -> int:
    slug_path = HERE / "wongnai" / f"slugs_{region}.json"
    det_path = HERE / "wongnai" / "details.json"
    if not slug_path.exists():
        return -1  # 아직 목록도 없음
    slugs = json.loads(slug_path.read_text(encoding="utf-8"))
    done = json.loads(det_path.read_text(encoding="utf-8")) if det_path.exists() else {}
    return sum(1 for s in slugs if s not in done)


def main() -> int:
    for region in CITIES:
        left = remaining(region)
        if left == 0:
            print(f"[{region}] 이미 완료 — 건너뜀", flush=True)
            continue
        print(f"[{region}] 시작 (남은 {left if left >= 0 else '목록 미수집'})", flush=True)
        slug_path = HERE / "wongnai" / f"slugs_{region}.json"
        if not slug_path.exists():
            wc.discover(region, PAGES, DELAY, slug_path)
        slugs = json.loads(slug_path.read_text(encoding="utf-8"))
        wc.fetch_details(slugs, DELAY, HERE / "wongnai" / "details.json")
        print(f"[{region}] 완료", flush=True)

    marker = ROOT / "run" / "wongnai_cities.disabled"
    marker.write_text(
        "wongnai_cities: 치앙마이·푸켓 수집 완료 (자기 종료). 다시 돌릴 일이 "
        "있으면 이 파일을 지우면 된다.", encoding="utf-8")
    print("전체 완료 — 재시작 중단 마커 작성", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
