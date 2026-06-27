"""Extract Phyathai package cards with names + prices."""
import re, time, json, pymysql
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

URLS = {
    'phyathai-1': 'https://www.phyathai.com/en/pyt1/package',
    'phyathai-2': 'https://www.phyathai.com/en/pyt2/package',
}

results = {}

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1400, 'height': 900}, locale='en-US')
    page = ctx.new_page()

    for slug, url in URLS.items():
        print(f'\n=== {slug} ===')
        page.goto(url, wait_until='networkidle', timeout=30000)
        time.sleep(4)

        # Try JSON-LD first
        jsons = page.query_selector_all('script[type="application/ld+json"]')
        for s in jsons:
            try:
                d = json.loads(s.inner_text())
                if isinstance(d, list): d = d[0]
                if d.get('@type') in ('Product', 'Offer', 'ItemList'):
                    print(f'  JSON-LD: {json.dumps(d)[:200]}')
            except Exception:
                pass

        # Try to find card elements with price
        # Usually: card container has name + price in siblings
        cards = []

        # Method 1: data attributes
        elems = page.query_selector_all('[data-price], [data-event-value]')
        for el in elems:
            price_attr = el.get_attribute('data-price') or ''
            name_attr = el.get_attribute('data-event-value') or el.get_attribute('data-name') or ''
            if price_attr:
                cards.append({'name': name_attr, 'price': price_attr})

        # Method 2: look for price spans near package names
        if not cards:
            # Get all visible text nodes near prices
            inner = page.evaluate("""() => {
                const cards = [];
                // Find all elements containing price pattern
                const priceEls = Array.from(document.querySelectorAll('*')).filter(el => {
                    const t = el.innerText || '';
                    return /฿[\d,]+/.test(t) && t.length < 500 && el.children.length < 5;
                });
                priceEls.forEach(el => {
                    const txt = el.innerText.trim();
                    const priceM = txt.match(/฿([\d,]+)/);
                    if (!priceM) return;
                    // Find nearest heading or name
                    let name = '';
                    let parent = el.parentElement;
                    for (let i = 0; i < 6 && parent; i++) {
                        const h = parent.querySelector('h1,h2,h3,h4,h5,p,span');
                        if (h && h.innerText && !h.innerText.includes('฿')) {
                            name = h.innerText.trim().split('\\n')[0];
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    cards.push({name, price: parseInt(priceM[1].replace(/,/g, ''))});
                });
                return cards;
            }""")
            cards = [c for c in inner if c.get('price', 0) > 1000]

        # Method 3: parse full text with line context
        if not cards:
            text = page.inner_text('body')
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            for i, line in enumerate(lines):
                m = re.search(r'฿([\d,]+)', line)
                if m:
                    price = int(m.group(1).replace(',',''))
                    if 1000 < price < 200000:
                        # Look back for name
                        name = ''
                        for j in range(i-1, max(i-5, -1), -1):
                            if lines[j] and not re.search(r'฿|THB|\d{4,}', lines[j]):
                                name = lines[j]
                                break
                        cards.append({'name': name, 'price': price})

        print(f'  Found {len(cards)} cards')
        for c in cards[:20]:
            print(f'  ฿{c.get("price","?"):,}  {c.get("name","?")[:60]}')

        results[slug] = cards

    browser.close()

# Update DB
conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    for slug, cards in results.items():
        cur.execute("SELECT id FROM hospitals WHERE slug=%s", (slug,))
        row = cur.fetchone()
        if not row:
            print(f'Hospital not found: {slug}')
            continue
        hosp_id = row['id']

        cur.execute("SELECT id, name, price FROM checkup_packages WHERE hospital_id=%s", (hosp_id,))
        pkgs = cur.fetchall()
        print(f'\n{slug}: {len(pkgs)} packages in DB')

        for c in cards:
            name = (c.get('name') or '').strip()
            price = c.get('price', 0)
            if not name or not price:
                continue
            # Match to DB package
            match = None
            for p in pkgs:
                if p['name'].lower() in name.lower() or name.lower() in p['name'].lower():
                    match = p
                    break
            if match and not match['price']:
                cur.execute("UPDATE checkup_packages SET price=%s WHERE id=%s", (price, match['id']))
                print(f'  ✓ {match["name"][:50]} → ฿{price:,}')

conn.close()
print('\ndone')
