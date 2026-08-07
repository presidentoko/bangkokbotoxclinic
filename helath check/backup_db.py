"""Dump the bkkcheckup database to a timestamped .sql file.

Run this the moment Railway comes back up — as of 2026-08-06 the only copy of
the data (235 hospitals, every package, reviews, and the price-snapshot history
going back to 2026-06-26) lived inside a single Railway container that had been
down for over a day. schema.sql in this folder is DDL only, so an outage that
lost the volume would have lost everything.

    python backup_db.py            -> backups/bkkcheckup_YYYY-MM-DD.sql
    python backup_db.py --check    -> just report whether the server answers

Deliberately does not shell out to mysqldump: that binary isn't installed here,
and the whole point is that this runs without setup on the machine that already
has the credentials.
"""

import argparse
import datetime as dt
import os
import pathlib
import socket
import sys

try:
    import pymysql
except ImportError:
    sys.exit("pymysql missing — run: pip install pymysql")

HOST = os.getenv("DB_HOST", "centerbeam.proxy.rlwy.net")
PORT = int(os.getenv("DB_PORT", "32294"))
USER = os.getenv("DB_USER", "root")
DB = "bkkcheckup"
OUT_DIR = pathlib.Path(__file__).parent / "backups"


def read_password() -> str:
    pw = os.getenv("DB_PASS")
    if pw:
        return pw
    # Fall back to the .env sitting next to this script.
    env = pathlib.Path(__file__).parent / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("DB_PASS="):
                return line.split("=", 1)[1].strip()
    sys.exit("DB_PASS not set and not found in .env")


def server_is_up() -> tuple[bool, str]:
    """Railway's TCP proxy accepts connections even when the database behind it
    is stopped, so a successful connect() proves nothing. A live MySQL sends a
    handshake banner unprompted; zero bytes back means the container is down."""
    try:
        sock = socket.create_connection((HOST, PORT), timeout=15)
    except OSError as e:
        return False, f"TCP connect failed: {e}"
    sock.settimeout(15)
    try:
        banner = sock.recv(128)
    except OSError as e:
        return False, f"no handshake: {e}"
    finally:
        sock.close()
    if not banner:
        return False, "TCP accepted but MySQL sent 0 bytes — container is down"
    return True, f"MySQL handshake OK ({len(banner)} bytes)"


def quote(val) -> str:
    if val is None:
        return "NULL"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, (bytes, bytearray)):
        val = val.decode("utf-8", "replace")
    if isinstance(val, (dt.date, dt.datetime)):
        val = val.isoformat(sep=" ")
    return "'" + str(val).replace("\\", "\\\\").replace("'", "''") + "'"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="only report reachability")
    args = ap.parse_args()

    up, detail = server_is_up()
    print(f"{HOST}:{PORT} — {detail}")
    if args.check:
        sys.exit(0 if up else 1)
    if not up:
        sys.exit("Aborting: revive the Railway MySQL service first.")

    conn = pymysql.connect(
        host=HOST, port=PORT, user=USER, password=read_password(),
        database=DB, connect_timeout=30, charset="utf8mb4",
    )
    OUT_DIR.mkdir(exist_ok=True)
    stamp = dt.date.today().isoformat()
    out = OUT_DIR / f"{DB}_{stamp}.sql"

    with conn.cursor() as cur, out.open("w", encoding="utf-8", newline="\n") as fh:
        fh.write(f"-- {DB} dump {dt.datetime.now().isoformat(timespec='seconds')}\n")
        fh.write("SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n")

        cur.execute("SHOW TABLES")
        tables = [r[0] for r in cur.fetchall()]
        total = 0
        for table in tables:
            cur.execute(f"SHOW CREATE TABLE `{table}`")
            fh.write(f"DROP TABLE IF EXISTS `{table}`;\n{cur.fetchone()[1]};\n\n")

            cur.execute(f"SELECT * FROM `{table}`")
            cols = [d[0] for d in cur.description]
            collist = ", ".join(f"`{c}`" for c in cols)
            rows = cur.fetchall()
            # Batch inserts so a 100k-row table doesn't become 100k statements.
            for i in range(0, len(rows), 200):
                chunk = rows[i:i + 200]
                values = ",\n  ".join(
                    "(" + ", ".join(quote(v) for v in row) + ")" for row in chunk
                )
                fh.write(f"INSERT INTO `{table}` ({collist}) VALUES\n  {values};\n")
            fh.write("\n")
            total += len(rows)
            print(f"  {table}: {len(rows)} rows")

        fh.write("SET FOREIGN_KEY_CHECKS=1;\n")

    conn.close()
    size_mb = out.stat().st_size / 1_048_576
    print(f"\nWrote {out} ({size_mb:.1f} MB, {total} rows across {len(tables)} tables)")


if __name__ == "__main__":
    main()
