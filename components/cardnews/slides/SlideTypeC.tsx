import type { SlideData, CardNewsProduct } from '@/lib/cardnews/types'
import { SlideWrapper } from './SlideWrapper'

interface SlideTypeCProps {
  slide: SlideData
  product: CardNewsProduct
  brandColor?: string
  totalSlides?: number
}

function parseLines(text: string) {
  return text.split('\n').filter(Boolean)
}

/* 슬라이드 0: 제품명 + 이미지 (크게) */
function Slide0({ slide, product, brandColor }: Omit<SlideTypeCProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#fff' }}>
      {/* 배경 도형 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 520,
          height: 520,
          backgroundColor: brandColor,
          borderRadius: '0 0 0 100%',
          opacity: 0.08,
        }}
      />
      <div style={{ position: 'relative', padding: '72px 64px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: brandColor,
            color: '#fff',
            fontSize: 20,
            fontWeight: 600,
            padding: '6px 16px',
            borderRadius: 4,
            marginBottom: 24,
            letterSpacing: 1,
            alignSelf: 'flex-start',
          }}
        >
          제품 소개형 · TYPE C
        </div>
        <div style={{ color: '#0f172a', fontSize: 52, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
          {lines[0] || product.product_name || slide.title}
        </div>
        {lines[1] && (
          <div style={{ color: '#64748b', fontSize: 26, marginBottom: 16 }}>{lines[1]}</div>
        )}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          {product.image_path ? (
            <img
              src={product.image_path}
              alt={product.product_name || ''}
              style={{ maxWidth: '72%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div
              style={{
                width: 300,
                height: 300,
                backgroundColor: '#f1f5f9',
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: 22,
              }}
            >
              이미지 없음
            </div>
          )}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 20, marginTop: 16 }}>
          {product.model || ''} · {product.category || '공압 피팅'}
        </div>
      </div>
    </div>
  )
}

/* 슬라이드 1: 핵심 특징 3가지 */
function Slide1({ slide, brandColor }: Omit<SlideTypeCProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const features = lines.slice(1)
  const icons = ['⚡', '🔒', '📐']
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '72px 64px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ color: brandColor, fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
        핵심 특징
      </div>
      <div style={{ color: '#0f172a', fontSize: 46, fontWeight: 800, lineHeight: 1.25, marginBottom: 56 }}>
        {lines[0] || slide.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: 1, justifyContent: 'center' }}>
        {(features.length > 0 ? features : ['원터치 간편 연결', '완벽한 기밀 성능', '다양한 규격 지원']).map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              backgroundColor: i === 0 ? brandColor : '#f8fafc',
              borderRadius: 20,
              padding: '32px 40px',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                backgroundColor: i === 0 ? 'rgba(255,255,255,0.2)' : brandColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                flexShrink: 0,
              }}
            >
              {icons[i]}
            </div>
            <div>
              <div
                style={{
                  color: i === 0 ? '#fff' : '#0f172a',
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {f.replace(/^[①②③]\s*/, '')}
              </div>
              <div
                style={{
                  color: i === 0 ? 'rgba(255,255,255,0.75)' : '#64748b',
                  fontSize: 20,
                }}
              >
                {i === 0 ? '원터치로 연결, 툴 불필요' : i === 1 ? '고압에서도 완벽한 밀봉' : '다양한 규격 대응 가능'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 슬라이드 2: 주요 사양 테이블 */
function Slide2({ slide, product, brandColor }: Omit<SlideTypeCProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const specs = [
    { label: '튜브규격', value: product.tube_spec || '-' },
    { label: '나사규격', value: product.thread_spec || '-' },
    { label: '형태', value: product.shape || '-' },
    { label: '카테고리', value: product.category || '공압 피팅' },
  ]
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        padding: '72px 64px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ color: brandColor, fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
        주요 사양
      </div>
      <div style={{ color: '#fff', fontSize: 46, fontWeight: 800, lineHeight: 1.25, marginBottom: 48 }}>
        {lines[0] || slide.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 16, overflow: 'hidden' }}>
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
              padding: '24px 36px',
            }}
          >
            <div style={{ width: 180, color: '#94a3b8', fontSize: 22, fontWeight: 500 }}>{spec.label}</div>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>{spec.value}</div>
          </div>
        ))}
      </div>
      {lines.slice(1).map((line, i) => (
        <div key={i} style={{ color: '#64748b', fontSize: 22, marginTop: 24, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  )
}

/* 슬라이드 3: 활용 사례/환경 */
function Slide3({ slide, brandColor }: Omit<SlideTypeCProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const useCases = [
    { icon: '🏭', label: '자동화 설비', desc: '공압 실린더, 밸브 연결' },
    { icon: '🔧', label: '공압 배관', desc: '에어 공급 라인 구성' },
    { icon: '⚙️', label: '산업 기계', desc: '각종 공압 기기 연결' },
    { icon: '🏗️', label: '생산 현장', desc: '빠른 배관 교체/수정' },
  ]
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc',
        padding: '64px 64px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ color: brandColor, fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
        활용 사례
      </div>
      <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800, lineHeight: 1.25, marginBottom: 48 }}>
        {lines[0] || slide.title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>
        {useCases.map((uc, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: '32px 36px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ fontSize: 44, flexShrink: 0 }}>{uc.icon}</div>
            <div>
              <div style={{ color: '#0f172a', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{uc.label}</div>
              <div style={{ color: '#64748b', fontSize: 20 }}>{uc.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 슬라이드 4: CTA */
function Slide4({ slide, brandColor }: Omit<SlideTypeCProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 원 장식 */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          backgroundColor: brandColor,
          borderRadius: '50%',
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          backgroundColor: brandColor,
          borderRadius: '50%',
          opacity: 0.06,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            width: 100,
            height: 100,
            backgroundColor: brandColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            margin: '0 auto 40px',
          }}
        >
          🛒
        </div>
        {(lines.length > 0 ? lines : [slide.title]).map((line, i) => (
          <div
            key={i}
            style={{
              color: i === 0 ? '#0f172a' : '#64748b',
              fontSize: i === 0 ? 48 : 28,
              fontWeight: i === 0 ? 800 : 400,
              lineHeight: 1.35,
              marginBottom: i === 0 ? 16 : 8,
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            marginTop: 48,
            backgroundColor: brandColor,
            color: '#fff',
            fontSize: 26,
            fontWeight: 700,
            padding: '20px 56px',
            borderRadius: 50,
            display: 'inline-block',
          }}
        >
          SUPERFIX 공압몰 바로가기 →
        </div>

        {/* URL 정보 */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 2,
              backgroundColor: brandColor,
              opacity: 0.3,
              marginBottom: 4,
            }}
          />
          <div style={{ color: '#1e293b', fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>
            daitem.co.kr
          </div>
          <div style={{ color: '#64748b', fontSize: 20, fontWeight: 400 }}>
            카카오채널 · pf.kakao.com/_kxkpsX
          </div>
        </div>
      </div>
    </div>
  )
}

const SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4]

export function SlideTypeC({ slide, product, brandColor = '#1D4ED8', totalSlides = 5 }: SlideTypeCProps) {
  const SlideContent = SLIDES[slide.index] ?? Slide0
  return (
    <SlideWrapper slideIndex={slide.index} totalSlides={totalSlides} brandColor={brandColor}>
      <SlideContent slide={slide} product={product} brandColor={brandColor} />
    </SlideWrapper>
  )
}
