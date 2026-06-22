import type { SlideData, CardNewsProduct } from '@/lib/cardnews/types'
import { SlideWrapper } from './SlideWrapper'

interface SlideTypeAProps {
  slide: SlideData
  product: CardNewsProduct
  brandColor?: string
  totalSlides?: number
}

function parseLines(text: string) {
  return text.split('\n').filter(Boolean)
}

/* 슬라이드 0: 타이틀 + 제품 이미지 */
function Slide0({ slide, product, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 컬러 블록 */}
      <div
        style={{
          backgroundColor: brandColor,
          padding: '60px 64px 40px',
          flexShrink: 0,
        }}
      >
        <div style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.2 }}>
          {lines[0] || slide.title}
        </div>
        {lines[1] && (
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 30, marginTop: 16, lineHeight: 1.4 }}>
            {lines[1]}
          </div>
        )}
      </div>

      {/* 제품 이미지 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: 32,
        }}
      >
        {product.image_path ? (
          <img
            src={product.image_path}
            alt={product.product_name || ''}
            style={{ maxWidth: '70%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: 280,
              height: 280,
              backgroundColor: '#e2e8f0',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: 24,
            }}
          >
            이미지 없음
          </div>
        )}
      </div>
    </div>
  )
}

/* 슬라이드 1: 문제점 강조 */
function Slide1({ slide }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const problems = lines.slice(1)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 64px',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: 22, fontWeight: 500, marginBottom: 24, letterSpacing: 2 }}>
        공압 배관의 고민
      </div>
      <div style={{ color: '#fff', fontSize: 48, fontWeight: 800, textAlign: 'center', lineHeight: 1.3, marginBottom: 64 }}>
        {lines[0] || slide.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        {(problems.length > 0 ? problems : ['복잡한 배관 작업', '누설 걱정', '규격 혼란']).map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '28px 36px',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 26,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span style={{ color: '#e2e8f0', fontSize: 28, fontWeight: 500 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 슬라이드 2: 해결책 제시 */
function Slide2({ slide, product, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f9ff',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 64px',
      }}
    >
      <div style={{ color: brandColor, fontSize: 24, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
        ✓ 해결책
      </div>
      <div style={{ color: '#0f172a', fontSize: 50, fontWeight: 800, lineHeight: 1.25, marginBottom: 48 }}>
        {lines[0] || slide.title}
      </div>
      {/* 스펙 하이라이트 카드 */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 48 }}>
        {[
          { label: '모델명', value: product.model || '-' },
          { label: '튜브규격', value: product.tube_spec || '-' },
          { label: '나사규격', value: product.thread_spec || '-' },
        ].map((spec) => (
          <div
            key={spec.label}
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ color: '#64748b', fontSize: 20, fontWeight: 500, marginBottom: 12 }}>{spec.label}</div>
            <div style={{ color: brandColor, fontSize: 32, fontWeight: 800 }}>{spec.value}</div>
          </div>
        ))}
      </div>
      {lines.slice(1).map((line, i) => (
        <div key={i} style={{ color: '#475569', fontSize: 26, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  )
}

/* 슬라이드 3: 제품 상세 */
function Slide3({ slide, product, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const features = lines.slice(1)
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* 왼쪽: 이미지 */}
      <div
        style={{
          width: 420,
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          flexShrink: 0,
        }}
      >
        {product.image_path ? (
          <img
            src={product.image_path}
            alt={product.product_name || ''}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ width: 200, height: 200, backgroundColor: '#e2e8f0', borderRadius: 12 }} />
        )}
      </div>
      {/* 오른쪽: 특징 */}
      <div
        style={{
          flex: 1,
          padding: '64px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#64748b', fontSize: 20, marginBottom: 12 }}>제품 상세</div>
        <div style={{ color: '#0f172a', fontSize: 40, fontWeight: 800, lineHeight: 1.25, marginBottom: 40 }}>
          {lines[0] || slide.title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {(features.length > 0 ? features : ['원터치 간편 연결', '완벽한 기밀 성능']).map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: brandColor,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#334155', fontSize: 26, lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 슬라이드 4: CTA */
function Slide4({ slide, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: brandColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 64px',
        textAlign: 'center',
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24, fontWeight: 500, marginBottom: 32, letterSpacing: 2 }}>
        SUPERFIX 공압 부품 전문몰
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: '#fff',
            fontSize: i === 0 ? 52 : 36,
            fontWeight: i === 0 ? 800 : 500,
            lineHeight: 1.3,
            marginBottom: i === 0 ? 24 : 12,
          }}
        >
          {line}
        </div>
      ))}
      {lines.length === 0 && (
        <div style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.3 }}>
          {slide.title}
        </div>
      )}
      {/* URL 정보 */}
      <div
        style={{
          marginTop: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            color: brandColor,
            fontSize: 26,
            fontWeight: 800,
            padding: '14px 40px',
            borderRadius: 12,
            letterSpacing: 1,
          }}
        >
          daitem.co.kr
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            color: '#fff',
            fontSize: 22,
            fontWeight: 600,
            padding: '12px 32px',
            borderRadius: 12,
            letterSpacing: 0.5,
          }}
        >
          카카오채널 · pf.kakao.com/_kxkpsX
        </div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 600, marginTop: 8 }}>
          ↑ 프로필 링크를 참조하세요
        </div>
      </div>
    </div>
  )
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4]

export function SlideTypeA({ slide, product, brandColor = '#1D4ED8', totalSlides = 5 }: SlideTypeAProps) {
  const SlideContent = SLIDES[slide.index] ?? Slide0
  return (
    <SlideWrapper slideIndex={slide.index} totalSlides={totalSlides} brandColor={brandColor}>
      <SlideContent slide={slide} product={product} brandColor={brandColor} />
    </SlideWrapper>
  )
}
