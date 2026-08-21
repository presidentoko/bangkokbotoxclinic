import type { PetProfile } from './types'

/**
 * Keeps the two pet-profile stores in step.
 *
 * The site grew two of them independently. `/my-pet` writes a detailed record
 * — breed, birthday, weight, last vaccine — under `petbkk_pet`. The homepage
 * card writes `{species, lifeStage, name}` under `petProfile`, and that is the
 * one the food list and the recommendation strip read.
 *
 * Nothing bridged them, so a visitor who filled in the detailed profile got no
 * personalised food anywhere and was asked for the same pet a second time on
 * the homepage. Writing the light projection whenever the detailed record is
 * saved makes either entry point light up the whole site.
 */

const LIGHT_KEY = 'petProfile'

export interface DetailedPet {
  name: string
  species: 'dog' | 'cat' | ''
  breed?: string
  birthday?: string
  weight?: string
}

/**
 * Life stage from date of birth. Dogs and cats age differently at the top end:
 * a 9-year-old cat is middle-aged, a 9-year-old dog is a senior.
 */
export function lifeStageFromBirthday(
  birthday: string | undefined,
  species: 'dog' | 'cat',
): PetProfile['lifeStage'] {
  if (!birthday) return 'adult'
  const born = new Date(birthday)
  if (isNaN(born.getTime())) return 'adult'

  const months = (Date.now() - born.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  if (months < 0) return 'adult'
  if (months < 12) return 'puppy'
  return months >= (species === 'cat' ? 120 : 84) ? 'senior' : 'adult'
}

/** Mirror a detailed record into the light profile the rest of the site reads. */
export function syncLightProfile(pet: DetailedPet): void {
  if (!pet.species || !pet.name?.trim()) return
  const light: PetProfile = {
    species: pet.species,
    lifeStage: lifeStageFromBirthday(pet.birthday, pet.species),
    name: pet.name.trim(),
  }
  try {
    localStorage.setItem(LIGHT_KEY, JSON.stringify(light))
    // The food list and recommendation strip read on mount; tell any that are
    // already mounted rather than making the visitor reload.
    window.dispatchEvent(new Event('petProfileUpdate'))
  } catch {
    /* private mode, or storage disabled */
  }
}
