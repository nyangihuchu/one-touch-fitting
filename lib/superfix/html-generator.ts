import type { DetailPageData } from '@/lib/superfix/types'
import {
  renderHeroSection,
  renderFeaturesSection,
  renderSpecificationSection,
  renderUsageSection,
  renderCheckBeforeBuySection,
  renderOptionTableSection,
  renderFooterSection,
} from '@/lib/superfix/templates/detail-page'
import { generateBTypeSections } from '@/lib/superfix/templates/detail-page-b'

export interface GenerateOptions {
  embedImages?: boolean
  templateType?: 'A' | 'B'
}

export async function generateDetailPageHTML(
  data: DetailPageData,
  options: GenerateOptions = {}
): Promise<string> {
  const { templateType = 'A' } = options

  const sections = templateType === 'B'
    ? generateBTypeSections(data)
    : [
        renderHeroSection(data),
        renderFeaturesSection(data),
        renderSpecificationSection(data),
        renderUsageSection(data),
        renderCheckBeforeBuySection(data),
        renderOptionTableSection(data),
        renderFooterSection(data),
      ].join('')

  let html = wrapDocument(sections)

  if (options.embedImages) {
    html = await embedImagesAsBase64(html)
  }

  return html
}

function wrapDocument(body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=860" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0 auto;
      max-width: 860px;
      font-family: 'Nanum Gothic', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
      color: #333333;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    ul, ol { margin: 0; padding: 0; }
  </style>
</head>
<body>${body}</body>
</html>`
}

async function embedImagesAsBase64(html: string): Promise<string> {
  const imgSrcRegex = /<img([^>]*?)src="(https?:\/\/[^"]+)"([^>]*?)>/gi
  const matches: { full: string; src: string }[] = []

  let match: RegExpExecArray | null
  while ((match = imgSrcRegex.exec(html)) !== null) {
    matches.push({ full: match[0], src: match[2] })
  }

  for (const { full, src } of matches) {
    try {
      const res = await fetch(src)
      if (!res.ok) continue
      const buffer = await res.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const contentType = res.headers.get('content-type') ?? 'image/jpeg'
      const dataUrl = `data:${contentType};base64,${base64}`
      html = html.replace(full, full.replace(src, dataUrl))
    } catch {
      // 실패 시 원본 URL 유지
    }
  }

  return html
}
