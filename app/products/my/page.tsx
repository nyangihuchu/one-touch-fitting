import { Suspense } from 'react'
import { MyContent } from './_content'

interface SearchParams {
  category?: string
  tubeSpec?: string
  threadSpec?: string
  search?: string
  page?: string
}

export default function MyPage({
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
      <MyContent searchParams={searchParams} />
    </Suspense>
  )
}
