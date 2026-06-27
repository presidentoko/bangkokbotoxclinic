"""Debug: look at actual HTML from Google search."""
import re, asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            locale='en-US',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0',
        )
        page = await context.new_page()

        url = 'https://www.google.com/search?q=Bumrungrad+International+Hospital&hl=en'
        await page.goto(url, wait_until='domcontentloaded', timeout=15000)
        await page.wait_for_timeout(2000)
        html = await page.content()

        print(f'HTML size: {len(html):,} chars')

        # Look for any rating patterns
        print('\n--- Rating patterns ---')
        for pattern in [
            r'([\d.]+)\s*(?:stars?|out of 5)',
            r'Rated\s+([\d.]+)',
            r'rating["\s]*:\s*([\d.]+)',
            r'aria-label="[^"]*[\d.]+[^"]*(?:star|review)',
            r'([\d.]+)\s*★',
            r'\b([4-5]\.\d)\b',
        ]:
            matches = re.findall(pattern, html, re.IGNORECASE)
            if matches:
                print(f'  {pattern[:40]}: {matches[:5]}')

        # Look for review counts
        print('\n--- Review count patterns ---')
        for pattern in [
            r'([\d,]+)\s*(?:reviews?|Google reviews?)',
            r'"reviewCount"\s*:\s*"?([\d,]+)',
            r'\(([\d,]+)\)\s*(?:reviews?|Google)',
        ]:
            matches = re.findall(pattern, html, re.IGNORECASE)
            if matches:
                print(f'  {pattern[:40]}: {matches[:5]}')

        # Show snippets around "Bumrungrad" and "rating"
        idx = html.lower().find('4.3')
        if idx == -1:
            idx = html.lower().find('4.')
        if idx > 0:
            snippet = html[max(0, idx-100):idx+200]
            print(f'\n--- Snippet around first 4.x ---')
            print(repr(snippet[:300]))

        # Try to find review info
        idx = html.lower().find('review')
        if idx > 0:
            snippet = html[max(0, idx-50):idx+150]
            print(f'\n--- First "review" snippet ---')
            print(repr(snippet))

        await browser.close()

asyncio.run(main())
