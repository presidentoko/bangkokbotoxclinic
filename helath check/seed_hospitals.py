"""
Seed hospitals into bkkcheckup DB.
POC_ONLY=True → only Bumrungrad + Bangkok Hospital (2 hospitals).
Set POC_ONLY=False to insert the full list.
"""
import pymysql
from config import DB_CONFIG

POC_ONLY = False

HOSPITALS = [
    # ── flagship Bangkok ──────────────────────────────────────────────────
    dict(
        name="Bumrungrad International Hospital",
        name_th="โรงพยาบาลบำรุงราษฎร์ อินเตอร์เนชั่นแนล",
        slug="bumrungrad",
        tier="flagship",
        area="Sukhumvit",
        jci=1,
        checkup_url="https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages",
        gbp_place_id=None,
    ),
    dict(
        name="Bangkok Hospital (BDMS HQ)",
        name_th="โรงพยาบาลกรุงเทพ",
        slug="bangkok-hospital",
        tier="flagship",
        area="Phetchaburi",
        jci=1,
        checkup_url="https://www.bangkokhospital.com/en/bangkok/package/health-check-up-packages",
        gbp_place_id=None,
    ),
    # ── remaining flagship (added after PoC) ─────────────────────────────
    dict(
        name="Samitivej Hospital Sukhumvit",
        name_th="โรงพยาบาลสมิติเวช สุขุมวิท",
        slug="samitivej-sukhumvit",
        tier="flagship",
        area="Sukhumvit",
        jci=1,
        checkup_url="https://www.samitivejhospitals.com/page/checkup-package",
        gbp_place_id=None,
    ),
    dict(
        name="Samitivej Hospital Srinakarin",
        name_th="โรงพยาบาลสมิติเวช ศรีนครินทร์",
        slug="samitivej-srinakarin",
        tier="flagship",
        area="Srinakarin",
        jci=1,
        checkup_url="https://www.samitivejhospitals.com/package/detail/annual-health-check-up-packages-samitivej-srinakarin",
        gbp_place_id=None,
    ),
    dict(
        name="Vejthani Hospital",
        name_th="โรงพยาบาลเวชธานี",
        slug="vejthani",
        tier="flagship",
        area="Ramkhamhaeng",
        jci=1,
        checkup_url="https://www.vejthani.com/packages-and-programs/health-check-up-program/",
        gbp_place_id=None,
    ),
    dict(
        name="MedPark Hospital",
        name_th="โรงพยาบาลเมดพาร์ค",
        slug="medpark",
        tier="flagship",
        area="Rama IV",
        jci=0,
        checkup_url="https://www.medparkhospital.com/en-US/center-and-specialty/health-screening-center",
        gbp_place_id=None,
    ),
    dict(
        name="BNH Hospital",
        name_th="โรงพยาบาล บีเอ็นเอช",
        slug="bnh",
        tier="flagship",
        area="Silom",
        jci=1,
        checkup_url="https://www.bnhhospital.com/package-promotion/annual-check-up-programmes/",
        gbp_place_id=None,
    ),
    dict(
        name="Praram 9 Hospital",
        name_th="โรงพยาบาลพระราม 9",
        slug="praram9",
        tier="flagship",
        area="Praram 9",
        jci=0,
        checkup_url="https://pr9shop.praram9.com/en/product-category/health-check-up/",
        gbp_place_id=None,
    ),
    dict(
        name="Phyathai 1 Hospital",
        name_th="โรงพยาบาลพญาไท 1",
        slug="phyathai-1",
        tier="mid",
        area="Phayathai",
        jci=0,
        checkup_url="https://www.phyathai.com/en/pyt1/center/pyt1-center-28",
        gbp_place_id=None,
    ),
    dict(
        name="Phyathai 2 Hospital",
        name_th="โรงพยาบาลพญาไท 2",
        slug="phyathai-2",
        tier="mid",
        area="Phetchaburi",
        jci=0,
        checkup_url="https://www.phyathai.com/en/pyt2/center/pyt2-center-32",
        gbp_place_id=None,
    ),
    dict(
        name="Phyathai 3 Hospital",
        name_th="โรงพยาบาลพญาไท 3",
        slug="phyathai-3",
        tier="mid",
        area="Nonthaburi",
        jci=0,
        checkup_url="https://www.phyathai.com/en/pyt3/package",
        gbp_place_id=None,
    ),
    # ── mid / provincial ─────────────────────────────────────────────────
    dict(
        name="Sikarin Hospital",
        name_th="โรงพยาบาลศิครินทร์",
        slug="sikarin",
        tier="mid",
        area="Bangna",
        jci=0,
        checkup_url="https://www.sikarin.com/package-and-promotion",
        gbp_place_id=None,
    ),
    dict(
        name="Bangpakok 9 International Hospital",
        name_th="โรงพยาบาลบางปะกอก 9 อินเตอร์เนชั่นแนล",
        slug="bangpakok9",
        tier="mid",
        area="Bangpakok",
        jci=0,
        checkup_url="https://bpk9internationalhospital.com/en/package/content/Health_Check-Up_Programs",
        gbp_place_id=None,
    ),
    dict(
        name="Vibhavadi Hospital",
        name_th="โรงพยาบาลวิภาวดี",
        slug="vibhavadi",
        tier="mid",
        area="Chatuchak",
        jci=0,
        checkup_url="https://www.vibhavadi.com/en/health-checkup",
        gbp_place_id=None,
    ),
    dict(
        name="Thonburi Hospital",
        name_th="โรงพยาบาลธนบุรี",
        slug="thonburi",
        tier="mid",
        area="Thonburi",
        jci=0,
        checkup_url="https://www.thonburihospital.com/en/package/pk_health_check/",
        gbp_place_id=None,
    ),
    dict(
        name="Bangkok Hospital Phuket",
        name_th="โรงพยาบาลกรุงเทพ ภูเก็ต",
        slug="bangkok-phuket",
        tier="flagship",
        area="Phuket",
        jci=1,
        checkup_url="https://www.bangkokhospital.com/en/phuket/package/health-check-up-packages-bpk",
        gbp_place_id=None,
    ),
    dict(
        name="Chiangmai Ram Hospital",
        name_th="โรงพยาบาลเชียงใหม่ราม",
        slug="chiangmai-ram",
        tier="mid",
        area="Chiang Mai",
        jci=0,
        checkup_url="https://www.chiangmairam.com/readpackage/138",
        gbp_place_id=None,
    ),
]

POC_SLUGS = {"bumrungrad", "bangkok-hospital"}


def main():
    rows = HOSPITALS if not POC_ONLY else [h for h in HOSPITALS if h["slug"] in POC_SLUGS]
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        sql = """
            INSERT IGNORE INTO hospitals
              (name, name_th, slug, tier, area, jci, checkup_url, gbp_place_id)
            VALUES
              (%(name)s, %(name_th)s, %(slug)s, %(tier)s, %(area)s,
               %(jci)s, %(checkup_url)s, %(gbp_place_id)s)
        """
        cur.executemany(sql, rows)
    conn.close()
    print(f"Seeded {len(rows)} hospital(s).")


if __name__ == "__main__":
    main()
