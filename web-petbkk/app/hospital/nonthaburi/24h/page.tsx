import { City24hPage, city24hMetadata } from '@/lib/city24h'

export const metadata = city24hMetadata('nonthaburi')

export default function Page() {
  return <City24hPage city="nonthaburi" />
}
