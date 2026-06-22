import { Suspense } from 'react'
import { getCardNewsProducts, getCardNewsProductFilterOptions } from '@/lib/supabase/server'
import { calcTotalPages } from '@/lib/products/utils'
import { CardNewsProductTable } from '@/components/cardnews/CardNewsProductTable'
import { ProductSearch } from '@/components/products/ProductSearch'
import { ProductFilter } from '@/components/products/ProductFilter'
import { Pagination } from '@/components/products/Pagination'
import { Badge } from '@/components/ui/badge'

const PAGE_SIZE = 20

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export async function CardNewsProductsContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const search = params.search
  const category = params.category

  const [{ data, count }, { categories }] = await Promise.all([
    getCardNewsProducts({ category }, { page, pageSize: PAGE_SIZE }, search),
    getCardNewsProductFilterOptions(),
  ])

  const totalPages = calcTotalPages(count, PAGE_SIZE)

  // 이미지 보유 상품 수 집계
  const withImageCount = data.filter((p) => p.image_path !== null).length

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>상품 관리</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          카드뉴스를 생성할 상품을 선택하세요.
        </p>
      </div>

      {/* 요약 배지 */}
      <div className='flex flex-wrap gap-2'>
        <Badge variant='secondary'>총 {count.toLocaleString()}개 상품</Badge>
        <Badge variant='secondary'>이미지 보유 {withImageCount.toLocaleString()}개</Badge>
      </div>

      {/* 검색 및 필터 */}
      <div className='flex flex-wrap gap-2'>
        <Suspense fallback={null}>
          <ProductSearch />
        </Suspense>
        <Suspense fallback={null}>
          <ProductFilter label='카테고리' options={categories} paramKey='category' />
        </Suspense>
      </div>

      {/* 상품 테이블 */}
      <CardNewsProductTable data={data} />

      {/* 페이지네이션 */}
      <Suspense fallback={null}>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
