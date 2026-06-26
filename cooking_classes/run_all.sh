#!/bin/bash
# Run full cooking class pipeline: scrape → receipts
# Usage: bash cooking_classes/run_all.sh
# Or from inside the folder: bash run_all.sh
set -e

# Resolve to repo root regardless of where we call from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Step 1: Scrape cooking class venues ==="
python scraper.py

echo "=== Step 2: Generate receipts (Claude API) ==="
python generate_receipts.py

echo "=== Done! ==="
echo "Results: $(pwd)/output/receipts.json"
