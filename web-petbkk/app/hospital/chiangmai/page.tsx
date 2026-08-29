import { CityHospitalPage, cityMetadata } from '@/lib/cityHub'

export const metadata = cityMetadata('chiangmai')

export default function Page() {
  return <CityHospitalPage city="chiangmai" />
}
