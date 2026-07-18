import fs from 'fs'
import path from 'path'

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
    const title = rawTitle.replace(/\s*\|\s*SecondLuxuryItems\s*$/, '')
    return { slug, title, description: descMatch?.[1] ?? '' }
  })
}
