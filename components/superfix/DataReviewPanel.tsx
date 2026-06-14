'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ProductJSON } from '@/lib/superfix/types'

interface DataReviewPanelProps {
  productJsonList: ProductJSON[]
  onConfirm: (updatedList: ProductJSON[]) => void
}

const REQUIRED_FIELDS: { key: keyof ProductJSON['product'] | 'brandName'; label: string }[] = [
  { key: 'brandName', label: '브랜드명' },
  { key: 'title', label: '제품명' },
  { key: 'model', label: '모델명' },
  { key: 'tubeSize', label: '튜브규격' },
  { key: 'threadSize', label: '나사규격' },
  { key: 'type', label: '형태' },
  { key: 'recommendedUse', label: '추천용도' },
  { key: 'mainImage', label: '대표상품이미지' },
]

function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isFieldMissing(json: ProductJSON, fieldKey: string): boolean {
  if (fieldKey === 'brandName') return !json.brand.name.trim()
  return !(json.product as Record<string, string>)[fieldKey]?.trim()
}

function isAllValid(json: ProductJSON): boolean {
  return REQUIRED_FIELDS.every((f) => !isFieldMissing(json, f.key))
}

interface ProductFormProps {
  json: ProductJSON
  onChange: (updated: ProductJSON) => void
  showErrors: boolean
}

function ProductForm({ json, onChange, showErrors }: ProductFormProps) {
  const [imageError, setImageError] = useState(false)

  function updateBrand(name: string) {
    onChange({ ...json, brand: { ...json.brand, name } })
  }

  function updateProduct(field: keyof ProductJSON['product'], value: string) {
    onChange({ ...json, product: { ...json.product, [field]: value } })
  }

  const fields: { key: keyof ProductJSON['product'] | 'brandName'; label: string }[] = [
    { key: 'brandName', label: '브랜드명' },
    { key: 'title', label: '제품명' },
    { key: 'model', label: '모델명' },
    { key: 'tubeSize', label: '튜브규격' },
    { key: 'threadSize', label: '나사규격' },
    { key: 'type', label: '형태' },
    { key: 'recommendedUse', label: '추천용도' },
    { key: 'mainImage', label: '대표상품이미지 URL' },
  ]

  return (
    <div className='flex flex-col gap-5'>
      {fields.map(({ key, label }) => {
        const isRequired = REQUIRED_FIELDS.some((f) => f.key === key)
        const missing = showErrors && isRequired && isFieldMissing(json, key)
        const value =
          key === 'brandName'
            ? json.brand.name
            : (json.product as Record<string, string>)[key] ?? ''

        return (
          <div key={key} className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>
              {label}
              {isRequired && <span className='ml-1 text-red-500'>*</span>}
            </label>
            <Input
              value={value}
              onChange={(e) => {
                if (key === 'brandName') {
                  updateBrand(e.target.value)
                } else {
                  updateProduct(key as keyof ProductJSON['product'], e.target.value)
                  if (key === 'mainImage') setImageError(false)
                }
              }}
              className={cn(missing && 'border-red-500 focus-visible:ring-red-500')}
            />
            {missing && (
              <p className='text-xs text-red-500'>{label}은(는) 필수 입력값입니다.</p>
            )}
          </div>
        )
      })}

      {/* 이미지 미리보기 */}
      <div className='flex flex-col gap-2'>
        <p className='text-sm font-medium'>이미지 미리보기</p>
        {json.product.mainImage && isValidHttpUrl(json.product.mainImage) && !imageError ? (
          <Image
            src={json.product.mainImage}
            alt={json.product.title || '제품 이미지'}
            width={120}
            height={120}
            className='rounded-md border object-cover'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='flex h-[120px] w-[120px] items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground'>
            미리보기 없음
          </div>
        )}
      </div>
    </div>
  )
}

export function DataReviewPanel({ productJsonList, onConfirm }: DataReviewPanelProps) {
  const [editList, setEditList] = useState<ProductJSON[]>(productJsonList)
  const [showErrors, setShowErrors] = useState(false)

  const allValid = editList.every(isAllValid)

  function handleChange(index: number, updated: ProductJSON) {
    const next = [...editList]
    next[index] = updated
    setEditList(next)
  }

  function handleConfirm() {
    setShowErrors(true)
    if (!allValid) return
    onConfirm(editList)
  }

  if (editList.length === 1) {
    return (
      <div className='flex flex-col gap-6'>
        <ProductForm
          json={editList[0]}
          onChange={(updated) => handleChange(0, updated)}
          showErrors={showErrors}
        />
        <button
          onClick={handleConfirm}
          disabled={showErrors && !allValid}
          className={cn(
            'w-full rounded-md px-5 py-2 text-sm font-semibold transition-colors sm:w-auto sm:self-end',
            allValid
              ? 'bg-foreground text-background hover:bg-foreground/80'
              : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          AI 콘텐츠 생성
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <Tabs defaultValue='0'>
        <TabsList className='mb-4 flex flex-wrap gap-1 h-auto'>
          {editList.map((json, i) => (
            <TabsTrigger key={i} value={String(i)}>
              {json.product.model || `제품 ${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
        {editList.map((json, i) => (
          <TabsContent key={i} value={String(i)}>
            <ProductForm
              json={json}
              onChange={(updated) => handleChange(i, updated)}
              showErrors={showErrors}
            />
          </TabsContent>
        ))}
      </Tabs>
      <button
        onClick={handleConfirm}
        disabled={showErrors && !allValid}
        className={cn(
          'w-full rounded-md px-5 py-2 text-sm font-semibold transition-colors sm:w-auto sm:self-end',
          allValid
            ? 'bg-foreground text-background hover:bg-foreground/80'
            : 'cursor-not-allowed bg-muted text-muted-foreground'
        )}
      >
        AI 콘텐츠 생성
      </button>
    </div>
  )
}
