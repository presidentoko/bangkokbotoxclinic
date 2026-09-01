"""The one place that says where the pet-food data lives.

There used to be two catalogues. Nine of the eleven scrapers wrote to
``data/petfood.json`` at the repo root, ``run_all_scrapers.py`` then did a
blind ``shutil.copy2()`` of it over ``web-petbkk/data/petfood.json``, and the
three newest tools (pcg_local_brands, lazada_prices, import_price_feed) wrote
straight to the web copy instead. The root file had been frozen since
2026-06-19 at 986 records while the web copy grew to 1,133 — so running the
pipeline would have silently reverted the site by 147 products, taking the PCG
local brands, every scraped price and the whole rebuilt-ingredient pass with
it. Nothing would have errored; the site would just have gotten smaller.

There is now exactly one catalogue, and every scraper appends to it in place.
Import from here rather than recomputing a path, so a future scraper cannot
reintroduce a second one.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB_DATA = ROOT / "web-petbkk" / "data"

#: The pet food catalogue the website actually reads and builds pages from.
FOODS = WEB_DATA / "petfood.json"

#: Pantip review rollups keyed by food/hospital id.
REVIEWS = WEB_DATA / "petreviews.json"
