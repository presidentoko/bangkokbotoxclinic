# Master CSV drop-in

Drop the latest scraper export here as `master.csv` and run `npm run build`.

```
data/master.csv   ← drop file here
```

`scripts/build-data.mjs` auto-detects this path. No env var or flag needed.

Fallback order:
1. `HAIR_MASTER_CSV` env var (if set)
2. `./data/master.csv` (this folder)
3. `C:\dbd-scraper\hair\thaihairguide_master.csv` (legacy)

If none exist, `public/data/clinics.json` is preserved as-is (no regen). The site still builds.
