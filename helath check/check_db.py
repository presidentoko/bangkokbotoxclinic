import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    for slug in ['phyathai-1','phyathai-2','vejthani','bnh','samitivej-srinakarin','praram9','bangkok-hospital']:
        cur.execute('SELECT id FROM hospitals WHERE slug=%s', (slug,))
        row = cur.fetchone()
        if not row: print(f'{slug}: NOT FOUND'); continue
        cur.execute('SELECT name, price FROM checkup_packages WHERE hospital_id=%s ORDER BY price', (row['id'],))
        pkgs = cur.fetchall()
        print(f'\n--- {slug} ({len(pkgs)}) ---')
        for p in pkgs:
            print(f'  {str(p["price"] or "NULL"):>8}  {p["name"]}')
conn.close()
