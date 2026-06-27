# 3rd Site Scrapers — chicpreowned.com

## Vestiaire Collective (active, weekly)
Fetches USD prices from Vestiaire, converts to THB via live exchange rate.
```
python 3rd/scraper/price_sampler.py
```

## Carousell Thailand (needs login once)
```
# Step 1: Log in (one-time)
python 3rd/scraper/carousell_sampler.py --login

# Step 2: Run scraper
python 3rd/scraper/carousell_sampler.py
```
Cookies saved to `scraper/cookies_carousell.json` (gitignored).

## Shopee Thailand (needs login once)
```
# Step 1: Log in (one-time)
python 3rd/scraper/shopee_sampler.py --login

# Step 2: Run scraper
python 3rd/scraper/shopee_sampler.py
```
Cookies saved to `scraper/cookies_shopee.json` (gitignored).
