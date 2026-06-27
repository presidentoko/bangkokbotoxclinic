import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f"Hospitals: {cur.fetchone()['n']}")

    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f"Packages: {r['n']}, with price: {r['wp']} ({r['wp']*100//r['n']}%)")

    # Top hospitals by package count
    cur.execute("""
        SELECT h.name, h.slug, COUNT(p.id) n, COUNT(p.price) wp
        FROM hospitals h
        JOIN checkup_packages p ON p.hospital_id=h.id
        WHERE h.slug NOT LIKE 'hdm-%%'
        GROUP BY h.id ORDER BY n DESC LIMIT 20
    """)
    print('\n--- Major hospitals ---')
    for r in cur.fetchall():
        print(f'  {r["wp"]:>3}/{r["n"]:<3} priced  {r["name"][:45]}  ({r["slug"]})')

    # HDmall stats
    cur.execute("""
        SELECT COUNT(DISTINCT h.id) hn, COUNT(p.id) pn, COUNT(p.price) wp
        FROM hospitals h
        JOIN checkup_packages p ON p.hospital_id=h.id
        WHERE h.slug LIKE 'hdm-%%'
    """)
    r = cur.fetchone()
    print(f'\nHDmall: {r["hn"]} hospitals, {r["pn"]} packages, {r["wp"]} with price')

    # Phyathai on HDmall?
    cur.execute("SELECT slug, name FROM hospitals WHERE LOWER(name) LIKE '%%phyathai%%'")
    rows = cur.fetchall()
    print(f'\nPhyathai entries: {[r["slug"] for r in rows]}')

conn.close()
