'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { MyProduct } from '@/lib/products/types'
import { getProductImageUrl } from '@/lib/products/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Superfix 상세페이지 생성 전용 제품 선택 테이블 Props
interface SuperfixProductTableProps {
  data: MyProduct[]
  selectionMode?: boolean
  selectedIds?: number[]
  onSelectionChange?: (ids: number[]) => void
}

// URL 유효성 검사 — http/https 프로토콜만 허용
function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// 제품 이미지 썸네일 컴포넌트 — 이미지 없거나 오류 시 빈 박스 표시
function ProductRowImage({ src, alt, size = 40 }: { src: string | null; alt: string; size?: number }) {
  const [error, setError] = useState(false)
  if (!src || !isValidHttpUrl(src) || error) {
    return <div className='flex-shrink-0 rounded bg-muted' style={{ width: size, height: size }} />
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className='flex-shrink-0 rounded object-cover'
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  )
}

// Superfix 전용 제품 선택 테이블 — 가격 컬럼 없이 규격/형태/요약설명 표시
export function SuperfixProductTable({ data, selectionMode = false, selectedIds = [], onSelectionChange }: SuperfixProductTableProps) {

  // 행 클릭 시 선택/해제 처리 (selectionMode 전용)
  function handleRowClick(id: number) {
    if (!selectionMode) return
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id]
    onSelectionChange?.(newIds)
  }

  // 체크박스 클릭 시 이벤트 버블링 방지 후 행 클릭과 동일하게 처리
  function handleCheckboxClick(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    handleRowClick(id)
  }

  // 데이터가 없을 때 빈 상태 메시지 표시
  if (data.length === 0) {
    return <div className='py-16 text-center text-sm text-muted-foreground'>검색 결과가 없습니다.</div>
  }

  return (
    <>
      {/* 모바일 카드 목록 — sm 미만에서만 표시 */}
      <div className='divide-y border rounded-lg sm:hidden'>
        {data.map((item) => (
          <div
            key={item.id}
            className='p-4 space-y-2 cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg'
            onClick={() => handleRowClick(item.id)}
          >
            {/* 상단 행: 체크박스 + 이미지 + 제품명 | 우측: 모델명 */}
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2 min-w-0'>
                {selectionMode && (
                  <input
                    type='checkbox'
                    checked={selectedIds.includes(item.id)}
                    onClick={(e) => handleCheckboxClick(e, item.id)}
                    onChange={() => {}}
                    className='h-4 w-4 flex-shrink-0 accent-foreground'
                  />
                )}
                <ProductRowImage src={getProductImageUrl(item.image_path)} alt={item.product_name ?? '제품 이미지'} size={32} />
                <span className='font-medium text-sm truncate'>{item.product_name ?? '-'}</span>
              </div>
              <span className='text-sm text-muted-foreground flex-shrink-0'>{item.model ?? '-'}</span>
            </div>

            {/* 하단 행: 카테고리 — 튜브규격 · 나사규격 · 형태 */}
            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>{item.category ?? '-'}</span>
              <span className='text-xs text-muted-foreground text-right'>
                {[item.tube_spec, item.thread_spec, item.shape]
                  .filter(Boolean)
                  .join(' · ') || '-'}
              </span>
            </div>

            {/* 요약설명 — 한 줄 표시 */}
            {item.summary_description && (
              <p className='text-xs text-muted-foreground line-clamp-1'>{item.summary_description}</p>
            )}
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 — sm 이상에서만 표시 */}
      <div className='hidden sm:block w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {/* selectionMode일 때만 체크박스 컬럼 표시 */}
              {selectionMode && <TableHead className='w-10' />}
              <TableHead>제품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>모델</TableHead>
              <TableHead>튜브규격</TableHead>
              <TableHead>나사규격</TableHead>
              <TableHead>형태</TableHead>
              {/* 요약설명 — 길면 truncate 처리 */}
              <TableHead className='max-w-[200px]'>요약설명</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => handleRowClick(item.id)}
              >
                {selectionMode && (
                  <TableCell onClick={(e) => handleCheckboxClick(e, item.id)}>
                    <input
                      type='checkbox'
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {}}
                      className='h-4 w-4 accent-foreground'
                    />
                  </TableCell>
                )}
                {/* 제품명 — 이미지 썸네일과 함께 표시 */}
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <ProductRowImage src={getProductImageUrl(item.image_path)} alt={item.product_name ?? '제품 이미지'} />
                    <span className='font-medium'>{item.product_name ?? '-'}</span>
                  </div>
                </TableCell>
                <TableCell>{item.category ?? '-'}</TableCell>
                <TableCell>{item.model ?? '-'}</TableCell>
                <TableCell>{item.tube_spec ?? '-'}</TableCell>
                <TableCell>{item.thread_spec ?? '-'}</TableCell>
                <TableCell>{item.shape ?? '-'}</TableCell>
                {/* 요약설명 — max-width 200px, 넘치면 truncate */}
                <TableCell className='max-w-[200px] truncate'>{item.summary_description ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
