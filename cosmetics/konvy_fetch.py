"""Playwright-based page fetcher for Konvy (WAF bypass via real browser + SOCKS5 proxy).

Pure helpers (reviews_url, is_socks_dead_error) are unit-tested.
KonvyBrowser is integration-tested in the smoke run — importing this module
does NOT launch a browser; sync_playwright is only started inside __enter__.
"""
from __future__ import annotations

from cosmetics import config

# ---------------------------------------------------------------------------
# Pure helpers
# ---------------------------------------------------------------------------

_BASE_REVIEWS = (
    "https://www.konvy.com/team/ajax_comment.php"
    "?action=comment_show_json_new"
    "&page={page}"
    "&team_id={team_id}"
    "&ctype=default"
    "&score=0"
    "&onlyhaveimg=0"
    "&imgbtnclicked=0"
)

_DEAD_SIGNALS = (
    "ERR_SOCKS_CONNECTION_FAILED",
    "ERR_CONNECTION_RESET",
    "Target page, context or browser has been closed",
    "Target closed",
    "ERR_PROXY_CONNECTION_FAILED",
    "socks",
)


def reviews_url(team_id: "str | int", page: int = 1) -> str:
    """Build the Konvy AJAX reviews endpoint URL for a given team_id and page."""
    return _BASE_REVIEWS.format(team_id=team_id, page=page)


def is_socks_dead_error(msg: str) -> bool:
    """Return True if *msg* indicates a dead SOCKS5 tunnel or closed browser target."""
    lower = msg.lower()
    return any(sig.lower() in lower for sig in _DEAD_SIGNALS)


def is_waf_challenge(html: str) -> bool:
    """Return True if *html* is an Aliyun WAF JS-challenge interstitial rather than
    the real page. The challenge page is small (~17KB) and carries the acw_sc__v2
    reload script / aliyunwaf script; real Konvy pages are 100KB+ and lack these.
    """
    if not html:
        return True
    low = html.lower()
    # (a) acw_sc__v2 JS-reload interstitial (~17KB) and (b) escalated slider-CAPTCHA
    # "Verification" page (aliyun_waf_aa/bb meta, --aliyun-slide). Neither is the real page.
    if "aliyun_waf_aa" in low or "aliyun-slide" in low or "<title>verification</title>" in low:
        return True
    return len(html) < 50000 and ("acw_sc__v2" in low or "aliyunwaf" in low)


# ---------------------------------------------------------------------------
# Playwright browser wrapper
# ---------------------------------------------------------------------------

class KonvyBrowser:
    """Context manager that wraps a Playwright Chromium instance routed through
    a SOCKS5 proxy at ``config.PROXY_HOST:<port>``.

    Usage::

        with KonvyBrowser(port=2090) as browser:
            html = browser.fetch_html("https://www.konvy.com/...", scroll=4)
            json_text = browser.fetch_json(reviews_url(95356), referer=product_url)
    """

    def __init__(self, port: int) -> None:
        self.port = port
        self._pw = None
        self._browser = None
        self._context = None
        self._page = None

    # ------------------------------------------------------------------
    # Context-manager lifecycle
    # ------------------------------------------------------------------

    def __enter__(self) -> "KonvyBrowser":
        from playwright.sync_api import sync_playwright  # local import — no side-effects at module level

        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(
            headless=True,
            proxy={"server": f"socks5://{config.PROXY_HOST}:{self.port}"},
        )
        self._context = self._browser.new_context(
            locale="th-TH",
            user_agent=config.USER_AGENT,
        )
        self._page = self._context.new_page()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        try:
            if self._page is not None:
                self._page.close()
        except Exception:
            pass
        try:
            if self._context is not None:
                self._context.close()
        except Exception:
            pass
        try:
            if self._browser is not None:
                self._browser.close()
        except Exception:
            pass
        try:
            if self._pw is not None:
                self._pw.stop()
        except Exception:
            pass
        return False  # don't suppress exceptions

    # ------------------------------------------------------------------
    # Fetch helpers
    # ------------------------------------------------------------------

    def fetch_html(
        self,
        url: str,
        scroll: int = 0,
        settle_ms: int = 4000,
        timeout_ms: int = 30000,
    ) -> str:
        """Navigate to *url*, optionally scroll to trigger lazy-loads, return full HTML.

        Args:
            url: Page URL to load.
            scroll: Number of ``mouse.wheel(0, 4000)`` scroll steps (with 1500 ms pause each).
                    Use 4–6 for listing pages that lazy-load products.
            settle_ms: Extra wait after scrolling (default 4 s).
            timeout_ms: Navigation timeout (default 45 s).
        """
        assert self._page is not None, "KonvyBrowser must be used as a context manager"
        self._page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
        # Aliyun WAF serves a JS-challenge interstitial that reloads ITSELF into the
        # real page. Don't reload it ourselves (that races the WAF's own reload and
        # breaks content()). Just poll content() defensively until the challenge clears.
        for _ in range(8):
            self._page.wait_for_timeout(1500)
            html = self._safe_content()
            if html and not is_waf_challenge(html):
                break
        for _ in range(scroll):
            try:
                self._page.mouse.wheel(0, 4000)
            except Exception:
                pass
            self._page.wait_for_timeout(1500)
        self._page.wait_for_timeout(settle_ms)
        return self._safe_content()

    def _safe_content(self) -> str:
        """page.content() but tolerant of mid-navigation races (returns '' on failure)."""
        for _ in range(5):
            try:
                return self._page.content()
            except Exception:
                self._page.wait_for_timeout(800)
        return ""

    def fetch_json(self, url: str, referer: str = "", fetch_timeout_ms: int = 20000) -> str:
        """Fetch *url* from inside the page via ``fetch()`` so it carries the
        browser's resolved WAF cookies/JS context (page.request bypasses those and
        gets re-challenged). Retries once through a reload if a WAF page comes back.

        The in-page ``fetch`` is bounded by an AbortController timeout: ``page.evaluate``
        itself has NO timeout, so without this a tunnel that dies mid-fetch hangs the
        whole crawler forever. On abort/timeout we treat reviews as best-effort and
        return '' (the product still gets its ld+json rating/review-count).

        Args:
            url: AJAX endpoint URL (e.g. the reviews endpoint).
            referer: Optional product page URL; navigated to first so cookies are set.
            fetch_timeout_ms: Hard ceiling for the in-page fetch before it aborts.
        """
        assert self._page is not None, "KonvyBrowser must be used as a context manager"
        js = """async ([u, timeoutMs]) => {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), timeoutMs);
            try {
                const r = await fetch(u, {headers: {'X-Requested-With': 'XMLHttpRequest'},
                                          credentials: 'include', signal: ctrl.signal});
                return await r.text();
            } finally { clearTimeout(t); }
        }"""
        for _ in range(2):
            try:
                txt = self._page.evaluate(js, [url, fetch_timeout_ms])
            except Exception as e:
                # AbortError (timeout) or a dead-tunnel error: don't hang, give up on reviews.
                if is_socks_dead_error(str(e)):
                    raise
                return ""
            # Valid review payload is JSON; a WAF/HTML interstitial starts with '<'.
            if txt and not txt.lstrip().startswith("<"):
                return txt
            self._page.wait_for_timeout(1500)
            if referer:
                try:
                    self._page.goto(referer, wait_until="domcontentloaded", timeout=45000)
                    self._page.wait_for_timeout(1500)
                except Exception:
                    pass
        return txt
