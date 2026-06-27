"""Clean up garbage Samitivej entries added by samitivej_extract.py."""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Get Srinakarin hospital ID
    cur.execute("SELECT id FROM hospitals WHERE slug='samitivej-srinakarin'")
    hosp_id = cur.fetchone()['id']

    # Show all packages to identify garbage
    cur.execute("SELECT id, name, price FROM checkup_packages WHERE hospital_id=%s ORDER BY price", (hosp_id,))
    pkgs = cur.fetchall()
    print(f'Total Srinakarin packages: {len(pkgs)}')
    for p in pkgs:
        is_bad = (
            p['price'] and p['price'] < 3000  # price too low
            or any(kw in (p['name'] or '').lower() for kw in ['-snh', '-svh', '-srk', 'snh', 'svh'])  # URL slug patterns
            or (p['name'] or '').strip().lower() == 'program'  # too vague
        )
        flag = ' ← DELETE' if is_bad else ''
        print(f'  [{p["id"]}] ฿{p["price"] or "NULL":>8}  {(p["name"] or "")[:60]}{flag}')

    # Delete garbage
    BAD_IDS = [
        p['id'] for p in pkgs
        if (p['price'] and p['price'] < 3000)
        or any(kw in (p['name'] or '').lower() for kw in ['-snh', '-svh', '-srk'])
        or (p['name'] or '').strip().lower() in ('program',)
    ]
    if BAD_IDS:
        cur.execute(f"DELETE FROM checkup_packages WHERE id IN ({','.join(str(i) for i in BAD_IDS)})")
        print(f'\nDeleted {cur.rowcount} garbage entries')

    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
    r = cur.fetchone()
    print(f'Srinakarin: {r["n"]} packages, {r["wp"]} with price')

    # Final overall stats
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'\nTotal hospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Total packages: {r["n"]}, with price: {r["wp"]} ({r["wp"]*100//r["n"]}%)')

conn.close()
