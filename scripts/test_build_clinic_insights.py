"""pytest scripts/test_build_clinic_insights.py"""
import build_clinic_insights as b


def _pn(text, key):
    a = b.aspect_counts([text])[key]
    return a["pos"], a["neg"]


def test_negation_flips_english():
    assert _pn("The procedure was not painful at all.", "painless") == (1, 0)
    assert _pn("Staff were not very friendly.", "staff") == (0, 0)
    assert _pn("Price is not too expensive.", "value") == (0, 0)


def test_negative_wins_and_explanation():
    assert _pn("Very painful and they didn't explain anything.", "painless") == (0, 1)
    assert _pn("Very painful and they didn't explain anything.", "explanation") == (0, 1)
    assert _pn("The dentist explained everything clearly.", "explanation") == (1, 0)


def test_thai():
    assert _pn("ราคาไม่แพง หมอใจดี ไม่เจ็บเลย", "value") == (1, 0)
    assert _pn("ราคาไม่แพง หมอใจดี ไม่เจ็บเลย", "painless") == (1, 0)
    assert _pn("แพงมาก ไม่สะอาด", "cleanliness") == (0, 1)


def test_minimally_painful_is_not_a_complaint():
    assert _pn("It was very minimally painful, great dentist.", "painless")[1] == 0
