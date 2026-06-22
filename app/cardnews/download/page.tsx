import { Suspense } from 'react'
import { CardNewsDownloadContent } from './_content'

export default function CardNewsDownloadPage() {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <CardNewsDownloadContent />
    </Suspense>
  )
}
