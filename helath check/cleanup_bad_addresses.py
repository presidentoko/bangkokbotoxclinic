"""
Remove garbage addresses saved by the scraper (JS obfuscated code matching).
Run after scrape/fix scripts complete.
"""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

with conn.cursor() as cur:
    # Find bad addresses
    cur.execute("SELECT id, name, address FROM hospitals WHERE address IS NOT NULL AND address != ''")
    rows = cur.fetchall()

bad = []
good = []
for r in rows:
    addr = r['address']
    # Garbage: contains JS artifacts
    if any(c in addr for c in ['toString', '}', '{', '_.R', 'Vd(', 'return this']):
        bad.append(r)
    else:
        good.append(r)

print(f"Total with address: {len(rows)}")
print(f"Good: {len(good)}")
print(f"Bad (JS garbage): {len(bad)}")
if bad:
    print("\nSample bad:")
    for r in bad[:5]:
        print(f"  {r['name']}: {r['address'][:60]}")

resp = input(f"\nDelete {len(bad)} bad addresses? [y/N] ").strip().lower()
if resp == 'y':
    ids = [r['id'] for r in bad]
    with conn.cursor() as cur:
        cur.executemany("UPDATE hospitals SET address=NULL WHERE id=%s", [(i,) for i in ids])
    print(f"Cleared {len(bad)} garbage addresses.")

conn.close()
