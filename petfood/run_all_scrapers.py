"""
모든 PetBKK 데이터 수집 파이프라인 실행

순서:
  1. Hills TH 스크래핑
  2. Purina TH 스크래핑
  3. Shopify 브랜드 (Open Farm, Ziwi, Stella, Merrick, Instinct, Victor, Fromm, Orijen…)
  4. morefood 브랜드 (Me-O, Sheba, Taste of Wild, Farmina, SmartHeart, Iams…)
  5. Shopify ingredient backfill (성분 없는 항목 재추출)
  6. Shopee 가격 (VPN 병렬)
  7. web-petbkk/data/petfood.json 업데이트

Run:
    python -m petfood.run_all_scrapers
    python -m petfood.run_all_scrapers --skip-brands   # 브랜드 스킵, 가격만
    python -m petfood.run_all_scrapers --skip-shopee   # 가격 스킵
    python -m petfood.run_all_scrapers --enrich-only   # 성분 보강만
    python -m petfood.run_all_scrapers --no-vpn        # VPN 없이 (가격 단일 스레드)
"""
from __future__ import annotations
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA_SRC = ROOT / "data" / "petfood.json"
DATA_DST = ROOT / "web-petbkk" / "data" / "petfood.json"


def _run(module: str, extra_args: list[str] = []) -> bool:
    print(f"\n{'='*50}")
    print(f"Running: python -m {module}")
    print('='*50)
    result = subprocess.run(
        [sys.executable, "-m", module] + extra_args,
        cwd=ROOT,
    )
    return result.returncode == 0


def _sync_web():
    print(f"\n→ Syncing {DATA_SRC} → {DATA_DST}")
    shutil.copy2(DATA_SRC, DATA_DST)
    with open(DATA_SRC, encoding="utf-8") as f:
        foods = json.load(f)
    with_ings = sum(1 for f in foods if f.get("ingredients"))
    with_price = sum(1 for f in foods if f.get("price_thb", 0) > 0)
    brands = len(set(f["brand"] for f in foods))
    print(f"  Total: {len(foods)} foods | {brands} brands | {with_ings} with ingredients | {with_price} with price")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-brands", action="store_true")
    parser.add_argument("--skip-shopee", action="store_true")
    parser.add_argument("--skip-enrich", action="store_true")
    parser.add_argument("--enrich-only", action="store_true")
    parser.add_argument("--no-vpn", action="store_true")
    parser.add_argument("--workers", type=int, default=10)
    parser.add_argument("--base-port", type=int, default=2080)
    args = parser.parse_args()

    ok = True

    if args.enrich_only:
        ok &= _run("petfood.shopify_enrich")
        _sync_web()
        print("\n✅ Enrich-only run complete")
        return

    if not args.skip_brands:
        ok &= _run("petfood.hills_scraper")
        ok &= _run("petfood.purina_scraper")
        ok &= _run("petfood.shopify_scraper")
        ok &= _run("petfood.morefood_scraper")

    if not args.skip_enrich:
        ok &= _run("petfood.shopify_enrich")

    if not args.skip_shopee:
        shopee_args = [f"--workers={args.workers}", f"--base-port={args.base_port}"]
        if args.no_vpn:
            shopee_args.append("--no-vpn")
        ok &= _run("petfood.shopee_prices", shopee_args)

    _sync_web()

    if ok:
        print("\n✅ All scrapers completed successfully")
    else:
        print("\n⚠️  Some scrapers had errors — check output above")


if __name__ == "__main__":
    main()
