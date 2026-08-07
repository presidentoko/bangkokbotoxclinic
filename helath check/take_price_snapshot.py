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

    # Skip if already ran today
    c.execute("SELECT COUNT(*) n FROM package_price_snapshots WHERE snapshot_date=%s", (today,))
    if c.fetchone()['n'] > 0:
        print(f"Snapshot already exists for {today} — skipping.")
        conn.close()
        sys.exit(0)

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
