"""Scrape more HDmall pages (page 5+) for health checkup."""
import re, time, requests, pymysql
from pathlib import Path
from playwright.sync_api import sync_playwright
from config import DB_CONFIG

CACHE = Path(__file__).parent / 'hdmall_cache'
CACHE.mkdir(exist_ok=True)

# Check how many pages HDmall health-checkup has
session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

# First check the total
r = session.get('https://hdmall.co.th/c/health-checkup', timeout=15)
total_m = re.search(r'(\d+)\s*(?:results?|clinics?|hospitals?|ผล)', r.text, re.I)
print(f'HDmall health-checkup page: {r.status_code}, size: {len(r.text):,}')

# Check pages 5-10
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1200, 'height': 900})
    page = ctx.new_page()

    for p_num in range(5, 15):
        url = f'https://hdmall.co.th/c/health-checkup?page={p_num}'
        cache_file = CACHE / f'dir_health-checkup_p{p_num}.html'

        if cache_file.exists():
            html = cache_file.read_text(encoding='utf-8')
            print(f'p{p_num}: cached ({len(html):,})')
        else:
            try:
                pg = page.goto(url, wait_until='networkidle', timeout=20000)
                if pg and pg.status == 200:
                    time.sleep(2)
                    html = page.content()
                    # Check if page has content (not empty/redirect)
                    cards = re.findall(r'data-event-value="([^"]+)"', html)
                    if not cards:
                        print(f'p{p_num}: no cards (end of pages)')
                        break
                    cache_file.write_text(html, encoding='utf-8')
                    print(f'p{p_num}: {len(cards)} cards, saved')
                else:
                    print(f'p{p_num}: status {pg.status if pg else "?"}')
                    break
            except Exception as e:
                print(f'p{p_num}: error {e}')
                break

    browser.close()

print('\ndone - now run hdmall_insert.py to process new pages')
