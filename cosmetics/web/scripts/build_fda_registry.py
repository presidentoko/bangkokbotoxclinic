# -*- coding: utf-8 -*-
"""Builds cosmetics/web/data/fda_registry.json — our products joined to their
Thai FDA cosmetic notification numbers.

Source: the Thai FDA's own public web service, published on the government open
data portal (data.go.th) as "[Web Service] สืบค้นข้อมูลผลิตภัณฑ์เครื่องสำอาง":

    http://porta.fda.moph.go.th/FDA_SEARCH_ALL/WS_LICENSE_SEARCH.asmx
    operation GET_DATA_CMT, single string argument (a search term)

Each record carries the notification number (lcnno), the notified English and
Thai product names, the licence holder, the status, and a link to the FDA's own
detail page. One request per brand; responses are cached under
scripts/.fda_cache so a re-run is cheap.

MATCHING POLICY
The output is shown to shoppers as "this product's FDA notification", so a
wrong number is worse than no number. Earlier drafts of this matcher bound
"Smooth E Acne Hydrogel" to a sunscreen notification and "COSRX The Vitamin C
23" to the Vitamin C 13 record. The rule that survived is set equality after
normalisation: every meaningful token must appear on both sides, with only a
short list of packaging words (refill, travel, ...) allowed as leftovers.
Numbers are meaningful and are kept — "23" is what separates two COSRX serums —
while volumes and pack counts are stripped first.

Products the matcher cannot resolve are simply absent from the output, and the
site shows nothing for them. Absence here means "we could not confirm", never
"unregistered", and the UI must not imply otherwise.

Known limit: the service returns at most 1,000 rows per query, so very large
brands may be truncated. That costs recall only.

Re-run after a master_db refresh:  python scripts/build_fda_registry.py
"""
import json, re, os, sys, time, urllib.request, urllib.error, collections
from xml.sax.saxutils import escape
from html import unescape

WS = "http://porta.fda.moph.go.th/FDA_SEARCH_ALL/WS_LICENSE_SEARCH.asmx"
ENV = ('<?xml version="1.0" encoding="utf-8"?>'
       '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
       'xmlns:xsd="http://www.w3.org/2001/XMLSchema" '
       'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>'
       '<GET_DATA_CMT xmlns="http://tempuri.org/"><DATAS>{}</DATAS>'
       '</GET_DATA_CMT></soap:Body></soap:Envelope>')

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, ".fda_cache")
DB = "data/master_db.json"
OUT = "data/fda_registry.json"

ROW = re.compile(r"<Table1[^>]*>(.*?)</Table1>", re.S)
FLD = re.compile(r"<([A-Za-z_0-9]+)\s*/>|<([A-Za-z_0-9]+)>(.*?)</\2>", re.S)

# Volumes, pack counts and Konvy listing artefacts — removed before tokenising
# so "473ml" and "24 Dots" cannot decide a match.
NOISE = re.compile(
    r"\bset\s*\d*\s*item\b|\bsave\s*\d+\s*%?|\bfree\s*!?|\bx\s*\d+\s*pcs?\b|"
    r"\b\d+\s*pcs?\b|\b\d+(\.\d+)?\s*(ml|g|gm|kg|mg|l)\b|\b\d+\s*dots?\b|"
    r"\b\d+\s*(sheets?|pieces?|tablets?|capsules?)\b", re.I)

# Leftovers that do not change which product this is.
ALLOW_EXTRA = {"refill", "limited", "edition", "travel", "mini", "jumbo",
               "value", "promotion", "exclusive", "size", "new"}

# Too common to carry a match alone; a pair must share two tokens outside this.
GENERIC = {"cream", "gel", "serum", "foam", "lotion", "toner", "essence",
           "oil", "mask", "patch", "pad", "pads", "cleanser", "cleansing",
           "wash", "soap", "spray", "powder", "balm", "scrub", "the", "and",
           "for", "with", "skin", "face", "facial", "body", "care", "acne"}

ACTIVE = "คงอยู่"          # notification still in force


def fetch(term):
    os.makedirs(CACHE, exist_ok=True)
    key = re.sub(r"[^A-Za-z0-9]+", "_", term)[:60] or "_"
    path = os.path.join(CACHE, key + ".xml")
    if os.path.exists(path):
        return open(path, encoding="utf-8").read()
    # Brand names carry & and ' (Clean & Clear, Jula's Herb); unescaped they
    # make the SOAP envelope invalid and the service answers 400/500.
    req = urllib.request.Request(WS, data=ENV.format(escape(term)).encode("utf-8"), headers={
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://tempuri.org/GET_DATA_CMT"',
        "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=180) as r:
        s = r.read().decode("utf-8")
    open(path, "w", encoding="utf-8").write(s)
    time.sleep(1.5)                       # one request every 1.5s
    return s


def parse(xml):
    out = []
    for m in ROW.finditer(xml):
        d = {}
        for empty, name, val in FLD.findall(m.group(1)):
            # Values arrive XML-escaped; the detail URLs carry &amp; and
            # would 301 to a broken query string if left encoded.
            d[empty or name] = "" if empty else unescape(val)
        out.append(d)
    return out


def toks(s):
    s = (s or "").lower()
    s = re.sub(r"\([^)]*\)", " ", s)      # "( สินค้าหมดอายุ : ... )"
    s = re.sub(r"\[[^\]]*\]", " ", s)
    s = NOISE.sub(" ", s)
    s = re.sub(r"[^a-z0-9+]+", " ", s)
    # Bare numbers are kept on purpose: "COSRX The Vitamin C 23" and
    # "COSRX The Vitamin C 13" are different products and differ only there.
    return frozenset(w for w in s.split() if len(w) > 1 or w.isdigit())


def match(name, rows):
    mine = toks(name)
    if len(mine) < 3:
        return None, "too-short"
    if len({w for w in mine if w not in GENERIC}) < 2:
        return None, "too-generic"
    hits = []
    for r in rows:
        theirs = toks(r.get("produceng", ""))
        if len(theirs) < 3:
            continue
        if (mine ^ theirs) - ALLOW_EXTRA:
            continue
        hits.append((theirs, r))
    if not hits:
        return None, "no-match"
    if len({t for t, _ in hits}) > 1:
        return None, "ambiguous"
    rs = [r for _, r in hits]
    rs.sort(key=lambda r: (r.get("cncnm", "").startswith(ACTIVE),
                           r.get("lcnno", "")), reverse=True)
    return (rs[0], len(rs)), "ok"


def main():
    db = json.load(open(DB, encoding="utf-8"))
    prods = db["products"]
    by_brand = collections.defaultdict(list)
    for pid, p in prods.items():
        b = (p.get("brand") or "").strip()
        if b:
            by_brand[b].append((pid, p))

    out, reasons, truncated = {}, collections.Counter(), []
    for i, (brand, items) in enumerate(sorted(by_brand.items()), 1):
        try:
            rows = parse(fetch(brand))
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            print(f"  [{i}/{len(by_brand)}] {brand}: FETCH FAILED {e}")
            reasons["fetch-failed"] += len(items)
            continue
        if len(rows) >= 1000:
            truncated.append(brand)
        for pid, p in items:
            res, why = match(p["name"], rows)
            reasons[why] += 1
            if not res:
                continue
            r, n = res
            status = r.get("cncnm", "").strip()
            out[pid] = {
                "lcnno": r.get("lcnno", "").strip(),
                "notified_name_en": r.get("produceng", "").strip(),
                "notified_name_th": r.get("productha", "").strip(),
                "holder": (r.get("licen") or r.get("thanm") or "").strip(),
                "status": status,
                "active": status.startswith(ACTIVE),
                "type_allow": r.get("typeallow", "").strip(),
                "url": (r.get("URLs_NEW") or r.get("URLs") or "").strip(),
                "registrations": n,
            }
        if i % 25 == 0:
            print(f"  [{i}/{len(by_brand)}] matched so far: {len(out)}")

    json.dump(out, open(OUT, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1, sort_keys=True)
    active = sum(1 for v in out.values() if v["active"])
    print(f"\nmatched {len(out)} / {len(prods)} products ({len(out)/len(prods)*100:.1f}%)")
    print(f"  notification still in force: {active}")
    print(f"  reasons: {dict(reasons)}")
    if truncated:
        print(f"  hit the 1,000-row cap (recall may be short): {', '.join(truncated[:12])}")


if __name__ == "__main__":
    sys.exit(main())
