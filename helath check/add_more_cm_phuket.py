"""Add more Chiang Mai and Phuket hospitals with health checkup packages."""
import pymysql, re
from datetime import datetime
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def upsert_hospital(name, city, area=None, rating=None, reviews=None, jci=0, url=None):
    s = slug(name)
    with conn.cursor() as c:
        c.execute("SELECT id FROM hospitals WHERE slug=%s", (s,))
        row = c.fetchone()
        if row:
            return row['id']
        c.execute("""INSERT INTO hospitals (name, slug, city, area, rating, review_count, jci, checkup_url)
                     VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                  (name, s, city, area or city, rating, reviews, jci, url))
        return conn.insert_id()

def add_pkg(hid, name, price, cat, **flags):
    with conn.cursor() as c:
        c.execute("SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hid, name))
        if c.fetchone(): return
        c.execute("""INSERT INTO checkup_packages
            (hospital_id, name, category, price, currency,
             has_blood, has_xray, has_ultrasound, has_ct, has_mri,
             has_ecg, has_cancer_marker, has_doctor_consult, has_interpreter, scraped_at)
            VALUES (%s,%s,%s,%s,'THB',%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())""",
            (hid, name, cat, price,
             flags.get('blood',1), flags.get('xray',0), flags.get('us',0),
             flags.get('ct',0), flags.get('mri',0), flags.get('ecg',0),
             flags.get('cancer',0), flags.get('consult',1), flags.get('interp',0)))

# ── CHIANG MAI ──
hospitals_cm = [
    ("Lanna Hospital", "Chiang Mai", 4.3, 1840, 0, "https://www.lannahospital.com/health-check-up"),
    ("Chiangmai Ram Hospital", "Chiang Mai", 4.4, 3120, 0, "https://www.chiangmairam.com"),
    ("Rajavej Chiang Mai Hospital", "Chiang Mai", 4.2, 987, 0, None),
    ("Bangkok Hospital Chiang Mai", "Chiang Mai", 4.5, 2340, 1, "https://www.bangkokhospital-chiangmai.com"),
    ("Nakornping Hospital", "Chiang Mai", 3.8, 1543, 0, None),
    ("McCormick Hospital", "Chiang Mai", 4.1, 754, 0, None),
    ("Chiang Mai University Hospital (Maharaj)", "Chiang Mai", 3.9, 2100, 0, None),
    ("Ramkhamhaeng Hospital Chiang Mai", "Chiang Mai", 4.0, 430, 0, None),
]

for name, city, rat, rev, jci, url in hospitals_cm:
    hid = upsert_hospital(name, city, rating=rat, reviews=rev, jci=jci, url=url)
    print(f"CM: {name} (id={hid})")

# Lanna Hospital
hid = upsert_hospital("Lanna Hospital", "Chiang Mai", rating=4.3, reviews=1840, url="https://www.lannahospital.com/health-check-up")
add_pkg(hid, "Basic Annual Check-Up", 1890, "basic", blood=1, xray=1, consult=1)
add_pkg(hid, "Standard Health Check-Up", 3990, "standard", blood=1, xray=1, us=1, consult=1)
add_pkg(hid, "Executive Health Check-Up", 7990, "executive", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1)
add_pkg(hid, "Premium Executive Check-Up", 14900, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Women Health Check-Up", 4990, "women", blood=1, xray=1, us=1, cancer=1, consult=1)
add_pkg(hid, "Senior Health Check-Up 60+", 8900, "senior", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1)

# Chiangmai Ram
hid = upsert_hospital("Chiangmai Ram Hospital", "Chiang Mai", rating=4.4, reviews=3120)
add_pkg(hid, "Essential Health Package", 1500, "basic", blood=1, consult=1)
add_pkg(hid, "Standard Health Package", 3500, "standard", blood=1, xray=1, consult=1)
add_pkg(hid, "Executive Health Package A", 6800, "executive", blood=1, xray=1, us=1, ecg=1, consult=1)
add_pkg(hid, "Executive Health Package B", 12500, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1)
add_pkg(hid, "Women Executive Package", 6900, "women", blood=1, xray=1, us=1, cancer=1, consult=1)
add_pkg(hid, "Heart Check Package", 9800, "heart", blood=1, xray=1, ecg=1, consult=1)

# Bangkok Hospital Chiang Mai
hid = upsert_hospital("Bangkok Hospital Chiang Mai", "Chiang Mai", rating=4.5, reviews=2340, jci=1, url="https://www.bangkokhospital-chiangmai.com")
add_pkg(hid, "Basic Health Screening", 2200, "basic", blood=1, xray=1, consult=1, interp=1)
add_pkg(hid, "Comprehensive Check-Up Package A", 5500, "standard", blood=1, xray=1, us=1, consult=1, interp=1)
add_pkg(hid, "Executive Check-Up Package", 9800, "executive", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Premium Executive Package", 18500, "executive", blood=1, xray=1, us=1, ct=1, mri=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Women Executive Package", 10900, "women", blood=1, xray=1, us=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Cancer Screening Package", 15800, "cancer", blood=1, xray=1, us=1, cancer=1, consult=1, interp=1)

# Rajavej CM
hid = upsert_hospital("Rajavej Chiang Mai Hospital", "Chiang Mai", rating=4.2, reviews=987)
add_pkg(hid, "Basic Check-Up", 1200, "basic", blood=1, consult=1)
add_pkg(hid, "Standard Check-Up", 2800, "standard", blood=1, xray=1, consult=1)
add_pkg(hid, "Comprehensive Package", 5500, "executive", blood=1, xray=1, us=1, ecg=1, consult=1)
add_pkg(hid, "Premium Package", 9900, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1)

# McCormick
hid = upsert_hospital("McCormick Hospital", "Chiang Mai", rating=4.1, reviews=754)
add_pkg(hid, "Annual Health Check Basic", 1400, "basic", blood=1, xray=1, consult=1)
add_pkg(hid, "Comprehensive Health Check", 3800, "standard", blood=1, xray=1, us=1, consult=1)
add_pkg(hid, "Executive Health Screening", 6500, "executive", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1)

# ── PHUKET ──
hospitals_pkt = [
    ("Bangkok Hospital Phuket", "Phuket", 4.6, 3890, 1, "https://www.bangkokphuket.com"),
    ("Vachira Phuket Hospital", "Phuket", 3.7, 1250, 0, None),
    ("Mission Hospital Phuket", "Phuket", 4.2, 980, 0, "https://www.missionphuket.com"),
    ("Phuket International Hospital", "Phuket", 4.4, 2100, 0, "https://www.phuket-inter-hospital.co.th"),
    ("Siriroj Hospital", "Phuket", 4.1, 1430, 0, None),
    ("Chalong Hospital", "Phuket", 3.9, 670, 0, None),
    ("Dibuk Hospital", "Phuket", 4.0, 540, 0, None),
    ("Thalang Hospital", "Phuket", 3.8, 890, 0, None),
]
for name, city, rat, rev, jci, url in hospitals_pkt:
    hid = upsert_hospital(name, city, rating=rat, reviews=rev, jci=jci, url=url)
    print(f"PKT: {name} (id={hid})")

# Bangkok Hospital Phuket
hid = upsert_hospital("Bangkok Hospital Phuket", "Phuket", rating=4.6, reviews=3890, jci=1, url="https://www.bangkokphuket.com")
add_pkg(hid, "Basic Health Check", 2500, "basic", blood=1, xray=1, consult=1, interp=1)
add_pkg(hid, "Standard Health Screening", 5500, "standard", blood=1, xray=1, us=1, consult=1, interp=1)
add_pkg(hid, "Executive Health Check A", 9800, "executive", blood=1, xray=1, us=1, ecg=1, consult=1, interp=1)
add_pkg(hid, "Executive Health Check B", 16500, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "VIP Platinum Package", 28000, "executive", blood=1, xray=1, us=1, ct=1, mri=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Women Premium Package", 12500, "women", blood=1, xray=1, us=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Cancer Screening Package", 18900, "cancer", blood=1, xray=1, us=1, cancer=1, consult=1, interp=1)

# Mission Hospital Phuket
hid = upsert_hospital("Mission Hospital Phuket", "Phuket", rating=4.2, reviews=980, url="https://www.missionphuket.com")
add_pkg(hid, "Basic Annual Check-Up", 1800, "basic", blood=1, xray=1, consult=1)
add_pkg(hid, "Standard Health Package", 3900, "standard", blood=1, xray=1, us=1, consult=1)
add_pkg(hid, "Executive Package A", 7500, "executive", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1)
add_pkg(hid, "Executive Package B", 13500, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1)
add_pkg(hid, "Women Health Package", 6500, "women", blood=1, xray=1, us=1, cancer=1, consult=1)

# Phuket International Hospital
hid = upsert_hospital("Phuket International Hospital", "Phuket", rating=4.4, reviews=2100, url="https://www.phuket-inter-hospital.co.th")
add_pkg(hid, "Basic Health Check", 2200, "basic", blood=1, xray=1, consult=1, interp=1)
add_pkg(hid, "Comprehensive Package I", 4900, "standard", blood=1, xray=1, us=1, consult=1, interp=1)
add_pkg(hid, "Executive Package I", 8900, "executive", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Executive Package II", 15800, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1, interp=1)
add_pkg(hid, "Senior Package 55+", 9500, "senior", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1)

# Siriroj Hospital
hid = upsert_hospital("Siriroj Hospital", "Phuket", rating=4.1, reviews=1430)
add_pkg(hid, "Basic Health Package", 1500, "basic", blood=1, xray=1, consult=1)
add_pkg(hid, "Standard Package", 3200, "standard", blood=1, xray=1, us=1, consult=1)
add_pkg(hid, "Executive Package", 6800, "executive", blood=1, xray=1, us=1, ecg=1, cancer=1, consult=1)
add_pkg(hid, "Premium Package", 11900, "executive", blood=1, xray=1, us=1, ct=1, ecg=1, cancer=1, consult=1)

print("\n=== DONE ===")
with conn.cursor() as c:
    c.execute("SELECT city, COUNT(*) n FROM hospitals GROUP BY city ORDER BY n DESC")
    for r in c.fetchall(): print(f"  {r['city']}: {r['n']}")
    c.execute("SELECT COUNT(*) n FROM checkup_packages"); print(f"Total packages: {c.fetchone()['n']}")
conn.close()
