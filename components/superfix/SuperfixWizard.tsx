'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductSelector } from '@/components/superfix/ProductSelector'
import { DataReviewPanel } from '@/components/superfix/DataReviewPanel'
import { DetailPagePreview } from '@/components/superfix/DetailPagePreview'
import { transformBatch } from '@/lib/superfix/transformer'
import { generateDefaultContent } from '@/lib/superfix/default-content'
import type { MyProduct } from '@/lib/products/types'
import type { ProductJSON, AIGeneratedContent } from '@/lib/superfix/types'

const STEPS = [
  { step: 1, label: '제품 선택' },
  { step: 2, label: '데이터 확인' },
  { step: 3, label: 'AI 생성' },
  { step: 4, label: '미리보기' },
  { step: 5, label: '다운로드' },
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    /* 모바일에서 가로 넘침 방지 — 스텝이 5개라 스크롤 허용 */
    <div className='flex items-center gap-0 overflow-x-auto pb-1'>
      {STEPS.map(({ step, label }, index) => (
        <div key={step} className='flex flex-shrink-0 items-center'>
          <div className='flex flex-col items-center gap-1'>
            <div
              className={cn(
                /* 모바일에서 원 크기를 살짝 줄여 공간 확보 */
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm',
                currentStep === step
                  ? 'bg-foreground text-background'
                  : currentStep > step
                    ? 'bg-foreground/30 text-foreground'
                    : 'border-2 border-muted text-muted-foreground'
              )}
            >
              {step}
            </div>
            {/* 모바일에서 라벨 숨김 — 화면 공간 부족 */}
            <span
              className={cn(
                'hidden text-xs sm:block',
                currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                /* 모바일에서 연결선을 절반으로 줄여 스텝 원들이 잘 보이도록 */
                'mb-0 h-px w-6 flex-shrink-0 transition-colors sm:mb-5 sm:w-12',
                currentStep > step ? 'bg-foreground/30' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function PlaceholderStep({ step }: { step: number }) {
  const placeholders: Record<number, { title: string; description: string }> = {
    5: { title: 'Step 5: 다운로드', description: 'HTML, PNG, JPG 파일을 다운로드하세요.' },
  }
  const current = placeholders[step]
  if (!current) return null
  return (
    <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center'>
      <h2 className='text-lg font-semibold'>{current.title}</h2>
      <p className='text-sm text-muted-foreground'>{current.description}</p>
    </div>
  )
}

function formatErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return '상세페이지 생성 중 오류가 발생했습니다.'
}

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function SuperfixWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<MyProduct[]>([])
  const [productJsonList, setProductJsonList] = useState<ProductJSON[]>([])
  const [showSelectionWarning, setShowSelectionWarning] = useState(false)

  const [aiContentList, setAiContentList] = useState<AIGeneratedContent[]>([])
  const [htmlList, setHtmlList] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [templateType, setTemplateType] = useState<'A' | 'B'>('A')

  function handlePrev() {
    setShowSelectionWarning(false)
    setGenerationError(null)
    setCurrentStep((s) => Math.max(1, s - 1))
  }

  function handleNext() {
    if (currentStep === 1 && selectedProducts.length === 0) {
      setShowSelectionWarning(true)
      return
    }
    setShowSelectionWarning(false)
    if (currentStep === 1) {
      setProductJsonList(transformBatch(selectedProducts))
    }
    setCurrentStep((s) => Math.min(5, s + 1))
  }

  function handleSelectionChange(products: MyProduct[]) {
    setSelectedProducts(products)
    if (products.length > 0) setShowSelectionWarning(false)
  }

  function handleDataConfirm(updatedList: ProductJSON[]) {
    setProductJsonList(updatedList)
    setCurrentStep(3)
  }

  async function handleGenerate() {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      // 제품 데이터 기반 기본 콘텐츠 생성 (AI 없이 규칙 기반)
      const newAiContentList = productJsonList.map((p) => generateDefaultContent(p))
      setAiContentList(newAiContentList)

      // 각 제품별 HTML 생성
      const newHtmlList: string[] = []

      for (let i = 0; i < productJsonList.length; i++) {
        const htmlRes = await fetch('/api/superfix/generate-html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              productJson: productJsonList[i],
              aiContent: newAiContentList[i],
              usageImageUrl: undefined,
            },
            templateType,
          }),
        })

        if (!htmlRes.ok) {
          const err = await htmlRes.json()
          throw new Error(err.error ?? `HTML 생성 오류 (${htmlRes.status})`)
        }

        const { html } = await htmlRes.json() as { html: string }
        newHtmlList.push(html)
      }

      setHtmlList(newHtmlList)
      setCurrentStep(4)
    } catch (err) {
      setGenerationError(formatErrorMessage(err))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h1 className='text-2xl font-bold'>상세페이지 생성</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          My 제품 데이터를 기반으로 쇼핑몰 상세페이지를 자동 생성합니다.
        </p>
      </div>

      <StepIndicator currentStep={currentStep} />

      {/* Step 1: 제품 선택 */}
      {currentStep === 1 && (
        <div className='flex flex-col gap-3'>
          <ProductSelector onSelectionChange={handleSelectionChange} />
          {showSelectionWarning && (
            <p className='text-sm text-red-500'>
              제품을 1개 이상 선택해야 다음 단계로 진행할 수 있습니다.
            </p>
          )}
        </div>
      )}

      {/* Step 2: 데이터 확인 */}
      {currentStep === 2 && productJsonList.length > 0 && (
        <DataReviewPanel
          productJsonList={productJsonList}
          onConfirm={handleDataConfirm}
        />
      )}

      {/* Step 3: AI 생성 */}
      {currentStep === 3 && (
        <div className='flex flex-col gap-6 rounded-lg border p-4 sm:p-8'>
          <div>
            <h2 className='text-lg font-semibold'>템플릿 선택 후 생성</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              선택한 {productJsonList.length}개 제품의 상세페이지 HTML을 생성합니다.
            </p>
          </div>

          {/* 템플릿 A/B 선택 */}
          <div className='grid grid-cols-2 gap-4'>
            {(['A', 'B'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTemplateType(type)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-colors',
                  templateType === type
                    ? 'border-foreground bg-muted'
                    : 'border-muted hover:border-muted-foreground/40'
                )}
              >
                <div className='flex items-center gap-2'>
                  <span className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs font-bold',
                    templateType === type
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-muted-foreground text-muted-foreground'
                  )}>{type}</span>
                  <span className='text-sm font-semibold'>
                    {type === 'A' ? 'A타입 — 다크 네이비' : 'B타입 — 밝은 배경'}
                  </span>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {type === 'A'
                    ? '다크 네이비 Hero · 2×2 특징 카드 · SVG 치수도'
                    : '밝은 배경 · 모델명 초대형 · 실사 이미지 카드'}
                </p>
              </button>
            ))}
          </div>

          {generationError && (
            <Alert variant='destructive'>
              <AlertDescription>{generationError}</AlertDescription>
            </Alert>
          )}

          {isGenerating ? (
            <div className='flex flex-col items-center gap-3 py-4'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>상세페이지 생성 중...</p>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className='w-full rounded-md bg-foreground px-8 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/80 sm:w-auto sm:self-center'
            >
              {generationError ? '다시 시도' : `${templateType}타입 상세페이지 생성`}
            </button>
          )}
        </div>
      )}

      {/* Step 4: 미리보기 */}
      {currentStep === 4 && (
        <div className='flex flex-col gap-4'>
          {/* 모바일에서 세로 스택, sm 이상에서 가로 배치 */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='text-lg font-semibold'>상세페이지 미리보기</h2>
            {/* 다운로드 버튼이 여러 개일 때 모바일에서 줄바꿈 허용 */}
            <div className='flex flex-wrap gap-2'>
              {htmlList.map((html, i) => (
                <button
                  key={i}
                  onClick={() => downloadHtml(html, `${productJsonList[i]?.product.model ?? `product-${i + 1}`}_detail.html`)}
                  className='rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted'
                >
                  {productJsonList.length > 1
                    ? `${productJsonList[i]?.product.model ?? `제품 ${i + 1}`} 다운로드`
                    : 'HTML 다운로드'}
                </button>
              ))}
            </div>
          </div>

          {htmlList.length === 1 ? (
            <DetailPagePreview html={htmlList[0]} />
          ) : (
            <Tabs defaultValue='0'>
              <TabsList>
                {productJsonList.map((p, i) => (
                  <TabsTrigger key={i} value={String(i)}>
                    {p.product.model || `제품 ${i + 1}`}
                  </TabsTrigger>
                ))}
              </TabsList>
              {htmlList.map((html, i) => (
                <TabsContent key={i} value={String(i)}>
                  <DetailPagePreview html={html} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      )}

      {/* Step 5: 다운로드 */}
      {currentStep === 5 && <PlaceholderStep step={5} />}

      {/* 하단 이전/다음 버튼 */}
      <div className='flex justify-between'>
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            currentStep === 1
              ? 'cursor-not-allowed text-muted-foreground'
              : 'bg-muted hover:bg-muted/70'
          )}
        >
          이전
        </button>
        {currentStep !== 2 && currentStep !== 3 && (
          <button
            onClick={handleNext}
            disabled={currentStep === 5}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              currentStep === 5
                ? 'cursor-not-allowed text-muted-foreground'
                : 'bg-foreground text-background hover:bg-foreground/80'
            )}
          >
            다음
          </button>
        )}
      </div>
    </div>
  )
}
