import type { DetailPageData } from '@/lib/superfix/types'

const C = {
  navy: '#0D1B3E',
  navyMid: '#1B2A4A',
  orange: '#FF6B00',
  gray: '#F8F9FA',
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
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

// src 속성에만 사용 — javascript: 프로토콜 차단
function safeUrl(url: string | undefined | null): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return esc(trimmed)
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) return esc(trimmed)
  return ''
}

function sec(bg: string, content: string, dataSection = ''): string {
  const attr = dataSection ? ` data-section="${dataSection}"` : ''
  return `<div${attr} style="background:${bg};padding:56px 48px;">${content}</div>`
}

function sectionTitle(text: string): string {
  return `<h2 style="margin:0 0 32px;font-size:20px;font-weight:700;color:${C.navy};letter-spacing:-0.3px;border-left:4px solid ${C.orange};padding-left:12px;">${esc(text)}</h2>`
}

// 원터치 피팅 단면 치수도 SVG — tubeSize/threadSize 값을 치수선과 함께 표시
function renderFittingDiagramSVG(tubeSize: string, threadSize: string): string {
  const uid = Math.random().toString(36).slice(2, 8)
  const threadLines = Array.from({ length: 16 }, (_, i) =>
    `<line x1="${14 + i * 12}" y1="206" x2="${66 + i * 12}" y2="154" stroke="#6B7280" stroke-width="1" opacity="0.55"/>`
  ).join('')

  return `<svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-height:216px;display:block;">
  <defs>
    <clipPath id="tc-${uid}"><rect x="66" y="154" width="128" height="52"/></clipPath>
    <marker id="arl-${uid}" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
      <path d="M6,0 L0,3 L6,6" fill="none" stroke="#FF6B00" stroke-width="1.5"/>
    </marker>
    <marker id="arr-${uid}" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6" fill="none" stroke="#FF6B00" stroke-width="1.5"/>
    </marker>
  </defs>
  <!-- 클램프 링 -->
  <rect x="82" y="32" width="96" height="26" fill="#9AA3AE" stroke="#1F2937" stroke-width="1.5" rx="1"/>
  <rect x="82" y="32" width="96" height="9" fill="#7A838E" stroke="none" rx="1"/>
  <path d="M110,58 L113,52 L116,58" fill="none" stroke="#5A636E" stroke-width="1"/>
  <path d="M144,58 L147,52 L150,58" fill="none" stroke="#5A636E" stroke-width="1"/>
  <!-- 피팅 바디 -->
  <rect x="82" y="58" width="96" height="96" fill="#C8D0D9" stroke="#1F2937" stroke-width="1.5"/>
  <rect x="82" y="58" width="96" height="18" fill="#D6DCE4" stroke="none"/>
  <line x1="82" y1="94" x2="178" y2="94" stroke="#8B9299" stroke-width="2.5"/>
  <line x1="82" y1="99" x2="178" y2="99" stroke="#8B9299" stroke-width="2.5"/>
  <text x="130" y="128" text-anchor="middle" font-size="8" fill="#8B9299" font-family="Arial,sans-serif" letter-spacing="3" font-weight="600">SUPERFIX</text>
  <rect x="82" y="142" width="96" height="12" fill="#B8C0C9" stroke="none"/>
  <!-- 나사부 -->
  <rect x="66" y="154" width="128" height="52" fill="#BDC5CE" stroke="#1F2937" stroke-width="1.5"/>
  <g clip-path="url(#tc-${uid})">${threadLines}</g>
  <line x1="66" y1="154" x2="194" y2="154" stroke="#1F2937" stroke-width="2"/>
  <!-- 치수선: 상단 D (튜브 외경) -->
  <line x1="82" y1="22" x2="82" y2="32" stroke="#FF6B00" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="178" y1="22" x2="178" y2="32" stroke="#FF6B00" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="84" y1="16" x2="176" y2="16" stroke="#FF6B00" stroke-width="1.5" marker-start="url(#arl-${uid})" marker-end="url(#arr-${uid})"/>
  ${tubeSize ? `<text x="130" y="9" text-anchor="middle" font-size="10" fill="#FF6B00" font-weight="700" font-family="Arial,sans-serif">D = ${esc(tubeSize)}</text>` : ''}
  <!-- 치수선: 하단 (나사 규격) -->
  <line x1="66" y1="214" x2="66" y2="219" stroke="#FF6B00" stroke-width="1"/>
  <line x1="194" y1="214" x2="194" y2="219" stroke="#FF6B00" stroke-width="1"/>
  <line x1="66" y1="216" x2="194" y2="216" stroke="#FF6B00" stroke-width="1.5"/>
  ${threadSize ? `<text x="130" y="233" text-anchor="middle" font-size="11" fill="#FF6B00" font-weight="700" font-family="Arial,sans-serif">${esc(threadSize)}</text>` : ''}
  <text x="130" y="247" text-anchor="middle" font-size="8.5" fill="#6B7280" font-family="Arial,sans-serif">나사 규격</text>
  <!-- 좌측 부위 라벨 -->
  <text x="44" y="45" text-anchor="middle" font-size="7.5" fill="#9AA3AE" font-family="Arial,sans-serif" transform="rotate(-90,44,45)">CLAMP</text>
  <text x="44" y="106" text-anchor="middle" font-size="7.5" fill="#9AA3AE" font-family="Arial,sans-serif" transform="rotate(-90,44,106)">BODY</text>
  <text x="44" y="180" text-anchor="middle" font-size="7.5" fill="#9AA3AE" font-family="Arial,sans-serif" transform="rotate(-90,44,180)">THREAD</text>
</svg>`
}

const SVG = {
  ruler: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>`,
  shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
  zap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  cog: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  cylinder: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
  valve: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="m4.93 4.93 2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  airgun: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h12l2 5H4z"/><path d="M4 14v4h5v-4"/><path d="M16 14l4 4"/><line x1="2" y1="9" x2="4" y2="9"/><circle cx="6" cy="20" r="1"/></svg>`,
  compressor: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M12 14V9"/><circle cx="12" cy="7" r="2"/><path d="M7 9h10"/><path d="M6 21v1M18 21v1"/></svg>`,
  automation: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/><line x1="3" y1="22" x2="21" y2="22"/></svg>`,
}

export function renderHeroSection(data: DetailPageData): string {
  const { brand, product } = data.productJson

  const imgUrl = safeUrl(product.mainImage)
  const imgHtml = imgUrl
    ? `<img src="${imgUrl}" alt="${esc(product.title)}" style="max-width:260px;max-height:260px;object-fit:contain;display:block;margin:0 auto;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.35));" />`
    : `<div style="width:220px;height:220px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto;"><span style="color:rgba(255,255,255,0.2);font-size:11px;letter-spacing:2px;">NO IMAGE</span></div>`

  const specLine = [
    product.tubeSize && `${esc(product.tubeSize)} 튜브`,
    product.threadSize && `${esc(product.threadSize)} 나사`,
  ].filter(Boolean).join(' · ')

  return `<div data-section="hero" style="background:linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%);padding:0;">
  <div style="padding:18px 48px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:3px;height:22px;background:${C.orange};border-radius:2px;"></div>
      <span style="color:${C.white};font-size:17px;font-weight:900;letter-spacing:3px;">${esc(brand.name)}</span>
      <span style="color:rgba(255,255,255,0.3);font-size:9px;letter-spacing:3px;margin-top:1px;">${esc(brand.subtitle)}</span>
    </div>
    ${product.category ? `<span style="color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:1px;background:rgba(255,255,255,0.05);padding:4px 12px;border-radius:20px;">${esc(product.category)}</span>` : ''}
  </div>
  <div style="padding:44px 48px 52px;display:flex;align-items:center;gap:48px;">
    <div style="flex:1;min-width:0;">
      ${product.type ? `<div style="display:inline-block;background:${C.orange};color:${C.white};font-size:10px;font-weight:700;letter-spacing:3px;padding:5px 12px;border-radius:2px;margin-bottom:20px;">${esc(product.type)}</div>` : ''}
      <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:${C.white};line-height:1.35;letter-spacing:-0.5px;">${esc(product.title)}</h1>
      <div style="font-size:22px;font-weight:900;color:${C.orange};letter-spacing:2px;margin-bottom:${specLine ? '8px' : '24px'};font-family:monospace;">${esc(product.model)}</div>
      ${specLine ? `<div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:24px;letter-spacing:0.5px;">${specLine}</div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${product.tubeSize ? `<span style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:rgba(255,255,255,0.8);font-size:12px;padding:6px 14px;border-radius:4px;">튜브 ${esc(product.tubeSize)}</span>` : ''}
        ${product.threadSize ? `<span style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:rgba(255,255,255,0.8);font-size:12px;padding:6px 14px;border-radius:4px;">나사 ${esc(product.threadSize)}</span>` : ''}
        ${product.recommendedUse ? `<span style="background:rgba(255,107,0,0.15);border:1px solid rgba(255,107,0,0.3);color:${C.orange};font-size:12px;padding:6px 14px;border-radius:4px;">${esc(product.recommendedUse)}</span>` : ''}
      </div>
    </div>
    <div style="flex-shrink:0;width:290px;height:290px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.07);">
      ${imgHtml}
    </div>
  </div>
</div>`
}

export function renderFeaturesSection(data: DetailPageData): string {
  const { features } = data.aiContent
  const iconKeys = ['ruler', 'shield', 'zap', 'cog'] as const

  const cards = features.slice(0, 4).map((f, i) => {
    const icon = SVG[iconKeys[i] ?? 'cog']
    return `<div style="background:${C.white};border-radius:8px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid ${C.border};">
  <div style="display:flex;align-items:flex-start;gap:16px;">
    <div style="width:44px;height:44px;background:${C.navy};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${C.white};">${icon}</div>
    <p style="margin:0;padding-top:10px;font-size:13px;color:${C.text};line-height:1.75;">${esc(f)}</p>
  </div>
</div>`
  }).join('')

  return sec(C.gray, `${sectionTitle('제품 특징')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">${cards}</div>`, 'features')
}

export function renderSpecificationSection(data: DetailPageData): string {
  const { product } = data.productJson
  const rows: [string, string][] = [
    ['모델명', product.model],
    ['형태', product.type],
    ['튜브 규격', product.tubeSize],
    ['나사 규격', product.threadSize],
    ['추천 용도', product.recommendedUse],
    ['카테고리', product.category],
  ].filter(([, v]) => v) as [string, string][]

  const tableRows = rows.map(([k, v], i) => {
    const bg = i % 2 === 0 ? C.white : C.gray
    return `<tr>
  <td style="background:${C.navy};color:${C.white};font-size:12px;font-weight:600;padding:11px 16px;width:120px;letter-spacing:0.3px;white-space:nowrap;">${esc(k)}</td>
  <td style="background:${bg};color:${C.text};font-size:13px;padding:11px 16px;font-weight:500;">${esc(v)}</td>
</tr>`
  }).join('')

  const hasDimension = !!(product.tubeSize || product.threadSize)
  const imgUrl = safeUrl(product.mainImage)

  // 외형 치수도 오버레이: 실사 사진 + SVG 치수선
  function buildDimensionOverlay(): string {
    const tube = product.tubeSize ? `Ø${esc(product.tubeSize)}` : ''
    const thread = product.threadSize ? esc(product.threadSize) : ''
    const imageBlock = imgUrl
      ? `<img src="${imgUrl}" alt="외형 치수도" style="position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;object-fit:contain;"/>`
      : `<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:${C.textLight};">이미지 없음</div>`
    const topAnno = tube ? `
      <line x1="152" y1="24" x2="152" y2="45" stroke="${C.text}" stroke-width="1"/>
      <line x1="248" y1="24" x2="248" y2="45" stroke="${C.text}" stroke-width="1"/>
      <line x1="164" y1="35" x2="236" y2="35" stroke="${C.text}" stroke-width="1.5"/>
      <polygon points="152,35 165,29 165,41" fill="${C.text}"/>
      <polygon points="248,35 235,29 235,41" fill="${C.text}"/>
      <rect x="155" y="6" width="90" height="18" fill="white" fill-opacity="0.88"/>
      <text x="200" y="19" text-anchor="middle" font-size="14" font-weight="700" font-family="Arial,sans-serif" fill="${C.text}">${tube}</text>` : ''
    const botAnno = thread ? `
      <line x1="120" y1="240" x2="120" y2="261" stroke="${C.text}" stroke-width="1"/>
      <line x1="280" y1="240" x2="280" y2="261" stroke="${C.text}" stroke-width="1"/>
      <line x1="133" y1="251" x2="267" y2="251" stroke="${C.text}" stroke-width="1.5"/>
      <polygon points="120,251 133,245 133,257" fill="${C.text}"/>
      <polygon points="280,251 267,245 267,257" fill="${C.text}"/>
      <rect x="130" y="264" width="140" height="18" fill="white" fill-opacity="0.88"/>
      <text x="200" y="277" text-anchor="middle" font-size="14" font-weight="700" font-family="Arial,sans-serif" fill="${C.text}">${thread}</text>` : ''
    return `<div style="position:relative;width:100%;height:290px;background:#fff;overflow:hidden;">
  ${imageBlock}
  <svg style="position:absolute;top:0;left:0;width:100%;height:100%;" viewBox="0 0 400 290" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    ${topAnno}${botAnno}
    <text x="392" y="287" text-anchor="end" font-size="9" fill="${C.textLight}" font-family="Arial,sans-serif">단위 : mm</text>
  </svg>
</div>`
  }

  let dimensionPanel: string
  if (hasDimension) {
    if (imgUrl) {
      // 실사 사진 + 치수선 오버레이
      dimensionPanel = `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};overflow:hidden;display:flex;flex-direction:column;">
    <div style="background:${C.navy};padding:11px 16px;">
      <span style="color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:2px;font-weight:700;">외형 치수도</span>
    </div>
    ${buildDimensionOverlay()}
    <div style="padding:10px 16px;background:${C.gray};border-top:1px solid ${C.border};display:flex;justify-content:center;gap:24px;">
      ${product.tubeSize ? `<span style="font-size:11px;color:${C.textLight};">튜브 <strong style="color:${C.navy};font-weight:700;">${esc(product.tubeSize)}</strong></span>` : ''}
      ${product.threadSize ? `<span style="font-size:11px;color:${C.textLight};">나사 <strong style="color:${C.navy};font-weight:700;">${esc(product.threadSize)}</strong></span>` : ''}
    </div>
  </div>`
    } else {
      // 이미지 없으면 SVG 단면도 폴백
      dimensionPanel = `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};overflow:hidden;display:flex;flex-direction:column;">
    <div style="background:${C.navy};padding:11px 16px;">
      <span style="color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:2px;font-weight:700;">외형 치수도</span>
    </div>
    <div style="flex:1;padding:12px 16px;display:flex;align-items:center;justify-content:center;">
      ${renderFittingDiagramSVG(product.tubeSize || '', product.threadSize || '')}
    </div>
    <div style="padding:10px 16px;background:${C.gray};border-top:1px solid ${C.border};display:flex;justify-content:center;gap:24px;">
      ${product.tubeSize ? `<span style="font-size:11px;color:${C.textLight};">튜브 <strong style="color:${C.navy};font-weight:700;">${esc(product.tubeSize)}</strong></span>` : ''}
      ${product.threadSize ? `<span style="font-size:11px;color:${C.textLight};">나사 <strong style="color:${C.navy};font-weight:700;">${esc(product.threadSize)}</strong></span>` : ''}
    </div>
  </div>`
    }
  } else if (imgUrl) {
    // 규격 없고 이미지 있으면 제품 이미지 표시
    dimensionPanel = `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};overflow:hidden;display:flex;flex-direction:column;">
    <div style="background:${C.navy};padding:11px 16px;">
      <span style="color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:2px;font-weight:700;">PRODUCT VIEW</span>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:28px 20px;">
      <img src="${imgUrl}" alt="${esc(product.title)}" style="max-width:100%;max-height:190px;object-fit:contain;display:block;" />
    </div>
  </div>`
  } else {
    // 둘 다 없으면 모델 정보 카드
    dimensionPanel = `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};display:flex;flex-direction:column;">
    <div style="background:${C.navy};padding:11px 16px;">
      <span style="color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:2px;font-weight:700;">SPECIFICATIONS</span>
    </div>
    <div style="padding:24px;display:flex;flex-direction:column;gap:10px;">
      ${product.model ? `<div style="padding:12px 16px;background:${C.navy};border-radius:6px;"><span style="font-size:10px;color:rgba(255,255,255,0.4);display:block;margin-bottom:4px;letter-spacing:1px;">MODEL</span><span style="font-size:15px;font-weight:700;color:${C.orange};font-family:monospace;">${esc(product.model)}</span></div>` : ''}
    </div>
  </div>`
  }

  return `<div data-section="specification" style="background:${C.white};padding:56px 48px;">
  ${sectionTitle('제품 규격 · 치수도')}
  <div style="display:grid;grid-template-columns:55fr 45fr;gap:24px;align-items:start;">
    <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid ${C.border};">
      <tbody>${tableRows}</tbody>
    </table>
    ${dimensionPanel}
  </div>
</div>`
}

// 외형 치수도는 renderSpecificationSection 우측 패널에 통합됨
export function renderDimensionSection(_data: DetailPageData): string {
  return ''
}

export function renderUsageSection(data: DetailPageData): string {
  const imgUrl = safeUrl(data.usageImageUrl)
  if (imgUrl) {
    return sec(C.gray, `${sectionTitle('다양한 사용 분야')}<img src="${imgUrl}" alt="사용예시" style="width:100%;height:auto;border-radius:8px;display:block;" />`, 'usage')
  }

  const usageItems = [
    { icon: SVG.cylinder, name: '실린더 연결', desc: '에어 실린더 입·출력 포트 연결' },
    { icon: SVG.valve, name: '솔레노이드 밸브', desc: '공압 솔레노이드 밸브 배관 연결' },
    { icon: SVG.airgun, name: '에어건 연결', desc: '에어건 및 공압 공구 퀵 연결' },
    { icon: SVG.compressor, name: '콤프레샤 연결', desc: '콤프레샤 배관 및 에어 공급' },
    { icon: SVG.automation, name: '자동화 설비', desc: 'FA 자동화 설비 공압 시스템' },
  ]

  const cards = usageItems.map(({ icon, name, desc }) =>
    `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};padding:24px 12px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
  <div style="width:54px;height:54px;background:${C.navy};border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:${C.white};">${icon}</div>
  <div style="font-size:12px;font-weight:700;color:${C.navy};margin-bottom:6px;">${name}</div>
  <div style="font-size:11px;color:${C.textLight};line-height:1.6;">${desc}</div>
</div>`
  ).join('')

  return sec(C.gray, `${sectionTitle('다양한 사용 분야')}
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;">${cards}</div>`, 'usage')
}

export function renderCheckBeforeBuySection(data: DetailPageData): string {
  const { checkBeforeBuy } = data.aiContent
  const mainItems = checkBeforeBuy.slice(0, 2)
  const extraItems = checkBeforeBuy.slice(2)

  const cards = mainItems.map((item) =>
    `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};padding:28px 24px;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
    <span style="color:${C.orange};">${SVG.warning}</span>
    <span style="font-size:11px;font-weight:700;color:${C.orange};letter-spacing:1px;">확인필수</span>
  </div>
  <p style="margin:0;font-size:13px;color:${C.text};line-height:1.8;">${esc(item)}</p>
</div>`
  ).join('')

  const extra = extraItems.length > 0
    ? `<div style="margin-top:14px;padding:14px 20px;background:${C.white};border-radius:8px;border:1px solid ${C.border};">
    ${extraItems.map((item) =>
      `<div style="font-size:12px;color:${C.textLight};padding:7px 0;border-bottom:1px solid ${C.border};line-height:1.6;display:flex;gap:8px;align-items:flex-start;">
        <span style="color:${C.orange};flex-shrink:0;font-weight:700;">›</span>${esc(item)}
      </div>`
    ).join('')}
  </div>`
    : ''

  return sec(C.gray, `${sectionTitle('구매 전 확인사항')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">${cards}</div>${extra}`, 'check-before-buy')
}

function parseOptionLines(raw: string): string[][] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      // 탭 우선, 없으면 ' / ' 또는 '/' 구분
      if (line.includes('\t')) return line.split('\t').map((p) => p.trim())
      return line.split(/\s*\/\s*/).map((p) => p.trim())
    })
}

const OPTION_HEADERS = ['옵션명', '모델명', '튜브 외경', '나사 규격']

export function renderOptionTableSection(data: DetailPageData): string {
  const { options } = data.productJson.product

  if (!options || options.trim() === '') {
    return `<div data-section="option-table" style="background:${C.white};padding:56px 48px;">
  ${sectionTitle('옵션 정보')}
  <div style="background:${C.gray};border-radius:8px;padding:24px;text-align:center;border:1px solid ${C.border};">
    <p style="margin:0;font-size:13px;color:${C.textLight};">옵션 정보가 없습니다.</p>
  </div>
</div>`
  }

  const parsed = parseOptionLines(options)
  const hasMultiCols = parsed.some((p) => p.length >= 2)

  let tableContent: string
  if (hasMultiCols) {
    const maxCols = Math.min(Math.max(...parsed.map((p) => p.length)), OPTION_HEADERS.length)
    const headerCells = OPTION_HEADERS.slice(0, maxCols)
      .map((h) => `<th style="color:${C.white};font-size:12px;font-weight:600;padding:12px 16px;text-align:left;letter-spacing:0.5px;">${h}</th>`)
      .join('')

    const dataRows = parsed.map((cols, i) => {
      const bg = i % 2 === 0 ? C.white : C.gray
      const cells = Array.from({ length: maxCols }, (_, ci) => {
        const val = esc(cols[ci] ?? '—')
        const isFirst = ci === 0
        return `<td style="font-size:13px;color:${isFirst ? C.navy : C.text};font-weight:${isFirst ? '600' : '400'};padding:11px 16px;border-bottom:1px solid ${C.border};">${val}</td>`
      }).join('')
      return `<tr style="background:${bg};">${cells}</tr>`
    }).join('')

    tableContent = `<div style="overflow-x:auto;border-radius:8px;border:1px solid ${C.border};box-shadow:0 1px 4px rgba(0,0,0,0.06);">
  <table style="width:100%;border-collapse:collapse;min-width:480px;">
    <thead><tr style="background:${C.navy};">${headerCells}</tr></thead>
    <tbody>${dataRows}</tbody>
  </table>
</div>`
  } else {
    const listItems = parsed
      .map((cols) => `<li style="font-size:13px;color:${C.text};padding:8px 0;border-bottom:1px solid ${C.border};line-height:1.6;">${esc(cols[0] ?? '')}</li>`)
      .join('')
    tableContent = `<div style="background:${C.white};border-radius:8px;border:1px solid ${C.border};padding:4px 20px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
  <ul style="margin:0;padding:0;list-style:none;">${listItems}</ul>
</div>`
  }

  return `<div data-section="option-table" style="background:${C.white};padding:56px 48px;">
  ${sectionTitle('옵션 정보')}${tableContent}
</div>`
}

export function renderFooterSection(data: DetailPageData): string {
  const { brand } = data.productJson
  return `<div data-section="footer" style="background:${C.navy};padding:0;">
  <div style="height:3px;background:${C.orange};"></div>
  <div style="padding:32px 48px;display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:3px;height:34px;background:${C.orange};border-radius:2px;"></div>
      <div>
        <div style="color:${C.white};font-size:19px;font-weight:900;letter-spacing:4px;line-height:1;">${esc(brand.name)}</div>
        <div style="color:rgba(255,255,255,0.3);font-size:9px;letter-spacing:3px;margin-top:5px;">${esc(brand.subtitle)}</div>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="color:rgba(255,255,255,0.25);font-size:11px;">© ${esc(brand.name)}. All rights reserved.</div>
      <div style="color:rgba(255,255,255,0.15);font-size:10px;margin-top:4px;letter-spacing:1px;">PNEUMATIC FITTING SPECIALISTS</div>
    </div>
  </div>
</div>`
}
