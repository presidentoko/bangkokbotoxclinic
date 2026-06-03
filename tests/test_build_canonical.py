import json
from pathlib import Path

from engine.build_canonical import build_canonical

FIX_DIR = Path(__file__).parent / "fixtures" / "bangkok"


def test_build_canonical_writes_tagged_deduped_json(tmp_path):
    out_file = tmp_path / "canonical.json"
    count = build_canonical(
        sources=[(FIX_DIR, "bangkok")],
        out_path=out_file,
    )
    assert count == 2
    data = json.loads(out_file.read_text(encoding="utf-8"))
    by_id = {c["place_id"]: c for c in data}
    # p1 has reviews loaded and is tagged dental
    assert "dental" in by_id["p1"]["procedures"]
    assert len(by_id["p1"]["reviews"]) == 2
    # p2 tagged botox from its editorial/name "Glow Aesthetic" + no reviews file
    assert "botox" in by_id["p2"]["procedures"]
    assert by_id["p2"]["reviews"] == []
