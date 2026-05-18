"""DBD DataWarehouse+ XHR/fetch 캡쳐 probe.

1) headed browser로 메인 페이지 → 쿠키 동의
2) 검색창에 알려진 Thai 회사명 타이핑 → 검색
3) 검색 중 발생한 모든 XHR / fetch 요청·응답을 캡쳐
4) 결과를 dbd_deep_probe_result.json 으로 저장

목적: API 엔드포인트 + 요청 payload + 응답 스키마 파악 → 본 스크래퍼 작성 근거.

테스트 회사 후보 (지명도 있고 등록 확실한 거):
  - "ซีพี ออลล์" (CP All / 7-11 운영사)
  - "President Bakery"
  - "Thai Beverage" (ThaiBev)
"""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

# Windows cp1252 → UTF-8 로 강제 (Thai 문자 print 가능하게)
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from playwright.async_api import async_playwright, Request, Response

OUT = Path(__file__).parent / "dbd_deep_probe_result.json"

TEST_QUERY = sys.argv[1] if len(sys.argv) > 1 else "President Bakery"


async def main() -> None:
    captured_requests: list[dict] = []
    captured_responses: list[dict] = []

    async with async_playwright() as pw:
        # headed = visible — Incapsula 우회에 유리. CI에서는 headless=True 로 바꿔 OK.
        browser = await pw.chromium.launch(headless=False, slow_mo=200)
        ctx = await browser.new_context(
            locale="en-US",
            viewport={"width": 1366, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/130.0.0.0 Safari/537.36"
            ),
        )
        page = await ctx.new_page()

        async def on_request(req: Request) -> None:
            # XHR/fetch만 — 페이지/이미지/CSS 제외
            if req.resource_type not in ("xhr", "fetch"):
                return
            try:
                post_data = req.post_data
            except Exception:
                post_data = None
            captured_requests.append({
                "url": req.url,
                "method": req.method,
                "resource_type": req.resource_type,
                "headers": dict(req.headers),
                "post_data": post_data,
            })

        async def on_response(resp: Response) -> None:
            req = resp.request
            if req.resource_type not in ("xhr", "fetch"):
                return
            body = None
            ctype = resp.headers.get("content-type", "")
            if "application/json" in ctype or "text" in ctype:
                try:
                    body = await resp.text()
                    if len(body) > 8000:
                        body = body[:8000] + f"...[truncated, total {len(body)}]"
                except Exception as e:
                    body = f"<text() failed: {e}>"
            captured_responses.append({
                "url": req.url,
                "status": resp.status,
                "content_type": ctype,
                "body": body,
            })

        page.on("request", on_request)
        page.on("response", on_response)

        print(f"[1/4] open DBD home ...")
        await page.goto("https://datawarehouse.dbd.go.th/", wait_until="networkidle", timeout=45000)
        await page.wait_for_timeout(2000)

        # 쿠키 동의 (Thai: "ยอมรับทั้งหมด")
        print(f"[2/4] accept cookies + dismiss warningModal ...")
        try:
            await page.get_by_role("button", name="ยอมรับทั้งหมด").click(timeout=5000)
            await page.wait_for_timeout(1500)
        except Exception as e:
            print(f"  cookie button not found: {e!s:.120}")

        # warningModal — 일반정보 안내 등 추가 동의 modal. 안에 close/agree 버튼 찾아 클릭.
        try:
            modal = page.locator("#warningModal")
            if await modal.count() > 0 and await modal.is_visible():
                # 모달 안의 모든 버튼/링크 우선순위로 클릭 시도
                modal_buttons = modal.locator("button, a.btn, [role='button']")
                n = await modal_buttons.count()
                print(f"  warningModal visible — found {n} clickable elements")
                for i in range(n):
                    btn = modal_buttons.nth(i)
                    try:
                        text = (await btn.inner_text(timeout=500)).strip()
                    except Exception:
                        text = ""
                    print(f"    [{i}] text='{text[:40]}'")
                # 첫 버튼 클릭 (보통 "ยอมรับ" / "ตกลง" / "ปิด" / OK / Accept)
                if n > 0:
                    await modal_buttons.first.click(timeout=3000)
                    await page.wait_for_timeout(1500)
                    # 혹시 또 modal이면 한 번 더
                    if await modal.is_visible():
                        await page.keyboard.press("Escape")
                        await page.wait_for_timeout(500)
        except Exception as e:
            print(f"  warningModal handling: {e!s:.120}")

        # 메인 검색 폼 — Nuxt SPA 라 mount 기다림
        print(f"[3/4] type query '{TEST_QUERY}' ...")
        # 검색 input 후보 — placeholder / role 둘 다 시도
        search_selectors = [
            'input[type="search"]',
            'input[placeholder*="ค้นหา"]',
            'input[placeholder*="search" i]',
            'input[placeholder*="company" i]',
            'input[placeholder*="ชื่อ"]',
            'input.search-input',
        ]
        clicked = False
        for sel in search_selectors:
            try:
                el = page.locator(sel).first
                if await el.count() > 0:
                    await el.click(timeout=3000)
                    await el.fill(TEST_QUERY)
                    await page.wait_for_timeout(800)
                    await el.press("Enter")
                    clicked = True
                    print(f"  matched selector: {sel}")
                    break
            except Exception:
                continue

        if not clicked:
            # fallback — 첫 visible input
            try:
                el = page.locator('input:visible').first
                await el.click(timeout=3000)
                await el.fill(TEST_QUERY)
                await page.wait_for_timeout(800)
                await el.press("Enter")
                clicked = True
                print(f"  fallback: first visible input")
            except Exception as e:
                print(f"  fallback FAIL: {e!s:.120}")

        # 검색 결과 / 응답 대기
        print(f"[4/4] wait for results (12s) ...")
        await page.wait_for_timeout(12000)

        # 검색 결과 페이지 URL + 제목
        result_meta = {
            "final_url": page.url,
            "title": await page.title(),
            "result_page_head": (await page.content())[:3000],
        }

        await browser.close()

    # 결과 정리 — XHR 중복/노이즈 제거
    NOISE = ("/_nuxt/", "/fonts/", "google-analytics", "doubleclick", "googletagmanager", "gstatic")
    def is_signal(url: str) -> bool:
        return not any(n in url for n in NOISE)

    sig_requests = [r for r in captured_requests if is_signal(r["url"])]
    sig_responses = [r for r in captured_responses if is_signal(r["url"])]

    OUT.write_text(json.dumps({
        "query": TEST_QUERY,
        "result_meta": result_meta,
        "search_initiated": clicked,
        "all_xhr_count": len(captured_requests),
        "signal_xhr_count": len(sig_requests),
        "requests": sig_requests,
        "responses": sig_responses,
    }, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nwrote {OUT}  ({OUT.stat().st_size:,} bytes)")
    print(f"  total XHR: {len(captured_requests)},  signal: {len(sig_requests)}")


if __name__ == "__main__":
    asyncio.run(main())
