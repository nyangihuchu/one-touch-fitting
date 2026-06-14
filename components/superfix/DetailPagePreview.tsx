'use client'

import { useRef, useState, useEffect } from 'react'

interface DetailPagePreviewProps {
  html: string
  loading?: boolean
}

export function DetailPagePreview({ html, loading = false }: DetailPagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(1)
  const [iframeHeight, setIframeHeight] = useState(3000)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setScale(w / 860)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function handleIframeLoad() {
    try {
      const h = iframeRef.current?.contentWindow?.document.body.scrollHeight
      if (h && h > 0) setIframeHeight(h)
    } catch {
      // 크로스 오리진 환경에서 접근 불가 시 기본 높이 유지
    }
  }

  if (loading) {
    return (
      <div className='space-y-3'>
        <div className='h-64 animate-pulse rounded-lg bg-muted' />
        <div className='h-48 animate-pulse rounded-lg bg-muted' />
        <div className='h-32 animate-pulse rounded-lg bg-muted' />
      </div>
    )
  }

  if (!html) {
    return (
      <div className='flex h-64 items-center justify-center rounded-lg border border-dashed'>
        <p className='text-sm text-muted-foreground'>미리보기가 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className='w-full overflow-hidden rounded-lg border'
      style={{ height: iframeHeight * scale }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={html}
        width={860}
        height={iframeHeight}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          border: 'none',
          display: 'block',
        }}
        onLoad={handleIframeLoad}
        title='상세페이지 미리보기'
        sandbox='allow-same-origin'
      />
    </div>
  )
}
