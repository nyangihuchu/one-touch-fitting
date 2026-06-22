'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { CardNewsProduct } from '@/lib/cardnews/types'
import { getProductImageUrl } from '@/lib/products/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CardNewsProductTableProps {
  data: CardNewsProduct[]
}

function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function ProductThumb({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = useState(false)
  const url = getProductImageUrl(src)

  if (!url || !isValidHttpUrl(url) || error) {
    return <div className='h-10 w-10 shrink-0 rounded bg-muted' />
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={40}
      height={40}
      className='h-10 w-10 shrink-0 rounded object-cover'
      onError={() => setError(true)}
    />
  )
}

export function CardNewsProductTable({ data }: CardNewsProductTableProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectedIds.length === data.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.map((p) => p.id))
    }
  }

  function handleGenerate() {
    const ids = selectedIds.join(',')
    router.push(`/cardnews/generate?ids=${ids}`)
  }

  const allChecked = data.length > 0 && selectedIds.length === data.length
  const indeterminate = selectedIds.length > 0 && selectedIds.length < data.length

  if (data.length === 0) {
    return (
      <div className='py-16 text-center text-sm text-muted-foreground'>
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* 모바일 카드 목록 */}
      <div className='divide-y border rounded-lg sm:hidden'>
        {data.map((item) => (
          <div
            key={item.id}
            className='flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg'
            onClick={() => toggleSelect(item.id)}
          >
            <Checkbox
              checked={selectedIds.includes(item.id)}
              onCheckedChange={() => toggleSelect(item.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <ProductThumb src={item.image_path} alt={item.product_name ?? '제품 이미지'} />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{item.product_name ?? '-'}</p>
              <p className='text-xs text-muted-foreground'>{item.category ?? '-'} · {item.model ?? '-'}</p>
            </div>
            {item.image_path ? (
              <Badge variant='secondary' className='shrink-0 text-xs'>이미지 있음</Badge>
            ) : (
              <Badge variant='outline' className='shrink-0 text-xs text-muted-foreground'>이미지 없음</Badge>
            )}
          </div>
        ))}
      </div>

      {/* 데스크탑 테이블 */}
      <div className='hidden sm:block w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox
                  checked={allChecked}
                  ref={(el) => {
                    if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = indeterminate
                  }}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>제품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>모델</TableHead>
              <TableHead>이미지 보유</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => toggleSelect(item.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <ProductThumb src={item.image_path} alt={item.product_name ?? '제품 이미지'} />
                    <span className='font-medium'>{item.product_name ?? '-'}</span>
                  </div>
                </TableCell>
                <TableCell>{item.category ?? '-'}</TableCell>
                <TableCell>{item.model ?? '-'}</TableCell>
                <TableCell>
                  {item.image_path ? (
                    <Badge variant='secondary'>이미지 있음</Badge>
                  ) : (
                    <Badge variant='outline' className='text-muted-foreground'>이미지 없음</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 하단 선택 현황 + 생성 버튼 */}
      {selectedIds.length > 0 && (
        <div className='flex items-center justify-between rounded-lg border bg-accent/50 px-4 py-3'>
          <span className='text-sm font-medium'>
            {selectedIds.length}개 상품 선택됨
          </span>
          <Button size='sm' onClick={handleGenerate}>
            카드뉴스 생성
          </Button>
        </div>
      )}
    </div>
  )
}
