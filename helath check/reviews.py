"""
reviews.py — fetch Google Business Profile ratings via Outscraper and store in hospital_reviews.
Requires OUTSCRAPER_API_KEY env var and gbp_place_id populated in hospitals table.

Usage:
  python reviews.py
  python reviews.py --slug bumrungrad
"""
import argparse
import datetime
import os
import pymysql
from outscraper import ApiClient
from config import DB_CONFIG


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", default=None, help="process single hospital slug only")
    args = parser.parse_args()

    api_key = os.environ.get("OUTSCRAPER_API_KEY")
    if not api_key:
        raise SystemExit("Set OUTSCRAPER_API_KEY environment variable.")

    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor(pymysql.cursors.DictCursor) as cur:
        if args.slug:
            cur.execute(
                "SELECT id, slug, gbp_place_id FROM hospitals WHERE slug = %s AND gbp_place_id IS NOT NULL",
                (args.slug,),
            )
        else:
            cur.execute("SELECT id, slug, gbp_place_id FROM hospitals WHERE gbp_place_id IS NOT NULL")
        hospitals = cur.fetchall()

    if not hospitals:
        print("No hospitals with gbp_place_id found.")
        conn.close()
        return

    outscraper = ApiClient(api_key=api_key)
    now = datetime.datetime.utcnow()

    for hosp in hospitals:
        print(f"[reviews] {hosp['slug']} (place_id={hosp['gbp_place_id']})")
        try:
            results = outscraper.google_maps_search(
                [hosp["gbp_place_id"]],
                fields=["rating", "reviews"],
            )
            place = results[0][0] if results and results[0] else {}
            rating = place.get("rating")
            review_count = place.get("reviews")
        except Exception as exc:
            print(f"  ✗ {exc}")
            continue

        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO hospital_reviews
                  (hospital_id, rating, review_count, trust_score, source, scraped_at)
                VALUES (%s, %s, %s, NULL, 'gbp', %s)
            """, (hosp["id"], rating, review_count, now))
        print(f"  ✓ rating={rating}, reviews={review_count}")

    conn.close()
    print("Done.")


if __name__ == "__main__":
    main()
