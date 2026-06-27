"""Extract hospital ratings from Google Search Knowledge Panel using Playwright."""
import re, asyncio, pymysql
from playwright.async_api import async_playwright
from config import DB_CONFIG

HOSPITALS = [
    ('bumrungrad', 'Bumrungrad International Hospital Bangkok'),
    ('vejthani', 'Vejthani Hospital Bangkok'),
    ('bangkok-hospital', 'Bangkok Hospital BDMS'),
    ('praram9', 'Praram 9 Hospital Bangkok'),
    ('bnh', 'BNH Hospital Bangkok'),
    ('phyathai-2', 'Phyathai 2 Hospital Bangkok'),
    ('samitivej-srinakarin', 'Samitivej Hospital Srinakarin Bangkok'),
    ('samitivej-sukhumvit', 'Samitivej Hospital Sukhumvit Bangkok'),
    ('samitivej-nawamin', 'Samitivej Nawamin Hospital Bangkok'),
    ('paolo-kaset', 'Paolo Hospital Kaset Bangkok'),
    ('paolo-chokchai4', 'Paolo Hospital Chokchai 4 Bangkok'),
    ('paolo-rangsit', 'Paolo Hospital Rangsit Bangkok'),
    ('phyathai-1', 'Phyathai 1 Hospital Bangkok'),
    ('phyathai-3', 'Phyathai 3 Hospital Bangkok'),
    ('sikarin', 'Sikarin Hospital Bangkok'),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            locale='en-US',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0',
        )
        page = await context.new_page()

        conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
        results = {}

        for slug, query in HOSPITALS:
            url = f'https://www.google.com/search?q={query.replace(" ", "+")}&hl=en'
            try:
                await page.goto(url, wait_until='domcontentloaded', timeout=15000)
                await page.wait_for_timeout(2000)
                html = await page.content()

                # Method 1: Knowledge panel rating - Google shows it in aria-label
                # Pattern: aria-label="Rated X.X out of 5" or similar
                m = re.search(r'Rated ([\d.]+) out of 5,? ?([\d,]+)?', html)
                if m:
                    rating = float(m.group(1))
                    count = int(m.group(2).replace(',','')) if m.group(2) else 0
                    if 1.0 <= rating <= 5.0:
                        results[slug] = (rating, count)
                        print(f'  ★{rating} ({count:,}) {slug} [Method1]')
                        continue

                # Method 2: Look for Google's rating in Knowledge Panel
                # <span class="Aq14fc">4.3</span> ... <span>(14,236)</span>
                m = re.search(r'class="[^"]*(?:Aq14fc|RDApEe|fontDisplayLarge)[^"]*"[^>]*>([\d.]+)<', html)
                if m:
                    rating = float(m.group(1))
                    if 1.0 <= rating <= 5.0:
                        count_m = re.search(r'\(([\d,]+)\)', html[m.start():m.start()+200])
                        count = int(count_m.group(1).replace(',','')) if count_m else 0
                        results[slug] = (rating, count)
                        print(f'  ★{rating} ({count:,}) {slug} [Method2]')
                        continue

                # Method 3: JSON-LD structured data
                jsonld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
                found = False
                for j in jsonld:
                    m_rating = re.search(r'"ratingValue"\s*:\s*"?([\d.]+)"?', j)
                    m_count = re.search(r'"(?:reviewCount|ratingCount)"\s*:\s*"?([\d,]+)"?', j)
                    if m_rating:
                        rating = float(m_rating.group(1))
                        count = int(m_count.group(1).replace(',','')) if m_count else 0
                        if 1.0 <= rating <= 5.0:
                            results[slug] = (rating, count)
                            print(f'  ★{rating} ({count:,}) {slug} [JSON-LD]')
                            found = True
                            break
                if found:
                    continue

                # Method 4: Look for star rating text
                m = re.search(r'([\d.]+)\s*(?:stars?|out of 5)\s*[·•\-]\s*([\d,]+)\s*(?:reviews?|Google reviews?)', html, re.IGNORECASE)
                if m:
                    rating = float(m.group(1))
                    count = int(m.group(2).replace(',',''))
                    if 1.0 <= rating <= 5.0 and count > 100:
                        results[slug] = (rating, count)
                        print(f'  ★{rating} ({count:,}) {slug} [Method4]')
                        continue

                print(f'  - {slug} (no rating found)')

            except Exception as e:
                print(f'  ERROR {slug}: {e}')

            await asyncio.sleep(1.5)

        await browser.close()

        # Update DB with found ratings
        updated = 0
        with conn.cursor() as cur:
            for slug, (rating, count) in results.items():
                cur.execute("UPDATE hospitals SET rating=%s, review_count=%s WHERE slug=%s", (rating, count, slug))
                updated += 1

        print(f'\nUpdated {updated} hospitals')

        with conn.cursor() as cur:
            cur.execute("SELECT name, rating, review_count FROM hospitals WHERE rating IS NOT NULL ORDER BY review_count DESC LIMIT 15")
            print('\nFinal ratings:')
            for r in cur.fetchall():
                print(f'  ★{r["rating"]} ({r["review_count"]:,}) {r["name"][:40]}')

        conn.close()

asyncio.run(main())
