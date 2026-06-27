import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("DESCRIBE hospitals")
    print("hospitals schema:")
    for r in cur.fetchall():
        print(f"  {r['Field']} {r['Type']} {r['Null']} {r.get('Default','')}")
conn.close()
