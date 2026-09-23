import { CityHospitalPage, cityMetadata } from '@/lib/cityHub'

export const metadata = cityMetadata('samutprakan')

export default function Page() {
  return <CityHospitalPage city="samutprakan" />
}
