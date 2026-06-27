"""Fix bad rating data and re-scrape major hospitals."""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Delete clearly wrong data (3,233,361 is global Google Maps review count)
    cur.execute("UPDATE hospitals SET rating=NULL, review_count=NULL WHERE review_count > 100000")
    print(f"Cleared bad counts: {cur.rowcount} rows")

    # Also remove suspicious low-count data for small clinics that got wrong place data
    # Paolo Kaset 3.9 (8) seems too low - reset
    cur.execute("UPDATE hospitals SET rating=NULL, review_count=NULL WHERE slug='paolo-kaset' AND review_count < 50")
    print(f"Reset Paolo Kaset bad data: {cur.rowcount}")

    # Show remaining valid ratings
    cur.execute("""SELECT name, rating, review_count FROM hospitals
                   WHERE rating IS NOT NULL ORDER BY review_count DESC""")
    print(f"\nValid ratings:")
    for r in cur.fetchall():
        print(f"  ★{r['rating']} ({r['review_count']:,}) {r['name'][:40]}")

    cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
    r = cur.fetchone()
    print(f"\nTotal: {r['n']} hospitals, {r['nr']} with valid ratings")

conn.close()
