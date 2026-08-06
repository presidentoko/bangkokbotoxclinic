// enrich_hospitals.js — Google Places API v1으로 전화번호 + 24h 상태 수집
const https = require('https')
const fs = require('fs')
const path = require('path')

const API_KEY = 'AIzaSyAXvwXRILAkSBJcGrwIGZ444vq2CMiKT_I'
const DATA_PATH = path.join(__dirname, '../data/hospitals.json')
const CHECKPOINT_PATH = path.join(__dirname, '../data/hospitals_enrich_checkpoint.json')

const hospitals = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

// 체크포인트 로드 (중단 후 재시작 지원)
let checkpoint = {}
if (fs.existsSync(CHECKPOINT_PATH)) {
  checkpoint = JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'))
  console.log(`체크포인트 로드: ${Object.keys(checkpoint).length}개 완료`)
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function is24h(openingHours) {
  if (!openingHours?.periods) return false
  return openingHours.periods.some(p =>
    p.open?.day === 0 && p.open?.time === '0000' && !p.close
  )
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function postJson(body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body)
    const options = {
      hostname: 'places.googleapis.com',
      path: '/v1/places:searchText',
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.nationalPhoneNumber,places.location,places.regularOpeningHours',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { resolve({}) }
      })
    })
    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')) })
    req.write(bodyStr)
    req.end()
  })
}

async function enrichOne(h) {
  if (checkpoint[h.id]) return checkpoint[h.id]

  const searchName = (h.name_en && h.name_en !== h.name_th) ? h.name_en : h.name_th

  try {
    const data = await postJson({
      textQuery: searchName,
      locationBias: {
        circle: {
          center: { latitude: h.lat, longitude: h.lng },
          radius: 500,
        },
      },
      maxResultCount: 5,
    })

    const result = { phone: '', is_24h: h.is_24h }

    if (data.places && data.places.length > 0) {
      // 가장 가까운 결과 선택
      let best = null
      let bestDist = Infinity

      for (const place of data.places) {
        if (place.location) {
          const dist = distance(h.lat, h.lng, place.location.latitude, place.location.longitude)
          if (dist < bestDist) {
            bestDist = dist
            best = place
          }
        } else if (!best) {
          best = place
        }
      }

      if (best) {
        result.phone = best.nationalPhoneNumber || ''
        if (best.regularOpeningHours) {
          result.is_24h = is24h(best.regularOpeningHours) || h.is_24h
        }
        result._dist = Math.round(bestDist || 0)
      }
    }

    checkpoint[h.id] = result
    return result
  } catch (e) {
    console.error(`  오류 [${h.id}]: ${e.message}`)
    return { phone: '', is_24h: h.is_24h }
  }
}

async function main() {
  const results = [...hospitals]
  let phoneFound = 0
  let updated24h = 0

  const BATCH = 10  // 저장 주기 (10개마다)
  const DELAY = 0   // 순차 처리라 배치간 딜레이 불필요

  console.log(`총 ${hospitals.length}개 병원 처리 시작...\n`)

  for (let i = 0; i < hospitals.length; i += BATCH) {
    const batch = hospitals.slice(i, i + BATCH)

    for (let j = 0; j < batch.length; j++) {
      const h = batch[j]
      const idx = i + j
      const u = await enrichOne(h)
      if (u.phone) {
        results[idx].phone = u.phone
        phoneFound++
      }
      if (u.is_24h !== h.is_24h) {
        results[idx].is_24h = u.is_24h
        updated24h++
      }
      await sleep(200)
    }

    // 체크포인트 저장 (10 배치마다)
    if ((i / BATCH) % 10 === 9) {
      fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2))
    }

    const done = Math.min(i + BATCH, hospitals.length)
    process.stdout.write(`\r진행: ${done}/${hospitals.length} | 전화: ${phoneFound} | 24h 업데이트: ${updated24h}`)

    await sleep(DELAY)
  }

  // 최종 저장
  fs.writeFileSync(DATA_PATH, JSON.stringify(results, null, 2))
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2))

  console.log(`\n\n완료!`)
  console.log(`  전화번호 수집: ${phoneFound}/${hospitals.length}`)
  console.log(`  24h 상태 업데이트: ${updated24h}`)

  // 샘플 출력
  const withPhone = results.filter(h => h.phone).slice(0, 10)
  console.log('\n전화번호 샘플:')
  withPhone.forEach(h => console.log(`  ${h.name_th} | ${h.phone}`))
}

main().catch(console.error)
