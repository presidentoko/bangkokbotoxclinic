"""IEAT 공식 포털에서 태국 산업단지 목록을 받아 data/ieat_estates.json 으로 저장.

왜 필요한가 (2026-10-02):
  /estate 는 "입주사가 매칭된 단지" 만 보여줘서 16곳뿐이었다. Search Console 에서
  "industrial estate in thailand"(49회 67위), "thailand industrial park"(42회 76위)
  는 태국 국내에서 들어오는 상위 쿼리인데, 그 질문의 답은 단지 목록의 완전성이다.
  16곳만 실린 페이지는 그 답이 못 된다.

출처를 하나로 고정한다:
  https://www.industrial-estates.ieat.go.th/en — IEAT(산업단지공사) 공식 포털.
  목록 페이지와 상세 페이지 모두 Next.js flight 데이터에 단지 레코드가 JSON 으로
  박혀 있다. 운영사 자체 사이트(WHA 405, Amata 403)는 크롤이 막혀 쓰지 않는다.
  검색 스니펫으로 목록을 보강하지도 않는다 — 출처가 불분명한 단지명을 올리면
  틀린 정보를 공신력 있게 보여주는 셈이 된다.

사용:
  python web-factory/scripts/fetch_ieat_estates.py           # 목록만 (빠름)
  python web-factory/scripts/fetch_ieat_estates.py --detail  # 도·태국어명까지 (83회 요청)
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "ieat_estates.json"

PORTAL = "https://www.industrial-estates.ieat.go.th"
LIST_URL = f"{PORTAL}/en"
SOURCE_LABEL = "IEAT official portal (industrial-estates.ieat.go.th)"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36")

# 목록 페이지의 레코드는 \" 로 이스케이프돼 있다.
#   {\"id\":2761,\"salesforceId\":\"a00...\",\"name\":\"Bangpoo Industrial Estate\",\"totalAreaRai\":5417.24
REC = re.compile(
    r'\{\\"id\\":(?P<id>\d+),'
    r'\\"salesforceId\\":\\"(?P<sf>[^"\\]+)\\",'
    r'\\"name\\":\\"(?P<name>[^"\\]+)\\"'
    r'(?:,\\"totalAreaRai\\":(?P<area>[0-9.]+|null))?'
)

# 상세 페이지에서 읽는 단지 자신의 필드.
#
# 처음에는 페이지 본문 전체에서 태국 76개 도 이름을 찾는 방식으로 썼다가 버렸다 —
# 푸터의 IEAT 본사 주소를 잡아서 83곳 중 58곳이 Bangkok 으로 나왔다. WHA Eastern
# Seaboard 가 방콕이 되는 식이다. 단지 레코드의 필드만 읽는다.
DETAIL_FIELDS = {
    "province": r'\\"provinceName\\":\\"([^"\\]+)\\"',
    "region": r'\\"regionName\\":\\"([^"\\]+)\\"',
    "name_th": r'\\"nameTh\\":\\"([^"\\]+)\\"',
    "website": r'\\"website\\":\\"(https?://[^"\\]+)\\"',
    "location": r'\\"location\\":\\"([^"\\]+)\\"',
}

# 단지명에서 운영사를 읽는다. 태국 산업단지는 운영사가 선택 기준이다.
OPERATOR_KEYS = [
    ("WHA / Hemaraj", ["wha", "hemaraj", "eastern seaboard industrial estate"]),
    ("Amata", ["amata"]),
    ("Pinthong", ["pinthong"]),
    ("Rojana", ["rojana"]),
    ("Nava Nakorn", ["nava nakorn", "navanakorn"]),
    ("Saha Group", ["saha"]),
    ("TFD", ["tfd"]),
    ("304", ["304"]),
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "replace")


def operator_of(name: str) -> str | None:
    low = name.lower()
    for label, keys in OPERATOR_KEYS:
        if any(k in low for k in keys):
            return label
    return None


def parse_list(html: str) -> list[dict]:
    """같은 단지가 여러 ieat_id 로 반복된다 (섹션마다 다시 실린다). 이름 기준으로
    하나만 남기고, 면적이 있는 레코드를 우선 채택한다."""
    out: dict[str, dict] = {}
    for m in REC.finditer(html):
        name = m.group("name").strip()
        low = name.lower()
        if "industrial estate" not in low and "industrial park" not in low:
            continue
        eid = int(m.group("id"))
        area = m.group("area")
        area_val = float(area) if area and area != "null" else None
        key = re.sub(r"\s+", " ", name).strip().lower()
        prev = out.get(key)
        if prev and (prev["area_rai"] is not None or area_val is None):
            prev.setdefault("also_ieat_ids", []).append(eid)
            continue
        out[key] = {
            "ieat_id": eid,
            "salesforce_id": m.group("sf"),
            "name": name,
            "area_rai": area_val,
            "operator": operator_of(name),
            "province": None,
            "region": None,
            "name_th": None,
            "website": None,
            "location": None,
            "detail_url": f"{PORTAL}/en/estate-detail/{eid}",
            "source": SOURCE_LABEL,
        }
    return sorted(out.values(), key=lambda e: e["name"])


def add_detail(estates: list[dict]) -> None:
    """상세 페이지에서 도·지역·태국어명·웹사이트를 채운다. 못 찾으면 None 으로
    남긴다 — 추측해서 채우면 틀린 위치를 공식 정보처럼 보여주게 된다."""
    for i, e in enumerate(estates, 1):
        try:
            html = fetch(e["detail_url"])
        except Exception as ex:
            print(f"  [{i}/{len(estates)}] {e['name'][:40]} — fetch 실패 {ex}")
            continue
        for field, pattern in DETAIL_FIELDS.items():
            m = re.search(pattern, html)
            if m:
                e[field] = m.group(1).strip()
        if i % 10 == 0:
            print(f"  {i}/{len(estates)} …", flush=True)
        time.sleep(0.4)


def main(argv: list[str]) -> int:
    print(f"fetching {LIST_URL}", flush=True)
    estates = parse_list(fetch(LIST_URL))
    print(f"estates parsed: {len(estates)}", flush=True)
    if not estates:
        print("ABORT — 레코드를 못 찾았다. 포털 구조가 바뀐 것일 수 있다.", file=sys.stderr)
        return 1

    if "--detail" in argv:
        print("상세 페이지에서 단지 필드 보강 중…", flush=True)
        add_detail(estates)
        for f in ("province", "region", "name_th", "website"):
            print(f"  {f}: {sum(1 for e in estates if e.get(f))}/{len(estates)}")

    payload = {
        "fetched_at": time.strftime("%Y-%m-%d"),
        "source": SOURCE_LABEL,
        "source_url": LIST_URL,
        "note": ("IEAT 공식 포털의 단지 목록. 운영사 사이트(WHA·Amata)는 크롤이 막혀 "
                 "쓰지 않았고, 검색 결과로 목록을 보강하지도 않았다. province 는 단지 "
                 "레코드의 provinceName 필드에서만 읽는다 — 본문 전체를 훑으면 푸터의 "
                 "IEAT 본사 주소(Bangkok)가 잡힌다."),
        "count": len(estates),
        "estates": estates,
    }
    OUT.write_bytes((json.dumps(payload, ensure_ascii=False, indent=1) + "\n").encode("utf-8"))
    print(f"wrote {OUT} ({len(estates)} estates)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
