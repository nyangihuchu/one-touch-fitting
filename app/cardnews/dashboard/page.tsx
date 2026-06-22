import { Suspense } from 'react'
import { CardNewsDashboardContent } from './_content'

export default function CardNewsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <CardNewsDashboardContent />
    </Suspense>
  )
}
