'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { CardNewsProduct, CardNewsTemplateType, SlideData } from '@/lib/cardnews/types'
import { createClient } from '@/lib/supabase/client'

interface Step3CopyProps {
  product: CardNewsProduct
  templateType: CardNewsTemplateType
  slideCopies: SlideData[]
  onChange: (copies: SlideData[]) => void
}

function applyPlaceholders(pattern: string, product: CardNewsProduct): string {
  return pattern
    .replace(/\{\{product_name\}\}/g, product.product_name ?? '')
    .replace(/\{\{model\}\}/g, product.model ?? '')
    .replace(/\{\{tube_spec\}\}/g, product.tube_spec ?? '')
    .replace(/\{\{thread_spec\}\}/g, product.thread_spec ?? '')
    .replace(/\{\{shape\}\}/g, product.shape ?? '')
    .replace(/\{\{category\}\}/g, product.category ?? '')
    .replace(/\\n/g, '\n') // DB에 리터럴 \n으로 저장된 경우 실제 줄바꿈으로 변환
}

const SLIDE_LABELS = ['슬라이드 1', '슬라이드 2', '슬라이드 3', '슬라이드 4', '슬라이드 5']

export function Step3Copy({ product, templateType, slideCopies, onChange }: Step3CopyProps) {
  const [loading, setLoading] = useState(false)

  /* copy_rules 조회 → slideCopies 초기화 */
  useEffect(() => {
    if (slideCopies.length > 0) return // 이미 초기화된 경우 유지

    async function fetchCopyRules() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('copy_rules')
          .select('*')
          .eq('template_type', templateType)
          .or(`product_category.is.null,product_category.eq.${product.category ?? ''}`)
          .order('slide_index', { ascending: true })

        if (error || !data) {
          /* 조회 실패 시 빈 슬라이드 5개 초기화 */
          onChange(
            Array.from({ length: 5 }, (_, i) => ({
              index: i,
              title: `슬라이드 ${i + 1}`,
              body: '',
            }))
          )
          return
        }

        /* slide_index별로 첫 번째 규칙 선택 (category 우선) */
        const ruleMap = new Map<number, string>()
        data.forEach((rule) => {
          const idx = rule.slide_index
          if (!ruleMap.has(idx) || rule.product_category !== null) {
            ruleMap.set(idx, applyPlaceholders(rule.copy_pattern, product))
          }
        })

        const copies: SlideData[] = Array.from({ length: 5 }, (_, i) => {
          const body = ruleMap.get(i) ?? ''
          const firstLine = body.split('\n')[0] ?? `슬라이드 ${i + 1}`
          return { index: i, title: firstLine, body }
        })

        onChange(copies)
      } finally {
        setLoading(false)
      }
    }

    fetchCopyRules()
  }, [templateType, product.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleBodyChange(index: number, value: string) {
    const updated = slideCopies.map((s) =>
      s.index === index
        ? { ...s, body: value, title: value.split('\n')[0] ?? s.title }
        : s
    )
    onChange(updated)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20 gap-2 text-muted-foreground'>
        <Loader2 className='h-5 w-5 animate-spin' />
        <span className='text-sm'>문구를 불러오는 중...</span>
      </div>
    )
  }

  if (slideCopies.length === 0) {
    return (
      <div className='py-20 text-center text-sm text-muted-foreground'>
        문구를 불러올 수 없습니다.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold mb-1'>문구 편집</h2>
        <p className='text-sm text-muted-foreground'>
          자동 생성된 문구를 확인하고 편집하세요. 각 슬라이드의 내용을 수정할 수 있습니다.
        </p>
      </div>

      <Tabs defaultValue='0'>
        <TabsList className='w-full'>
          {slideCopies.map((s) => (
            <TabsTrigger key={s.index} value={String(s.index)} className='flex-1'>
              {SLIDE_LABELS[s.index]}
            </TabsTrigger>
          ))}
        </TabsList>

        {slideCopies.map((s) => (
          <TabsContent key={s.index} value={String(s.index)} className='space-y-4 mt-4'>
            <div className='rounded-lg border bg-muted/40 p-4'>
              <p className='text-xs text-muted-foreground mb-1'>슬라이드 {s.index + 1} 제목 (첫 번째 줄)</p>
              <p className='text-sm font-medium'>{s.title || '(비어있음)'}</p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor={`slide-body-${s.index}`} className='text-sm'>
                슬라이드 내용
                <span className='ml-2 text-xs text-muted-foreground font-normal'>줄바꿈으로 문구 구분</span>
              </Label>
              <Textarea
                id={`slide-body-${s.index}`}
                value={s.body}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleBodyChange(s.index, e.target.value)}
                rows={6}
                placeholder='슬라이드 문구를 입력하세요...'
                className='resize-none font-mono text-sm'
              />
            </div>

            <p className='text-xs text-muted-foreground'>
              💡 첫 번째 줄은 메인 헤드라인, 나머지 줄은 본문으로 사용됩니다.
            </p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
