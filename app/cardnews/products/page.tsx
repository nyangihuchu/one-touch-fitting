import { Suspense } from 'react'
import { CardNewsProductsContent } from './_content'

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export default function CardNewsProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <CardNewsProductsContent searchParams={searchParams} />
    </Suspense>
  )
}
