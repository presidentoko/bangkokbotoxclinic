"""thaisupplyhub 블로그 글 자동 생성기.

전략:
- master_db.json 의 (city × category) 매트릭스에서 suppliers 5+ 인 조합 추출
- 우선순위 = supplier 수 내림차순
- 기존 lib/posts.ts (수동) + lib/posts_auto.ts (자동) 의 slug 와 충돌 회피
- 매 실행마다 새 조합 N개 추가 → lib/posts_auto.ts 덮어쓰기

출력 글 타입 v1 = "Top 10 [Category Label] in [City] — 2026 Trust Score Rankings".
실 supplier 데이터 인용형 (Google Helpful Content 안전).

CLI:
  python generate_blog.py            # 새 글 5개 추가
  python generate_blog.py -n 10      # 새 글 10개 추가
  python generate_blog.py --dry-run  # 출력 미리보기, 파일 안 씀
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
    "manufacturer":      "Manufacturers",
    "auto_parts":        "Auto Parts Suppliers",
    "factory":           "Factories",
    "warehouse":         "Warehouse Operators",
    "industrial_estate": "Industrial Estates",
    "logistics":         "Logistics Providers",
    "food_mfg":          "Food Manufacturers",
    "electronics":       "Electronics Manufacturers",
    "chemical":          "Chemical Manufacturers",
    "plastic":           "Plastic Fabricators",
    "steel":             "Steel & Metal Suppliers",
    "machining":         "Machining Shops",
    "equipment":         "Industrial Equipment Suppliers",
    "corporate_office":  "Corporate Offices",
    "packaging":         "Packaging Manufacturers",
    "rubber":            "Rubber Manufacturers",
    "textile":           "Textile Manufacturers",
    "machinery":         "Machinery Suppliers",
    "exporter":          "Exporters",
}

CITY_LABEL_FIX = {
    "phra_nakhon_si_ayutthaya": "Ayutthaya",
    "chon_buri":                "Chon Buri",
    "samut_sakhon":             "Samut Sakhon",
    "samut_prakan":             "Samut Prakan",
    "nakhon_pathom":            "Nakhon Pathom",
    "pathum_thani":             "Pathum Thani",
    "khon_kaen":                "Khon Kaen",
    "prachuap_khiri_khan":      "Prachuap Khiri Khan",
}

CITY_REGION_BLURB = {
    "chon_buri":     "Eastern Seaboard cluster within ~30 min of Laem Chabang deep-sea port — primary export channel for Thai manufacturing.",
    "rayong":        "Eastern Seaboard chemical and automotive heartland — anchored by Map Ta Phut petrochemical complex and the WHA/Amata estates.",
    "pathum_thani":  "Bangkok northern industrial belt — Nava Nakorn estate cluster, strong food and electronics presence.",
    "samut_sakhon":  "Western Bangkok seafood and processed food capital — also packaging and plastics downstream.",
    "samut_prakan":  "Southeast Bangkok metro estate cluster, close to Suvarnabhumi airport — electronics, automotive Tier 2.",
    "bangkok":       "Headquarters / commercial hub for most Thai groups — manufacturing presence concentrated in inner industrial pockets and Bang Bon.",
    "phra_nakhon_si_ayutthaya": "Northern Bangkok extension — Rojana / Hi-Tech / Bang Pa-In estates anchor automotive and electronics OEMs.",
    "khon_kaen":     "Northeast Thailand industrial gateway — agricultural processing, food, and logistics for Isaan region.",
    "nakhon_pathom": "Western Bangkok metro — food processing, packaging, light manufacturing.",
}


# ── slug helpers ─────────────────────────────────────────────
def city_to_slug(city: str) -> str:
    return city.lower().replace(" ", "_")


def city_label(slug: str) -> str:
    if slug in CITY_LABEL_FIX:
        return CITY_LABEL_FIX[slug]
    return " ".join(w.capitalize() for w in slug.split("_"))


def post_slug(cat: str, city_slug: str) -> str:
    cat_slug = cat.replace("_", "-")
    cs = city_slug.replace("_", "-")
    return f"top-{cat_slug}-suppliers-in-{cs}"


# ── 기존 slug 수집 (충돌 회피) ────────────────────────────────
_SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')


def collect_existing_slugs() -> set[str]:
    out: set[str] = set()
    for p in (POSTS_TS, POSTS_AUTO_TS):
        if not p.exists():
            continue
        out.update(_SLUG_RE.findall(p.read_text(encoding="utf-8")))
    return out


# ── (city, category) 매트릭스 + 우선순위 ───────────────────────
# B2B 바이어 검색 가치 약한 카테고리 (블로그 글 생성 제외)
SKIP_CATEGORIES = {"corporate_office", "factory"}  # factory 는 manufacturer 와 중복성 큼


def build_matrix(db: dict, min_count: int = 5) -> list[tuple[str, str, int, list[dict]]]:
    """반환: [(city_slug, category, count, top_suppliers), ...] count desc."""
    by_pair: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for s in db["suppliers"]:
        city_slug = city_to_slug(s.get("city", ""))
        if not city_slug:
            continue
        for cat in s.get("categories", []):
            by_pair[(city_slug, cat)].append(s)

    rows: list[tuple[str, str, int, list[dict]]] = []
    for (city_slug, cat), sups in by_pair.items():
        if len(sups) < min_count:
            continue
        if cat not in CATEGORY_LABELS or cat in SKIP_CATEGORIES:
            continue
        # 상위 10개를 trust_score 로 정렬
        top = sorted(sups, key=lambda s: s.get("trust_score", 0), reverse=True)[:10]
        rows.append((city_slug, cat, len(sups), top))
    rows.sort(key=lambda r: r[2], reverse=True)
    return rows


# ── 글 본문 생성 ─────────────────────────────────────────────
def fmt_supplier_line(rank: int, s: dict) -> str:
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
        # 호스트만 가볍게
        host = re.sub(r"^https?://(www\.)?", "", site).rstrip("/").split("/")[0]
        bits.append(f"· [{host}]({site})")
    elif maps:
        bits.append(f"· [Maps]({maps})")
    line = " ".join(bits) + "."

    # 토픽 (상위 2개)
    topics = s.get("mentioned_topics") or []
    if topics:
        top_topics = [t["topic"].replace("_", " ") for t in topics[:2]]
        if top_topics:
            line += f" Reviewer mentions: {', '.join(top_topics)}."
    return line


def build_body(city_slug: str, cat: str, count: int, top: list[dict], cat_rank_in_city: int | None) -> str:
    label = CATEGORY_LABELS[cat]
    city = city_label(city_slug)
    region = CITY_REGION_BLURB.get(city_slug, "")
    cat_url = f"/c/{cat}"
    city_url = f"/city/{city_slug}"
    cat_city_url = f"/c/{cat}/{city_slug.replace('_','-')}"

    n = min(10, len(top))
    lines: list[str] = []
    lines.append(
        f"{city} hosts {count:,} {label.lower()} indexed in our directory — these are the top {n} ranked by independent Trust Score (Google rating combined with public review volume, capped so volume doesn't dominate alone)."
    )
    lines.append("")
    lines.append("## How we rank")
    lines.append("")
    lines.append(
        "Trust Score is computed from public Google Business Profile data — rating, review count, review coverage, average review length. Sponsored placements are clearly badged separately and never displace the organic ranking. [Full methodology](/blog/trust-score-explained)."
    )
    lines.append("")
    lines.append(f"## Top {n} {label} in {city}")
    lines.append("")
    for i, s in enumerate(top[:n], start=1):
        lines.append("- " + fmt_supplier_line(i, s))
    lines.append("")
    lines.append("## Province snapshot")
    lines.append("")
    if region:
        lines.append(region)
        lines.append("")
    if cat_rank_in_city is not None:
        lines.append(
            f"{label} are the **#{cat_rank_in_city} largest** category in {city} by company count within our directory, with {count:,} listed suppliers."
        )
        lines.append("")
    lines.append("## Where to dig deeper")
    lines.append("")
    lines.append(f"- [Full {label.lower()} directory in {city}]({cat_city_url})")
    lines.append(f"- [All {label.lower()} across Thailand]({cat_url})")
    lines.append(f"- [Every supplier in {city}]({city_url})")
    lines.append("")
    lines.append(
        "Buyer note: this list reflects public Google data at the time of generation; for active sourcing, verify supplier status and certifications directly. See our [verification guide](/blog/verified-supplier-what-we-check) for what to check before contracting."
    )
    return "\n".join(lines)


# ── posts_auto.ts 작성 ────────────────────────────────────────
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
    """기존 posts_auto.ts 에서 글 메타 (slug/title/metaTitle/metaDescription/category/published/updated/body) 단순 파싱."""
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
        # un-escape
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


# ── main ──────────────────────────────────────────────────────
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", "--num", type=int, default=5, help="새로 추가할 글 수")
    ap.add_argument("--min-count", type=int, default=5, help="조합 최소 supplier 수")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    db = json.loads(DATA.read_text(encoding="utf-8"))

    matrix = build_matrix(db, min_count=args.min_count)
    existing = collect_existing_slugs()

    # 도시별 카테고리 랭킹 (province snapshot 용)
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
    print(f"wrote {POSTS_AUTO_TS.name} — total {len(merged)} posts ({len(new_posts)} new this run).")
    for p in new_posts:
        print(f"  + {p['slug']}")


if __name__ == "__main__":
    main()
