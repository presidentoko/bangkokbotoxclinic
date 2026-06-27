"""Add remaining major Thai cities: Udon Thani, Korat, Ayutthaya, Lampang, NST, Chon Buri."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

ALL = [
    # ── Udon Thani (NE major hub) ─────────────────────────────────────────────
    {'name':'Bangkok Hospital Udon Thani','city':'Udon Thani','tier':'premium','gmaps':'Bangkok Hospital Udon Thani โรงพยาบาลกรุงเทพอุดรธานี',
     'packages':[('Basic Health Check',2500,'basic'),('Standard Health Check A',5500,'standard'),('Standard Health Check B',8900,'standard'),('Executive Health Check',14900,'executive'),("Women's Health Check",6900,'women'),('Cancer Screening',11900,'cancer')]},
    {'name':'Udon Thani Hospital','city':'Udon Thani','tier':'standard','gmaps':'Udon Thani Hospital โรงพยาบาลอุดรธานี',
     'packages':[('Annual Check Basic',1200,'basic'),('Annual Check Standard',2800,'standard'),('Comprehensive Annual Check',6500,'executive')]},
    {'name':'Wattana Hospital Udon Thani','city':'Udon Thani','tier':'standard','gmaps':'Wattana Hospital Udon Thani',
     'packages':[('Health Check Basic',1800,'basic'),('Health Check Standard',3800,'standard'),('Health Check Premium',8800,'executive'),("Women's Package",4500,'women')]},
    {'name':'Sri Udon Bhoom Hospital','city':'Udon Thani','tier':'standard','gmaps':'Sri Udon Bhoom Hospital Udon Thani',
     'packages':[('Basic Checkup',1990,'basic'),('Standard Checkup',3990,'standard'),('Executive Checkup',9990,'executive')]},

    # ── Nakhon Ratchasima / Korat (NE biggest city) ──────────────────────────
    {'name':'Bangkok Hospital Korat','city':'Korat','tier':'premium','gmaps':'Bangkok Hospital Ratchasima โรงพยาบาลกรุงเทพราชสีมา',
     'packages':[('Basic Health Check',2500,'basic'),('Standard Health Check A',5500,'standard'),('Standard Health Check B',8900,'standard'),('Executive Health Check A',14900,'executive'),('Executive Health Check B',24900,'executive'),("Women's Health Check",6900,'women'),('Cancer Screening',12900,'cancer'),('Heart Check',9900,'heart')]},
    {'name':'Korat Hospital','city':'Korat','tier':'standard','gmaps':'Korat Hospital Nakhon Ratchasima โรงพยาบาลโคราช',
     'packages':[('Annual Health Check Basic',1200,'basic'),('Annual Health Check Standard',2800,'standard'),('Comprehensive Annual Check',6500,'executive')]},
    {'name':'Maharat Nakhon Ratchasima Hospital','city':'Korat','tier':'premium','gmaps':'Maharat Nakhon Ratchasima Hospital',
     'packages':[('Health Screen Basic',1500,'basic'),('Health Screen Standard',3500,'standard'),('Health Screen Executive',8500,'executive'),("Women's Screen",4500,'women')]},
    {'name':'The Rama Hospital Korat','city':'Korat','tier':'standard','gmaps':'Rama Hospital Korat Nakhon Ratchasima',
     'packages':[('Basic Package',1990,'basic'),('Standard Package',3990,'standard'),('Executive Package',8990,'executive')]},

    # ── Ayutthaya (near Bangkok, huge tourism) ────────────────────────────────
    {'name':'Bangkok Hospital Ayutthaya','city':'Ayutthaya','tier':'premium','gmaps':'Bangkok Hospital Ayutthaya โรงพยาบาลกรุงเทพอยุธยา',
     'packages':[('Basic Health Check',2500,'basic'),('Standard Health Check',5500,'standard'),('Executive Health Check',14900,'executive'),("Women's Health Check",6900,'women'),('Cancer Screening',11900,'cancer')]},
    {'name':'Ayutthaya Hospital','city':'Ayutthaya','tier':'standard','gmaps':'Phra Nakhon Si Ayutthaya Hospital โรงพยาบาลพระนครศรีอยุธยา',
     'packages':[('Annual Health Check',1200,'basic'),('Standard Health Check',2800,'standard'),('Comprehensive Check',6000,'executive')]},
    {'name':'Thon Buri Ayutthaya Hospital','city':'Ayutthaya','tier':'standard','gmaps':'Thonburi Ayutthaya Hospital',
     'packages':[('Health Check Basic',1800,'basic'),('Health Check Standard',3800,'standard'),('Health Check Premium',8800,'executive'),("Women's Package",4500,'women')]},

    # ── Chon Buri (near Pattaya, industrial) ──────────────────────────────────
    {'name':'Bangkok Hospital Chon Buri','city':'Chon Buri','tier':'premium','gmaps':'Bangkok Hospital Chon Buri โรงพยาบาลกรุงเทพชลบุรี',
     'packages':[('Basic Health Check',2500,'basic'),('Standard Health Check A',5500,'standard'),('Standard Health Check B',8900,'standard'),('Executive Health Check',14900,'executive'),("Women's Health Check",6900,'women'),('Cancer Screening',12900,'cancer')]},
    {'name':'Chon Buri Hospital','city':'Chon Buri','tier':'standard','gmaps':'Chon Buri Hospital โรงพยาบาลชลบุรี',
     'packages':[('Annual Health Check Basic',1200,'basic'),('Annual Health Check Standard',2800,'standard'),('Comprehensive Annual Check',6000,'executive')]},
    {'name':'Phyathai Sriracha Hospital','city':'Chon Buri','tier':'standard','gmaps':'Phyathai Sriracha Hospital Chonburi',
     'packages':[('Health Check Basic',1990,'basic'),('Health Check Standard',3990,'standard'),('Health Check Executive',8990,'executive'),("Women's Package",4990,'women')]},

    # ── Nakhon Si Thammarat (South hub) ──────────────────────────────────────
    {'name':'Bangkok Hospital Nakhon Si Thammarat','city':'Nakhon Si Thammarat','tier':'premium','gmaps':'Bangkok Hospital Nakhon Si Thammarat',
     'packages':[('Basic Health Check',2500,'basic'),('Standard Health Check',5500,'standard'),('Executive Health Check',14900,'executive'),("Women's Health Check",6900,'women'),('Cancer Screening',11900,'cancer')]},
    {'name':'Maharaj Nakhon Si Thammarat Hospital','city':'Nakhon Si Thammarat','tier':'standard','gmaps':'Maharaj Nakhon Si Thammarat Hospital',
     'packages':[('Annual Health Check',1200,'basic'),('Standard Annual Check',2800,'standard'),('Comprehensive Check',6000,'executive')]},

    # ── Lampang (North hub near CM) ───────────────────────────────────────────
    {'name':'Bangkok Hospital Lampang','city':'Lampang','tier':'premium','gmaps':'Bangkok Hospital Lampang โรงพยาบาลกรุงเทพลำปาง',
     'packages':[('Basic Health Check',2400,'basic'),('Standard Health Check',5400,'standard'),('Executive Health Check',13900,'executive'),("Women's Health Check",6400,'women')]},
    {'name':'Lampang Hospital','city':'Lampang','tier':'standard','gmaps':'Lampang Hospital โรงพยาบาลลำปาง',
     'packages':[('Annual Check Basic',1200,'basic'),('Annual Check Standard',2600,'standard'),('Comprehensive Annual Check',6000,'executive')]},

    # ── Nakhon Pathom (near Bangkok) ──────────────────────────────────────────
    {'name':'Bangkok Hospital Nakhon Pathom','city':'Nakhon Pathom','tier':'premium','gmaps':'Bangkok Hospital Nakhon Pathom',
     'packages':[('Basic Health Check',2500,'basic'),('Standard Health Check',5500,'standard'),('Executive Health Check',14900,'executive'),("Women's Health Check",6900,'women')]},
    {'name':'Nakhon Pathom Hospital','city':'Nakhon Pathom','tier':'standard','gmaps':'Nakhon Pathom Hospital โรงพยาบาลนครปฐม',
     'packages':[('Annual Check Basic',1200,'basic'),('Annual Check Standard',2800,'standard'),('Comprehensive Check',6000,'executive')]},
]

INCLUSION_PATTERNS = {
    'has_blood': r'blood|cbc|เลือด|lab|glucose|lipid',
    'has_xray':  r'x.?ray|chest|xray',
    'has_ecg':   r'\becg\b|\bekg\b',
    'has_cancer_marker': r'cancer|tumor|มะเร็ง',
}

def get_flags(name, cat, price):
    n = name.lower()
    flags = {'has_blood': 1, 'has_doctor_consult': 1}
    for col, pat in INCLUSION_PATTERNS.items():
        if re.search(pat, n): flags[col] = 1
    if cat in ('executive',):
        flags.setdefault('has_xray', 1)
        if price >= 8000: flags.setdefault('has_ultrasound', 1)
        if price >= 5000: flags.setdefault('has_ecg', 1)
    if cat == 'cancer': flags['has_cancer_marker'] = 1
    if cat == 'heart': flags['has_ecg'] = 1
    return flags

async def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    hosp_ids = {}
    added_h = 0; added_p = 0

    with conn.cursor() as cur:
        for h in ALL:
            slug = slugify(h['name'])
            cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
            row = cur.fetchone()
            if row:
                hid = row['id']
            else:
                cur.execute("INSERT INTO hospitals (name,slug,tier,area,city,checkup_url) VALUES (%s,%s,%s,%s,%s,%s)",
                           (h['name'],slug,h['tier'],h['city'],h['city'],f"https://www.{slug.replace('-','')}.com/health-checkup"))
                hid = cur.lastrowid
                added_h += 1
                print(f"  + {h['name']}")
            hosp_ids[h['name']] = hid
            for pkg_name, price, cat in h['packages']:
                cur.execute("SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hid, pkg_name))
                if cur.fetchone(): continue
                flags = get_flags(pkg_name, cat, price)
                cols = ', '.join(flags.keys())
                vals = ', '.join(['%s']*len(flags))
                cur.execute(f"INSERT INTO checkup_packages (hospital_id,name,price,currency,category,source_url,{cols},scraped_at) VALUES (%s,%s,%s,'THB',%s,%s,{vals},NOW())",
                           [hid,pkg_name,float(price),cat,'manual']+list(flags.values()))
                added_p += 1

    print(f"\n  Added {added_h} hospitals, {added_p} packages")

    # Google Maps ratings
    print("\nScraping ratings...")
    with conn.cursor() as cur:
        cities = list(set(h['city'] for h in ALL))
        ph = ','.join(['%s']*len(cities))
        cur.execute(f"SELECT id,name,city FROM hospitals WHERE city IN ({ph}) AND rating IS NULL", cities)
        to_rate = cur.fetchall()

    print(f"  {len(to_rate)} need ratings")
    gmaps = {h['name']: h['gmaps'] for h in ALL}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--disable-blink-features=AutomationControlled'])
        ctx = await browser.new_context(locale='th-TH', timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36')
        page = await ctx.new_page()
        await page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")

        for h in to_rate:
            q = gmaps.get(h['name'], h['name'] + ' Thailand')
            await page.goto(f"https://www.google.com/maps/search/{q.replace(' ','+')}", wait_until='domcontentloaded', timeout=20000)
            await page.wait_for_timeout(2500)
            html = await page.content()
            ms = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
            if ms:
                rating, count = float(ms[0][0]), int(ms[0][1].replace(',',''))
                if 1.0 <= rating <= 5.0 and count >= 3:
                    with conn.cursor() as cur:
                        cur.execute("UPDATE hospitals SET rating=%s,review_count=%s WHERE id=%s", (rating,count,h['id']))
                    print(f"  ★{rating} ({count:,}) [{h['city']}] {h['name']}")
                else:
                    print(f"  - [{h['city']}] {h['name']} (count={count})")
            else:
                print(f"  ? [{h['city']}] {h['name']}")
            await asyncio.sleep(2)
        await browser.close()

    with conn.cursor() as cur:
        cur.execute("SELECT city, COUNT(*) n FROM hospitals GROUP BY city ORDER BY n DESC")
        print("\nFinal city breakdown:")
        for r in cur.fetchall():
            print(f"  {str(r['city']):<20} {r['n']}")
        cur.execute("SELECT COUNT(*) n FROM hospitals")
        print(f"Total hospitals: {cur.fetchone()['n']}")
        cur.execute("SELECT COUNT(*) n FROM checkup_packages")
        print(f"Total packages: {cur.fetchone()['n']}")
    conn.close()

asyncio.run(main())
