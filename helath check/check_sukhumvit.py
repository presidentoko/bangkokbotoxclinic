import re
state = open('cache/samitivej_sukhumvit_state.txt', encoding='utf-8').read()
print('Size:', len(state))
names = re.findall(r'"([A-Za-z][^"]{5,80})"', state)
health = [n for n in names if any(kw in n.lower() for kw in ['check', 'program', 'health', 'screen', 'executive', 'cancer', 'annual', 'cardiac', 'basic'])]
print('Health names:', health[:15])
prices = re.findall(r',(\d+),', state)
valid = sorted(set(int(p) for p in prices if 1000 < int(p) < 200000))
print('Prices:', valid[:15])
