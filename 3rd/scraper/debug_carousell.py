#!/usr/bin/env python3
"""Debug script to capture Carousell HTML and find correct selectors."""
import time, re
from pathlib import Path
import undetected_chromedriver as uc

options = uc.ChromeOptions()
options.add_argument('--lang=th-TH')
options.add_argument('--window-size=1280,800')

driver = uc.Chrome(options=options, headless=False, use_subprocess=True, version_main=149)

try:
    driver.get('https://www.carousell.com/')
    time.sleep(5)
    print('Home:', driver.current_url)

    driver.get('https://www.carousell.com/search/?search=Chanel+bag&country_code=TH&sort_by=3')
    time.sleep(6)
    print('Search URL:', driver.current_url)

    html = driver.page_source
    out = Path('scraper/carousell_debug.html')
    out.write_text(html, encoding='utf-8')
    print(f'HTML saved: {len(html)} chars → {out}')

    # Try to find price patterns
    prices = re.findall(r'฿\s*[\d,]+', html)
    print(f'Price patterns found: {prices[:10]}')

    # Try JS extraction
    result = driver.execute_script('''
        const all = document.querySelectorAll('*');
        const priceEls = [];
        all.forEach(el => {
            const t = el.textContent || '';
            if (t.match(/^฿[\\d,]+$/) && el.children.length === 0) {
                priceEls.push({tag: el.tagName, cls: el.className, text: t.trim()});
            }
        });
        return priceEls.slice(0, 20);
    ''')
    print('Price elements found:', result)

    # Also try to get all class names with 'price' in them
    classes = driver.execute_script('''
        const els = document.querySelectorAll('[class]');
        const found = new Set();
        els.forEach(el => {
            if (el.className && el.className.toLowerCase && el.className.toLowerCase().includes('price')) {
                found.add(el.className);
            }
        });
        return [...found].slice(0, 20);
    ''')
    print('Classes with "price":', classes)

finally:
    time.sleep(3)
    driver.quit()
