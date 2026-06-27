import time
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "price_screenshots"

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False)
    ctx = browser.new_context(viewport={'width': 1600, 'height': 1000})
    page = ctx.new_page()

    # Bumrungrad price table image
    page.goto('https://www.bumrungrad.com/en/health-check-up-center-bangkok-thailand-jci-best/check-up-packages',
              wait_until='networkidle', timeout=30000)
    time.sleep(3)

    # Find ALL images on page
    imgs = page.query_selector_all('img')
    print(f'Total images: {len(imgs)}')
    for i, img in enumerate(imgs):
        src = img.get_attribute('src') or ''
        alt = img.get_attribute('alt') or ''
        try:
            box = img.bounding_box()
            if box and box['width'] > 400 and box['height'] > 200:
                print(f'  [{i}] {int(box["width"])}x{int(box["height"])} src={src[-50:]} alt={alt[:30]}')
        except Exception:
            pass

    # Take screenshot of the large price table image (usually first big img)
    for i, img in enumerate(imgs):
        try:
            box = img.bounding_box()
            if box and box['width'] > 400 and box['height'] > 300:
                img.scroll_into_view_if_needed()
                time.sleep(0.5)
                img.screenshot(path=str(OUT / f'bumrungrad_img_{i}.png'))
                print(f'  Saved bumrungrad_img_{i}.png ({int(box["width"])}x{int(box["height"])})')
        except Exception as e:
            pass

    browser.close()
print('done')
