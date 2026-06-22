'use client'

import { useState } from 'react'
import { Download, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Tables } from '@/lib/supabase/database.types'

type CardNewsJob = Tables<'card_news_jobs'>

interface DownloadJobCardProps {
  job: CardNewsJob & { product_name?: string | null }
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  done: { label: '완료', variant: 'secondary', icon: CheckCircle2 },
  processing: { label: '생성 중', variant: 'outline', icon: Clock },
  pending: { label: '대기 중', variant: 'outline', icon: Clock },
  failed: { label: '실패', variant: 'destructive', icon: AlertCircle },
}

const TEMPLATE_LABEL: Record<string, string> = {
  A: '문제 해결형',
  B: '규격 설명형',
  C: '제품 소개형',
}

export function DownloadJobCard({ job }: DownloadJobCardProps) {
  const [downloading, setDownloading] = useState(false)

  const outputUrls = Array.isArray(job.output_urls) ? (job.output_urls as string[]) : []
  const statusInfo = STATUS_MAP[job.status] ?? STATUS_MAP['pending']
  const StatusIcon = statusInfo.icon

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch(`/api/cardnews/download?jobId=${job.id}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '다운로드 실패' }))
        alert(err.error ?? '다운로드 중 오류가 발생했습니다.')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cardnews_${job.id.slice(0, 8)}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='font-medium truncate'>{job.product_name ?? '(제품명 없음)'}</p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              TYPE {job.template_type} · {TEMPLATE_LABEL[job.template_type] ?? job.template_type}
            </p>
          </div>
          <Badge variant={statusInfo.variant} className='shrink-0 flex items-center gap-1'>
            <StatusIcon className='h-3 w-3' />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* 썸네일 스트립 */}
        {outputUrls.length > 0 ? (
          <div className='flex gap-1.5 overflow-x-auto'>
            {outputUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`슬라이드 ${i + 1}`}
                className='h-16 w-16 shrink-0 rounded object-cover border bg-muted'
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            ))}
          </div>
        ) : (
          <div className='h-16 rounded border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground'>
            {job.status === 'processing' ? '렌더링 중...' : 'PNG 없음'}
          </div>
        )}

        {/* 생성일시 + 다운로드 버튼 */}
        <div className='flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>
            {new Date(job.created_at).toLocaleString('ko-KR', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
          <Button
            size='sm'
            variant='outline'
            onClick={handleDownload}
            disabled={job.status !== 'done' || downloading}
          >
            {downloading ? (
              <><Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />다운로드 중</>
            ) : (
              <><Download className='mr-1.5 h-3.5 w-3.5' />ZIP 다운로드</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
