import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Remove garbage phyathai packages (name starts with comma, garbled)
    cur.execute("DELETE FROM checkup_packages WHERE name LIKE '%,%90%' OR name LIKE ',%780%' OR source_url='playwright-scraped'")
    print('Deleted garbage packages:', cur.rowcount)

    # Remove hospitals with 0 packages and no URL that can be scraped
    cur.execute("""
        SELECT h.id, h.slug, h.name, COUNT(p.id) n
        FROM hospitals h
        LEFT JOIN checkup_packages p ON p.hospital_id=h.id
        GROUP BY h.id
        HAVING n = 0
    """)
    for row in cur.fetchall():
        print(f"0-package hospital: {row['slug']} ({row['name']})")

    # Summary
    cur.execute('SELECT COUNT(*) t, COUNT(price) wp FROM checkup_packages')
    r = cur.fetchone()
    print(f"\nFinal: {r['t']} packages, {r['wp']} with price")
conn.close()
