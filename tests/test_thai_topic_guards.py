"""태국어 토픽 매칭 가드 — 부분일치가 뜻을 뒤집는 것을 막는다.

태국어는 띄어쓰기가 없으므로 `text.count("แพง")` 은 "ไม่แพง"(안 비싸다) 안의
"แพง" 도 센다. 수집한 태국어 리뷰 1,881건 실측에서 แพง 66건 중 59건이 그것이었고,
ไม่แพง 는 affordable 패턴에도 있으므로 같은 문장이 두 토픽을 동시에 올렸다.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_SPEC = importlib.util.spec_from_file_location(
    "build_master_db", ROOT / "web-cf" / "scripts" / "build_master_db.py")
assert _SPEC and _SPEC.loader
bmd = importlib.util.module_from_spec(_SPEC)
sys.modules["build_master_db"] = bmd
_SPEC.loader.exec_module(bmd)

count = bmd.count_topic_pattern
topics = bmd.extract_mentioned_topics


def topic_count(text: str, name: str) -> int:
    for t in topics(text):
        if t["topic"] == name:
            return t["count"]
    return 0


class TestNegationBlockers:
    def test_cheap_is_not_counted_as_expensive(self):
        # 실측 최다 오분류: แพง 66건 중 59건이 이것이었다.
        assert count("ราคาไม่แพง", "แพง") == 0

    def test_cheap_still_counts_as_affordable(self):
        assert topic_count("ราคาไม่แพง", "affordable") == 1
        assert topic_count("ราคาไม่แพง", "expensive") == 0

    def test_expensive_still_counts_when_it_means_expensive(self):
        assert count("ราคาแพงมาก", "แพง") == 1
        assert topic_count("ราคาแพงมาก", "expensive") == 1

    def test_no_wait_is_not_long_wait(self):
        assert count("ไม่ต้องรอ", "ต้องรอ") == 0
        assert count("ไม่ต้องรอนาน", "รอนาน") == 0
        assert topic_count("ไม่ต้องรอนาน", "long_wait") == 0

    def test_long_wait_still_counts(self):
        assert topic_count("ต้องรอนานมาก", "long_wait") >= 1

    def test_dissatisfied_is_not_satisfied(self):
        assert count("ไม่พอใจเลย", "พอใจ") == 0
        assert topic_count("ไม่พอใจเลย", "results_satisfied") == 0
        assert topic_count("พอใจมาก", "results_satisfied") == 1

    def test_not_recommended_is_not_recommend(self):
        assert count("ไม่แนะนำ", "แนะนำ") == 0
        assert topic_count("แนะนำเลยค่ะ", "recommend") == 1

    def test_not_clean_is_not_clean(self):
        assert count("ไม่สะอาด", "สะอาด") == 0
        assert topic_count("สะอาดมาก", "clean_facility") == 1

    def test_unprofessional_is_not_professional(self):
        assert count("ไม่เป็นมืออาชีพ", "มืออาชีพ") == 0
        assert topic_count("มืออาชีพมาก", "professional") == 1


class TestDentalFalsePositives:
    def test_permanent_tooth_is_not_a_genuine_brand(self):
        # ฟันแท้ = 영구치. 치과 리뷰에서 แท้ 16건이 전부 이것이었다.
        assert count("ถอนฟันแท้", "แท้") == 0
        assert topic_count("ถอนฟันแท้", "genuine_brand") == 0

    def test_truly_is_not_a_genuine_brand(self):
        assert count("ดีอย่างแท้จริง", "แท้") == 0

    def test_genuine_item_counts_once_not_twice(self):
        # "ของแท้" 는 자기 패턴으로 1번만 세야 한다. 가드가 없으면 แท้ 가 같은
        # 글자를 또 세서 2가 된다.
        assert topic_count("ใช้ของแท้", "genuine_brand") == 1


class TestGuardDoesNotOvercount:
    def test_blocker_removal_cannot_create_a_new_match(self):
        # 블로커를 지우는 방식이면 지운 자리가 붙어 없던 일치가 생긴다.
        # 구간 표시 방식이면 생기지 않는다.
        assert count("ไม่แพงแพง", "แพง") == 1

    def test_counts_every_genuine_occurrence(self):
        assert count("แพงแพงแพง", "แพง") == 3

    def test_mixed_sentence(self):
        # 한 문장에 둘 다 — 싼 얘기와 비싼 얘기.
        text = "ขูดหินปูนไม่แพง แต่จัดฟันแพงมาก"
        assert count(text, "แพง") == 1

    def test_unguarded_patterns_are_untouched(self):
        assert count("สบายดี", "สบายดี") == 1
        assert count("โปรโมชั่นดี", "โปรโมชั่น") == 1


class TestEnglishUnaffected:
    def test_english_patterns_still_match(self):
        assert topic_count("very clean and professional", "clean_facility") == 1
        assert topic_count("very clean and professional", "professional") == 1

    def test_english_expensive(self):
        assert topic_count("it was expensive", "expensive") == 1
