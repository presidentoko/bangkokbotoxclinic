"""
hdmall_insert.py — Process all cached HDmall health-checkup pages,
insert Bangkok clinics with real prices into DB.
Run after hdmall_full.py finishes (or use as standalone if already cached).
"""
import re, json, pymysql
from pathlib import Path
from config import DB_CONFIG

CACHE = Path(__file__).parent / "hdmall_cache"

BKK_RE = re.compile(
    r'\b(bangkok|กรุงเทพ|สุขุมวิท|ลาดพร้าว|พระราม|สีลม|ทองหล่อ|อ่อนนุช|อโศก|บางนา|บางกอก|รัชดา|พหลโยธิน|งามวงศ์วาน|บางแค|พระโขนง|ดอนเมือง|ลาดกระบัง|lat phrao|sukhumvit|silom|asok|thong lo|on nut|bang na|ratchada|phaholyothin|don muang|ladkrabang)\b',
    re.IGNORECASE
)
SKIP_RE = re.compile(
    r'(phuket|chiangmai|chiang mai|chiang-mai|pattaya|korat|hua hin|koh samui|chonburi|khon kaen|udon|pattani|hatyai|hat yai|ayutt|krabi|rayong|chanthaburi|samut|nonthaburi|pathum|pathom|pak kret|bang bua)',
    re.IGNORECASE
)

JSONLD_RE = re.compile(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', re.DOTALL)
CARD_RE   = re.compile(
    r'data-event-value="([^"]{5,})"[^>]{0,300}?data-price="([\d.]+)"'
    r'|data-price="([\d.]+)"[^>]{0,300}?data-event-value="([^"]{5,})"',
    re.DOTALL
)
H1_RE     = re.compile(r'<h1[^>]*class="packages-header__title"[^>]*>\s*([^<]+?)\s*</h1>', re.DOTALL)
OG_RE     = re.compile(r'<meta property="og:title" content="([^"]+)"')

CATEGORY_KEYWORDS = {
    'executive': ['executive','vip','gold','platinum','premium','holistic'],
    'comprehensive': ['comprehensive','complete','full','standard','regular','classic','annual'],
    'cancer': ['cancer','tumor','oncol','cea','ca-125','psa','afp','สารบ่งชี้มะเร็ง','มะเร็ง'],
    'cardiac': ['cardiac','heart','cardio','treadmill','stress test','echo','coronary'],
    'men': ['men','male','gentleman','ผู้ชาย','ชาย'],
    'women': ['women','female','lady','ladies','woman','gynecol','mammogram','pap','ผู้หญิง','หญิง'],
    'basic': ['basic','essential','mini','lite','simple','starter','economy'],
    'age': ['20','25','30','35','40','45','50','55','60','อายุ'],
}


def guess_category(name: str) -> str:
    n = name.lower()
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(k in n for k in kws):
            return cat
    return 'comprehensive'


def parse_inclusions(name: str) -> dict:
    n = name.lower()
    return {
        'has_blood':         1,
        'has_xray':          1 if any(w in n for w in ['x-ray','xray','chest','ทรวงอก']) else 0,
        'has_ultrasound':    1 if any(w in n for w in ['ultra','echo','abdomen','abdominal','usg','อัลตราซาวด์']) else 0,
        'has_ct':            1 if 'ct' in n.split() or 'ct scan' in n else 0,
        'has_mri':           1 if 'mri' in n else 0,
        'has_ecg':           1 if any(w in n for w in ['ecg','ekg','electro','คลื่นหัวใจ']) else 0,
        'has_treadmill':     1 if any(w in n for w in ['treadmill','stress','exercise','สายพาน']) else 0,
        'has_cancer_marker': 1 if any(w in n for w in ['cancer','tumor','marker','psa','cea','ca125','มะเร็ง']) else 0,
        'has_doctor_consult': 1,
        'has_interpreter':   0,
    }


def extract_packages(html: str) -> list[dict]:
    pkgs = []
    seen = set()

    # Method 1: data-price cards
    for m in CARD_RE.finditer(html):
        name = m.group(1) or m.group(4)
        price_s = m.group(2) or m.group(3)
        try:
            price = float(price_s)
            if 500 <= price <= 300_000 and name and len(name) > 3:
                key = (name, int(price))
                if key not in seen:
                    seen.add(key)
                    pkgs.append({'name': name.strip(), 'price': int(price)})
        except (ValueError, TypeError):
            pass

    # Method 2: JSON-LD
    if not pkgs:
        for jm in JSONLD_RE.finditer(html):
            try:
                data = json.loads(jm.group(1))
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if item.get('@type') in ('Product', 'Service'):
                        offers = item.get('offers', {})
                        if isinstance(offers, dict):
                            price = offers.get('price') or offers.get('lowPrice')
                        elif isinstance(offers, list):
                            price = min((float(o.get('price', 999999)) for o in offers if o.get('price')), default=None)
                        else:
                            price = None
                        name = item.get('name', '')
                        if price and name and 500 <= float(price) <= 300_000:
                            key = (name, int(float(price)))
                            if key not in seen:
                                seen.add(key)
                                pkgs.append({'name': name, 'price': int(float(price))})
            except Exception:
                pass

    return pkgs


def get_clinic_name(html: str, slug: str) -> str:
    m = H1_RE.search(html)
    if m:
        return m.group(1).strip()
    m = OG_RE.search(html)
    if m:
        name = m.group(1).split('|')[0].split('-')[0].strip()
        if len(name) > 3:
            return name
    return slug.replace('-', ' ').title()


def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    html_files = list(CACHE.glob("*.html"))
    print(f"Processing {len(html_files)} cached HDmall pages")

    total_new_hospitals = 0
    total_new_pkgs = 0
    skipped_no_price = 0
    skipped_not_bkk = 0

    for html_file in sorted(html_files):
        slug = html_file.stem
        url = f"https://hdmall.co.th/health-checkup/{slug}"

        # Skip non-Bangkok first by slug
        if SKIP_RE.search(slug):
            skipped_not_bkk += 1
            continue

        html = html_file.read_text(encoding='utf-8', errors='ignore')

        # Skip if page content explicitly mentions a non-Bangkok province
        if SKIP_RE.search(html[5000:25000]):
            skipped_not_bkk += 1
            continue

        pkgs = extract_packages(html)
        if not pkgs:
            skipped_no_price += 1
            continue

        name = get_clinic_name(html, slug)
        db_slug = 'hdm-' + slug[:45]

        with conn.cursor() as cur:
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (db_slug,))
            existing = cur.fetchone()

        if existing:
            hosp_id = existing['id']
            is_new = False
        else:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT IGNORE INTO hospitals (slug, name, area, jci) VALUES (%s,%s,'Bangkok',0)",
                    (db_slug, name)
                )
                cur.execute("SELECT id FROM hospitals WHERE slug=%s", (db_slug,))
                row = cur.fetchone()
                if not row:
                    continue
                hosp_id = row['id']
            is_new = True
            total_new_hospitals += 1

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

        total_new_pkgs += inserted
        if inserted > 0 or is_new:
            print(f"{'NEW ' if is_new else '    '}{name[:45]:<45} | {len(pkgs):>2}pkgs | {inserted:>2} inserted")

    conn.close()
    print(f"\n=== Done ===")
    print(f"New hospitals:  {total_new_hospitals}")
    print(f"New packages:   {total_new_pkgs}")
    print(f"Skipped (not BKK): {skipped_not_bkk}")
    print(f"Skipped (no price): {skipped_no_price}")

    conn2 = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn2.cursor() as c:
        c.execute('SELECT COUNT(*) t, COUNT(price) wp FROM checkup_packages')
        r = c.fetchone()
        c.execute('SELECT COUNT(*) FROM hospitals')
        h = c.fetchone()['COUNT(*)']
        print(f"\nDB: {h} hospitals, {r['t']} packages ({r['wp']} with price)")
        c.execute('SELECT category, COUNT(*) n, COUNT(price) hp FROM checkup_packages GROUP BY category ORDER BY n DESC')
        for row in c.fetchall():
            print(f"  {row['category']}: {row['n']} / {row['hp']} with price")
    conn2.close()


if __name__ == '__main__':
    main()
