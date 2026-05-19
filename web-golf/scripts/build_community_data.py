"""Convert sidecar CSVs into compact JSON for Next.js community-content pages.

Inputs:
  export/golf_naver_blogs_broad.csv  (Korean Naver blog city/topic roundup)
  export/golf_pantip_threads.csv     (Thai/Eng Pantip thread roundup)

Outputs:
  data/community_naver.json
  data/community_pantip.json

Schema:
  community_naver.json = {
    "generated_at": iso,
    "groups": [
      { "query": "방콕 골프", "city_slug": "bangkok",
        "blogs": [ {url, title, snippet, date, blogger}, ... ] },
      ...
    ]
  }
  community_pantip.json = same shape (city_slug optional).
"""
from __future__ import annotations

import csv
import json
import math
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAVER_CSV = ROOT / "export" / "golf_naver_blogs_broad.csv"
PANTIP_CSV = ROOT / "export" / "golf_pantip_threads.csv"
OUT_NAVER = ROOT / "data" / "community_naver.json"
OUT_PANTIP = ROOT / "data" / "community_pantip.json"


# Map Korean/English/Thai query keyword → existing city slug used by the site.
CITY_KEYWORDS: list[tuple[str, str, str]] = [
    # (keyword, city_slug, city_label)
    ("방콕", "bangkok", "Bangkok"),
    ("bangkok", "bangkok", "Bangkok"),
    ("กรุงเทพ", "bangkok", "Bangkok"),
    ("후아힌", "prachuap_khiri_khan", "Hua Hin"),
    ("hua hin", "prachuap_khiri_khan", "Hua Hin"),
    ("หัวหิน", "prachuap_khiri_khan", "Hua Hin"),
    ("파타야", "chon_buri", "Pattaya"),
    ("pattaya", "chon_buri", "Pattaya"),
    ("พัทยา", "chon_buri", "Pattaya"),
    ("푸켓", "phuket", "Phuket"),
    ("phuket", "phuket", "Phuket"),
    ("ภูเก็ต", "phuket", "Phuket"),
    ("치앙마이", "chiang_mai", "Chiang Mai"),
    ("chiang mai", "chiang_mai", "Chiang Mai"),
    ("เชียงใหม่", "chiang_mai", "Chiang Mai"),
    ("아유타야", "phra_nakhon_si_ayutthaya", "Ayutthaya"),
    ("ayutthaya", "phra_nakhon_si_ayutthaya", "Ayutthaya"),
    ("라용", "rayong", "Rayong"),
    ("rayong", "rayong", "Rayong"),
    ("카오야이", "nakhon_ratchasima", "Khao Yai"),
    ("khao yai", "nakhon_ratchasima", "Khao Yai"),
    ("핫야이", "songkhla", "Hat Yai"),
    ("hat yai", "songkhla", "Hat Yai"),
    ("코사무이", "surat_thani", "Ko Samui"),
    ("samui", "surat_thani", "Ko Samui"),
]


def _clean_nan(x):
    if isinstance(x, float) and math.isnan(x):
        return None
    if isinstance(x, dict):
        return {k: _clean_nan(v) for k, v in x.items()}
    if isinstance(x, list):
        return [_clean_nan(v) for v in x]
    return x


def query_to_city(q: str) -> dict | None:
    if not q:
        return None
    lower = q.lower()
    for kw, slug, label in CITY_KEYWORDS:
        if kw.lower() in lower:
            return {"slug": slug, "label": label}
    return None


def clean(v: str | None) -> str:
    if v is None:
        return ""
    s = str(v).strip()
    return "" if s.lower() == "nan" else s


def build_groups(csv_path: Path, columns: list[str]) -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    if not csv_path.exists():
        print(f"missing: {csv_path}", file=sys.stderr)
        return []
    with csv_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            q = clean(row.get("query"))
            entry = {c: clean(row.get(c)) for c in columns}
            entry = {k: v for k, v in entry.items() if v}
            if not entry:
                continue
            grouped[q].append(entry)

    out: list[dict] = []
    for q, entries in grouped.items():
        city = query_to_city(q)
        out.append({
            "query": q,
            "city_slug": city["slug"] if city else None,
            "city_label": city["label"] if city else None,
            "count": len(entries),
            "entries": entries,
        })
    out.sort(key=lambda g: (-g["count"], g["query"]))
    return out


def main():
    naver_groups = build_groups(
        NAVER_CSV,
        ["blog_url", "blog_title", "blog_snippet", "blog_date", "blogger_name"],
    )
    pantip_groups = build_groups(
        PANTIP_CSV,
        ["topic_url", "title", "summary", "tags", "author", "comments_count", "like_count", "posted_date"],
    )

    now = datetime.now(timezone.utc).isoformat()
    OUT_NAVER.write_text(
        json.dumps(
            _clean_nan({"generated_at": now, "groups": naver_groups}),
            ensure_ascii=False, indent=2, allow_nan=False,
        ),
        encoding="utf-8",
    )
    OUT_PANTIP.write_text(
        json.dumps(
            _clean_nan({"generated_at": now, "groups": pantip_groups}),
            ensure_ascii=False, indent=2, allow_nan=False,
        ),
        encoding="utf-8",
    )

    print(f"naver groups: {len(naver_groups)}  total entries: {sum(g['count'] for g in naver_groups)}")
    print(f"pantip groups: {len(pantip_groups)}  total entries: {sum(g['count'] for g in pantip_groups)}")


if __name__ == "__main__":
    main()
