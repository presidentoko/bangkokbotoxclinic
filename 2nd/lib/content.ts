import fs from 'fs'
import path from 'path'
import { PRICE_YEAR } from './site'

export interface ContentEntry {
  slug: string
  title: string
  description: string
}

/**
 * Enumerates the guide/compare/trend pages directly from the filesystem so
 * the hub pages (/guides, /compare, /trends) never drift out of sync with
 * what actually exists under app/<section>/*\/page.tsx. Reads each page's
 * `title`/`description` out of its `export const metadata` so we don't
 * hand-maintain a duplicate list.
 */
/**
 * These titles are read as source text, not evaluated, so a template literal
 * arrives with its placeholder intact. Once the year stopped being hardcoded,
 * /compare and /guides started listing "AP Royal Oak vs Patek Nautilus
 * ${PRICE_YEAR}" verbatim. Substitute the few placeholders that can appear.
 */
function interpolate(text: string): string {
  return text.replace(/\$\{PRICE_YEAR\}/g, String(PRICE_YEAR))
}

export function listContentEntries(section: 'guides' | 'compare' | 'trends'): ContentEntry[] {
  const base = path.join(process.cwd(), 'app', section)
  const dirs = fs
    .readdirSync(base, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort((a, b) => a.localeCompare(b))

  return dirs.map(slug => {
    const src = fs.readFileSync(path.join(base, slug, 'page.tsx'), 'utf8')
    const titleMatch = src.match(/title:\s*\n?\s*['"`]([^'"`]+)['"`]/)
    const descMatch = src.match(/description:\s*\n?\s*['"`]([^'"`]+)['"`]/)
    const rawTitle = titleMatch?.[1] ?? slug
    const title = interpolate(rawTitle).replace(/\s*\|\s*SecondLuxuryItems\s*$/, '')
    return { slug, title, description: interpolate(descMatch?.[1] ?? '') }
  })
}
