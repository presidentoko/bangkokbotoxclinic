import pytest
from petfood.ingredient_grades import grade_ingredient


def test_salmon_is_green():
    assert grade_ingredient("Salmon") == "green"


def test_chicken_meal_is_green():
    assert grade_ingredient("Chicken Meal") == "green"


def test_corn_is_yellow():
    assert grade_ingredient("Corn") == "yellow"


def test_rice_is_yellow():
    assert grade_ingredient("Brown Rice") == "yellow"


def test_bha_is_black():
    assert grade_ingredient("BHA") == "black"


def test_bht_is_black():
    assert grade_ingredient("BHT") == "black"


def test_poultry_byproduct_is_red():
    assert grade_ingredient("Poultry by-product meal") == "red"


def test_animal_fat_is_red():
    assert grade_ingredient("Animal fat") == "red"


def test_unknown_defaults_to_yellow():
    assert grade_ingredient("Xanthan gum") == "yellow"


def test_case_insensitive():
    assert grade_ingredient("SALMON") == "green"
    assert grade_ingredient("bha") == "black"


def test_compound_name_green():
    assert grade_ingredient("Dehydrated chicken") == "green"
