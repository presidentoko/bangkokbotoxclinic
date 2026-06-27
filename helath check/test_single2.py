"""Debug: what's on the Google Maps page?"""
import re, asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            locale='th-TH',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
            viewport={'width': 1280, 'height': 800},
        )
        page = await context.new_page()

        url = 'https://www.google.com/maps/search/Bumrungrad+International+Hospital+Bangkok'
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(5000)

        html = await page.content()
        print(f'Page URL after nav: {page.url}')
        print(f'HTML size: {len(html):,}')

        # Count various selectors
        for sel in ['a[href*="maps/place"]', '[jsaction]', 'a[href]', 'button', 'input']:
            els = await page.query_selector_all(sel)
            print(f'  {sel}: {len(els)}')

        # Find all hrefs
        hrefs = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a[href]')).map(a => a.href).filter(h => h.includes('maps')).slice(0, 20)
        }""")
        print(f'\nMap hrefs: {hrefs[:10]}')

        # Look for rating patterns
        matches = re.findall(r'([\d.]+)\s*ดาว', html)
        print(f'\nStar patterns: {matches[:10]}')

        # Page title
        title = await page.title()
        print(f'Page title: {title}')

        # Save
        with open('debug_maps2.html', 'w', encoding='utf-8') as f:
            f.write(html)

        await browser.close()

asyncio.run(main())
