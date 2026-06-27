import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("SHOW TABLES")
    tables = [r[list(r.keys())[0]] for r in cur.fetchall()]
    print("Tables:", tables)
conn.close()
