from __future__ import annotations

GREEN: set[str] = {
    # English
    "salmon", "tuna", "chicken", "beef", "lamb", "turkey", "duck",
    "venison", "pork", "whitefish", "trout", "herring", "anchovy",
    "chicken meal", "salmon meal", "lamb meal", "turkey meal", "beef meal",
    "tuna meal", "herring meal",
    "sweet potato", "lentil", "blueberry", "cranberry",
    "flaxseed", "fish oil", "chicken fat", "salmon oil",
    "dried egg", "whole egg", "egg product",
    "chicken liver", "beef liver",
    # Thai — เนื้อสัตว์คุณภาพสูง
    "ไก่", "เนื้อไก่", "เนื้อไก่สด", "ผงเนื้อไก่",
    "ปลาแซลมอน", "เนื้อปลาแซลมอน", "น้ำมันปลาแซลมอน",
    "ปลาทูน่า", "เนื้อปลาทูน่า", "ผงปลาทูน่า",
    "เนื้อวัว", "เนื้อแกะ", "เนื้อหมู", "เนื้อเป็ด", "เนื้อไก่งวง",
    "ตับไก่", "ตับวัว", "ไข่", "ไข่ทั้งฟอง", "ผงไข่",
    "น้ำมันปลา", "น้ำมันไก่", "น้ำมันแซลมอน",
    "มันเทศ", "ถั่วเลนทิล", "บลูเบอร์รี่", "แครนเบอร์รี่",
    "เมล็ดแฟลกซ์", "ปลาเฮอร์ริ่ง", "ปลาแอนโชวี",
}

YELLOW: set[str] = {
    # English
    "rice", "brown rice", "white rice", "brewers rice",
    "corn", "maize", "wheat", "oat", "barley", "sorghum", "millet",
    "pea", "pea protein", "pea starch", "pea fiber",
    "potato", "potato starch", "tapioca", "cassava",
    "soybean", "soy protein isolate", "canola oil", "sunflower oil",
    "beet pulp", "cellulose", "carrageenan",
    "salt", "sodium chloride", "potassium chloride",
    "dl-methionine", "taurine", "l-carnitine",
    # Thai — ธัญพืชและแหล่งคาร์โบไฮเดรต
    "ข้าว", "ข้าวขาว", "ข้าวกล้อง", "ข้าวต้ม", "แป้งข้าว",
    "ข้าวโพด", "แป้งข้าวโพด",
    "ข้าวสาลี", "แป้งสาลี", "กลูเตนข้าวสาลี",
    "มันสำปะหลัง", "แป้งมันสำปะหลัง", "มันฝรั่ง", "แป้งมันฝรั่ง",
    "ถั่วลันเตา", "โปรตีนถั่วลันเตา",
    "ถั่วเหลือง", "โปรตีนถั่วเหลือง",
    "น้ำมันดอกทานตะวัน", "น้ำมันคาโนลา",
    "กากน้ำตาล", "เซลลูโลส",
    "เกลือ", "โซเดียมคลอไรด์",
    "ทอรีน", "แอล-คาร์นิทีน",
    "ข้าวโอ๊ต", "ข้าวบาร์เลย์",
}

RED: set[str] = {
    # English
    "poultry by-product meal", "poultry by-product", "poultry by-products",
    "animal by-product meal", "animal by-products",
    "meat by-product", "meat and bone meal",
    "animal fat", "animal digest",
    "corn gluten meal", "wheat gluten",
    "meat meal",
    "vegetable oil",
    "fish meal",
    # Thai — ผลพลอยได้และส่วนประกอบคุณภาพต่ำ
    "ผลพลอยได้จากสัตว์ปีก", "ผลพลอยได้จากเนื้อสัตว์",
    "ผลิตภัณฑ์พลอยได้จากสัตว์ปีก", "ผลิตภัณฑ์พลอยได้จากเนื้อสัตว์",
    "ไขมันสัตว์", "น้ำมันพืช",
    "อาหารสัตว์บด", "แป้งเนื้อสัตว์",
    "กลูเตนข้าวโพด",
}

BLACK: set[str] = {
    # English
    "bha", "bht", "ethoxyquin",
    "artificial color", "artificial colour",
    "artificial flavor", "artificial flavour",
    "fd&c red 40", "fd&c yellow 5", "fd&c blue 1",
    "sodium nitrite", "potassium sorbate",
    "propyl gallate", "tbhq",
    "red 40", "yellow 5", "blue 2",
    # Thai — สารกันบูดและสีสังเคราะห์อันตราย
    "บีเอชเอ", "บีเอชที", "อีทอกซีควิน",
    "สีสังเคราะห์", "กลิ่นสังเคราะห์",
    "โซเดียมไนไตรต์",
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
