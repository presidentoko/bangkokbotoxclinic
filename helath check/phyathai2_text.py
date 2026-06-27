"""Extract Phyathai package text and find name+price pairs."""
import re, time
from playwright.sync_api import sync_playwright

PRICE_RE = re.compile(r'[฿฿]([\d,]+)')

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900}, locale='en-US')
    page = ctx.new_page()

    for slug, url in [
        ('phyathai-1', 'https://www.phyathai.com/en/pyt1/package'),
        ('phyathai-2', 'https://www.phyathai.com/en/pyt2/package'),
    ]:
        print(f'\n=== {slug} ===')
        page.goto(url, wait_until='networkidle', timeout=25000)
        time.sleep(5)

        text = page.inner_text('body')
        lines = [l.strip() for l in text.split('\n') if l.strip()]

        # Print context around prices
        for i, line in enumerate(lines):
            m = PRICE_RE.search(line)
            if m:
                price = int(m.group(1).replace(',', ''))
                if 1000 < price < 200000:
                    context = lines[max(0,i-4):i+2]
                    print(f'  ฿{price:,}')
                    for c in context:
                        print(f'    | {c[:90]}')

    browser.close()
