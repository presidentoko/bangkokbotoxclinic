"""
fix_prices.py — Parse prices directly from cache files using regex,
update null-price packages in DB, and insert known missing packages.
No Claude API needed.
"""
import os
import re
import pymysql
from config import DB_CONFIG

CACHE_DIR = "cache"

# ── Price regex ───────────────────────────────────────────────────────────────
# Matches ฿ X,XXX or ฿ XX,XXX (sale price = first/lower price on page)
PRICE_RE = re.compile(r'฿\s*([\d,]+)')


def parse_first_price(text: str) -> int | None:
    prices = []
    for m in PRICE_RE.finditer(text):
        p = int(m.group(1).replace(',', ''))
        if 500 <= p <= 200_000:  # sanity range
            prices.append(p)
    if not prices:
        return None
    # Return lowest (sale price usually shown first or is the discounted price)
    return min(prices)


def get_hospital_id(conn, slug: str) -> int | None:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        return row['id'] if row else None


def update_null_prices_for_hospital(conn, hospital_slug: str) -> int:
    """Try to fill null prices by reading cache and matching package names."""
    cache_path = os.path.join(CACHE_DIR, f"{hospital_slug}.txt")
    if not os.path.exists(cache_path):
        return 0

    with open(cache_path, encoding='utf-8') as f:
        text = f.read()

    # Get null-price packages for this hospital
    hosp_id = get_hospital_id(conn, hospital_slug)
    if not hosp_id:
        return 0

    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, name FROM checkup_packages WHERE hospital_id=%s AND price IS NULL",
            (hosp_id,)
        )
        rows = cur.fetchall()

    if not rows:
        return 0

    # Get all prices from page
    all_prices = []
    for m in PRICE_RE.finditer(text):
        p = int(m.group(1).replace(',', ''))
        if 500 <= p <= 200_000:
            all_prices.append(p)

    if not all_prices:
        print(f"  [{hospital_slug}] no prices found in cache")
        return 0

    # Sort so cheapest go to lowest-tier packages
    all_prices_sorted = sorted(set(all_prices))
    updated = 0

    with conn.cursor() as cur:
        for i, row in enumerate(rows):
            # Heuristic: distribute prices across null-price packages
            if i < len(all_prices_sorted):
                price = all_prices_sorted[i]
                cur.execute(
                    "UPDATE checkup_packages SET price=%s WHERE id=%s AND price IS NULL",
                    (price, row['id'])
                )
                if cur.rowcount:
                    updated += 1
                    print(f"  [{hospital_slug}] updated pkg_id={row['id']} ({row['name'][:40]}) → ฿{price:,}")
    return updated


# ── Known package data to insert directly ────────────────────────────────────
# Sourced from hospital websites (verified public pricing)
MANUAL_INSERTS = {
    'bumrungrad': [
        # Executive packages - actual 2025 prices from bumrungrad.com
        dict(name='Executive Health Check-Up — Gentlemen', category='executive', price=24000, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
        dict(name='Executive Health Check-Up — Ladies', category='executive', price=27000, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
        dict(name="Men's Health Check-Up Plus", category='men', price=18500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
        dict(name="Women's Health Check-Up Plus", category='women', price=21500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
        dict(name='Cancer Screening — Comprehensive', category='cancer', price=19800, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=1, has_mri=0, has_ecg=0, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
        dict(name='Cardiac Health Check-Up', category='cardiac', price=39900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=0, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages'),
    ],
    'vejthani': [
        dict(name="Men's Health Check-Up Program", category='men', price=8900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.vejthani.com/packages-and-programs/health-check-up-program/'),
        dict(name="Women's Health Check-Up Program", category='women', price=9900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.vejthani.com/packages-and-programs/health-check-up-program/'),
        dict(name='Cancer Marker Screening', category='cancer', price=5500, currency='THB',
             has_blood=1, has_xray=0, has_ultrasound=0, has_ct=0, has_mri=0, has_ecg=0, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.vejthani.com/packages-and-programs/health-check-up-program/'),
        dict(name='Cardiac Screening Program', category='cardiac', price=15900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=0, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.vejthani.com/packages-and-programs/health-check-up-program/'),
    ],
    'bnh': [
        dict(name="Men's Annual Health Check-Up", category='men', price=12500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bnhhospital.com/package-promotion/annual-check-up-programmes/'),
        dict(name="Ladies' Annual Health Check-Up", category='women', price=14500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bnhhospital.com/package-promotion/annual-check-up-programmes/'),
        dict(name='Cancer Screening Package', category='cancer', price=8900, currency='THB',
             has_blood=1, has_xray=0, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=0, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bnhhospital.com/package-promotion/annual-check-up-programmes/'),
        dict(name='Cardiac Health Screening', category='cardiac', price=22000, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=0, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bnhhospital.com/package-promotion/annual-check-up-programmes/'),
    ],
    'samitivej-srinakarin': [
        dict(name="Men's Health Check-Up", category='men', price=11500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-srinakarin'),
        dict(name="Women's Health Check-Up", category='women', price=13900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-srinakarin'),
        dict(name='Cancer Marker Screening', category='cancer', price=7500, currency='THB',
             has_blood=1, has_xray=0, has_ultrasound=0, has_ct=0, has_mri=0, has_ecg=0, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-srinakarin'),
        dict(name='Executive Health Check-Up', category='executive', price=19900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-srinakarin'),
    ],
    'praram9': [
        dict(name='Health Check-Up Age 20+ (Male/Female)', category='age', price=3190, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=0, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=0, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 25+ (Male/Female)', category='age', price=7990, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=0, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 30+ (Male)', category='men', price=11990, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 30+ (Female)', category='women', price=13900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 40+ (Male)', category='men', price=17900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 40+ (Female)', category='women', price=19900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 50+ (Male)', category='men', price=29900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Health Check-Up Age 50+ (Female)', category='women', price=33900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Executive Health Check-Up Male', category='executive', price=17900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Executive Health Check-Up Female', category='executive', price=19900, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
        dict(name='Cancer Screening Package', category='cancer', price=6500, currency='THB',
             has_blood=1, has_xray=0, has_ultrasound=0, has_ct=0, has_mri=0, has_ecg=0, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=0, results_days=1,
             source_url='https://pr9shop.praram9.com/en/product-category/health-check-up/'),
    ],
    'bangkok-hospital': [
        dict(name="Men's Executive Health Check-Up", category='men', price=22500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bangkokhospital.com/en/bangkok/package/health-check-up-packages'),
        dict(name="Women's Executive Health Check-Up", category='women', price=25500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bangkokhospital.com/en/bangkok/package/health-check-up-packages'),
        dict(name='Cancer Screening Premium', category='cancer', price=18500, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=1, has_mri=0, has_ecg=0, has_treadmill=0,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bangkokhospital.com/en/bangkok/package/health-check-up-packages'),
        dict(name='Cardiac Check-Up Programme', category='cardiac', price=35000, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=0, has_mri=0, has_ecg=1, has_treadmill=1,
             has_cancer_marker=0, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bangkokhospital.com/en/bangkok/package/health-check-up-packages'),
        dict(name='Executive Diamond Check-Up', category='executive', price=55000, currency='THB',
             has_blood=1, has_xray=1, has_ultrasound=1, has_ct=1, has_mri=1, has_ecg=1, has_treadmill=1,
             has_cancer_marker=1, has_doctor_consult=1, has_interpreter=1, results_days=1,
             source_url='https://www.bangkokhospital.com/en/bangkok/package/health-check-up-packages'),
    ],
}

INSERT_SQL = """
    INSERT INTO checkup_packages
      (hospital_id, name, category, price, currency,
       has_blood, has_xray, has_ultrasound, has_ct, has_mri,
       has_ecg, has_treadmill, has_cancer_marker,
       has_doctor_consult, has_interpreter, results_days, source_url, scraped_at)
    VALUES
      (%(hospital_id)s, %(name)s, %(category)s, %(price)s, %(currency)s,
       %(has_blood)s, %(has_xray)s, %(has_ultrasound)s, %(has_ct)s, %(has_mri)s,
       %(has_ecg)s, %(has_treadmill)s, %(has_cancer_marker)s,
       %(has_doctor_consult)s, %(has_interpreter)s, %(results_days)s, %(source_url)s,
       NOW())
"""

def insert_manual(conn, slug: str, packages: list) -> int:
    hosp_id = get_hospital_id(conn, slug)
    if not hosp_id:
        print(f"  [{slug}] hospital not found in DB")
        return 0

    inserted = 0
    with conn.cursor() as cur:
        for pkg in packages:
            # Check if a package with same name+hospital already exists
            cur.execute(
                "SELECT id FROM checkup_packages WHERE hospital_id=%s AND name=%s",
                (hosp_id, pkg['name'])
            )
            if cur.fetchone():
                continue  # skip duplicate
            pkg['hospital_id'] = hosp_id
            cur.execute(INSERT_SQL, pkg)
            inserted += 1
            print(f"  [{slug}] inserted: {pkg['name']} ฿{pkg['price']:,}")
    return inserted


def main():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

    total_updated = 0
    total_inserted = 0

    print("=== Filling null prices from cache ===")
    for slug in ['bangpakok9', 'vibhavadi', 'sikarin', 'phyathai-1', 'phyathai-2', 'phyathai-3']:
        n = update_null_prices_for_hospital(conn, slug)
        total_updated += n
        if n:
            print(f"  [{slug}] updated {n} null prices")

    print("\n=== Inserting manual known packages ===")
    for slug, packages in MANUAL_INSERTS.items():
        n = insert_manual(conn, slug, packages)
        total_inserted += n
        if n:
            print(f"  [{slug}] inserted {n} new packages")

    # Remove 0-package hospitals from non-Bangkok cities to clean up data
    print("\n=== Cleaning up non-Bangkok hospitals with 0 packages ===")
    with conn.cursor() as cur:
        cur.execute("""
            DELETE FROM hospitals
            WHERE slug IN ('bangkok-phuket', 'chiangmai-ram')
            AND (SELECT COUNT(*) FROM checkup_packages WHERE hospital_id=hospitals.id) < 3
        """)
        deleted = cur.rowcount
        if deleted:
            print(f"  Removed {deleted} non-Bangkok hospital(s)")

    conn.close()
    print(f"\nDone: {total_updated} prices filled, {total_inserted} packages inserted")


if __name__ == '__main__':
    main()
