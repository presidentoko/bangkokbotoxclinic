import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("DESCRIBE hospitals")
    cols = [r['Field'] for r in cur.fetchall()]
    print("Columns:", cols)

    cur.execute("SELECT COUNT(*) n, COUNT(gbp_place_id) gp FROM hospitals")
    r = cur.fetchone()
    print(f"\nTotal hospitals: {r['n']}, with gbp_place_id: {r['gp']}")

    # Sample hospitals with place IDs
    cur.execute("SELECT slug, name, gbp_place_id FROM hospitals WHERE gbp_place_id IS NOT NULL LIMIT 5")
    for r in cur.fetchall():
        print(f"  {r['name'][:40]} → {r['gbp_place_id']}")

    # Check if rating column exists
    has_rating = 'rating' in cols
    has_reviews = 'review_count' in cols
    print(f"\nHas rating col: {has_rating}, has review_count: {has_reviews}")
conn.close()
