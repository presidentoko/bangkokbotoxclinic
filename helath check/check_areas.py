import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("""SELECT area, COUNT(*) n, COUNT(rating) rated
                   FROM hospitals GROUP BY area ORDER BY n DESC""")
    print("Hospitals by area:")
    for r in cur.fetchall():
        print(f"  {str(r['area']):<20} {r['n']:>3} hospitals, {r['rated']:>3} rated")

    cur.execute("DESCRIBE hospitals")
    print("\nHospitals table columns:")
    for r in cur.fetchall():
        print(f"  {r['Field']:<20} {r['Type']}")
conn.close()
