"""Build community_*.json datasets for web-factory from scraped CSVs.

Inputs (from tools.community_scrapers output):
  export/factory_pantip_threads.csv
  export/factory_naver_blogs.csv
  export/factory_youtube_videos.csv

Outputs (read by app/community/* pages):
  data/community_pantip.json
  data/community_naver.json
  data/community_youtube.json

Grouping: by query. Each group gets a city/estate slug hint if the query
contains a known keyword, so pages can link back to relevant supplier
listings.
"""
from __future__ import annotations

import csv
import json
import math
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
NAVER_CSV = ROOT / "export" / "factory_naver_blogs.csv"
PANTIP_CSV = ROOT / "export" / "factory_pantip_threads.csv"
YOUTUBE_CSV = ROOT / "export" / "factory_youtube_videos.csv"
CAFE_CSV = ROOT / "export" / "factory_naver_cafe.csv"
REDDIT_CSV = ROOT / "export" / "factory_reddit_posts.csv"

# Shared thread body dir (populated by tools.community_scrapers.pantip_threads_fetch)
THREADS_DIR = REPO_ROOT / "data" / "pantip_threads"

OUT_NAVER = ROOT / "data" / "community_naver.json"
OUT_PANTIP = ROOT / "data" / "community_pantip.json"
OUT_YOUTUBE = ROOT / "data" / "community_youtube.json"
OUT_CAFE = ROOT / "data" / "community_naver_cafe.json"
OUT_REDDIT = ROOT / "data" / "community_reddit.json"

OP_SNIPPET_CHARS = 400
COMMENT_SNIPPET_CHARS = 200
MAX_COMMENTS_INLINED = 5


CITY_KEYWORDS: list[tuple[str, str, str]] = [
    ("방콕", "bangkok", "Bangkok"),
    ("bangkok", "bangkok", "Bangkok"),
    ("กรุงเทพ", "bangkok", "Bangkok"),
    ("촌부리", "chon_buri", "Chonburi"),
    ("chonburi", "chon_buri", "Chonburi"),
    ("ชลบุรี", "chon_buri", "Chonburi"),
    ("라용", "rayong", "Rayong"),
    ("rayong", "rayong", "Rayong"),
    ("ระยอง", "rayong", "Rayong"),
    ("사뭇쁘라깐", "samut_prakan", "Samut Prakan"),
    ("samut prakan", "samut_prakan", "Samut Prakan"),
    ("สมุทรปราการ", "samut_prakan", "Samut Prakan"),
    ("아유타야", "phra_nakhon_si_ayutthaya", "Ayutthaya"),
    ("ayutthaya", "phra_nakhon_si_ayutthaya", "Ayutthaya"),
    ("พระนครศรีอยุธยา", "phra_nakhon_si_ayutthaya", "Ayutthaya"),
]

# Increase csv field size for long thread bodies
_csv_max = sys.maxsize
while True:
    try:
        csv.field_size_limit(_csv_max)
        break
    except OverflowError:
        _csv_max = int(_csv_max / 10)


def query_to_city(q: str) -> dict | None:
    if not q:
        return None
    lower = q.lower()
    for kw, slug, label in CITY_KEYWORDS:
        if kw.lower() in lower:
            return {"slug": slug, "label": label}
    return None


def clean(v) -> str:
    if v is None:
        return ""
    if isinstance(v, float) and math.isnan(v):
        return ""
    s = str(v).strip()
    return "" if s.lower() == "nan" else s


def _clean_nan(x):
    if isinstance(x, float) and math.isnan(x):
        return None
    if isinstance(x, dict):
        return {k: _clean_nan(v) for k, v in x.items()}
    if isinstance(x, list):
        return [_clean_nan(v) for v in x]
    return x


def load_thread_enrichment(topic_id: str) -> dict | None:
    """Return {op_snippet, comments_inlined, real_comment_count} for a topic_id."""
    if not topic_id:
        return None
    p = THREADS_DIR / f"{topic_id}.json"
    if not p.exists():
        return None
    try:
        with p.open(encoding="utf-8") as f:
            j = json.load(f)
    except (json.JSONDecodeError, OSError):
        return None
    op_body = (j.get("op_body") or "").strip()
    comments = j.get("comments") or []
    inlined = []
    for c in comments[:MAX_COMMENTS_INLINED]:
        body = (c.get("body") or "").strip()
        if not body:
            continue
        inlined.append({
            "author": c.get("author") or "",
            "body": body[:COMMENT_SNIPPET_CHARS],
            "vote_score": c.get("vote_score") or 0,
        })
    return {
        "op_snippet": op_body[:OP_SNIPPET_CHARS],
        "comments_inlined": inlined,
        "real_comment_count": len(comments),
    }


def build_groups(csv_path: Path, columns: list[str], enrich_pantip: bool = False) -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    if not csv_path.exists():
        print(f"missing: {csv_path}", file=sys.stderr)
        return []
    seen_keys: dict[str, set[str]] = defaultdict(set)
    with csv_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            q = clean(row.get("query"))
            entry = {c: clean(row.get(c)) for c in columns}
            entry = {k: v for k, v in entry.items() if v}
            if not entry:
                continue
            # Dedup by topic_url / blog_url / video_id / cafe_url / post_url within each group
            dedup_key = (entry.get("topic_url") or entry.get("blog_url")
                         or entry.get("video_id") or entry.get("cafe_url")
                         or entry.get("post_url") or "")
            if dedup_key and dedup_key in seen_keys[q]:
                continue
            if dedup_key:
                seen_keys[q].add(dedup_key)

            if enrich_pantip:
                tid = clean(row.get("topic_id"))
                enr = load_thread_enrichment(tid)
                if enr:
                    entry["op_snippet"] = enr["op_snippet"]
                    entry["comments_inlined"] = enr["comments_inlined"]
                    entry["real_comment_count"] = enr["real_comment_count"]
                    # Override comments_count with real one
                    if enr["real_comment_count"]:
                        entry["comments_count"] = str(enr["real_comment_count"])

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


def main() -> int:
    now = datetime.now(timezone.utc).isoformat()
    naver = build_groups(
        NAVER_CSV,
        ["blog_url", "blog_title", "blog_snippet", "blog_date", "blogger_name"],
    )
    pantip = build_groups(
        PANTIP_CSV,
        ["topic_url", "title", "summary", "tags", "author",
         "comments_count", "like_count", "posted_date"],
        enrich_pantip=True,
    )
    youtube = build_groups(
        YOUTUBE_CSV,
        ["video_url", "video_id", "title", "description", "channel",
         "channel_id", "published_at", "view_count", "like_count",
         "comment_count", "duration"],
    )
    cafe = build_groups(
        CAFE_CSV,
        ["cafe_url", "cafe_name", "post_title", "post_snippet", "post_date", "author"],
    )
    reddit = build_groups(
        REDDIT_CSV,
        ["post_url", "permalink", "subreddit", "title", "selftext_snippet",
         "author", "score", "num_comments", "created_utc"],
    )

    OUT_NAVER.parent.mkdir(parents=True, exist_ok=True)

    OUT_NAVER.write_text(
        json.dumps(_clean_nan({"generated_at": now, "groups": naver}),
                   ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )
    OUT_PANTIP.write_text(
        json.dumps(_clean_nan({"generated_at": now, "groups": pantip}),
                   ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )
    OUT_YOUTUBE.write_text(
        json.dumps(_clean_nan({"generated_at": now, "groups": youtube}),
                   ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )
    OUT_CAFE.write_text(
        json.dumps(_clean_nan({"generated_at": now, "groups": cafe}),
                   ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )
    OUT_REDDIT.write_text(
        json.dumps(_clean_nan({"generated_at": now, "groups": reddit}),
                   ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )

    print(f"naver groups: {len(naver)}  entries: {sum(g['count'] for g in naver)}")
    print(f"pantip groups: {len(pantip)}  entries: {sum(g['count'] for g in pantip)}")
    print(f"youtube groups: {len(youtube)}  entries: {sum(g['count'] for g in youtube)}")
    print(f"cafe groups: {len(cafe)}  entries: {sum(g['count'] for g in cafe)}")
    print(f"reddit groups: {len(reddit)}  entries: {sum(g['count'] for g in reddit)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
