#!/usr/bin/env python3
"""
Carousell TH scraper via NordVPN Thai server SOCKS proxy.
Uses undetected-chromedriver + Chrome proxy to route through Thailand.
"""
import json, time, random, subprocess, re, urllib.request
from datetime import datetime
from pathlib import Path
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
OVPN_CLI = Path(__file__).parent.parent.parent / 'node-openvpn-socks' / 'dist' / 'cli.js'
AUTH_FILE = Path(__file__).parent.parent.parent / 'nordvpn' / 'auth.txt'
SOCKS_PORT = 2199  # dedicated port for this scraper

def get_thai_server() -> dict | None:
    print('Fetching NordVPN Thai servers...')
    url = 'https://api.nordvpn.com/v1/servers?limit=5000&filters[servers_technologies][identifier]=openvpn_tcp&filters[country_id]=215'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = json.loads(urllib.request.urlopen(req, timeout=15).read())
        online = [s for s in data if s.get('status') == 'online']
        if not online:
            print('No Thai servers found in API')
            return None
        server = random.choice(online[:20])
        print(f'Selected: {server["hostname"]} ({server["load"]}% load)')
        return {'hostname': server['hostname'], 'ip': server['station']}
    except Exception as e:
        print(f'API error: {e}')
        return None

def start_socks_proxy(server: dict) -> subprocess.Popen | None:
    if not OVPN_CLI.exists():
        print(f'cli.js not found: {OVPN_CLI}')
        return None

    # Write temp auth file path
    if AUTH_FILE.exists():
        auth_arg = str(AUTH_FILE)
    else:
        # Try to find auth file
        import glob
        candidates = glob.glob(str(Path.home() / '**' / '.nordvpn_auth'), recursive=True)
        if not candidates:
            print('No auth file found. Looking for nordvpn_auth...')
            # check common locations
            for loc in [Path.home() / 'freevpn' / '.nordvpn_auth', Path('C:/Users/yn') / 'freevpn' / '.nordvpn_auth']:
                if loc.exists():
                    auth_arg = str(loc)
                    break
            else:
                print('No auth file found. Skipping VPN setup.')
                return None
        else:
            auth_arg = candidates[0]

    cmd = ['node', str(OVPN_CLI),
           '--host', server['hostname'],
           '--port', '443',
           '--proto', 'tcp',
           '--socks-port', str(SOCKS_PORT),
           '--auth-file', auth_arg]

    print(f'Starting SOCKS proxy on port {SOCKS_PORT} via {server["hostname"]}...')
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for proxy to be ready
    for i in range(30):
        time.sleep(1)
        try:
            import socket
            s = socket.socket()
            s.settimeout(1)
            s.connect(('127.0.0.1', SOCKS_PORT))
            s.close()
            print(f'SOCKS proxy ready on port {SOCKS_PORT}')
            return proc
        except Exception:
            pass
    print('SOCKS proxy failed to start in 30s')
    proc.terminate()
    return None

def recalculate_ranges(samples):
    by_cond = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {c: {'min': int(min(p)), 'max': int(max(p))} for c, p in by_cond.items() if p}

def trim_samples(samples, keep=30):
    return sorted(samples, key=lambda s: s['date'])[-keep:]

def normalize_condition(label: str) -> str:
    l = label.lower()
    if any(k in l for k in ('brand new', 'like new', 'never')): return 'excellent'
    if any(k in l for k in ('lightly', 'very good', 'great')): return 'very_good'
    return 'good'

def search_carousell_th(driver, query: str) -> list:
    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    try:
        encoded = query.replace(' ', '+')
        # Use TH locale URL
        driver.get(f'https://www.carousell.com/en-th/search/?search={encoded}&sort_by=3')
        time.sleep(8)

        # Try to extract prices via JS
        items = driver.execute_script('''
            const results = [];
            const allEls = document.querySelectorAll('*');
            allEls.forEach(el => {
                if (el.children.length > 0) return;
                const t = (el.textContent || '').trim();
                // Match THB prices: ฿1,500 or 1500 or 1,500
                const m = t.match(/^[฿]([\\d,]+)$/) || t.match(/^([\\d,]{3,})(\\s*บาท)?$/);
                if (!m) return;
                const price = parseInt(m[1].replace(/,/g, ''));
                if (price < 500 || price > 5000000) return;
                const card = el.closest('li, [data-testid], article');
                const condEl = card ? card.querySelector('[class*=condition], [class*=Condition]') : null;
                results.push({price, condition: condEl ? condEl.textContent.trim() : 'used'});
            });
            return results;
        ''')
        for item in (items or []):
            results.append({
                'price': round(item['price'] / 500) * 500,
                'condition': normalize_condition(item.get('condition', 'used')),
                'platform': 'carousell_th',
                'date': today,
            })
    except Exception as e:
        print(f'  [err] {e}')
    return results

def run():
    # Try to start Thai VPN proxy
    server = get_thai_server()
    vpn_proc = None
    use_proxy = False

    if server:
        vpn_proc = start_socks_proxy(server)
        use_proxy = vpn_proc is not None

    # Launch Chrome
    options = uc.ChromeOptions()
    options.add_argument('--lang=th-TH')
    options.add_argument('--window-size=1280,900')
    if use_proxy:
        options.add_argument(f'--proxy-server=socks5://127.0.0.1:{SOCKS_PORT}')
        print(f'Chrome routing through Thai SOCKS proxy port {SOCKS_PORT}')
    else:
        print('No VPN proxy — using direct connection')

    driver = uc.Chrome(options=options, headless=False, use_subprocess=True, version_main=149)

    # Check actual IP
    try:
        driver.get('https://api.ipify.org?format=json')
        time.sleep(2)
        ip_data = json.loads(driver.find_element('tag name', 'body').text)
        print(f'Exit IP: {ip_data.get("ip")}')
    except Exception:
        pass

    with open(DB_PATH) as f:
        db = json.load(f)

    updated = 0
    try:
        for item in db['items']:
            if item['category'] not in ('handbags', 'watches'):
                continue
            query = f'{item["brand"]} {item["model"]}'
            print(f'Searching: {query}')
            new_samples = search_carousell_th(driver, query)
            print(f'  → {len(new_samples)} prices')
            if new_samples:
                item['price_samples'] = trim_samples(item.get('price_samples', []) + new_samples)
                item['price_ranges'] = recalculate_ranges(item['price_samples'])
                item['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                updated += 1
            time.sleep(random.uniform(3, 6))
    finally:
        driver.quit()
        if vpn_proc:
            vpn_proc.terminate()

    print(f'Updated {updated} items')
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    if updated > 0:
        subprocess.run(['git', 'add', str(DB_PATH)], check=True)
        staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
        if staged.returncode != 0:
            subprocess.run(['git', 'commit', '-m', f'chore(data): carousell_th prices {datetime.now():%Y-%m-%d}'], check=True)
            subprocess.run(['git', 'push'], check=True)
            print('Pushed.')

if __name__ == '__main__':
    run()
