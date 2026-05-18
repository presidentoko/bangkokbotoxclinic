"""무료 후보 데이터 소스 정찰.
yellowpages.co.th, yellow.in.th, thaiyellowpages.com, industrial.go.th (IEAT)
→ 응답코드 / 최종 URL / 제목 / WAF 흔적 / 카테고리 진입점.
"""
from __future__ import annotations

import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "probe_sources_result.json"

TARGETS = [
    ("yellowpages_en", "https://www.yellowpages.co.th/en"),
    ("yellowpages_th", "https://www.yellowpages.co.th/"),
    ("yellow_in_th",  "https://www.yellow.in.th/"),
    ("thaiyellowpages","https://www.thaiyellowpages.com/"),
    ("ieat",          "https://www.ieat.go.th/"),
    ("ieat_en",       "https://www.ieat.go.th/en"),
]


async def probe(page, name: str, url: str) -> dict:
    try:
        resp = await page.goto(url, wait_until="domcontentloaded", timeout=25000)
        await page.wait_for_timeout(2500)
        body = await page.content()
        return {
            "name": name,
            "input_url": url,
            "final_url": page.url,
            "status": resp.status if resp else None,
            "title": await page.title(),
            "body_len": len(body),
            "incapsula": "Incapsula" in body or "Imperva" in body,
            "cloudflare": "Just a moment" in body or "cf-challenge" in body,
            "head_500": body[:500],
        }
    except Exception as e:
        return {"name": name, "input_url": url, "error": str(e)}


async def main() -> None:
    out: list[dict] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/130.0.0.0 Safari/537.36"
            ),
        )
        page = await ctx.new_page()
        for name, url in TARGETS:
            print(f"  probing {name} ...", flush=True)
            out.append(await probe(page, name, url))
        await browser.close()

    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
