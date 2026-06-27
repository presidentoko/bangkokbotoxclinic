"""Scrape Yanhee Hospital pricing packages page."""
import re, requests, pymysql
from config import DB_CONFIG

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'

r = session.get('https://www.yanhee.net/pricing-packages/', timeout=15)
html = r.text
print(f'Status: {r.status_code}, Size: {len(html):,} chars')

# Find health checkup section
# Look for patterns like "Health Check-up" near prices
prices_raw = re.findall(r'฿\s*([\d,]+)', html)
prices = [int(p.replace(',','')) for p in prices_raw if 999 < int(p.replace(',','')) < 200000]
print(f'All prices: {sorted(set(prices))[:20]}')

# Find section headers with prices nearby
# Looking for headings near price tags
sections = re.findall(r'<h[23][^>]*>([^<]{5,60})</h[23]>', html, re.IGNORECASE)
health_sections = [s for s in sections if any(kw in s.lower() for kw in ['health', 'check', 'medical', 'annual', 'executive', 'comprehensive'])]
print(f'Health sections: {health_sections[:10]}')

# Extract blocks around health checkup keywords
health_blocks = re.findall(r'(?:health.check|annual.check|executive.health|medical.check)[^.]{0,200}', html, re.IGNORECASE)
print(f'Health blocks: {health_blocks[:5]}')

# Try to get the page text more cleanly
text = re.sub(r'<[^>]+>', ' ', html)
text = re.sub(r'\s+', ' ', text)

# Find price near health keywords
health_price_patterns = re.findall(r'(?:health|check.?up|medical|annual|executive)[^฿]{3,80}฿\s*([\d,]+)', text, re.IGNORECASE)
print(f'Health-price patterns: {health_price_patterns[:10]}')

price_near_health = re.findall(r'฿\s*([\d,]+)[^฿]{3,100}(?:health|check.?up|medical|annual|executive)', text, re.IGNORECASE)
print(f'Price-near-health: {price_near_health[:10]}')
