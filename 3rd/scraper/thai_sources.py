"""Thai secondary-market sources.

Every price on this site used to come from Vestiaire Collective — a US site,
in USD, converted at the day's rate. For handbags that lands close enough to
Bangkok reality to have gone unnoticed. For watches it does not:

    Rolex Datejust 41   site: 579,000-767,000 THB    Thai dealers: 399,000
    Rolex Datejust 36   site: 438,000-452,000 THB    Thai dealers: 249,000

The site's whole promise is telling someone in Thailand what a thing costs
in Thailand, and on its best-performing category it was roughly 1.5-2x out.

These sources are Thai dealers selling into the Thai market, quoted in baht.
Four run WooCommerce with the Store API left open and one runs Shopify with
products.json open; both are public read-only product endpoints, the same
data the shop's own front page renders. We read prices and titles to compute
aggregate statistics and link back to the listing.

We also keep each listing's thumbnail URL. The image is not copied: it stays
on the dealer's own server and the visitor's browser fetches it from there,
next to that dealer's name and a link to that dealer's listing. Our referrer
goes with the request on purpose, so a shop looking at its logs can see the
traffic arriving rather than an anonymous drain — this is the same exchange
any price-comparison engine makes. We take the small `thumbnail` derivative
where the shop publishes one, never the full-size original.

Politeness: the whole sweep is ~30 requests once a week, one second apart.

Checked 2026-08-25:
    usedbrand88.com        WooCommerce   140 products   minor_unit=2  bags
    brandnamevoyage.com    WooCommerce  1500 products   minor_unit=0  bags
    timethaibytag.com      WooCommerce    91 products   minor_unit=0  watches
    conradtime.com         WooCommerce   572 products   minor_unit=0  watches
    pixiuwatch.com         Shopify      1750 products                 watches
    hi-watch.com           no wp-json (404) — HTML only, not worth the fragility
    carousell.co.th        connection refused to non-browser clients
    minniebrands.com       TLS handshake fails from here
"""
from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request

UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
)

# `kind` decides which reader runs. `label` is what the site shows a visitor,
# so it is the dealer's own name rather than a hostname.
SOURCES = [
    {
        'id': 'usedbrand88',
        'label': 'UsedBrand88',
        'url': 'https://usedbrand88.com',
        'kind': 'woocommerce',
        'focus': 'handbags',
    },
    {
        'id': 'brandnamevoyage',
        'label': 'Brandname Voyage',
        'url': 'https://brandnamevoyage.com',
        'kind': 'woocommerce',
        'focus': 'handbags',
    },
    {
        'id': 'timethaibytag',
        'label': 'Time Thai by TAG',
        'url': 'https://www.timethaibytag.com',
        'kind': 'woocommerce',
        'focus': 'watches',
    },
    {
        'id': 'conradtime',
        'label': 'Conrad Time',
        'url': 'https://conradtime.com',
        'kind': 'woocommerce',
        'focus': 'watches',
    },
    {
        'id': 'pixiuwatch',
        'label': 'Pixiu Watch',
        'url': 'https://pixiuwatch.com',
        'kind': 'shopify',
        'focus': 'watches',
    },
]

MAX_PAGES = 20
PAGE_SLEEP = 1.0
TIMEOUT = 40

# A page that fails is retried before the catalogue is given up on.
#
# Worth the twenty lines: pagination used to stop at the first failed page and
# return what it had as though that were the whole shop. On 2026-08-31
# brandnamevoyage — 2,000 of 2,879 listings, two thirds of everything this
# site knows — returned 300 because page four timed out once. Pages three,
# four and five all answered on the very next attempt. Individual page
# latency at these shops swings between 1.6s and 9.6s, so an occasional
# dropped connection is the normal weather here, not an outage.
PAGE_RETRIES = 3
RETRY_BACKOFF = 6.0


class PageFailed(Exception):
    """A page could not be read after PAGE_RETRIES attempts."""


def _get(url: str) -> str:
    last: Exception | None = None
    for attempt in range(1, PAGE_RETRIES + 1):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.read().decode('utf-8', 'replace')
        except Exception as e:  # noqa: BLE001 - any transport failure is retryable here
            last = e
            if attempt < PAGE_RETRIES:
                time.sleep(RETRY_BACKOFF * attempt)
    raise PageFailed(f'{type(last).__name__}: {last}')


# Only https images are kept: the pages that show them are https, and a http
# thumbnail would be blocked as mixed content rather than merely ugly.
def _https(url: object) -> str:
    return url if isinstance(url, str) and url.startswith('https://') else ''


def _woo_image(product: dict) -> str:
    """The shop's own square derivative, falling back to the full-size file.

    WooCommerce publishes `thumbnail` at 300x300, which is both the size we
    display and the kindest thing to request off someone else's server. Not
    every install generates it, hence the fallback.
    """
    for image in (product.get('images') or []):
        if not isinstance(image, dict):
            continue
        found = _https(image.get('thumbnail')) or _https(image.get('src'))
        if found:
            return found
    return ''


_SHOPIFY_EXT = re.compile(r'\.(jpg|jpeg|png|webp)(\?|$)', re.I)


def _shopify_image(product: dict) -> str:
    """Shopify serves any size off one URL via a `_NxN` suffix inserted
    before the extension, so ask for the small one rather than a 2048px
    original.

    Assembled by slicing on the extension match rather than with a regex
    backreference: the replacement has to carry both the extension and any
    query string through, and a mangled one yields a URL that 404s
    silently behind a lazy-loaded <img>.
    """
    for image in (product.get('images') or []):
        src = _https(image.get('src') if isinstance(image, dict) else None)
        if not src:
            continue
        m = _SHOPIFY_EXT.search(src)
        if not m:
            return src
        ext = m.group(1)
        return src[:m.start()] + '_400x.' + ext + src[m.start() + 1 + len(ext):]
    return ''


def _woocommerce(source: dict) -> tuple[list[dict], bool]:
    """WooCommerce Store API. Returns (listings, reached_the_end).

    The flag matters as much as the listings: a run that stopped early holds a
    fraction of a shop, and the caller must not mistake that for a shop that
    has shrunk.

    `currency_minor_unit` is not the same across shops — usedbrand88 reports
    2 (so "10990000" is 109,900.00 THB) while the other three report 0 (so
    "359000" is 359,000 THB). Dividing by a hard-coded 100 would have priced
    a Chanel Vanity at 1,099 baht.
    """
    out = []
    for page in range(1, MAX_PAGES + 1):
        url = f"{source['url']}/wp-json/wc/store/v1/products?per_page=100&page={page}"
        try:
            chunk = json.loads(_get(url))
        except (PageFailed, json.JSONDecodeError) as e:
            print(f"  [{source['id']}] page {page} gave up after {PAGE_RETRIES} tries: {e}")
            return out, False
        if not isinstance(chunk, list) or not chunk:
            break
        for p in chunk:
            prices = p.get('prices') or {}
            raw = prices.get('price')
            if raw in (None, '', '0'):
                continue
            try:
                price = int(raw) / (10 ** int(prices.get('currency_minor_unit', 0)))
            except (TypeError, ValueError):
                continue
            if prices.get('currency_code') not in (None, 'THB'):
                continue
            out.append({
                'source': source['id'],
                'title': p.get('name') or '',
                'price': price,
                'url': p.get('permalink') or '',
                'in_stock': bool(p.get('is_in_stock', True)),
                'tags': [c.get('name', '') for c in (p.get('categories') or [])],
                'image': _woo_image(p),
            })
        if len(chunk) < 100:
            break
        time.sleep(PAGE_SLEEP)
    return out, True


def _shopify(source: dict) -> tuple[list[dict], bool]:
    """Shopify products.json. Returns (listings, reached_the_end).

    Sold pieces are left listed at price 0, which the price filter below
    drops."""
    out = []
    for page in range(1, MAX_PAGES + 1):
        url = f"{source['url']}/products.json?limit=250&page={page}"
        try:
            chunk = json.loads(_get(url)).get('products', [])
        except (PageFailed, json.JSONDecodeError) as e:
            print(f"  [{source['id']}] page {page} gave up after {PAGE_RETRIES} tries: {e}")
            return out, False
        if not chunk:
            break
        for p in chunk:
            variants = p.get('variants') or []
            price = 0.0
            for v in variants:
                try:
                    price = max(price, float(v.get('price') or 0))
                except (TypeError, ValueError):
                    continue
            if price <= 0:
                continue
            out.append({
                'source': source['id'],
                'title': p.get('title') or '',
                'price': price,
                'url': f"{source['url']}/products/{p.get('handle', '')}",
                'in_stock': any(v.get('available') for v in variants),
                'tags': list(p.get('tags') or []),
                'image': _shopify_image(p),
            })
        if len(chunk) < 250:
            break
        time.sleep(PAGE_SLEEP)
    return out, True


READERS = {'woocommerce': _woocommerce, 'shopify': _shopify}

# Below this a "luxury handbag" listing is a keyring, a dust bag or a repair
# service, and above it is a typo. Retail-relative filtering happens later,
# per item; this is only the outer guard for listings that match nothing.
MIN_PRICE_THB = 1_000
MAX_PRICE_THB = 50_000_000


# Whether a shop also buys from the public, and whether it takes consignment.
# The /sell pages send readers to these shops for a quote, so the claim has to
# be true on the day it is made rather than on the day it was typed — hence
# reading it off the storefront on every run instead of hard-coding it.
BUY_TERMS = ('รับซื้อ', 'we buy', 'buy back', 'buyback', 'ประเมินราคา')
CONSIGN_TERMS = ('ฝากขาย', 'ขายฝาก', 'consign')


def _services(source: dict) -> dict:
    try:
        req = urllib.request.Request(source['url'], headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            html = resp.read().decode('utf-8', 'replace').lower()
    except Exception as e:  # noqa: BLE001
        print(f"  [{source['id']}] storefront unreadable, claiming no services: {e}")
        return {'buys': False, 'consigns': False}
    return {
        'buys': any(t in html for t in BUY_TERMS),
        'consigns': any(t in html for t in CONSIGN_TERMS),
    }


def fetch_all() -> tuple[list[dict], list[dict]]:
    """Returns (listings, source_reports).

    One dealer being down must not empty the site, so a source that fails is
    reported and skipped rather than raised. `source_reports` carries what
    actually answered, which the site shows so a visitor can see how many
    dealers a number rests on.
    """
    listings: list[dict] = []
    reports: list[dict] = []
    for source in SOURCES:
        reader = READERS[source['kind']]
        print(f"[thai] {source['id']} ...", flush=True)
        complete = False
        try:
            found, complete = reader(source)
        except Exception as e:  # noqa: BLE001 - one bad dealer must not stop the sweep
            print(f"  [{source['id']}] unavailable: {e}")
            found = []
        kept = [
            listing for listing in found
            if MIN_PRICE_THB <= listing['price'] <= MAX_PRICE_THB and listing['title']
        ]
        print(
            f"  [{source['id']}] {len(kept)} usable of {len(found)}"
            f"{'' if complete else '  ** TRUNCATED — did not reach the end of the catalogue **'}"
        )
        listings.extend(kept)
        reports.append({
            'id': source['id'],
            'label': source['label'],
            'url': source['url'],
            'focus': source['focus'],
            'listings': len(kept),
            'ok': bool(kept),
            # Distinct from `ok`. A shop that answered three of its twenty
            # pages is "ok" and is also two thirds missing, and the run that
            # discovered this had no way to say so.
            'complete': complete,
            **_services(source),
        })
        time.sleep(PAGE_SLEEP)
    return listings, reports
