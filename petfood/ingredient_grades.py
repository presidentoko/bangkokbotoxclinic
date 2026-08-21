"""Ingredient quality classification.

Returns one of five verdicts, not four. The fifth — ``unknown`` — is the
important one: the previous version ended with ``return "yellow"``, so every
string it did not recognise was published as a *verified mediocre* ingredient.
Combined with a comma-splitter that swallowed marketing prose, that default
pushed ``yellow_count`` above ``green_count`` on most of the catalogue and
690 of 986 products came out grade C. A classifier that cannot recognise a
string must say so, so the grader can decline to publish a grade instead of
inventing a bad one.

``neutral`` is the other addition. Vitamin and mineral premixes make up a third
of a typical ingredient panel and say nothing about quality; counting them as
yellow penalised complete foods for being complete.
"""

from __future__ import annotations

import re

# Verdicts, worst to best. Order matters: a name matching several families is
# resolved to the most serious one.
BLACK, RED, YELLOW, GREEN, NEUTRAL, UNKNOWN = (
    "black", "red", "yellow", "green", "neutral", "unknown",
)

# Leading qualifiers that describe handling, not identity. Stripped for lookup
# so "Organic Dried Sweet Potatoes" resolves the same as "sweet potato".
_QUALIFIERS = (
    "certified humane", "humanely raised", "cage free", "cage-free",
    "free range", "free-range", "grass fed", "grass-fed", "wild caught",
    "wild-caught", "pasture raised", "pasture-raised", "sustainably sourced",
    "human grade", "human-grade", "non-gmo", "non gmo",
    "organic", "fresh", "frozen", "raw", "dried", "dehydrated",
    "deboned", "boneless", "whole", "ground", "chopped", "steamed",
    "air-dried", "air dried", "freeze-dried", "freeze dried", "premium",
    "new zealand", "north atlantic", "ocean", "pacific", "atlantic",
)

# Species that make an animal-derived ingredient "named". AAFCO treats a named
# source as materially better than an anonymous one: "chicken by-product meal"
# is a defined commodity, "meat by-product meal" can be anything.
_SPECIES = (
    "chicken", "turkey", "duck", "goose", "quail", "beef", "bison", "buffalo",
    "lamb", "mutton", "goat", "pork", "boar", "venison", "deer", "elk",
    "rabbit", "kangaroo", "salmon", "tuna", "trout", "herring", "anchovy",
    "sardine", "mackerel", "cod", "haddock", "pollock", "whitefish",
    "menhaden", "catfish", "tilapia", "egg", "lamb", "veal", "ostrich",
)

GREEN_TERMS: set[str] = {
    # Named muscle meat and fish
    "chicken", "chicken breast", "chicken thigh", "turkey", "turkey breast",
    "duck", "goose", "quail", "beef", "bison", "buffalo", "lamb", "mutton",
    "goat", "pork", "boar", "venison", "deer", "elk", "rabbit", "kangaroo",
    "veal", "ostrich", "salmon", "tuna", "trout", "herring", "anchovy",
    "sardine", "mackerel", "cod", "haddock", "pollock", "whitefish",
    "menhaden", "catfish", "tilapia", "chicken broth", "beef broth",
    "bone broth", "turkey broth", "lamb broth", "fish broth",
    # Named meals — concentrated protein from a declared species
    "chicken meal", "turkey meal", "duck meal", "beef meal", "lamb meal",
    "salmon meal", "tuna meal", "herring meal", "whitefish meal",
    "menhaden fish meal", "ocean whitefish meal", "sardine meal",
    "anchovy meal", "trout meal", "pork meal", "venison meal",
    # Organ meat — nutrient dense, correctly declared
    "chicken liver", "beef liver", "lamb liver", "pork liver", "turkey liver",
    "duck liver", "chicken heart", "beef heart", "lamb heart", "turkey heart",
    "chicken gizzard", "turkey gizzard", "beef kidney", "lamb kidney",
    "chicken necks", "chicken livers", "beef tripe", "lamb tripe",
    "green tripe", "lamb lung", "beef lung", "chicken cartilage",
    "lamb cartilage", "beef cartilage", "lamb bone", "chicken bone",
    "beef kidneys", "lamb spleen", "beef spleen", "muscle meat",
    # Eggs
    "egg", "eggs", "whole egg", "whole eggs", "dried egg", "dried egg product",
    "egg product", "egg yolk",
    # Quality carbohydrate and fibre
    "sweet potato", "sweet potatoes", "pumpkin", "butternut squash", "squash",
    "lentil", "lentils", "green lentils", "red lentils", "chickpea",
    "chickpeas", "garbanzo beans", "quinoa", "millet", "amaranth", "buckwheat",
    "chicory root", "inulin", "apple pomace", "beet greens",
    # Fruit and vegetable
    "blueberry", "blueberries", "cranberry", "cranberries", "apple", "apples",
    "carrot", "carrots", "spinach", "kale", "broccoli", "parsley",
    "dandelion greens", "celery", "cucumber", "zucchini", "banana",
    "strawberry", "strawberries", "raspberry", "papaya", "mango",
    # Beneficial fats
    "fish oil", "salmon oil", "herring oil", "menhaden oil", "chicken fat",
    "duck fat", "cod liver oil", "krill oil", "flaxseed", "flaxseeds",
    "flaxseed oil", "chia seed", "chia seeds", "hemp seed",
    # Functional extras
    "green mussel", "green lipped mussel", "new zealand green mussel",
    "kelp", "dried kelp", "spirulina", "chlorella", "turmeric", "ginger",
    "milk thistle", "probiotic", "probiotics", "dried chicory root",
    "montmorillonite clay", "pumpkin seed", "colostrum", "goat milk",
    "arctic char", "rockfish", "ocean rockfish", "mussel", "clam", "oyster",
    "shrimp", "krill", "squid", "octopus", "tomato", "tomatoes", "beet greens",
    "psyllium seed husk", "psyllium husk", "psyllium", "fenugreek",
    "fenugreek seeds", "peanut butter", "sunflower seed", "sesame seed",
    "bacillus coagulans", "dried bacillus coagulans fermentation product",
    "enterococcus faecium", "lactobacillus acidophilus", "yucca schidigera",
    "borage oil", "evening primrose oil", "hydrolyzed collagen", "collagen",
    "fructooligosaccharide", "fructooligosaccharides", "chicory",
    "น้ำมันดอกโบราจ", "คอลลาเจนไฮโดรไลส์", "ฟรุกโตโอลิโกแซคคาไรด์",
    "เมล็ดไซเลี่ยม", "เนื้อและเปลือกของเมล็ดไซเลี่ยม", "ฟักทองบด",
    # Thai
    "ไก่", "เนื้อไก่", "เนื้อไก่สด", "ผงเนื้อไก่", "อกไก่",
    "ปลาแซลมอน", "เนื้อปลาแซลมอน", "น้ำมันปลาแซลมอน",
    "ปลาทูน่า", "เนื้อปลาทูน่า", "ผงปลาทูน่า",
    "เนื้อวัว", "เนื้อแกะ", "เนื้อหมู", "เนื้อเป็ด", "เนื้อไก่งวง",
    "ตับไก่", "ตับวัว", "ตับแกะ", "หัวใจไก่", "ไข่", "ไข่ทั้งฟอง", "ผงไข่",
    "น้ำมันปลา", "น้ำมันไก่", "น้ำมันแซลมอน",
    "มันเทศ", "ฟักทอง", "ถั่วเลนทิล", "ถั่วลูกไก่",
    "บลูเบอร์รี่", "แครนเบอร์รี่", "แอปเปิ้ล", "แครอท",
    "เมล็ดแฟลกซ์", "ปลาเฮอร์ริ่ง", "ปลาแอนโชวี", "สาหร่ายทะเล",
}

YELLOW_TERMS: set[str] = {
    # Grains and starches — usable energy, not quality protein
    "rice", "brown rice", "white rice", "brewers rice", "rice flour",
    "rice bran", "ground rice", "corn", "maize", "ground corn",
    "whole grain corn", "corn starch", "wheat", "whole wheat", "wheat flour",
    "wheat middlings", "wheat bran", "oat", "oats", "oatmeal", "oat groats",
    "barley", "pearled barley", "sorghum", "rye", "triticale",
    "potato", "potatoes", "potato starch", "dried potatoes", "tapioca",
    "tapioca starch", "cassava", "pea starch", "pea flour", "pea protein",
    "pea fiber", "pea fibre", "peas", "pea", "field peas", "yellow peas",
    "green peas", "split peas", "legumes", "soybean", "soybeans", "soy",
    "soybean meal", "soy protein", "soy protein isolate", "soy flour",
    "corn germ meal", "distillers dried grains",
    # Fibre and bulking
    "beet pulp", "dried beet pulp", "cellulose", "powdered cellulose",
    "tomato pomace", "citrus pulp", "peanut hulls", "oat hulls", "soybean hulls",
    # Plant oils — fine, but not the omega-3 sources above
    "canola oil", "sunflower oil", "safflower oil", "soybean oil",
    "corn oil", "coconut oil", "palm oil", "olive oil", "coconut meal",
    # Gums, thickeners, texture agents
    "carrageenan", "guar gum", "xanthan gum", "locust bean gum", "agar agar",
    "agar", "gelatin", "sodium tripolyphosphate", "cassia gum",
    # Salt and simple palatants
    "salt", "sodium chloride", "natural flavor", "natural flavour",
    "natural flavors", "natural flavours", "yeast", "brewers yeast",
    "dried yeast", "yeast extract", "yeast culture", "lecithin",
    "soy lecithin", "molasses", "sugar", "caramel", "corn syrup",
    "dried whey", "whey", "milk", "dried milk", "cheese powder",
    "flavor", "flavour", "flavors", "flavours", "natural flavor (yeast)",
    "vegetable broth", "vegetable stock", "coconut glycerin", "glycerin",
    "vegetable glycerin", "cane molasses", "dried plain beet pulp",
    "plant fiber", "plant fibre", "vegetable fiber",
    "เยื่อหัวบีท", "เยื่อใยจากพืช", "กลีเซอรีน", "น้ำซุปผัก",
    # Thai
    "ข้าว", "ข้าวขาว", "ข้าวกล้อง", "ข้าวต้ม", "แป้งข้าว", "ปลายข้าว",
    "ข้าวโพด", "แป้งข้าวโพด", "ข้าวสาลี", "แป้งสาลี", "กลูเทนข้าวสาลี",
    "กลูเตนข้าวสาลี", "รำข้าว", "รำข้าวสาลี",
    "มันสำปะหลัง", "แป้งมันสำปะหลัง", "มันฝรั่ง", "แป้งมันฝรั่ง",
    "ถั่วลันเตา", "โปรตีนถั่วลันเตา", "ถั่วเหลือง", "โปรตีนถั่วเหลือง",
    "กากถั่วเหลือง", "น้ำมันดอกทานตะวัน", "น้ำมันคาโนลา", "น้ำมันมะพร้าว",
    "น้ำมันปาล์ม", "กากน้ำตาล", "น้ำตาล", "เซลลูโลส", "ผงเซลลูโลส",
    "เกลือ", "โซเดียมคลอไรด์", "ยีสต์", "คาราจีแนน", "เจลาติน",
    "กากบีท", "แป้ง", "ข้าวโอ๊ต", "ข้าวบาร์เลย์", "เลซิติน",
}

# Recognised, but carries no quality signal either way. Excluded from the
# ratio entirely rather than counted as a mediocre ingredient.
NEUTRAL_TERMS: set[str] = {
    "water", "water sufficient for processing", "moisture",
    "vitamins", "minerals", "trace minerals", "vitamin premix",
    "mineral premix", "vitamin supplement", "mineral supplement",
    "taurine", "l-carnitine", "dl-methionine", "l-lysine", "lysine",
    "methionine", "l-threonine", "threonine", "tryptophan", "l-tryptophan",
    "arginine", "glycine", "glutamine", "glucosamine",
    "glucosamine hydrochloride", "chondroitin", "chondroitin sulfate",
    "choline chloride", "citric acid", "lactic acid", "phosphoric acid",
    "mixed tocopherols", "tocopherols", "rosemary extract", "green tea extract",
    "ascorbic acid", "calcium carbonate", "calcium sulfate",
    "dicalcium phosphate", "tricalcium phosphate", "monocalcium phosphate",
    "dipotassium phosphate", "potassium chloride", "potassium citrate",
    "magnesium sulfate", "magnesium sulphate", "magnesium oxide",
    "magnesium proteinate", "sodium bicarbonate", "ferrous sulfate",
    "iron oxide", "zinc oxide", "zinc sulfate", "zinc proteinate",
    "copper sulfate", "copper proteinate", "manganese sulfate",
    "manganous oxide", "manganese proteinate", "calcium iodate",
    "potassium iodide", "sodium selenite", "selenium yeast",
    "zinc amino acid complex", "iron amino acid complex",
    "copper amino acid complex", "manganese amino acid complex",
    "cobalt amino acid complex", "calcium pantothenate", "d-calcium pantothenate",
    "thiamine mononitrate", "thiamine hydrochloride", "riboflavin",
    "riboflavin supplement", "pyridoxine hydrochloride", "niacin",
    "niacin supplement", "folic acid", "biotin", "inositol",
    "vitamin a supplement", "vitamin b12 supplement", "vitamin d3 supplement",
    "vitamin e supplement", "vitamin k", "menadione sodium bisulfite complex",
    "beta-carotene", "l-ascorbyl-2-polyphosphate", "preservative",
    "clinoptilolite", "zeolite", "sodium tripolyphosphate",
    "ไคลน็อพทิโลไลท์", "สารถนอมคุณภาพอาหารสัตว์", "สารกันบูด",
    "แร่ธาตุ", "วิตามิน", "น้ำ", "ทอรีน", "แอล-คาร์นิทีน", "กรดซิตริก",
    "แคลเซียมคาร์บอเนต", "กรดโฟลิก", "ไบโอติน", "ไนอาซิน",
}

RED_TERMS: set[str] = {
    # Anonymous animal material — species undeclared
    "meat by-product", "meat by-products", "meat by-product meal",
    "animal by-product", "animal by-products", "animal by-product meal",
    "poultry by-product", "poultry by-products", "poultry by-product meal",
    "by-product meal", "by-product meals", "by-products", "by-product",
    "meat and bone meal", "meat meal", "bone meal", "animal digest",
    "animal fat", "poultry fat", "poultry meal", "poultry",
    "fish meal", "fish by-product", "blood meal", "feather meal",
    "hydrolyzed poultry by-products", "liver digest",
    # Cheap protein boosters and low-value fillers
    "corn gluten meal", "corn gluten", "wheat gluten", "rice gluten",
    "vegetable oil", "vegetable fat", "generic fat",
    "brewers dried grains", "peanut hull",
    # Added sugar and artificial palatants
    "artificial flavor", "artificial flavour", "artificial flavors",
    "sugar syrup", "high fructose corn syrup", "propylene glycol",
    "sodium hexametaphosphate",
    # Thai
    "ผลพลอยได้จากสัตว์ปีก", "ผลพลอยได้จากเนื้อสัตว์", "ผลพลอยได้จากสุกร",
    "ผลิตภัณฑ์พลอยได้จากสัตว์ปีก", "ผลิตภัณฑ์พลอยได้จากเนื้อสัตว์",
    "ไขมันสัตว์", "น้ำมันพืช", "อาหารสัตว์บด", "แป้งเนื้อสัตว์",
    "กลูเตนข้าวโพด", "ผงเลือด", "ผงกระดูก", "กลิ่นสังเคราะห์",
}

BLACK_TERMS: set[str] = {
    "bha", "bht", "butylated hydroxyanisole", "butylated hydroxytoluene",
    "ethoxyquin", "propyl gallate", "tbhq", "tertiary butylhydroquinone",
    "artificial color", "artificial colour", "artificial colors",
    "artificial colours", "added color", "titanium dioxide",
    "fd&c red 40", "fd&c yellow 5", "fd&c yellow 6", "fd&c blue 1",
    "fd&c blue 2", "red 40", "yellow 5", "yellow 6", "blue 1", "blue 2",
    "sodium nitrite", "sodium nitrate", "potassium sorbate",
    "sodium metabisulfite", "menadione",
    "บีเอชเอ", "บีเอชที", "อีทอกซีควิน", "สีสังเคราะห์", "โซเดียมไนไตรต์",
}

# Regex families, applied after exact lookup. Ordered worst-first.
_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\b(bha|bht|ethoxyquin|tbhq|propyl gallate)\b"), BLACK),
    (re.compile(r"\bartificial\s+(color|colour|flavor|flavour)"), BLACK),
    (re.compile(r"\bfd&c\b|\b(red|yellow|blue)\s*(40|5|6|1|2)\b"), BLACK),
    (re.compile(r"\bsodium\s+nitr(ite|ate)\b"), BLACK),
    # Vitamins and minerals before anything else can claim them, so
    # "iron amino acid complex" is not read as a protein source.
    (re.compile(r"\bvitamin\b|\bsupplement\b|\bamino acid complex\b"
                r"|\bproteinate\b|\bsulfate\b|\bsulphate\b|\bphosphate\b"
                r"|\bchloride\b|\bcarbonate\b|\boxide\b|\bselenite\b"
                r"|\biodate\b|\btocopherol"), NEUTRAL),
    (re.compile(r"\bpreservative\b|\bpremix\b"), NEUTRAL),
    # EU feed-additive notation on Royal Canin panels: "E1 (Iron): 49 mg".
    (re.compile(r"^e\d+\b|\b\d+\s?(mg|iu|mcg|g)/?(kg)?\b"), NEUTRAL),
    (re.compile(r"\bgluten meal\b|\bgluten\b"), RED),
    (re.compile(r"\bmeat and bone meal\b|\bbone meal\b|\bblood meal\b"
                r"|\bfeather meal\b|\banimal digest\b"), RED),
    (re.compile(r"\bfish meal\b"), RED),
    (re.compile(r"\bmeal\b"), None),      # resolved by _classify_meal
    (re.compile(r"by-?\s?products?\b"), None),  # resolved by _named_byproduct
]

_WS = re.compile(r"\s+")
_PAREN = re.compile(r"\s*\([^)]*\)")
_NONWORD_EDGE = re.compile(r"^[^\w฀-๿]+|[^\w฀-๿%]+$")


def normalize(name: str) -> str:
    """Lowercase, drop parentheticals and edge punctuation, strip qualifiers."""
    n = _PAREN.sub("", name.lower())
    n = _NONWORD_EDGE.sub("", n)
    n = _WS.sub(" ", n).strip()
    # G.A.P. Step 2 Chicken -> chicken  (Global Animal Partnership welfare tier)
    n = re.sub(r"^g\.?a\.?p\.?\s*step\s*\d+\s*", "", n)
    changed = True
    while changed:
        changed = False
        for q in _QUALIFIERS:
            if n.startswith(q + " "):
                n = n[len(q) + 1:].strip()
                changed = True
    return n


def _has_species(n: str) -> bool:
    return any(re.search(rf"\b{re.escape(s)}\b", n) for s in _SPECIES)


def _classify_meal(n: str) -> str:
    """"X meal" is only as good as the X. Named species, good; anonymous, bad."""
    if "by-product" in n or "by product" in n or "byproduct" in n:
        return _named_byproduct(n)
    if _has_species(n):
        return GREEN
    if re.search(r"\b(poultry|meat|animal|fish|marine)\b", n):
        return RED
    if re.search(r"\b(corn|soybean|coconut|sunflower|canola|gluten)\b", n):
        return YELLOW
    return UNKNOWN


def _named_byproduct(n: str) -> str:
    """A declared species makes a by-product a defined commodity, not a mystery."""
    return YELLOW if _has_species(n) else RED


def grade_ingredient(name: str) -> str:
    """Classify one ingredient name.

    Returns ``green``/``yellow``/``red``/``black`` for a recognised quality
    signal, ``neutral`` for a recognised but quality-neutral additive, and
    ``unknown`` when the string is not recognised at all. Callers must not
    treat ``unknown`` as a quality verdict — it means "no data".
    """
    n = normalize(name)
    if not n:
        return UNKNOWN

    for table, verdict in (
        (BLACK_TERMS, BLACK), (RED_TERMS, RED), (GREEN_TERMS, GREEN),
        (YELLOW_TERMS, YELLOW), (NEUTRAL_TERMS, NEUTRAL),
    ):
        if n in table:
            return verdict

    for pattern, verdict in _PATTERNS:
        if not pattern.search(n):
            continue
        if verdict is not None:
            return verdict
        return _classify_meal(n) if "meal" in n else _named_byproduct(n)

    # Whole-word containment as a last resort, worst family first. Word
    # boundaries matter: plain substring matching graded "peanut" as the
    # yellow "pea" and "chicken by-product meal" as green "chicken".
    for table, verdict in (
        (BLACK_TERMS, BLACK), (RED_TERMS, RED),
        (GREEN_TERMS, GREEN), (YELLOW_TERMS, YELLOW),
    ):
        for term in table:
            if not term.isascii():
                if term in n:
                    return verdict
            elif re.search(rf"\b{re.escape(term)}\b", n):
                return verdict

    return UNKNOWN
