import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("""SELECT h.name, h.slug, COUNT(p.id) n, COUNT(p.price) wp
                   FROM hospitals h LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                   WHERE h.slug LIKE 'samitivej%' GROUP BY h.id ORDER BY n DESC""")
    for r in cur.fetchall():
        print(r['slug'], r['n'], 'pkgs', r['wp'], 'with price')

    # Final overall stats
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'\nTotal hospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Total packages: {r["n"]}, with price: {r["wp"]}')
conn.close()
