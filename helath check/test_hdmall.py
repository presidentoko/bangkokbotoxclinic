import httpx, asyncio, re

async def main():
    urls = [
        "https://hdmall.co.th/sitemap/health-checkup/brands",
        "https://hdmall.co.th/sitemap/health-checkup/brands?page=1",
        "https://hdmall.co.th/health-checkup",
        "https://hdmall.co.th/sitemap",
    ]
    async with httpx.AsyncClient(headers={'User-Agent':'Mozilla/5.0 Chrome/125'}, follow_redirects=True) as c:
        for url in urls:
            r = await c.get(url, timeout=10)
            links = re.findall(r'href="(https://hdmall\.co\.th/health-checkup/[^"]+)"', r.text)
            print(f"\n{url}")
            print(f"  status={r.status_code} final_url={r.url}")
            print(f"  found {len(links)} /health-checkup/ links")
            if links:
                print(f"  sample: {links[:3]}")
            elif r.status_code == 200:
                print(f"  text[:200]: {r.text[:200]}")

asyncio.run(main())
