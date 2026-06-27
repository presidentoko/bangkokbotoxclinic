import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("DESCRIBE hospital_reviews")
    print("hospital_reviews schema:")
    for r in cur.fetchall():
        print(f"  {r['Field']} {r['Type']}")
    cur.execute("SELECT COUNT(*) n FROM hospital_reviews")
    print(f"\nRows: {cur.fetchone()['n']}")
    cur.execute("SELECT * FROM hospital_reviews LIMIT 3")
    for r in cur.fetchall():
        print(f"  {r}")
conn.close()
