"""Check which hospitals have ratings but no/few packages."""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("""
        SELECT h.name, h.slug, h.rating, h.review_count,
               COUNT(p.id) AS pkg_count,
               MIN(p.price) AS min_price,
               MAX(p.price) AS max_price
        FROM hospitals h
        LEFT JOIN checkup_packages p ON p.hospital_id = h.id
        WHERE h.rating IS NOT NULL
          AND h.name IS NOT NULL AND h.name != ''
        GROUP BY h.id
        ORDER BY h.review_count DESC, pkg_count ASC
        LIMIT 30
    """)
    print("Top rated hospitals by review count:")
    print(f"{'Name':<40} {'★':>4} {'Reviews':>8} {'Pkgs':>5} {'Price Range'}")
    print('-' * 80)
    for r in cur.fetchall():
        price = f"{r['min_price']:,.0f}-{r['max_price']:,.0f}" if r['pkg_count'] > 0 else "NO PACKAGES"
        print(f"{r['name'][:38]:<40} {r['rating']:>4} {r['review_count']:>8,} {r['pkg_count']:>5}  {price}")

    print()
    cur.execute("""
        SELECT COUNT(*) n FROM hospitals h
        WHERE NOT EXISTS (SELECT 1 FROM checkup_packages p WHERE p.hospital_id = h.id)
    """)
    print(f"Hospitals with 0 packages: {cur.fetchone()['n']}")

conn.close()
