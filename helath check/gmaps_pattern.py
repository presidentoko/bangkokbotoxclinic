"""Find rating pattern in full Google Maps HTML."""
import re, json, asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(locale='en-US')
        page = await context.new_page()

        await page.goto('https://www.google.com/maps/search/Bumrungrad+International+Hospital+Bangkok', wait_until='domcontentloaded')
        await page.wait_for_timeout(4000)

        html = await page.content()
        print(f'Full HTML size: {len(html):,}')

        # Look for rating patterns
        # Google Maps uses patterns like: 4.3 (14,236 reviews)
        # In the DOM it's usually in an aria-label

        # Try to click on first result
        try:
            # Google Maps search results - click the first one
            await page.click('[data-value="bumrungrad"]', timeout=3000)
        except Exception:
            pass

        # Look for specific elements
        for selector in [
            '[aria-label*="star"]',
            '[role="img"][aria-label]',
            '.fontBodyMedium',
            'span[aria-label]',
            '.F7nice',  # Google Maps rating class
        ]:
            try:
                els = await page.query_selector_all(selector)
                for el in els[:3]:
                    text = await el.inner_text()
                    label = await el.get_attribute('aria-label')
                    if text or label:
                        val = text or label
                        if re.search(r'[\d.]{3}', val):
                            print(f'Selector {selector}: text={text!r} label={label!r}')
            except Exception:
                pass

        # Save full HTML
        with open('cache/gmaps_bumrungrad_full.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Saved full HTML')

        # Find aria-labels with ratings
        aria_labels = re.findall(r'aria-label="([^"]*(?:star|review|rating)[^"]*)"', html, re.IGNORECASE)
        print(f'\nAria labels with star/review: {aria_labels[:10]}')

        # Try Google's specific format
        # Rating appears as "4.3 stars" or similar
        stars = re.findall(r'([\d.]+)\s*stars?\s*(?:out of 5\s*)?([\d,]+)\s*(?:review|Google review)', html, re.IGNORECASE)
        print(f'Star patterns: {stars[:5]}')

        # Look for the number pattern typical in Google Maps
        # Often encoded as: "4.3","(14,236)"  or similar
        nums = re.findall(r'"(4\.[0-9])","(\([0-9,]+\))"', html)
        if nums:
            print(f'Rating tuples: {nums[:3]}')

        await browser.close()

asyncio.run(main())
