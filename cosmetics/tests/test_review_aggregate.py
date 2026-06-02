# -*- coding: utf-8 -*-
from cosmetics import review_aggregate as ra

SAMPLE = [
    {"rating":5,"body":"ดีมาก สิวยุบ ใช้แล้วหน้าใส","author":"a","timestamp":"t","helpful_count":3},
    {"rating":4,"body":"หน้าใสขึ้น แต่กลิ่นแรง","author":"b","timestamp":"t","helpful_count":1},
    {"rating":2,"body":"แพ้ ระคายเคือง","author":"c","timestamp":"t","helpful_count":0},
]

def test_summary_counts_and_avg():
    s = ra.summarize(SAMPLE)
    assert s["count"] == 3
    assert abs(s["avg"] - (11/3)) < 1e-9
    assert s["pos_count"] == 2 and s["neg_count"] == 1   # rating>=4 pos, <=2 neg

def test_summary_keywords_extracted():
    s = ra.summarize(SAMPLE, top_k=3)
    assert isinstance(s["pos_keywords"], list)
    assert isinstance(s["neg_keywords"], list)
    assert len(s["pos_keywords"]) <= 3

def test_summary_empty():
    s = ra.summarize([])
    assert s["count"] == 0 and s["avg"] == 0.0 and s["pos_keywords"] == []

def test_sample_reviews_picks_helpful():
    s = ra.summarize(SAMPLE, n_samples=2)
    assert len(s["samples"]) == 2
    assert s["samples"][0]["helpful_count"] >= s["samples"][1]["helpful_count"]
