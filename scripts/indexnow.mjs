#!/usr/bin/env node
/**
 * Submit a site's sitemap URLs to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Google ignores IndexNow, but it is the only way to tell the other engines a
 * URL exists without waiting out their crawl schedule — which matters most for
 * a site they have barely discovered. Run after a deploy:
 *
 *   node scripts/indexnow.mjs 2nd
 *   node scripts/indexnow.mjs 3rd
 *   node scripts/indexnow.mjs 3rd --limit 100     # partial resubmit
 *
 * The key file must be live at https://<host>/<key>.txt containing exactly the
 * key, or the endpoint rejects the batch with 403. See <site>/public/.
 */

const SITES = {
  '2nd': {
    host: 'www.secondluxuryitems.com',
    key: 'cfa6e36624ce9ec9194f4829dbf961a3',
  },
  '3rd': {
    host: 'www.chicpreowned.com',
    key: '88a93f35a6ee072c944cf2327d46acb7',
  },
}

const BATCH_SIZE = 10000 // IndexNow's documented per-request maximum

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

const siteArg = process.argv[2]
const site = SITES[siteArg]
if (!site) fail(`usage: node scripts/indexnow.mjs <${Object.keys(SITES).join('|')}> [--limit N]`)

const limitFlag = process.argv.indexOf('--limit')
const limit = limitFlag > -1 ? Number(process.argv[limitFlag + 1]) : Infinity
if (Number.isNaN(limit)) fail('--limit needs a number')

const sitemapUrl = `https://${site.host}/sitemap.xml`
console.log(`fetching ${sitemapUrl}`)

const res = await fetch(sitemapUrl)
if (!res.ok) fail(`sitemap fetch failed: ${res.status}`)
const xml = await res.text()

const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => m[1].trim())
  .filter(u => u.startsWith(`https://${site.host}/`) || u === `https://${site.host}`)
  .slice(0, limit)

if (!urls.length) fail('no URLs parsed out of the sitemap')

// A batch is rejected wholesale if the key file is not reachable, so check
// first rather than discovering it in a 403 on the full payload.
const keyUrl = `https://${site.host}/${site.key}.txt`
const keyRes = await fetch(keyUrl)
const keyBody = keyRes.ok ? (await keyRes.text()).trim() : ''
if (keyBody !== site.key) {
  fail(`key file not live or wrong contents at ${keyUrl} (got ${keyRes.status}, body "${keyBody.slice(0, 40)}") — deploy first`)
}
console.log(`key verified at ${keyUrl}`)

let submitted = 0
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  const batch = urls.slice(i, i + BATCH_SIZE)
  const body = {
    host: site.host,
    key: site.key,
    keyLocation: keyUrl,
    urlList: batch,
  }
  const post = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  // 200 = accepted, 202 = accepted but key still being validated. Both fine.
  if (post.status !== 200 && post.status !== 202) {
    fail(`IndexNow rejected batch ${i / BATCH_SIZE + 1}: ${post.status} ${await post.text()}`)
  }
  submitted += batch.length
  console.log(`batch ${i / BATCH_SIZE + 1}: ${batch.length} URLs -> ${post.status}`)
}

console.log(`submitted ${submitted} URLs for ${site.host}`)
