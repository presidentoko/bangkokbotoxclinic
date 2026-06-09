import type { MetadataRoute } from 'next'
import { loadFoods, foodSlug } from '@/lib/petfood'
import { loadHospitals, hospitalSlug } from '@/lib/hospitals'

const BASE = 'https://www.thailandpethub.com'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const foods = loadFoods()
  const hospitals = loadHospitals()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                               priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${BASE}/food`,                     priority: 0.9,  changeFrequency: 'daily'   },
    { url: `${BASE}/food/dog`,                 priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/food/cat`,                 priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/food/best`,                priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital`,                 priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital/24h`,             priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital/emergency`,       priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/compare`,                  priority: 0.7,  changeFrequency: 'weekly'  },
    { url: `${BASE}/adopt`,                    priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/cost`,                     priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/tips`,                     priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/emergency`,                priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/ingredients`,              priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/toxic`,                    priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/age`,                      priority: 0.6,  changeFrequency: 'monthly' },
    { url: `${BASE}/vaccine`,                  priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/newpet`,                   priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/saved`,                    priority: 0.3,  changeFrequency: 'never'   },
  ]

  const foodPages: MetadataRoute.Sitemap = foods.map(f => ({
    url: `${BASE}/food/${foodSlug(f)}`,
    priority: 0.7,
    changeFrequency: 'weekly',
  }))

  const hospitalPages: MetadataRoute.Sitemap = hospitals.map(h => ({
    url: `${BASE}/hospital/${hospitalSlug(h)}`,
    priority: 0.7,
    changeFrequency: 'weekly',
  }))

  return [...staticPages, ...foodPages, ...hospitalPages]
}
