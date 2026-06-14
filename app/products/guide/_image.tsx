'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ShapeImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className='flex h-32 w-full items-center justify-center rounded-md bg-muted text-xs text-muted-foreground'>
        이미지 없음
      </div>
    )
  }

  return (
    <div className='relative h-32 w-full overflow-hidden rounded-md bg-muted'>
      <Image
        src={src}
        alt={alt}
        fill
        className='object-contain p-2'
        sizes='(max-width: 640px) 50vw, 33vw'
        onError={() => setError(true)}
      />
    </div>
  )
}
