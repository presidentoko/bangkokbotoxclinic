"""
extract.py — read cached page text → Claude API → insert into checkup_packages.
Re-runs are safe: existing rows for a hospital are deleted before re-inserting
(full refresh per hospital per run).
"""
import os
import json
import datetime
import pymysql
import anthropic
from config import DB_CONFIG

CACHE_DIR = "cache"
MODEL = "claude-sonnet-4-6"
MAX_TEXT_CHARS = 40_000
CHUNK_SIZE = 15_000  # split long pages into chunks to avoid output truncation

EXTRACT_SYSTEM = """You extract health check-up package data from Thai hospital
web pages. Return ONLY a JSON object, no prose, no markdown fences.
Prices in THB as integers (strip ฿ and commas). If a field is unknown use null.
For 'includes' booleans: true if the package explicitly lists that item,
false if explicitly excluded/optional, null if not mentioned."""

EXTRACT_USER_TEMPLATE = """Hospital: {hospital_name}
Page text:
---
{page_text}
---
Return JSON:
{{
  "packages": [
    {{
      "name": "string",
      "category": "comprehensive|executive|cancer|cardiac|women|men|basic|age",
      "price_thb": null,
      "target_gender": "all|male|female",
      "target_age_min": null,
      "includes": {{
        "blood": null, "xray": null, "ultrasound": null,
        "ct": null, "mri": null, "ecg": null,
        "treadmill": null, "cancer_marker": null,
        "doctor_consult": null, "interpreter": null
      }},
      "results_days": null,
      "includes_raw": "verbatim list of what's included"
    }}
  ]
}}"""

INCLUDES_MAP = {
    "blood":          "has_blood",
    "xray":           "has_xray",
    "ultrasound":     "has_ultrasound",
    "ct":             "has_ct",
    "mri":            "has_mri",
    "ecg":            "has_ecg",
    "treadmill":      "has_treadmill",
    "cancer_marker":  "has_cancer_marker",
    "doctor_consult": "has_doctor_consult",
    "interpreter":    "has_interpreter",
}

client = anthropic.Anthropic()


def _call_claude(hospital_name: str, chunk: str) -> list[dict]:
    msg = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        system=EXTRACT_SYSTEM,
        messages=[{
            "role": "user",
            "content": EXTRACT_USER_TEMPLATE.format(
                hospital_name=hospital_name,
                page_text=chunk,
            ),
        }],
    )
    txt = msg.content[0].text.strip()
    txt = txt.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(txt)["packages"]


def extract_packages(hospital_name: str, page_text: str) -> list[dict]:
    text = page_text[:MAX_TEXT_CHARS]
    if len(text) <= CHUNK_SIZE:
        return _call_claude(hospital_name, text)
    # Long page: split into chunks and deduplicate by name
    chunks = [text[i:i + CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE)]
    seen, results = set(), []
    for chunk in chunks:
        for pkg in _call_claude(hospital_name, chunk):
            key = pkg.get("name", "").strip().lower()
            if key and key not in seen:
                seen.add(key)
                results.append(pkg)
    return results


def bool_val(v):
    if v is True:
        return 1
    if v is False:
        return 0
    return None


def insert_packages(cur, hospital_id: int, hospital_name: str, checkup_url: str, packages: list[dict]):
    now = datetime.datetime.utcnow()
    sql = """
        INSERT INTO checkup_packages
          (hospital_id, name, category, target_gender, target_age_min,
           price, currency, includes_raw,
           has_blood, has_xray, has_ultrasound, has_ct, has_mri, has_ecg,
           has_treadmill, has_cancer_marker, has_doctor_consult, has_interpreter,
           results_days, source_url, raw_json, scraped_at)
        VALUES
          (%(hospital_id)s, %(name)s, %(category)s, %(target_gender)s, %(target_age_min)s,
           %(price)s, 'THB', %(includes_raw)s,
           %(has_blood)s, %(has_xray)s, %(has_ultrasound)s, %(has_ct)s, %(has_mri)s, %(has_ecg)s,
           %(has_treadmill)s, %(has_cancer_marker)s, %(has_doctor_consult)s, %(has_interpreter)s,
           %(results_days)s, %(source_url)s, %(raw_json)s, %(scraped_at)s)
    """
    rows = []
    for pkg in packages:
        inc = pkg.get("includes") or {}
        row = {
            "hospital_id":    hospital_id,
            "name":           pkg.get("name") or "",
            "category":       pkg.get("category"),
            "target_gender":  pkg.get("target_gender"),
            "target_age_min": pkg.get("target_age_min"),
            "price":          pkg.get("price_thb"),
            "includes_raw":   pkg.get("includes_raw"),
            "results_days":   pkg.get("results_days"),
            "source_url":     checkup_url,
            "raw_json":       json.dumps(pkg, ensure_ascii=False),
            "scraped_at":     now,
        }
        for key, col in INCLUDES_MAP.items():
            row[col] = bool_val(inc.get(key))
        rows.append(row)
    cur.executemany(sql, rows)
    return len(rows)


def main():
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor(pymysql.cursors.DictCursor) as cur:
        cur.execute("SELECT id, name, slug, checkup_url FROM hospitals WHERE checkup_url IS NOT NULL")
        hospitals = cur.fetchall()

    for hosp in hospitals:
        cache_path = os.path.join(CACHE_DIR, f"{hosp['slug']}.txt")
        if not os.path.exists(cache_path):
            print(f"[extract] SKIP {hosp['slug']} — no cache file")
            continue

        with open(cache_path, encoding="utf-8") as f:
            text = f.read()

        if len(text) < 200:
            print(f"[extract] SKIP {hosp['slug']} — cache too short ({len(text)} chars)")
            continue

        print(f"[extract] {hosp['slug']} ({len(text):,} chars) → Claude…")
        try:
            packages = extract_packages(hosp["name"], text)
        except Exception as exc:
            print(f"  ✗ Claude error: {exc}")
            continue

        print(f"  → {len(packages)} package(s) extracted")
        if not packages:
            continue

        with conn.cursor() as cur:
            cur.execute("DELETE FROM checkup_packages WHERE hospital_id = %s", (hosp["id"],))
            n = insert_packages(cur, hosp["id"], hosp["name"], hosp["checkup_url"], packages)
        print(f"  ✓ {n} row(s) inserted")

    conn.close()
    print("\nExtraction complete.")


if __name__ == "__main__":
    main()
