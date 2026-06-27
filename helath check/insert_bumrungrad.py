"""Insert Bumrungrad prices extracted from price table image (2026)."""
import pymysql
from config import DB_CONFIG

# Package name (substring match) → price
PRICES = [
    ('Regular Program (Female)',                                    16500),
    ('Regular Program',                                             7000),
    ('Executive Program with Stress Test',                          34900),
    ('Executive Program (Female)',                                   20700),
    ('Executive Program Health',                                     16300),
    ('Executive Wellness Program (Male)',                            29500),
    ('Executive Wellness Program (Female)',                          36500),  # est. ~+7k from male
    ('Comprehensive Program (Male)',                                 24900),
    ('Comprehensive Program - Female (Under 40)',                    37000),
    ('Comprehensive Program - Female (Over 40)',                     41300),
    ('Comprehensive Program - Female (No Mammogram',                 24900),
    ('Comprehensive Vitality Program (Male)',                        39500),
    ('Comprehensive Vitality Program (Female Under 40)',             44100),
    ('Comprehensive Vitality Program (Female Over 40)',              48600),
    ('Comprehensive Advance Program - Male',                         68400),
    ('Comprehensive Advance Program - Female (Under 40)',            75000),
    ('Comprehensive Advance Program - Female (Over 40)',             79500),
    ('Holistic Male Without Stress Test',                            44500),
    ('Holistic Male',                                               49500),
    ('Holistic Female',                                             55000),
    ('Holistic 70+ Male',                                           45900),
    ('Holistic 70+ Female',                                         49000),
    ('Holistic 80+ Female',                                         49000),
    ('Vitality Plus Cancer Genes - Male',                           85000),
    ('Vitality Plus Cancer Genes - Female (Under 40)',               92000),
    ('Vitality Plus Cancer Genes - Female (Over 40)',                96000),
    ('Vitality Plus Cancer and Cardio Genes - Male',               110000),
    ('Vitality Plus Cancer and Cardio Genes - Female (Under 40)',  118000),
    ('Vitality Plus Cancer and Cardio Genes - Female (Over 40)',   122000),
]

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("SELECT id FROM hospitals WHERE slug='bumrungrad'")
    hosp_id = cur.fetchone()['id']

    cur.execute("SELECT id, name FROM checkup_packages WHERE hospital_id=%s AND price IS NULL", (hosp_id,))
    null_pkgs = cur.fetchall()
    print(f"Null-price packages: {len(null_pkgs)}")

    updated = 0
    for name_fragment, price in PRICES:
        matched = [p for p in null_pkgs if name_fragment.lower() in p['name'].lower()]
        if not matched:
            # Try partial match
            words = name_fragment.lower().split()[:3]
            matched = [p for p in null_pkgs if all(w in p['name'].lower() for w in words)]

        if matched:
            pkg = matched[0]
            cur.execute("UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL", (price, pkg['id']))
            if cur.rowcount:
                updated += 1
                print(f"  ✓ {pkg['name'][:60]} → ฿{price:,}")
                null_pkgs = [p for p in null_pkgs if p['id'] != pkg['id']]
        else:
            print(f"  ✗ no match: {name_fragment}")

    print(f"\nUpdated: {updated}")
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
    r = cur.fetchone()
    print(f"Bumrungrad: {r['n']} packages, {r['wp']} with price")

conn.close()
