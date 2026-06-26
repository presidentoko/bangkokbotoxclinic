import pytest
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from price_sampler import normalize_condition, recalculate_ranges, trim_samples


def test_normalize_condition_excellent():
    assert normalize_condition('Excellent condition') == 'excellent'
    assert normalize_condition('Like new') == 'excellent'
    assert normalize_condition('Never worn') == 'excellent'


def test_normalize_condition_very_good():
    assert normalize_condition('Very good') == 'very_good'
    assert normalize_condition('Great') == 'very_good'


def test_normalize_condition_fallback():
    assert normalize_condition('Good') == 'good'
    assert normalize_condition('Fair') == 'good'
    assert normalize_condition('') == 'good'


def test_recalculate_ranges_basic():
    samples = [
        {'price': 5000, 'condition': 'excellent'},
        {'price': 6000, 'condition': 'excellent'},
        {'price': 3500, 'condition': 'good'},
    ]
    result = recalculate_ranges(samples)
    assert result['excellent'] == {'min': 5000, 'max': 6000}
    assert result['good'] == {'min': 3500, 'max': 3500}


def test_recalculate_ranges_empty():
    assert recalculate_ranges([]) == {}


def test_trim_samples_keeps_latest_30():
    samples = [{'price': i, 'condition': 'excellent', 'date': f'2026-01-{i:02d}', 'platform': 'vestiaire'} for i in range(1, 41)]
    result = trim_samples(samples)
    assert len(result) == 30
    assert result[0]['price'] == 11  # oldest 10 dropped
