import pymysql
from config import DB_CONFIG
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("SELECT id FROM hospitals WHERE slug IN ('paolo-kaset','paolo-chokchai4','paolo-rangsit')")
    hospitals = cur.fetchall()
    for h in hospitals:
        cur.execute("""INSERT INTO checkup_packages
            (hospital_id, name, price, category, has_blood, has_xray, has_ct, has_mri, source_url, scraped_at)
            VALUES (%s, 'All You Can Check (9,990)', 9990, 'comprehensive', TRUE, TRUE, FALSE, FALSE, 'paolohospital-web', NOW())""",
           (h['id'],))
    print(f'Added {cur.rowcount * len(hospitals)} rows')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Total: {r["n"]} packages, {r["wp"]} with price')
conn.close()
