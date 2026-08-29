import { CityHospitalPage, cityMetadata } from '@/lib/cityHub'

export const metadata = cityMetadata('pattaya')

export default function Page() {
  return <CityHospitalPage city="pattaya" />
}
