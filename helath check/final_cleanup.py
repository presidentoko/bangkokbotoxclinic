import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Delete URL slug package and duplicate
    cur.execute("DELETE FROM checkup_packages WHERE id IN (2695, 2685)")
    print(f'Deleted: {cur.rowcount}')
    # Delete Thonburi hospital (0 packages)
    cur.execute("SELECT id FROM hospitals WHERE slug='thonburi'")
    row = cur.fetchone()
    if row:
        cur.execute("DELETE FROM checkup_packages WHERE hospital_id=%s", (row['id'],))
        cur.execute("DELETE FROM hospitals WHERE id=%s", (row['id'],))
        print("Deleted Thonburi hospital")
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'Hospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Packages: {r["n"]}, with price: {r["wp"]} (100%)')
conn.close()
