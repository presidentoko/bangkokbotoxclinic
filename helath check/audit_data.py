"""Audit current data gaps vs #1 competitor."""
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Total counts
    cur.execute("SELECT COUNT(*) n FROM hospitals")
    print(f"Total hospitals: {cur.fetchone()['n']}")
    cur.execute("SELECT COUNT(*) n FROM checkup_packages")
    print(f"Total packages: {cur.fetchone()['n']}")
    cur.execute("SELECT AVG(c) avg FROM (SELECT COUNT(*) c FROM checkup_packages GROUP BY hospital_id) t")
    print(f"Avg packages/hospital: {cur.fetchone()['avg']:.1f}")

    # Package data completeness
    cur.execute("""SELECT
        COUNT(*) total,
        SUM(has_blood) blood,
        SUM(has_xray) xray,
        SUM(has_ultrasound) ultrasound,
        SUM(has_ecg) ecg,
        SUM(has_ct) ct,
        SUM(has_mri) mri,
        SUM(has_cancer_marker) cancer
        FROM checkup_packages""")
    r = cur.fetchone()
    print(f"\nPackage inclusions filled:")
    print(f"  Blood:      {r['blood']:>5}/{r['total']}")
    print(f"  X-ray:      {r['xray']:>5}/{r['total']}")
    print(f"  Ultrasound: {r['ultrasound']:>5}/{r['total']}")
    print(f"  ECG:        {r['ecg']:>5}/{r['total']}")
    print(f"  CT:         {r['ct']:>5}/{r['total']}")
    print(f"  MRI:        {r['mri']:>5}/{r['total']}")
    print(f"  Cancer:     {r['cancer']:>5}/{r['total']}")

    # Category breakdown
    cur.execute("SELECT category, COUNT(*) n FROM checkup_packages GROUP BY category ORDER BY n DESC")
    print(f"\nPackages by category:")
    for r in cur.fetchall():
        print(f"  {str(r['category']):<15} {r['n']}")

    # Hospitals with < 5 packages (need more data)
    cur.execute("""SELECT h.name, h.area, COUNT(p.id) n
                   FROM hospitals h LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                   WHERE h.area='Bangkok' OR h.area IS NULL
                   GROUP BY h.id HAVING n < 3 ORDER BY n LIMIT 20""")
    rows = cur.fetchall()
    print(f"\nBangkok hospitals with < 3 packages ({len(rows)} shown):")
    for r in rows:
        print(f"  {r['name'][:45]}: {r['n']}")

    # Missing description/test list
    cur.execute("SELECT COUNT(*) n FROM checkup_packages WHERE description IS NOT NULL AND description != ''")
    has_desc = cur.fetchone()['n']
    cur.execute("SELECT COUNT(*) n FROM checkup_packages")
    total = cur.fetchone()['n']
    print(f"\nPackages with test descriptions: {has_desc}/{total}")

    # Hospital address completeness
    cur.execute("SHOW COLUMNS FROM hospitals LIKE 'address'")
    if cur.fetchone():
        cur.execute("SELECT COUNT(*) n FROM hospitals WHERE address IS NOT NULL AND address != ''")
        print(f"Hospitals with address: {cur.fetchone()['n']}")
    else:
        print("\nNO address column in hospitals table!")

    cur.execute("SHOW COLUMNS FROM hospitals LIKE 'phone'")
    if not cur.fetchone():
        print("NO phone column in hospitals table!")

    # Cities coverage
    cur.execute("SELECT area, COUNT(*) n FROM hospitals GROUP BY area ORDER BY n DESC LIMIT 15")
    print(f"\nHospitals by area:")
    for r in cur.fetchall():
        print(f"  {str(r['area']):<20} {r['n']}")

conn.close()
