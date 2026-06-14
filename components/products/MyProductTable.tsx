'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { MyProduct } from '@/lib/products/types'
import { formatPrice, getProductImageUrl } from '@/lib/products/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface MyProductTableProps {
  data: MyProduct[]
  backUrl?: string
}

function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// 썸네일 이미지 — 로드 실패 시 placeholder로 폴백
function ProductRowImage({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = useState(false)

  if (!src || !isValidHttpUrl(src) || error) {
    return <div className='h-10 w-10 flex-shrink-0 rounded bg-muted' />
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className='h-10 w-10 flex-shrink-0 rounded object-cover'
      onError={() => setError(true)}
    />
  )
}

export function MyProductTable({ data, backUrl }: MyProductTableProps) {
  const router = useRouter()

  function handleRowClick(id: number) {
    const url = backUrl
      ? `/products/my/${id}?from=${encodeURIComponent(backUrl)}`
      : `/products/my/${id}`
    router.push(url)
  }

  if (data.length === 0) {
    return (
      <div className='py-16 text-center text-sm text-muted-foreground'>
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    /* 모바일에서 테이블 가로 스크롤 허용 */
    <div className='w-full overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            {/* 항상 표시 */}
            <TableHead>제품명</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>판매가</TableHead>
            {/* sm(640px) 이상만 표시 */}
            <TableHead className='hidden sm:table-cell'>모델</TableHead>
            <TableHead className='hidden sm:table-cell'>원가</TableHead>
            {/* md(768px) 이상만 표시 */}
            <TableHead className='hidden md:table-cell'>소비자가</TableHead>
            <TableHead className='hidden md:table-cell'>등록일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className='cursor-pointer hover:bg-muted/50'
              onClick={() => handleRowClick(item.id)}
            >
              {/* 항상 표시 */}
              <TableCell>
                <div className='flex items-center gap-3'>
                  <ProductRowImage
                    src={getProductImageUrl(item.image_path)}
                    alt={item.product_name ?? '제품 이미지'}
                  />
                  <span className='font-medium'>{item.product_name ?? '-'}</span>
                </div>
              </TableCell>
              <TableCell>{item.category ?? '-'}</TableCell>
              <TableCell>{formatPrice(item.sale_price)}</TableCell>
              {/* sm(640px) 이상만 표시 */}
              <TableCell className='hidden sm:table-cell'>{item.model ?? '-'}</TableCell>
              <TableCell className='hidden sm:table-cell'>{formatPrice(item.supply_price)}</TableCell>
              {/* md(768px) 이상만 표시 */}
              <TableCell className='hidden md:table-cell'>{formatPrice(item.consumer_price)}</TableCell>
              <TableCell className='hidden md:table-cell'>
                {item.created_at ? item.created_at.slice(0, 10) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
