# -*- coding: utf-8 -*-
"""Builds cosmetics/web/data/brand_th.json — English brand -> Thai spelling.

Source of truth is the Thai `description` copy already in master_db.json, so
the spellings are the ones Konvy's own Thai writers use, not transliterations
invented here. Three layers, later ones win:

  1. mined  — "จาก<Brand>" anchor, plus a stricter plain n-gram fallback.
  2. BLOCK  — audited false positives (the text after จาก was a material or
              origin: PWP->"silk", GPO+->"Japan", Colgate->"Optic", ...).
  3. OVERRIDE — hand-written only for brands whose Thai spelling is
              unambiguous and widely published (global brands and the ones the
              miner truncated). Obscure Thai-local brands are deliberately
              left out rather than guessed.

Re-run after a master_db refresh:  python build_brand_th.py
"""
import json, re, collections, os

WEB = os.path.abspath(os.path.join(os.path.dirname(__file__)))
DB = "data/master_db.json"
OUT = "data/brand_th.json"

d = json.load(open(DB, encoding="utf-8"))
prods = list(d["products"].values())

THAI = r"฀-๿"
AFTER_JAK = re.compile(rf"จาก([{THAI}]+(?:\s+[{THAI}]+){{0,2}})")
THAI_RUN = re.compile(rf"[{THAI}]+")

DESCRIPTOR_STEMS = [
    "ช่วย", "ลด", "ผิว", "สิว", "เนื้อ", "ด้วย", "บางเบา", "ซึมซาบ", "เกลี่ย",
    "ปัจจัย", "ปัญหา", "การ", "ความ", "สูตร", "มอบ", "พร้อม", "ทำให้", "ที่",
    "ป้องกัน", "บำรุง", "ฟื้น", "รอย", "ริ้ว", "ขนาด", "สี", "กระ", "ฝ้า",
    "หน้า", "รับมือ", "ผสาน", "ดูดซับ", "ปกปิด", "ดีไซน์", "น่ารัก", "ไม่มี",
    "รุ่นใหม่", "สะอาด", "ชุ่มชื้น", "กระจ่างใส", "อ่อนโยน", "ประสิทธิภาพ",
    "สารสกัด", "ธรรมชาติ", "วิตามิน", "เข้มข้น", "อุดม", "คุณค่า", "แล็บ",
    "มั่นใจ", "แผล", "โกลว์", "และ", "ผลิตภัณฑ์", "เสริมอาหาร", "ทุกมุม",
]

# A mined string that is an ordinary Thai descriptor is not a brand name.
# "Mee" mined to "แพ้ง่าย" ("sensitive/allergic"), which then shipped as
# "Mee (แพ้ง่าย) ดีไหม?" on the live brand page and, once the Pantip collector
# started matching on these spellings, filed every "sensitive skin" thread
# under the brand Mee.
_NOT_A_BRAND = {
    "แพ้ง่าย", "ผิวแพ้ง่าย", "ผิวมัน", "ผิวแห้ง", "ผิวผสม", "ผิวหน้า",
    "หน้าใส", "ผิวขาว", "ธรรมชาติ", "สิว", "ฝ้า", "กระ", "รอยดำ",
    "ครีม", "เซรั่ม", "โลชั่น", "กันแดด", "ของแท้", "ราคาถูก", "รีวิว",
}

BLOCK = {
    # text after จาก was a material / ingredient / country, not the brand
    "PWP", "So Glam", "Happy To The Skin", "ISNTREE", "benutra", "GPO+",
    "UTENA", "Tea Tree", "BLACKMORES", "SKIN1004", "Colgate", "DODODOTS",
    "Hiruscar", "MEDICUBE", "GALA CAMILLE", "Neil", "Koreaeundan", "Vida",
    # mined string is a bare initial or too generic to disambiguate
    "Y.O.U", "ES", "SOS", "KA", "Chubby", "Konvy",
}

# Unambiguous, widely published spellings. Kept small on purpose.
OVERRIDE = {
    "La Roche Posay": "ลา โรช โพเซย์",
    "Cathy Doll": "เคที่ ดอลล์",
    "CLEAR NOSE": "เคลียร์โนส",
    "Garnier": "การ์นิเย่",
    "OLD ROCK": "โอลด์ร็อค",
    "Glad2Glow": "แกลดทูโกลว์",
    "ACNE-AID": "แอคเน่ เอด",
    "DHC": "ดีเอชซี",
    "Cetaphil": "เซตาฟิล",
    "SK-II": "เอสเคทู",
    "Colgate": "คอลเกต",
    "BLACKMORES": "แบลคมอร์ส",
    "SKIN1004": "สกิน 1004",
    "Hiruscar": "ฮีรูสการ์",
    "MEDICUBE": "เมดิคิวบ์",
    "Dr.G": "ดอกเตอร์จี",
    "Vaseline": "วาสลีน",
    "Eucerin": "ยูเซอริน",
    "Neutrogena": "นูโทรจีนา",
    "Bioderma": "ไบโอเดอร์มา",
    "Innisfree": "อินนิสฟรี",
    "Shiseido": "ชิเซโด้",
    "Estee Lauder": "เอสเต ลอเดอร์",
    "Lancome": "ลังโคม",
    "Clinique": "คลีนิกข์",
    "Kiehls": "คีลส์",
    "La Mer": "ลาแมร์",
    "Dior": "ดิออร์",
    "NARS": "นาร์ส",
    "Maybelline New York": "เมย์เบลลีน นิวยอร์ก",
    "LOreal Paris": "ลอรีอัล ปารีส",
    "Etude": "อีทูดี้",
    "Beauty Of Joseon": "บิวตี้ ออฟ โจซอน",
    "COSRX": "คอสอาร์เอ็กซ์",
    "SOME BY MI": "ซัมบายมี",
    "Anessa": "อเนสซ่า",
    "Biore": "บิโอเร",
    "Senka": "เซนกะ",
    "KOSE": "โคเซ่",
    "Curel": "คิวเรล",
    "Hada Labo": "ฮาดะ ลาโบะ",
    "CeraVe": "เซราวี",
    "NIVEA": "นีเวีย",
    "Srichand": "ศรีจันทร์",
    "Yanhee": "ยันฮี",
}


def is_descriptor(tok):
    return any(s in tok for s in DESCRIPTOR_STEMS)


def en_word_cap(brand):
    words = [w for w in re.split(r"[^A-Za-z0-9]+", brand) if w]
    return max(1, min(3, len(words)))


by_brand = collections.defaultdict(list)
for p in prods:
    b = (p.get("brand") or "").strip()
    ds = str(p.get("description") or "")
    if b and ds:
        by_brand[b].append(ds)


def mine(extract, min_cover, min_purity):
    gdf = collections.Counter()
    per = []
    for p in prods:
        cands = extract(str(p.get("description") or ""))
        per.append(((p.get("brand") or "").strip(), cands))
        for c in cands:
            gdf[c] += 1
    bc = collections.defaultdict(collections.Counter)
    for b, cands in per:
        for c in cands:
            bc[b][c] += 1
    res = {}
    for brand, descs in by_brand.items():
        n, cap = len(descs), en_word_cap(brand)
        best = None
        for cand, c in bc[brand].items():
            toks = cand.split()
            if len(toks) > cap or "จาก" in cand:
                continue
            flat = cand.replace(" ", "")
            if len(flat) < 3 or len(flat) > 26:
                continue
            cover, purity = c / n, c / gdf[cand]
            if cover < (min_cover if n >= 2 else 1.0) or purity < min_purity:
                continue
            key = (len(toks), round(cover * purity, 3), c)
            if best is None or key > best[0]:
                best = (key, cand)
        if best:
            res[brand] = best[1]
    return res


def extract_jak(ds):
    out = set()
    for m in AFTER_JAK.finditer(ds):
        toks = m.group(1).split()
        for k in (1, 2, 3):
            if len(toks) < k or is_descriptor(toks[k - 1]):
                break
            out.add(" ".join(toks[:k]))
    return out


def extract_plain(ds):
    toks = THAI_RUN.findall(ds)
    out = set()
    for i, t in enumerate(toks):
        if is_descriptor(t):
            continue
        out.add(t)
        if i + 1 < len(toks) and not is_descriptor(toks[i + 1]):
            out.add(t + " " + toks[i + 1])
    return out


final = mine(extract_plain, 0.6, 0.95)
final.update(mine(extract_jak, 0.5, 0.8))
for k in BLOCK:
    final.pop(k, None)

# A brand string that already carries its own Thai name ("Chaonang เจ้านาง").
for brand in by_brand:
    thai_in_name = " ".join(THAI_RUN.findall(brand)).strip()
    if thai_in_name and len(thai_in_name) >= 3:
        final[brand] = thai_in_name

for k, v in OVERRIDE.items():
    if k in by_brand:
        final[k] = v

# Drop entries that are empty, identical to the English brand, or an ordinary
# Thai descriptor rather than a name.
final = {
    k: v.strip()
    for k, v in final.items()
    if v.strip() and v.strip() not in _NOT_A_BRAND and v.strip().lower() != k.strip().lower()
}

json.dump(final, open(OUT, "w", encoding="utf-8"),
          ensure_ascii=False, indent=1, sort_keys=True)

covered = sum(len(by_brand[x]) for x in final)
print(f"brands: {len(final)} / {len(by_brand)}")
print(f"products covered: {covered} / {len(prods)}  ({covered/len(prods)*100:.1f}%)")
missing = sorted(((x, len(by_brand[x])) for x in by_brand if x not in final),
                 key=lambda z: -z[1])
print("uncovered products:", sum(n for _, n in missing))
print("top uncovered brands:", ", ".join(f"{b}({n})" for b, n in missing[:12]))
