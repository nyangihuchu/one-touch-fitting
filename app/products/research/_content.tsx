import { Suspense } from 'react'
import Link from 'next/link'
import {
  getResearchProducts,
  getResearchProductFilterOptions,
  getMyProducts,
} from '@/lib/supabase/server'
import { calcTotalPages } from '@/lib/products/utils'
import { ProductFilter } from '@/components/products/ProductFilter'
import { ProductSearch } from '@/components/products/ProductSearch'
import { ResearchProductTable } from '@/components/products/ResearchProductTable'
import { MyProductTable } from '@/components/products/MyProductTable'
import { Pagination } from '@/components/products/Pagination'

const PAGE_SIZE = 20
// My 제품은 검색 미리보기용으로 최대 20건만 표시
const MY_PREVIEW_SIZE = 20

interface SearchParams {
  category?: string
  tubeSpec?: string
  threadSpec?: string
  search?: string
  page?: string
}

export async function ResearchContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const search = params.search

  const filters = {
    category: params.category,
    tubeSpec: params.tubeSpec,
    threadSpec: params.threadSpec,
  }
  const pagination = { page, pageSize: PAGE_SIZE }

  // 검색어가 있을 때는 My 제품도 동시에 조회
  const [{ data, count }, filterOptions, myResult] = await Promise.all([
    getResearchProducts(filters, pagination, search),
    getResearchProductFilterOptions(),
    search
      ? getMyProducts({}, { page: 1, pageSize: MY_PREVIEW_SIZE }, search)
      : Promise.resolve(null),
  ])

  const totalPages = calcTotalPages(count, PAGE_SIZE)

  // 공통 필터 UI — 모바일 세로 정렬, sm 이상에서 가로 정렬
  const filterBar = (
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
  )

  // 검색어 없음: 기존 전체 목록 레이아웃
  if (!search) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Research 제품</h1>
          <p className='mt-1 text-sm text-muted-foreground'>총 {count}건</p>
        </div>

        {filterBar}

        <ResearchProductTable data={data} />

        <Suspense>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    )
  }

  // 검색어 있음: Research + My 제품 분리 섹션
  const myData = myResult?.data ?? []
  const myCount = myResult?.count ?? 0

  return (
    <div className='space-y-8'>
      {filterBar}

      {/* Research 제품 검색 결과 섹션 */}
      <section className='space-y-4'>
        <div className='border-b pb-2'>
          <h2 className='text-lg font-semibold'>Research 제품 결과</h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>총 {count}건</p>
        </div>

        <ResearchProductTable data={data} />

        <Suspense>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </section>

      {/* My 제품 검색 결과 섹션 */}
      <section className='space-y-4'>
        <div className='border-b pb-2'>
          <h2 className='text-lg font-semibold'>My 제품 결과</h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            총 {myCount}건
            {myCount > MY_PREVIEW_SIZE && ` (상위 ${MY_PREVIEW_SIZE}건 미리보기)`}
          </p>
        </div>

        <Suspense>
          <MyProductTable
            data={myData}
            backUrl={(() => {
              const qs = new URLSearchParams()
              if (params.search) qs.set('search', params.search)
              if (page !== 1) qs.set('page', String(page))
              if (params.category) qs.set('category', params.category)
              if (params.tubeSpec) qs.set('tubeSpec', params.tubeSpec)
              if (params.threadSpec) qs.set('threadSpec', params.threadSpec)
              const q = qs.toString()
              return `/products/research${q ? `?${q}` : ''}`
            })()}
          />
        </Suspense>

        {/* My 제품 전체보기 링크 */}
        <div className='flex justify-end'>
          <Link
            href={`/products/my?search=${encodeURIComponent(search)}`}
            className='text-sm font-medium text-primary hover:underline'
          >
            My 제품 전체보기 →
          </Link>
        </div>
      </section>
    </div>
  )
}
