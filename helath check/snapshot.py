"""
snapshot.py — copy current prices from checkup_packages → package_price_snapshots.
Run once daily via cron. Duplicate (package_id, date) pairs are silently ignored.
"""
import datetime
import pymysql
from config import DB_CONFIG


def main():
    today = datetime.date.today()
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("""
            INSERT IGNORE INTO package_price_snapshots
              (package_id, hospital_id, snapshot_date, price, currency)
            SELECT id, hospital_id, %s, price, currency
            FROM checkup_packages
            WHERE price IS NOT NULL
        """, (today,))
        inserted = cur.rowcount
    conn.close()
    print(f"Snapshot {today}: {inserted} row(s) inserted.")


if __name__ == "__main__":
    main()
