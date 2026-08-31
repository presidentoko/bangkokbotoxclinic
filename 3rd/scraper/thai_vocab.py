"""The shorthand Thai dealers write their listings in.

Every one of the 2,879 listings this site reads is titled in English —
"Used Like New Chanel Classic 10" Caviar GHW Microchip Full Set no receipt" —
while the people searching for them type Thai. That gap is the reason this
file exists. Somebody sees a reseller's post on Instagram or TikTok, copies a
word out of it into Google, and there is nothing in Thai that explains what
they just read.

Two rules keep this honest:

  1. A term is published only if it actually appears in the corpus we just
     read, at MIN_LISTINGS or more. The definitions are written here; the
     evidence that anyone uses them comes from the dealers.
  2. The count travels with the term to the page, so a reader can see the
     claim rests on 114 listings and not on an opinion.

Rule 1 has already earned its keep. "GM / PM / MM" reads like a Louis Vuitton
size convention and it is one — but a naive count put it at 107 listings,
because 102 of those were a watch case diameter in millimetres. Measured
apart, GM and PM appear five times between them. The entry stays, at its real
weight, and MM is described as what it overwhelmingly is here.
"""
from __future__ import annotations

import re

# Below this a term is one dealer's habit, not a market vocabulary.
MIN_LISTINGS = 5

# `pattern` is matched case-insensitively against raw listing titles.
# `en` and `th` are the definition; `th` is the one that matters, since the
# whole point is that no Thai-language source explains these.
TERMS: list[dict] = [
    {
        'term': 'Full Set',
        'pattern': r'full\s?set',
        'en': 'The piece with everything it was sold with — box, dust bag, '
              'authenticity card or warranty papers, and usually the receipt. '
              'A full set resells for meaningfully more than the item alone.',
        'th': 'ของครบชุด — กล่อง ถุงผ้า การ์ดของแท้หรือใบรับประกัน และมักมีใบเสร็จด้วย '
              'ของครบชุดขายต่อได้ราคาสูงกว่าตัวสินค้าเปล่าอย่างมีนัยสำคัญ',
    },
    {
        'term': 'No Receipt',
        'pattern': r'no\s?receipt',
        'en': 'Full set except the original sales slip. Common, and not a '
              'warning sign on its own — but it does cost something at resale, '
              'so it belongs in the price you negotiate.',
        'th': 'ครบชุดแต่ไม่มีใบเสร็จตัวจริง พบบ่อยและไม่ใช่สัญญาณอันตรายในตัวเอง '
              'แต่มีผลต่อราคาขายต่อ จึงควรนำมาต่อรองราคา',
    },
    {
        'term': 'WOC (Wallet on Chain)',
        'pattern': r'\bwoc\b',
        'en': 'A wallet with a detachable chain, carried as a small shoulder '
              'bag. The cheapest way into most maisons, and priced well below '
              'the flap bag it resembles.',
        'th': 'กระเป๋าสตางค์ที่มีสายโซ่ถอดได้ ใช้สะพายเป็นกระเป๋าใบเล็ก '
              'เป็นรุ่นที่ราคาเข้าถึงง่ายที่สุดของหลายแบรนด์ และถูกกว่ากระเป๋าฝาปิดที่หน้าตาคล้ายกันมาก',
    },
    {
        'term': 'Microchip',
        'pattern': r'microchip',
        'en': 'Chanel replaced its serial sticker with an embedded chip from '
              'around 2021. A listing that says microchip is describing a '
              'recent bag, not an older one.',
        'th': 'ชาแนลเปลี่ยนจากสติกเกอร์ซีเรียลมาเป็นชิปฝังในตัวกระเป๋าตั้งแต่ราวปี 2021 '
              'ประกาศที่ระบุ microchip จึงหมายถึงกระเป๋ารุ่นใหม่ ไม่ใช่ของเก่า',
    },
    {
        'term': 'Holo / Hologram',
        'pattern': r'\bholo',
        'en': "Chanel's older serial sticker. Dealers write it with its series "
              'number — "Holo 27" — which is how the bag gets dated.',
        'th': 'สติกเกอร์ซีเรียลแบบเก่าของชาแนล ร้านมักเขียนพร้อมเลขซีรีส์ เช่น "Holo 27" '
              'ซึ่งใช้ระบุปีที่ผลิตของกระเป๋าใบนั้น',
    },
    {
        'term': 'Caviar',
        'pattern': r'caviar',
        'en': "Chanel's grained, pebbled calfskin. It resists scratches far "
              'better than lambskin and normally carries a higher resale price '
              'in the same model and size.',
        'th': 'หนังลูกวัวลายเม็ดของชาแนล ทนรอยขีดข่วนกว่าหนังแกะมาก '
              'และมักขายต่อได้ราคาสูงกว่าในรุ่นและขนาดเดียวกัน',
    },
    {
        'term': 'Lambskin',
        'pattern': r'lambskin',
        'en': 'Smooth, soft lambskin. It photographs beautifully and marks '
              'easily — check corners and the flap edge before agreeing a price.',
        'th': 'หนังแกะผิวเรียบนุ่ม สวยในภาพถ่ายแต่เป็นรอยง่าย '
              'ควรตรวจมุมกระเป๋าและขอบฝาปิดก่อนตกลงราคา',
    },
    {
        'term': 'GHW / SHW / RHW / PHW',
        'pattern': r'\b[gsrp]hw\b',
        'en': 'Gold, silver, rose gold and palladium hardware. Dealers abbreviate '
              'it because it changes the price: on some models one finish is '
              'materially harder to resell than another.',
        'th': 'อะไหล่สีทอง เงิน พิงค์โกลด์ และแพลเลเดียม ตามลำดับ '
              'ร้านย่อไว้เพราะมีผลต่อราคา — บางรุ่นสีอะไหล่ต่างกันขายต่อยากง่ายไม่เท่ากัน',
    },
    {
        'term': 'Chevron',
        'pattern': r'chevron',
        'en': 'V-shaped quilting instead of the usual diamond. Produced in far '
              'smaller numbers, so comparable pieces are thinner on the ground.',
        'th': 'การเย็บลายตัว V แทนลายข้าวหลามตัดปกติ ผลิตจำนวนน้อยกว่ามาก '
              'ของเทียบเคียงในตลาดจึงหายากกว่า',
    },
    {
        'term': 'Jubilee / Oyster / Oysterflex',
        'pattern': r'\b(jubilee|oyster)',
        'en': "Rolex bracelets: Jubilee is the five-piece link, Oyster the "
              'flatter three-piece, Oysterflex the rubber-over-metal strap. '
              '"Oyster Perpetual" is a model line, not a bracelet.',
        'th': 'สายนาฬิกาโรเล็กซ์ — Jubilee คือสายห้าข้อ Oyster คือสายสามข้อที่แบนกว่า '
              'ส่วน Oysterflex เป็นสายยางหุ้มโครงโลหะ '
              'ส่วนคำว่า "Oyster Perpetual" คือชื่อคอลเลกชัน ไม่ใช่ชื่อสาย',
    },
    {
        'term': 'Like New / Unused',
        'pattern': r'(like\s?new|unused|never\s?worn)',
        'en': "The dealer's top condition grade: little or no visible wear. It "
              'is the shop\'s own judgement, not a graded standard — inspect it '
              'yourself or ask for corner and hardware photographs.',
        'th': 'เกรดสภาพสูงสุดที่ร้านให้ — แทบไม่มีร่องรอยการใช้งาน '
              'แต่เป็นการประเมินของร้านเอง ไม่ใช่มาตรฐานกลาง ควรดูของจริงหรือขอรูปมุมกระเป๋าและอะไหล่',
    },
    {
        'term': 'Vintage',
        'pattern': r'vintage',
        'en': 'An older piece, typically pre-2000s. Condition varies enormously '
              'and so does price — vintage is a date, not a grade.',
        'th': 'ของรุ่นเก่า มักหมายถึงก่อนยุค 2000 สภาพและราคาต่างกันมาก '
              'คำว่า vintage บอกยุค ไม่ได้บอกสภาพ',
    },
    {
        'term': 'Clemence / Togo / Epsom',
        'pattern': r'\b(clemence|clémence|togo|epsom)\b',
        'en': "Hermès leathers. Togo and Clemence are grained and slouch with "
              'age; Epsom is stiff and holds its shape. The same Birkin in a '
              'different leather is a different price.',
        'th': 'หนังของแอร์เมส — Togo และ Clemence เป็นหนังลายเม็ดที่จะนิ่มลงตามอายุ '
              'ส่วน Epsom แข็งและคงทรง เบอร์กินใบเดียวกันแต่คนละหนัง ราคาไม่เท่ากัน',
    },
    {
        'term': 'GM / PM / MM',
        'pattern': r'\b(GM|PM)\b',
        'en': 'Louis Vuitton, Goyard and Hermès size suffixes — grand, petit '
              'and moyen modèle, so large, small and medium. Note that "mm" on '
              'a watch listing is a case diameter in millimetres instead.',
        'th': 'ตัวย่อบอกขนาดของ Louis Vuitton, Goyard และ Hermès — grand, petit, moyen modèle '
              'คือใหญ่ เล็ก และกลาง ส่วน "mm" ในประกาศนาฬิกาคือขนาดหน้าปัดเป็นมิลลิเมตร คนละความหมาย',
    },
    {
        'term': 'Classic 10" / Boy 8" / 19 Size 26',
        'pattern': r'(classic|boy|coco)\s?\d|\b19\s?(size\s?)?\d\d\b|\d\s?[”"]',
        'en': 'Thai dealers size Chanel flaps by width rather than by the name '
              'Chanel uses. Classic 10 is the Medium, Classic 12 the Jumbo, '
              'Boy 8 the Small. The 19 is sized in centimetres instead.',
        'th': 'ร้านไทยเรียกขนาดกระเป๋าชาแนลตามความกว้างเป็นนิ้ว แทนชื่อขนาดที่ชาแนลใช้เอง '
              'Classic 10 คือไซซ์ Medium, Classic 12 คือ Jumbo, Boy 8 คือ Small '
              'ส่วนรุ่น 19 นับเป็นเซนติเมตร',
    },
]


def vocabulary(listings: list[dict]) -> list[dict]:
    """The terms above that this sweep actually saw, with their counts.

    Sorted by how common they are, because that is the order a reader meets
    them in — the words on every listing first, the specialist ones after.
    """
    titles = [(l.get('title') or '') for l in listings]
    out = []
    for entry in TERMS:
        pattern = re.compile(entry['pattern'], re.I)
        count = sum(1 for t in titles if pattern.search(t))
        if count >= MIN_LISTINGS:
            out.append({k: v for k, v in entry.items() if k != 'pattern'} | {'count': count})
    out.sort(key=lambda e: -e['count'])
    return out
