'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GenerateStepper } from '@/components/cardnews/GenerateStepper'
import { Step1Product } from '@/components/cardnews/steps/Step1Product'
import { Step2Template } from '@/components/cardnews/steps/Step2Template'
import { Step3Copy } from '@/components/cardnews/steps/Step3Copy'
import { Step4Preview } from '@/components/cardnews/steps/Step4Preview'
import { Step5Export } from '@/components/cardnews/steps/Step5Export'
import type { CardNewsProduct, CardNewsTemplateType, SlideData } from '@/lib/cardnews/types'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { step: 1, label: '상품 선택' },
  { step: 2, label: '템플릿' },
  { step: 3, label: '문구 편집' },
  { step: 4, label: '미리보기' },
  { step: 5, label: '내보내기' },
]

export function CardNewsGenerateContent() {
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids')

  const [step, setStep] = useState(1)
  const [products, setProducts] = useState<CardNewsProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<CardNewsProduct | null>(null)
  const [templateType, setTemplateType] = useState<CardNewsTemplateType | null>(null)
  const [slideCopies, setSlideCopies] = useState<SlideData[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('my_products')
          .select('id, product_name, model, category, image_path, tube_spec, thread_spec, shape')
          .order('product_name', { ascending: true })

        const list = (data ?? []) as CardNewsProduct[]
        setProducts(list)

        if (idsParam) {
          const firstId = parseInt(idsParam.split(',')[0])
          const preSelected = list.find((p) => p.id === firstId)
          if (preSelected) {
            setSelectedProduct(preSelected)
            setStep(2)
          }
        }
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [idsParam])

  function handleTemplateSelect(type: CardNewsTemplateType) {
    setTemplateType(type)
    setSlideCopies([])
  }

  function handleProductSelect(product: CardNewsProduct) {
    setSelectedProduct(product)
    if (templateType) setSlideCopies([])
  }

  function canProceed(): boolean {
    if (step === 1) return selectedProduct !== null
    if (step === 2) return templateType !== null
    if (step === 3) return slideCopies.length > 0
    if (step === 4) return true
    return false
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>카드뉴스 생성</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          상품을 선택하고 템플릿을 골라 카드뉴스를 자동으로 생성하세요.
        </p>
      </div>

      <GenerateStepper currentStep={step} steps={STEPS} />

      {/* 모바일에서는 min-height 축소 */}
      <div className='min-h-[360px] md:min-h-[480px]'>
        {loadingProducts && step === 1 ? (
          <div className='py-20 text-center text-sm text-muted-foreground'>상품 목록을 불러오는 중...</div>
        ) : step === 1 ? (
          <Step1Product products={products} selectedProduct={selectedProduct} onSelect={handleProductSelect} />
        ) : step === 2 ? (
          <Step2Template selectedType={templateType} onSelect={handleTemplateSelect} />
        ) : step === 3 && selectedProduct && templateType ? (
          <Step3Copy product={selectedProduct} templateType={templateType} slideCopies={slideCopies} onChange={setSlideCopies} />
        ) : step === 4 && selectedProduct && templateType ? (
          <Step4Preview product={selectedProduct} templateType={templateType} slideCopies={slideCopies} />
        ) : step === 5 && selectedProduct && templateType ? (
          <Step5Export product={selectedProduct} templateType={templateType} slideCopies={slideCopies} jobId={jobId} onJobCreated={setJobId} />
        ) : null}
      </div>

      <div className='flex items-center justify-between border-t pt-4'>
        <Button variant='outline' onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ChevronLeft className='mr-1 h-4 w-4' />
          이전
        </Button>
        {step < 5 && (
          <Button onClick={() => { if (canProceed()) setStep((s) => Math.min(5, s + 1)) }} disabled={!canProceed()}>
            다음
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
