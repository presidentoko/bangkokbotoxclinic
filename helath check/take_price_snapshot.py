"""
Daily price snapshot — run via cron or watchdog.
Records current package prices into package_price_snapshots so we can show
price history sparklines on the website.
"""
import sys, datetime
sys.path.insert(0, '.')
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
today = datetime.date.today().isoformat()

with conn.cursor() as c:
    # Ensure table exists
    c.execute("""CREATE TABLE IF NOT EXISTS package_price_snapshots (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        package_id BIGINT UNSIGNED NOT NULL,
        snapshot_date DATE NOT NULL,
        price DECIMAL(10,2),
        INDEX (package_id),
        UNIQUE KEY uq_pkg_date (package_id, snapshot_date)
    ) ENGINE=InnoDB""")

    # No "already ran today, skip" guard. The UNIQUE (package_id,
    # snapshot_date) key plus INSERT IGNORE below already makes a second run
    # idempotent, and the guard's only real effect was that any package added
    # after the day's first run never got a snapshot at all — which is exactly
    # what happened when hdmall_reparse.py replaced 607 rows on 2026-08-17 and
    # left every one of them with no price history.

    # Insert current prices (only priced packages)
    c.execute("""INSERT IGNORE INTO package_price_snapshots (package_id, snapshot_date, price)
                 SELECT id, %s, price FROM checkup_packages WHERE price IS NOT NULL""", (today,))
    inserted = c.rowcount

conn.commit()

with conn.cursor() as c:
    c.execute("SELECT COUNT(DISTINCT snapshot_date) n FROM package_price_snapshots")
    days = c.fetchone()['n']

print(f"Snapshot {today}: inserted {inserted} rows. Total days tracked: {days}")
conn.close()
