"""hair-project thaihairguide_master.csv → web/data/photos/{cid}.json.

hair-project의 photo_urls_json + google_maps_url에서 hex place_id를 추출,
master_db cid 형식(0x...:0x...)으로 매칭되는 per-clinic JSON 생성.

웹 클리닉 페이지가 lib/photos.ts 로더로 읽어서 PhotoGallery 렌더링.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

HAIR_CSV = Path(r"C:\Users\yn\Downloads\hair-project\hair-project\data\thaihairguide_master.csv")
OUT_DIR = Path(__file__).resolve().parents[1] / "web" / "data" / "photos"

# google_maps_url 안의 !1s<hex1>:<hex2>! 패턴
PLACE_ID_RE = re.compile(r"!1s(0x[a-f0-9]+):(0x[a-f0-9]+)!")


def extract_cid(gmaps_url: str) -> str | None:
    if not gmaps_url:
        return None
    m = PLACE_ID_RE.search(gmaps_url)
    if not m:
        return None
    return f"{m.group(1)}:{m.group(2)}"


def main() -> int:
    if not HAIR_CSV.exists():
        print(f"NOT FOUND: {HAIR_CSV}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    n_total = 0
    n_written = 0
    n_no_photos = 0
    n_no_cid = 0

    with HAIR_CSV.open("r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            n_total += 1
            cid = extract_cid(row.get("google_maps_url", ""))
            if not cid:
                n_no_cid += 1
                continue
            raw = row.get("photo_urls_json", "").strip()
            if not raw or raw == "[]":
                n_no_photos += 1
                continue
            try:
                urls = json.loads(raw)
            except json.JSONDecodeError:
                continue
            if not isinstance(urls, list) or not urls:
                continue

            # google CDN URL의 size suffix (=w203-h270-k-no) 를 더 큰 사이즈로.
            # PhotoGallery용 large + thumb 두 가지 제공.
            photos = []
            for i, url in enumerate(urls):
                if not isinstance(url, str) or "lh3.googleusercontent.com" not in url:
                    continue
                # =wXXX-hYYY suffix 제거하고 사이즈 명시
                base = re.sub(r"=w\d+-h\d+-[^=]*$", "", url).rstrip("=")
                photos.append({
                    "idx": i,
                    "thumb": f"{base}=w400-h300-k-no",
                    "large": f"{base}=w1200-h900-k-no",
                })
            if not photos:
                n_no_photos += 1
                continue

            out_file = OUT_DIR / f"{cid.replace(':', '_')}.json"
            out_file.write_text(json.dumps({
                "place_id": cid,
                "source": "google_maps",
                "supplier_name": row.get("name", ""),
                "photos": photos,
            }, ensure_ascii=False, indent=2), encoding="utf-8")
            n_written += 1

    print(f"[hair-photos] total={n_total} written={n_written} no_photos={n_no_photos} no_cid={n_no_cid}")
    print(f"output dir: {OUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
