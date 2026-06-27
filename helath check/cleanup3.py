"""
cleanup3.py — Remove garbage HDmall entries (spa/massage/lab-only, too cheap)
"""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # 1. Delete packages priced under ฿1,500 from HDmall (single blood tests, etc.)
    cur.execute("""
        DELETE FROM checkup_packages
        WHERE source_url LIKE '%hdmall%'
        AND price < 1500
    """)
    print(f'Deleted cheap HDmall pkgs (< ฿1500): {cur.rowcount}')

    # 2. Delete massage/spa/lab-only hospitals (name contains clear non-hospital keywords)
    BAD_KEYWORDS = ['massage','spa','onsen','yoga','beauty','salon','laser','aesthetic','skin','nail',
                    'dental','dentist','teeth','whitening','laboratory']
    for kw in BAD_KEYWORDS:
        pattern = f'%{kw}%'
        cur.execute("""
            DELETE p FROM checkup_packages p
            JOIN hospitals h ON h.id = p.hospital_id
            WHERE h.slug LIKE 'hdm-%%'
            AND (LOWER(h.name) LIKE %s OR LOWER(p.source_url) LIKE %s)
        """, (pattern, pattern))
        if cur.rowcount:
            print(f'  Removed {kw} packages: {cur.rowcount}')

    # 3. Remove HDmall hospitals that now have 0 packages
    cur.execute("""
        DELETE FROM hospitals
        WHERE slug LIKE 'hdm-%'
        AND id NOT IN (SELECT DISTINCT hospital_id FROM checkup_packages)
    """)
    print(f'Removed empty HDmall hospitals: {cur.rowcount}')

    # 4. Remove hospitals with weird names (encoded URLs, single-word garbage)
    cur.execute("""
        DELETE FROM hospitals
        WHERE slug LIKE 'hdm-%'
        AND (name LIKE '%&amp;%' OR name LIKE '%%%' OR LENGTH(name) < 4)
        AND id NOT IN (SELECT DISTINCT hospital_id FROM checkup_packages)
    """)
    print(f'Removed garbage-name empty hospitals: {cur.rowcount}')

    # 5. Final count
    cur.execute('SELECT COUNT(*) t, COUNT(price) wp FROM checkup_packages')
    r = cur.fetchone()
    cur.execute('SELECT COUNT(*) FROM hospitals')
    h = cur.fetchone()['COUNT(*)']
    print(f'\nAfter cleanup: {h} hospitals, {r["t"]} packages ({r["wp"]} with price)')

    cur.execute('SELECT category, COUNT(*) n FROM checkup_packages GROUP BY category ORDER BY n DESC')
    for row in cur.fetchall():
        print(f'  {row["category"]}: {row["n"]}')

conn.close()
