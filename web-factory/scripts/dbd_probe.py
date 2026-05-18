"""DBD (datawarehouse.dbd.go.th) 정찰 스크립트.
실제 브라우저로 메인 페이지 접근 → 최종 URL / 페이지 제목 / 검색 폼 셀렉터 / robots / 쿠키 확인.
스크래퍼 본 코드 짜기 전에 1회만 돌림.
"""
from __future__ import annotations

import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "dbd_probe_result.json"


async def main() -> None:
    result: dict = {}

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

        # 1) 메인 페이지
        try:
            resp = await page.goto(
                "https://datawarehouse.dbd.go.th/",
                wait_until="domcontentloaded",
                timeout=30000,
            )
            await page.wait_for_timeout(3000)
            result["main"] = {
                "final_url": page.url,
                "status": resp.status if resp else None,
                "title": await page.title(),
                "html_head": (await page.content())[:3000],
            }
        except Exception as e:
            result["main_error"] = str(e)

        # 2) 검색 폼 후보 추출
        try:
            inputs = await page.eval_on_selector_all(
                "input, select, button, a",
                """els => els.slice(0, 40).map(e => ({
                    tag: e.tagName,
                    type: e.type || null,
                    name: e.name || null,
                    id: e.id || null,
                    placeholder: e.placeholder || null,
                    text: (e.innerText || e.value || '').slice(0, 80),
                    href: e.href || null,
                }))""",
            )
            result["form_elements"] = inputs
        except Exception as e:
            result["form_error"] = str(e)

        # 3) robots.txt
        try:
            r = await page.goto(
                "https://datawarehouse.dbd.go.th/robots.txt",
                wait_until="domcontentloaded",
                timeout=15000,
            )
            result["robots"] = {
                "status": r.status if r else None,
                "body": (await page.content())[:2000],
            }
        except Exception as e:
            result["robots_error"] = str(e)

        # 4) 메인 도메인 (dbd.go.th)
        try:
            r = await page.goto(
                "https://www.dbd.go.th/",
                wait_until="domcontentloaded",
                timeout=20000,
            )
            result["dbd_root"] = {
                "final_url": page.url,
                "status": r.status if r else None,
                "title": await page.title(),
            }
        except Exception as e:
            result["dbd_root_error"] = str(e)

        await browser.close()

    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
