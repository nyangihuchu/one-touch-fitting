'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SuperfixProductTable } from '@/components/superfix/SuperfixProductTable'
import type { MyProduct } from '@/lib/products/types'
import { createClient } from '@/lib/supabase/client'

// 최대 선택 가능 제품 수
const MAX_SELECTION = 10
// 페이지당 표시 건수
const PAGE_SIZE = 50

interface ProductSelectorProps {
  onSelectionChange: (selectedProducts: MyProduct[]) => void
}

export function ProductSelector({ onSelectionChange }: ProductSelectorProps) {
  // 현재 페이지의 제품 목록
  const [products, setProducts] = useState<MyProduct[]>([])
  // 로딩 상태
  const [loading, setLoading] = useState(true)
  // 에러 메시지
  const [error, setError] = useState<string | null>(null)
  // 전체 건수
  const [totalCount, setTotalCount] = useState(0)
  // 현재 페이지 (1부터 시작)
  const [page, setPage] = useState(1)
  // 검색어 (input 값)
  const [searchQuery, setSearchQuery] = useState('')
  // debounce 후 실제 쿼리에 사용되는 검색어
  const [debouncedQuery, setDebouncedQuery] = useState('')
  // 선택된 제품 Map — 페이지 이동 후에도 선택 유지
  const [selectedMap, setSelectedMap] = useState<Map<number, MyProduct>>(new Map())
  // 최대 선택 경고
  const [limitWarning, setLimitWarning] = useState(false)
  // 목록 상단 스크롤용 ref
  const topRef = useRef<HTMLDivElement>(null)

  // 검색어 입력 시 300ms debounce 후 페이지를 1로 리셋하고 쿼리 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // 페이지 또는 검색어 변경 시 Supabase에서 데이터 조회
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // 검색어의 PostgREST 특수문자를 제거하여 쿼리 조작 방지
    const sanitized = debouncedQuery.replace(/[%_,()]/g, '').trim()

    // count: 'exact'로 전체 건수를 함께 조회, range()로 페이지네이션 적용
    let query = supabase
      .from('my_products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // 검색어가 있으면 product_name, model, category에 ilike 필터 추가
    if (sanitized) {
      query = query.or(
        `product_name.ilike.%${sanitized}%,model.ilike.%${sanitized}%,category.ilike.%${sanitized}%`
      )
    }

    try {
      const { data, count, error: fetchError } = await query
      if (fetchError) throw fetchError
      setProducts(data ?? [])
      setTotalCount(count ?? 0)
    } catch {
      setError('제품 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
      setProducts([])
      setTotalCount(0)
    } finally {
      // 에러 여부와 관계없이 반드시 로딩 해제
      setLoading(false)
    }
  }, [page, debouncedQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 페이지 이동 시 목록 상단으로 스크롤
  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handlePrevPage() {
    if (page <= 1) return
    setPage((prev) => prev - 1)
    scrollToTop()
  }

  function handleNextPage() {
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)
    if (page >= totalPages) return
    setPage((prev) => prev + 1)
    scrollToTop()
  }

  // 선택 변경 처리 — 현재 페이지 기준으로 selectedMap 업데이트
  function handleSelectionChange(ids: number[]) {
    const newMap = new Map(selectedMap)
    // 현재 페이지에 있는 id 집합
    const currentIds = new Set(products.map((p) => p.id))

    // 현재 페이지 내에서 선택 추가/제거
    for (const id of currentIds) {
      if (ids.includes(id)) {
        const product = products.find((p) => p.id === id)
        if (product) newMap.set(id, product)
      } else {
        newMap.delete(id)
      }
    }

    // 이전보다 늘어난 경우(추가 동작)일 때만 최대치 초과 여부 체크
    // 선택 해제 동작은 newMap.size가 줄어들므로 항상 허용
    if (newMap.size > selectedMap.size && newMap.size > MAX_SELECTION) {
      setLimitWarning(true)
      return
    }

    setLimitWarning(false)
    setSelectedMap(newMap)
    onSelectionChange(Array.from(newMap.values()))
  }

  // 현재 페이지 제품을 최대 선택 수까지 일괄 선택
  function handleSelectAll() {
    const newMap = new Map(selectedMap)
    for (const product of products) {
      if (newMap.size >= MAX_SELECTION) break
      newMap.set(product.id, product)
    }
    // 정확히 MAX_SELECTION개인 경우는 정상이므로 초과(>)일 때만 경고
    setLimitWarning(newMap.size > MAX_SELECTION)
    setSelectedMap(newMap)
    onSelectionChange(Array.from(newMap.values()))
  }

  // 전체 선택 해제
  function handleClearAll() {
    setSelectedMap(new Map())
    setLimitWarning(false)
    onSelectionChange([])
  }

  // 현재 선택된 id 배열 (테이블에 전달)
  const selectedIds = Array.from(selectedMap.keys())
  // 선택 요약 패널용 배열
  const selectedProducts = Array.from(selectedMap.values())
  // 전체 페이지 수
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  // 현재 페이지의 표시 범위
  const rangeFrom = (page - 1) * PAGE_SIZE + 1
  const rangeTo = Math.min(page * PAGE_SIZE, totalCount)

  return (
    <div className='flex flex-col gap-4' ref={topRef}>
      {/* 검색 입력 영역 */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
        <Input
          type='search'
          aria-label='제품 검색'
          placeholder='제품명, 모델명, 카테고리 검색...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-9'
        />
      </div>

      {/* 상단 컨트롤 바 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            onClick={handleSelectAll}
            className='rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors'
          >
            전체 선택
          </button>
          <button
            onClick={handleClearAll}
            disabled={selectedIds.length === 0}
            className='rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40'
          >
            선택 해제
          </button>
        </div>

        {/* 총 건수 및 선택 현황 */}
        <div className='flex items-center gap-2 text-sm'>
          {!loading && totalCount > 0 && (
            <span className='text-muted-foreground'>
              총 {totalCount.toLocaleString()}건 ({rangeFrom}-{rangeTo})
            </span>
          )}
          {!loading && totalCount === 0 && (
            <span className='text-muted-foreground'>총 0건</span>
          )}
          {selectedIds.length > 0 ? (
            <span className='font-medium text-foreground'>
              &nbsp;·&nbsp;{selectedIds.length}개 선택됨
            </span>
          ) : (
            <span className='text-muted-foreground'>&nbsp;·&nbsp;선택 없음</span>
          )}
        </div>
      </div>

      {/* 최대 선택 경고 */}
      {limitWarning && (
        <p className='text-xs text-amber-600 dark:text-amber-400'>
          최대 {MAX_SELECTION}개까지 선택할 수 있습니다.
        </p>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className='text-xs text-destructive'>{error}</p>
      )}

      {/* 제품 테이블 또는 로딩/빈 상태 */}
      {loading ? (
        <div className='py-16 text-center text-sm text-muted-foreground'>
          제품 목록을 불러오는 중...
        </div>
      ) : products.length === 0 ? (
        <div className='py-16 text-center text-sm text-muted-foreground'>
          {debouncedQuery
            ? `"${debouncedQuery}" 검색 결과가 없습니다.`
            : '제품이 없습니다.'}
        </div>
      ) : (
        <SuperfixProductTable
          data={products}
          selectionMode
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
        />
      )}

      {/* 페이지네이션 — 중앙 정렬 */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePrevPage}
            disabled={page <= 1}
            className='h-8 w-8 p-0'
            aria-label='이전 페이지'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <span className='text-sm font-medium text-muted-foreground'>
            {page} / {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className='h-8 w-8 p-0'
            aria-label='다음 페이지'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}

      {/* 선택 요약 패널 */}
      {selectedProducts.length > 0 && (
        <div className='rounded-lg border bg-muted/40 p-4'>
          <p className='mb-2 text-xs font-semibold text-muted-foreground'>
            선택된 제품 ({selectedProducts.length}개)
          </p>
          <ul className='flex flex-col gap-1'>
            {selectedProducts.map((p) => (
              <li key={p.id} className='flex items-center justify-between text-sm'>
                <span className='font-medium'>{p.product_name ?? '-'}</span>
                <span className='text-muted-foreground'>{p.model ?? '-'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
