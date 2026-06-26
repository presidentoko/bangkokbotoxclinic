CREATE DATABASE IF NOT EXISTS bkkcheckup
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bkkcheckup;

CREATE TABLE hospitals (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(256) NOT NULL,
  name_th       VARCHAR(256) NULL,
  slug          VARCHAR(256) NOT NULL UNIQUE,
  tier          VARCHAR(16)  NULL,
  area          VARCHAR(128) NULL,
  lat           DECIMAL(10,7) NULL,
  lng           DECIMAL(10,7) NULL,
  jci           TINYINT(1) NOT NULL DEFAULT 0,
  checkup_url   VARCHAR(1024) NULL,
  gbp_place_id  VARCHAR(128) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE checkup_packages (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hospital_id    BIGINT UNSIGNED NOT NULL,
  name           VARCHAR(512) NOT NULL,
  category       VARCHAR(32) NULL,
  target_gender  VARCHAR(8) NULL,
  target_age_min SMALLINT NULL,
  price          DECIMAL(12,2) NULL,
  currency       VARCHAR(8) DEFAULT 'THB',
  includes_raw   TEXT NULL,
  has_blood      TINYINT(1) NULL,
  has_xray       TINYINT(1) NULL,
  has_ultrasound TINYINT(1) NULL,
  has_ct         TINYINT(1) NULL,
  has_mri        TINYINT(1) NULL,
  has_ecg        TINYINT(1) NULL,
  has_treadmill  TINYINT(1) NULL,
  has_cancer_marker   TINYINT(1) NULL,
  has_doctor_consult  TINYINT(1) NULL,
  has_interpreter     TINYINT(1) NULL,
  results_days   SMALLINT NULL,
  source_url     VARCHAR(1024) NULL,
  raw_json       JSON NULL,
  scraped_at     DATETIME NOT NULL,
  KEY idx_hospital (hospital_id),
  KEY idx_category (category),
  CONSTRAINT fk_pkg_hosp FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
) ENGINE=InnoDB;

CREATE TABLE package_price_snapshots (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  package_id    BIGINT UNSIGNED NOT NULL,
  hospital_id   BIGINT UNSIGNED NOT NULL,
  snapshot_date DATE NOT NULL,
  price         DECIMAL(12,2) NULL,
  currency      VARCHAR(8) DEFAULT 'THB',
  UNIQUE KEY uq_snap (package_id, snapshot_date)
) ENGINE=InnoDB;

CREATE TABLE hospital_reviews (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hospital_id   BIGINT UNSIGNED NOT NULL,
  rating        DECIMAL(3,2) NULL,
  review_count  INT NULL,
  trust_score   DECIMAL(5,2) NULL,
  source        VARCHAR(32) DEFAULT 'gbp',
  scraped_at    DATETIME NOT NULL,
  KEY idx_hospital (hospital_id)
) ENGINE=InnoDB;
