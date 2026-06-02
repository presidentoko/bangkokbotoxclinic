from cosmetics import gen_summaries as g

class FakeClient:
    def __init__(self): self.calls = 0
    def summarize(self, prompt, lang):
        self.calls += 1
        return f"[{lang}] summary"

def test_product_summary_cached_by_hash():
    fc = FakeClient()
    prod = {"product_id":"1","name":"Acne Serum","brand":"X",
            "ingredient_analysis":[{"inci":"Salicylic Acid"}],
            "total_score":{"acne":72.0},"review_summary":{"count":200,"avg":4.6}}
    cache = {}
    s1 = g.product_summary(prod, client=fc, cache=cache)
    s2 = g.product_summary(prod, client=fc, cache=cache)   # same input -> cache hit
    assert s1 == s2
    assert set(s1) == {"th","en"}
    assert fc.calls == 2   # one per language, only first time
