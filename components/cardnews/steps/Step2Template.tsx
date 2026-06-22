'use client'

import type { CardNewsTemplateType } from '@/lib/cardnews/types'
import { cn } from '@/lib/utils'

interface Step2TemplateProps {
  selectedType: CardNewsTemplateType | null
  onSelect: (type: CardNewsTemplateType) => void
}

const TEMPLATES: {
  type: CardNewsTemplateType
  name: string
  badge: string
  description: string
  slides: string[]
}[] = [
  {
    type: 'A',
    name: '문제 해결형',
    badge: 'TYPE A',
    description: '공감형 훅으로 시작해 문제→해결→제품 순서로 전개하는 인스타그램 최적화 카드뉴스 (추천)',
    slides: ['훅(Hook) + 제품 이미지', '문제 공감', '해결 방법 + 규격', '제품 소개 (이미지 60%)', 'CTA'],
  },
  {
    type: 'B',
    name: '규격 설명형',
    badge: 'TYPE B',
    description: '튜브 외경/나사 규격을 인포그래픽으로 쉽게 설명하는 정보 전달형 카드뉴스',
    slides: ['규격 안내 타이틀', '규격 테이블', '모델명 읽는 법', '선택 가이드', 'CTA'],
  },
  {
    type: 'C',
    name: '제품 소개형',
    badge: 'TYPE C',
    description: '제품 이미지와 핵심 특징을 강조하는 심플한 제품 소개형 카드뉴스',
    slides: ['제품명 + 이미지', '핵심 특징 3가지', '주요 사양', '활용 사례', 'CTA'],
  },
]

export function Step2Template({ selectedType, onSelect }: Step2TemplateProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold mb-1'>템플릿 선택</h2>
        <p className='text-sm text-muted-foreground'>카드뉴스 스타일을 선택하세요. 5슬라이드 기준으로 생성됩니다.</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedType === tmpl.type
          return (
            <button
              key={tmpl.type}
              type='button'
              onClick={() => onSelect(tmpl.type)}
              className={cn(
                'text-left rounded-xl border-2 p-5 transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
                isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
              )}
            >
              {/* 배지 */}
              <div className='flex items-center gap-2 mb-3'>
                <span
                  className={cn(
                    'text-xs font-bold px-2 py-1 rounded',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tmpl.badge}
                </span>
                {isSelected && (
                  <span className='text-xs text-primary font-semibold'>선택됨 ✓</span>
                )}
              </div>

              <h3 className='font-semibold text-base mb-2'>{tmpl.name}</h3>
              <p className='text-xs text-muted-foreground mb-4 leading-relaxed'>{tmpl.description}</p>

              {/* 슬라이드 구성 */}
              <div className='space-y-1'>
                <p className='text-xs font-medium text-foreground/70 mb-1'>슬라이드 구성</p>
                {tmpl.slides.map((slide, i) => (
                  <div key={i} className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                        isSelected
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {i + 1}
                    </span>
                    {slide}
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
