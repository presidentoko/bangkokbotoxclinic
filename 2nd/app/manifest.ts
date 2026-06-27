import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SecondLuxuryItems — Pre-Owned Luxury Price Guide',
    short_name: 'SecondLuxury',
    description: 'Real-time price guide for pre-owned luxury handbags, watches, and accessories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF9',
    theme_color: '#B8954A',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
