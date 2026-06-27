import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChicPreowned — Luxury Pre-Owned Price Guide Thailand',
    short_name: 'ChicPreowned',
    description: 'ราคา Luxury มือสองในไทย — กระเป๋า นาฬิกา เครื่องประดับ',
    start_url: '/en',
    display: 'standalone',
    background_color: '#FAFAF9',
    theme_color: '#B8954A',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
