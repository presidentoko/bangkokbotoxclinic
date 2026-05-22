"""thaisupplyhub 한국어 블로그 글 자동 생성기.

타겟: 한국 OEM 바이어, 무역회사 소싱 매니저, 한국 SME 진출 검토자.
검색 키워드: "태국 OEM 추천", "방콕 화장품 OEM", "태국 자동차 부품 공급사",
"태국 DBD 검증" 등 long-tail.

전략:
- master_db.json (city × category) 매트릭스에서 suppliers 5+ 추출
- DBD 검증을 핵심 차별점으로 surface (legal_name, capital_thb, registered_date)
- RFQ funnel 자연 유도 — 우리 폼이 최종 conversion
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
    "manufacturer":      "OEM 제조사",
    "auto_parts":        "자동차 부품 공급사",
    "food_mfg":          "식품 OEM",
    "corporate_office":  "기업 본사",
    "logistics":         "물류 업체",
    "plastic":           "플라스틱 가공",
    "steel":             "철강 / 금속 공급사",
    "chemical":          "화학 OEM",
    "electronics":       "전자 OEM",
    "rubber":            "고무 제조사",
    "textile":           "섬유 OEM",
    "machinery":         "기계 공급사",
    "equipment":         "산업 장비 공급사",
    "exporter":          "수출 업체",
    "warehouse":         "창고 업체",
    "machining":         "가공 / 머시닝 업체",
    "packaging":         "패키징 제조사",
    "factory":           "공장",
    "industrial_estate": "산업단지",
}

# Naver 검색어 핵심 키워드 매핑 (검색량 큰 표현)
CATEGORY_NAVER_KEYWORD = {
    "manufacturer":      "OEM 추천",
    "auto_parts":        "자동차 부품",
    "food_mfg":          "식품 OEM",
    "corporate_office":  "현지 법인",
    "logistics":         "물류",
    "plastic":           "플라스틱 OEM",
    "steel":             "철강 공급",
    "chemical":          "화학 OEM",
    "electronics":       "전자 OEM",
    "rubber":            "고무 OEM",
    "textile":           "섬유 OEM",
    "machinery":         "기계 공급",
    "equipment":         "산업 장비",
    "exporter":          "수출업체",
    "warehouse":         "창고",
    "machining":         "정밀 가공",
    "packaging":         "패키징 OEM",
    "factory":           "공장 추천",
    "industrial_estate": "산업단지",
}

CITY_LABEL_KO = {
    "bangkok":                  "방콕",
    "chon_buri":                "촌부리 (이스턴시보드)",
    "chonburi":                 "촌부리",
    "samut_prakan":             "사뭇쁘라깐 (방콕 남동부)",
    "pathum_thani":             "빠툼타니 (방콕 북부)",
    "samut_sakhon":             "사뭇사콘 (방콕 서부, 식품/수산물)",
    "rayong":                   "라용 (Map Ta Phut)",
    "si_racha":                 "시라차 (람차방항)",
    "nonthaburi":               "논타부리",
    "nakhon_ratchasima":        "코랏 (나콘랏차시마)",
    "phra_nakhon_si_ayutthaya": "아유타야 (Rojana / Hi-Tech)",
    "nakhon_pathom":            "나콘빠톰",
    "chiang_mai":               "치앙마이",
    "khon_kaen":                "콘깬",
    "songkhla":                 "송클라",
    "prachuap_khiri_khan":      "프라추압키리칸 (후아힌)",
    "phuket":                   "푸켓",
    "lamphun":                  "람푼",
}

CITY_REGION_BLURB_KO = {
    "bangkok":                  "방콕 — 태국 OEM/기업 본사 (corporate office) 가장 밀집. 한국 발주는 대부분 방콕 본사에 RFQ 보내고 plant 매칭은 본사가 알아서. Bang Bon, Bangkok Noi 등 도심권에 일부 plant 도 있음.",
    "chon_buri":                "촌부리 / 이스턴시보드 — Laem Chabang 심해항 30분 거리. 자동차 / 화학 / 전자 OEM 클러스터. 한국 SME 진출 1순위 지역.",
    "rayong":                   "라용 — Map Ta Phut 석유화학 단지. LG 화학, PTT 등. 화학/플라스틱 원재료 발주 핵심.",
    "samut_prakan":             "사뭇쁘라깐 — 수완나품 공항 가까움. 전자 / 자동차 Tier 2 / 자동차 부품 EOL. 한국 SME 진출 검토 단골.",
    "pathum_thani":             "빠툼타니 — Nava Nakorn 산단. 식품 / 전자 / 자동차 협력사. 방콕 통근 가능.",
    "samut_sakhon":             "사뭇사콘 — 태국 수산물 / 식품 가공 수도. 한국 식품 ODM 검토 시 1순위. 패키징 / 플라스틱도 강함.",
    "phra_nakhon_si_ayutthaya": "아유타야 — Rojana / Hi-Tech / Bang Pa-In 산단. 자동차 / 전자 OEM. 일본계 OEM (Honda, Toyota) Tier 1 다수.",
    "nakhon_pathom":            "나콘빠톰 — 방콕 서부 식품가공 / 패키징 / 경공업. 화장품 ODM 일부.",
    "si_racha":                 "시라차 — 람차방항 인접. 물류 / 창고 / 자동차 부품 Tier 1.",
    "khon_kaen":                "콘깬 — 동북부 (이산) 산업 게이트웨이. 농산물 가공 / 식품 / 물류.",
    "nakhon_ratchasima":        "코랏 — 동북부 + 방콕 연결 거점. 자동차 부품 + 식품 가공.",
}

DBD_BLURB = (
    "DBD (Department of Business Development) 검증이란 태국 상무부 공식 사업자 등록 정보를 "
    "우리가 자동으로 매칭한 결과예요. legal name (법인명), capital_thb (자본금), 등록일, TSIC 코드 "
    "(태국 표준산업분류) 등을 확인해서 \"실재 등록 법인인지\" 신뢰점수로 변환. "
    "Alibaba 같은 곳은 이 검증이 없어서 brassplate (페이퍼 컴퍼니) 가능성이 있는데, 우리는 거기서 한 단계 더 들어간 거예요."
)

RFQ_FOOTER = (
    "🇰🇷 **한국 바이어용 RFQ 폼**: 위 공급사 중 관심 가는 곳 있으면 우리 사이트에서 RFQ (Request for Quotation) "
    "제출하실 수 있어요. 폼에 한국어로 spec 적어주시면 영문 번역 + 공급사 컨택까지 무료로 도와드립니다. "
    "[RFQ 폼 보러 가기](/contact)"
)


def city_to_slug(city: str) -> str:
    return city.lower().replace(" ", "_")


def city_label(slug: str) -> str:
    if slug in CITY_LABEL_KO:
        return CITY_LABEL_KO[slug]
    return " ".join(w.capitalize() for w in slug.split("_"))


def post_slug(cat: str, city_slug: str) -> str:
    cat_slug = cat.replace("_", "-")
    cs = city_slug.replace("_", "-")
    return f"top-{cat_slug}-suppliers-in-{cs}"


_SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')


def collect_existing_slugs() -> set[str]:
    out: set[str] = set()
    for p in (POSTS_KO_TS, POSTS_AUTO_KO_TS):
        if not p.exists():
            continue
        out.update(_SLUG_RE.findall(p.read_text(encoding="utf-8")))
    return out


SKIP_CATEGORIES = {"shop"}


def build_matrix(db: dict, min_count: int = 5) -> list[tuple[str, str, int, list[dict]]]:
    suppliers = db.get("suppliers") or db.get("courses") or db.get("restaurants") or []
    by_pair: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for s in suppliers:
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
        # Prefer DBD-verified suppliers in top-10 if available
        def sort_key(s: dict) -> tuple:
            dbd = s.get("dbd") or {}
            match_score = dbd.get("match_score") or 0
            b2b = s.get("b2b_score") or 0
            return (match_score, b2b, s.get("total_reviews") or 0)
        top = sorted(sups, key=sort_key, reverse=True)[:10]
        rows.append((city_slug, cat, len(sups), top))
    rows.sort(key=lambda r: r[2], reverse=True)
    return rows


def count_dbd_verified(top: list[dict]) -> int:
    return sum(1 for s in top if (s.get("dbd") or {}).get("match_score", 0) >= 80)


def fmt_capital_thb(thb: int | None) -> str:
    if not thb:
        return ""
    if thb >= 1_000_000_000:
        return f"자본금 ฿{thb / 1_000_000_000:.1f}B"
    if thb >= 1_000_000:
        return f"자본금 ฿{thb / 1_000_000:.0f}M"
    return f"자본금 ฿{thb:,}"


def fmt_supplier_line_ko(rank: int, s: dict) -> str:
    name = s["name"].strip()
    district = s.get("district") or ""
    site = (s.get("website") or "").strip()
    maps = s.get("maps_url") or ""

    dbd = s.get("dbd") or {}
    match_score = dbd.get("match_score", 0)
    legal_name = (dbd.get("legal_name") or "").strip()
    capital_thb = dbd.get("capital_thb")
    registered_date = dbd.get("registered_date") or ""

    tier = ""
    if match_score >= 90:
        tier = " 🛡️ **DBD 검증 강함**"
    elif match_score >= 80:
        tier = " ✅ DBD 검증"

    bits = [f"**{rank}. {name}**{tier}"]
    if district:
        bits.append(f"· 위치: {district}")
    if site:
        host = re.sub(r"^https?://(www\.)?", "", site).rstrip("/").split("/")[0]
        bits.append(f"· [홈페이지]({site})")
    elif maps:
        bits.append(f"· [지도]({maps})")
    line = " ".join(bits)

    # DBD details — only if verified
    if match_score >= 80 and (legal_name or capital_thb):
        sub_bits = []
        if legal_name and legal_name.lower() != name.lower():
            sub_bits.append(f"법인명 *{legal_name}*")
        cap_str = fmt_capital_thb(capital_thb)
        if cap_str:
            sub_bits.append(cap_str)
        if registered_date:
            year = registered_date[:4] if len(registered_date) >= 4 else ""
            if year:
                sub_bits.append(f"{year}년 등록")
        if sub_bits:
            line += " — " + ", ".join(sub_bits) + "."
        else:
            line += "."
    else:
        line += "."

    topics = s.get("mentioned_topics") or []
    if topics:
        top_topic = topics[0].get("topic", "").replace("_", " ")
        if top_topic:
            line += f" 리뷰 키워드: {top_topic}."

    return line


def build_intro_ko(city: str, label: str, count: int, dbd_count: int, naver_kw: str) -> str:
    parts = [
        f"태국에서 {city} {label} 알아보시는 분들 정리. \"{city} {naver_kw}\" 검색하면 정보가 흩어져 있어서 우리 데이터로 한 번에 정리해드릴게요.",
        f"우리 directory 에 등록된 {city} {label} 만 총 **{count:,}곳**, 그 중 DBD 검증 강함/검증 합쳐서 **{dbd_count}곳**이 신뢰도 검증 완료. 이 글은 매칭 신뢰도 + B2B 신호 종합 상위 10곳을 추렸어요.",
    ]
    return " ".join(parts)


def build_body_ko(city_slug: str, cat: str, count: int, top: list[dict], cat_rank_in_city: int | None) -> str:
    label = CATEGORY_LABEL_KO[cat]
    city = city_label(city_slug)
    region = CITY_REGION_BLURB_KO.get(city_slug, "")
    naver_kw = CATEGORY_NAVER_KEYWORD.get(cat, label)
    cat_url = f"/c/{cat}"
    city_url = f"/city/{city_slug}"

    n = min(10, len(top))
    dbd_count = count_dbd_verified(top)

    lines: list[str] = []
    lines.append(build_intro_ko(city, label, count, dbd_count, naver_kw))
    lines.append("")

    lines.append("## DBD 검증이 뭐고 왜 중요한가")
    lines.append("")
    lines.append(DBD_BLURB)
    lines.append("")

    lines.append(f"## {city} {label} TOP {n}")
    lines.append("")
    for i, s in enumerate(top[:n], start=1):
        lines.append("- " + fmt_supplier_line_ko(i, s))
    lines.append("")

    if region:
        lines.append(f"## {city} — 산업 지리 한 줄 정리")
        lines.append("")
        lines.append(region)
        lines.append("")

    # Korean buyer-specific practical info
    lines.append("## 한국 바이어가 알아두면 좋은 것")
    lines.append("")
    ko_tips = [
        "**RFQ 보내는 법**: 위 공급사 홈페이지 직접 또는 우리 사이트 [RFQ 폼](/contact) 통해서. 영문 또는 한국어 다 OK — 한국어면 우리가 영문 번역 + 공급사 매칭까지 해드림.",
        "**MOQ (최소 발주 수량)**: 태국 OEM 은 보통 알리바바보다 낮음 (100-5,000 units 가능, ODM 은 1,000+). 첫 거래는 샘플 발주 후 정식 PO.",
        "**리드타임**: 일반 OEM 30-45일, 복잡 spec 60-90일. 컨테이너 출항 LCL/FCL 추가 5-7일.",
        "**결제**: T/T (Telegraphic Transfer) 30% 선금 + 70% 출항 전 일반적. L/C 도 가능 (큰 발주).",
        "**물류**: Laem Chabang (촌부리) 또는 Bangkok Port 출항 → 부산 직항 컨테이너 5-7일. CFR/CIF 인코텀즈 협상.",
    ]
    if cat == "manufacturer" or cat == "food_mfg":
        ko_tips.append("**식약처 신고/할랄 인증**: 식품/화장품이면 KFDA 등록 필요. 할랄 인증은 태국 공급사 다수 보유 — 별도 요청 가능.")
    if cat == "auto_parts":
        ko_tips.append("**자동차 부품 인증**: IATF 16949 보유 공급사 우선. 일본계 OEM (Toyota/Honda) Tier 1 다수.")
    if cat == "chemical" or cat == "plastic":
        ko_tips.append("**REACH / RoHS 인증**: 유럽 수출 위한 인증 보유 공급사 점차 늘어남. 발주 전 인증 사본 요청.")
    for t in ko_tips:
        lines.append(f"- {t}")
    lines.append("")

    if cat_rank_in_city is not None:
        lines.append(
            f"참고로 {city} 에서 {label} 은 카테고리 수 기준 **#{cat_rank_in_city}위** ({count:,}곳). 이 도시 진출 검토 시 우선 카테고리 매핑."
        )
        lines.append("")

    lines.append("## 더 깊게 보려면")
    lines.append("")
    lines.append(f"- [전국 {label} 전체 리스트]({cat_url})")
    lines.append(f"- [{city} 모든 공급사]({city_url})")
    lines.append("- [태국 OEM 처음 알아보는 분 한국어 가이드](/ko/blog/thailand-oem-first-guide)")
    lines.append("- [알리바바 vs 태국 직접 소싱 비교](/ko/blog/alibaba-vs-thailand-direct)")
    lines.append("")
    lines.append(RFQ_FOOTER)
    lines.append("")
    lines.append("자본금 / 등록일 / TSIC 코드는 우리가 자동 매칭한 시점 기준이며, 정확한 거래 전 직접 공급사 또는 우리 RFQ 폼을 통해 한 번 더 확인하세요.")
    return "\n".join(lines)


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


POSTS_AUTO_KO_HEADER = """// AUTO-GENERATED by scripts/generate_blog_ko.py — DO NOT EDIT BY HAND.
// 한국어 자동 블로그 글 — 네이버 검색 long-tail 캡처 + 한국 OEM buyer RFQ funnel.
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
        naver_kw = CATEGORY_NAVER_KEYWORD.get(cat, label)
        title = f"{city} {label} TOP 10 — DBD 검증 + 한국 바이어 가이드 (2026)"
        meta_title = f"{city} {naver_kw} TOP 10 — DBD 검증 공급사 정리"
        meta_desc = (
            f"{city} {label} {count:,}곳 중 DBD 검증 강한 TOP 10. "
            f"법인명 / 자본금 / 등록일 / TSIC 코드 정리. 한국 바이어용 RFQ 양식 + MOQ / 리드타임 / 결제 조건 안내."
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
            "category": "한국 바이어 가이드",
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
