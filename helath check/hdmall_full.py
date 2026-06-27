"""
hdmall_full.py — Scrape ALL HDmall health-checkup clinic pages,
find Bangkok clinics with real prices, add to bkkcheckup DB.
"""
import re, time, json, pymysql, hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
from config import DB_CONFIG

CACHE = Path(__file__).parent / "hdmall_cache"
CACHE.mkdir(exist_ok=True)

DIR_CACHE = Path(r"C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\hdmall_clinics\cache")

PRICE_RE = re.compile(r'฿\s*([\d,]+)|data-price="([\d.]+)"')
CARD_RE  = re.compile(
    r'data-event-value="([^"]+)"[^>]*data-price="([\d.]+)"'
    r'|data-price="([\d.]+)"[^>]*data-event-value="([^"]+)"',
    re.DOTALL
)
JSONLD_RE = re.compile(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', re.DOTALL)

# Bangkok location keywords
BKK_KEYWORDS = re.compile(
    r'\b(bangkok|กรุงเทพ|สุขุมวิท|ลาดพร้าว|พระราม|สีลม|ทองหล่อ|อ่อนนุช|อโศก|บางนา|บางกอก|รัชดา|พหลโยธิน|งามวงศ์วาน|บางแค|พระโขนง|ดอนเมือง|ลาดกระบัง)\b',
    re.IGNORECASE
)

# Skip slugs that are clearly not Bangkok
SKIP_KEYWORDS = re.compile(
    r'(phuket|chiangmai|chiang-mai|pattaya|korat|hua-hin|koh-samui|chonburi|khon-kaen|udon|pattani|hatyai|hat-yai|ayutt|krabi|rayong|chanthaburi)',
    re.IGNORECASE
)

CATEGORY_KEYWORDS = {
    'executive': ['executive','vip','gold','platinum','premium','holistic','vitality','advance'],
    'comprehensive': ['comprehensive','complete','full','standard','regular','classic'],
    'cancer': ['cancer','tumor','oncol','cea','ca-125','psa','afp'],
    'cardiac': ['cardiac','heart','cardio','treadmill','stress test','echo','coronary'],
    'men': ['men','male','gentleman','gentlemen','man'],
    'women': ['women','female','lady','ladies','woman','gynecol','mammogram','pap'],
    'basic': ['basic','essential','mini','lite','simple','starter'],
    'age': ['20','25','30','35','40','45','50','55','60','65','youth','senior','elderly','age'],
}


def guess_category(name: str) -> str:
    n = name.lower()
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(k in n for k in kws):
            return cat
    return 'comprehensive'


def parse_inclusions(name: str, desc: str = '') -> dict:
    text = (name + ' ' + desc).lower()
    return {
        'has_blood':         1,
        'has_xray':          1 if any(w in text for w in ['x-ray','xray','chest','x ray']) else 0,
        'has_ultrasound':    1 if any(w in text for w in ['ultra','echo','abdomen','abdominal','usg']) else 0,
        'has_ct':            1 if 'ct' in text.split() or 'ct scan' in text else 0,
        'has_mri':           1 if 'mri' in text else 0,
        'has_ecg':           1 if any(w in text for w in ['ecg','ekg','electro']) else 0,
        'has_treadmill':     1 if any(w in text for w in ['treadmill','stress','exercise']) else 0,
        'has_cancer_marker': 1 if any(w in text for w in ['cancer','tumor','marker','psa','cea','ca125']) else 0,
        'has_doctor_consult': 1,
        'has_interpreter':   0,
    }


def make_slug(name: str) -> str:
    n = re.sub(r'[^\w\s-]', '', name.lower())
    n = re.sub(r'\s+', '-', n.strip())
    n = re.sub(r'-+', '-', n)
    return n[:60]


def collect_slugs() -> list[str]:
    slugs, seen = [], set()
    for p in range(1, 5):
        f = DIR_CACHE / f"dir_health-checkup_p{p}.html"
        if not f.exists():
            continue
        html = f.read_text(encoding='utf-8', errors='ignore')
        for m in re.finditer(r'href="/health-checkup/([^"?#/]+)"', html):
            s = m.group(1)
            if s not in seen:
                seen.add(s)
                slugs.append(s)
    return slugs


def fetch_page(page, slug: str) -> str | None:
    cf = CACHE / f"{slug}.html"
    if cf.exists() and cf.stat().st_size > 3000:
        return cf.read_text(encoding='utf-8', errors='ignore')
    url = f"https://hdmall.co.th/health-checkup/{slug}"
    try:
        page.goto(url, wait_until='networkidle', timeout=20000)
        time.sleep(1.5)
        html = page.content()
        cf.write_text(html, encoding='utf-8')
        return html
    except (PWTimeout, Exception) as e:
        return None


def extract_packages(html: str) -> list[dict]:
    pkgs = []

    # Try data-cards (most reliable on HDmall)
    # HDmall cards look like:
    # class="card-package-list..." data-brand="..." data-event-value="PKG_NAME" data-price="PRICE"
    card_block_re = re.compile(
        r'data-event-value="([^"]{5,})"[^>]{0,200}?data-price="([\d.]+)"'
        r'|data-price="([\d.]+)"[^>]{0,200}?data-event-value="([^"]{5,})"',
        re.DOTALL
    )
    for m in card_block_re.finditer(html):
        if m.group(1):
            name, price_s = m.group(1), m.group(2)
        else:
            name, price_s = m.group(4), m.group(3)
        try:
            price = float(price_s)
            if 500 <= price <= 300_000 and len(name) > 4:
                pkgs.append({'name': name.strip(), 'price': int(price)})
        except (ValueError, TypeError):
            pass

    # JSON-LD fallback
    if not pkgs:
        for jm in JSONLD_RE.finditer(html):
            try:
                data = json.loads(jm.group(1))
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if item.get('@type') in ('Product', 'Offer'):
                        offers = item.get('offers', item)
                        if isinstance(offers, dict):
                            price = offers.get('price') or offers.get('lowPrice')
                        elif isinstance(offers, list) and offers:
                            price = min(o.get('price', 999999) for o in offers if o.get('price'))
                        else:
                            price = None
                        name = item.get('name', '')
                        if price and name and 500 <= float(price) <= 300_000:
                            pkgs.append({'name': name, 'price': int(float(price))})
            except Exception:
                pass

    # Deduplicate
    seen, out = set(), []
    for p in pkgs:
        key = (p['name'], p['price'])
        if key not in seen:
            seen.add(key)
            out.append(p)
    return out


def is_bangkok(html: str) -> bool:
    text = html[:20000]  # Check first 20k chars
    return bool(BKK_KEYWORDS.search(text))


def get_clinic_name(html: str, slug: str) -> str:
    m = re.search(r'<h1[^>]*class="packages-header__title"[^>]*>\s*([^<]+?)\s*</h1>', html, re.DOTALL)
    if m:
        return m.group(1).strip()
    m = re.search(r'<h1[^>]*>\s*([^<]{3,80}?)\s*</h1>', html)
    if m:
        return m.group(1).strip()
    # OG tag
    m = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    if m:
        name = m.group(1).split('|')[0].split('-')[0].strip()
        return name
    return slug.replace('-', ' ').title()


def upsert_hospital(conn, slug: str, name: str) -> int | None:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if row:
            return row['id']
        cur.execute(
            "INSERT INTO hospitals (slug, name, area, jci) VALUES (%s,%s,'Bangkok',0)",
            (slug, name)
        )
        return cur.lastrowid


def insert_pkgs(conn, hosp_id: int, pkgs: list[dict], url: str) -> int:
    inserted = 0
    with conn.cursor() as cur:
        for pkg in pkgs:
            cur.execute(
                "SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s",
                (hosp_id, pkg['name'])
            )
            if cur.fetchone():
                continue
            cat = guess_category(pkg['name'])
            incl = parse_inclusions(pkg['name'])
            cur.execute("""
                INSERT INTO checkup_packages
                  (hospital_id, name, category, price, currency,
                   has_blood, has_xray, has_ultrasound, has_ct, has_mri,
                   has_ecg, has_treadmill, has_cancer_marker,
                   has_doctor_consult, has_interpreter, results_days, source_url, scraped_at)
                VALUES (%s,%s,%s,%s,'THB',%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1,%s,NOW())
            """, (
                hosp_id, pkg['name'], cat, pkg['price'],
                incl['has_blood'], incl['has_xray'], incl['has_ultrasound'],
                incl['has_ct'], incl['has_mri'], incl['has_ecg'], incl['has_treadmill'],
                incl['has_cancer_marker'], incl['has_doctor_consult'], incl['has_interpreter'],
                url
            ))
            inserted += 1
    return inserted


def main():
    slugs = collect_slugs()
    print(f"Total health-checkup slugs: {len(slugs)}")

    # Filter obviously non-Bangkok
    filtered = [s for s in slugs if not SKIP_KEYWORDS.search(s)]
    print(f"After keyword filter: {len(filtered)} slugs")

    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    total_new_hospitals = 0
    total_new_pkgs = 0
    skipped_no_price = 0
    skipped_not_bkk = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
            locale='en-US',
        )
        page = ctx.new_page()

        for i, slug in enumerate(filtered):
            url = f"https://hdmall.co.th/health-checkup/{slug}"
            html = fetch_page(page, slug)
            if not html:
                continue

            # Check if Bangkok
            if not is_bangkok(html):
                skipped_not_bkk += 1
                continue

            # Extract packages
            pkgs = extract_packages(html)
            if not pkgs:
                skipped_no_price += 1
                continue

            name = get_clinic_name(html, slug)
            db_slug = 'hdm-' + slug[:45]  # prefix to avoid collisions

            # Check if already in DB
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM hospitals WHERE slug=%s", (db_slug,))
                existing = cur.fetchone()

            if existing:
                hosp_id = existing['id']
                is_new = False
            else:
                hosp_id = upsert_hospital(conn, db_slug, name)
                is_new = True
                total_new_hospitals += 1

            n = insert_pkgs(conn, hosp_id, pkgs, url)
            total_new_pkgs += n

            if n > 0 or is_new:
                print(f"[{i+1}/{len(filtered)}] {'NEW ' if is_new else '    '}{name[:45]} | {len(pkgs)} pkgs | {n} inserted")

            if (i + 1) % 10 == 0:
                time.sleep(0.5)

        browser.close()

    conn.close()
    print(f"\n=== Done ===")
    print(f"New hospitals: {total_new_hospitals}")
    print(f"New packages:  {total_new_pkgs}")
    print(f"Skipped (not BKK): {skipped_not_bkk}")
    print(f"Skipped (no price): {skipped_no_price}")

    # Final stats
    conn2 = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn2.cursor() as c:
        c.execute('SELECT COUNT(*) t, COUNT(price) wp FROM checkup_packages')
        r = c.fetchone()
        c.execute('SELECT COUNT(*) FROM hospitals')
        h = c.fetchone()['COUNT(*)']
        print(f"\nDB: {h} hospitals, {r['t']} packages ({r['wp']} with price)")
    conn2.close()


if __name__ == '__main__':
    main()
