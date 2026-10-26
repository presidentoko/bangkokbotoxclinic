#!/usr/bin/env python3
"""
web-petbkk/data/clinic-prices.json — prices clinics publish on their own
websites, read and checked by hand.

WHY

"How much is it to neuter a cat" is the question Thai owners ask most and the
one nobody answers: the 19,022 reviews name a neutering price 29 times across
the whole country, spread 350-7,000 baht, too thin and too mixed to publish.
The clinics' own sites are the honest source. Of the 79 clinic domains we hold,
15 publish service prices somewhere — most on a page the homepage does not link
to, found through the site's sitemap — covering 43 clinics once chain branches
are counted. The big chains that publish nothing (Kachavet, Vetville and
others) are simply absent; that is the state of the market, not a gap in the
crawl, and the page says so.

WHY BY HAND

These are not comparable numbers until someone reads what each one includes.
Talingchan's cat neuter is 3,000 baht before 7% VAT, an 80 baht hospital fee
and a 2,500-3,000 baht pre-op blood test; UVET's 4,300 includes everything;
Pet Friends' 5,500 includes three nights' stay. A scraper that put those three
numbers side by side would be publishing a lie with correct digits. So every
entry below was read on the source page and carries:

  kind      list (the stated price) / promo (time-limited or discounted, with
            the regular price when given) / from (a starting price) / range
  includes  what the clinic says is in it, in its own terms
  excludes  what it says is not
  url       the page it came from
  quote     the passage, so the number can be checked against its context

`--verify` refetches every source page and fails if the quoted figure is no
longer on it. Run it before any rebuild: a clinic changing its price must not
leave this site showing the old one with a "checked" date on it.

Chain prices (Thonglor, Arak, UVET) are attached to every branch the chain's
domain covers and are labelled as the chain's published price, since a branch
can differ.

Usage:
    python -m petvet.clinic_prices --verify
    python -m petvet.clinic_prices
"""
from __future__ import annotations

import argparse
import html
import json
import re
import ssl
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web-petbkk" / "data"
OUT = WEB / "clinic-prices.json"
CHECKED = "2026-10-23"

# Service keys the comparison page lines up. Anything else is kept per clinic
# but not compared, because nothing else is offered in comparable form.
SERVICES = {
    "neuter_cat_m": "ทำหมันแมวตัวผู้",
    "neuter_cat_f": "ทำหมันแมวตัวเมีย",
    "neuter_dog_m": "ทำหมันสุนัขตัวผู้",
    "neuter_dog_f": "ทำหมันสุนัขตัวเมีย",
    "neuter_rabbit_m": "ทำหมันกระต่ายตัวผู้",
    "neuter_rabbit_f": "ทำหมันกระต่ายตัวเมีย",
    "vaccine_cat_combo": "วัคซีนรวมแมว",
    "vaccine_dog_combo": "วัคซีนรวมสุนัข",
    "vaccine_rabies": "วัคซีนพิษสุนัขบ้า",
    "vaccine_first_year": "โปรแกรมวัคซีนปีแรก",
    "checkup": "แพ็กเกจตรวจสุขภาพ",
    "dental": "ขูดหินปูน",
    "other": "อื่น ๆ",
}

E = lambda **k: k  # noqa: E731 — reads as a record literal below

SOURCES = [
    {
        "domain": "talingchanpet.net", "name": "โรงพยาบาลสัตว์ตลิ่งชัน",
        "items": [
            E(service="neuter_cat_m", price=3000, kind="list",
              includes="ผ่าตัด ค่าสัตวแพทย์ ดมยาสลบ", excludes="VAT 7%, ค่าบริการโรงพยาบาล 80 บาท, ตรวจเลือดก่อนผ่าตัด 2,500–3,000 บาท",
              url="https://www.talingchanpet.net/package-dog-cat/", quote="แมวเพศผู้ 3,000 บาท"),
            E(service="neuter_cat_f", price=4000, kind="list",
              includes="ผ่าตัด ค่าสัตวแพทย์ ดมยาสลบ", excludes="VAT 7%, ค่าบริการโรงพยาบาล 80 บาท, ตรวจเลือดก่อนผ่าตัด 2,500–3,000 บาท",
              url="https://www.talingchanpet.net/package-dog-cat/", quote="แมวเพศเมีย 4,000 บาท"),
            E(service="neuter_dog_m", price=6500, kind="list", note="น้ำหนัก 1–10 กก.",
              includes="ผ่าตัด ค่าสัตวแพทย์ ดมยาสลบ", excludes="VAT 7%, ค่าบริการโรงพยาบาล 80 บาท, ตรวจเลือดก่อนผ่าตัด 3,000–3,200 บาท",
              url="https://www.talingchanpet.net/", quote="1-10 KG. 6,500 บาท 7,000 บาท"),
            E(service="neuter_dog_f", price=7000, kind="list", note="น้ำหนัก 1–10 กก.",
              includes="ผ่าตัด ค่าสัตวแพทย์ ดมยาสลบ", excludes="VAT 7%, ค่าบริการโรงพยาบาล 80 บาท, ตรวจเลือดก่อนผ่าตัด 3,000–3,200 บาท",
              url="https://www.talingchanpet.net/", quote="1-10 KG. 6,500 บาท 7,000 บาท"),
            E(service="neuter_rabbit_m", price=3000, kind="list",
              includes="ผ่าตัด ค่าสัตวแพทย์ ดมยาสลบ", excludes="ตรวจเลือดก่อนผ่าตัด 2,560 บาท, ค่าบริการโรงพยาบาล 80 บาท, เวชภัณฑ์ 250 บาท, VAT",
              url="https://www.talingchanpet.net/sterilization-of-rabbits/", quote="ทำหมันเพศผู้ 3,000 บาท"),
            E(service="neuter_rabbit_f", price=4000, kind="list",
              includes="ผ่าตัด ค่าสัตวแพทย์ ดมยาสลบ", excludes="ตรวจเลือดก่อนผ่าตัด 2,560 บาท, ค่าบริการโรงพยาบาล 80 บาท, เวชภัณฑ์ 250 บาท, VAT",
              url="https://www.talingchanpet.net/sterilization-of-rabbits/", quote="ทำหมันเพศเมีย 4,000 บาท"),
        ],
    },
    {
        "domain": "uvethospital.com", "name": "โรงพยาบาลสัตว์ยูเว็ท", "chain": True,
        "items": [
            E(service="neuter_cat_m", price=4300, kind="from", includes="แพ็กเกจรวมค่าใช้จ่ายทั้งหมดในการทำหมัน",
              url="https://www.uvethospital.com/post/cat-neutering", quote="แมวตัวผู้ ราคาเริ่มต้น 4,300 บาท"),
            E(service="neuter_cat_f", price=5300, kind="from", includes="แพ็กเกจรวมค่าใช้จ่ายทั้งหมดในการทำหมัน",
              url="https://www.uvethospital.com/post/cat-neutering", quote="แมวตัวเมีย ราคาเริ่มต้น 5,300 บาท"),
            E(service="neuter_dog_m", price=5000, kind="from", note="ประมาณการ ขึ้นกับเพศ ขนาด น้ำหนัก",
              url="https://www.uvethospital.com/post/dog-neutering", quote="เริ่มต้นประมาณ 5,000 บาทขึ้นไป"),
        ],
    },
    {
        "domain": "2h2cvet.com", "name": "หมาดีใจ แมวใจดี",
        "items": [
            E(service="neuter_cat_m", price=2790, regular=3990, kind="promo",
              url="https://2h2cvet.com/package/ทำหมันพร้อมขูดหินปูน-จบ/", quote="เพศผู้ 3,990฿ 2,790฿"),
            E(service="neuter_dog_m", price=2790, regular=3990, kind="promo", note="ไม่เกิน 5 กก.",
              includes="ตรวจร่างกาย ตรวจเลือดชุดใหญ่ ดมยาสลบด้วยเครื่อง ผ่าตัด",
              url="https://2h2cvet.com/package/โปรแกรมทำหมันน้องหมา-ลด/", quote="เพศผู้ ไม่เกิน 5 กก. จาก 3,990฿"),
            E(service="vaccine_first_year", price=1990, kind="list", note="ลูกสุนัข ครบโปรแกรมปีแรก",
              url="https://2h2cvet.com/package/โปรแกรมวัคซีนขวบปีแรก-ค/", quote="ลูกสุนัข 1,990฿"),
            E(service="vaccine_first_year", price=2690, kind="list", note="ลูกแมว รวมวัคซีนลิวคีเมียและชุดตรวจ",
              url="https://2h2cvet.com/package/โปรแกรมวัคซีนขวบปีแรก-ค/", quote="ลูกแมว 2,690฿"),
        ],
    },
    {
        "domain": "petfriendshospital.com", "name": "โรงพยาบาลสัตว์เพ็ทเฟรนด์ส",
        "items": [
            E(service="neuter_cat_m", price=5500, kind="list", includes="ที่พัก 3 วัน และฝากดูแล",
              url="https://www.petfriendshospital.com/allpackage/spaycatpackage", quote="เพศผู้ราคา 5,500 บาท"),
            E(service="neuter_cat_f", price=7500, kind="list", includes="ที่พัก 3 วัน และฝากดูแล",
              url="https://www.petfriendshospital.com/allpackage/spaycatpackage", quote="เพศเมียราคา 7,500 บาท"),
            E(service="neuter_dog_m", price=9000, kind="list", note="ไม่เกิน 20 กก.", includes="ที่พัก 3 วัน และฝากดูแล",
              url="https://www.petfriendshospital.com/allpackage/spaydogpackage", quote="ราคา 9,000 บาท"),
            E(service="neuter_dog_f", price=11000, kind="list", note="ไม่เกิน 20 กก.", includes="ที่พัก 3 วัน และฝากดูแล",
              url="https://www.petfriendshospital.com/allpackage/spaydogpackage", quote="ราคา 11,000 บาท"),
            E(service="vaccine_first_year", price=3750, kind="list", note="สุนัขวัยเด็ก ไม่มีบวกเพิ่ม",
              url="https://www.petfriendshospital.com/allpackage/vaccine-package", quote="สำหรับสุนัข ราคา 3,750 บาท"),
            E(service="vaccine_first_year", price=3450, kind="list", note="แมววัยเด็ก ไม่มีบวกเพิ่ม",
              url="https://www.petfriendshospital.com/allpackage/vaccine-package", quote="สำหรับแมว ราคา 3,450 บาท"),
            E(service="checkup", price=3850, kind="list", note="สุนัขแรกรับ 14 รายการ",
              url="https://www.petfriendshospital.com/allpackage/checkupcatdog", quote="14 รายการ ราคา 3,850 บาท"),
            E(service="checkup", price=4850, kind="list", note="แมวแรกรับ 13 รายการ",
              url="https://www.petfriendshospital.com/allpackage/checkupcatdog", quote="13 รายการ ราคา 4,850 บาท"),
        ],
    },
    {
        "domain": "happypet-hospital.com", "name": "โรงพยาบาลสัตว์แฮปปี้เพ็ท", "also": ["happypet-th.com"],
        "items": [
            E(service="neuter_cat_m", price=6000, kind="promo", note="โปรโมชั่น ก.พ.–ต.ค.",
              includes="ตรวจเลือดก่อนผ่าตัด ยาสลบ ผ่าตัด ยาหลังผ่าตัด ชุดหรือปลอกคอกันเลีย",
              url="https://happypet-hospital.com/packages-events", quote="ตัวผู้ 6,000 บาท"),
            E(service="neuter_cat_f", price=7500, kind="promo", note="โปรโมชั่น ก.พ.–ต.ค.",
              includes="ตรวจเลือดก่อนผ่าตัด ยาสลบ ผ่าตัด ยาหลังผ่าตัด ชุดหรือปลอกคอกันเลีย",
              url="https://happypet-hospital.com/packages-events", quote="ตัวเมีย 7,500 บาท"),
            E(service="vaccine_dog_combo", price=299, kind="promo", note="ถึง 31 ต.ค. 2569", includes="ค่าคุณหมอและพยาบาล",
              url="https://happypet-hospital.com/", quote="ราคาเพียง 299 บาท"),
            E(service="vaccine_cat_combo", price=570, kind="from",
              url="https://happypet-hospital.com/services", quote="฿570"),
            E(service="vaccine_rabies", price=390, kind="from",
              url="https://happypet-hospital.com/services", quote="฿390"),
            E(service="checkup", price=1990, regular=2860, kind="promo", note="แพ็กเกจ Happy New Friend",
              url="https://happypet-hospital.com/packages-events", quote="1,990 บาท (จากปกติ 2,860 บาท)"),
        ],
    },
    {
        "domain": "thonglorpet.com", "name": "โรงพยาบาลสัตว์ทองหล่อ", "chain": True,
        "items": [
            E(service="vaccine_cat_combo", price=690, kind="list", note="วัคซีนรวมแมว 3 โรค (FVRCP)",
              url="https://www.thonglorpet.com/petdiary/cat-vaccine-schedule-price-guide", quote="690 บาท"),
            E(service="vaccine_rabies", price=490, kind="list",
              url="https://www.thonglorpet.com/petdiary/cat-vaccine-schedule-price-guide", quote="490 บาท"),
            E(service="dental", price=2500, price_max=4000, kind="range", note="แมว ขูดหินปูน + ยาสลบ ราคาโดยประมาณ",
              excludes="Dental X-ray 1,000–2,000 บาท, ตรวจเลือดก่อนยาสลบ 800–1,500 บาท",
              url="https://www.thonglorpet.com/petdiary/cat-dental-scaling-price-guide", quote="2,500–4,000 บาท"),
        ],
    },
    {
        "domain": "arakanimal.com", "name": "โรงพยาบาลสัตว์อารักษ์", "chain": True,
        "items": [
            E(service="vaccine_dog_combo", price=764, kind="list", note="หมา-แมว",
              url="https://www.arakanimal.com/packages", quote="764 บาท"),
            E(service="vaccine_cat_combo", price=764, kind="list", note="หมา-แมว",
              url="https://www.arakanimal.com/packages", quote="764 บาท"),
            E(service="checkup", price=2000, kind="from", note="สาขาทองหล่อ",
              url="https://www.arakanimal.com/packages", quote="2,000 บาท"),
        ],
    },
    {
        "domain": "hanaanimalhospital.com", "name": "โรงพยาบาลสัตว์ฮานะ",
        "items": [
            E(service="neuter_cat_m", price=1300, kind="list", excludes="ชุดตรวจก่อนผ่าตัดแบบละเอียด +490 บาท (ชุดมาตรฐานรวมแล้ว)",
              url="https://hanaanimalhospital.com/services/", quote="แมวเพศผู้ 1,300 บาท"),
            E(service="neuter_dog_m", price=2700, kind="from",
              url="https://hanaanimalhospital.com/services/", quote="สุนัขเพศผู้เริ่ม 2,700 บาท"),
        ],
    },
    {
        "domain": "animalspacehospital.com", "name": "Animal Space",
        "items": [
            E(service="neuter_rabbit_m", price=3000, kind="list", excludes="ค่าบริการทางการแพทย์และค่าโรงพยาบาล",
              url="https://animalspacehospital.com/our-services/sterilization/", quote="3,000 บาท"),
            E(service="neuter_rabbit_f", price=4000, kind="list", excludes="ค่าบริการทางการแพทย์และค่าโรงพยาบาล",
              url="https://animalspacehospital.com/our-services/sterilization/", quote="4,000 บาท"),
            E(service="checkup", price=999, kind="from", note="สัตว์ Exotic, Starter (มี 1,399 / 2,199)", includes="VAT ค่าแพทย์ และค่าโรงพยาบาล",
              url="https://animalspacehospital.com/our-services/annual-health-check/", quote="999 บาท"),
            E(service="other", price=1500, kind="from", note="ทำหมันชูการ์ไกลเดอร์ตัวผู้",
              url="https://animalspacehospital.com/our-services/sterilization/", quote="1,500 บาท"),
        ],
    },
    {
        "domain": "doisaketpet.com", "name": "โรงพยาบาลสัตว์ดอยสะเก็ด",
        "items": [
            E(service="vaccine_dog_combo", price=350, kind="from", note="วัคซีนหลัก สุนัขและแมว",
              url="https://doisaketpet.com/prices", quote="เริ่ม ฿350"),
            E(service="vaccine_cat_combo", price=350, kind="from", note="วัคซีนหลัก สุนัขและแมว",
              url="https://doisaketpet.com/prices", quote="เริ่ม ฿350"),
            E(service="checkup", price=1200, kind="from", note="ตรวจสุขภาพประจำปี",
              url="https://doisaketpet.com/prices", quote="เริ่ม ฿1,200"),
        ],
    },
    {
        "domain": "utmost-pet.com", "name": "โรงพยาบาลสัตว์แอทโมส",
        "items": [
            E(service="checkup", price=1599, kind="from",
              url="https://www.utmost-pet.com/package-promotion/health-check-2/", quote="1,599 บาท"),
        ],
    },
    {
        "domain": "slv.co.th", "name": "SLV Pet Hospital",
        "items": [
            E(service="checkup", price=990, kind="from",
              url="https://www.slv.co.th/slv-best-package/", quote="990 บาท"),
        ],
    },
    {
        "domain": "phyathai7pet.com", "name": "โรงพยาบาลสัตว์พญาไท 7",
        "items": [
            # Same three prices for dogs and cats; the contents differ slightly
            # (FeLV/FIV for cats, parvo/distemper for dogs). Both branches.
            E(service="checkup", price=2222, kind="list", note="Junior Package ลูกแมว/ลูกสุนัขอายุน้อยกว่า 1 ปี",
              includes="ตรวจร่างกาย CBC ตรวจอุจจาระ คัดกรองไวรัส (แมว FeLV/FIV, สุนัข พาร์โว/ไข้หัด) ภาษีและค่าบริการ",
              url="https://www.phyathai7pet.com/health-package/cat-health-check-package", quote="2,222 บาท"),
            E(service="checkup", price=3777, kind="list", note="Adult Package อายุ 1–6 ปี",
              includes="ตรวจร่างกาย ตรวจเลือด ตรวจอุจจาระ X-ray ทรวงอกและช่องท้อง ภาษีและค่าบริการ",
              url="https://www.phyathai7pet.com/health-package/cat-health-check-package", quote="3,777 บาท"),
            E(service="checkup", price=6666, kind="list", note="Senior Package อายุ 7 ปีขึ้นไป",
              includes="ทุกรายการของ Adult + SDMA (ไต) T4 คอเลสเตอรอล ตรวจหัวใจโดยทีมโรคหัวใจ ภาษีและค่าบริการ",
              url="https://www.phyathai7pet.com/health-package/cat-health-check-package", quote="6,666 บาท"),
        ],
    },
]

ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE


def fetch_text(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    safe = urllib.parse.urlunsplit(parts._replace(path=urllib.parse.quote(parts.path)))
    req = urllib.request.Request(safe, headers={"User-Agent": "Mozilla/5.0 (compatible; ThailandPetHubPriceCheck/1.0)"})
    h = urllib.request.urlopen(req, timeout=20, context=ctx).read().decode("utf-8", "ignore")
    h = re.sub(r"<(script|style)\b.*?</\1>", " ", h, flags=re.S | re.I)
    h = re.sub(r"<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h))


def norm(s: str) -> str:
    return re.sub(r"\s+", "", s)


def verify() -> int:
    cache: dict[str, str] = {}
    bad = 0
    total = 0
    for src in SOURCES:
        for it in src["items"]:
            total += 1
            u = it["url"]
            if u not in cache:
                try:
                    cache[u] = norm(fetch_text(u))
                except Exception as e:  # noqa: BLE001
                    cache[u] = ""
                    print(f"  FETCH FAIL {u}: {e}")
            page = cache[u]
            quote_ok = norm(it["quote"]) in page
            digits = f"{it['price']:,}"
            price_ok = digits in page or str(it["price"]) in page
            if not (quote_ok and price_ok):
                bad += 1
                print(f"  MISMATCH {src['domain']} {it['service']} {it['price']}: quote={'ok' if quote_ok else 'MISSING'} price={'ok' if price_ok else 'MISSING'}")
    print(f"verified {total - bad}/{total} entries against their source pages")
    return 1 if bad else 0


def build() -> int:
    hospitals = json.loads((WEB / "hospitals.json").read_text(encoding="utf-8"))
    excluded = set(json.loads((WEB / "hospital-excluded.json").read_text(encoding="utf-8"))["excluded"])
    host = lambda u: urllib.parse.urlparse(u).netloc.lower().removeprefix("www.")  # noqa: E731
    by_domain: dict[str, list[str]] = {}
    for h in hospitals:
        if h["id"] in excluded or not h.get("website"):
            continue
        by_domain.setdefault(host(h["website"]), []).append(h["id"])

    clinics: dict[str, list[dict]] = {}
    sources_out = []
    for src in SOURCES:
        domains = [src["domain"], *src.get("also", [])]
        ids = sorted({i for d in domains for i in by_domain.get(d, [])})
        items = [{**it, "service_th": SERVICES[it["service"]]} for it in src["items"]]
        sources_out.append({"domain": src["domain"], "name": src["name"], "chain": bool(src.get("chain")),
                            "clinics": ids, "items": items})
        for i in ids:
            clinics.setdefault(i, []).extend({**it, "source": src["domain"], "chain": bool(src.get("chain"))} for it in items)

    payload = {
        "checked": CHECKED,
        "note": ("Prices published by the clinics on their own websites, read by hand and "
                 "re-checked against the source page. What a price includes differs between "
                 "clinics and is stated with each figure."),
        "services": SERVICES,
        "sources": sources_out,
        "clinics": dict(sorted(clinics.items())),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"sources {len(sources_out)}  clinics {len(clinics)}  items {sum(len(s['items']) for s in SOURCES)}")
    for s in sources_out:
        print(f"  {len(s['clinics']):>2} clinics  {s['domain']}")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify", action="store_true")
    a = ap.parse_args()
    sys.exit(verify() if a.verify else build())
