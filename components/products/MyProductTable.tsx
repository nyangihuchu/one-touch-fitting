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
function ProductRowImage({
  src,
  alt,
  size = 40,
}: {
  src: string | null
  alt: string
  size?: number
}) {
  const [error, setError] = useState(false)

  if (!src || !isValidHttpUrl(src) || error) {
    return (
      <div
        className='flex-shrink-0 rounded bg-muted'
        style={{ width: size, height: size }}
      />
    )
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
    <>
      {/* 모바일 카드 목록 — sm(640px) 미만에서만 표시 */}
      <div className='divide-y border rounded-lg sm:hidden'>
        {data.map((item) => (
          <div
            key={item.id}
            className='p-4 space-y-2 cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg'
            onClick={() => handleRowClick(item.id)}
          >
            {/* 상단 행 — 이미지 + 제품명 / 판매가 */}
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2 min-w-0'>
                <ProductRowImage
                  src={getProductImageUrl(item.image_path)}
                  alt={item.product_name ?? '제품 이미지'}
                  size={32}
                />
                <span className='font-medium text-sm truncate'>
                  {item.product_name ?? '-'}
                </span>
              </div>
              <span className='font-semibold text-sm flex-shrink-0'>
                {formatPrice(item.sale_price)}
              </span>
            </div>

            {/* 하단 행 — 카테고리 / 모델 */}
            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>
                {item.category ?? '-'}
              </span>
              <span className='text-xs text-muted-foreground text-right'>
                {item.model ?? '-'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 — sm(640px) 이상에서만 표시 */}
      <div className='hidden sm:block w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>모델</TableHead>
              <TableHead>판매가</TableHead>
              <TableHead>원가</TableHead>
              <TableHead>소비자가</TableHead>
              <TableHead>등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => handleRowClick(item.id)}
              >
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
                <TableCell>{item.model ?? '-'}</TableCell>
                <TableCell>{formatPrice(item.sale_price)}</TableCell>
                <TableCell>{formatPrice(item.supply_price)}</TableCell>
                <TableCell>{formatPrice(item.consumer_price)}</TableCell>
                <TableCell>
                  {item.created_at ? item.created_at.slice(0, 10) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
