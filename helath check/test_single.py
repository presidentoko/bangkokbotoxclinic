"""Test: click through to Bumrungrad detail page and read rating."""
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
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        # Search for Bumrungrad
        await page.goto('https://www.google.com/maps/search/Bumrungrad+International+Hospital+Bangkok', wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(4000)

        # Find and click the first result
        links = await page.query_selector_all('a[href*="/maps/place/"]')
        print(f'Found {len(links)} place links')

        if links:
            first_link = links[0]
            href = await first_link.get_attribute('href')
            print(f'First link href: {href[:100]}')
            await first_link.click()
            await page.wait_for_timeout(4000)

            # Read detail page
            detail_html = await page.content()
            print(f'Detail page size: {len(detail_html):,}')

            # Thai pattern
            matches = re.findall(r'aria-label="([\d.]+)\s*ดาว\s*([\d,]+)\s*รีวิว"', detail_html)
            print(f'Thai ratings: {matches[:5]}')

            # Look for prominent rating display
            el = await page.query_selector('.F7nice')
            if el:
                text = await el.inner_text()
                print(f'F7nice text: {text}')

            # All numbers that look like ratings near review text
            snippets = re.findall(r'.{0,50}รีวิว.{0,50}', detail_html)
            for s in snippets[:5]:
                clean = re.sub(r'<[^>]+>', '', s)
                print(f'  Review snippet: {clean}')

            # Save for inspection
            with open('detail_bumrungrad.html', 'w', encoding='utf-8') as f:
                f.write(detail_html)
            print('\nSaved detail_bumrungrad.html')

        await page.wait_for_timeout(2000)
        await browser.close()

asyncio.run(main())
