import json
import subprocess
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from scripts.deploy_hair_data import validate_source_csv, run_node_build


def test_validate_source_csv_missing(tmp_path):
    with pytest.raises(FileNotFoundError):
        validate_source_csv(tmp_path / "nonexistent.csv")


def test_validate_source_csv_header_only(tmp_path):
    csv = tmp_path / "master.csv"
    csv.write_text("name,place_id\n", encoding="utf-8")
    with pytest.raises(ValueError, match="0 data rows"):
        validate_source_csv(csv)


def test_validate_source_csv_valid(tmp_path):
    csv = tmp_path / "master.csv"
    csv.write_text("name,place_id\nClinic A,ChIJ123\nClinic B,ChIJ456\n", encoding="utf-8")
    count = validate_source_csv(csv)
    assert count == 2


def test_run_node_build_success(tmp_path, monkeypatch):
    clinics_json = tmp_path / "clinics.json"
    clinics_json.write_text(
        json.dumps({"total": 214, "clinics": [{"id": "x"}]}),
        encoding="utf-8",
    )

    def fake_run(cmd, **kwargs):
        result = MagicMock()
        result.returncode = 0
        result.stdout = "[build-data] wrote 214 clinics"
        result.stderr = ""
        return result

    monkeypatch.setattr("scripts.deploy_hair_data.subprocess.run", fake_run)
    count = run_node_build(project_root=tmp_path, out_file=clinics_json)
    assert count == 214


def test_run_node_build_node_failure(tmp_path, monkeypatch):
    def fake_run(cmd, **kwargs):
        result = MagicMock()
        result.returncode = 1
        result.stdout = ""
        result.stderr = "Cannot find module 'csv-parse'"
        return result

    monkeypatch.setattr("scripts.deploy_hair_data.subprocess.run", fake_run)
    with pytest.raises(RuntimeError, match="node build failed"):
        run_node_build(project_root=tmp_path, out_file=tmp_path / "clinics.json")
