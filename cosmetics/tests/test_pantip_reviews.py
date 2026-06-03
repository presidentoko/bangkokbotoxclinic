# -*- coding: utf-8 -*-
"""Unit tests for cosmetics.pantip_reviews.extract_mentions.

No network calls — all tests use hand-built Thread/Comment objects.

New signature: extract_mentions(thread, brand, product_name)
  - brand-led matching: brand name (and variants) OR distinctive product words
  - short/empty brand: require a product word too
"""
from __future__ import annotations

import sys
from pathlib import Path

# Ensure the repo root and pantip/ dir are on sys.path.
# pantip/scraper.py uses bare `import config`/`import namekit`, so pantip/
# must be importable as both a package (via repo root) and a bare-name source
# (via the pantip/ directory itself on sys.path).
_REPO_ROOT = Path(__file__).parent.parent.parent
_PANTIP_DIR = _REPO_ROOT / "pantip"
for _p in [str(_REPO_ROOT), str(_PANTIP_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from pantip.scraper import Thread, Comment
from cosmetics.pantip_reviews import extract_mentions


# ── Helpers ───────────────────────────────────────────────────────────────


def make_thread(
    op_body: str = "",
    comments: list[tuple[str, str, str]] | None = None,
    topic_id: str = "9999999",
    op_author: str = "TestUser",
    op_timestamp: str = "2025-01-01T00:00:00Z",
) -> Thread:
    """Build a minimal Thread for testing.

    comments: list of (body, author, timestamp) tuples.
    """
    comment_objs: list[Comment] = []
    for i, (body, author, ts) in enumerate((comments or []), start=1):
        comment_objs.append(
            Comment(
                comment_no=i,
                body=body,
                author=author,
                timestamp=ts,
            )
        )
    return Thread(
        topic_id=topic_id,
        title="Test thread title",
        op_body=op_body,
        op_author=op_author,
        op_timestamp=op_timestamp,
        comments=comment_objs,
    )


# ── Tests: brand-led matching ─────────────────────────────────────────────


def test_op_body_match_brand_returns_snippet():
    """OP body containing the brand name → one snippet."""
    thread = make_thread(op_body="ใช้ PROVAMED Bio Peptide แล้วหน้าใสขึ้นมากค่ะ")
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Bio Peptide Anti Acne Serum")
    assert len(result) == 1
    assert result[0]["topic_id"] == "9999999"
    assert "PROVAMED" in result[0]["text"] or "provamed" in result[0]["text"].lower()
    assert result[0]["author"] == "TestUser"
    assert result[0]["timestamp"] == "2025-01-01T00:00:00Z"


def test_comment_match_brand_returns_snippet():
    """A comment containing the brand → snippet with correct author/timestamp."""
    thread = make_thread(
        op_body="รีวิวครีมกันแดด",
        comments=[
            ("ไม่เกี่ยวกับสินค้านี้เลย", "UserA", "2025-02-01"),
            ("PROVAMED Anti Acne Serum ดีมากเลยค่ะ ลองแล้วสิวยุบ", "UserB", "2025-02-02"),
        ],
    )
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Anti Acne Serum")
    assert len(result) == 1
    assert result[0]["author"] == "UserB"
    assert result[0]["timestamp"] == "2025-02-02"


def test_no_match_returns_empty_list():
    """Thread with no brand/product word match → empty list."""
    thread = make_thread(
        op_body="รีวิวลิปสติกยี่ห้ออื่น ไม่เกี่ยว",
        comments=[
            ("ดีมากค่ะ ชอบสีนี้", "UserA", "2025-03-01"),
        ],
    )
    result = extract_mentions(thread, "SOME OTHER BRAND XYZ", "SOME OTHER BRAND XYZ Serum")
    assert result == []


def test_multiple_comments_match():
    """Multiple matching comments → multiple snippets."""
    thread = make_thread(
        op_body="ทดสอบ PROVAMED",
        comments=[
            ("ใช้ PROVAMED แล้วหน้าดีขึ้นค่ะ", "UserA", "2025-04-01"),
            ("PROVAMED ราคาไม่แพงด้วย", "UserB", "2025-04-02"),
            ("ไม่เกี่ยว", "UserC", "2025-04-03"),
        ],
    )
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Bio Peptide Serum")
    # OP body + 2 matching comments = 3 total
    assert len(result) == 3
    authors = {r["author"] for r in result}
    assert "TestUser" in authors  # OP
    assert "UserA" in authors
    assert "UserB" in authors
    assert "UserC" not in authors


def test_empty_thread_no_crash():
    """Thread with empty OP and no comments → empty list, no exception."""
    thread = make_thread(op_body="", comments=[])
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Bio Peptide Serum")
    assert result == []


def test_empty_brand_and_product_returns_empty():
    """Empty brand and product name → empty result."""
    thread = make_thread(op_body="PROVAMED is great!", comments=[])
    result = extract_mentions(thread, "", "")
    assert result == []


def test_snippet_contains_context_window():
    """Snippet text should include surrounding context, not just the signal."""
    long_body = "A" * 50 + " PROVAMED Anti Acne " + "B" * 50
    thread = make_thread(op_body=long_body)
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Anti Acne Serum")
    assert len(result) == 1
    # Should include context beyond just the brand name
    assert len(result[0]["text"]) > len("PROVAMED")


def test_comment_with_no_body_skipped():
    """Comment with empty body should not cause crash or spurious match."""
    thread = make_thread(
        op_body="nothing here",
        comments=[
            ("", "EmptyUser", "2025-05-01"),
            ("PROVAMED serum ดีมาก", "RealUser", "2025-05-02"),
        ],
    )
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Vitamin Serum")
    assert len(result) == 1
    assert result[0]["author"] == "RealUser"


def test_topic_id_propagated_to_all_snippets():
    """All returned snippets must carry the thread's topic_id."""
    thread = make_thread(
        topic_id="1234567",
        op_body="PROVAMED great",
        comments=[("also PROVAMED here", "UserX", "2025-06-01")],
    )
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Peptide Serum")
    assert all(r["topic_id"] == "1234567" for r in result)


def test_case_insensitive_brand_match():
    """Brand matching should be case-insensitive."""
    thread = make_thread(op_body="provamed bio peptide is amazing")
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Bio Peptide Serum")
    assert len(result) == 1


def test_non_matching_op_with_matching_comment():
    """OP without brand but comment with brand → only 1 snippet from comment."""
    thread = make_thread(
        op_body="สวัสดีค่ะ รีวิวทั่วไป",
        comments=[
            ("PROVAMED serum ช่วยได้มากค่ะ", "UserA", "2025-07-01"),
        ],
    )
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Vitamin Serum")
    assert len(result) == 1
    assert result[0]["author"] == "UserA"


def test_kiehls_brand_variant_match():
    """Kiehl's brand should match even without the apostrophe-s."""
    thread = make_thread(op_body="ลอง Kiehls dark spot แล้วดีมากค่ะ")
    result = extract_mentions(thread, "Kiehl's", "Kiehl's Clearly Corrective Dark Spot Solution")
    assert len(result) == 1


def test_la_roche_posay_match():
    """La Roche-Posay should match in text (with or without hyphen)."""
    thread = make_thread(op_body="ใช้ La Roche-Posay Mela B3 แล้วผิวขาวขึ้น")
    result = extract_mentions(thread, "La Roche-Posay", "La Roche-Posay Mela B3 Serum")
    assert len(result) == 1


def test_distinctive_product_word_match():
    """A distinctive product word alone (if brand not present) should match."""
    # 'Corrective' is distinctive (len>=4, not a generic stopword)
    thread = make_thread(op_body="ลอง dark spot corrective จากยี่ห้อต่างๆ")
    result = extract_mentions(thread, "Kiehl's", "Kiehl's Clearly Corrective Dark Spot Solution")
    # 'corrective' or 'clearly' or 'solution' should trigger
    assert len(result) == 1


def test_no_false_positive_unrelated_text():
    """Text with no brand and no product words → no match."""
    thread = make_thread(
        op_body="รีวิวลิปสติก สีสวยมาก ติดทน ไม่หลุดค่ะ",
        comments=[("ชอบมากเลย ราคาดี", "UserA", "2025-08-01")],
    )
    result = extract_mentions(thread, "Kiehl's", "Kiehl's Clearly Corrective Dark Spot Solution")
    assert result == []


def test_cap_at_8_snippets():
    """Snippets are capped at 8."""
    comments = [(f"PROVAMED peptide review number {i}", f"User{i}", "2025-01-01")
                for i in range(15)]
    thread = make_thread(op_body="PROVAMED peptide รีวิว", comments=comments)
    result = extract_mentions(thread, "PROVAMED", "PROVAMED Bio Peptide Serum")
    assert len(result) <= 8
