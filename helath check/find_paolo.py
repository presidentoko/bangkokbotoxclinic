"""Find Paolo Hospital correct domain and health checkup packages."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

# Try different Paolo domains
domains = [
    'paolohosp.com',
    'paolohospital.com',
    'paolo.co.th',
    'paologroup.com',
    'paolo-hospital.com',
    'paolo-hospital.co.th',
    'paolokaset.com',
    'paolosamut.com',
    'paolophaholyothin.com',
    'paolohospital.co.th',
    'paolohospitals.com',
    'paolohospitals.co.th',
]

for domain in domains:
    for prefix in ['https://www.', 'https://']:
        url = f'{prefix}{domain}/'
        try:
            r = session.get(url, timeout=6, allow_redirects=True)
            if r.status_code in [200, 301, 302]:
                print(f'✓ {r.status_code} → {r.url} ({len(r.text):,} chars)')
                # Check if it's Paolo
                if 'paolo' in r.text.lower():
                    print(f'  PAOLO content confirmed!')
                    # Look for health checkup links
                    checkup_links = re.findall(r'href="([^"]*(?:check|health|package)[^"]*)"', r.text, re.IGNORECASE)
                    print(f'  Checkup links: {checkup_links[:5]}')
                break
        except Exception:
            pass
    else:
        continue
    break
