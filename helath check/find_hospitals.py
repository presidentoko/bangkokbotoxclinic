import json, re
from pathlib import Path

# Check hdmall_all_clinics.json
f = Path(r"C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\hdmall_clinics\cache\hdmall_all_clinics.json")
data = json.loads(f.read_text(encoding='utf-8-sig'))

targets = ['bumrungrad','samitivej','vejthani','bnh','praram','phyathai','sikarin','bangpakok','vibhavadi','medpark','thonburi']
for t in targets:
    matches = [c for c in data if t in c.get('name','').lower() or t in c.get('slug','').lower() or t in c.get('hdmall_url','').lower()]
    for m in matches[:3]:
        pkgs = m.get('packages',[])
        print(f"  {t}: {m.get('name','?')} | {m.get('category','?')} | {len(pkgs)} pkgs | url={m.get('hdmall_url','')}")

# Also show all health-checkup entries that have packages
print("\n--- health-checkup with packages ---")
hc_with_pkgs = [c for c in data if c.get('category')=='health-checkup' and len(c.get('packages',[]))>0]
print(f"Total with packages: {len(hc_with_pkgs)}")
for c in hc_with_pkgs[:10]:
    pkgs = c.get('packages',[])
    prices = [p.get('current_price',0) for p in pkgs if p.get('current_price')]
    print(f"  {c.get('name','?')} | {len(pkgs)} pkgs | prices: {sorted(prices)[:3]}")
