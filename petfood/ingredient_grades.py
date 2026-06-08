from __future__ import annotations

GREEN: set[str] = {
    "salmon", "tuna", "chicken", "beef", "lamb", "turkey", "duck",
    "venison", "pork", "whitefish", "trout", "herring", "anchovy",
    "chicken meal", "salmon meal", "lamb meal", "turkey meal", "beef meal",
    "tuna meal", "herring meal",
    "sweet potato", "lentil", "blueberry", "cranberry",
    "flaxseed", "fish oil", "chicken fat", "salmon oil",
    "dried egg", "whole egg", "egg product",
    "chicken liver", "beef liver",
}

YELLOW: set[str] = {
    "rice", "brown rice", "white rice", "brewers rice",
    "corn", "maize", "wheat", "oat", "barley", "sorghum", "millet",
    "pea", "pea protein", "pea starch", "pea fiber",
    "potato", "potato starch", "tapioca", "cassava",
    "soybean", "soy protein isolate", "canola oil", "sunflower oil",
    "beet pulp", "cellulose", "carrageenan",
    "salt", "sodium chloride", "potassium chloride",
    "dl-methionine", "taurine", "l-carnitine",
}

RED: set[str] = {
    "poultry by-product meal", "poultry by-product", "poultry by-products",
    "animal by-product meal", "animal by-products",
    "meat by-product", "meat and bone meal",
    "animal fat", "animal digest",
    "corn gluten meal", "wheat gluten",
    "meat meal",
    "vegetable oil",
    "fish meal",
}

BLACK: set[str] = {
    "bha", "bht", "ethoxyquin",
    "artificial color", "artificial colour",
    "artificial flavor", "artificial flavour",
    "fd&c red 40", "fd&c yellow 5", "fd&c blue 1",
    "sodium nitrite", "potassium sorbate",
    "propyl gallate", "tbhq",
    "red 40", "yellow 5", "blue 2",
}


def grade_ingredient(name: str) -> str:
    """Return 'green'|'yellow'|'red'|'black' for an ingredient name."""
    n = name.lower().strip().rstrip(".")
    if n in BLACK:
        return "black"
    if n in RED:
        return "red"
    if n in GREEN:
        return "green"
    if n in YELLOW:
        return "yellow"
    for item in BLACK:
        if item in n:
            return "black"
    for item in RED:
        if item in n:
            return "red"
    for item in GREEN:
        if item in n:
            return "green"
    return "yellow"
