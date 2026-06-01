from cosmetics import konvy_fetch


def test_reviews_url_builds_expected():
    u = konvy_fetch.reviews_url(95356, page=2)
    assert "team/ajax_comment.php" in u
    assert "team_id=95356" in u
    assert "page=2" in u
    assert "action=comment_show_json_new" in u


def test_is_socks_dead_detects_known_errors():
    assert konvy_fetch.is_socks_dead_error("net::ERR_SOCKS_CONNECTION_FAILED at https://x")
    assert konvy_fetch.is_socks_dead_error("Page.goto: net::ERR_CONNECTION_RESET")
    assert konvy_fetch.is_socks_dead_error("Target page, context or browser has been closed")
    assert not konvy_fetch.is_socks_dead_error("HTTP 404 Not Found")
    assert not konvy_fetch.is_socks_dead_error("")
