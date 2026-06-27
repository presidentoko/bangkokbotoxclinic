"""Discover correct URLs for Thai hospitals."""
import requests, re

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

DOMAINS_TO_TRY = {
    'Paolo': [
        'https://www.paolohospital.co.th/',
        'https://www.paolobangkok.co.th/',
        'https://www.paolo.co.th/',
        'https://www.paolohospitalgroup.com/',
        'https://www.paolomedical.co.th/',
        'https://www.paolohospitalthailand.com/',
    ],
    'Piyavate': [
        'https://www.piyavet.co.th/',
        'https://www.piyavate.co.th/',
        'https://www.piyavet.com/',
        'https://piyavet.co.th/',
    ],
    'Nonthavej': [
        'https://www.nonthavej.co.th/',
        'https://nonthavej.co.th/',
        'https://www.nonthavejhospital.com/',
    ],
    'Bangmod': [
        'https://www.bangmodhospital.com/',
        'https://www.bangmod.co.th/',
        'https://bangmodhospital.co.th/',
    ],
    'Kasemrad': [
        'https://www.kasemrad.co.th/',
        'https://kasemrad.co.th/',
        'https://www.kasemradhospital.com/',
    ],
    'Synphaet': [
        'https://synphaet.co.th/',
        'https://www.synphaet.co.th/',
        'https://www.synphaethospital.com/',
    ],
}

for hosp, urls in DOMAINS_TO_TRY.items():
    print(f'\n{hosp}:')
    for url in urls:
        try:
            r = session.get(url, timeout=6, allow_redirects=True)
            prices = re.findall(r'[฿฿]([\d,]+)', r.text)
            valid = [int(p.replace(',','')) for p in prices if p.replace(',','').isdigit() and 1000 < int(p.replace(',','')) < 200000]
            print(f'  {r.status_code} {url} → final: {r.url[:60]} | prices: {sorted(set(valid))[:5]}')
        except Exception as e:
            print(f'  ERR {url}: {str(e)[:50]}')
