## eBay Price Scraper

`ebay_sampler.py` pulls completed/sold eBay listings for handbags and watches.

### Setup (one-time, free)
1. Go to https://developer.ebay.com
2. Sign in → My Account → Application Access Keys
3. Create a Production key set → copy the **App ID (Client ID)**

### Run
```powershell
$env:EBAY_APP_ID = "YourAppID-SomeName-PRD-..."
python 2nd/scraper/ebay_sampler.py
```
