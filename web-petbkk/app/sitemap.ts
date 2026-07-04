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
    { url: `${BASE}/food/senior`,              priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/food/budget`,              priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/food/puppy`,               priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital`,                 priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital/24h`,             priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital/emergency`,       priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/hospital/surgery`,         priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/mri`,                      priority: 0.8,  changeFrequency: 'monthly' },
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
    { url: `${BASE}/dental`,                   priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/deworming`,                priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/flea`,                     priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/grooming`,                 priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/microchip`,                priority: 0.7,  changeFrequency: 'yearly'  },
    { url: `${BASE}/training`,                 priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/insurance`,                priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/first-aid`,                priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/potty-training`,           priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/weight`,                   priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/cat-behavior`,             priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/neutering`,                priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/heartworm`,                priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/allergy`,                  priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/travel`,                   priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/anxiety`,                  priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/kidney-disease`,           priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/raw-food`,                 priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/heatstroke`,               priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/dog-behavior`,             priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/breeds`,                   priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/guides`,                   priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/supplements`,              priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/cat-litter`,               priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/senior-care`,              priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/pregnancy`,                priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/diabetes`,                 priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/poison-plants`,            priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/apartment-pets`,           priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/kitten-care`,              priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/puppy-care`,               priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/leash-training`,           priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/cat-scratching`,           priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/ear-care`,                 priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/medicine-tips`,            priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/eye-care`,                 priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/diarrhea`,                 priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/not-eating`,               priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/symptoms`,                 priority: 0.9,  changeFrequency: 'weekly'  },
    { url: `${BASE}/breed-quiz`,               priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/my-pet`,                   priority: 0.6,  changeFrequency: 'monthly' },
    { url: `${BASE}/urinary`,                  priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/vomiting`,                 priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/obesity`,                  priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/skin`,                     priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/food-quiz`,                priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/why-dogs-eat-grass`,       priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/cat-not-using-litter`,     priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/dog-barking`,              priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/checklist`,                priority: 0.7,  changeFrequency: 'weekly'  },
    { url: `${BASE}/contact`,                  priority: 0.5,  changeFrequency: 'yearly'  },
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
