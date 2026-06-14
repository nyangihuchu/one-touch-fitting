import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getMyProductById } from '@/lib/supabase/server'
import { formatPrice, getProductImageUrl } from '@/lib/products/utils'
import { DimensionDiagram } from '@/components/products/DimensionDiagram'

function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src || !isValidHttpUrl(src)) {
    return (
      <div className='flex h-80 w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground'>
        이미지 없음
      </div>
    )
  }

  return (
    <div className='relative h-80 w-full overflow-hidden rounded-lg border bg-muted'>
      <Image
        src={src}
        alt={alt}
        fill
        className='object-contain'
        sizes='(max-width: 768px) 100vw, 400px'
      />
    </div>
  )
}

export async function ProductDetailContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { id } = await params
  const { from } = await searchParams
  const numericId = Number(id)

  if (isNaN(numericId)) {
    notFound()
  }

  const product = await getMyProductById(numericId)

  if (!product) {
    notFound()
  }

  return (
    <div className='mx-auto max-w-5xl space-y-8 p-6'>
      <Link
        href={from ? decodeURIComponent(from) : '/products/my'}
        className='inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        ← 목록으로
      </Link>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='space-y-3'>
          <ProductImage
            src={product.image_path ?? null}
            alt={product.product_name ?? '제품 이미지'}
          />
          {product.option_name && (
            <p className='text-center text-sm text-muted-foreground'>
              옵션: {product.option_name}
            </p>
          )}
        </div>

        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold leading-tight'>
              {product.product_name ?? '-'}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {[product.model, product.category].filter(Boolean).join(' / ') || '-'}
            </p>
          </div>

          <div className='rounded-lg border p-4'>
            <h2 className='mb-3 text-sm font-medium text-muted-foreground'>가격 정보</h2>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div className='text-center'>
                <p className='text-muted-foreground'>판매가</p>
                <p className='mt-1 text-base font-semibold'>{formatPrice(product.sale_price)}</p>
              </div>
              <div className='text-center'>
                <p className='text-muted-foreground'>원가(공급가)</p>
                <p className='mt-1 text-base font-semibold'>{formatPrice(product.supply_price)}</p>
              </div>
              <div className='text-center'>
                <p className='text-muted-foreground'>소비자가</p>
                <p className='mt-1 text-base font-semibold'>{formatPrice(product.consumer_price)}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className='mb-3 text-sm font-medium text-muted-foreground'>기본 사양</h2>
            <dl className='grid grid-cols-2 gap-x-4 gap-y-3 text-sm'>
              <div>
                <dt className='text-muted-foreground'>형태</dt>
                <dd className='mt-0.5 font-medium'>{product.shape ?? '-'}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>튜브규격</dt>
                <dd className='mt-0.5 font-medium'>{product.tube_spec ?? '-'}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>나사규격</dt>
                <dd className='mt-0.5 font-medium'>{product.thread_spec ?? '-'}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>추천용도</dt>
                <dd className='mt-0.5 font-medium'>{product.recommended_use ?? '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <DimensionDiagram
        imageSrc={getProductImageUrl(product.image_path ?? null)}
        tubeSpec={product.tube_spec}
        threadSpec={product.thread_spec}
      />

      {product.summary_description && (
        <section className='space-y-3 rounded-lg border p-5'>
          <h2 className='text-sm font-semibold text-muted-foreground'>요약 설명</h2>
          <p className='text-sm leading-relaxed'>{product.summary_description}</p>
        </section>
      )}

      {product.detail_description && (
        <section className='space-y-3 rounded-lg border p-5'>
          <h2 className='text-sm font-semibold text-muted-foreground'>상세 설명</h2>
          <div
            className='prose prose-sm max-w-none'
            dangerouslySetInnerHTML={{ __html: product.detail_description }}
          />
        </section>
      )}
    </div>
  )
}
