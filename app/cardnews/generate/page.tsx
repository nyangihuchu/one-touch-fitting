import { Suspense } from 'react'
import { CardNewsGenerateContent } from './_content'

export default function CardNewsGeneratePage() {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <CardNewsGenerateContent />
    </Suspense>
  )
}
