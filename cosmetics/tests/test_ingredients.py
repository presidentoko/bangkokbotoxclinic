from cosmetics import ingredients

def test_load_and_schema():
    db = ingredients.load_db()
    assert "Niacinamide" in db
    e = db["Niacinamide"]
    for k in ("th_name","en_name","aliases","role","concern_efficacy","safety_flags",
              "mechanism_th","mechanism_en","typical_pct","sources"):
        assert k in e, f"missing {k}"
    assert set(e["concern_efficacy"]) >= {"acne","whitening"}
    for v in e["concern_efficacy"].values():
        assert 0 <= v <= 3

def test_normalize_matches_alias_and_case():
    assert ingredients.normalize("Aqua/Water") == "aqua/water"
    assert ingredients.normalize("  SODIUM   Hyaluronate ") == "sodium hyaluronate"

def test_match_ingredients_by_name_and_alias():
    db = ingredients.load_db()
    matched = ingredients.match(["Niacinamide", "Vitamin B3", "Aqua", "BHA"], db)
    keys = {m["inci"] for m in matched}
    assert "Niacinamide" in keys          # exact
    assert "Salicylic Acid" in keys       # via alias "BHA"
    # dedupe: Niacinamide + alias Vitamin B3 collapse to one
    assert sum(1 for m in matched if m["inci"] == "Niacinamide") == 1
