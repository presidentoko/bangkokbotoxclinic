"""
Thin client for Vestiaire Collective's public search API.

The same endpoint the storefront's listing pages call. No login, no browser.
What makes it worth more than the asking-price scrape this repo already had
(price_sampler.py) is the `sold` filter: it returns listings that actually
sold, with the price they sold at and the date they were listed — a record of
what people paid rather than what sellers hoped for.

Rules learned the hard way:
  * Filter on `model.id`, never on the free-text query alone. "Chanel Classic
    Flap Medium" as text ranks wallets, earrings and other brands' flaps
    alongside the bag.
  * `totalHits` caps at 10,000. For a real count read the facet, which is
    exact.
  * `createdAt` is when the listing went up, not when it sold. Monthly series
    built from it are "sold listings, by month listed" and must say so.
"""
from __future__ import annotations

import random
import time
import uuid

import requests

SEARCH_API = 'https://search.vestiairecollective.com/v1/product/search'

_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://us.vestiairecollective.com/',
    'Origin': 'https://us.vestiairecollective.com',
    'x-usecase': 'plpStandard',
}

LOCALE = {'country': 'US', 'currency': 'USD', 'language': 'us'}

FIELDS = ['name', 'description', 'price', 'condition', 'model', 'brand',
          'baseCategory', 'category', 'createdAt', 'sold', 'link']

# Vestiaire's five grades folded into the three a buyer actually compares.
GRADE = {1: 'A', 2: 'A', 3: 'B', 4: 'C', 5: 'C'}


class SearchError(RuntimeError):
    pass


def search(query: str = '', filters: dict | None = None, offset: int = 0,
           limit: int = 100, facets: list[str] | None = None,
           sort: str = 'recency', retries: int = 3) -> dict:
    body = {
        'pagination': {'offset': offset, 'limit': limit},
        'q': query,
        'fields': FIELDS,
        'sortBy': sort,
        'filters': filters or {},
        'locale': LOCALE,
        'facets': {'fields': facets or [], 'stats': ['price']},
    }
    last = None
    for attempt in range(retries):
        headers = {**_HEADERS, 'x-deviceid': str(uuid.uuid4()),
                   'x-search-session-id': str(uuid.uuid4())}
        try:
            r = requests.post(SEARCH_API, headers=headers, json=body, timeout=30)
            if r.status_code == 200:
                return r.json()
            last = f'HTTP {r.status_code}: {r.text[:120]}'
        except requests.RequestException as e:
            last = str(e)
        time.sleep(2 + attempt * 3 + random.random())
    raise SearchError(last or 'unknown')


def facet(resp: dict, name: str) -> list[dict]:
    return ((resp.get('facets') or {}).get('fields') or {}).get(name) or []


def listing(raw: dict) -> dict | None:
    """Normalise one API item. None for anything without a usable price."""
    price = (raw.get('price') or {}).get('cents')
    if not price or (raw.get('price') or {}).get('currency') != 'USD':
        return None
    cond = (raw.get('condition') or {}).get('id')
    return {
        'id': raw.get('id'),
        'price': round(price / 100),
        'grade': GRADE.get(cond),
        'model_id': (raw.get('model') or {}).get('id'),
        'brand': (raw.get('brand') or {}).get('name') or '',
        'base': (raw.get('baseCategory') or {}).get('label') or '',
        'name': raw.get('name') or '',
        'text': ((raw.get('name') or '') + '\n' + (raw.get('description') or '')).lower(),
        'listed': raw.get('createdAt'),
        'sold': bool(raw.get('sold')),
        'link': raw.get('link') or '',
    }


def fetch(model_ids: list[int], sold: bool, max_items: int,
          pause: tuple[float, float] = (0.8, 1.6)) -> tuple[list[dict], dict]:
    """Newest-first listings for these Vestiaire models, plus the exact counts
    by condition from the facet (all sizes — the facet can't see our size
    rules)."""
    filters = {'model.id': model_ids, 'sold': ['1' if sold else '0']}
    out: list[dict] = []
    counts: dict = {}
    offset = 0
    while offset < max_items:
        resp = search(filters=filters, offset=offset, limit=100,
                      facets=['condition'] if offset == 0 else None)
        if offset == 0:
            counts = {str(c['id']): c['count'] for c in facet(resp, 'condition')}
        items = resp.get('items') or []
        out.extend(x for x in (listing(i) for i in items) if x)
        if len(items) < 100:
            break
        offset += 100
        time.sleep(random.uniform(*pause))
    return out, counts
