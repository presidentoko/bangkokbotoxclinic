#!/usr/bin/env python3
"""Debug v2 - wait for React render, capture API via CDP."""
import time, json
from pathlib import Path
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = uc.ChromeOptions()
options.add_argument('--lang=th-TH')
options.add_argument('--window-size=1280,900')
options.set_capability('goog:loggingPrefs', {'performance': 'ALL'})

driver = uc.Chrome(options=options, headless=False, use_subprocess=True, version_main=149)

try:
    # Enable network interception via CDP
    driver.execute_cdp_cmd('Network.enable', {})

    driver.get('https://www.carousell.com/')
    time.sleep(4)
    print('Home:', driver.current_url)

    # Navigate to Thailand search
    driver.get('https://www.carousell.sg/search/?search=Chanel+bag&country_code=TH&sort_by=3')
    print('Navigated to search. Waiting 20s for React...')
    time.sleep(20)
    print('Current URL:', driver.current_url)

    # Check page title
    print('Title:', driver.title)

    # Try broad price selector
    all_text = driver.execute_script('''
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const texts = [];
        let node;
        while (node = walker.nextNode()) {
            const t = node.textContent.trim();
            if (t.match(/^[฿S$]\\s*[\\d,]+/) || t.match(/[\\d,]+ ?(THB|SGD|บาท)/)) {
                texts.push({text: t, parent: node.parentElement.tagName + '.' + node.parentElement.className.substring(0,50)});
            }
        }
        return texts.slice(0, 30);
    ''')
    print(f'Price-like texts: {len(all_text)}')
    for t in all_text[:10]:
        print(f'  {t}')

    # Check performance logs for API calls
    logs = driver.get_log('performance')
    api_calls = []
    for log in logs:
        msg = json.loads(log['message'])
        if msg.get('message', {}).get('method') == 'Network.responseReceived':
            url = msg['message']['params']['response'].get('url', '')
            if 'api' in url.lower() and 'carousell' in url.lower():
                api_calls.append(url)

    print(f'\nAPI calls ({len(api_calls)}):')
    for url in api_calls[:15]:
        print(f'  {url}')

    # Save HTML
    html = driver.page_source
    Path('scraper/carousell_debug2.html').write_text(html, encoding='utf-8')
    print(f'\nHTML saved: {len(html)} chars')

finally:
    time.sleep(2)
    driver.quit()
