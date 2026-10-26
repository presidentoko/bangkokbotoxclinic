"""태국어 토픽 매칭 가드 — 부분일치가 뜻을 뒤집는 것을 막는다.

태국어는 띄어쓰기가 없으므로 `text.count("แพง")` 은 "ไม่แพง"(안 비싸다) 안의
"แพง" 도 센다. 수집한 태국어 리뷰 1,881건 실측에서 แพง 66건 중 59건이 그것이었고,
ไม่แพง 는 affordable 패턴에도 있으므로 같은 문장이 두 토픽을 동시에 올렸다.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]

# 이 레포에는 build_master_db.py 가 두 벌 있다. web/ 쪽이 정본이고
# scripts/build_clinic_insights.py 가 임포트하는 것도 그쪽이지만, web-cf/ 사본도
# 실존하고 둘 다 같은 web/data/master_db.json 에 쓴다. 한쪽만 고치면 다음에 다른
# 쪽을 돌린 사람이 버그를 되살린다 — 이 레포에서 사본 두 벌은 이미 조용한 롤백을
# 낸 적이 있다. 그래서 두 파일 모두에 대해 같은 테스트를 돌린다.
BUILDERS = {
    "web": ROOT / "web" / "scripts" / "build_master_db.py",
    "web-cf": ROOT / "web-cf" / "scripts" / "build_master_db.py",
}


def _load(path: Path):
    spec = importlib.util.spec_from_file_location(f"bmd_{path.parent.parent.name}", path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture(params=sorted(BUILDERS), ids=sorted(BUILDERS))
def bmd(request):
    path = BUILDERS[request.param]
    if not path.exists():
        pytest.skip(f"{path} 없음")
    return _load(path)


@pytest.fixture
def count(bmd):
    return bmd.count_topic_pattern


@pytest.fixture
def topic_count(bmd):
    def _f(text: str, name: str) -> int:
        for t in bmd.extract_mentioned_topics(text):
            if t["topic"] == name:
                return t["count"]
        return 0
    return _f


class TestNegationBlockers:
    def test_cheap_is_not_counted_as_expensive(self, count, topic_count):
        # 실측 최다 오분류: แพง 66건 중 59건이 이것이었다.
        assert count("ราคาไม่แพง", "แพง") == 0

    def test_cheap_still_counts_as_affordable(self, count, topic_count):
        assert topic_count("ราคาไม่แพง", "affordable") == 1
        assert topic_count("ราคาไม่แพง", "expensive") == 0

    def test_expensive_still_counts_when_it_means_expensive(self, count, topic_count):
        assert count("ราคาแพงมาก", "แพง") == 1
        assert topic_count("ราคาแพงมาก", "expensive") == 1

    def test_no_wait_is_not_long_wait(self, count, topic_count):
        assert count("ไม่ต้องรอ", "ต้องรอ") == 0
        assert count("ไม่ต้องรอนาน", "รอนาน") == 0
        assert topic_count("ไม่ต้องรอนาน", "long_wait") == 0

    def test_long_wait_still_counts(self, count, topic_count):
        assert topic_count("ต้องรอนานมาก", "long_wait") >= 1

    def test_dissatisfied_is_not_satisfied(self, count, topic_count):
        assert count("ไม่พอใจเลย", "พอใจ") == 0
        assert topic_count("ไม่พอใจเลย", "results_satisfied") == 0
        assert topic_count("พอใจมาก", "results_satisfied") == 1

    def test_not_recommended_is_not_recommend(self, count, topic_count):
        assert count("ไม่แนะนำ", "แนะนำ") == 0
        assert topic_count("แนะนำเลยค่ะ", "recommend") == 1

    def test_not_clean_is_not_clean(self, count, topic_count):
        assert count("ไม่สะอาด", "สะอาด") == 0
        assert topic_count("สะอาดมาก", "clean_facility") == 1

    def test_unprofessional_is_not_professional(self, count, topic_count):
        assert count("ไม่เป็นมืออาชีพ", "มืออาชีพ") == 0
        assert topic_count("มืออาชีพมาก", "professional") == 1


class TestDentalFalsePositives:
    def test_permanent_tooth_is_not_a_genuine_brand(self, count, topic_count):
        # ฟันแท้ = 영구치. 치과 리뷰에서 แท้ 16건이 전부 이것이었다.
        assert count("ถอนฟันแท้", "แท้") == 0
        assert topic_count("ถอนฟันแท้", "genuine_brand") == 0

    def test_truly_is_not_a_genuine_brand(self, count, topic_count):
        assert count("ดีอย่างแท้จริง", "แท้") == 0

    def test_genuine_item_counts_once_not_twice(self, count, topic_count):
        # "ของแท้" 는 자기 패턴으로 1번만 세야 한다. 가드가 없으면 แท้ 가 같은
        # 글자를 또 세서 2가 된다.
        assert topic_count("ใช้ของแท้", "genuine_brand") == 1


class TestGuardDoesNotOvercount:
    def test_blocker_removal_cannot_create_a_new_match(self, count, topic_count):
        # 블로커를 지우는 방식이면 지운 자리가 붙어 없던 일치가 생긴다.
        # 구간 표시 방식이면 생기지 않는다.
        assert count("ไม่แพงแพง", "แพง") == 1

    def test_counts_every_genuine_occurrence(self, count, topic_count):
        assert count("แพงแพงแพง", "แพง") == 3

    def test_mixed_sentence(self, count, topic_count):
        # 한 문장에 둘 다 — 싼 얘기와 비싼 얘기.
        text = "ขูดหินปูนไม่แพง แต่จัดฟันแพงมาก"
        assert count(text, "แพง") == 1

    def test_unguarded_patterns_are_untouched(self, count, topic_count):
        assert count("สบายดี", "สบายดี") == 1
        assert count("โปรโมชั่นดี", "โปรโมชั่น") == 1


class TestEnglishUnaffected:
    def test_english_patterns_still_match(self, count, topic_count):
        assert topic_count("very clean and professional", "clean_facility") == 1
        assert topic_count("very clean and professional", "professional") == 1

    def test_english_expensive(self, count, topic_count):
        assert topic_count("it was expensive", "expensive") == 1


class TestTheTwoBuildersStayInSync:
    def test_topic_pattern_tables_are_identical(self):
        # 두 벌이 갈라지면 어느 쪽을 돌렸는지에 따라 사이트 내용이 달라진다.
        mods = {k: _load(v) for k, v in BUILDERS.items() if v.exists()}
        if len(mods) < 2:
            pytest.skip("빌더가 한 벌뿐")
        tables = [m._TOPIC_PATTERNS for m in mods.values()]
        assert tables[0] == tables[1]

    def test_blocker_tables_are_identical(self):
        mods = {k: _load(v) for k, v in BUILDERS.items() if v.exists()}
        if len(mods) < 2:
            pytest.skip("빌더가 한 벌뿐")
        tables = [m._TOPIC_BLOCKERS for m in mods.values()]
        assert tables[0] == tables[1]
