from cosmetics import youtube_reviews as yr

def test_search_videos_returns_list(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/search",
        json={"items": [
            {"id": {"videoId": "abc123"}, "snippet": {"title": "รีวิว Niacinamide", "channelTitle": "BeautyTH"}},
            {"id": {"videoId": "def456"}, "snippet": {"title": "Test Product Review", "channelTitle": "SkinTH"}},
        ]}
    )
    results = yr.search_videos("Niacinamide serum", "TEST_KEY", max_results=2)
    assert len(results) == 2
    assert results[0]["video_id"] == "abc123"
    assert results[0]["title"] == "รีวิว Niacinamide"

def test_search_videos_empty_response(requests_mock):
    requests_mock.get("https://www.googleapis.com/youtube/v3/search", json={"items": []})
    assert yr.search_videos("unknown product xyz", "KEY") == []

def test_fetch_comments_returns_snippets(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        json={"items": [
            {"snippet": {"topLevelComment": {"snippet": {
                "textOriginal": "ดีมาก ผิวขาวขึ้น",
                "authorDisplayName": "UserA",
                "likeCount": 5,
                "publishedAt": "2025-01-01T00:00:00Z",
            }}}},
            {"snippet": {"topLevelComment": {"snippet": {
                "textOriginal": "ใช้แล้วสิวยุบ แนะนำเลย",
                "authorDisplayName": "UserB",
                "likeCount": 2,
                "publishedAt": "2025-02-01T00:00:00Z",
            }}}},
        ]}
    )
    comments = yr.fetch_comments("abc123", "TEST_KEY", max_comments=5)
    assert len(comments) == 2
    assert comments[0]["text"] == "ดีมาก ผิวขาวขึ้น"
    assert comments[0]["author"] == "UserA"
    assert comments[0]["like_count"] == 5

def test_fetch_comments_api_error(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        status_code=403, json={"error": {"message": "disabled"}}
    )
    assert yr.fetch_comments("xyz", "KEY") == []

def test_find_reviews_aggregates(requests_mock):
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/search",
        json={"items": [{"id": {"videoId": "v1"}, "snippet": {"title": "รีวิว Product", "channelTitle": "Ch"}}]}
    )
    requests_mock.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        json={"items": [{"snippet": {"topLevelComment": {"snippet": {
            "textOriginal": "ดีมากๆ",
            "authorDisplayName": "U",
            "likeCount": 1,
            "publishedAt": "2025-01-01T00:00:00Z",
        }}}}]}
    )
    result = yr.find_reviews("Some Product", "Brand", "KEY")
    assert result["source"] == "youtube"
    assert result["video_count"] >= 1
    assert result["comment_count"] >= 1
    assert len(result["snippets"]) >= 1
    assert result["snippets"][0]["video_id"] == "v1"

def test_find_reviews_no_key_returns_empty():
    result = yr.find_reviews("Product", "Brand", api_key="")
    assert result["video_count"] == 0
    assert result["snippets"] == []
