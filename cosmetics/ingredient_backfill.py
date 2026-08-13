"""Ingredient backfill — re-fetches product detail pages for the 623 products
missing ingredient data, then patches products.csv in-place.

Only updates the ingredients/ingredient_count fields; leaves all other CSV
columns untouched. Idempotent: skips products that already have ingredients.

Usage:
    python -m cosmetics.ingredient_backfill
    python -m cosmetics.ingredient_backfill --port 2091 --shard 0/4
"""
from __future__ import annotations
import argparse, csv, json, logging, time
from pathlib import Path

from cosmetics import config
from cosmetics.konvy_fetch import KonvyBrowser, is_socks_dead_error
from cosmetics.konvy_parse import parse_product

log = logging.getLogger("cosmetics.ingredient_backfill")

CSV_PATH = config.OUTPUT_DIR / "products.csv"
PATCH_PATH = config.STATE_DIR / "ingredient_patches.json"
# master_db.json is the only place the full accumulated catalogue lives.
MASTER_DB = config.OUTPUT_DIR.parent / "web" / "data" / "master_db.json"


def _load_patches() -> dict[str, list[str]]:
    """Load previously saved patches so we can resume."""
    if PATCH_PATH.exists():
        return json.loads(PATCH_PATH.read_text(encoding="utf-8"))
    return {}


def _save_patch(patches: dict[str, list[str]]) -> None:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    PATCH_PATH.write_text(json.dumps(patches, ensure_ascii=False), encoding="utf-8")


def _apply_patches(patches: dict[str, list[str]]) -> int:
    """Write patches back into products.csv. Returns number of rows updated."""
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    updated = 0
    for row in rows:
        pid = row.get("product_id", "")
        if pid in patches:
            ings = patches[pid]
            row["ingredients"] = "|".join(ings)
            row["ingredient_count"] = str(len(ings))
            updated += 1

    fieldnames = rows[0].keys() if rows else []
    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    return updated


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=None)
    parser.add_argument("--shard", default=None, help="I/N e.g. 0/4")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(message)s")

    from cosmetics import vpn_up
    ports = vpn_up.pick_active_ports()
    if not ports:
        print("ERROR: no active VPN ports"); return 1
    port = args.port if args.port else ports[-1]

    # Load products missing ingredients.
    #
    # products.csv only holds the most recent scrape session (23 rows as of
    # 2026-08-13), so sourcing the worklist from it alone made this script a
    # near no-op: the 428 products actually missing ingredient data live in
    # master_db.json, which accumulates across sessions. Take the union of both,
    # keyed by product_id, so a rebuild-era gap is reachable.
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8"))) if CSV_PATH.exists() else []
    by_id: dict[str, dict] = {str(r["product_id"]): r for r in rows}

    if MASTER_DB.exists():
        try:
            master = json.loads(MASTER_DB.read_text(encoding="utf-8")).get("products", {})
        except Exception:
            master = {}
        for pid, p in master.items():
            if str(pid) in by_id:
                continue
            ings = p.get("ingredients") or ""
            if isinstance(ings, list):
                ings = "|".join(ings)
            by_id[str(pid)] = {
                "product_id": str(pid),
                "url": p.get("url", ""),
                "name": p.get("name", ""),
                "ingredients": ings,
            }

    pending = [r for r in by_id.values() if not (r.get("ingredients") or "").strip()]
    print(f"worklist: {len(rows)} from products.csv + master_db -> "
          f"{len(by_id)} products, {len(pending)} missing ingredients")

    if args.shard:
        shard_i, shard_n = map(int, args.shard.split("/"))
        pending = [r for j, r in enumerate(pending) if j % shard_n == shard_i]
        print(f"Ingredient backfill shard {shard_i}/{shard_n}: {len(pending)} products (port {port})")
    else:
        print(f"Ingredient backfill: {len(pending)} products missing ingredients (port {port})")

    if not pending:
        print("Nothing to do."); return 0

    patches = _load_patches()
    # Skip ones we've already fetched (resume support)
    pending = [r for r in pending if r["product_id"] not in patches]
    print(f"After resume skip: {len(pending)} remaining")

    done = fail = 0

    while pending:
        try:
            with KonvyBrowser(port) as browser:
                while pending:
                    row = pending[0]
                    pid = row["product_id"]
                    url = row.get("url", f"https://www.konvy.com/product/{pid}.html")
                    print(f"[{done+fail+1}] {pid}: {row.get('name','')[:50]}")
                    try:
                        html = browser.fetch_html(url, scroll=1)
                        if html:
                            product = parse_product(html, url)
                            if product.ingredients:
                                patches[pid] = product.ingredients
                                _save_patch(patches)
                                done += 1
                                print(f"  → {len(product.ingredients)} ingredients")
                            else:
                                patches[pid] = []  # mark as tried, no ingredients
                                _save_patch(patches)
                                print(f"  → no ingredients found")
                                done += 1
                        else:
                            print(f"  → empty page")
                            fail += 1
                        pending.pop(0)
                        time.sleep(config.DELAY_PRODUCT_SEC)
                    except KeyboardInterrupt:
                        raise
                    except Exception as e:
                        err = str(e)
                        log.error(f"{pid}: {err[:80]}")
                        fail += 1
                        pending.pop(0)
                        if is_socks_dead_error(err):
                            raise
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.warning(f"browser restart: {e}")
            time.sleep(5)

    # Write all patches to CSV
    if patches:
        updated = _apply_patches(patches)
        print(f"\nPatched {updated} rows in products.csv")

    print(f"Done. fetched={done} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
