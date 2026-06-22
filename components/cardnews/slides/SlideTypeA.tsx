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

/* 슬라이드 0: 훅(Hook) — 공감형 질문 + 제품 이미지 */
function Slide0({ slide, product, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const hookLine1 = lines[0] || '이런 고민 있으신가요?'
  const hookLine2 = lines[1] || ''
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 40% — 훅 텍스트 */}
      <div
        style={{
          backgroundColor: brandColor,
          padding: '64px 64px 48px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 24, fontWeight: 600, marginBottom: 16, letterSpacing: 1 }}>
          SUPERFIX 공압 피팅
        </div>
        <div style={{ color: '#fff', fontSize: 56, fontWeight: 800, lineHeight: 1.2 }}>
          {hookLine1}
        </div>
        {hookLine2 && (
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 44, fontWeight: 700, lineHeight: 1.25, marginTop: 8 }}>
            {hookLine2}
          </div>
        )}
      </div>
      {/* 하단 60% — 제품 이미지 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: 40,
        }}
      >
        {product.image_path ? (
          <img
            src={product.image_path}
            alt={product.product_name || ''}
            style={{ maxWidth: '68%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: 320,
              height: 320,
              backgroundColor: '#e2e8f0',
              borderRadius: 20,
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

/* 슬라이드 1: 문제 공감 */
function Slide1({ slide }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const title = lines[0] || '기존 방법의 한계'
  const desc = lines[1] || '작업 공간 확보가 어렵습니다'
  const problems = lines.slice(2).length > 0 ? lines.slice(2) : ['공간이 좁아 직선 연결이 어려움', '배관 방향 변경 시 재작업 필요', '규격 실수로 인한 누설 위험']
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 64px',
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, fontWeight: 500, marginBottom: 20, letterSpacing: 2 }}>
        이런 문제 있으신가요?
      </div>
      <div style={{ color: '#fff', fontSize: 50, fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 28, marginBottom: 56 }}>
        {desc}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, justifyContent: 'center' }}>
        {problems.map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '28px 36px',
              borderLeft: '4px solid rgba(255,255,255,0.2)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 24,
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

/* 슬라이드 2: 해결 방법 */
function Slide2({ slide, product, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const title = lines[0] || `${product.model || '원터치 피팅'}으로 해결`
  const desc = lines[1] || ''
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 64px',
      }}
    >
      <div style={{ color: brandColor, fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
        ✓ 해결책
      </div>
      <div style={{ color: '#0f172a', fontSize: 50, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
        {title}
      </div>
      {desc && (
        <div style={{ color: '#475569', fontSize: 26, marginBottom: 40, lineHeight: 1.5 }}>{desc}</div>
      )}
      {/* 규격 카드 */}
      <div style={{ display: 'flex', gap: 24, marginTop: 'auto', paddingTop: 40 }}>
        {[
          { label: '모델명', value: product.model || '-' },
          { label: '튜브규격', value: product.tube_spec || '-' },
          { label: '나사규격', value: product.thread_spec || '-' },
        ].map((spec) => (
          <div
            key={spec.label}
            style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              borderRadius: 20,
              padding: '36px 24px',
              textAlign: 'center',
              borderTop: `4px solid ${brandColor}`,
            }}
          >
            <div style={{ color: '#64748b', fontSize: 20, fontWeight: 500, marginBottom: 12 }}>{spec.label}</div>
            <div style={{ color: brandColor, fontSize: 34, fontWeight: 800 }}>{spec.value}</div>
          </div>
        ))}
      </div>
      {lines.slice(2).map((line, i) => (
        <div key={i} style={{ color: '#475569', fontSize: 24, lineHeight: 1.6, marginTop: 16 }}>{line}</div>
      ))}
    </div>
  )
}

/* 슬라이드 3: 제품 소개 — 이미지 60% + 규격 40% */
function Slide3({ slide, product, brandColor }: Omit<SlideTypeAProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const features = lines.slice(1).length > 0 ? lines.slice(1) : ['원터치 간편 연결', '완벽한 기밀 성능', '다양한 규격 지원']
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#F5F5F5' }}>
      {/* 왼쪽 60%: 이미지 */}
      <div
        style={{
          width: '60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          backgroundColor: '#fff',
        }}
      >
        {product.image_path ? (
          <img
            src={product.image_path}
            alt={product.product_name || ''}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ width: 280, height: 280, backgroundColor: '#e2e8f0', borderRadius: 16 }} />
        )}
      </div>
      {/* 오른쪽 40%: 제품명 + 특징 */}
      <div
        style={{
          flex: 1,
          padding: '56px 48px 56px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#64748b', fontSize: 20, marginBottom: 8 }}>{product.shape || '원터치 피팅'}</div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
          {product.model || lines[0] || slide.title}
        </div>
        <div style={{ color: brandColor, fontSize: 22, fontWeight: 700, marginBottom: 40 }}>
          {product.category || '공압 피팅'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: brandColor,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#334155', fontSize: 24, lineHeight: 1.5 }}>{f}</span>
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
  const ctaLine1 = lines[0] || '배관 규격이 고민된다면?'
  const ctaLine2 = lines[1] || '프로필 링크 확인'
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
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, fontWeight: 500, marginBottom: 32, letterSpacing: 2 }}>
        SUPERFIX
      </div>
      <div style={{ color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
        {ctaLine1}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 32, fontWeight: 500, marginBottom: 56 }}>
        {ctaLine2}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            backgroundColor: '#fff',
            color: brandColor,
            fontSize: 28,
            fontWeight: 800,
            padding: '16px 48px',
            borderRadius: 14,
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

export function SlideTypeA({ slide, product, brandColor = '#FF6A00', totalSlides = 5 }: SlideTypeAProps) {
  const SlideContent = SLIDES[slide.index] ?? Slide0
  return (
    <SlideWrapper slideIndex={slide.index} totalSlides={totalSlides} brandColor={brandColor}>
      <SlideContent slide={slide} product={product} brandColor={brandColor} />
    </SlideWrapper>
  )
}
