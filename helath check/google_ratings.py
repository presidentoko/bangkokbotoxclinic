"""Scrape Google Search knowledge panel for hospital ratings."""
import re, json, time, pymysql
import requests
from config import DB_CONFIG

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
})

def get_google_rating(hospital_name, location='Bangkok Thailand'):
    """Search Google and extract rating from knowledge panel."""
    query = f'{hospital_name} {location}'
    url = f'https://www.google.com/search?q={requests.utils.quote(query)}&hl=en'

    r = session.get(url, timeout=15)
    html = r.text

    # Method 1: JSON-LD structured data
    jsonld_blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    for block in jsonld_blocks:
        try:
            data = json.loads(block)
            items = data if isinstance(data, list) else [data]
            for item in items:
                if isinstance(item, dict):
                    rating = item.get('aggregateRating', {})
                    if rating:
                        return {
                            'rating': float(rating.get('ratingValue', 0)),
                            'review_count': int(rating.get('reviewCount', rating.get('ratingCount', 0))),
                            'source': 'json-ld'
                        }
        except Exception:
            pass

    # Method 2: Regex patterns for Google's rendered rating
    # Google often embeds rating like: "4.3" and "(2,341)"
    # Pattern in knowledge panel: ratingValue":"4.3","ratingCount":"2341"
    m = re.search(r'"ratingValue"\s*:\s*"?([\d.]+)"?.*?"ratingCount"\s*:\s*"?([\d,]+)"?', html)
    if m:
        return {
            'rating': float(m.group(1)),
            'review_count': int(m.group(2).replace(',', '')),
            'source': 'regex-ratingValue'
        }

    # Method 3: Look for star rating pattern in Google's HTML
    # Looks like: 4.3 (2,341) or similar
    m = re.search(r'([\d.]+)\s*\([\d,]+\s*(?:review|Google review|รีวิว)', html, re.IGNORECASE)
    if m:
        rating = float(m.group(1))
        if 1.0 <= rating <= 5.0:
            count_m = re.search(r'\(([\d,]+)\s*(?:review|Google review)', html, re.IGNORECASE)
            return {
                'rating': rating,
                'review_count': int(count_m.group(1).replace(',','')) if count_m else 0,
                'source': 'regex-review'
            }

    # Method 4: Parse from Google's JS data (hidden JSON)
    # Google embeds data like: ,4.3,2341,
    m = re.search(r'"([\d.]+)","([\d]+)","hospital', html)
    if not m:
        # Try broader pattern for star ratings
        patterns = [
            r'stars_(\d)\.\d|(\d\.\d) stars',
            r'\\"([\d.]+)\\"[,\s]*\\"([\d]+)\\"',
        ]

    return None

# Test with known hospitals
test_hospitals = [
    ('Bumrungrad International Hospital', 'Bangkok'),
    ('Vejthani Hospital', 'Bangkok'),
    ('Samitivej Hospital Srinakarin', 'Bangkok'),
    ('BNH Hospital', 'Bangkok'),
    ('Phyathai 2 Hospital', 'Bangkok'),
]

print('Testing Google rating scraper...\n')
for name, loc in test_hospitals:
    result = get_google_rating(name, loc)
    print(f'{name}: {result}')
    time.sleep(2)  # Be polite
