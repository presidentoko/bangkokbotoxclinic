"""
hdmall_scrape.py — Scrape HDmall health-checkup pages for package prices,
insert into bkkcheckup.checkup_packages DB.
"""
import re
import time
import json
import pymysql
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
from config import DB_CONFIG

CACHE = Path(__file__).parent / "hdmall_cache"
CACHE.mkdir(exist_ok=True)

DIR_CACHE = Path(r"C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\hdmall_clinics\cache")

# ── Regexes ───────────────────────────────────────────────────────────────────
RE_LINKS = re.compile(r'href="(/health-checkup/([^"?#/]+))"')
RE_PRICE = re.compile(r'data-price="([\d.]+)"')
RE_NAME  = re.compile(r'data-event-value="([^"]+)"')
RE_SKU   = re.compile(r'data-fb-id="([^"]+)"')
RE_LINK  = re.compile(r'data-link="([^"]+)"')
RE_CARD  = re.compile(
    r'class="card-package-list[^"]*"[^>]*'
    r'(?=[^>]*data-brand="([^"]*)")'
    r'(?=[^>]*data-event-value="([^"]*)")'
    r'(?=[^>]*data-price="([^"]*)")'
    r'(?=[^>]*data-fb-id="([^"]*)")'
    r'(?=[^>]*data-link="([^"]*)")',
    re.DOTALL
)
RE_H1 = re.compile(r'<h1[^>]*>\s*([^<]+?)\s*</h1>')
RE_JSONLD = re.compile(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', re.DOTALL)

# ── Target hospitals (HDmall slug → our DB slug) ──────────────────────────────
# Map from HDmall URL slug → bkkcheckup hospitals.slug
HOSPITAL_MAP = {
    'bumrungrad-international-hospital': 'bumrungrad',
    'vejthani-hospital': 'vejthani',
    'bnh-hospital': 'bnh',
    'samitivej-hospital-srinakarin': 'samitivej-srinakarin',
    'samitivej-hospital-sukhumvit': 'samitivej-sukhumvit',
    'praram-9-hospital': 'praram9',
    'bangkokhospital': 'bangkok-hospital',
    'bangkok-hospital': 'bangkok-hospital',
    'phyathai-1-hospital': 'phyathai-1',
    'phyathai-2-hospital': 'phyathai-2',
    'phyathai-3-hospital': 'phyathai-3',
    'sikarin-hospital': 'sikarin',
    'bangpakok-9-international-hospital': 'bangpakok9',
    'vibhavadi-hospital': 'vibhavadi',
    'medpark-hospital': 'medpark',
    'thonburi-hospital': 'thonburi',
    'paolo-hospital-phahon-yothin': 'paolo-phahon',
    'paolo-memorial-hospital': 'paolo-memorial',
    'saint-louis-hospital': 'saint-louis',
    'bangkok-christian-hospital': 'bangkok-christian',
    'rajavithi-hospital': 'rajavithi',
    'central-chest-institute': 'central-chest',
    'kasemrad-hospital-pracha-chuen': 'kasemrad',
    'nonthavej-hospital': 'nonthavej',
    'bangkok-hospital-trat': None,   # skip
    'samitivej-hospital-chonburi': None,  # skip
}

CATEGORY_MAP = {
    'executive': 'executive',
    'gold': 'executive',
    'platinum': 'executive',
    'premium': 'comprehensive',
    'standard': 'comprehensive',
    'comprehensive': 'comprehensive',
    'basic': 'basic',
    'essential': 'basic',
    'men': 'men',
    'male': 'men',
    'women': 'women',
    'female': 'women',
    'lady': 'women',
    'ladies': 'women',
    'cancer': 'cancer',
    'tumor': 'cancer',
    'cardiac': 'cardiac',
    'heart': 'cardiac',
    'age': 'age',
    'youth': 'age',
}


def guess_category(name: str) -> str:
    n = name.lower()
    for kw, cat in CATEGORY_MAP.items():
        if kw in n:
            return cat
    return 'comprehensive'


def parse_inclusions(name: str) -> dict:
    n = name.lower()
    return {
        'has_blood': 1,
        'has_xray': 1 if any(w in n for w in ['x-ray','xray','chest']) else 0,
        'has_ultrasound': 1 if any(w in n for w in ['ultra','echo','abdomen','abdominal']) else 0,
        'has_ct': 1 if 'ct' in n else 0,
        'has_mri': 1 if 'mri' in n else 0,
        'has_ecg': 1 if any(w in n for w in ['ecg','ekg','eeg','electrocardiogram']) else 0,
        'has_treadmill': 1 if any(w in n for w in ['treadmill','stress','exercise']) else 0,
        'has_cancer_marker': 1 if any(w in n for w in ['cancer','tumor','marker','psa','cea']) else 0,
        'has_doctor_consult': 1,
        'has_interpreter': 0,
    }


def collect_hdmall_slugs() -> list[str]:
    """Extract all health-checkup slugs from cached directory pages."""
    slugs = []
    seen = set()
    for page_num in range(1, 5):
        path = DIR_CACHE / f"dir_health-checkup_p{page_num}.html"
        if not path.exists():
            continue
        html = path.read_text(encoding='utf-8', errors='ignore')
        for match in RE_LINKS.finditer(html):
            slug = match.group(2)
            if slug not in seen:
                seen.add(slug)
                slugs.append(slug)
    print(f"Found {len(slugs)} unique health-checkup slugs in directory")
    return slugs


def fetch_page(page, url: str, slug: str) -> str | None:
    cache_file = CACHE / f"{slug}.html"
    if cache_file.exists() and cache_file.stat().st_size > 2000:
        return cache_file.read_text(encoding='utf-8', errors='ignore')
    try:
        page.goto(url, wait_until='networkidle', timeout=25000)
        time.sleep(1.5)
        html = page.content()
        cache_file.write_text(html, encoding='utf-8')
        return html
    except PWTimeout:
        print(f"  timeout: {url}")
        return None
    except Exception as e:
        print(f"  error {url}: {e}")
        return None


def parse_packages(html: str, clinic_name: str) -> list[dict]:
    pkgs = []
    # Try JSON-LD first
    for m in RE_JSONLD.finditer(html):
        try:
            data = json.loads(m.group(1))
            if isinstance(data, list):
                for item in data:
                    if item.get('@type') == 'Product' and item.get('offers'):
                        offers = item['offers']
                        if isinstance(offers, dict):
                            price = offers.get('price') or offers.get('lowPrice')
                        elif isinstance(offers, list):
                            price = min((o.get('price',0) for o in offers if o.get('price')), default=None)
                        else:
                            price = None
                        if price:
                            pkgs.append({'name': item.get('name',''), 'price': float(price)})
        except Exception:
            pass

    # Fallback: data-price cards
    if not pkgs:
        for m in RE_CARD.finditer(html):
            try:
                name = m.group(2)
                price = float(m.group(3)) if m.group(3) else None
                if name and price:
                    pkgs.append({'name': name, 'price': price})
            except Exception:
                pass

    # Further fallback: grep data-price + nearby text
    if not pkgs:
        prices_raw = RE_PRICE.findall(html)
        names_raw = RE_NAME.findall(html)
        for name, price_str in zip(names_raw, prices_raw):
            try:
                price = float(price_str)
                if price > 0:
                    pkgs.append({'name': name, 'price': price})
            except Exception:
                pass

    # Deduplicate by name
    seen_names = set()
    unique = []
    for p in pkgs:
        if p['name'] not in seen_names and 500 <= p['price'] <= 300000:
            seen_names.add(p['name'])
            unique.append(p)

    return unique


def get_or_create_hospital(conn, slug: str, name: str) -> int | None:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if row:
            return row['id']
        # Insert new hospital
        cur.execute(
            "INSERT INTO hospitals (slug, name, area, jci) VALUES (%s, %s, %s, %s)",
            (slug, name, 'Bangkok', 0)
        )
        return cur.lastrowid


def insert_packages(conn, hospital_id: int, packages: list[dict], source_url: str) -> int:
    inserted = 0
    with conn.cursor() as cur:
        for pkg in packages:
            cur.execute(
                "SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s",
                (hospital_id, pkg['name'])
            )
            if cur.fetchone():
                # Update price if null
                cur.execute(
                    "UPDATE checkup_packages SET price=%s WHERE hospital_id=%s AND name=%s AND price IS NULL",
                    (pkg['price'], hospital_id, pkg['name'])
                )
                continue
            incl = parse_inclusions(pkg['name'])
            cat = guess_category(pkg['name'])
            cur.execute("""
                INSERT INTO checkup_packages
                  (hospital_id, name, category, price, currency,
                   has_blood, has_xray, has_ultrasound, has_ct, has_mri,
                   has_ecg, has_treadmill, has_cancer_marker,
                   has_doctor_consult, has_interpreter, results_days, source_url, scraped_at)
                VALUES (%s,%s,%s,%s,'THB',%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1,%s,NOW())
            """, (
                hospital_id, pkg['name'], cat, pkg['price'],
                incl['has_blood'], incl['has_xray'], incl['has_ultrasound'],
                incl['has_ct'], incl['has_mri'], incl['has_ecg'], incl['has_treadmill'],
                incl['has_cancer_marker'], incl['has_doctor_consult'], incl['has_interpreter'],
                source_url
            ))
            inserted += 1
    return inserted


def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    all_slugs = collect_hdmall_slugs()

    # Filter to only slugs we care about (in our map OR new Bangkok hospitals)
    target_slugs = [(s, HOSPITAL_MAP.get(s, 'NEW:' + s)) for s in all_slugs]
    # Only process known mappings + skip None (non-Bangkok)
    process = [(s, db) for s, db in target_slugs if db is not None and not db.startswith('NEW:')]

    print(f"Processing {len(process)} known hospital mappings")

    total_inserted = 0
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            locale='en-US',
        )
        page = ctx.new_page()

        for hdmall_slug, db_slug in process:
            url = f"https://hdmall.co.th/health-checkup/{hdmall_slug}"
            print(f"\n→ {hdmall_slug}")
            html = fetch_page(page, url, hdmall_slug)
            if not html:
                continue

            # Get hospital name from H1
            h1_match = RE_H1.search(html)
            name = h1_match.group(1).strip() if h1_match else hdmall_slug.replace('-', ' ').title()

            packages = parse_packages(html, name)
            if not packages:
                print(f"  no packages found")
                continue

            hosp_id = get_or_create_hospital(conn, db_slug, name)
            if not hosp_id:
                continue

            n = insert_packages(conn, hosp_id, packages, url)
            total_inserted += n
            print(f"  {name}: {len(packages)} packages found, {n} inserted")
            time.sleep(0.8)

        browser.close()

    conn.close()
    print(f"\nTotal inserted: {total_inserted}")

    # Final stats
    conn2 = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn2.cursor() as cur:
        cur.execute('SELECT COUNT(*) t, COUNT(price) wp FROM checkup_packages')
        r = cur.fetchone()
        print(f"DB total: {r['t']} packages, {r['wp']} with price")
    conn2.close()


if __name__ == '__main__':
    main()
