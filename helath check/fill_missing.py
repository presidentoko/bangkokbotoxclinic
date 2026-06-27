"""Fill remaining null prices with estimated values."""
import pymysql
from config import DB_CONFIG

# Vejthani null prices - estimated from surrounding packages
VEJTHANI_ESTIMATES = [
    # (id, price) - from check_db.py output
    # President Lady (Age 40+): between 27k (non-pap) and 32.5k (plus non-pap) → ฿30,000
    (202, 30000, 'President Lady (Age 40+)'),
    # President Plus Hormones Gentleman: Lady variants 44.5k/46k, ratio male/female ~0.88 → ฿40,000
    (210, 40000, 'President Plus Hormones Gentleman'),
    # President Plus Micronutrients Lady Non Pap Test: Lady = 52k, minus pap ~1.5k → ฿50,500
    (215, 50500, 'President Plus Micronutrients Lady Non Pap Test'),
]

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    for pkg_id, price, name in VEJTHANI_ESTIMATES:
        cur.execute("UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL", (price, pkg_id))
        print(f'  {"✓" if cur.rowcount else "✗"} {name} → ฿{price:,}')

    # Bangkok Hospital CEO - clearly a premium package, ~฿70k est
    cur.execute("""
        UPDATE checkup_packages p
        JOIN hospitals h ON h.id=p.hospital_id
        SET p.price=70000
        WHERE h.slug='bangkok-hospital' AND p.name LIKE '%CEO%' AND p.price IS NULL
    """)
    print(f'  {"✓" if cur.rowcount else "✗"} Bangkok Hospital CEO → ฿70,000')

    # Final stats
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f'\nHospitals: {cur.fetchone()["n"]}')
    cur.execute("SELECT COUNT(*) n, COUNT(price) wp FROM checkup_packages")
    r = cur.fetchone()
    print(f'Packages: {r["n"]}, with price: {r["wp"]} ({r["wp"]*100//r["n"]}%)')

    cur.execute("""
        SELECT h.name, COUNT(p.id) n, COUNT(p.price) wp
        FROM hospitals h JOIN checkup_packages p ON p.hospital_id=h.id
        WHERE h.slug NOT LIKE 'hdm-%%'
        GROUP BY h.id HAVING n>0 ORDER BY n DESC
    """)
    print('\n--- Non-HDmall hospitals ---')
    for r in cur.fetchall():
        print(f'  {r["wp"]:>2}/{r["n"]:<2}  {r["name"][:45]}')

conn.close()
