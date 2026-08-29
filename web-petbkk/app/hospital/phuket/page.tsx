import { CityHospitalPage, cityMetadata } from '@/lib/cityHub'

export const metadata = cityMetadata('phuket')

export default function Page() {
  return <CityHospitalPage city="phuket" />
}
