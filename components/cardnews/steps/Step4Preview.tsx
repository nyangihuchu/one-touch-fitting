'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CardNewsProduct, CardNewsTemplateType, SlideData } from '@/lib/cardnews/types'
import { SlideTypeA, SlideTypeB, SlideTypeC } from '@/components/cardnews/slides'

interface Step4PreviewProps {
  product: CardNewsProduct
  templateType: CardNewsTemplateType
  slideCopies: SlideData[]
}

const SCALE = 0.32       // 1080 * 0.32 ≈ 346px 미리보기
const THUMB_SCALE = 0.09 // 1080 * 0.09 ≈ 97px 썸네일

function SlideRenderer({
  slide,
  product,
  templateType,
  brandColor,
  totalSlides,
}: {
  slide: SlideData
  product: CardNewsProduct
  templateType: CardNewsTemplateType
  brandColor?: string
  totalSlides: number
}) {
  if (templateType === 'A') return <SlideTypeA slide={slide} product={product} brandColor={brandColor} totalSlides={totalSlides} />
  if (templateType === 'B') return <SlideTypeB slide={slide} product={product} brandColor={brandColor} totalSlides={totalSlides} />
  return <SlideTypeC slide={slide} product={product} brandColor={brandColor} totalSlides={totalSlides} />
}

export function Step4Preview({ product, templateType, slideCopies }: Step4PreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const total = slideCopies.length
  const currentSlide = slideCopies[currentIndex]

  if (!currentSlide) {
    return (
      <div className='py-20 text-center text-sm text-muted-foreground'>
        문구 데이터가 없습니다. 이전 단계로 돌아가 문구를 확인하세요.
      </div>
    )
  }

  const previewSize = Math.round(1080 * SCALE)
  const thumbSize = Math.round(1080 * THUMB_SCALE)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold mb-1'>미리보기</h2>
        <p className='text-sm text-muted-foreground'>
          생성될 슬라이드를 확인하세요. 이전 단계로 돌아가 문구를 수정할 수 있습니다.
        </p>
      </div>

      {/* 메인 미리보기 */}
      <div className='flex flex-col items-center gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {/* 축소된 슬라이드 컨테이너 */}
          <div
            style={{
              width: previewSize,
              height: previewSize,
              overflow: 'hidden',
              borderRadius: 12,
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                transform: `scale(${SCALE})`,
                transformOrigin: 'top left',
                width: 1080,
                height: 1080,
              }}
            >
              <SlideRenderer
                slide={currentSlide}
                product={product}
                templateType={templateType}
                totalSlides={total}
              />
            </div>
          </div>

          <Button
            variant='outline'
            size='icon'
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            disabled={currentIndex === total - 1}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>

        {/* 슬라이드 번호 */}
        <p className='text-sm text-muted-foreground'>
          {currentIndex + 1} / {total}
        </p>
      </div>

      {/* 썸네일 스트립 */}
      <div className='flex items-center justify-center gap-3 flex-wrap'>
        {slideCopies.map((slide, i) => (
          <button
            key={i}
            type='button'
            onClick={() => setCurrentIndex(i)}
            style={{
              width: thumbSize,
              height: thumbSize,
              overflow: 'hidden',
              borderRadius: 6,
              border: i === currentIndex ? '2px solid hsl(var(--primary))' : '2px solid transparent',
              flexShrink: 0,
              cursor: 'pointer',
              padding: 0,
              background: 'none',
              outline: 'none',
            }}
          >
            <div
              style={{
                transform: `scale(${THUMB_SCALE})`,
                transformOrigin: 'top left',
                width: 1080,
                height: 1080,
              }}
            >
              <SlideRenderer
                slide={slide}
                product={product}
                templateType={templateType}
                totalSlides={total}
              />
            </div>
          </button>
        ))}
      </div>

      <div className='rounded-lg border bg-muted/40 p-4'>
        <p className='text-xs text-muted-foreground'>
          💡 미리보기는 실제 PNG 비율(1080×1080px)을 축소한 것입니다. 제품 이미지 로드 여부에 따라 실제 PNG 결과가 다를 수 있습니다.
        </p>
      </div>
    </div>
  )
}
