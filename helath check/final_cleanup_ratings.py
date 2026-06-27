"""Final cleanup: remove duplicate review counts and empty-name hospital ratings."""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # 1. Remove ratings for hospitals with empty/null names
    cur.execute("UPDATE hospitals SET rating=NULL, review_count=NULL WHERE (name IS NULL OR name='') AND rating IS NOT NULL")
    print(f"Cleared empty-name hospitals: {cur.rowcount}")

    # 2. Find duplicate review_counts (bug: same count = wrong place matched)
    cur.execute("""SELECT review_count, COUNT(*) n FROM hospitals
                   WHERE review_count IS NOT NULL AND review_count > 0
                   GROUP BY review_count HAVING n > 1""")
    dup_counts = [(r['review_count'], r['n']) for r in cur.fetchall()]
    print(f"\nDuplicate counts found: {len(dup_counts)}")
    for count, n in dup_counts:
        print(f"  {count} appears {n} times")

    # Clear those duplicated counts
    if dup_counts:
        counts_to_clear = [c for c, n in dup_counts]
        placeholders = ','.join(['%s'] * len(counts_to_clear))
        cur.execute(f"UPDATE hospitals SET rating=NULL, review_count=NULL WHERE review_count IN ({placeholders})", counts_to_clear)
        print(f"Cleared: {cur.rowcount} rows with duplicate counts")

    # 3. Clear very low counts (<3) for "hospitals" - likely wrong results
    cur.execute("UPDATE hospitals SET rating=NULL, review_count=NULL WHERE review_count < 3 AND review_count > 0")
    print(f"Cleared too-low counts: {cur.rowcount}")

    # Final count
    cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
    r = cur.fetchone()
    print(f"\nFinal: {r['n']} hospitals, {r['nr']} with valid ratings")

    # Show top by review count
    cur.execute("""SELECT name, rating, review_count FROM hospitals
                   WHERE rating IS NOT NULL AND name != '' AND name IS NOT NULL
                   ORDER BY review_count DESC LIMIT 20""")
    print("\nTop by review count:")
    for r in cur.fetchall():
        print(f"  {r['rating']} ({r['review_count']:,}) {r['name'][:40]}")

conn.close()
