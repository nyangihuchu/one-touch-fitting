import type { ReactNode } from 'react'

interface SlideWrapperProps {
  slideIndex: number
  totalSlides: number
  brandColor?: string
  companyName?: string
  children: ReactNode
}

export function SlideWrapper({
  slideIndex,
  totalSlides,
  brandColor = '#FF6A00',
  companyName = 'SUPERFIX',
  children,
}: SlideWrapperProps) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* 메인 콘텐츠 */}
      <div style={{ width: '100%', height: 1270, position: 'relative' }}>
        {children}
      </div>

      {/* 하단 브랜드 바 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: brandColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          {companyName}
        </span>
        <span
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 22,
            fontWeight: 400,
          }}
        >
          {slideIndex + 1} / {totalSlides}
        </span>
      </div>
    </div>
  )
}
