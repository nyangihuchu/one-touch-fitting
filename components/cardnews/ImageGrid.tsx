'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import { getProductImageUrl } from '@/lib/products/utils'

interface GridItem {
  id: number
  product_name: string | null
  image_path: string | null
}

interface ImageGridProps {
  items: GridItem[]
}

function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function ImageCard({ item }: { item: GridItem }) {
  const [error, setError] = useState(false)
  const url = getProductImageUrl(item.image_path)
  const showImage = url && isValidHttpUrl(url) && !error

  return (
    <div className='flex flex-col gap-2'>
      <div className='relative aspect-square overflow-hidden rounded-lg border bg-muted'>
        {showImage ? (
          <Image
            src={url}
            alt={item.product_name ?? '제품 이미지'}
            fill
            className='object-contain p-2'
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            onError={() => setError(true)}
          />
        ) : (
          <div className='flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground'>
            <ImageOff className='h-8 w-8' />
            <span className='text-xs'>이미지 없음</span>
          </div>
        )}
      </div>
      <p className='truncate text-xs text-muted-foreground'>{item.product_name ?? '-'}</p>
    </div>
  )
}

export function ImageGrid({ items }: ImageGridProps) {
  if (items.length === 0) {
    return (
      <div className='py-16 text-center text-sm text-muted-foreground'>
        해당하는 상품이 없습니다.
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {items.map((item) => (
        <ImageCard key={item.id} item={item} />
      ))}
    </div>
  )
}
