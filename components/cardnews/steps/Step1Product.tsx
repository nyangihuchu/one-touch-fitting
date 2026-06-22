'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CardNewsProduct } from '@/lib/cardnews/types'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package } from 'lucide-react'

interface Step1ProductProps {
  products: CardNewsProduct[]
  selectedProduct: CardNewsProduct | null
  onSelect: (product: CardNewsProduct) => void
}

function isValidUrl(src: string | null): boolean {
  if (!src) return false
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function ProductThumb({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = useState(false)
  if (!isValidUrl(src) || error) {
    return <div className='h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center'>
      <Package className='h-5 w-5 text-muted-foreground' />
    </div>
  }
  return (
    <Image
      src={src!}
      alt={alt}
      width={48}
      height={48}
      className='h-12 w-12 shrink-0 rounded-lg object-contain'
      onError={() => setError(true)}
    />
  )
}

export function Step1Product({ products, selectedProduct, onSelect }: Step1ProductProps) {
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.product_name?.toLowerCase().includes(q) ||
      p.model?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  })

  return (
    <div className='flex flex-col gap-4 md:flex-row md:gap-6 h-full'>
      {/* 상품 목록 */}
      <div className='flex-1 min-w-0 flex flex-col gap-3'>
        <div>
          <h2 className='text-base font-semibold mb-0.5 md:text-lg'>상품 선택</h2>
          <p className='text-sm text-muted-foreground'>카드뉴스를 생성할 상품을 1개 선택하세요.</p>
        </div>
        <Input
          placeholder='제품명, 모델명, 카테고리 검색...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className='overflow-y-auto border rounded-lg divide-y max-h-[340px] md:max-h-[480px]'>
          {filtered.length === 0 && (
            <div className='py-12 text-center text-sm text-muted-foreground'>검색 결과가 없습니다.</div>
          )}
          {filtered.map((product) => {
            const isSelected = selectedProduct?.id === product.id
            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'bg-accent/60 border-l-4 border-l-primary' : ''}`}
                onClick={() => onSelect(product)}
              >
                <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}`}>
                  {isSelected && <div className='h-2 w-2 rounded-full bg-primary' />}
                </div>
                <ProductThumb src={product.image_path} alt={product.product_name ?? ''} />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{product.product_name ?? '-'}</p>
                  <p className='truncate text-xs text-muted-foreground'>{product.category ?? '-'} · {product.model ?? '-'}</p>
                </div>
                {/* 모바일에서 배지 숨김 */}
                <div className='hidden sm:flex gap-1.5 items-center shrink-0'>
                  {product.tube_spec && <Badge variant='outline' className='text-xs'>{product.tube_spec}</Badge>}
                  {product.image_path
                    ? <Badge variant='secondary' className='text-xs'>이미지 ✓</Badge>
                    : <Badge variant='outline' className='text-xs text-muted-foreground'>이미지 없음</Badge>
                  }
                </div>
              </div>
            )
          })}
        </div>
        <p className='text-xs text-muted-foreground'>전체 {products.length}개 · 검색 결과 {filtered.length}개</p>
      </div>

      {/* 선택된 상품 정보: 데스크톱에서만 우측 패널, 모바일에서는 하단 인라인 */}
      {selectedProduct && (
        <div className='md:w-64 md:shrink-0 border rounded-lg p-4 flex flex-col gap-3 h-fit'>
          <h3 className='text-sm font-semibold'>선택된 상품</h3>
          <div className='flex items-center gap-3 md:flex-col md:items-start'>
            <ProductThumb src={selectedProduct.image_path} alt={selectedProduct.product_name ?? ''} />
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-sm font-medium truncate'>{selectedProduct.product_name}</p>
              <p className='text-xs text-muted-foreground'>모델: {selectedProduct.model ?? '-'}</p>
              <p className='text-xs text-muted-foreground'>튜브: {selectedProduct.tube_spec ?? '-'} · 나사: {selectedProduct.thread_spec ?? '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
