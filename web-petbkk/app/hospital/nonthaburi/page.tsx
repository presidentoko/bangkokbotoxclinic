import { CityHospitalPage, cityMetadata } from '@/lib/cityHub'

export const metadata = cityMetadata('nonthaburi')

export default function Page() {
  return <CityHospitalPage city="nonthaburi" />
}
