import { Suspense } from 'react'
import { ProductDetailContent } from './_content'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}

export default function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-sm text-muted-foreground'>로딩 중...</div>
      }
    >
      <ProductDetailContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}
