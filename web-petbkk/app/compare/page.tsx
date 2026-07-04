import CompareContent from './CompareContent'

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const sp = await searchParams
  const ids = (sp.ids ?? '').split(',').filter(Boolean).slice(0, 3)

  return <CompareContent ids={ids} />
}
