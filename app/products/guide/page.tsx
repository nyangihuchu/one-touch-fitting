import { Suspense } from 'react'
import { FittingGuideContent } from './_content'

export default function FittingGuidePage() {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <FittingGuideContent />
    </Suspense>
  )
}
