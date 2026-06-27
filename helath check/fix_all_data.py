"""
Fix all data quality issues:
1. Add description + phone + address columns
2. Recategorize packages (comprehensive/age → basic/standard/executive/women/cancer/heart)
3. Fix inclusion flags from package names
4. Add test_list to description
"""
import re
import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)

print("=== Step 1: Add missing columns ===")
def add_col_if_missing(cur, table, col, col_def):
    cur.execute(f"SHOW COLUMNS FROM {table} LIKE %s", (col,))
    if cur.fetchone():
        print(f"  Exists: {table}.{col}")
        return
    cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_def}")
    print(f"  Added: {table}.{col}")

with conn.cursor() as cur:
    add_col_if_missing(cur, 'checkup_packages', 'description', 'TEXT')
    add_col_if_missing(cur, 'checkup_packages', 'test_count', 'INT DEFAULT NULL')
    add_col_if_missing(cur, 'hospitals', 'phone', 'VARCHAR(64) DEFAULT NULL')
    add_col_if_missing(cur, 'hospitals', 'address', 'VARCHAR(512) DEFAULT NULL')
    add_col_if_missing(cur, 'hospitals', 'website', 'VARCHAR(512) DEFAULT NULL')
    add_col_if_missing(cur, 'hospitals', 'city', "VARCHAR(64) DEFAULT 'Bangkok'")

print("\n=== Step 2: Set city from area ===")
with conn.cursor() as cur:
    cur.execute("UPDATE hospitals SET city='Chiang Mai' WHERE area='Chiang Mai'")
    print(f"  Chiang Mai: {cur.rowcount}")
    cur.execute("UPDATE hospitals SET city='Phuket' WHERE area='Phuket'")
    print(f"  Phuket: {cur.rowcount}")
    cur.execute("UPDATE hospitals SET city='Bangkok' WHERE city IS NULL OR city=''")
    print(f"  Bangkok: {cur.rowcount}")

print("\n=== Step 3: Recategorize packages ===")
# comprehensive/age → proper categories based on name + price
CATEGORY_RULES = [
    # Name-based (highest priority)
    (r'cancer|tumor|มะเร็ง|oncol|marker', 'cancer'),
    (r'heart|cardiac|cardio|หัวใจ|treadmill|stress test', 'heart'),
    (r'women|female|สตรี|gynec|pap smear|mammogram|mama|เต้านม', 'women'),
    (r'men|male|ชาย|prostate|psa', 'men'),
    (r'diabetes|เบาหวาน|sugar|glucose|dm ', 'metabolic'),
    (r'senior|elder|ผู้สูงอายุ|อายุ.*60|age.*60|60.*year', 'senior'),
    (r'pre.?marr|pre.?wed|ก่อนแต่ง', 'pre_marriage'),
    (r'executive|premium|vip|platinum|gold|diamond|comprehensive|complete|full body', 'executive'),
    (r'basic|essential|start|starter|mini|lite|light|ทั่วไป|พื้นฐาน', 'basic'),
    (r'standard|classic|regular|normal|mid|ปกติ', 'standard'),
]

with conn.cursor() as cur:
    cur.execute("SELECT id, name, price, category FROM checkup_packages")
    pkgs = cur.fetchall()
    updates = {'cancer':0,'heart':0,'women':0,'men':0,'metabolic':0,'senior':0,'pre_marriage':0,
                'executive':0,'basic':0,'standard':0,'kept':0}
    for pkg in pkgs:
        name_lower = (pkg['name'] or '').lower()
        price = float(pkg['price'] or 0)
        new_cat = None
        for pattern, cat in CATEGORY_RULES:
            if re.search(pattern, name_lower):
                new_cat = cat
                break
        # Price-based fallback for unmatched comprehensive/age
        if not new_cat:
            if price < 3000:
                new_cat = 'basic'
            elif price < 8000:
                new_cat = 'standard'
            elif price < 20000:
                new_cat = 'executive'
            else:
                new_cat = 'executive'
        if new_cat != pkg['category']:
            cur.execute("UPDATE checkup_packages SET category=%s WHERE id=%s", (new_cat, pkg['id']))
            updates[new_cat] = updates.get(new_cat, 0) + 1
        else:
            updates['kept'] += 1

print(f"  Recategorized: {dict((k,v) for k,v in updates.items() if v > 0)}")

print("\n=== Step 4: Fix inclusion flags from package names ===")
INCLUSION_PATTERNS = {
    'has_blood':          r'blood|cbc|เลือด|lab|glucose|fbs|cholesterol|lipid|hba1c|ตรวจเลือด',
    'has_xray':           r'x.?ray|chest|ทรวง|ปอด|xray|เอกซเรย์',
    'has_ultrasound':     r'ultrasound|ultra|อัลตร้า|echo|อัลตราซาวด์|ช่องท้อง|abdom',
    'has_ecg':            r'\becg\b|\bekg\b|electrocardiogram|ไฟฟ้าหัวใจ|คลื่นไฟฟ้า',
    'has_ct':             r'\bct\b|computed tomography|ct scan',
    'has_mri':            r'\bmri\b|magnetic resonance',
    'has_cancer_marker':  r'cancer marker|tumor marker|cea|psa|ca125|afp|มะเร็ง.*marker|marker.*มะเร็ง',
    'has_treadmill':      r'treadmill|stress test|exercise.*ecg|ออกกำลัง.*หัวใจ',
    'has_interpreter':    r'interpreter|english|international|foreign|expat|ล่าม',
}

with conn.cursor() as cur:
    cur.execute("SELECT id, name, category FROM checkup_packages")
    pkgs = cur.fetchall()
    total_updated = 0
    for pkg in pkgs:
        name_lower = (pkg['name'] or '').lower()
        updates = {}
        for col, pattern in INCLUSION_PATTERNS.items():
            if re.search(pattern, name_lower):
                updates[col] = 1
        # Always set blood=1 (every real health checkup has blood tests)
        updates['has_blood'] = 1
        # Category-based defaults
        if pkg['category'] in ('executive', 'comprehensive'):
            if 'has_xray' not in updates:
                updates['has_xray'] = 1
            if 'has_doctor_consult' not in updates:
                updates['has_doctor_consult'] = 1
        if pkg['category'] == 'cancer':
            updates['has_cancer_marker'] = 1
        if pkg['category'] == 'heart':
            updates['has_ecg'] = 1
        if updates:
            set_clause = ', '.join(f"{k}=%s" for k in updates)
            cur.execute(f"UPDATE checkup_packages SET {set_clause} WHERE id=%s",
                       list(updates.values()) + [pkg['id']])
            total_updated += 1
print(f"  Updated flags for {total_updated} packages")

print("\n=== Step 5: Build description/test_list from package name + inclusions ===")
with conn.cursor() as cur:
    cur.execute("""SELECT id, name, category, price, has_blood, has_xray, has_ultrasound,
                          has_ecg, has_ct, has_mri, has_cancer_marker, has_treadmill,
                          has_doctor_consult, has_interpreter
                   FROM checkup_packages""")
    pkgs = cur.fetchall()
    desc_updated = 0
    for pkg in pkgs:
        tests = []
        if pkg['has_blood']: tests.append('Blood panel (CBC, glucose, lipids, liver, kidney)')
        if pkg['has_xray']:  tests.append('Chest X-ray')
        if pkg['has_ultrasound']: tests.append('Abdominal ultrasound')
        if pkg['has_ecg']:   tests.append('ECG (resting)')
        if pkg['has_treadmill']: tests.append('Treadmill stress test')
        if pkg['has_ct']:    tests.append('CT scan')
        if pkg['has_mri']:   tests.append('MRI')
        if pkg['has_cancer_marker']: tests.append('Cancer markers (CEA, AFP, CA125, PSA)')
        if pkg['has_doctor_consult']: tests.append('Doctor consultation')
        if pkg['has_interpreter']: tests.append('English interpreter')

        cat_labels = {
            'basic': 'Basic health screening',
            'standard': 'Standard health checkup',
            'executive': 'Executive/comprehensive health checkup',
            'women': "Women's health checkup",
            'men': "Men's health checkup",
            'cancer': 'Cancer screening package',
            'heart': 'Cardiac/heart checkup',
            'metabolic': 'Metabolic & diabetes screening',
            'senior': 'Senior health checkup (60+)',
            'pre_marriage': 'Pre-marriage health screening',
        }
        cat_label = cat_labels.get(pkg['category'] or '', 'Health checkup package')
        price = float(pkg['price'] or 0)
        desc = f"{cat_label}. Includes: {', '.join(tests)}." if tests else cat_label
        count = len(tests)
        cur.execute("UPDATE checkup_packages SET description=%s, test_count=%s WHERE id=%s",
                   (desc, count, pkg['id']))
        desc_updated += 1
print(f"  Descriptions set for {desc_updated} packages")

print("\n=== Step 6: Verify ===")
with conn.cursor() as cur:
    cur.execute("SELECT category, COUNT(*) n FROM checkup_packages GROUP BY category ORDER BY n DESC")
    print("  Categories:")
    for r in cur.fetchall():
        print(f"    {str(r['category']):<15} {r['n']}")

    cur.execute("""SELECT
        COUNT(*) total,
        SUM(has_blood) blood,
        SUM(has_xray) xray,
        SUM(has_ultrasound) us,
        SUM(has_ecg) ecg,
        SUM(has_ct) ct,
        SUM(has_cancer_marker) cancer
        FROM checkup_packages""")
    r = cur.fetchone()
    print(f"\n  Inclusion flags (/{r['total']}):")
    print(f"    Blood: {r['blood']}, X-ray: {r['xray']}, US: {r['us']}, ECG: {r['ecg']}, CT: {r['ct']}, Cancer: {r['cancer']}")

    cur.execute("SELECT COUNT(*) n FROM checkup_packages WHERE description IS NOT NULL")
    print(f"\n  Descriptions: {cur.fetchone()['n']}")
    cur.execute("SELECT city, COUNT(*) n FROM hospitals GROUP BY city ORDER BY n DESC")
    print(f"\n  Hospitals by city:")
    for r in cur.fetchall():
        print(f"    {r['city']}: {r['n']}")

conn.close()
print("\nDONE")
