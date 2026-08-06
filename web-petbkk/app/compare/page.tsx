import { Suspense } from 'react'
import CompareContent from './CompareContent'

// No searchParams here — CompareContent reads `ids` client-side, which keeps this
// route statically rendered.
export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareContent />
    </Suspense>
  )
}
