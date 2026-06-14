import { Suspense } from 'react'
import { getMyProducts, getMyProductFilterOptions } from '@/lib/supabase/server'
import { calcTotalPages } from '@/lib/products/utils'
import { ProductFilter } from '@/components/products/ProductFilter'
import { ProductSearch } from '@/components/products/ProductSearch'
import { MyProductTable } from '@/components/products/MyProductTable'
import { Pagination } from '@/components/products/Pagination'

const PAGE_SIZE = 20

interface SearchParams {
  category?: string
  tubeSpec?: string
  threadSpec?: string
  search?: string
  page?: string
}

export async function MyContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page ?? 1)

  const filters = {
    category: params.category,
    tubeSpec: params.tubeSpec,
    threadSpec: params.threadSpec,
  }
  const pagination = { page, pageSize: PAGE_SIZE }

  const [{ data, count }, filterOptions] = await Promise.all([
    getMyProducts(filters, pagination, params.search),
    getMyProductFilterOptions(),
  ])

  const totalPages = calcTotalPages(count, PAGE_SIZE)

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>My 제품</h1>
        <p className='mt-1 text-sm text-muted-foreground'>총 {count}건</p>
      </div>

      {/* 필터 바 — 모바일 세로 정렬, sm 이상에서 가로 정렬 */}
      <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
        <div className='w-full sm:w-auto'>
          <Suspense>
            <ProductSearch />
          </Suspense>
        </div>
        <Suspense>
          <ProductFilter label='카테고리' options={filterOptions.categories} paramKey='category' />
        </Suspense>
        <Suspense>
          <ProductFilter label='튜브규격' options={filterOptions.tubeSpecs} paramKey='tubeSpec' />
        </Suspense>
        <Suspense>
          <ProductFilter
            label='나사규격'
            options={filterOptions.threadSpecs}
            paramKey='threadSpec'
          />
        </Suspense>
      </div>

      <MyProductTable
        data={data}
        backUrl={(() => {
          const qs = new URLSearchParams()
          if (params.search) qs.set('search', params.search)
          if (page !== 1) qs.set('page', String(page))
          if (params.category) qs.set('category', params.category)
          if (params.tubeSpec) qs.set('tubeSpec', params.tubeSpec)
          if (params.threadSpec) qs.set('threadSpec', params.threadSpec)
          const q = qs.toString()
          return `/products/my${q ? `?${q}` : ''}`
        })()}
      />

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
