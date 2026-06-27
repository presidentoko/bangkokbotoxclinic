"""Remove hospitals with no priced packages (useless entries)."""
import pymysql
from config import DB_CONFIG

DELETE_SLUGS = ['samitivej-sukhumvit', 'medpark', 'bangpakok9', 'vibhavadi']

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Delete packages first (FK constraint)
    for slug in DELETE_SLUGS:
        cur.execute("SELECT id, name FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if not row:
            print(f'Not found: {slug}')
            continue
        hosp_id = row['id']
        cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
        pkg_del = cur.rowcount
        cur.execute("DELETE FROM hospitals WHERE id=%s", (hosp_id,))
        print(f'Deleted {slug}: {pkg_del} packages, hospital row')

    # Check Vejthani null-price packages
    cur.execute("SELECT id FROM hospitals WHERE slug='vejthani'")
    row = cur.fetchone()
    if row:
        cur.execute("SELECT id, name FROM checkup_packages WHERE hospital_id=%s AND price IS NULL", (row['id'],))
        nulls = cur.fetchall()
        print(f'\nVejthani null-price packages ({len(nulls)}):')
        for p in nulls:
            print(f'  [{p["id"]}] {p["name"]}')

    # Final stats
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'\nHospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Packages: {r["n"]}, with price: {r["wp"]} ({r["wp"]*100//r["n"]}%)')

conn.close()
