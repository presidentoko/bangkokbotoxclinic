#!/bin/bash
# Lighthouse / PageSpeed Insights baseline 측정.
# Google PageSpeed Insights API (free, no auth) 사용.
#
# Usage: bash scripts/measure_lighthouse.sh
# Output: 콘솔 + lighthouse_baseline.json (overwrite)

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/lighthouse_baseline.json"

URLS=(
    "https://www.bangkokbotoxclinic.com"
    "https://www.bangkokbotoxclinic.com/c/botox"
    "https://snsstopper.com"
)

echo "[" > "$OUT"
first=1
for url in "${URLS[@]}"; do
    echo ""
    echo "▶ Measuring: $url"

    api="https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    api+="?url=$(printf '%s' "$url" | sed 's/:/%3A/g; s/\//%2F/g')"
    api+="&strategy=mobile"
    api+="&category=performance&category=accessibility&category=seo&category=best-practices"

    json=$(curl -sS -m 60 "$api")
    if [ -z "$json" ]; then
        echo "  ✗ no response"
        continue
    fi

    perf=$(echo "$json" | jq -r '.lighthouseResult.categories.performance.score // 0')
    a11y=$(echo "$json" | jq -r '.lighthouseResult.categories.accessibility.score // 0')
    seo=$(echo "$json" | jq -r '.lighthouseResult.categories.seo.score // 0')
    bp=$(echo "$json" | jq -r '.lighthouseResult.categories["best-practices"].score // 0')
    lcp=$(echo "$json" | jq -r '.lighthouseResult.audits["largest-contentful-paint"].displayValue // "n/a"')
    cls=$(echo "$json" | jq -r '.lighthouseResult.audits["cumulative-layout-shift"].displayValue // "n/a"')
    fcp=$(echo "$json" | jq -r '.lighthouseResult.audits["first-contentful-paint"].displayValue // "n/a"')
    tbt=$(echo "$json" | jq -r '.lighthouseResult.audits["total-blocking-time"].displayValue // "n/a"')

    # 점수는 0~1. ×100해서 표시.
    perf_pct=$(awk "BEGIN{print int($perf*100)}")
    a11y_pct=$(awk "BEGIN{print int($a11y*100)}")
    seo_pct=$(awk "BEGIN{print int($seo*100)}")
    bp_pct=$(awk "BEGIN{print int($bp*100)}")

    printf "  Performance: %3d  Accessibility: %3d  SEO: %3d  Best Practices: %3d\n" \
        "$perf_pct" "$a11y_pct" "$seo_pct" "$bp_pct"
    printf "  LCP: %-8s  FCP: %-8s  CLS: %-6s  TBT: %s\n" "$lcp" "$fcp" "$cls" "$tbt"

    if [ $first -eq 0 ]; then echo "  ," >> "$OUT"; fi
    first=0
    cat >> "$OUT" <<EOF
  {
    "url": "$url",
    "measured_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "scores": {
      "performance": $perf_pct,
      "accessibility": $a11y_pct,
      "seo": $seo_pct,
      "best_practices": $bp_pct
    },
    "vitals": {
      "lcp": "$lcp",
      "fcp": "$fcp",
      "cls": "$cls",
      "tbt": "$tbt"
    }
  }
EOF
done

echo "]" >> "$OUT"
echo ""
echo "saved → $OUT"
