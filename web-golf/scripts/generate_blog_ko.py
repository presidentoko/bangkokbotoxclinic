"""thailandgolfguide 한국어 블로그 글 자동 생성기.

전략:
- master_db.json (city × category) 매트릭스에서 코스 수 5+ 추출
- 후기/체험 톤 + Google 리뷰 데이터 집계 (사실 기반, 가짜 후기 안 만듦)
- 한국어 캐디, 한국 패키지, 자유여행 비교 자연스럽게 삽입
- 어필리에이트 채널 (Golfsavers, Klook, Agoda) 자연 언급
- lib/posts_auto_ko.ts 덮어쓰기

CLI:
  python generate_blog_ko.py            # 새 글 5개 추가
  python generate_blog_ko.py -n 35      # 한 번에 35개
  python generate_blog_ko.py --dry-run
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
POSTS_KO_TS = LIB / "posts_ko.ts"
POSTS_AUTO_KO_TS = LIB / "posts_auto_ko.ts"

CATEGORY_LABEL_KO = {
    "course":        "골프장",
    "driving_range": "드라이빙 레인지",
    "club":          "골프 클럽",
    "resort":        "골프 리조트",
    "indoor":        "실내 골프 (스크린)",
    "country_club":  "컨트리클럽",
}
CATEGORY_NAVER_QUERY = {
    "course":        "골프장 추천",
    "driving_range": "드라이빙 레인지",
    "club":          "골프 클럽",
    "resort":        "골프 리조트",
    "indoor":        "실내 골프 연습장",
    "country_club":  "컨트리클럽",
}
SKIP_CATEGORIES = {"instructor", "shop"}

# Korean city labels — Naver 검색어 매칭 우선.
CITY_LABEL_KO = {
    "bangkok":                  "방콕",
    "chon_buri":                "파타야 (촌부리)",
    "pattaya":                  "파타야",
    "prachuap_khiri_khan":      "후아힌",
    "chiang_mai":               "치앙마이",
    "chiang_rai":               "치앙라이",
    "phuket":                   "푸켓",
    "pathum_thani":             "빠툼타니 (방콕 북부)",
    "samut_prakan":             "사뭇쁘라깐 (방콕 남부)",
    "nonthaburi":               "논타부리 (방콕 서부)",
    "nakhon_pathom":            "나콘빠톰",
    "nakhon_ratchasima":        "카오야이 (코랏)",
    "phetchaburi":              "차암 / 핏차부리",
    "phra_nakhon_si_ayutthaya": "아유타야",
    "rayong":                   "라용",
    "krabi":                    "끄라비",
    "surat_thani":              "수랏타니 (사무이)",
}

CITY_REGION_BLURB_KO = {
    "bangkok":             "방콕 도심권 — 한국 골퍼들이 자유여행 첫 라운드로 가장 많이 가는 곳. 프리미엄 컨트리클럽도 많고 시내 실내 골프장도 밀집.",
    "chon_buri":           "파타야 / 촌부리 — 한국 골프 투어가 압도적으로 많이 가는 지역. 시암 컨트리클럽, 패타나 등 한국어 캐디 잘 갖춰진 코스들이 모여있음.",
    "pattaya":             "파타야 — 한국 골프 투어 단체 메카. 한국어 메뉴, 한국어 캐디, 한국 식당까지 가장 편한 곳.",
    "prachuap_khiri_khan": "후아힌 — 방콕에서 차로 2시간 반. 블랙마운틴, 바냔, 파인애플 밸리 같은 고급 리조트형 코스들. 부부 골프 여행 인기.",
    "chiang_mai":          "치앙마이 — 11월~2월 선선한 날씨가 최고. 산악 코스 많고 그린피도 방콕보다 저렴. 한국인 은퇴자 커뮤니티도 일부 있음.",
    "phuket":              "푸켓 — 골프장 수는 적지만 라구나, 블루캐년, 레드마운틴 같은 세계급 코스들. 휴양지 + 골프 결합 여행에 좋음.",
    "pathum_thani":        "빠툼타니 — 방콕 북부 벨트. 알파인 골프 클럽, 리버데일 등 평일 라운드 가능한 명문 코스 다수.",
    "samut_prakan":        "사뭇쁘라깐 — 수완나품 공항 가까워서 도착/출국일 마지막 라운드용으로 한국 투어가 많이 활용.",
    "nakhon_ratchasima":   "카오야이 — 방콕에서 차로 2시간 반. 키리마야, 토스카나밸리 등 산악 풍경 + 와인너리 결합. 주말 가족 여행 인기.",
    "nonthaburi":          "논타부리 — 방콕 서부. 평일 그린피 가성비 좋은 코스가 다수.",
    "phetchaburi":         "핏차부리 / 차암 — 후아힌 바로 위. 팜힐스, 스프링필드 등 한적한 라운드 좋음.",
}

# Korean-blog/affiliate footer
FOOTER_AFFILIATE_KO = (
    "참고로 예약 채널은 직접 코스 홈페이지가 가장 싸고, 한국 패키지는 가장 편함. "
    "중간 옵션으로는 Golfsavers (영문이지만 한국어 응대 가능), Klook (1라운드 단발용), Agoda (호텔+골프 패키지) 자주 사용됨."
)

# Topic translations — Google "mentioned_topics" 영문 → 한국어
TOPIC_KO = {
    "well maintained":  "관리 잘됨",
    "scenic":           "경치 좋음",
    "challenging":      "난이도 있음",
    "affordable":       "가성비 좋음",
    "expensive":        "비싼 편",
    "championship":     "챔피언십급",
    "good food":        "식사 좋음",
    "good service":     "서비스 좋음",
    "tournament ready": "대회급 코스",
    "members only":     "회원제 분위기",
    "international":    "외국인 친화",
    "slow pace":        "여유로운 진행",
    "easy course":      "쉬운 코스",
    "good practice":    "연습 좋음",
    "luxury":           "럭셔리",
    "quiet":            "한적함",
    "crowded":          "사람 많음",
}


def topic_to_ko(en: str) -> str:
    return TOPIC_KO.get(en.lower(), en)


def city_to_slug(city: str) -> str:
    return city.lower().replace(" ", "_")


def city_label(slug: str) -> str:
    if slug in CITY_LABEL_KO:
        return CITY_LABEL_KO[slug]
    return " ".join(w.capitalize() for w in slug.split("_"))


def post_slug(cat: str, city_slug: str) -> str:
    cat_slug = cat.replace("_", "-")
    cs = city_slug.replace("_", "-")
    return f"top-{cat_slug}-in-{cs}"


_SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')


def collect_existing_slugs() -> set[str]:
    out: set[str] = set()
    for p in (POSTS_KO_TS, POSTS_AUTO_KO_TS):
        if not p.exists():
            continue
        out.update(_SLUG_RE.findall(p.read_text(encoding="utf-8")))
    return out


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
        if cat not in CATEGORY_LABEL_KO or cat in SKIP_CATEGORIES:
            continue
        top = sorted(sups, key=lambda s: s.get("trust_score", 0), reverse=True)[:10]
        rows.append((city_slug, cat, len(sups), top))
    rows.sort(key=lambda r: r[2], reverse=True)
    return rows


def count_korean_friendly(top: list[dict]) -> int:
    return sum(1 for s in top if s.get("is_korean_friendly"))


def total_korean_blogs(top: list[dict]) -> int:
    return sum(len(s.get("korean_blogs") or []) for s in top)


def fmt_course_line_ko(rank: int, s: dict) -> str:
    name = s["name"].strip()
    trust = round(s.get("trust_score") or 0)
    rating = s.get("rating") or 0
    reviews = s.get("total_reviews") or 0
    district = s.get("district") or ""
    site = (s.get("website") or "").strip()
    maps = s.get("maps_url") or ""
    is_ko = s.get("is_korean_friendly")

    badge = " · 한국 골퍼 추천" if is_ko else ""
    bits = [f"**{rank}. {name}** — 신뢰점수 {trust}, ★ {rating:.1f} (리뷰 {reviews:,}건){badge}"]
    if district:
        bits.append(f"· 위치: {district}")
    if site:
        host = re.sub(r"^https?://(www\.)?", "", site).rstrip("/").split("/")[0]
        bits.append(f"· [홈페이지]({site})")
    elif maps:
        bits.append(f"· [지도]({maps})")
    line = " ".join(bits)

    topics = s.get("mentioned_topics") or []
    if topics:
        top_topics = [topic_to_ko(t["topic"].replace("_", " ")) for t in topics[:2]]
        if top_topics:
            line += f". 리뷰 키워드: {', '.join(top_topics)}."
    else:
        line += "."

    # Add Korean blog mention if available
    kblogs = s.get("korean_blogs") or []
    if kblogs:
        line += f" 네이버 블로그 후기 {len(kblogs)}건."

    return line


def build_intro_ko(city: str, label: str, count: int, ko_friendly_count: int, kblog_total: int) -> str:
    parts = [
        f"{city}에서 골프 라운드 알아보다가 정리한 글이에요.",
        f"태국 골프 가이드 데이터베이스에 {city} {label}만 총 {count:,}곳 등록되어 있는데, 그 중 Google 리뷰 신뢰점수 (별점 + 리뷰 수 가중 평균) 상위 10곳을 추렸습니다.",
    ]
    if ko_friendly_count > 0:
        parts.append(
            f"이 중 {ko_friendly_count}곳은 한국어 캐디 운영 또는 한국 골퍼 리뷰 비율이 높아 \"한국 골퍼 추천\" 태그가 붙어있어요 — 자유여행으로 가시는 분 참고."
        )
    if kblog_total > 0:
        parts.append(
            f"네이버 블로그 검색했을 때도 이 리스트의 코스들에 대한 후기가 총 {kblog_total}건 정도 나와요. 위의 신뢰점수와 별개로 한국 골퍼들이 실제 라운드 후기를 많이 남긴 코스라는 신호로 같이 참고하면 좋음."
        )
    return " ".join(parts)


def build_body_ko(city_slug: str, cat: str, count: int, top: list[dict], cat_rank_in_city: int | None) -> str:
    label = CATEGORY_LABEL_KO[cat]
    city = city_label(city_slug)
    region = CITY_REGION_BLURB_KO.get(city_slug, "")
    cat_url = f"/c/{cat}"
    city_url = f"/city/{city_slug}"

    n = min(10, len(top))
    ko_friendly = count_korean_friendly(top)
    kblog_total = total_korean_blogs(top)

    lines: list[str] = []
    lines.append(build_intro_ko(city, label, count, ko_friendly, kblog_total))
    lines.append("")

    lines.append("## 순위는 어떻게 매겼냐면")
    lines.append("")
    lines.append(
        "Google 공개 리뷰 데이터로 계산했어요 — 별점, 리뷰 수, 리뷰 길이 평균을 종합한 \"신뢰점수\" (0~100). "
        "리뷰 수가 많을수록 가중치 받지만 무한 가중은 아니라, 별점 4.7 · 100건이 별점 4.3 · 5,000건보다 위에 오는 경우도 있어요. "
        "광고나 스폰서 자리는 따로 표시되고 본 순위엔 영향 없음."
    )
    lines.append("")

    lines.append(f"## {city} {label} TOP {n}")
    lines.append("")
    for i, s in enumerate(top[:n], start=1):
        lines.append("- " + fmt_course_line_ko(i, s))
    lines.append("")

    if region:
        lines.append(f"## {city} 라운드 가기 전에 알아두면 좋은 것")
        lines.append("")
        lines.append(region)
        lines.append("")

    # Korean-specific practical info
    lines.append("## 한국 골퍼라면 챙길 것")
    lines.append("")
    ko_tips = []
    if ko_friendly > 0:
        ko_tips.append(
            f"위 리스트 중 {ko_friendly}곳이 한국어 캐디 또는 한국인 리뷰 다수 보유 — 예약시 한국어 캐디 가능한지 물어보세요. 코스가 \"우리는 한국어 캐디 있다\"고 광고는 안 해도 한국 투어 단골 코스면 거의 가능."
        )
    ko_tips.append(
        "캐디 팁: 한국어 캐디는 ฿600-1,000 (약 25,000-40,000원) 통상. 일반 캐디는 ฿400-500. "
        "한국 투어 팁 문화로 굳어져서 한국 골퍼한테는 이 정도 기대하는 분위기."
    )
    ko_tips.append(
        "예약 채널: 한국 투어 패키지 가장 편함 (인천공항-방콕 항공 + 호텔 + 라운드 + 한국어 가이드 다 포함). "
        "그린피만 최소화하고 싶으면 직접 예약이 20-30% 쌈. 영문 OK면 Golfsavers가 좋은 중간 옵션."
    )
    if cat == "course":
        ko_tips.append(
            "그린피는 평일/주말 격차 큼 (20-50%). 일정 유연하면 평일 라운드 강추. "
            "성수기 (11-2월) 인기 코스는 한국 투어 단체가 1-2주 전 매진 — 자유여행이면 적어도 2주 전 예약."
        )
    for t in ko_tips:
        lines.append(f"- {t}")
    lines.append("")

    if cat_rank_in_city is not None:
        lines.append(
            f"참고로 {city} 골프 카테고리 중 {label}은 등록 시설 수 기준 **#{cat_rank_in_city}위** ({count:,}곳). "
            "이 도시에서 가장 큰 카테고리부터 보는 게 보통 SEO 검색량이랑 비슷하게 가요."
        )
        lines.append("")

    lines.append("## 더 깊게 보려면")
    lines.append("")
    lines.append(f"- [태국 전국 {label} 전체 리스트]({cat_url})")
    lines.append(f"- [{city} 모든 골프 시설]({city_url})")
    lines.append("- [태국 골프 예약 한국어 가이드 — 그린피, 캐디팁, 패키지 비교](/ko/guide/booking-thai-golf)")
    lines.append("- [태국 한국 골프 투어 가이드](/ko/guide/korean-golf-tour-thailand)")
    lines.append("")
    lines.append(FOOTER_AFFILIATE_KO)
    lines.append("")
    lines.append("그린피는 환율/시즌에 따라 매주 바뀌니까 위 신뢰점수와 별점은 참고용. 정확한 가격은 항상 예약 직전 확인하세요.")
    return "\n".join(lines)


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


POSTS_AUTO_KO_HEADER = """// AUTO-GENERATED by scripts/generate_blog_ko.py — DO NOT EDIT BY HAND.
// 한국어 자동 블로그 글 — 네이버 검색 long-tail 캡처용.
// 수동 한국어 글은 posts_ko.ts (POSTS_KO_MANUAL) 쪽에 둘 것.

import type { Post } from "./posts";

export const POSTS_AUTO_KO: Post[] = [
"""

POSTS_AUTO_KO_FOOTER = "];\n"


def write_posts_auto_ko(posts: list[dict]) -> None:
    out = [POSTS_AUTO_KO_HEADER]
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
    out.append(POSTS_AUTO_KO_FOOTER)
    POSTS_AUTO_KO_TS.write_text("".join(out), encoding="utf-8")


def read_existing_auto() -> list[dict]:
    if not POSTS_AUTO_KO_TS.exists():
        return []
    txt = POSTS_AUTO_KO_TS.read_text(encoding="utf-8")
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
        label = CATEGORY_LABEL_KO[cat]
        city = city_label(city_slug)
        naver_q = CATEGORY_NAVER_QUERY.get(cat, label)
        title = f"{city} {label} TOP 10 — 한국 골퍼 후기 종합 (2026)"
        meta_title = f"{city} {naver_q} TOP 10 후기 — 신뢰점수 + 한국인 추천"
        meta_desc = (
            f"{city} {label} {count:,}곳 중 Google 리뷰 신뢰점수 상위 10곳. "
            f"한국어 캐디 가능 코스, 그린피, 예약 채널 (Golfsavers/Klook/패키지) 정리. 자유여행 한국 골퍼용."
        )
        body = build_body_ko(
            city_slug, cat, count, top,
            cat_rank_by_city.get(city_slug, {}).get(cat),
        )
        new_posts.append({
            "slug": slug,
            "title": title,
            "metaTitle": meta_title,
            "metaDescription": meta_desc,
            "category": "한국 골퍼 추천",
            "published": today,
            "body": body,
        })
        if len(new_posts) >= args.num:
            break

    if not new_posts:
        print("no new (city, category) combos to write — matrix exhausted or all already generated.")
        return

    if args.dry_run:
        print(f"DRY-RUN — would write {len(new_posts)} new Korean posts:")
        for p in new_posts:
            print(f"  - {p['slug']}  ({p['title']})")
        return

    existing_auto = read_existing_auto()
    existing_auto_slugs = {p["slug"] for p in existing_auto}
    merged = existing_auto + [p for p in new_posts if p["slug"] not in existing_auto_slugs]
    write_posts_auto_ko(merged)
    print(f"wrote {POSTS_AUTO_KO_TS.name} - total {len(merged)} posts ({len(new_posts)} new this run).")
    for p in new_posts:
        print(f"  + {p['slug']}")


if __name__ == "__main__":
    main()
