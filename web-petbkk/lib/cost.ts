export type PetSize = 'small' | 'medium' | 'large'
export type Species = 'dog' | 'cat'

export interface CostInputs {
  species: Species
  size: PetSize
  monthlyFoodBudget: number
}

export interface CostBreakdown {
  monthly: {
    food: number
    vet: number
    grooming: number
    accessories: number
    total: number
  }
  annual: number
  oneTime: {
    vaccines: number
    neuterSpay: number
    microchip: number
    startupKit: number
    total: number
  }
  fiveYear: number
}

const VET_MONTHLY: Record<Species, Record<PetSize, number>> = {
  dog: { small: 300,  medium: 400,  large: 500  },
  cat: { small: 250,  medium: 300,  large: 350  },
}

const GROOMING_MONTHLY: Record<Species, Record<PetSize, number>> = {
  dog: { small: 400,  medium: 600,  large: 800  },
  cat: { small: 0,    medium: 0,    large: 0    },
}

const NEUTER_SPAY: Record<Species, Record<PetSize, number>> = {
  dog: { small: 2000, medium: 3000, large: 4000 },
  cat: { small: 1500, medium: 1800, large: 2000 },
}

export function calculateCost(inputs: CostInputs): CostBreakdown {
  const { species, size, monthlyFoodBudget } = inputs

  const monthly = {
    food:        monthlyFoodBudget,
    vet:         VET_MONTHLY[species][size],
    grooming:    GROOMING_MONTHLY[species][size],
    accessories: 150,
    total:       0,
  }
  monthly.total = monthly.food + monthly.vet + monthly.grooming + monthly.accessories

  const annual = monthly.total * 12

  const oneTime = {
    vaccines:    1500,
    neuterSpay:  NEUTER_SPAY[species][size],
    microchip:   500,
    startupKit:  2000,
    total:       0,
  }
  oneTime.total = oneTime.vaccines + oneTime.neuterSpay + oneTime.microchip + oneTime.startupKit

  const fiveYear = annual * 5 + oneTime.total

  return { monthly, annual, oneTime, fiveYear }
}
