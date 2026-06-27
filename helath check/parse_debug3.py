import re

with open('debug_maps.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the position of the first "ดาว" and show more context
pos = html.find('ดาว')
ctx = html[max(0, pos-1000):pos+500]
# Remove script content
ctx = re.sub(r'<script[^>]*>.*?</script>', ' [SCRIPT] ', ctx, flags=re.DOTALL)
# Clean up HTML tags but keep structure hint
ctx_clean = re.sub(r'<([a-z]+)[^>]*>', r'<\1>', ctx)
ctx_clean = re.sub(r'</[a-z]+>', '', ctx_clean)
ctx_clean = re.sub(r'\s+', ' ', ctx_clean)
print('Context around first ดาว:')
print(ctx_clean[:1500])

print('\n' + '='*60)

# Find "Bumrungrad" or "บํารุงราษฎร์" in HTML
idx = html.find('บํารุงราษฎร์')
if idx > 0:
    ctx2 = html[max(0,idx-200):idx+500]
    ctx2_clean = re.sub(r'<[^>]+>', ' ', ctx2)
    ctx2_clean = re.sub(r'\s+', ' ', ctx2_clean)
    print(f'\nContext around บํารุงราษฎร์:')
    print(ctx2_clean[:800])
