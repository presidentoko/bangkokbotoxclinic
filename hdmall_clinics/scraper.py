"""HDmall.co.th full scraper.

Pipeline:
1. directory_crawl() — fetch all /sitemap/<cat>/brands pages, collect brand URLs
2. parse_clinic_page() — extract name, rating, packages from each brand page
3. match_to_masterdb() — fuzzy match HDmall brands → GMaps place_ids
4. write_outputs() — write external_reviews/<id>.json + pricing/<id>.json
"""
from __future__ import annotations

import hashlib
import json
import re
import threading
import time
import urllib.parse
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Optional

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

ROOT = Path(__file__).parent.parent
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
EXTERNAL_REVIEWS_DIR = ROOT / "web" / "data" / "external_reviews"
PRICING_DIR = ROOT / "web" / "data" / "pricing"
CACHE_DIR = Path(__file__).parent / "cache"

EXTERNAL_REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
PRICING_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)

# All HDmall brand URL prefixes (/<prefix>/<slug> = brand page).
# Note (2026-05-18): tried expanding to medical-aesthetics / physiotherapy /
# vaccine-injection / family-planning / male-health / mental-health /
# elderly-and-patient-care / health-checkup-program — those categories use
# /tags/... URL pattern, not /<cat>/<slug>, so they returned 0 brands.
# Reverted to the 4 categories with confirmed /sitemap/<cat>/brands indexes.
# To expand HDmall coverage further, need a different scraper pattern
# (search API or tag-page crawling) — separate effort.
CLINIC_CATEGORIES = [
    "beauty",
    "dental-clinics",
    "health-checkup",
    "surgeries",
]

# Sitemap path → HDmall brand URL prefix mapping
# Only include categories that actually have /<prefix>/<slug> brand pages
SITEMAP_CATEGORY_MAP = {
    "beauty": "beauty",
    "dental-clinics": "dental-clinics",
    "health-checkup": "health-checkup",
}

# Additional category pages to crawl directly (sitemap doesn't list their brands)
DIRECT_CATEGORY_PAGES = [
    "surgeries",  # https://hdmall.co.th/surgeries
]

RE_BRAND_HREF = re.compile(r'href="(/(' + "|".join(re.escape(c) for c in CLINIC_CATEGORIES) + r')/([^"?#]+))"')
RE_PAGINATION = re.compile(r'href="(/sitemap/[^"]+/brands\?page=(\d+))"')
RE_H1 = re.compile(r'<h1[^>]*class="packages-header__title"[^>]*>\s*([^<]+?)\s*</h1>', re.DOTALL)
RE_STAR_RATING = re.compile(r'class="star-rating"[^>]*>\s*<img[^>]*>\s*([0-9]+\.?[0-9]*)')
RE_PACKAGE_COUNT = re.compile(r"กำลังโชว์\s*\n?\s*([0-9,]+)\s*แพ็กเกจ")
RE_BRAND_ID = re.compile(r'/brands/logo/(\d+)/')
RE_DISTRICT = re.compile(r'class="package-location__item"[^>]*>.*?<span>\s*([^<]+?)\s*</span>', re.DOTALL)
RE_JSONLD = re.compile(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', re.DOTALL)
RE_CARD = re.compile(
    r'class="card-package-list[^"]*"[^>]*'
    r'(?=.*?data-brand="([^"]*)")'
    r'(?=.*?data-event-value="([^"]*)")'
    r'(?=.*?data-price="([^"]*)")'
    r'(?=.*?data-fb-id="([^"]*)")'
    r'(?=.*?data-link="([^"]*)")',
    re.DOTALL,
)


@dataclass
class Package:
    sku: str
    name: str
    current_price: float
    original_price: float
    url_slug: str
    category: str = ""


@dataclass
class HDmallClinic:
    hdmall_url: str
    category: str
    slug: str
    name: str = ""
    brand_id: Optional[int] = None
    rating: Optional[float] = None
    package_count: int = 0
    districts: list[str] = field(default_factory=list)
    packages: list[dict] = field(default_factory=list)
    fetch_ok: bool = False
    error: str = ""


@dataclass
class MatchResult:
    place_id: str
    gmaps_name: str
    hdmall_url: str
    hdmall_name: str
    score: float
    method: str = ""
    needs_review: bool = False


# ── utility ────────────────────────────────────────────────────────────────────

# Generic words that appear in almost every clinic name — exclude from matching
_STOPWORDS_EN = {
    "clinic", "center", "centre", "medical", "health", "dental",
    "hospital", "wellness", "care", "beauty", "aesthetic", "aesthetics",
    "surgery", "surgical", "cosmetic", "skin", "laser", "clinic",
    "and", "the", "at", "of",
}
_STOPWORDS_TH = {
    "คลินิก", "เวชกรรม", "โรงพยาบาล", "แพทย์", "การแพทย์",
    "ทันตกรรม", "ศูนย์", "ความงาม", "สุขภาพ", "คลีนิค",
    "สาขา", "หมอ",
}


# Common Thai branch / location suffix patterns — strip before tokenizing so the
# GMaps "<brand> สาขาบางนา" branch suffix doesn't dilute matches against the
# HDmall canonical "<brand>" name.
_RE_THAI_BRANCH = re.compile(
    r"สาขา\s*\S+|จัดส่ง\s*\S+|\([^)]+\)|\[[^\]]+\]"
)


def _normalize(s: str) -> str:
    s = s.lower()
    # Strip parenthesized / bracketed branch info + Thai สาขา-suffix BEFORE
    # punctuation normalization, so the pattern still has its parens to match.
    s = _RE_THAI_BRANCH.sub(" ", s)
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _content_tokens(s: str) -> set[str]:
    tokens = set(_normalize(s).split())
    tokens -= _STOPWORDS_EN
    tokens -= _STOPWORDS_TH
    # Remove single-character tokens
    tokens = {t for t in tokens if len(t) > 1}
    return tokens


def _jaccard(a: str, b: str) -> float:
    """Jaccard with containment escalator.

    Pure token-overlap Jaccard penalizes cases where one name is the canonical
    form and the other has extra context (branch, district, descriptor). When
    one tokenset is a non-trivial subset of the other, that's a strong signal
    they refer to the same brand even if the union is large.
    """
    ta = _content_tokens(a)
    tb = _content_tokens(b)
    if not ta or not tb:
        # Fall back to raw tokens if stopword removal leaves nothing
        ta = set(_normalize(a).split())
        tb = set(_normalize(b).split())
    if not ta or not tb:
        return 0.0
    intersection = len(ta & tb)
    if intersection == 0:
        return 0.0

    union = len(ta | tb)
    base = intersection / union

    # Containment bonus — if the smaller set is mostly a subset of the larger.
    # Require ≥2 shared tokens to avoid spurious "Clinic" / single-name matches.
    smaller = min(len(ta), len(tb))
    if intersection >= 2 and intersection / smaller >= 0.8:
        # Boost toward 1.0 by how dominant the containment is.
        # 80% containment → +0.15, 100% containment → +0.25.
        boost = 0.15 + 0.10 * ((intersection / smaller) - 0.8) / 0.2
        base = min(1.0, base + boost)
    return base


def _district_overlap(a_districts: list[str], b_address: str) -> bool:
    if not a_districts or not b_address:
        return False
    b_low = b_address.lower()
    for d in a_districts:
        d_low = d.lower()
        if d_low and (d_low in b_low or d_low[:8] in b_low):
            return True
    return False


# ── stage 1: directory crawl ────────────────────────────────────────────────

def _fetch_page_html(page, url: str, cache_path: Path) -> str:
    if cache_path.exists() and cache_path.stat().st_size > 50000:
        return cache_path.read_text(encoding="utf-8")
    page.goto(url, wait_until="domcontentloaded", timeout=20000)
    try:
        page.wait_for_load_state("networkidle", timeout=6000)
    except PWTimeout:
        pass
    html = page.content()
    cache_path.write_text(html, encoding="utf-8")
    time.sleep(0.6)
    return html


def _extract_brands_from_html(html: str, cat: str) -> set[str]:
    slugs: set[str] = set()
    for m in RE_BRAND_HREF.finditer(html):
        slug = m.group(3)
        if slug in ("brands", "categories", "reviews", "tags"):
            continue
        slugs.add(slug)
    return slugs


def _get_max_page(html: str, cat_sitemap: str) -> int:
    max_p = 1
    for m in RE_PAGINATION.finditer(html):
        p = int(m.group(2))
        if p > max_p:
            max_p = p
    return max_p


def crawl_directory(page) -> dict[str, set[str]]:
    """Return {hdmall_category: {brand_slug, ...}} across all clinic categories."""
    brand_map: dict[str, set[str]] = {}

    for sitemap_cat, hdmall_cat in SITEMAP_CATEGORY_MAP.items():
        base_url = f"https://hdmall.co.th/sitemap/{sitemap_cat}/brands"
        cache_p1 = CACHE_DIR / f"dir_{sitemap_cat}_p1.html"

        try:
            html_p1 = _fetch_page_html(page, base_url, cache_p1)
        except Exception as e:
            print(f"  [dir] ERROR {sitemap_cat}: {e}")
            continue

        slugs = _extract_brands_from_html(html_p1, hdmall_cat)
        max_page = _get_max_page(html_p1, sitemap_cat)

        for pg in range(2, max_page + 1):
            url_pg = f"{base_url}?page={pg}"
            cache_pg = CACHE_DIR / f"dir_{sitemap_cat}_p{pg}.html"
            try:
                html_pg = _fetch_page_html(page, url_pg, cache_pg)
                slugs.update(_extract_brands_from_html(html_pg, hdmall_cat))
            except Exception as e:
                print(f"  [dir] ERROR {sitemap_cat} page {pg}: {e}")

        brand_map[hdmall_cat] = slugs
        print(f"  [dir] {sitemap_cat} → /{hdmall_cat}/: {len(slugs)} brands ({max_page} pages)")

    # Direct category pages (not reachable via sitemap)
    RE_CAT_PAGE_HREF = re.compile(r'href="(/(%s)/([^"?#]+))"' % "|".join(
        re.escape(c) for c in DIRECT_CATEGORY_PAGES
    ))
    RE_CAT_PAGINATION = re.compile(r'href="(/([^"]+)\?page=(\d+))"')

    for direct_cat in DIRECT_CATEGORY_PAGES:
        base_url = f"https://hdmall.co.th/{direct_cat}"
        cache_p1 = CACHE_DIR / f"dir_direct_{direct_cat}_p1.html"
        try:
            html_p1 = _fetch_page_html(page, base_url, cache_p1)
        except Exception as e:
            print(f"  [dir] ERROR direct {direct_cat}: {e}")
            continue

        slugs: set[str] = set()
        for m in RE_CAT_PAGE_HREF.finditer(html_p1):
            slug = m.group(3)
            if slug not in ("brands", "categories", "reviews", "tags"):
                slugs.add(slug)

        # Check pagination
        max_page = 1
        for m in RE_CAT_PAGINATION.finditer(html_p1):
            try:
                p = int(m.group(3))
                if p > max_page:
                    max_page = p
            except ValueError:
                pass

        for pg in range(2, max_page + 1):
            url_pg = f"{base_url}?page={pg}"
            cache_pg = CACHE_DIR / f"dir_direct_{direct_cat}_p{pg}.html"
            try:
                html_pg = _fetch_page_html(page, url_pg, cache_pg)
                for m in RE_CAT_PAGE_HREF.finditer(html_pg):
                    slug = m.group(3)
                    if slug not in ("brands", "categories", "reviews", "tags"):
                        slugs.add(slug)
            except Exception as e:
                print(f"  [dir] ERROR direct {direct_cat} page {pg}: {e}")

        brand_map[direct_cat] = slugs
        print(f"  [dir] direct /{direct_cat}/: {len(slugs)} brands ({max_page} pages)")

    return brand_map


# ── stage 2: clinic page parser ────────────────────────────────────────────

def parse_clinic_page(page, category: str, slug: str) -> HDmallClinic:
    url = f"https://hdmall.co.th/{category}/{slug}"
    clinic = HDmallClinic(hdmall_url=url, category=category, slug=slug)

    slug_hash = hashlib.md5(f"{category}/{slug}".encode()).hexdigest()[:12]
    cache = CACHE_DIR / f"clinic_{slug_hash}.html"
    if cache.exists() and cache.stat().st_size > 10000:
        html = cache.read_text(encoding="utf-8")
    else:
        try:
            resp = page.goto(url, wait_until="domcontentloaded", timeout=25000)
            if resp and resp.status == 404:
                clinic.error = "404"
                return clinic
            try:
                page.wait_for_load_state("networkidle", timeout=6000)
            except PWTimeout:
                pass
            html = page.content()
            cache.write_text(html, encoding="utf-8")
            time.sleep(0.8)
        except Exception as e:
            clinic.error = str(e)[:120]
            return clinic

    # Name
    m = RE_H1.search(html)
    if m:
        clinic.name = m.group(1).strip()

    # Brand ID from logo URL
    m = RE_BRAND_ID.search(html)
    if m:
        clinic.brand_id = int(m.group(1))

    # Rating
    m = RE_STAR_RATING.search(html)
    if m:
        try:
            clinic.rating = float(m.group(1).strip())
        except ValueError:
            pass

    # Package count
    m = RE_PACKAGE_COUNT.search(html)
    if m:
        clinic.package_count = int(m.group(1).replace(",", ""))

    # Districts (first few occurrences)
    districts = []
    for dm in RE_DISTRICT.finditer(html):
        d = dm.group(1).strip()
        if d and d not in districts and len(d) < 50:
            districts.append(d)
        if len(districts) >= 5:
            break
    clinic.districts = districts

    # Packages — try JSON-LD ItemList first
    packages: list[Package] = []
    for jld_m in RE_JSONLD.finditer(html):
        try:
            data = json.loads(jld_m.group(1).strip())
        except Exception:
            continue
        if data.get("@type") == "ItemList" and "itemListElement" in data:
            for item in data["itemListElement"]:
                prod = item.get("item", {})
                offer = prod.get("offers", {})
                try:
                    price = float(offer.get("price", 0) or 0)
                except (ValueError, TypeError):
                    price = 0.0
                if prod.get("name") and price > 0:
                    packages.append(Package(
                        sku=str(prod.get("sku", "")),
                        name=prod.get("name", ""),
                        current_price=price,
                        original_price=price,
                        url_slug=prod.get("url", "").replace("https://hdmall.co.th/", ""),
                        category=category,
                    ))
            break

    # Fallback: data-* card attributes if JSON-LD is incomplete
    if not packages:
        seen_skus: set[str] = set()
        for card_m in RE_CARD.finditer(html):
            sku = card_m.group(4)
            if sku in seen_skus:
                continue
            seen_skus.add(sku)
            try:
                cur_price = float(card_m.group(2))
                orig_price = float(card_m.group(3))
            except (ValueError, TypeError):
                cur_price = orig_price = 0.0
            packages.append(Package(
                sku=sku,
                name="",  # name requires inner HTML parse
                current_price=cur_price,
                original_price=orig_price,
                url_slug=card_m.group(5),
                category=category,
            ))

    clinic.packages = [asdict(p) for p in packages]
    clinic.fetch_ok = True
    return clinic


# ── stage 3: matcher ────────────────────────────────────────────────────────

CITY_SLUG = "bangkok"
CLINIC_TYPES = (
    "clinic", "dental", "medical", "hospital", "beauty",
    "cosmetic", "surgery", "skin", "spa", "aesthetic", "laser",
)


def load_bangkok_clinics() -> list[dict]:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = [c for c in db["clinics"] if c.get("city_slug") == CITY_SLUG]

    def is_clinic(c):
        t = (c.get("primary_type") or "").lower()
        return any(k in t for k in CLINIC_TYPES)

    return [c for c in clinics if is_clinic(c)]


def match_clinics(hdmall_clinics: list[HDmallClinic], gmaps_clinics: list[dict]) -> list[MatchResult]:
    results: list[MatchResult] = []
    for hd in hdmall_clinics:
        if not hd.name:
            continue
        best: Optional[MatchResult] = None
        for gm in gmaps_clinics:
            score = _jaccard(hd.name, gm["name"])
            # District overlap bonus — location-confirmed match is a strong signal.
            # Increased from 0.15 → 0.20 (2026-05-18) for borderline cases.
            if hd.districts and gm.get("address"):
                if _district_overlap(hd.districts, gm["address"]):
                    score = min(1.0, score + 0.20)
            if best is None or score > best.score:
                best = MatchResult(
                    place_id=gm["place_id"],
                    gmaps_name=gm["name"],
                    hdmall_url=hd.hdmall_url,
                    hdmall_name=hd.name,
                    score=score,
                    method="jaccard+district",
                    needs_review=score < 0.45,  # 0.5 → 0.45 — more matches counted "strong"
                )
        if best and best.score >= 0.25:
            results.append(best)
    return results


# ── stage 4: output writers ─────────────────────────────────────────────────

def write_outputs(matches: list[MatchResult], hd_by_url: dict[str, HDmallClinic]):
    written_reviews = written_pricing = 0
    for match in matches:
        if match.needs_review and match.score < 0.35:
            continue  # skip low-confidence matches
        hd = hd_by_url.get(match.hdmall_url)
        if not hd:
            continue

        # external_reviews — filename uses _ instead of : to match build_master_db.py convention
        cid = match.place_id.replace(":", "_")
        rev_path = EXTERNAL_REVIEWS_DIR / f"{cid}.json"
        review_data = {
            "place_id": match.place_id,
            "source": "hdmall",
            "hdmall_url": hd.hdmall_url,
            "hdmall_name": hd.name,
            "hdmall_rating": hd.rating,
            "hdmall_package_count": hd.package_count,
            "match_score": round(match.score, 3),
            "match_needs_review": match.needs_review,
            "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        rev_path.write_text(json.dumps(review_data, ensure_ascii=False, indent=2), encoding="utf-8")
        written_reviews += 1

        # pricing
        if hd.packages:
            price_path = PRICING_DIR / f"{cid}.json"
            price_data = {
                "place_id": match.place_id,
                "source": "hdmall",
                "hdmall_url": hd.hdmall_url,
                "hdmall_name": hd.name,
                "packages": hd.packages,
                "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
            price_path.write_text(json.dumps(price_data, ensure_ascii=False, indent=2), encoding="utf-8")
            written_pricing += 1

    return written_reviews, written_pricing


# ── main ────────────────────────────────────────────────────────────────────

def main(max_clinics: int = 0):
    """
    max_clinics: 0 = unlimited, N = stop after N clinic pages (for testing).
    """
    print("[hdmall] Starting HDmall scraper")
    print(f"[hdmall] master_db: {MASTER_DB}")
    print(f"[hdmall] output: external_reviews/ + pricing/ dirs")

    gmaps_clinics = load_bangkok_clinics()
    print(f"[hdmall] Bangkok GMaps clinics: {len(gmaps_clinics)}")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        ctx = browser.new_context(
            locale="th-TH",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            extra_http_headers={"Accept-Language": "th,en;q=0.9"},
        )
        ctx.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )
        page = ctx.new_page()
        page.set_default_timeout(25000)

        # Stage 1
        print("\n[hdmall] Stage 1: directory crawl")
        brand_map = crawl_directory(page)
        # De-duplicate by (category, slug) full key
        seen_keys: set[tuple[str, str]] = set()
        clinic_tasks: list[tuple[str, str]] = []
        for cat, slugs in brand_map.items():
            for slug in sorted(slugs):
                key = (cat, slug)
                if key not in seen_keys:
                    seen_keys.add(key)
                    clinic_tasks.append((cat, slug))
        print(f"[hdmall] Total unique brand pages to scrape: {len(clinic_tasks)}")

        if max_clinics:
            clinic_tasks = clinic_tasks[:max_clinics]
            print(f"[hdmall] Limited to {max_clinics} for this run")

        # A. Resume: skip slugs that already succeeded in a prior run.
        cached_by_key: dict[tuple[str, str], dict] = {}
        cache_file = CACHE_DIR / "hdmall_all_clinics.json"
        if cache_file.exists():
            try:
                raw = json.loads(cache_file.read_text(encoding="utf-8"))
                cached_by_key = {
                    (c.get("category"), c.get("slug")): c
                    for c in raw
                    if c.get("fetch_ok") and c.get("category") and c.get("slug")
                }
                print(f"[hdmall] Resume: {len(cached_by_key)} cached fetch_ok clinics will be skipped")
            except (json.JSONDecodeError, OSError, ValueError) as e:
                print(f"[hdmall] Resume cache load failed: {e} — starting fresh")

        # B. Per-clinic hard timeout — Playwright CDP can wedge past internal timeouts.
        # On hard-timeout, rebuild the browser to recover, mark slug failed, continue.
        PER_CLINIC_TIMEOUT_SEC = 60

        def _rebuild_browser_ctx_page(old_browser):
            try: old_browser.close()
            except Exception: pass
            new_browser = pw.chromium.launch(
                headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )
            new_ctx = new_browser.new_context(
                locale="th-TH",
                user_agent=(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                extra_http_headers={"Accept-Language": "th,en;q=0.9"},
            )
            new_ctx.add_init_script(
                "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
            )
            new_page = new_ctx.new_page()
            new_page.set_default_timeout(25000)
            return new_browser, new_ctx, new_page

        # Stage 2
        print("\n[hdmall] Stage 2: clinic page parsing")
        hdmall_clinics: list[HDmallClinic] = []
        clinic_field_names = set(HDmallClinic.__dataclass_fields__)
        # Checkpoint only after real fetches, never during pure resume-skip — otherwise
        # we'd overwrite the cache with a truncated list while skipping cached entries.
        new_fetches_since_ckpt = 0
        for i, (cat, slug) in enumerate(clinic_tasks):
            cached = cached_by_key.get((cat, slug))
            if cached:
                hdmall_clinics.append(HDmallClinic(
                    **{k: v for k, v in cached.items() if k in clinic_field_names}
                ))
                if (i + 1) % 100 == 0:
                    print(f"  [hdmall] [{i+1}/{len(clinic_tasks)}] resume-skip")
                continue

            result_holder: list[Optional[HDmallClinic]] = [None]
            exc_holder: list[Optional[BaseException]] = [None]
            def _worker(_page=page, _cat=cat, _slug=slug):
                try:
                    result_holder[0] = parse_clinic_page(_page, _cat, _slug)
                except BaseException as exc:
                    exc_holder[0] = exc
            t = threading.Thread(target=_worker, daemon=True)
            t.start()
            t.join(timeout=PER_CLINIC_TIMEOUT_SEC)

            if t.is_alive():
                clinic = HDmallClinic(
                    hdmall_url=f"https://hdmall.co.th/{cat}/{slug}",
                    category=cat, slug=slug,
                    error=f"hard-timeout({PER_CLINIC_TIMEOUT_SEC}s)",
                )
                print(f"  [{i+1}/{len(clinic_tasks)}] {cat}/{slug[:30]} → HARD-TIMEOUT, rebuilding browser")
                browser, ctx, page = _rebuild_browser_ctx_page(browser)
            elif exc_holder[0] is not None:
                clinic = HDmallClinic(
                    hdmall_url=f"https://hdmall.co.th/{cat}/{slug}",
                    category=cat, slug=slug,
                    error=f"exc:{type(exc_holder[0]).__name__}:{str(exc_holder[0])[:80]}",
                )
            else:
                clinic = result_holder[0] or HDmallClinic(
                    hdmall_url=f"https://hdmall.co.th/{cat}/{slug}",
                    category=cat, slug=slug,
                    error="no-result",
                )

            hdmall_clinics.append(clinic)
            status = "OK" if clinic.fetch_ok else f"ERR:{clinic.error[:30]}"
            pkgs = len(clinic.packages)
            print(f"  [{i+1}/{len(clinic_tasks)}] {cat}/{slug[:30]} → {clinic.name[:25]} rating={clinic.rating} pkgs={pkgs} [{status}]")

            new_fetches_since_ckpt += 1
            if new_fetches_since_ckpt >= 10:
                _checkpoint(hdmall_clinics, gmaps_clinics)
                new_fetches_since_ckpt = 0

        # Final checkpoint if any tail fetches uncommitted
        if new_fetches_since_ckpt > 0:
            _checkpoint(hdmall_clinics, gmaps_clinics)

        ctx.close()
        browser.close()

    # Stage 3 + 4
    _checkpoint(hdmall_clinics, gmaps_clinics)
    print("[hdmall] Done")


def _checkpoint(hdmall_clinics: list[HDmallClinic], gmaps_clinics: list[dict]):
    hd_by_url = {hd.hdmall_url: hd for hd in hdmall_clinics if hd.fetch_ok}
    matches = match_clinics(list(hd_by_url.values()), gmaps_clinics)

    # Save full HDmall clinic list for inspection
    all_out = CACHE_DIR / "hdmall_all_clinics.json"
    all_out.write_text(
        json.dumps([asdict(h) for h in hdmall_clinics], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    # Save matches
    matches_out = CACHE_DIR / "hdmall_matches.json"
    matches_out.write_text(
        json.dumps([asdict(m) for m in matches], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    wr, wp = write_outputs(matches, hd_by_url)
    strong = sum(1 for m in matches if m.score >= 0.45)
    weak = sum(1 for m in matches if 0.35 <= m.score < 0.45)
    print(f"[hdmall] checkpoint: {len(hd_by_url)} fetched, {len(matches)} matched "
          f"(strong≥0.45: {strong}, weak: {weak}), wrote {wr} reviews + {wp} pricing files")


def rematch():
    """Re-run only stages 3+4 from cached hdmall_all_clinics.json."""
    cache_file = CACHE_DIR / "hdmall_all_clinics.json"
    if not cache_file.exists():
        print("No cached clinics found. Run full scraper first.")
        return
    raw = json.loads(cache_file.read_text(encoding="utf-8"))
    clinics = []
    for d in raw:
        hd = HDmallClinic(**{k: v for k, v in d.items() if k in HDmallClinic.__dataclass_fields__})
        hd.packages = d.get("packages", [])
        hd.districts = d.get("districts", [])
        clinics.append(hd)
    gmaps_clinics = load_bangkok_clinics()
    print(f"[rematch] {len(clinics)} cached clinics, {len(gmaps_clinics)} GMaps clinics")
    _checkpoint(clinics, gmaps_clinics)
    print("[rematch] Done")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "rematch":
        rematch()
    else:
        limit = int(sys.argv[1]) if len(sys.argv) > 1 else 0
        main(max_clinics=limit)
        print("[hdmall] idle 1h before next run")
        for _i in range(12):  # 12 * 5min = 1h
            time.sleep(300)
            print(f"[hdmall] idle {(_i + 1) * 5}/60 min")
