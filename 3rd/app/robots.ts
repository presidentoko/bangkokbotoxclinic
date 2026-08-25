import type { MetadataRoute } from 'next'

/**
 * Every crawler is welcome, answer engines included.
 *
 * Worth knowing when debugging: this file is not the last word. Cloudflare
 * sits in front of this origin and its AI Crawl Control feature injects its
 * own `Disallow` lines for GPTBot, ClaudeBot, CCBot, Google-Extended and
 * meta-externalagent into the robots.txt it serves — so the live robots.txt
 * can forbid exactly what this file permits, and no amount of application
 * code will win that argument. Check the served file, not this source, before
 * concluding the site is open to answer engines.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // Listed individually so the intent is explicit to anyone reading the
      // served file, and so a future blanket restriction has to override
      // something deliberate rather than an omission.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: 'https://www.chicpreowned.com/sitemap.xml',
  }
}
