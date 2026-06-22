import type { SlideData, CardNewsProduct } from '@/lib/cardnews/types'
import { SlideWrapper } from './SlideWrapper'

interface SlideTypeBProps {
  slide: SlideData
  product: CardNewsProduct
  brandColor?: string
  totalSlides?: number
}

function parseLines(text: string) {
  return text.split('\n').filter(Boolean)
}

/* 슬라이드 0: 규격 안내 헤드라인 + 제품 이미지 */
function Slide0({ slide, product, brandColor }: Omit<SlideTypeBProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          backgroundColor: '#0f172a',
          padding: '56px 64px 40px',
          flexShrink: 0,
        }}
      >
        <div style={{ color: '#fff', fontSize: 58, fontWeight: 900, lineHeight: 1.1 }}>
          {product.model || lines[0] || slide.title}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 26, marginTop: 12 }}>
          {product.shape || product.category || '원터치 피팅'}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f1f5f9',
          padding: 32,
        }}
      >
        {product.image_path ? (
          <img
            src={product.image_path}
            alt={product.product_name || ''}
            style={{ maxWidth: '65%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: 260,
              height: 260,
              backgroundColor: '#e2e8f0',
              borderRadius: 16,
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
    </div>
  )
}

/* 슬라이드 1: 규격 테이블 */
function Slide1({ slide, product, brandColor }: Omit<SlideTypeBProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '72px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ color: brandColor, fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
        규격 확인
      </div>
      <div style={{ color: '#0f172a', fontSize: 46, fontWeight: 800, lineHeight: 1.25, marginBottom: 56 }}>
        {lines[0] || slide.title}
      </div>
      {/* 규격 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 26 }}>
        <thead>
          <tr style={{ backgroundColor: brandColor }}>
            <th style={{ color: '#fff', padding: '20px 28px', textAlign: 'left', fontWeight: 700, borderRadius: '12px 0 0 0' }}>
              구분
            </th>
            <th style={{ color: '#fff', padding: '20px 28px', textAlign: 'left', fontWeight: 700 }}>
              규격
            </th>
            <th style={{ color: '#fff', padding: '20px 28px', textAlign: 'left', fontWeight: 700, borderRadius: '0 12px 0 0' }}>
              비고
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <td style={{ padding: '22px 28px', color: '#374151', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
              튜브 외경
            </td>
            <td style={{ padding: '22px 28px', color: brandColor, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>
              {product.tube_spec || '-'}
            </td>
            <td style={{ padding: '22px 28px', color: '#6b7280', borderBottom: '1px solid #e2e8f0' }}>
              외경 기준 선택
            </td>
          </tr>
          <tr style={{ backgroundColor: '#fff' }}>
            <td style={{ padding: '22px 28px', color: '#374151', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
              나사 규격
            </td>
            <td style={{ padding: '22px 28px', color: brandColor, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>
              {product.thread_spec || '-'}
            </td>
            <td style={{ padding: '22px 28px', color: '#6b7280', borderBottom: '1px solid #e2e8f0' }}>
              포트 규격 확인
            </td>
          </tr>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <td style={{ padding: '22px 28px', color: '#374151', fontWeight: 600 }}>
              모델명
            </td>
            <td style={{ padding: '22px 28px', color: brandColor, fontWeight: 700 }}>
              {product.model || '-'}
            </td>
            <td style={{ padding: '22px 28px', color: '#6b7280' }}>
              {product.shape || '원터치 피팅'}
            </td>
          </tr>
        </tbody>
      </table>
      {lines.slice(1).map((line, i) => (
        <div key={i} style={{ color: '#64748b', fontSize: 22, marginTop: 24, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  )
}

/* 슬라이드 2: 모델명 읽기 인포그래픽 */
function Slide2({ slide, product, brandColor }: Omit<SlideTypeBProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
  const model = product.model || 'PC04-M5'
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        padding: '64px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: 22, fontWeight: 500, marginBottom: 16, letterSpacing: 2 }}>
        모델명 읽는 법
      </div>
      <div style={{ color: '#fff', fontSize: 44, fontWeight: 800, lineHeight: 1.25, marginBottom: 56 }}>
        {lines[0] || slide.title}
      </div>

      {/* 모델명 분해 박스 */}
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 20,
          padding: '40px 48px',
          marginBottom: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          {model.split('').map((char, i) => (
            <div
              key={i}
              style={{
                width: char === '-' ? 20 : 72,
                height: char === '-' ? 4 : 72,
                backgroundColor: char === '-' ? '#475569' : brandColor,
                borderRadius: char === '-' ? 2 : 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {char !== '-' ? char : ''}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'PC', desc: '원터치 피팅 타입' },
            { label: '숫자', desc: `튜브 외경 (${product.tube_spec || 'mm'})` },
            { label: '끝자리', desc: `나사 규격 (${product.thread_spec || ''})` },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  backgroundColor: brandColor,
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 700,
                  padding: '4px 14px',
                  borderRadius: 6,
                  flexShrink: 0,
                  minWidth: 64,
                  textAlign: 'center',
                }}
              >
                {item.label}
              </div>
              <span style={{ color: '#cbd5e1', fontSize: 24 }}>→ {item.desc}</span>
            </div>
          ))}
        </div>
      </div>
      {lines.slice(1).map((line, i) => (
        <div key={i} style={{ color: '#94a3b8', fontSize: 22, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  )
}

/* 슬라이드 3: 선택 가이드 */
function Slide3({ slide, product, brandColor }: Omit<SlideTypeBProps, 'totalSlides'>) {
  const lines = parseLines(slide.body || '')
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
        선택 가이드
      </div>
      <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800, lineHeight: 1.25, marginBottom: 48 }}>
        {lines[0] || slide.title}
      </div>
      {/* 추천 박스 */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: '40px 48px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          marginBottom: 32,
        }}
      >
        <div style={{ color: '#64748b', fontSize: 20, fontWeight: 500, marginBottom: 20 }}>이런 상황이라면?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { cond: `튜브 외경 ${product.tube_spec || '?'}`, rec: product.model || '-' },
            { cond: `포트 나사 ${product.thread_spec || '?'}`, rec: `${product.model || '-'} 선택` },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                backgroundColor: i % 2 === 0 ? '#f0f9ff' : '#fff',
                borderRadius: 12,
                borderLeft: `4px solid ${brandColor}`,
              }}
            >
              <span style={{ color: '#374151', fontSize: 24, fontWeight: 500 }}>{item.cond}</span>
              <span style={{ color: brandColor, fontSize: 24, fontWeight: 700 }}>{item.rec} ✓</span>
            </div>
          ))}
        </div>
      </div>
      {lines.slice(1).map((line, i) => (
        <div key={i} style={{ color: '#475569', fontSize: 24, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  )
}

/* 슬라이드 4: CTA */
function Slide4({ slide, brandColor }: Omit<SlideTypeBProps, 'totalSlides'>) {
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

export function SlideTypeB({ slide, product, brandColor = '#FF6A00', totalSlides = 5 }: SlideTypeBProps) {
  const SlideContent = SLIDES[slide.index] ?? Slide0
  return (
    <SlideWrapper slideIndex={slide.index} totalSlides={totalSlides} brandColor={brandColor}>
      <SlideContent slide={slide} product={product} brandColor={brandColor} />
    </SlideWrapper>
  )
}
