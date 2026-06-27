import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    majors = ['vejthani', 'bnh', 'praram9', 'bangkok-hospital', 'phyathai-1', 'phyathai-2', 'phyathai-3',
              'samitivej-sukhumvit', 'samitivej-srinakarin', 'sikarin', 'paolo-kaset']
    for slug in majors:
        cur.execute("""SELECT h.name, h.rating, h.review_count,
                              COUNT(p.id) pkg, MIN(p.price) mn, MAX(p.price) mx
                       FROM hospitals h LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                       WHERE h.slug=%s GROUP BY h.id""", (slug,))
        r = cur.fetchone()
        if r:
            pkgs = f"({r['pkg']} pkgs, {int(r['mn'] or 0):,}-{int(r['mx'] or 0):,})" if r['pkg'] else "NO REAL PKGS"
            rating = f"★{r['rating']} ({r['review_count']:,})" if r['rating'] else "no rating"
            print(f"  {r['name'][:35]:<35} {rating}  {pkgs}")
conn.close()
