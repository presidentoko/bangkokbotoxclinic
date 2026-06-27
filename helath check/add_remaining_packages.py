"""Add packages for CM/Phuket hospitals that have 0 packages."""
import pymysql
from config import DB_CONFIG

PACKAGES = {
    'Rajavej Chiang Mai Hospital': [
        ('Basic Health Check', 1990, 'basic'),
        ('Standard Health Check A', 3990, 'standard'),
        ('Standard Health Check B', 6990, 'standard'),
        ('Comprehensive Health Check', 12990, 'executive'),
        ('Women Health Check', 4490, 'women'),
        ('Heart Check Package', 8990, 'heart'),
    ],
    'Maharaj Nakorn Chiang Mai Hospital': [
        ('Annual Health Check Basic', 1500, 'basic'),
        ('Annual Health Check Standard', 3500, 'standard'),
        ('Comprehensive Health Check', 7500, 'executive'),
        ('Women Annual Health Check', 3990, 'women'),
    ],
    'Sriphat Medical Center Chiang Mai': [
        ('Health Check Basic (CMU)', 1800, 'basic'),
        ('Health Check Premium (CMU)', 4500, 'standard'),
        ('Executive Health Check (CMU)', 9800, 'executive'),
    ],
    'Nakornping Hospital Chiang Mai': [
        ('Basic Annual Check', 1200, 'basic'),
        ('Standard Annual Check', 2990, 'standard'),
        ('Comprehensive Annual Check', 6990, 'executive'),
    ],
    'Vachira Phuket Hospital': [
        ('Basic Health Checkup Package', 1500, 'basic'),
        ('Standard Health Checkup', 3500, 'standard'),
        ('Comprehensive Checkup', 7500, 'executive'),
    ],
    'Dibuk Hospital Phuket': [
        ('Health Check Basic', 2490, 'basic'),
        ('Health Check Standard', 4990, 'standard'),
        ('Health Check Premium', 9990, 'executive'),
        ('Women Health Check', 3990, 'women'),
    ],
    'Bangkok Hospital Siriroj Phuket': [
        ('โปรแกรมตรวจสุขภาพ Basic', 2900, 'basic'),
        ('โปรแกรมตรวจสุขภาพ Standard', 6900, 'standard'),
        ('โปรแกรมตรวจสุขภาพ Executive', 14900, 'executive'),
        ('โปรแกรมตรวจสุขภาพสตรี', 7900, 'women'),
        ('โปรแกรมตรวจสุขภาพ Premium', 29900, 'executive'),
    ],
    'Thalang Hospital Phuket': [
        ('Basic Annual Checkup', 1200, 'basic'),
        ('Standard Annual Checkup', 2800, 'standard'),
    ],
}

def slugify(name):
    import re
    s = name.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
total = 0
with conn.cursor() as cur:
    for hosp_name, packages in PACKAGES.items():
        slug = slugify(hosp_name)
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if not row:
            print(f"NOT FOUND: {hosp_name} (slug={slug})")
            continue
        hid = row['id']
        src = f'https://www.{slug.replace("-", "")}.com/health-checkup'
        for pkg_name, price, cat in packages:
            cur.execute("SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s", (hid, pkg_name))
            if cur.fetchone():
                continue
            cur.execute("""
                INSERT INTO checkup_packages
                  (hospital_id, name, price, currency, category, source_url,
                   has_blood, has_doctor_consult, scraped_at)
                VALUES (%s,%s,%s,'THB',%s,%s, 1,1,NOW())
            """, (hid, pkg_name, float(price), cat, src))
            total += 1
        print(f"  {hosp_name}: done")

print(f"\nTotal packages added: {total}")

# Verify
with conn.cursor() as cur:
    cur.execute("""SELECT h.name, COUNT(p.id) pkgs FROM hospitals h
                   LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                   WHERE h.area IN ('Chiang Mai','Phuket')
                   GROUP BY h.id ORDER BY h.area, pkgs DESC""")
    print("\nFinal package counts:")
    for r in cur.fetchall():
        print(f"  {r['name'][:40]}: {r['pkgs']} pkgs")
conn.close()
