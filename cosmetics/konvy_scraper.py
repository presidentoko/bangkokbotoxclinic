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

CSV_FIELDS = ["product_id","url","name","brand",
              "price_thb","list_price_thb","discount_pct","volume",
              "image_url","images","sku","gtin8","description",
              "ingredients","ingredient_count","concern_seeds",
              "konvy_rating","konvy_rating_best","konvy_review_count",
              "sold_count","reviews_scraped","fetched_at"]

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

def _acquire_browser(ports: list[int], port_idx: int):
    """Open a KonvyBrowser on a *health-gated* port, cycling from port_idx and
    waiting for a tunnel to recover if all are momentarily dead. The NordVPN exits
    flap, so we probe with a real GET (vpn_up.port_healthy) before paying for a
    browser launch. Returns (browser, port, next_port_idx) or (None, None, port_idx)
    if every tunnel stayed dead across all wait rounds."""
    for wait_round in range(config.TUNNEL_RECOVER_ROUNDS):
        port = vpn_up.pick_healthy_port(ports, port_idx)
        if port is None:
            log.warning("all tunnels dead -> wait %ds (round %d/%d)",
                        config.TUNNEL_RECOVER_WAIT_SEC, wait_round + 1, config.TUNNEL_RECOVER_ROUNDS)
            time.sleep(config.TUNNEL_RECOVER_WAIT_SEC); continue
        next_idx = (ports.index(port) + 1) % len(ports)
        try:
            browser = konvy_fetch.KonvyBrowser(port).__enter__()
            log.info("browser up on healthy port %d", port)
            return browser, port, next_idx
        except Exception as e:
            log.warning("browser launch failed on port %d: %s", port, str(e)[:80])
            port_idx = next_idx; time.sleep(3)
    return None, None, port_idx

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

    # ── Phase 1: discover product URLs ONCE (rotate ports on socks death, keep result) ──
    product_urls: list[tuple[str, str]] = []
    for _ in range(config.MAX_TUNNEL_ROTATIONS):
        browser, port, port_idx = _acquire_browser(ports, port_idx)
        if browser is None:
            log.error("discovery: no healthy tunnel available"); break
        try:
            product_urls = discover(browser)
            log.info("unique products discovered: %d", len(product_urls))
            break
        except Exception as e:
            if konvy_fetch.is_socks_dead_error(str(e)):
                log.warning("SOCKS dead during discovery on port %d -> rotate", port)
                time.sleep(3); continue
            log.error("discovery fatal: %s", str(e)[:200]); break
        finally:
            try: browser.__exit__(None, None, None)
            except Exception: pass
    if not product_urls:
        write_products_csv(products); save_progress(progress)
        log.error("DONE: 0 products (no listing)"); return 1

    # ── Phase 2: fetch each product, cycling to a healthy tunnel when one flaps ──
    browser = None
    i = 0
    rotations = 0
    while i < len(product_urls):
        purl, concern = product_urls[i]
        pid_guess = purl.rsplit("-", 1)[-1].replace(".html", "")
        if progress.get(pid_guess, {}).get("status") == "ok":
            i += 1; continue
        if browser is None:
            browser, port, port_idx = _acquire_browser(ports, port_idx)
            if browser is None:
                log.error("no healthy tunnel for products -> stop at %d/%d", i, len(product_urls)); break
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
            i += 1
        except Exception as e:
            if konvy_fetch.is_socks_dead_error(str(e)):
                # tunnel flapped: drop this browser, rotate to a healthy port, RETRY same product.
                rotations += 1
                log.warning("SOCKS dead on port %d -> rotate+resume @ %d (rotation %d)", port, i, rotations)
                try: browser.__exit__(None, None, None)
                except Exception: pass
                browser = None
                if rotations > config.MAX_TUNNEL_ROTATIONS:
                    log.error("rotation budget exhausted -> stop at %d/%d", i, len(product_urls)); break
                time.sleep(3); continue
            consecutive_fails += 1
            progress[pid_guess] = {"status":"error","error": f"{type(e).__name__}: {str(e)[:120]}"}
            log.warning("product fail %s: %s", purl, str(e)[:100])
            i += 1
            if consecutive_fails >= config.CIRCUIT_BREAKER_FAILS:
                log.error("circuit breaker -> pause %ds", config.CIRCUIT_BREAKER_PAUSE_SEC)
                save_progress(progress); write_products_csv(products)
                time.sleep(config.CIRCUIT_BREAKER_PAUSE_SEC); consecutive_fails = 0
        save_progress(progress); _heartbeat()
        if limit and len(products) >= limit:
            break
    if browser is not None:
        try: browser.__exit__(None, None, None)
        except Exception: pass

    write_products_csv(products); save_progress(progress)
    log.info("DONE: %d products", len(products))
    return 0

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    return crawl(limit=ap.parse_args().limit)

if __name__ == "__main__":
    sys.exit(main())
