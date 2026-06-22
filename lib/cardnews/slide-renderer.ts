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

/* ─── TYPE A: 문제 해결형 ─────────────────────────────────── */
function slideAContent(slide: SlideData, product: CardNewsProduct, brandColor: string): string {
  const lines = parseLines(slide.body)
  const i = slide.index

  if (i === 0) {
    return `<div style="display:flex;flex-direction:column;width:100%;height:100%;">
      <div style="background:${brandColor};padding:60px 64px 40px;flex-shrink:0;">
        <div style="color:#fff;font-size:52px;font-weight:800;line-height:1.2;">${esc(lines[0] || slide.title)}</div>
        ${lines[1] ? `<div style="color:rgba(255,255,255,0.85);font-size:30px;margin-top:16px;line-height:1.4;">${esc(lines[1])}</div>` : ''}
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:32px;">
        ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:70%;max-height:100%;object-fit:contain;" />` : `<div style="width:280px;height:280px;background:#e2e8f0;border-radius:16px;"></div>`}
      </div>
    </div>`
  }

  if (i === 1) {
    const problems = lines.slice(1).length > 0 ? lines.slice(1) : ['복잡한 배관 작업', '누설 걱정', '규격 혼란']
    return `<div style="width:100%;height:100%;background:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;">
      <div style="color:#94a3b8;font-size:22px;font-weight:500;margin-bottom:24px;letter-spacing:2px;">공압 배관의 고민</div>
      <div style="color:#fff;font-size:48px;font-weight:800;text-align:center;line-height:1.3;margin-bottom:64px;">${esc(lines[0] || slide.title)}</div>
      <div style="display:flex;flex-direction:column;gap:24px;width:100%;">
        ${problems.map((p, idx) => `<div style="display:flex;align-items:center;gap:24px;background:rgba(255,255,255,0.07);border-radius:16px;padding:28px 36px;">
          <div style="width:56px;height:56px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;font-weight:700;flex-shrink:0;">${idx + 1}</div>
          <span style="color:#e2e8f0;font-size:28px;font-weight:500;">${esc(p)}</span>
        </div>`).join('')}
      </div>
    </div>`
  }

  if (i === 2) {
    return `<div style="width:100%;height:100%;background:#f0f9ff;display:flex;flex-direction:column;padding:72px 64px;">
      <div style="color:${brandColor};font-size:24px;font-weight:700;margin-bottom:16px;letter-spacing:1px;">✓ 해결책</div>
      <div style="color:#0f172a;font-size:50px;font-weight:800;line-height:1.25;margin-bottom:48px;">${esc(lines[0] || slide.title)}</div>
      <div style="display:flex;gap:24px;margin-bottom:48px;">
        ${[['모델명', product.model], ['튜브규격', product.tube_spec], ['나사규격', product.thread_spec]].map(([label, val]) => `<div style="flex:1;background:#fff;border-radius:16px;padding:32px 24px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="color:#64748b;font-size:20px;font-weight:500;margin-bottom:12px;">${esc(label)}</div>
          <div style="color:${brandColor};font-size:32px;font-weight:800;">${esc(val)}</div>
        </div>`).join('')}
      </div>
      ${lines.slice(1).map((l) => `<div style="color:#475569;font-size:26px;line-height:1.6;">${esc(l)}</div>`).join('')}
    </div>`
  }

  if (i === 3) {
    const features = lines.slice(1).length > 0 ? lines.slice(1) : ['원터치 간편 연결', '완벽한 기밀 성능']
    return `<div style="width:100%;height:100%;display:flex;">
      <div style="width:420px;background:#f8fafc;display:flex;align-items:center;justify-content:center;padding:32px;flex-shrink:0;">
        ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;" />` : `<div style="width:200px;height:200px;background:#e2e8f0;border-radius:12px;"></div>`}
      </div>
      <div style="flex:1;padding:64px 56px;display:flex;flex-direction:column;justify-content:center;">
        <div style="color:#64748b;font-size:20px;margin-bottom:12px;">제품 상세</div>
        <div style="color:#0f172a;font-size:40px;font-weight:800;line-height:1.25;margin-bottom:40px;">${esc(lines[0] || slide.title)}</div>
        <div style="display:flex;flex-direction:column;gap:20px;">
          ${features.map((f) => `<div style="display:flex;align-items:center;gap:16px;"><div style="width:10px;height:10px;border-radius:50%;background:${brandColor};flex-shrink:0;"></div><span style="color:#334155;font-size:26px;line-height:1.5;">${esc(f)}</span></div>`).join('')}
        </div>
      </div>
    </div>`
  }

  /* slide 4: CTA */
  return `<div style="width:100%;height:100%;background:${brandColor};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;text-align:center;">
    <div style="color:rgba(255,255,255,0.7);font-size:24px;font-weight:500;margin-bottom:32px;letter-spacing:2px;">SUPERFIX 공압 부품 전문몰</div>
    ${(lines.length > 0 ? lines : [slide.title]).map((l, idx) => `<div style="color:#fff;font-size:${idx === 0 ? 52 : 36}px;font-weight:${idx === 0 ? 800 : 500};line-height:1.3;margin-bottom:${idx === 0 ? 24 : 12}px;">${esc(l)}</div>`).join('')}
    <div style="margin-top:48px;display:flex;flex-direction:column;align-items:center;gap:16px;">
      <div style="background:#fff;color:${brandColor};font-size:26px;font-weight:800;padding:14px 40px;border-radius:12px;letter-spacing:1px;">daitem.co.kr</div>
      <div style="background:rgba(255,255,255,0.18);color:#fff;font-size:22px;font-weight:600;padding:12px 32px;border-radius:12px;">카카오채널 · pf.kakao.com/_kxkpsX</div>
      <div style="color:#fff;font-size:22px;font-weight:600;margin-top:8px;">↑ 프로필 링크를 참조하세요</div>
    </div>
  </div>`
}

/* ─── TYPE B: 규격 설명형 ─────────────────────────────────── */
function slideBContent(slide: SlideData, product: CardNewsProduct, brandColor: string): string {
  const lines = parseLines(slide.body)
  const i = slide.index

  if (i === 0) {
    return `<div style="display:flex;flex-direction:column;width:100%;height:100%;">
      <div style="background:#0f172a;padding:56px 64px 40px;flex-shrink:0;">
        <div style="color:#fff;font-size:50px;font-weight:800;line-height:1.25;">${esc(lines[0] || slide.title)}</div>
        ${lines[1] ? `<div style="color:#94a3b8;font-size:26px;margin-top:16px;">${esc(lines[1])}</div>` : ''}
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

  return `<div style="width:100%;height:100%;background:linear-gradient(135deg,${brandColor} 0%,#1e40af 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;text-align:center;">
    <div style="width:80px;height:80px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:40px;">🔧</div>
    ${(lines.length > 0 ? lines : [slide.title]).map((l, idx) => `<div style="color:#fff;font-size:${idx === 0 ? 48 : 30}px;font-weight:${idx === 0 ? 800 : 400};line-height:1.35;margin-bottom:${idx === 0 ? 20 : 10}px;">${esc(l)}</div>`).join('')}
    <div style="margin-top:48px;display:flex;flex-direction:column;align-items:center;gap:16px;">
      <div style="background:#fff;color:${brandColor};font-size:26px;font-weight:800;padding:14px 40px;border-radius:12px;letter-spacing:1px;">daitem.co.kr</div>
      <div style="background:rgba(255,255,255,0.18);color:#fff;font-size:22px;font-weight:600;padding:12px 32px;border-radius:12px;">카카오채널 · pf.kakao.com/_kxkpsX</div>
      <div style="color:#fff;font-size:22px;font-weight:600;margin-top:8px;">↑ 프로필 링크를 참조하세요</div>
    </div>
  </div>`
}

/* ─── TYPE C: 제품 소개형 ─────────────────────────────────── */
function slideCContent(slide: SlideData, product: CardNewsProduct, brandColor: string): string {
  const lines = parseLines(slide.body)
  const i = slide.index

  if (i === 0) {
    return `<div style="width:100%;height:100%;position:relative;background:#fff;">
      <div style="position:absolute;top:0;right:0;width:520px;height:520px;background:${brandColor};border-radius:0 0 0 100%;opacity:0.08;"></div>
      <div style="position:relative;padding:72px 64px;display:flex;flex-direction:column;height:100%;">
        <div style="color:#0f172a;font-size:52px;font-weight:800;line-height:1.2;margin-bottom:16px;">${esc(lines[0] || product.product_name || slide.title)}</div>
        ${lines[1] ? `<div style="color:#64748b;font-size:26px;margin-bottom:16px;">${esc(lines[1])}</div>` : ''}
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px 0;">
          ${product.image_path ? `<img src="${esc(product.image_path)}" alt="" style="max-width:72%;max-height:100%;object-fit:contain;" />` : `<div style="width:300px;height:300px;background:#f1f5f9;border-radius:24px;"></div>`}
        </div>
        <div style="color:#94a3b8;font-size:20px;margin-top:16px;">${esc(product.model ?? '')} · ${esc(product.category ?? '공압 피팅')}</div>
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

  return `<div style="width:100%;height:100%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 64px;text-align:center;position:relative;overflow:hidden;">
    <div style="position:absolute;top:-120px;right:-120px;width:400px;height:400px;background:${brandColor};border-radius:50%;opacity:0.08;"></div>
    <div style="position:absolute;bottom:-80px;left:-80px;width:300px;height:300px;background:${brandColor};border-radius:50%;opacity:0.06;"></div>
    <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;">
      <div style="width:100px;height:100px;background:${brandColor};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:48px;margin-bottom:40px;">🛒</div>
      ${(lines.length > 0 ? lines : [slide.title]).map((l, idx) => `<div style="color:${idx === 0 ? '#0f172a' : '#64748b'};font-size:${idx === 0 ? 48 : 28}px;font-weight:${idx === 0 ? 800 : 400};line-height:1.35;margin-bottom:${idx === 0 ? 16 : 8}px;">${esc(l)}</div>`).join('')}
      <div style="margin-top:48px;display:flex;flex-direction:column;align-items:center;gap:16px;">
        <div style="background:${brandColor};color:#fff;font-size:26px;font-weight:800;padding:14px 40px;border-radius:12px;letter-spacing:1px;">daitem.co.kr</div>
        <div style="border:2px solid ${brandColor};color:${brandColor};font-size:22px;font-weight:600;padding:12px 32px;border-radius:12px;">카카오채널 · pf.kakao.com/_kxkpsX</div>
        <div style="color:#1e293b;font-size:22px;font-weight:600;margin-top:8px;">↑ 프로필 링크를 참조하세요</div>
      </div>
    </div>
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
  brandColor = '#1D4ED8',
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
    html, body { width: 1080px; height: 1080px; overflow: hidden; background: #fff; font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
  </style>
</head>
<body>
  <div style="width:1080px;height:1080px;position:relative;overflow:hidden;background:#fff;font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;">
    <div style="width:100%;height:1000px;position:relative;">${slideContent}</div>
    ${body}
  </div>
</body>
</html>`
}
