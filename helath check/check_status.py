import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute('SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals')
    r = cur.fetchone()
    print(f"Total: {r['n']}, With rating: {r['nr']}")
    cur.execute('SELECT name, rating, review_count FROM hospitals WHERE rating IS NOT NULL ORDER BY review_count DESC LIMIT 30')
    for r in cur.fetchall():
        print(f"  {r['rating']} ({r['review_count']:,}) {r['name'][:40]}")
conn.close()
