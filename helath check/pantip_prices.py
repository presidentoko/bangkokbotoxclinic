"""
pantip_prices.py — Search Pantip for health checkup price mentions,
extract approximate prices per hospital.
"""
import re, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# Hospital names in Thai + English to search
HOSPITALS = [
    ('bumrungrad', 'บำรุงราษฎร์', 'ตรวจสุขภาพ'),
    ('phyathai-1', 'พญาไท 1', 'ตรวจสุขภาพ'),
    ('phyathai-2', 'พญาไท 2', 'ตรวจสุขภาพ'),
    ('bangpakok9', 'บางปะกอก 9', 'ตรวจสุขภาพ'),
    ('vibhavadi', 'วิภาวดี', 'ตรวจสุขภาพ'),
    ('medpark', 'MedPark', 'health checkup price'),
    ('samitivej-sukhumvit', 'สมิติเวช สุขุมวิท', 'ตรวจสุขภาพ ราคา'),
    ('thonburi', 'ธนบุรี', 'ตรวจสุขภาพ ราคา'),
]

PRICE_RE = re.compile(r'(?:฿|บาท|baht)\s*([\d,]+)|(\d{1,3},\d{3})\s*(?:บาท|baht)', re.IGNORECASE)
PRICE_INLINE = re.compile(r'([\d]{1,3}[,\.][\d]{3})\s*(?:บาท|฿|baht)', re.IGNORECASE)


def extract_prices_from_text(text: str) -> list[int]:
    prices = []
    for m in PRICE_RE.finditer(text):
        p_str = m.group(1) or m.group(2)
        if p_str:
            try:
                p = int(p_str.replace(',', '').replace('.', ''))
                if 500 <= p <= 200_000:
                    prices.append(p)
            except ValueError:
                pass
    return prices


def search_pantip(page, hospital_slug: str, thai_name: str, keyword: str) -> dict:
    query = f'{thai_name} {keyword} ราคา'
    url = f'https://pantip.com/search?q={query.replace(" ", "+")}&scope=post'

    try:
        page.goto(url, wait_until='domcontentloaded', timeout=20000)
        time.sleep(2)
        # Get search results text
        text = page.inner_text('body')
    except Exception as e:
        print(f'  [{hospital_slug}] Pantip search error: {e}')
        return {}

    prices = extract_prices_from_text(text)
    if prices:
        price_counts = {}
        for p in prices:
            # Round to nearest 500 for grouping
            rounded = round(p / 500) * 500
            price_counts[rounded] = price_counts.get(rounded, 0) + 1

        # Most mentioned price
        best = sorted(price_counts.items(), key=lambda x: -x[1])
        return {'slug': hospital_slug, 'prices': sorted(set(prices)), 'top': best[:5]}

    return {}


def main():
    results = {}

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
            locale='th-TH',
        )
        page = ctx.new_page()

        for slug, thai_name, keyword in HOSPITALS:
            print(f'\n→ {slug} ({thai_name})')
            result = search_pantip(page, slug, thai_name, keyword)
            if result:
                print(f'  prices found: {result["prices"][:10]}')
                print(f'  most mentioned: {result["top"][:3]}')
                results[slug] = result
            else:
                print(f'  no prices found')
            time.sleep(1.5)

        browser.close()

    print('\n=== Summary ===')
    for slug, data in results.items():
        if data.get('top'):
            top_price = data['top'][0][0]
            print(f'{slug}: most common price ≈ ฿{top_price:,}')


if __name__ == '__main__':
    main()
