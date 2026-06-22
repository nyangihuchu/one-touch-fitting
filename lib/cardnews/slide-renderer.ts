import type { SlideData, CardNewsProduct, CardNewsTemplateType } from './types'

/* react-dom/server를 사용하지 않고 순수 HTML 문자열로 슬라이드 생성 */

function parseLines(body: string): string[] {
  return body.split('\n').filter(Boolean)
}

function esc(str: string | null | undefined): string {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/* 공통 하단 브랜드 바 */
function brandBar(slideIndex: number, totalSlides: number, brandColor: string, companyName: string): string {
  return `<div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:${brandColor};display:flex;align-items:center;justify-content:space-between;padding:0 48px;">
    <span style="color:#fff;font-size:28px;font-weight:700;letter-spacing:2px;">${esc(companyName)}</span>
    <span style="color:rgba(255,255,255,0.7);font-size:22px;">${slideIndex + 1} / ${totalSlides}</span>
  </div>`
}

/* 공통 CTA 하단 버튼 그룹 */
function ctaButtons(brandColor: string): string {
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    <div style="background:#fff;color:${brandColor};font-size:28px;font-weight:800;padding:16px 48px;border-radius:14px;letter-spacing:1px;">daitem.co.kr</div>
    <div style="background:rgba(255,255,255,0.18);color:#fff;font-size:22px;font-weight:600;padding:12px 32px;border-radius:12px;">카카오채널 · pf.kakao.com/_kxkpsX</div>
    <div style="color:#fff;font-size:22px;font-weight:600;margin-top:8px;">↑ 프로필 링크를 참조하세요</div>
  </div>`
}

/* ─── TYPE A: 문제 해결형 (훅 기반 5슬라이드) ─────────────── */
function slideAContent(slide: SlideData, product: CardNewsProduct, brandColor: string): string {
  const lines = parseLines(slide.body)
  const i = slide.index

  /* Slide 0: 훅(Hook) — 상단 40% 텍스트, 하단 60% 이미지 */
  if (i === 0) {
    const hookLine1 = esc(lines[0] || '이런 고민 있으신가요?')
    const hookLine2 = lines[1] ? `<div style="color:rgba(255,255,255,0.9);font-size:44px;font-weight:700;line-height:1.25;margin-top:8px;">${esc(lines[1])}</div>` : ''
    return `<div style="display:flex;flex-direction:column;width:100%;height:100%;">
      <div style="background:${brandColor};padding:64px 64px 48px;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;">
        <div style="color:rgba(255,255,255,0.75);font-size:24px;font-weight:600;margin-bottom:16px;letter-spacing:1px;">SUPERFIX 공압 피팅</div>
        <div style="color:#fff;font-size:56px;font-weight:800;line-height:1.2;">${hookLine1}</div>
        ${hookLine2}
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:40px;">
        ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:68%;max-height:100%;object-fit:contain;" />` : `<div style="width:320px;height:320px;background:#e2e8f0;border-radius:20px;"></div>`}
      </div>
    </div>`
  }

  /* Slide 1: 문제 공감 */
  if (i === 1) {
    const title = esc(lines[0] || '기존 방법의 한계')
    const desc = esc(lines[1] || '작업 공간 확보가 어렵습니다')
    const problems = lines.slice(2).length > 0 ? lines.slice(2) : ['공간이 좁아 직선 연결이 어려움', '배관 방향 변경 시 재작업 필요', '규격 실수로 인한 누설 위험']
    return `<div style="width:100%;height:100%;background:#111111;display:flex;flex-direction:column;padding:64px 64px;">
      <div style="color:rgba(255,255,255,0.5);font-size:22px;font-weight:500;margin-bottom:20px;letter-spacing:2px;">이런 문제 있으신가요?</div>
      <div style="color:#fff;font-size:50px;font-weight:800;line-height:1.2;margin-bottom:12px;">${title}</div>
      <div style="color:rgba(255,255,255,0.6);font-size:28px;margin-bottom:56px;">${desc}</div>
      <div style="display:flex;flex-direction:column;gap:24px;flex:1;justify-content:center;">
        ${problems.map((p, idx) => `<div style="display:flex;align-items:center;gap:24px;background:rgba(255,255,255,0.06);border-radius:16px;padding:28px 36px;border-left:4px solid rgba(255,255,255,0.2);">
          <div style="width:52px;height:52px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:700;flex-shrink:0;">${idx + 1}</div>
          <span style="color:#e2e8f0;font-size:28px;font-weight:500;">${esc(p)}</span>
        </div>`).join('')}
      </div>
    </div>`
  }

  /* Slide 2: 해결 방법 */
  if (i === 2) {
    const title = esc(lines[0] || `${product.model || '원터치 피팅'}으로 해결`)
    const desc = lines[1] ? `<div style="color:#475569;font-size:26px;margin-bottom:40px;line-height:1.5;">${esc(lines[1])}</div>` : ''
    return `<div style="width:100%;height:100%;background:#fff;display:flex;flex-direction:column;padding:64px 64px;">
      <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">✓ 해결책</div>
      <div style="color:#0f172a;font-size:50px;font-weight:800;line-height:1.2;margin-bottom:16px;">${title}</div>
      ${desc}
      <div style="display:flex;gap:24px;margin-top:auto;padding-top:40px;">
        ${[['모델명', product.model], ['튜브규격', product.tube_spec], ['나사규격', product.thread_spec]].map(([label, val]) => `<div style="flex:1;background:#f8fafc;border-radius:20px;padding:36px 24px;text-align:center;border-top:4px solid ${brandColor};">
          <div style="color:#64748b;font-size:20px;font-weight:500;margin-bottom:12px;">${esc(label)}</div>
          <div style="color:${brandColor};font-size:34px;font-weight:800;">${esc(val)}</div>
        </div>`).join('')}
      </div>
    </div>`
  }

  /* Slide 3: 제품 소개 — 이미지 60% + 텍스트 40% */
  if (i === 3) {
    const features = lines.slice(1).length > 0 ? lines.slice(1) : ['원터치 간편 연결', '완벽한 기밀 성능', '다양한 규격 지원']
    return `<div style="width:100%;height:100%;display:flex;background:#F5F5F5;">
      <div style="width:60%;display:flex;align-items:center;justify-content:center;padding:40px;background:#fff;">
        ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;" />` : `<div style="width:280px;height:280px;background:#e2e8f0;border-radius:16px;"></div>`}
      </div>
      <div style="flex:1;padding:56px 48px 56px 40px;display:flex;flex-direction:column;justify-content:center;">
        <div style="color:#64748b;font-size:20px;margin-bottom:8px;">${esc(product.shape || '원터치 피팅')}</div>
        <div style="color:#0f172a;font-size:44px;font-weight:900;line-height:1.1;margin-bottom:8px;">${esc(product.model || lines[0] || slide.title)}</div>
        <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:40px;">${esc(product.category || '공압 피팅')}</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${features.map((f) => `<div style="display:flex;align-items:center;gap:14px;"><div style="width:8px;height:8px;border-radius:50%;background:${brandColor};flex-shrink:0;"></div><span style="color:#334155;font-size:24px;line-height:1.5;">${esc(f)}</span></div>`).join('')}
        </div>
      </div>
    </div>`
  }

  /* Slide 4: CTA */
  const ctaLine1 = esc(lines[0] || '배관 규격이 고민된다면?')
  const ctaLine2 = esc(lines[1] || '프로필 링크 확인')
  return `<div style="width:100%;height:100%;background:${brandColor};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;text-align:center;">
    <div style="color:rgba(255,255,255,0.7);font-size:22px;font-weight:500;margin-bottom:32px;letter-spacing:2px;">SUPERFIX</div>
    <div style="color:#fff;font-size:52px;font-weight:800;line-height:1.25;margin-bottom:16px;">${ctaLine1}</div>
    <div style="color:rgba(255,255,255,0.85);font-size:32px;font-weight:500;margin-bottom:56px;">${ctaLine2}</div>
    ${ctaButtons(brandColor)}
  </div>`
}

/* ─── TYPE B: 규격 설명형 ─────────────────────────────────── */
function slideBContent(slide: SlideData, product: CardNewsProduct, brandColor: string): string {
  const lines = parseLines(slide.body)
  const i = slide.index

  if (i === 0) {
    return `<div style="display:flex;flex-direction:column;width:100%;height:100%;">
      <div style="background:#0f172a;padding:56px 64px 40px;flex-shrink:0;">
        <div style="color:#fff;font-size:58px;font-weight:900;line-height:1.1;">${esc(product.model || lines[0] || slide.title)}</div>
        <div style="color:#94a3b8;font-size:26px;margin-top:12px;">${esc(product.shape || product.category || '원터치 피팅')}</div>
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f1f5f9;padding:32px;">
        ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:65%;max-height:100%;object-fit:contain;" />` : `<div style="width:260px;height:260px;background:#e2e8f0;border-radius:16px;"></div>`}
      </div>
    </div>`
  }

  if (i === 1) {
    return `<div style="width:100%;height:100%;padding:72px 64px;display:flex;flex-direction:column;justify-content:center;">
      <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">규격 확인</div>
      <div style="color:#0f172a;font-size:46px;font-weight:800;line-height:1.25;margin-bottom:56px;">${esc(lines[0] || slide.title)}</div>
      <table style="width:100%;border-collapse:collapse;font-size:26px;">
        <thead><tr style="background:${brandColor};">
          <th style="color:#fff;padding:20px 28px;text-align:left;font-weight:700;">구분</th>
          <th style="color:#fff;padding:20px 28px;text-align:left;font-weight:700;">규격</th>
          <th style="color:#fff;padding:20px 28px;text-align:left;font-weight:700;">비고</th>
        </tr></thead>
        <tbody>
          <tr style="background:#f8fafc;"><td style="padding:22px 28px;color:#374151;font-weight:600;border-bottom:1px solid #e2e8f0;">튜브 외경</td><td style="padding:22px 28px;color:${brandColor};font-weight:700;border-bottom:1px solid #e2e8f0;">${esc(product.tube_spec)}</td><td style="padding:22px 28px;color:#6b7280;border-bottom:1px solid #e2e8f0;">외경 기준 선택</td></tr>
          <tr style="background:#fff;"><td style="padding:22px 28px;color:#374151;font-weight:600;border-bottom:1px solid #e2e8f0;">나사 규격</td><td style="padding:22px 28px;color:${brandColor};font-weight:700;border-bottom:1px solid #e2e8f0;">${esc(product.thread_spec)}</td><td style="padding:22px 28px;color:#6b7280;border-bottom:1px solid #e2e8f0;">포트 규격 확인</td></tr>
          <tr style="background:#f8fafc;"><td style="padding:22px 28px;color:#374151;font-weight:600;">모델명</td><td style="padding:22px 28px;color:${brandColor};font-weight:700;">${esc(product.model)}</td><td style="padding:22px 28px;color:#6b7280;">${esc(product.shape || '원터치 피팅')}</td></tr>
        </tbody>
      </table>
    </div>`
  }

  if (i === 2) {
    const model = product.model ?? 'PC04-M5'
    return `<div style="width:100%;height:100%;background:#0f172a;padding:64px;display:flex;flex-direction:column;justify-content:center;">
      <div style="color:#94a3b8;font-size:22px;font-weight:500;margin-bottom:16px;letter-spacing:2px;">모델명 읽는 법</div>
      <div style="color:#fff;font-size:44px;font-weight:800;line-height:1.25;margin-bottom:56px;">${esc(lines[0] || slide.title)}</div>
      <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:40px 48px;margin-bottom:40px;">
        <div style="color:${brandColor};font-size:72px;font-weight:900;letter-spacing:8px;margin-bottom:32px;">${esc(model)}</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${[['PC', '원터치 피팅 타입'], ['숫자', `튜브 외경 (${product.tube_spec ?? 'mm'})`], ['끝자리', `나사 규격 (${product.thread_spec ?? ''})`]].map(([label, desc]) => `<div style="display:flex;align-items:center;gap:20px;">
            <div style="background:${brandColor};color:#fff;font-size:18px;font-weight:700;padding:4px 14px;border-radius:6px;flex-shrink:0;min-width:64px;text-align:center;">${esc(label)}</div>
            <span style="color:#cbd5e1;font-size:24px;">→ ${esc(desc)}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>`
  }

  if (i === 3) {
    return `<div style="width:100%;height:100%;background:#f8fafc;padding:64px;display:flex;flex-direction:column;">
      <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">선택 가이드</div>
      <div style="color:#0f172a;font-size:44px;font-weight:800;line-height:1.25;margin-bottom:48px;">${esc(lines[0] || slide.title)}</div>
      <div style="background:#fff;border-radius:20px;padding:40px 48px;box-shadow:0 4px 32px rgba(0,0,0,0.08);margin-bottom:32px;">
        <div style="color:#64748b;font-size:20px;font-weight:500;margin-bottom:20px;">이런 상황이라면?</div>
        ${[['튜브 외경 ' + (product.tube_spec ?? '?'), product.model ?? '-'], ['포트 나사 ' + (product.thread_spec ?? '?'), (product.model ?? '-') + ' 선택']].map(([cond, rec], idx) => `<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 24px;background:${idx % 2 === 0 ? '#f0f9ff' : '#fff'};border-radius:12px;border-left:4px solid ${brandColor};margin-bottom:12px;">
          <span style="color:#374151;font-size:24px;font-weight:500;">${esc(cond)}</span>
          <span style="color:${brandColor};font-size:24px;font-weight:700;">${esc(rec)} ✓</span>
        </div>`).join('')}
      </div>
    </div>`
  }

  const ctaLine1 = esc(lines[0] || '배관 규격이 고민된다면?')
  const ctaLine2 = esc(lines[1] || '프로필 링크 확인')
  return `<div style="width:100%;height:100%;background:${brandColor};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;text-align:center;">
    <div style="color:rgba(255,255,255,0.7);font-size:22px;font-weight:500;margin-bottom:32px;letter-spacing:2px;">SUPERFIX</div>
    <div style="color:#fff;font-size:52px;font-weight:800;line-height:1.25;margin-bottom:16px;">${ctaLine1}</div>
    <div style="color:rgba(255,255,255,0.85);font-size:32px;font-weight:500;margin-bottom:56px;">${ctaLine2}</div>
    ${ctaButtons(brandColor)}
  </div>`
}

/* ─── TYPE C: 제품 소개형 ─────────────────────────────────── */
function slideCContent(slide: SlideData, product: CardNewsProduct, brandColor: string): string {
  const lines = parseLines(slide.body)
  const i = slide.index

  /* Slide 0: 모델명 우선 + 이미지 */
  if (i === 0) {
    const tubeLine = [product.tube_spec, product.thread_spec].filter(Boolean).join(' · ')
    return `<div style="width:100%;height:100%;position:relative;background:#fff;">
      <div style="position:absolute;top:0;right:0;width:520px;height:580px;background:${brandColor};border-radius:0 0 0 100%;opacity:0.08;"></div>
      <div style="position:relative;padding:72px 64px;display:flex;flex-direction:column;height:100%;">
        <div style="color:#0f172a;font-size:58px;font-weight:900;line-height:1.1;margin-bottom:8px;">${esc(product.model || product.product_name || slide.title)}</div>
        <div style="color:#64748b;font-size:26px;margin-bottom:16px;">${esc(product.shape || product.category || '원터치 피팅')}</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:24px 0;">
          ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:72%;max-height:100%;object-fit:contain;" />` : `<div style="width:300px;height:300px;background:#f1f5f9;border-radius:24px;"></div>`}
        </div>
        <div style="color:#94a3b8;font-size:20px;margin-top:16px;">${esc(tubeLine || product.category || '공압 피팅')}</div>
      </div>
    </div>`
  }

  if (i === 1) {
    const features = lines.slice(1).length > 0 ? lines.slice(1) : ['원터치 간편 연결', '완벽한 기밀 성능', '다양한 규격 지원']
    const icons = ['⚡', '🔒', '📐']
    return `<div style="width:100%;height:100%;padding:72px 64px;display:flex;flex-direction:column;">
      <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">핵심 특징</div>
      <div style="color:#0f172a;font-size:46px;font-weight:800;line-height:1.25;margin-bottom:56px;">${esc(lines[0] || slide.title)}</div>
      <div style="display:flex;flex-direction:column;gap:28px;flex:1;justify-content:center;">
        ${features.map((f, idx) => `<div style="display:flex;align-items:center;gap:28px;background:${idx === 0 ? brandColor : '#f8fafc'};border-radius:20px;padding:32px 40px;">
          <div style="width:72px;height:72px;border-radius:16px;background:${idx === 0 ? 'rgba(255,255,255,0.2)' : brandColor};display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0;">${icons[idx]}</div>
          <span style="color:${idx === 0 ? '#fff' : '#0f172a'};font-size:28px;font-weight:700;">${esc(f.replace(/^[①②③]\s*/, ''))}</span>
        </div>`).join('')}
      </div>
    </div>`
  }

  if (i === 2) {
    const specs = [['튜브규격', product.tube_spec], ['나사규격', product.thread_spec], ['형태', product.shape], ['카테고리', product.category]]
    return `<div style="width:100%;height:100%;background:#0f172a;padding:72px 64px;display:flex;flex-direction:column;">
      <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">주요 사양</div>
      <div style="color:#fff;font-size:46px;font-weight:800;line-height:1.25;margin-bottom:48px;">${esc(lines[0] || slide.title)}</div>
      <div style="display:flex;flex-direction:column;border-radius:16px;overflow:hidden;">
        ${specs.map(([label, val], idx) => `<div style="display:flex;align-items:center;background:${idx % 2 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'};padding:24px 36px;">
          <div style="width:180px;color:#94a3b8;font-size:22px;font-weight:500;">${esc(label)}</div>
          <div style="color:#fff;font-size:26px;font-weight:700;">${esc(val)}</div>
        </div>`).join('')}
      </div>
    </div>`
  }

  if (i === 3) {
    const useCases = [['🏭', '자동화 설비', '공압 실린더, 밸브 연결'], ['🔧', '공압 배관', '에어 공급 라인 구성'], ['⚙️', '산업 기계', '각종 공압 기기 연결'], ['🏗️', '생산 현장', '빠른 배관 교체/수정']]
    return `<div style="width:100%;height:100%;background:#f8fafc;padding:64px;display:flex;flex-direction:column;">
      <div style="color:${brandColor};font-size:22px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">활용 사례</div>
      <div style="color:#0f172a;font-size:44px;font-weight:800;line-height:1.25;margin-bottom:48px;">${esc(lines[0] || slide.title)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;flex:1;">
        ${useCases.map(([icon, label, desc]) => `<div style="background:#fff;border-radius:20px;padding:32px 36px;display:flex;align-items:flex-start;gap:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
          <div style="font-size:44px;flex-shrink:0;">${icon}</div>
          <div><div style="color:#0f172a;font-size:24px;font-weight:700;margin-bottom:8px;">${esc(label)}</div><div style="color:#64748b;font-size:20px;">${esc(desc)}</div></div>
        </div>`).join('')}
      </div>
    </div>`
  }

  const ctaLine1 = esc(lines[0] || '배관 규격이 고민된다면?')
  const ctaLine2 = esc(lines[1] || '프로필 링크 확인')
  return `<div style="width:100%;height:100%;background:${brandColor};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;text-align:center;">
    <div style="color:rgba(255,255,255,0.7);font-size:22px;font-weight:500;margin-bottom:32px;letter-spacing:2px;">SUPERFIX</div>
    <div style="color:#fff;font-size:52px;font-weight:800;line-height:1.25;margin-bottom:16px;">${ctaLine1}</div>
    <div style="color:rgba(255,255,255,0.85);font-size:32px;font-weight:500;margin-bottom:56px;">${ctaLine2}</div>
    ${ctaButtons(brandColor)}
  </div>`
}

/**
 * 슬라이드 데이터를 Playwright가 렌더링할 완전한 HTML 문서로 변환한다.
 * react-dom/server를 사용하지 않고 순수 HTML 문자열 템플릿으로 생성.
 */
export function renderSlideToHtml(
  slide: SlideData,
  product: CardNewsProduct,
  templateType: CardNewsTemplateType,
  totalSlides = 5,
  brandColor = '#FF6A00',
  companyName = 'SUPERFIX'
): string {
  const slideContent =
    templateType === 'A'
      ? slideAContent(slide, product, brandColor)
      : templateType === 'B'
        ? slideBContent(slide, product, brandColor)
        : slideCContent(slide, product, brandColor)

  const body = brandBar(slide.index, totalSlides, brandColor, companyName)

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1080px; height: 1350px; overflow: hidden; background: #fff; font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
  </style>
</head>
<body>
  <div style="width:1080px;height:1350px;position:relative;overflow:hidden;background:#fff;font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;">
    <div style="width:100%;height:1270px;position:relative;">${slideContent}</div>
    ${body}
  </div>
</body>
</html>`
}
