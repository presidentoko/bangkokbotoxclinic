"""
Create package_clicks table for affiliate click tracking.
Run once: python setup_click_tracking.py
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

conn = mysql.connector.connect(
    host=os.environ.get("DB_HOST", "127.0.0.1"),
    port=int(os.environ.get("DB_PORT", "3306")),
    user=os.environ.get("DB_USER", "root"),
    password=os.environ.get("DB_PASS", ""),
    database="bkkcheckup",
    ssl_disabled=os.environ.get("DB_HOST", "127.0.0.1") == "127.0.0.1",
)
cur = conn.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS package_clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT NOT NULL,
  dest_url VARCHAR(500),
  clicked_at DATETIME NOT NULL DEFAULT NOW(),
  ip_hash VARCHAR(32),
  INDEX idx_package_clicked (package_id, clicked_at),
  FOREIGN KEY (package_id) REFERENCES checkup_packages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
""")
conn.commit()
print("package_clicks table created (or already exists)")
cur.close()
conn.close()
