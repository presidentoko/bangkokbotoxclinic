"""thailandgolfguide 블로그 글 자동 생성기.

전략 동일 (web-factory 패턴 복제):
- master_db.json 의 (city × category) 매트릭스에서 courses 5+ 인 조합 추출
- 우선순위 = course 수 내림차순
- 기존 lib/posts.ts (수동) + lib/posts_auto.ts (자동) 의 slug 와 충돌 회피
- 매 실행마다 새 조합 N개 추가 → lib/posts_auto.ts 덮어쓰기

CLI:
  python generate_blog.py            # 새 글 5개 추가
  python generate_blog.py -n 10
  python generate_blog.py --dry-run
"""
from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "master_db.json"
LIB = ROOT / "lib"
POSTS_TS = LIB / "posts.ts"
POSTS_AUTO_TS = LIB / "posts_auto.ts"

CATEGORY_LABELS = {
    "course":        "Golf Courses",
    "driving_range": "Driving Ranges",
    "club":          "Golf Clubs",
    "resort":        "Golf Resorts",
    "indoor":        "Indoor Golf Studios",
    "country_club":  "Country Clubs",
}
# 너무 작거나 트래픽 가치 약함
SKIP_CATEGORIES = {"instructor", "shop"}

CITY_LABEL_FIX = {
    "chon_buri":           "Chon Buri / Pattaya",
    "prachuap_khiri_khan": "Hua Hin",  # 코스 대부분이 후아힌
    "phra_nakhon_si_ayutthaya": "Ayutthaya",
    "chiang_mai":          "Chiang Mai",
    "chiang_rai":          "Chiang Rai",
    "samut_prakan":        "Samut Prakan",
    "nakhon_pathom":       "Nakhon Pathom",
    "pathum_thani":        "Pathum Thani",
    "nakhon_ratchasima":   "Nakhon Ratchasima (Korat)",
}

CITY_REGION_BLURB = {
    "bangkok":             "Bangkok metro — most international travellers' first stop, with the densest cluster of premium courses and indoor studios near the city centre.",
    "chon_buri":           "Eastern Seaboard / Pattaya cluster — favourite weekend destination for Bangkok-based golfers and Korean tour groups, with several Top-100 Asia courses.",
    "prachuap_khiri_khan": "Hua Hin coast — Thailand's original royal golf destination. Strong package culture, English- and Korean-speaking caddies, drivable from Bangkok in ~2.5h.",
    "chiang_mai":          "Northern Thailand cool-season golf hub — mountain courses, lower humidity, Japanese and Korean retiree concentration.",
    "phuket":              "Andaman island destination — fewer courses but very high quality (Laguna, Blue Canyon, Red Mountain) and integrated with resort vacations.",
    "pathum_thani":        "Northern Bangkok belt — closest weekday courses for Bangkok residents, including Alpine and Thai Country Club.",
    "samut_prakan":        "Southeast Bangkok metro — close to Suvarnabhumi airport, often used by Korean tour groups on arrival/departure days.",
    "nonthaburi":          "Western Bangkok metro — convenient weekday rounds for Bangkok residents.",
    "phra_nakhon_si_ayutthaya": "Northern Bangkok belt extension — historic capital area, blend of resort and tournament-grade courses.",
}


def city_to_slug(city: str) -> str:
    return city.lower().replace(" ", "_")


def city_label(slug: str) -> str:
    if slug in CITY_LABEL_FIX:
        return CITY_LABEL_FIX[slug]
    return " ".join(w.capitalize() for w in slug.split("_"))


def post_slug(cat: str, city_slug: str) -> str:
    cat_slug = cat.replace("_", "-")
    cs = city_slug.replace("_", "-")
    return f"top-{cat_slug}-in-{cs}"


_SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')


def collect_existing_slugs() -> set[str]:
    out: set[str] = set()
    for p in (POSTS_TS, POSTS_AUTO_TS):
        if not p.exists():
            continue
        out.update(_SLUG_RE.findall(p.read_text(encoding="utf-8")))
    return out


SKIP_CATEGORIES_FROZEN = frozenset(SKIP_CATEGORIES)


def build_matrix(db: dict, min_count: int = 5) -> list[tuple[str, str, int, list[dict]]]:
    courses = db.get("courses") or db.get("restaurants") or []
    by_pair: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for s in courses:
        city_slug = city_to_slug(s.get("city", ""))
        if not city_slug:
            continue
        for cat in s.get("categories", []):
            by_pair[(city_slug, cat)].append(s)

    rows: list[tuple[str, str, int, list[dict]]] = []
    for (city_slug, cat), sups in by_pair.items():
        if len(sups) < min_count:
            continue
        if cat not in CATEGORY_LABELS or cat in SKIP_CATEGORIES_FROZEN:
            continue
        top = sorted(sups, key=lambda s: s.get("trust_score", 0), reverse=True)[:10]
        rows.append((city_slug, cat, len(sups), top))
    rows.sort(key=lambda r: r[2], reverse=True)
    return rows


def fmt_course_line(rank: int, s: dict) -> str:
    name = s["name"].strip()
    trust = round(s.get("trust_score") or 0)
    rating = s.get("rating") or 0
    reviews = s.get("total_reviews") or 0
    district = s.get("district") or ""
    site = (s.get("website") or "").strip()
    maps = s.get("maps_url") or ""

    bits = [f"**{rank}. {name}** — Trust {trust}, ★ {rating:.1f} ({reviews:,} reviews)"]
    if district:
        bits.append(f"in {district}")
    if site:
        host = re.sub(r"^https?://(www\.)?", "", site).rstrip("/").split("/")[0]
        bits.append(f"· [{host}]({site})")
    elif maps:
        bits.append(f"· [Maps]({maps})")
    line = " ".join(bits) + "."

    topics = s.get("mentioned_topics") or []
    if topics:
        top_topics = [t["topic"].replace("_", " ") for t in topics[:2]]
        if top_topics:
            line += f" Reviewers mention: {', '.join(top_topics)}."
    return line


def build_body(city_slug: str, cat: str, count: int, top: list[dict], cat_rank_in_city: int | None) -> str:
    label = CATEGORY_LABELS[cat]
    city = city_label(city_slug)
    region = CITY_REGION_BLURB.get(city_slug, "")
    cat_url = f"/c/{cat}"
    city_url = f"/city/{city_slug}"

    n = min(10, len(top))
    lines: list[str] = []
    lines.append(
        f"{city} hosts {count:,} {label.lower()} in our verified directory — these are the top {n} ranked by independent Trust Score (Google rating combined with public review volume, with logarithmic scaling so volume alone doesn't dominate)."
    )
    lines.append("")
    lines.append("## How we rank")
    lines.append("")
    lines.append(
        "Trust Score is computed from public Google review data — rating, review count, coverage, and average review length. Sponsored slots are clearly badged separately and never displace organic ranking. See our [methodology guide](/guide/booking-thai-golf) for booking tips."
    )
    lines.append("")
    lines.append(f"## Top {n} {label} in {city}")
    lines.append("")
    for i, s in enumerate(top[:n], start=1):
        lines.append("- " + fmt_course_line(i, s))
    lines.append("")
    lines.append("## Local snapshot")
    lines.append("")
    if region:
        lines.append(region)
        lines.append("")
    if cat_rank_in_city is not None:
        lines.append(
            f"{label} are the **#{cat_rank_in_city} largest** golf category in {city} by venue count within our directory, with {count:,} listed."
        )
        lines.append("")
    lines.append("## Where to dig deeper")
    lines.append("")
    lines.append(f"- [All {label.lower()} across Thailand]({cat_url})")
    lines.append(f"- [Every golf venue in {city}]({city_url})")
    lines.append("- [Booking guide — packages, lead times, what's included](/guide/booking-thai-golf)")
    lines.append("")
    lines.append(
        "Booking note: green fees on this list reflect a recent snapshot of Google business data; confirm tee time availability and current rates directly with the course or through a booking partner (Golfsavers, Sawasdee Bangkok Golf, Klook)."
    )
    return "\n".join(lines)


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


POSTS_AUTO_HEADER = """// AUTO-GENERATED by scripts/generate_blog.py — DO NOT EDIT BY HAND.
// 새 글은 generator 가 추가 / 기존 글은 갱신.
// 수동 글은 posts.ts (POSTS_MANUAL) 쪽에 둘 것.

import type { Post } from "./posts";

export const POSTS_AUTO: Post[] = [
"""

POSTS_AUTO_FOOTER = "];\n"


def write_posts_auto(posts: list[dict]) -> None:
    out = [POSTS_AUTO_HEADER]
    for p in posts:
        out.append("  {\n")
        out.append(f'    slug: "{p["slug"]}",\n')
        out.append(f'    title: "{ts_escape(p["title"])}",\n')
        out.append(f'    metaTitle: "{ts_escape(p["metaTitle"])}",\n')
        out.append(f'    metaDescription: "{ts_escape(p["metaDescription"])}",\n')
        out.append(f'    category: "{p["category"]}",\n')
        out.append(f'    published: "{p["published"]}",\n')
        if p.get("updated"):
            out.append(f'    updated: "{p["updated"]}",\n')
        out.append(f'    body: `{ts_escape(p["body"])}`,\n')
        out.append("  },\n")
    out.append(POSTS_AUTO_FOOTER)
    POSTS_AUTO_TS.write_text("".join(out), encoding="utf-8")


def read_existing_auto() -> list[dict]:
    if not POSTS_AUTO_TS.exists():
        return []
    txt = POSTS_AUTO_TS.read_text(encoding="utf-8")
    posts: list[dict] = []
    blocks = re.findall(r"\{\s*slug:.*?\},", txt, flags=re.DOTALL)
    for blk in blocks:
        def pick(field: str) -> str:
            m = re.search(rf'{field}:\s*"([^"]*)"', blk)
            return m.group(1) if m else ""
        body_m = re.search(r"body:\s*`(.*?)`,", blk, flags=re.DOTALL)
        body = body_m.group(1) if body_m else ""
        body = body.replace("\\`", "`").replace("\\${", "${").replace("\\\\", "\\")
        posts.append({
            "slug": pick("slug"),
            "title": pick("title"),
            "metaTitle": pick("metaTitle"),
            "metaDescription": pick("metaDescription"),
            "category": pick("category"),
            "published": pick("published"),
            "updated": pick("updated") or None,
            "body": body,
        })
    return [p for p in posts if p["slug"]]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", "--num", type=int, default=5)
    ap.add_argument("--min-count", type=int, default=5)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    db = json.loads(DATA.read_text(encoding="utf-8"))

    matrix = build_matrix(db, min_count=args.min_count)
    existing = collect_existing_slugs()

    cat_rank_by_city: dict[str, dict[str, int]] = defaultdict(dict)
    by_city: dict[str, list[tuple[str, int]]] = defaultdict(list)
    for city_slug, cat, count, _top in matrix:
        by_city[city_slug].append((cat, count))
    for city_slug, items in by_city.items():
        items.sort(key=lambda t: t[1], reverse=True)
        for idx, (cat, _c) in enumerate(items, start=1):
            cat_rank_by_city[city_slug][cat] = idx

    today = datetime.now(timezone.utc).date().isoformat()

    new_posts: list[dict] = []
    for city_slug, cat, count, top in matrix:
        slug = post_slug(cat, city_slug)
        if slug in existing:
            continue
        title = f"Top 10 {CATEGORY_LABELS[cat]} in {city_label(city_slug)} — 2026 Trust Score Rankings"
        meta_title = f"Top 10 {CATEGORY_LABELS[cat]} {city_label(city_slug)} — Trust Rankings"
        meta_desc = (
            f"{count:,} {CATEGORY_LABELS[cat].lower()} indexed in {city_label(city_slug)}. "
            f"The 10 strongest ranked by independent Trust Score from public Google reviews."
        )
        body = build_body(
            city_slug, cat, count, top,
            cat_rank_by_city.get(city_slug, {}).get(cat),
        )
        new_posts.append({
            "slug": slug,
            "title": title,
            "metaTitle": meta_title,
            "metaDescription": meta_desc,
            "category": "Rankings",
            "published": today,
            "body": body,
        })
        if len(new_posts) >= args.num:
            break

    if not new_posts:
        print("no new (city, category) combos to write — matrix exhausted or all already generated.")
        return

    if args.dry_run:
        print(f"DRY-RUN — would write {len(new_posts)} new posts:")
        for p in new_posts:
            print(f"  - {p['slug']}  ({p['title']})")
        return

    existing_auto = read_existing_auto()
    existing_auto_slugs = {p["slug"] for p in existing_auto}
    merged = existing_auto + [p for p in new_posts if p["slug"] not in existing_auto_slugs]
    write_posts_auto(merged)
    print(f"wrote {POSTS_AUTO_TS.name} - total {len(merged)} posts ({len(new_posts)} new this run).")
    for p in new_posts:
        print(f"  + {p['slug']}")


if __name__ == "__main__":
    main()
