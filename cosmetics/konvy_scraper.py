"""Konvy 크롤 오케스트레이션: 목록→상세→리뷰, 체크포인트, 서킷브레이커, 포트 로테이션.
기존 pantip/scraper.py main() 패턴(per-item 격리, 매 아이템 progress 저장, heartbeat) 계승."""
from __future__ import annotations
import argparse, csv, json, logging, sys, time
from dataclasses import asdict
from pathlib import Path

from . import config, konvy_parse, konvy_fetch, vpn_up
from .models import Product

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("cosmetics")

CSV_FIELDS = ["product_id","url","name","brand","price_thb","volume","image_url",
              "ingredients","concern_seeds","konvy_rating","konvy_review_count","fetched_at"]

# 고민 → Konvy 카테고리 catId. 113 = 검증된 스킨케어 목록.
# TODO: 여드름/미백 전용 catId는 추가 recon으로 정밀화. 우선 동작하는 시드.
CONCERN_CATEGORIES = {"acne": ["113"], "whitening": ["113"]}

def listing_urls_for(concern: str) -> list[str]:
    return [f"https://www.konvy.com/mall/list.php?param={cat}-0-0-0&from=category"
            for cat in CONCERN_CATEGORIES.get(concern, [])]

def write_products_csv(products: list[Product]) -> Path:
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with config.PRODUCTS_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        w.writeheader()
        for p in products:
            row = asdict(p)
            row["ingredients"] = "|".join(p.ingredients)
            row["concern_seeds"] = "|".join(p.concern_seeds)
            row.pop("ingredients_raw", None)
            w.writerow({k: row.get(k, "") for k in CSV_FIELDS})
    return config.PRODUCTS_CSV

def save_reviews(product_id: str, reviews) -> Path:
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    p = config.REVIEWS_DIR / f"{product_id}_konvy.json"
    p.write_text(json.dumps([asdict(r) for r in reviews], ensure_ascii=False, indent=2), encoding="utf-8")
    return p

def load_progress() -> dict:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    p = config.STATE_DIR / "progress.json"
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}

def save_progress(prog: dict) -> None:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    (config.STATE_DIR / "progress.json").write_text(
        json.dumps(prog, ensure_ascii=False, indent=2), encoding="utf-8")

def _heartbeat() -> None:
    try:
        (config.STATE_DIR / "heartbeat").write_text(
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), encoding="utf-8")
    except Exception:
        pass

def crawl(limit: int | None = None) -> int:
    ports = vpn_up.pick_active_ports()
    if not ports:
        log.error("no active proxy ports"); return 1
    log.info("proxy ports: %s", ports)
    port_idx = 0
    progress = load_progress()
    products: list[Product] = []
    consecutive_fails = 0

    def discover(browser):
        pairs = []
        for concern in config.CONCERNS:
            for list_url in listing_urls_for(concern):
                html = browser.fetch_html(list_url, scroll=6)
                found = konvy_parse.parse_listing(html)
                log.info("listing %s -> %d", list_url, len(found))
                pairs += [(u, concern) for u in found]
                time.sleep(config.DELAY_LIST_SEC)
        seen, out = set(), []
        for u, c in pairs:
            if u not in seen:
                seen.add(u); out.append((u, c))
        return out

    attempts = 0
    while attempts <= len(ports):
        port = ports[port_idx % len(ports)]
        try:
            with konvy_fetch.KonvyBrowser(port) as browser:
                log.info("browser up on port %d", port)
                product_urls = discover(browser)
                log.info("unique products discovered: %d", len(product_urls))
                for purl, concern in product_urls:
                    pid_guess = purl.rsplit("-", 1)[-1].replace(".html", "")
                    if progress.get(pid_guess, {}).get("status") == "ok":
                        continue
                    try:
                        time.sleep(config.DELAY_PRODUCT_SEC)
                        phtml = browser.fetch_html(purl, scroll=2)
                        product = konvy_parse.parse_product(phtml, purl)
                        product.concern_seeds = [concern]
                        try:
                            time.sleep(config.DELAY_REVIEW_SEC)
                            raw = browser.fetch_json(konvy_fetch.reviews_url(product.product_id), referer=purl)
                            reviews = konvy_parse.parse_reviews(raw)
                            if reviews:
                                save_reviews(product.product_id, reviews)
                                if not product.konvy_review_count:
                                    product.konvy_review_count = len(reviews)
                                if not product.konvy_rating:
                                    product.konvy_rating = round(sum(r.rating for r in reviews)/len(reviews), 2)
                        except Exception as re:
                            if konvy_fetch.is_socks_dead_error(str(re)): raise
                            log.warning("reviews fail %s: %s", product.product_id, str(re)[:80])
                        products.append(product)
                        progress[product.product_id] = {"status":"ok","name":product.name,
                            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
                        consecutive_fails = 0
                        log.info("OK %s %s (%d ingr, %d reviews)", product.product_id,
                                 (product.name or "")[:40], len(product.ingredients), product.konvy_review_count)
                    except Exception as e:
                        if konvy_fetch.is_socks_dead_error(str(e)): raise
                        consecutive_fails += 1
                        progress[pid_guess] = {"status":"error","error": f"{type(e).__name__}: {str(e)[:120]}"}
                        log.warning("product fail %s: %s", purl, str(e)[:100])
                        if consecutive_fails >= config.CIRCUIT_BREAKER_FAILS:
                            log.error("circuit breaker -> pause %ds", config.CIRCUIT_BREAKER_PAUSE_SEC)
                            save_progress(progress); write_products_csv(products)
                            time.sleep(config.CIRCUIT_BREAKER_PAUSE_SEC); consecutive_fails = 0
                    save_progress(progress); _heartbeat()
                    if limit and len(products) >= limit:
                        write_products_csv(products); save_progress(progress)
                        log.info("limit reached: %d", len(products)); return 0
            break
        except Exception as e:
            if konvy_fetch.is_socks_dead_error(str(e)):
                attempts += 1; port_idx += 1
                log.warning("SOCKS dead on port %d -> rotate (attempt %d)", port, attempts)
                time.sleep(5); continue
            log.error("crawl fatal: %s", str(e)[:200]); break

    write_products_csv(products); save_progress(progress)
    log.info("DONE: %d products", len(products))
    return 0

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    return crawl(limit=ap.parse_args().limit)

if __name__ == "__main__":
    sys.exit(main())
