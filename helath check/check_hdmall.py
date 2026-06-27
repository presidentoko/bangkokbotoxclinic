import json, sys
from pathlib import Path

f = Path(r"C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\hdmall_clinics\cache\hdmall_all_clinics.json")
data = json.loads(f.read_text(encoding='utf-8-sig'))
print(f"Total clinics in HDmall cache: {len(data)}")

hc = [c for c in data if c.get('category','') == 'health-checkup']
print(f"Health-checkup clinics: {len(hc)}")
for c in hc[:30]:
    pkgs = c.get('packages', [])
    prices = [p.get('current_price',0) for p in pkgs if p.get('current_price')]
    print(f"  {c.get('name','?')} | {len(pkgs)} pkgs | prices: {sorted(prices)[:3] if prices else 'none'}")
