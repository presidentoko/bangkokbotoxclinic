import os

SEARCH_QUERIES = [
    ("โรงพยาบาลสัตว์",    "th_vet"),
    ("animal hospital",    "en_vet"),
    ("คลินิกสัตว์เลี้ยง", "th_clinic"),
]

SEARCH_QUERY = os.environ.get("SEARCH_QUERY", "โรงพยาบาลสัตว์")
SEARCH_TAG   = os.environ.get("SEARCH_TAG", "th_vet")

MIN_REVIEW_COUNT = 1
REVIEWS_PER_RATING = 0
MAX_RESTAURANTS = None
OUTPUT_DIR = os.environ.get("CITY_OUTPUT_DIR", "petvet_output")

GRID_CENTER_LAT = float(os.environ.get("CITY_LAT",      "13.7462890"))
GRID_CENTER_LNG = float(os.environ.get("CITY_LNG",      "100.5346890"))
_radius_m       = int(os.environ.get("CITY_RADIUS_M", "30000"))

GRID_ZONES            = [(_radius_m, 500)]
GRID_SUBDIVIDE_THRESHOLD = 999999
GRID_MIN_STEP_M       = 500
GRID_ZOOM             = 17

GRID_RADIUS_M = 15000
GRID_STEP_M   = 500

HEADLESS = True
SLOW_MO  = 50
LANGUAGE = "th"

PROXY_HOST    = "127.0.0.1"
VPN_PORT_BASE = 2080

GRID_PROXY_PORT = int(os.environ.get("GRID_PROXY_PORT", "2080"))
GRID_N_WORKERS  = int(os.environ.get("GRID_N_WORKERS",  "2"))

PROXY_PORT_BASE = int(os.environ.get("PROXY_PORT_BASE", "2082"))
N_WORKERS       = int(os.environ.get("N_WORKERS",       "2"))

PROXY_PORT = 2080
