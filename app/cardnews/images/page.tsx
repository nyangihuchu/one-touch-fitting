import { Suspense } from 'react'
import { CardNewsImagesContent } from './_content'

export default function CardNewsImagesPage() {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <CardNewsImagesContent />
    </Suspense>
  )
}
