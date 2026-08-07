-- bkkcheckup schema — reconstructed 2026-08-06.
--
-- The previous version of this file had drifted badly out of date: columns the
-- site reads on every request (hospitals.city, .rating, .address, .phone,
-- .website, .description, .founded_year, .bed_count, .specialties,
-- .accreditations, .email, checkup_packages.description) were missing entirely,
-- hospital_reviews described an aggregate-ratings table while web/lib/db.ts
-- reads individual reviews out of it, and package_clicks was absent. Those
-- columns were added straight against the live database over time and never
-- written back here — which only became visible when the Railway trial expired
-- and this file turned out to be the only surviving description of the data.
--
-- Rebuilt from the union of:
--   * web/lib/db.ts        — every column the site SELECTs (authoritative for reads)
--   * *.py scraper INSERTs — every column the pipeline writes
--   * take_price_snapshot.py / setup_click_tracking.py — their own CREATE TABLEs
--
-- Keep this file in sync from now on. It is the recovery plan.

CREATE DATABASE IF NOT EXISTS bkkcheckup
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bkkcheckup;

CREATE TABLE IF NOT EXISTS hospitals (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(256) NOT NULL,
  name_th        VARCHAR(256) NULL,
  slug           VARCHAR(256) NOT NULL UNIQUE,
  tier           VARCHAR(16)  NULL,
  area           VARCHAR(128) NULL,
  city           VARCHAR(128) NULL,
  country        VARCHAR(64)  NULL,
  lat            DECIMAL(10,7) NULL,
  lng            DECIMAL(10,7) NULL,
  jci            TINYINT(1) NOT NULL DEFAULT 0,
  checkup_url    VARCHAR(1024) NULL,
  gbp_place_id   VARCHAR(128) NULL,
  -- Contact / profile block, added by clinic enrichment.
  address        VARCHAR(512) NULL,
  phone          VARCHAR(64)  NULL,
  website        VARCHAR(1024) NULL,
  email          VARCHAR(256) NULL,
  description    TEXT NULL,
  founded_year   SMALLINT NULL,
  bed_count      INT NULL,
  specialties    TEXT NULL,
  accreditations TEXT NULL,
  -- Aggregate Google rating. Individual reviews live in hospital_reviews.
  rating         DECIMAL(3,2) NULL,
  review_count   INT NULL,
  -- Google Places fields, filled by import_apify.py.
  -- category_name is load-bearing, not decoration: HDmall files beauty salons,
  -- skin-care studios and physiotherapy rooms under "health checkup", so the
  -- import pulled them in as hospitals. Storing Google's own classification
  -- lets the site label what each listing actually is instead of presenting a
  -- salon as a hospital.
  category_name    VARCHAR(128) NULL,
  opening_hours    JSON NULL,
  google_maps_url  VARCHAR(1024) NULL,
  -- Closed businesses stay in the table (nothing is silently deleted) but are
  -- hidden from listings and kept out of the sitemap.
  permanently_closed TINYINT(1) NOT NULL DEFAULT 0,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_city (city),
  KEY idx_jci (jci)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS checkup_packages (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hospital_id    BIGINT UNSIGNED NOT NULL,
  name           VARCHAR(512) NOT NULL,
  category       VARCHAR(32) NULL,
  target_gender  VARCHAR(8) NULL,
  target_age_min SMALLINT NULL,
  price          DECIMAL(12,2) NULL,
  currency       VARCHAR(8) DEFAULT 'THB',
  description    TEXT NULL,
  includes_raw   TEXT NULL,
  has_blood      TINYINT(1) NULL,
  has_xray       TINYINT(1) NULL,
  has_ultrasound TINYINT(1) NULL,
  has_ct         TINYINT(1) NULL,
  has_mri        TINYINT(1) NULL,
  has_ecg        TINYINT(1) NULL,
  has_treadmill  TINYINT(1) NULL,
  has_cancer_marker  TINYINT(1) NULL,
  has_doctor_consult TINYINT(1) NULL,
  has_interpreter    TINYINT(1) NULL,
  results_days   SMALLINT NULL,
  source_url     VARCHAR(1024) NULL,
  raw_json       JSON NULL,
  scraped_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_hospital (hospital_id),
  KEY idx_category (category),
  KEY idx_cat_price (category, price),
  CONSTRAINT fk_pkg_hosp FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
) ENGINE=InnoDB;

-- Matches take_price_snapshot.py, which is what actually created the live
-- table: package_id + date + price only, no hospital_id and no currency.
CREATE TABLE IF NOT EXISTS package_price_snapshots (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  package_id    BIGINT UNSIGNED NOT NULL,
  snapshot_date DATE NOT NULL,
  price         DECIMAL(10,2) NULL,
  KEY idx_package (package_id),
  UNIQUE KEY uq_pkg_date (package_id, snapshot_date)
) ENGINE=InnoDB;

-- Individual review texts, read by getHospitalReviews() in web/lib/db.ts.
CREATE TABLE IF NOT EXISTS hospital_reviews (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hospital_id  BIGINT UNSIGNED NOT NULL,
  author_name  VARCHAR(256) NULL,
  rating       DECIMAL(3,2) NULL,
  review_text  TEXT NULL,
  review_date  DATE NULL,
  source       VARCHAR(32) DEFAULT 'gbp',
  scraped_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_hospital (hospital_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS package_clicks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  dest_url   VARCHAR(500) NULL,
  clicked_at DATETIME NOT NULL DEFAULT NOW(),
  ip_hash    VARCHAR(32) NULL,
  INDEX idx_package_clicked (package_id, clicked_at)
) ENGINE=InnoDB;
