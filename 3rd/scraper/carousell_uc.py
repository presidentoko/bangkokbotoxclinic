#!/usr/bin/env python3
"""
Carousell TH scraper using undetected-chromedriver (Cloudflare bypass).
Run: python 3rd/scraper/carousell_uc.py
"""
import json, time, random, subprocess, re
from datetime import datetime
from pathlib import Path

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

CONDITION_MAP = {
    'brand new': 'excellent', 'like new': 'excellent',
    'lightly used': 'very_good', 'well used': 'good', 'heavily used': 'good',
}

def normalize_condition(label: str) -> str:
    l = label.lower().strip()
    for k, v in CONDITION_MAP.items():
        if k in l:
            return v
    return 'good'

def recalculate_ranges(samples):
    by_cond = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {c: {'min': int(min(p)), 'max': int(max(p))} for c, p in by_cond.items() if p}

def trim_samples(samples, keep=30):
    return sorted(samples, key=lambda s: s['date'])[-keep:]

SGD_TO_THB = 27.0  # 1 SGD ≈ 27 THB

def extract_prices_from_page(driver) -> list:
    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    try:
        time.sleep(6)
        items = driver.execute_script('''
            const results = [];
            // Use data-testid listing cards (confirmed in page source)
            const cards = document.querySelectorAll("[data-testid^='listing-card-']");
            cards.forEach(card => {
                // Find all text nodes with price pattern
                const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
                let priceText = '', condText = '';
                let node;
                while (node = walker.nextNode()) {
                    const t = node.textContent.trim();
                    if (t.match(/^S\\$[\\d,]+$/) || t.match(/^\\$[\\d,]+$/)) priceText = t;
                    if (/brand new|like new|lightly used|well used|heavily used/i.test(t)) condText = t;
                }
                if (!priceText) return;
                const match = priceText.match(/[\\d,]+/);
                if (!match) return;
                const priceSGD = parseInt(match[0].replace(/,/g, ''));
                if (priceSGD < 30 || priceSGD > 200000) return;
                results.push({priceSGD, condition: condText || 'used'});
            });
            return results;
        ''')

        for item in (items or []):
            price_thb = round(item['priceSGD'] * SGD_TO_THB / 500) * 500
            results.append({
                'price': int(price_thb),
                'condition': normalize_condition(item.get('condition', 'used')),
                'platform': 'carousell_th',
                'date': today,
            })
    except Exception as e:
        print(f'  [extract err] {type(e).__name__}: {str(e)[:80]}')
    return results

def search_carousell(driver, query: str) -> list:
    encoded = query.replace(' ', '+')
    url = f'https://www.carousell.sg/search/?search={encoded}&country_code=TH&sort_by=3'
    try:
        driver.get(url)
        time.sleep(5)
    except Exception as e:
        print(f'  [nav] {e}')
    return extract_prices_from_page(driver)

def run():
    with open(DB_PATH) as f:
        db = json.load(f)

    print('Launching Chrome (undetected)...')
    options = uc.ChromeOptions()
    options.add_argument('--lang=th-TH')
    options.add_argument('--window-size=1280,800')

    driver = uc.Chrome(
        options=options,
        headless=False,
        use_subprocess=True,
        version_main=149,
    )
    print('Chrome launched. Starting searches...')

    # Warm up - visit carousell.com first to get past any initial challenge
    try:
        driver.get('https://www.carousell.com/')
        time.sleep(5)
        print(f'Warmed up: {driver.current_url}')
    except Exception as e:
        print(f'Warmup error: {e}')

    updated = 0
    try:
        for item in db['items']:
            if item['category'] not in ('handbags', 'watches'):
                continue
            query = f'{item["brand"]} {item["model"]}'
            print(f'Searching: {query}')
            new_samples = search_carousell(driver, query)
            print(f'  → {len(new_samples)} prices found')
            if new_samples:
                item['price_samples'] = trim_samples(item.get('price_samples', []) + new_samples)
                item['price_ranges'] = recalculate_ranges(item['price_samples'])
                item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                updated += 1
            time.sleep(random.uniform(3, 6))
    finally:
        driver.quit()

    print(f'Updated {updated} items')
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
    if staged.returncode != 0:
        subprocess.run(['git', 'commit', '-m', f'chore(data): carousell_th prices {datetime.now():%Y-%m-%d}'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print('Pushed.')

if __name__ == '__main__':
    run()
