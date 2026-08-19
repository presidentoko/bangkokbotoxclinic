#!/usr/bin/env python3
"""price_scraper.py — Golfdigg 방콕/기타 지역 코스 가격 스크래핑."""

import json, time, re
from pathlib import Path
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup
from rapidfuzz import process, fuzz, utils as rfutils

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# Golfdigg 지역별 페이지 목록 (SSR 가격 포함)
GOLFDIGG_AREA_PAGES = [
    {"area": "Bangkok",         "url": "https://golfdigg.com/en/bangkok/golf-courses"},
    {"area": "Pattaya",         "url": "https://golfdigg.com/en/pattaya/golf-courses"},
    {"area": "Chon Buri",       "url": "https://golfdigg.com/en/chon-buri/golf-courses"},
    {"area": "Phuket",          "url": "https://golfdigg.com/en/phuket/golf-courses"},
    {"area": "Krabi",           "url": "https://golfdigg.com/en/krabi/golf-courses"},
    {"area": "Hua Hin",         "url": "https://golfdigg.com/en/hua-hin/golf-courses"},
    {"area": "Cha Am",          "url": "https://golfdigg.com/en/cha-am/golf-courses"},
    {"area": "Chiang Mai",      "url": "https://golfdigg.com/en/chiangmai/golf-courses"},
    {"area": "Chiang Rai",      "url": "https://golfdigg.com/en/chiang-rai/golf-courses"},
    {"area": "Khao Yai",        "url": "https://golfdigg.com/en/khao-yai/golf-courses"},
    {"area": "Nakhon Ratchasima", "url": "https://golfdigg.com/en/nakhon-ratchasima/golf-courses"},
    {"area": "Rayong",          "url": "https://golfdigg.com/en/rayong/golf-courses"},
    {"area": "Samui",           "url": "https://golfdigg.com/en/koh-samui/golf-courses"},
    {"area": "Ayutthaya",       "url": "https://golfdigg.com/en/ayutthaya/golf-courses"},
    {"area": "Kanchanaburi",    "url": "https://golfdigg.com/en/kanchanaburi/golf-courses"},
]

SOURCE_AGENCY = "Golfdigg"
GOLFDIGG_BASE  = "https://golfdigg.com/en/courses"
MATCH_THRESHOLD   = 82
MIN_MATCH_LEN     = 8   # 매칭된 이름이 너무 짧으면 오매칭으로 간주
CADDY_DEFAULT     = 400
CART_DEFAULT      = 800
WEEKEND_MULTIPLIER = 1.30  # 주말 가격 ≈ 주중 × 1.30


# 골프장 이름에서 정보가 없는 공통어. 이걸 걷어내야 고유 부분끼리 비교가 된다.
_GENERIC_TOKENS = {
    "golf", "club", "clubs", "country", "resort", "international", "course",
    "courses", "and", "the", "co", "ltd", "สนามกอล์ฟ",
}


def name_core(s: str) -> str:
    """공통어를 뺀 고유 부분만 남긴다. 'Bangpra International Golf Club' -> 'bangpra'."""
    s = re.sub(r"[^\w\s]", " ", s.lower())
    return " ".join(t for t in s.split() if t not in _GENERIC_TOKENS)


def _fallback_match(name_clean: str, core_names: dict[str, str]):
    """고유 부분끼리 비교하는 2차 매칭. 실패하면 None."""
    core = name_core(name_clean)
    if len(core.replace(" ", "")) < 3:
        return None
    hit = process.extractOne(core, list(core_names.keys()),
                             scorer=fuzz.token_set_ratio,
                             processor=rfutils.default_process)
    if hit and hit[1] >= 90:
        return (core_names[hit[0]], hit[1])
    # 띄어쓰기만 다른 경우 ("Kabinburi" vs "Kabin Buri") — 공백을 지우고 한 번 더.
    squashed = {k.replace(" ", ""): v for k, v in core_names.items()}
    hit = process.extractOne(core.replace(" ", ""), list(squashed.keys()),
                             scorer=fuzz.ratio)
    if hit and hit[1] >= 92:
        return (squashed[hit[0]], hit[1])
    return None


def fetch_soup(url: str) -> BeautifulSoup | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  SKIP {url}: {e}")
        return None


def parse_baht(text: str) -> int | None:
    """฿ 1,234 또는 1,234 THB 형식에서 정수 추출."""
    cleaned = text.replace(",", "").replace("฿", "").replace("THB", "").strip()
    m = re.search(r"\d+", cleaned)
    if not m:
        return None
    val = int(m.group())
    return val if val >= 100 else None  # 100 미만은 파싱 오류로 간주


def scrape_area_page(page: dict, master_names: list[str], name_to_id: dict, unmatched: list,
                     core_names: dict[str, str] | None = None) -> list[dict]:
    """Golfdigg 지역 페이지에서 코스 카드 파싱.

    Golfdigg는 CSS Module 클래스를 사용:
      - 카드 wrapper: class 포함 'infoWrapper'
      - 코스명: p.line-clamp-1
      - 가격: h5 (첫 번째)
    """
    core_names = core_names if core_names is not None else {name_core(n): n for n in master_names}
    url  = page["url"]
    area = page["area"]
    soup = fetch_soup(url)
    if not soup:
        return []

    results = []

    # Golfdigg CSS Module: class에 'infoWrapper'가 포함된 div
    cards = [d for d in soup.find_all("div")
             if any("infoWrapper" in c for c in d.get("class", []))]

    if not cards:
        # fallback: CourseCardSearch 패턴으로 재시도
        cards = [d for d in soup.find_all("div")
                 if any("CourseCardSearch" in c for c in d.get("class", []))]

    print(f"  {area}: {len(cards)} cards found")

    for card in cards:
        # 코스명: p.line-clamp-1
        name_el = card.find("p", class_="line-clamp-1")
        if not name_el:
            # fallback: 첫 번째 p 또는 strong
            name_el = card.find("p") or card.find("strong")
        name_text = name_el.get_text(strip=True) if name_el else ""
        if not name_text or len(name_text) < 4:
            continue
        # "Blue Canyon Country Club (Canyon Course)" → "Blue Canyon Country Club" 형식 처리
        name_clean = re.sub(r"\s*\([^)]+\)\s*$", "", name_text).strip() or name_text

        # 가격: h5 (첫 번째) 또는 "฿" 포함 텍스트
        price_el = card.find("h5")
        price_text = price_el.get_text(strip=True) if price_el else ""
        if not price_text or "฿" not in price_text:
            full_text = card.get_text(" ", strip=True)
            m = re.search(r"฿\s*([\d,]+)", full_text)
            price_text = m.group(0) if m else ""
        greenfee = parse_baht(price_text) if price_text else None
        if greenfee is None:
            continue

        # source_url: 슬러그 생성 (Golfdigg href는 JS 라우팅으로 HTML에 없음)
        slug = re.sub(r"[&/]", "-", name_text.lower())
        slug = re.sub(r"[^a-z0-9\s-]", "", slug)
        slug = re.sub(r"\s+", "-", slug.strip())
        slug = re.sub(r"-+", "-", slug).strip("-")
        href = f"{GOLFDIGG_BASE}/{slug}"

        # 코스명 fuzzy match — 짧은 일반 이름(예: "Golf") 오매칭 방지
        top = process.extract(name_clean, master_names, scorer=fuzz.token_sort_ratio,
                              processor=rfutils.default_process, limit=5)
        match = next(
            (m for m in top if m[1] >= MATCH_THRESHOLD and len(m[0]) >= MIN_MATCH_LEN),
            None,
        )
        # 1차가 실패했을 때만 도는 폴백. Golfdigg 와 Google 의 표기가 갈리는 대부분은
        # "Golf / Club / Country / Resort / International" 같은 공통어 구성만 다르고
        # 고유 부분은 같다. token_sort_ratio 는 그 공통어에 눌려 82 를 못 넘는다:
        #   Pinehurst Golf & Country Club   vs  Pinehurst golf club and hotel
        #   Bangpra International Golf Club vs  Bangpra Golf Club
        #   Pattana Golf Club & Resort      vs  Pattana Sports Resort
        # 공통어를 걷어낸 뒤 고유 부분끼리 90 이상일 때만 받는다. 가격 오매칭은
        # 가격 누락보다 나쁘므로(골퍼가 돈을 잘못 안다) 임계를 높게 잡았다.
        if not match:
            fb = _fallback_match(name_clean, core_names)
            if fb:
                match = fb
                print(f"  MATCH~ ({area}): '{name_text}' → '{fb[0]}' (core {fb[1]:.0f}%)")
        if not match:
            print(f"  NO MATCH ({area}): '{name_text}'")
            unmatched.append({"area": area, "name": name_text, "price_text": price_text})
            continue

        course_id = name_to_id.get(match[0], "")
        if not course_id:
            continue

        caddy   = CADDY_DEFAULT
        cart    = CART_DEFAULT
        wkd_gf  = greenfee
        wke_gf  = int(greenfee * WEEKEND_MULTIPLIER)

        wkd_slot = {"greenfee": wkd_gf, "caddy": caddy, "cart": cart}
        wke_slot = {"greenfee": wke_gf, "caddy": caddy, "cart": cart}

        results.append({
            "course_id":    course_id,
            "scraped_at":   datetime.now(timezone.utc).isoformat(),
            "source_agency": SOURCE_AGENCY,
            "source_url":   href,
            "weekday":  {"morning": wkd_slot},
            "weekend":  {"morning": wke_slot},
            "notes":    f"area={area}",
        })
        print(f"  MATCH ({area}): '{name_text}' → '{match[0]}' ({match[1]:.0f}%) wkd=฿{wkd_gf:,}")

    return results


def main():
    db_path  = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    out_path = Path(__file__).parent.parent / "web-golf" / "data" / "price_matrix.json"

    db = json.loads(db_path.read_text(encoding="utf-8"))
    courses = db.get("courses") or db.get("restaurants") or []
    master_names = [c["name"] for c in courses]
    name_to_id   = {c["name"]: c["id"] for c in courses}
    # 공통어를 뺀 이름 -> 원래 이름. 2차 폴백 매칭용.
    core_names   = {name_core(n): n for n in master_names if name_core(n)}

    all_results: list[dict] = []
    seen_ids: set[str] = set()
    unmatched: list[dict] = []

    for page in GOLFDIGG_AREA_PAGES:
        print(f"\nScraping {page['area']}...")
        try:
            scraped = scrape_area_page(page, master_names, name_to_id, unmatched, core_names)
            for entry in scraped:
                if entry["course_id"] not in seen_ids:
                    all_results.append(entry)
                    seen_ids.add(entry["course_id"])
        except Exception as e:
            print(f"  ERROR ({page['area']}): {e}")
        time.sleep(1.5)

    out_path.write_text(
        json.dumps(all_results, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    unmatched_path = Path(__file__).parent.parent / "web-golf" / "data" / "unmatched_prices.json"
    unmatched_path.write_text(
        json.dumps(unmatched, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nDone: {len(all_results)} courses saved → {out_path}")
    print(f"Unmatched: {len(unmatched)} → {unmatched_path}")


if __name__ == "__main__":
    main()
