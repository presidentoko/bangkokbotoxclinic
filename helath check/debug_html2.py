"""Debug: check what Google actually blocks, try Google Maps directly."""
import re, asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Use stealth-like settings
        browser = await p.chromium.launch(headless=False, args=[
            '--disable-blink-features=AutomationControlled',
            '--lang=th-TH',
        ])
        context = await browser.new_context(
            locale='th-TH',
            timezone_id='Asia/Bangkok',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36',
            viewport={'width': 1280, 'height': 720},
            extra_http_headers={
                'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        )
        page = await context.new_page()

        # Hide automation
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        """)

        # Try Google Maps directly for Bumrungrad
        url = 'https://www.google.com/maps/search/Bumrungrad+International+Hospital+Bangkok'
        print(f'Navigating to: {url}')
        await page.goto(url, wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(5000)
        html = await page.content()
        print(f'HTML size: {len(html):,} chars')

        # Find rating
        matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', html)
        print(f'Thai pattern matches: {matches[:5]}')

        # Also try English
        matches_en = re.findall(r'aria-label="([\d.]+)\s*stars?\s*([\d,]+)\s*reviews?"', html, re.IGNORECASE)
        print(f'English pattern matches: {matches_en[:5]}')

        # General star counts
        any_stars = re.findall(r'([\d.]+)\s*(?:ดาว|stars?)', html, re.IGNORECASE)
        print(f'Any star patterns: {any_stars[:10]}')

        # Save HTML for inspection
        with open('debug_maps.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'\nSaved debug_maps.html ({len(html):,} chars)')

        await browser.close()

asyncio.run(main())
