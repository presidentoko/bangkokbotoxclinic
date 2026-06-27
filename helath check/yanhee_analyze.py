"""Analyze Yanhee pricing page structure."""
import re, requests

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

r = session.get('https://www.yanhee.net/pricing-packages/', timeout=15)
html = r.text

# Check what framework
frameworks = {
    'React': 'react' in html.lower() or '__REACT' in html,
    'Vue': 'vue.js' in html.lower() or '__vue' in html.lower(),
    'Nuxt': '__NUXT__' in html,
    'Next': '__NEXT_DATA__' in html,
    'WordPress': 'wp-content' in html,
}
print('Frameworks:', {k: v for k, v in frameworks.items() if v})

# WordPress - check for embedded data
if 'wp-content' in html:
    print('\nWordPress detected - checking for price data...')
    # Try REST API
    for endpoint in [
        '/wp-json/wp/v2/pages?search=health&per_page=5',
        '/wp-json/wc/v3/products?category=health&per_page=10',
        '/wp-json/wp/v2/posts?search=checkup&per_page=10',
    ]:
        api_url = 'https://www.yanhee.net' + endpoint
        ar = session.get(api_url, timeout=8)
        print(f'  {ar.status_code} {endpoint}')
        if ar.status_code == 200 and len(ar.text) > 10:
            print(f'    Content: {ar.text[:200]}')

# Look for ajax endpoints
ajax_urls = re.findall(r'(?:ajaxurl|ajax_url|resturl)\s*[=:]\s*["\']([^"\']+)["\']', html)
print(f'\nAjax URLs: {ajax_urls[:3]}')

# Look for sub-pages
links = re.findall(r'href="([^"]+)"', html)
health_links = [l for l in links if any(kw in l.lower() for kw in ['health', 'check', 'package', 'price']) and 'yanhee' in l.lower()]
print(f'Health sub-links: {set(health_links[:10])}')

# Check text content
text = re.sub(r'<[^>]+>', ' ', html)
text = re.sub(r'\s+', ' ', text)
# Find any numbers in Thai Baht range near health words
print('\nText sample (health section):')
health_idx = text.lower().find('health check')
if health_idx > -1:
    print(text[max(0,health_idx-50):health_idx+500])
