"""Extract Phyathai-2 package cards name + price."""
import re, time, json
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900}, locale='en-US')
    page = ctx.new_page()

    for slug, url in [('phyathai-1','https://www.phyathai.com/en/pyt1/package/health-checkup'),
                       ('phyathai-2','https://www.phyathai.com/en/pyt2/package/health-checkup')]:
        print(f'\n=== {slug} ===')
        try:
            page.goto(url, wait_until='networkidle', timeout=25000)
        except Exception:
            # Try base package page
            base = f'https://www.phyathai.com/en/{"pyt1" if "1" in slug else "pyt2"}/package'
            page.goto(base, wait_until='networkidle', timeout=25000)
        time.sleep(4)

        # Extract all card-like containers
        cards_data = page.evaluate("""() => {
            const results = [];
            // Find all price-containing elements
            document.querySelectorAll('*').forEach(el => {
                const text = el.innerText || '';
                if (!text.match(/฿[\d,]+/)) return;
                if (text.length > 600) return;
                if (el.children.length > 8) return;
                const lines = text.split('\\n').map(l => l.trim()).filter(Boolean);
                const nameLine = lines.find(l => !l.match(/^[฿\\d,]+$/) && !l.match(/^฿/) && l.length > 5);
                const priceMatch = text.match(/฿([\d,]+)/);
                if (nameLine && priceMatch) {
                    const price = parseInt(priceMatch[1].replace(/,/g,''));
                    if (price > 1000 && price < 200000) {
                        results.push({name: nameLine, price, full: lines.join(' | ')});
                    }
                }
            });
            // Deduplicate
            const seen = new Set();
            return results.filter(r => {
                const k = r.name + r.price;
                if (seen.has(k)) return false;
                seen.add(k); return true;
            });
        }""")

        for c in cards_data:
            if 1000 < c['price'] < 200000:
                print(f'  ฿{c["price"]:,}  {c["name"][:60]}')
                if c.get('full') and len(c['full']) < 150:
                    print(f'         full: {c["full"][:100]}')

    browser.close()
