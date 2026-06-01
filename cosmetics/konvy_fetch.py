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
        timeout_ms: int = 45000,
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
        for _ in range(scroll):
            self._page.mouse.wheel(0, 4000)
            self._page.wait_for_timeout(1500)
        self._page.wait_for_timeout(settle_ms)
        return self._page.content()

    def fetch_json(self, url: str, referer: str = "") -> str:
        """Fetch *url* with the page's WAF cookies via ``page.request.get``.

        Args:
            url: AJAX endpoint URL (e.g. the reviews endpoint).
            referer: Optional Referer header (use the product page URL).
        """
        assert self._page is not None, "KonvyBrowser must be used as a context manager"
        headers: dict[str, str] = {"X-Requested-With": "XMLHttpRequest"}
        if referer:
            headers["Referer"] = referer
        r = self._page.request.get(url, headers=headers)
        return r.text()
