import pymysql
from config import DB_CONFIG

conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    # Samitivej branches result
    cur.execute("""SELECT h.name, h.slug, COUNT(p.id) n FROM hospitals h
                   LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                   WHERE h.slug IN ('samitivej-sukhumvit','samitivej-nawamin')
                   GROUP BY h.id""")
    print('Samitivej branches:')
    for r in cur.fetchall():
        print(f'  {r["n"]} pkgs  {r["name"]}  ({r["slug"]})')

    # Search HDmall data for known hospitals
    searches = ['paolo', 'yanhee', 'synphaet', 'nonthavej', 'kasemrad', 'piyavate',
                'bangmod', 'christian', 'mission', 'ladprao', 'ekachai', 'thonburi',
                'bangkok-christian', 'petcharavej', 'ramkhamhaeng']
    print('\nHDmall entries for missing hospitals:')
    for s in searches:
        cur.execute("""SELECT h.slug, h.name, COUNT(p.id) n FROM hospitals h
                       LEFT JOIN checkup_packages p ON p.hospital_id=h.id
                       WHERE LOWER(h.name) LIKE %s OR LOWER(h.slug) LIKE %s
                       GROUP BY h.id""", (f'%{s}%', f'%{s}%'))
        rows = cur.fetchall()
        for r in rows:
            print(f'  [{s}] {r["n"]} pkgs  {r["name"][:50]}  ({r["slug"]})')

conn.close()
