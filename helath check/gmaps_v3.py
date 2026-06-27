"""Google Maps rating scraper v3: name-match + click detail page."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

# All hospitals that need ratings
async def get_hospitals_without_ratings():
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        cur.execute("""SELECT id, name, slug FROM hospitals
                       WHERE rating IS NULL ORDER BY id LIMIT 80""")
        hospitals = cur.fetchall()
    conn.close()
    return hospitals


def hospital_name_keywords(name):
    """Extract keywords to match against Google Maps search result names."""
    # Remove common suffixes, keep core keywords
    name = name.lower()
    stop = ['hospital', 'clinic', 'center', 'centre', 'international', 'limited', 'co.', 'ltd']
    keywords = [w for w in re.split(r'[\s,]+', name) if w not in stop and len(w) > 2]
    return keywords[:3]


async def scrape_hospital_rating(page, hospital):
    name = hospital['name']
    keywords = hospital_name_keywords(name)

    # Search Google Maps
    query = name.replace(' ', '+') + '+Bangkok'
    url = f'https://www.google.com/maps/search/{query}'
    try:
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(3000)

        # Find all result items in the left panel list
        # Each result card in Google Maps has class like "Nv2PK" or similar
        # Let's find cards by looking for rating elements near place names

        # Strategy: find all anchor links to /maps/place/
        result_links = await page.query_selector_all('a[href*="/maps/place/"]')

        # For each result, find the containing card and check if it has our hospital name
        for link in result_links[:10]:
            # Get the text content of the parent container (result card)
            parent = await link.evaluate_handle('el => el.closest("[role=article], .Nv2PK, .THOPZb, [jsaction]") || el.parentElement.parentElement')
            if parent:
                card_text = await parent.evaluate('el => el.innerText || el.textContent || ""')
                card_text_lower = card_text.lower()

                # Check if this card contains our hospital's name keywords
                match_count = sum(1 for kw in keywords if kw in card_text_lower)
                if match_count >= min(2, len(keywords)):
                    # Click this result
                    await link.click()
                    await page.wait_for_timeout(3000)

                    # Now on detail page - get rating
                    detail_html = await page.content()

                    # Look for rating in detail page - Thai format
                    matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', detail_html)
                    if matches:
                        rating, count_str = matches[0]
                        count = int(count_str.replace(',', ''))
                        return float(rating), count

                    # English format on detail page
                    m = re.search(r'"ratingValue"\s*:\s*"?([\d.]+)"?', detail_html)
                    if m:
                        rating = float(m.group(1))
                        c = re.search(r'"reviewCount"\s*:\s*"?([\d]+)"?', detail_html)
                        count = int(c.group(1)) if c else 0
                        return rating, count

                    # Look for star rating in known Google Maps class (F7nice)
                    el = await page.query_selector('.F7nice')
                    if el:
                        text = await el.inner_text()
                        m = re.search(r'([\d.]+)', text)
                        if m:
                            r = float(m.group(1))
                            if 1.0 <= r <= 5.0:
                                # Get review count
                                count_el = await page.query_selector('.F7nice + span, [aria-label*="รีวิว"]')
                                count = 0
                                if count_el:
                                    ct = await count_el.inner_text()
                                    cm = re.search(r'([\d,]+)', ct)
                                    if cm:
                                        count = int(cm.group(1).replace(',', ''))
                                return r, count

                    # Go back and try next
                    await page.go_back()
                    await page.wait_for_timeout(2000)

        # Fallback: read first rating from search results page
        html = await page.content()
        matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
        for rating_str, count_str in matches:
            count = int(count_str.replace(',', ''))
            if 500 < count < 50000:  # Reasonable hospital review count
                return float(rating_str), count

        return None, None
    except Exception as e:
        print(f'    ERROR: {e}')
        return None, None


async def main():
    hospitals = await get_hospitals_without_ratings()
    print(f'Hospitals without ratings: {len(hospitals)}')

    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    updated = 0

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, args=[
            '--disable-blink-features=AutomationControlled',
        ])
        context = await browser.new_context(
            locale='th-TH',
            timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
            viewport={'width': 1280, 'height': 800},
        )
        page = await context.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        for h in hospitals:
            rating, count = await scrape_hospital_rating(page, h)
            if rating:
                with conn.cursor() as cur:
                    cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE id=%s",
                                (rating, count, h['id']))
                print(f'  ★{rating} ({count:,}) {h["name"][:40]}')
                updated += 1
            else:
                print(f'  - {h["name"][:40]}')
            await asyncio.sleep(1.5)

        await browser.close()

    print(f'\nUpdated: {updated}/{len(hospitals)} hospitals')

    with conn.cursor() as cur:
        cur.execute("""SELECT name, rating, review_count FROM hospitals
                       WHERE rating IS NOT NULL ORDER BY review_count DESC LIMIT 20""")
        print('\n=== Top rated hospitals ===')
        for r in cur.fetchall():
            print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"][:40]}')

        cur.execute("SELECT COUNT(*) n, COUNT(rating) nr FROM hospitals")
        r = cur.fetchone()
        print(f'\nTotal: {r["n"]} hospitals, {r["nr"]} with ratings')

    conn.close()

asyncio.run(main())
