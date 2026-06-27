"""Identify what major hospitals are missing from our DB."""
import pymysql
from config import DB_CONFIG

# Well-known Bangkok hospitals we should have
MAJOR_HOSPITALS = [
    'Samitivej Sukhumvit', 'Samitivej Nawamin', 'Samitivej Srinakarin',
    'Paolo Memorial', 'Paolo Kaset', 'Paolo Phaholyothin',
    'Yanhee Hospital', 'Bangkok Christian Hospital', 'Rutnin Eye Hospital',
    'Sikarin Hospital', 'Thonburi Hospital', 'MedPark Hospital',
    'Bangpakok 9', 'Vibhavadi Hospital', 'Rajavithi Hospital',
    'Bangkok General Hospital', 'Nonthavej Hospital', 'Ladprao General Hospital',
    'Phayathai Nawamin', 'Phyathai 3', 'Bangkok Hospital Ratchasima',
    'Saint Louis Hospital', 'Mission Hospital', 'Petcharavej Hospital',
    'Piyavate Hospital', 'Ramkhamhaeng Hospital', 'Bangmod Hospital',
    'Synphaet Hospital', 'Ekachai Hospital', 'Kasemrad Hospital',
]

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("SELECT h.name, h.slug, COUNT(p.id) n FROM hospitals h LEFT JOIN checkup_packages p ON p.hospital_id=h.id WHERE h.slug NOT LIKE 'hdm-%%' GROUP BY h.id ORDER BY n DESC")
    existing = cur.fetchall()
    print('=== Current non-HDmall hospitals ===')
    for r in existing:
        print(f'  {r["n"]:>3} pkgs  {r["name"]}')

    print('\n=== Missing major hospitals ===')
    existing_names = [r['name'].lower() for r in existing]
    for name in MAJOR_HOSPITALS:
        if not any(name.lower() in en or en in name.lower() for en in existing_names):
            print(f'  MISSING: {name}')

    # HDmall coverage
    cur.execute("SELECT COUNT(DISTINCT h.id) n FROM hospitals h WHERE h.slug LIKE 'hdm-%%'")
    print(f'\nHDmall hospitals: {cur.fetchone()["n"]}')

    # Price range distribution
    cur.execute("""
        SELECT
            CASE
                WHEN price < 5000 THEN '<5k'
                WHEN price < 10000 THEN '5-10k'
                WHEN price < 20000 THEN '10-20k'
                WHEN price < 50000 THEN '20-50k'
                ELSE '50k+'
            END as range_label,
            COUNT(*) n
        FROM checkup_packages WHERE price IS NOT NULL
        GROUP BY range_label ORDER BY MIN(price)
    """)
    print('\n=== Price distribution ===')
    for r in cur.fetchall():
        print(f'  {r["range_label"]:>6}: {r["n"]} packages')

conn.close()
