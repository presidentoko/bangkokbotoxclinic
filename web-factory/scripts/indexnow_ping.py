"""IndexNow ping — Bing / Yandex / Naver / Seznam 자동 인덱싱 트리거.

매 deploy 후 실행:
  python web-factory/scripts/indexnow_ping.py

흐름:
1. master_db.json 의 모든 supplier URL + 카테고리/도시/베스트 페이지 URL 수집
2. IndexNow API 에 한 번에 POST (최대 10,000 URL/request)

Key 파일은 https://thaisupplyhub.com/{KEY}.txt 로 verify 가능해야 함.
public/ 에 자동 생성.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB = ROOT / "web-factory"
PUBLIC = WEB / "public"
DATA = WEB / "data" / "master_db.json"

SITE = os.environ.get("SITE_URL", "https://thaisupplyhub.com")
HOST = SITE.replace("https://", "").replace("http://", "").rstrip("/")

KEY_FILE = WEB / ".indexnow_key"


def ensure_key() -> str:
    """Stable key — 한 번 생성하고 재사용. public/{key}.txt 에 verify 파일도 생성."""
    if KEY_FILE.exists():
        return KEY_FILE.read_text(encoding="utf-8").strip()
    key = uuid.uuid4().hex
    KEY_FILE.write_text(key, encoding="utf-8")
    PUBLIC.mkdir(parents=True, exist_ok=True)
    (PUBLIC / f"{key}.txt").write_text(key, encoding="utf-8")
    print(f"[+] generated IndexNow key: {key}")
    print(f"    verify file: public/{key}.txt")
    return key


def collect_urls(db: dict) -> list[str]:
    urls = [
        f"{SITE}/",
        f"{SITE}/ko",
        f"{SITE}/th",
        f"{SITE}/about",
        f"{SITE}/contact",
        f"{SITE}/for-suppliers",
        f"{SITE}/ko/about",
        f"{SITE}/ko/contact",
        f"{SITE}/ko/for-suppliers",
        f"{SITE}/th/about",
        f"{SITE}/th/contact",
        f"{SITE}/th/for-suppliers",
    ]
    # category (en + ko)
    for c in db.get("category_counts", {}).keys():
        urls.append(f"{SITE}/c/{c}")
        urls.append(f"{SITE}/ko/c/{c}")
    # category (th — 핵심만)
    for c in ["manufacturer", "auto_parts", "industrial_estate", "warehouse", "logistics", "packaging", "food_mfg"]:
        urls.append(f"{SITE}/th/c/{c}")
    # city (en + ko)
    th_city_core = {"chon_buri", "rayong", "pathum_thani", "samut_sakhon", "samut_prakan", "bangkok", "phra_nakhon_si_ayutthaya", "songkhla"}
    for label in db.get("city_counts", {}).keys():
        slug = label.lower().replace(" ", "_")
        urls.append(f"{SITE}/city/{slug}")
        urls.append(f"{SITE}/ko/city/{slug}")
        if slug in th_city_core:
            urls.append(f"{SITE}/th/city/{slug}")
    # best
    for slug in [
        "highly-recommended", "industrial-estates", "auto-parts",
        "warehouses", "manufacturers", "with-website", "near-laem-chabang",
    ]:
        urls.append(f"{SITE}/best/{slug}")
    # guides (en + ko + th)
    urls.append(f"{SITE}/guide")
    urls.append(f"{SITE}/ko/guide")
    urls.append(f"{SITE}/th/guide")
    for slug in [
        "sourcing-thai-suppliers-direct",
        "eastern-seaboard-industrial-estates-compared",
        "map-ta-phut-petrochemical-cluster",
        "thai-auto-parts-tier1-tier2",
        "laem-chabang-warehouse-logistics",
        "thai-food-manufacturer-haccp-export",
        "thai-electronics-manufacturer-hdd-ems",
        "thai-packaging-manufacturer-guide",
        "thai-textile-apparel-oem-guide",
        "thai-chemical-manufacturer-guide",
        "thai-precision-machining-guide",
        "thai-steel-metal-fabrication-guide",
        "thai-rubber-products-sourcing-guide",
        "thai-logistics-3pl-customs-guide",
    ]:
        urls.append(f"{SITE}/guide/{slug}")
    for slug in ["korea-sme-thai-oem-process", "korea-sme-amata-wha-comparison"]:
        urls.append(f"{SITE}/ko/guide/{slug}")
    for slug in ["sme-thai-supplier-sourcing", "thai-industrial-estate-guide-domestic"]:
        urls.append(f"{SITE}/th/guide/{slug}")
    # blog (en + ko)
    urls.append(f"{SITE}/blog")
    urls.append(f"{SITE}/ko/blog")
    for slug in [
        "eastern-seaboard-by-the-numbers",
        "sourcing-agent-markup-real-cost",
        "korean-smes-thailand-quick-map",
        "map-ta-phut-at-a-glance",
        "verified-supplier-what-we-check",
        "trust-score-explained",
        "why-this-directory-exists",
    ]:
        urls.append(f"{SITE}/blog/{slug}")
    for slug in [
        "korean-sme-thai-entry-pattern",
        "amata-vs-wha-quick-take",
        "tier1-japanese-oem-thailand-overview",
        "thailand-vs-vietnam-sourcing-cost",
        "tier1-bangkok-hq-corporate-office-list",
    ]:
        urls.append(f"{SITE}/ko/blog/{slug}")
    # supplier (trust >= 55 만 — 빌드와 일치)
    for s in db.get("suppliers", []):
        if s.get("trust_score", 0) >= 55:
            urls.append(f"{SITE}/supplier/{s['id']}")
    return urls


def ping(key: str, urls: list[str]) -> None:
    body = json.dumps({
        "host": HOST,
        "key": key,
        "keyLocation": f"{SITE}/{key}.txt",
        "urlList": urls,
    }).encode("utf-8")
    # IndexNow 통합 endpoint (Bing 이 받아서 다른 엔진들과 sync).
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"[OK] IndexNow API: HTTP {resp.status} — pinged {len(urls)} URLs")
    except Exception as e:
        print(f"[ERR] IndexNow ping failed: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    if not DATA.exists():
        print(f"NOT FOUND: {DATA}", file=sys.stderr)
        sys.exit(1)
    with open(DATA, "r", encoding="utf-8") as f:
        db = json.load(f)

    key = ensure_key()
    urls = collect_urls(db)
    print(f"Total URLs to submit: {len(urls)}")
    if len(urls) > 10000:
        print("WARN: > 10K URLs, IndexNow caps per request — splitting", file=sys.stderr)
        for i in range(0, len(urls), 10000):
            ping(key, urls[i:i+10000])
    else:
        ping(key, urls)


if __name__ == "__main__":
    main()
