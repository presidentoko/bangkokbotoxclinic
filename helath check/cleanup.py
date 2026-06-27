import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("DELETE p FROM checkup_packages p JOIN hospitals h ON h.id=p.hospital_id WHERE h.slug IN ('bangkok-phuket','chiangmai-ram')")
    print('packages deleted:', cur.rowcount)
    cur.execute("DELETE FROM hospitals WHERE slug IN ('bangkok-phuket','chiangmai-ram')")
    print('hospitals deleted:', cur.rowcount)
    cur.execute('SELECT COUNT(*) as total, COUNT(price) as wp FROM checkup_packages')
    r = cur.fetchone()
    print('Total packages:', r['total'], '| With price:', r['wp'])
    cur.execute('SELECT category, COUNT(*) n, COUNT(price) hp FROM checkup_packages GROUP BY category ORDER BY n DESC')
    for row in cur.fetchall():
        print(' ' + row['category'] + ': ' + str(row['n']) + ' total, ' + str(row['hp']) + ' with price')
    cur.execute('SELECT h.name, COUNT(p.id) n FROM hospitals h LEFT JOIN checkup_packages p ON p.hospital_id=h.id GROUP BY h.id ORDER BY n DESC')
    print('\nHospitals:')
    for row in cur.fetchall():
        print(' ' + str(row['n']) + 'p | ' + row['name'])
conn.close()
