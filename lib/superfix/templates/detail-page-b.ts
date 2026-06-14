import type { DetailPageData } from '@/lib/superfix/types'

const B = {
  navy: '#003B8F',
  darkNavy: '#0B1F3A',
  orange: '#FF6B00',
  bg: '#FFFFFF',
  bgAlt: '#F5F7FA',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
}

function esc(s: string | undefined | null): string {
  if (!s) return ''
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeUrl(url: string | undefined | null): string {
  if (!url) return ''
  const t = url.trim()
  if (/^https?:\/\//i.test(t)) return esc(t)
  if (t.startsWith('/') || t.startsWith('data:image/')) return esc(t)
  return ''
}

function parseOptionLines(raw: string): string[][] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes('\t')) return line.split('\t').map((p) => p.trim())
      return line.split(/\s*\/\s*/).map((p) => p.trim())
    })
}

// ── B타입 아이콘 (흰색 stroke) ──────────────────────────────────────────────
const BSVG = {
  pipe: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M6 8v8M18 8v8M6 8h12a0 0 0 0 1 0 8H6a0 0 0 0 1 0-8z"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>`,
  shield: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
  lock: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="white"/></svg>`,
  repeat: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  // 사용분야 아이콘 (폴백용)
  cylinder: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
  valve: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
  tool: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  factory: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>`,
  settings: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  // 푸터 아이콘
  globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  truck: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>`,
  headphones: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
  award: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
}

// ── 외형 치수도 오버레이 (제품 사진 + SVG 치수선) ───────────────────────────
function renderBDimensionOverlay(data: DetailPageData): string {
  const { product } = data.productJson
  const imgUrl = safeUrl(product.mainImage)
  const tube = product.tubeSize ? `Ø${esc(product.tubeSize)}` : ''
  const thread = product.threadSize ? esc(product.threadSize) : ''

  if (!tube && !thread) {
    return imgUrl
      ? `<div style="position:relative;width:100%;height:320px;background:#fff;border-radius:8px;border:1px solid ${B.border};overflow:hidden;">
           <img src="${imgUrl}" alt="제품 이미지" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;"/>
         </div>`
      : `<div style="height:320px;background:${B.bgAlt};border-radius:8px;border:1px solid ${B.border};display:flex;align-items:center;justify-content:center;color:${B.textLight};font-size:13px;">이미지 없음</div>`
  }

  const imageBlock = imgUrl
    ? `<img src="${imgUrl}" alt="제품 치수 이미지" style="position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;object-fit:contain;"/>`
    : `<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;color:${B.textLight};font-size:13px;">이미지 없음</div>`

  const topAnnotation = tube ? `
    <line x1="190" y1="30" x2="190" y2="54" stroke="${B.darkNavy}" stroke-width="1"/>
    <line x1="310" y1="30" x2="310" y2="54" stroke="${B.darkNavy}" stroke-width="1"/>
    <line x1="204" y1="42" x2="296" y2="42" stroke="${B.darkNavy}" stroke-width="1.5"/>
    <polygon points="190,42 204,36 204,48" fill="${B.darkNavy}"/>
    <polygon points="310,42 296,36 296,48" fill="${B.darkNavy}"/>
    <rect x="195" y="7" width="110" height="22" fill="white" fill-opacity="0.9"/>
    <text x="250" y="22" text-anchor="middle" font-size="16" font-weight="700" font-family="Arial,sans-serif" fill="${B.darkNavy}">${tube}</text>` : ''

  const bottomAnnotation = thread ? `
    <line x1="150" y1="302" x2="150" y2="326" stroke="${B.darkNavy}" stroke-width="1"/>
    <line x1="350" y1="302" x2="350" y2="326" stroke="${B.darkNavy}" stroke-width="1"/>
    <line x1="164" y1="314" x2="336" y2="314" stroke="${B.darkNavy}" stroke-width="1.5"/>
    <polygon points="150,314 164,308 164,320" fill="${B.darkNavy}"/>
    <polygon points="350,314 336,308 336,320" fill="${B.darkNavy}"/>
    <rect x="170" y="328" width="160" height="22" fill="white" fill-opacity="0.9"/>
    <text x="250" y="343" text-anchor="middle" font-size="16" font-weight="700" font-family="Arial,sans-serif" fill="${B.darkNavy}">${thread}</text>` : ''

  return `<div style="position:relative;width:100%;height:360px;background:#fff;border-radius:8px;border:1px solid ${B.border};overflow:hidden;">
  ${imageBlock}
  <svg style="position:absolute;top:0;left:0;width:100%;height:100%;" viewBox="0 0 500 360" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    ${topAnnotation}
    ${bottomAnnotation}
    <text x="490" y="356" text-anchor="end" font-size="10" fill="${B.textLight}" font-family="Arial,sans-serif">단위 : mm</text>
  </svg>
</div>`
}

// ── 1. Hero 섹션 ────────────────────────────────────────────────────────────
export function renderBHeroSection(data: DetailPageData): string {
  const { brand, product } = data.productJson
  const imgUrl = safeUrl(product.mainImage)

  const imgHtml = imgUrl
    ? `<img src="${imgUrl}" alt="${esc(product.title)}" style="max-width:280px;max-height:280px;object-fit:contain;display:block;margin:0 auto;filter:drop-shadow(0 12px 32px rgba(0,59,143,0.18));"/>`
    : `<div style="width:240px;height:240px;background:${B.border};border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto;"><span style="color:${B.textLight};font-size:11px;letter-spacing:2px;">NO IMAGE</span></div>`

  const badges = [
    product.tubeSize && `<span style="display:inline-block;background:${B.navy};color:#fff;font-size:12px;font-weight:600;padding:5px 14px;border-radius:20px;letter-spacing:0.3px;">${esc(product.tubeSize)} 튜브용</span>`,
    product.threadSize && `<span style="display:inline-block;background:${B.navy};color:#fff;font-size:12px;font-weight:600;padding:5px 14px;border-radius:20px;letter-spacing:0.3px;">${esc(product.threadSize)} 나사</span>`,
    product.type && `<span style="display:inline-block;background:${B.bgAlt};color:${B.text};font-size:12px;font-weight:500;padding:5px 14px;border-radius:20px;border:1px solid ${B.border};">${esc(product.type)}</span>`,
  ].filter(Boolean).join(' ')

  return `<div data-section="hero" style="background:${B.bgAlt};padding:56px 48px 0;">
  <div style="display:flex;align-items:center;gap:48px;">
    <div style="flex:1;min-width:0;">
      <div style="font-size:11px;font-weight:800;letter-spacing:4px;color:${B.navy};margin-bottom:8px;">${esc(brand.name)}</div>
      <div style="font-size:14px;color:${B.textLight};margin-bottom:10px;">${esc(product.title)}</div>
      <div style="font-size:54px;font-weight:900;color:${B.darkNavy};line-height:1.05;letter-spacing:-1px;margin-bottom:20px;font-family:Arial,sans-serif;">${esc(product.model)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">${badges}</div>
      <div style="font-size:13px;color:${B.textLight};line-height:1.8;">
        빠른 배관 &nbsp;·&nbsp; 강력한 고정 &nbsp;·&nbsp; 간편한 연결 &nbsp;·&nbsp; 전자동 설비 호환
      </div>
    </div>
    <div style="flex-shrink:0;width:300px;height:300px;display:flex;align-items:center;justify-content:center;">
      ${imgHtml}
    </div>
  </div>
  <!-- 웨이브 구분선 -->
  <div style="margin-top:40px;overflow:hidden;line-height:0;">
    <svg viewBox="0 0 860 48" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;">
      <path d="M0,24 C215,48 645,0 860,24 L860,48 L0,48 Z" fill="${B.darkNavy}"/>
    </svg>
  </div>
</div>`
}

// ── 2. 특징 바 (네이비 수평 바) ────────────────────────────────────────────
export function renderBFeatureBarSection(data: DetailPageData): string {
  const { features } = data.aiContent
  const iconKeys = ['pipe', 'shield', 'lock', 'repeat'] as const
  const labels = ['빠른 배관', '완전 밀폐', '흔들림 방지', '반복 사용']

  const items = features.slice(0, 4).map((f, i) => {
    const icon = BSVG[iconKeys[i]]
    const label = labels[i] ?? `특징 ${i + 1}`
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 12px;border-right:1px solid rgba(255,255,255,0.08);">
  <div style="margin-bottom:12px;">${icon}</div>
  <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;letter-spacing:0.3px;">${esc(label)}</div>
  <div style="font-size:11px;color:rgba(255,255,255,0.55);line-height:1.6;">${esc(f)}</div>
</div>`
  }).join('')

  return `<div data-section="features" style="background:${B.darkNavy};padding:36px 48px;">
  <div style="display:flex;gap:0;">${items}</div>
</div>`
}

// ── 3. 제품 규격 + 외형 치수도 (2단) ────────────────────────────────────────
export function renderBSpecDimensionSection(data: DetailPageData): string {
  const { product } = data.productJson

  const rows: [string, string][] = [
    ['모델명', product.model],
    ['형태', product.type],
    ['튜브 외경', product.tubeSize],
    ['나사 규격', product.threadSize],
    ['사용 온도', '0~60℃'],
    ['압력 범위', '0~1.0 MPa'],
    ['재질', 'PBT / 황동 / NBR'],
    ['적용 유체', '공기 (Air)'],
  ].filter(([, v]) => !!v) as [string, string][]

  const tableRows = rows.map(([k, v]) =>
    `<tr>
  <td style="background:${B.navy};color:#fff;font-size:12px;font-weight:600;padding:11px 16px;width:110px;white-space:nowrap;border-bottom:1px solid rgba(255,255,255,0.1);">${esc(k)}</td>
  <td style="color:${B.text};font-size:13px;padding:11px 16px;border-bottom:1px solid ${B.border};font-weight:500;">${esc(v)}</td>
</tr>`
  ).join('')

  return `<div data-section="specification" style="background:${B.bg};padding:56px 48px;">
  <h2 style="margin:0 0 32px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.navy};padding-left:12px;letter-spacing:-0.3px;">제품 규격 · 외형 치수도</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start;">
    <div>
      <div style="font-size:12px;font-weight:700;color:${B.navy};letter-spacing:2px;margin-bottom:10px;padding-left:2px;">제품 규격</div>
      <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.08);border:1px solid ${B.border};">
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    <div>
      <div style="font-size:12px;font-weight:700;color:${B.navy};letter-spacing:2px;margin-bottom:10px;padding-left:2px;">외형 치수도</div>
      ${renderBDimensionOverlay(data)}
    </div>
  </div>
</div>`
}

// ── 4. 다양한 사용 분야 ─────────────────────────────────────────────────────
export function renderBUsageSection(data: DetailPageData): string {
  const imgUrl = safeUrl(data.usageImageUrl)

  if (imgUrl) {
    return `<div data-section="usage" style="background:${B.bgAlt};padding:56px 48px;">
  <h2 style="margin:0 0 28px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.navy};padding-left:12px;">다양한 사용 분야</h2>
  <img src="${imgUrl}" alt="사용 예시" style="width:100%;border-radius:8px;display:block;"/>
</div>`
  }

  const usageItems = [
    { icon: BSVG.cylinder, name: '실린더 연결', desc: '에어 실린더 입·출력 포트 배관' },
    { icon: BSVG.valve, name: '솔레노이드 밸브', desc: '공압 솔레노이드 밸브 배관' },
    { icon: BSVG.tool, name: '에어건 연결', desc: '에어건 및 공압 공구 연결' },
    { icon: BSVG.factory, name: '자동화 설비', desc: 'FA 자동화 설비 공압 시스템' },
    { icon: BSVG.settings, name: '설비 보전', desc: '생산 설비 유지보수 및 배관' },
  ]

  const cards = usageItems.map(({ icon, name, desc }) =>
    `<div style="background:${B.bg};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid ${B.border};">
  <div style="background:${B.darkNavy};height:100px;display:flex;align-items:center;justify-content:center;">
    ${icon}
  </div>
  <div style="padding:14px 12px 16px;background:${B.navy};">
    <div style="font-size:12px;font-weight:700;color:#fff;text-align:center;margin-bottom:4px;">${esc(name)}</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.65);text-align:center;line-height:1.5;">${esc(desc)}</div>
  </div>
</div>`
  ).join('')

  return `<div data-section="usage" style="background:${B.bgAlt};padding:56px 48px;">
  <h2 style="margin:0 0 28px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.navy};padding-left:12px;">다양한 사용 분야</h2>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;">${cards}</div>
</div>`
}

// ── 5. 구매 전 확인사항 ──────────────────────────────────────────────────────
export function renderBCheckBeforeBuySection(data: DetailPageData): string {
  const { product } = data.productJson
  const tube = product.tubeSize || '-'
  const thread = product.threadSize || '-'

  // 튜브 단면 SVG 일러스트
  const tubeSvg = `<svg viewBox="0 0 120 120" style="width:90px;height:90px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="50" fill="#E8F0FE" stroke="${B.navy}" stroke-width="2"/>
  <circle cx="60" cy="60" r="32" fill="${B.bgAlt}" stroke="${B.navy}" stroke-width="2"/>
  <circle cx="60" cy="60" r="16" fill="${B.bg}" stroke="${B.textLight}" stroke-width="1.5" stroke-dasharray="4,2"/>
  <!-- 직경 화살표 -->
  <line x1="10" y1="60" x2="110" y2="60" stroke="${B.navy}" stroke-width="1.2"/>
  <polygon points="10,60 20,55 20,65" fill="${B.navy}"/>
  <polygon points="110,60 100,55 100,65" fill="${B.navy}"/>
  <rect x="35" y="48" width="50" height="18" fill="white" fill-opacity="0.9" rx="2"/>
  <text x="60" y="60" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="${B.navy}" font-family="Arial,sans-serif">Ø${esc(tube)}</text>
</svg>`

  // 나사 단면 SVG 일러스트
  const threadSvg = `<svg viewBox="0 0 120 120" style="width:90px;height:90px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="80" height="80" rx="4" fill="#E8F0FE" stroke="${B.navy}" stroke-width="2"/>
  <!-- 나사산 패턴 -->
  <line x1="20" y1="35" x2="100" y2="35" stroke="${B.navy}" stroke-width="1" opacity="0.4"/>
  <line x1="20" y1="48" x2="100" y2="48" stroke="${B.navy}" stroke-width="1" opacity="0.4"/>
  <line x1="20" y1="61" x2="100" y2="61" stroke="${B.navy}" stroke-width="1" opacity="0.4"/>
  <line x1="20" y1="74" x2="100" y2="74" stroke="${B.navy}" stroke-width="1" opacity="0.4"/>
  <line x1="20" y1="87" x2="100" y2="87" stroke="${B.navy}" stroke-width="1" opacity="0.4"/>
  <!-- 대각 나사산 -->
  <line x1="20" y1="20" x2="100" y2="100" stroke="${B.navy}" stroke-width="0.8" opacity="0.15"/>
  <!-- 규격 텍스트 -->
  <rect x="15" y="50" width="90" height="20" fill="white" fill-opacity="0.9" rx="2"/>
  <text x="60" y="60" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="${B.navy}" font-family="Arial,sans-serif">${esc(thread)}</text>
</svg>`

  const card = (title: string, sub: string, svg: string, spec: string, color: string) =>
    `<div style="border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:1px solid ${B.border};">
  <div style="background:${color};padding:16px 20px;">
    <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.7);margin-bottom:4px;">확인 필수</div>
    <div style="font-size:15px;font-weight:700;color:#fff;">${esc(title)}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:2px;">${esc(sub)}</div>
  </div>
  <div style="background:#fff;padding:28px 20px;text-align:center;">
    ${svg}
    <div style="margin-top:16px;font-size:22px;font-weight:900;color:${color};font-family:Arial,sans-serif;">${esc(spec)}</div>
    <div style="font-size:11px;color:${B.textLight};margin-top:4px;">주문 전 반드시 확인하세요</div>
  </div>
</div>`

  return `<div data-section="check-before-buy" style="background:${B.bgAlt};padding:56px 48px;">
  <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.orange};padding-left:12px;">구매 전 확인해요!</h2>
  <p style="margin:0 0 28px;font-size:13px;color:${B.textLight};padding-left:16px;">튜브 외경과 나사 규격을 반드시 확인 후 주문하세요.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    ${card('튜브 규격 확인', '튜브 외경(OD) 기준', tubeSvg, tube, B.navy)}
    ${card('나사 규격 확인', '수나사 규격 기준', threadSvg, thread, B.darkNavy)}
  </div>
</div>`
}

// ── 6. 옵션 안내 ─────────────────────────────────────────────────────────────
export function renderBOptionTableSection(data: DetailPageData): string {
  const { product } = data.productJson
  const imgUrl = safeUrl(product.mainImage)

  if (!product.options || product.options.trim() === '') {
    return `<div data-section="option-table" style="background:${B.bg};padding:56px 48px;">
  <h2 style="margin:0 0 28px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.navy};padding-left:12px;">옵션 안내</h2>
  <div style="padding:24px;background:${B.bgAlt};border-radius:8px;text-align:center;border:1px solid ${B.border};">
    <p style="margin:0;font-size:13px;color:${B.textLight};">옵션 정보가 없습니다.</p>
  </div>
</div>`
  }

  const lines = parseOptionLines(product.options)
  const HEADERS = ['옵션명', '모델명', '튜브 외경', '나사 규격']
  const isSingleCol = lines[0]?.length === 1

  if (isSingleCol) {
    const listItems = lines.map((r) =>
      `<li style="padding:10px 16px;border-bottom:1px solid ${B.border};font-size:13px;color:${B.text};">${esc(r[0] ?? '')}</li>`
    ).join('')
    return `<div data-section="option-table" style="background:${B.bg};padding:56px 48px;">
  <h2 style="margin:0 0 28px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.navy};padding-left:12px;">옵션 안내</h2>
  <ul style="list-style:none;margin:0;padding:0;border:1px solid ${B.border};border-radius:8px;overflow:hidden;">${listItems}</ul>
</div>`
  }

  const headerCells = HEADERS.slice(0, lines[0]?.length ?? 4).map((h, i) =>
    `<th style="background:${B.navy};color:#fff;font-size:12px;font-weight:700;padding:13px 16px;text-align:${i === 0 ? 'left' : 'center'};border-right:1px solid rgba(255,255,255,0.1);letter-spacing:0.5px;">${esc(h)}</th>`
  ).join('')

  const dataRows = lines.map((cols, ri) => {
    const bg = ri % 2 === 0 ? B.bg : B.bgAlt
    const cells = cols.map((v, ci) => {
      if (ci === 0) {
        return `<td style="background:${bg};padding:12px 16px;border-bottom:1px solid ${B.border};">
  <div style="display:flex;align-items:center;gap:12px;">
    ${imgUrl ? `<img src="${imgUrl}" alt="${esc(v)}" style="width:44px;height:44px;object-fit:contain;border-radius:4px;border:1px solid ${B.border};flex-shrink:0;"/>` : `<div style="width:44px;height:44px;background:${B.bgAlt};border-radius:4px;border:1px solid ${B.border};flex-shrink:0;"></div>`}
    <span style="font-size:13px;color:${B.text};font-weight:500;">${esc(v)}</span>
  </div>
</td>`
      }
      return `<td style="background:${bg};padding:12px 16px;font-size:13px;color:${B.text};text-align:center;border-bottom:1px solid ${B.border};border-left:1px solid ${B.border};">${esc(v)}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `<div data-section="option-table" style="background:${B.bg};padding:56px 48px;">
  <h2 style="margin:0 0 28px;font-size:20px;font-weight:700;color:${B.darkNavy};border-left:4px solid ${B.navy};padding-left:12px;">옵션 안내</h2>
  <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid ${B.border};">
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${dataRows}</tbody>
  </table>
</div>`
}

// ── 7. 푸터 ─────────────────────────────────────────────────────────────────
export function renderBFooterSection(data: DetailPageData): string {
  const { brand } = data.productJson
  const footerIcons = [
    { icon: BSVG.pipe, label: '원터치 피팅' },
    { icon: BSVG.check, label: '품질 보증' },
    { icon: BSVG.globe, label: '글로벌 스펙' },
    { icon: BSVG.truck, label: '신속 배송' },
    { icon: BSVG.headphones, label: '기술 지원' },
  ]

  const icons = footerIcons.map(({ icon, label }) =>
    `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
  ${icon.replace('stroke="white"', 'stroke="rgba(255,255,255,0.55)"').replace('width="32"', 'width="24"').replace('height="32"', 'height="24"')}
  <div style="font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:0.5px;">${esc(label)}</div>
</div>`
  ).join('')

  return `<div data-section="footer" style="background:${B.darkNavy};padding:48px;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <div>
      <div style="font-size:20px;font-weight:900;color:#fff;letter-spacing:3px;margin-bottom:6px;">${esc(brand.name)}</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:2px;">${esc(brand.subtitle)}</div>
    </div>
    <div style="font-size:11px;color:rgba(255,255,255,0.3);text-align:right;line-height:1.8;">
      원터치 피팅 전문 브랜드<br/>
      공압 배관 솔루션
    </div>
  </div>
  <div style="display:flex;justify-content:center;gap:56px;margin-bottom:36px;">${icons}</div>
  <div style="text-align:center;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:1px;">
    © ${esc(brand.name)} · PNEUMATIC FITTING SPECIALISTS · ALL RIGHTS RESERVED
  </div>
</div>`
}

// ── B타입 HTML 전체 조합 ─────────────────────────────────────────────────────
export function generateBTypeSections(data: DetailPageData): string {
  return [
    renderBHeroSection(data),
    renderBFeatureBarSection(data),
    renderBSpecDimensionSection(data),
    renderBUsageSection(data),
    renderBCheckBeforeBuySection(data),
    renderBOptionTableSection(data),
    renderBFooterSection(data),
  ].join('')
}
