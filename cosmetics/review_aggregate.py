# -*- coding: utf-8 -*-
"""Summarize a product's Konvy review corpus: avg, pos/neg split, keyword frequency, samples."""
from __future__ import annotations
import re
from collections import Counter

# Thai has no spaces between words; for MVP use a simple stopword + token-length filter
# over whitespace/punct splits. (Open item: swap in a Thai tokenizer like pythainlp later.)
_STOP = {"และ","ที่","มาก","แต่","ใช้","แล้ว","เป็น","ก็","นะ","ค่ะ","ครับ","มี","ไม่",
         "the","a","is","it","i","very","but","use","used","and","to"}
_TOKEN = re.compile(r"[A-Za-z฀-๿]{3,}")

def _keywords(reviews, top_k):
    c = Counter()
    for r in reviews:
        for tok in _TOKEN.findall((r.get("body") or "").lower()):
            if tok not in _STOP:
                c[tok] += 1
    return [w for w, _ in c.most_common(top_k)]

def summarize(reviews: list[dict], top_k: int = 8, n_samples: int = 3) -> dict:
    if not reviews:
        return {"count":0,"avg":0.0,"pos_count":0,"neg_count":0,
                "pos_keywords":[],"neg_keywords":[],"samples":[]}
    ratings = [float(r.get("rating") or 0) for r in reviews]
    pos = [r for r in reviews if float(r.get("rating") or 0) >= 4]
    neg = [r for r in reviews if float(r.get("rating") or 0) <= 2]
    samples = sorted(reviews, key=lambda r: r.get("helpful_count", 0), reverse=True)[:n_samples]
    return {
        "count": len(reviews),
        "avg": sum(ratings) / len(ratings),
        "pos_count": len(pos), "neg_count": len(neg),
        "pos_keywords": _keywords(pos, top_k),
        "neg_keywords": _keywords(neg, top_k),
        "samples": samples,
    }
