import pytest
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from price_sampler import normalize_condition, recalculate_ranges, trim_samples

def test_normalize_condition_thai():
    assert normalize_condition('สภาพดีมาก') == 'excellent'
    assert normalize_condition('like new') == 'excellent'
    assert normalize_condition('very good') == 'very_good'
    assert normalize_condition('good') == 'good'
    assert normalize_condition('fair') == 'good'

def test_recalculate_ranges():
    samples = [
        {'price': 100000, 'condition': 'excellent', 'platform': 'carousell_th', 'date': '2026-06-26'},
        {'price': 120000, 'condition': 'excellent', 'platform': 'carousell_th', 'date': '2026-06-26'},
        {'price': 70000, 'condition': 'very_good', 'platform': 'c2c_th', 'date': '2026-06-26'},
    ]
    ranges = recalculate_ranges(samples)
    assert ranges['excellent'] == {'min': 100000, 'max': 120000}
    assert ranges['very_good'] == {'min': 70000, 'max': 70000}

def test_trim_samples():
    samples = [{'price': i, 'condition': 'good', 'platform': 'carousell_th', 'date': f'2026-01-{i:02d}'} for i in range(1, 41)]
    trimmed = trim_samples(samples, keep=30)
    assert len(trimmed) == 30
    assert trimmed[0]['date'] == '2026-01-11'  # keeps most recent 30
