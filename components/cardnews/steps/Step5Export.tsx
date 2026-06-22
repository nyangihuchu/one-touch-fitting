'use client'

import { useState } from 'react'
import { Loader2, Download, ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CardNewsProduct, CardNewsTemplateType, SlideData } from '@/lib/cardnews/types'

interface Step5ExportProps {
  product: CardNewsProduct
  templateType: CardNewsTemplateType
  slideCopies: SlideData[]
  jobId: string | null
  onJobCreated: (jobId: string) => void
}

type ExportStatus = 'idle' | 'rendering' | 'done' | 'error'

export function Step5Export({
  product,
  templateType,
  slideCopies,
  jobId,
  onJobCreated,
}: Step5ExportProps) {
  const [status, setStatus] = useState<ExportStatus>(jobId ? 'done' : 'idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentJobId, setCurrentJobId] = useState<string | null>(jobId)

  async function handleRender() {
    setStatus('rendering')
    setProgress(0)
    setErrorMsg('')

    try {
      /* 진행 표시용 가상 진행률 (실제 응답은 일괄 처리) */
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 18, 90))
      }, 600)

      const res = await fetch('/api/cardnews/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          templateType,
          slideCopies,
        }),
      })

      clearInterval(timer)

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '알 수 없는 오류' }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const { jobId: newJobId } = await res.json()
      setProgress(100)
      setCurrentJobId(newJobId)
      onJobCreated(newJobId)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '생성 중 오류가 발생했습니다.')
      setStatus('error')
    }
  }

  async function handleDownload() {
    if (!currentJobId) return
    window.location.href = `/api/cardnews/download?jobId=${currentJobId}`
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold mb-1'>PNG 생성 및 다운로드</h2>
        <p className='text-sm text-muted-foreground'>
          슬라이드 5장을 PNG로 렌더링하고 ZIP 파일로 다운로드합니다.
        </p>
      </div>

      {/* 생성 요약 카드 */}
      <div className='rounded-lg border bg-muted/40 p-5 space-y-3'>
        <h3 className='text-sm font-semibold'>생성 요약</h3>
        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='text-xs text-muted-foreground'>상품명</p>
            <p className='font-medium'>{product.product_name ?? '-'}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>모델</p>
            <p className='font-medium'>{product.model ?? '-'}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>템플릿</p>
            <p className='font-medium'>
              TYPE {templateType} · {templateType === 'A' ? '문제 해결형' : templateType === 'B' ? '규격 설명형' : '제품 소개형'}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>슬라이드 수</p>
            <p className='font-medium'>{slideCopies.length}장</p>
          </div>
        </div>
      </div>

      {/* 상태별 UI */}
      {status === 'idle' && (
        <div className='flex flex-col items-center gap-4 py-8'>
          <div className='rounded-full bg-primary/10 p-6'>
            <ImageIcon className='h-10 w-10 text-primary' />
          </div>
          <div className='text-center'>
            <p className='font-medium'>PNG 생성 준비 완료</p>
            <p className='text-sm text-muted-foreground mt-1'>버튼을 누르면 슬라이드 5장을 PNG로 렌더링합니다.</p>
          </div>
          <Button size='lg' onClick={handleRender} className='mt-2'>
            <ImageIcon className='mr-2 h-4 w-4' />
            PNG 생성 시작
          </Button>
        </div>
      )}

      {status === 'rendering' && (
        <div className='flex flex-col items-center gap-4 py-8'>
          <Loader2 className='h-10 w-10 animate-spin text-primary' />
          <div className='text-center'>
            <p className='font-medium'>슬라이드 렌더링 중...</p>
            <p className='text-sm text-muted-foreground mt-1'>
              {Math.round(progress / 20) + 1 <= 5
                ? `슬라이드 ${Math.round(progress / 20) + 1}/5 생성 중...`
                : 'PNG 파일 저장 중...'}
            </p>
          </div>
          {/* 진행률 바 */}
          <div className='w-64 h-2 rounded-full bg-muted overflow-hidden'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className='text-xs text-muted-foreground'>{progress}%</p>
        </div>
      )}

      {status === 'done' && (
        <div className='flex flex-col items-center gap-4 py-8'>
          <div className='rounded-full bg-green-100 dark:bg-green-900/30 p-6'>
            <CheckCircle2 className='h-10 w-10 text-green-600 dark:text-green-400' />
          </div>
          <div className='text-center'>
            <p className='font-medium'>PNG 생성 완료!</p>
            <p className='text-sm text-muted-foreground mt-1'>5장의 슬라이드 PNG가 생성되었습니다.</p>
          </div>
          <Button size='lg' onClick={handleDownload} variant='default' className='mt-2'>
            <Download className='mr-2 h-4 w-4' />
            ZIP 다운로드
          </Button>
          <Button variant='outline' size='sm' onClick={() => setStatus('idle')}>
            다시 생성하기
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className='flex flex-col items-center gap-4 py-8'>
          <div className='rounded-full bg-destructive/10 p-6'>
            <AlertCircle className='h-10 w-10 text-destructive' />
          </div>
          <div className='text-center'>
            <p className='font-medium text-destructive'>생성 실패</p>
            <p className='text-sm text-muted-foreground mt-1'>{errorMsg}</p>
          </div>
          <Button size='lg' onClick={handleRender} variant='outline' className='mt-2'>
            다시 시도
          </Button>
        </div>
      )}
    </div>
  )
}
