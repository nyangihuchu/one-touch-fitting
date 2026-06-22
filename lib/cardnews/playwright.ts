import { chromium } from 'playwright'

/**
 * HTML 문자열 배열을 순차적으로 PNG Buffer로 변환한다.
 * Playwright headless Chromium 사용, 뷰포트 1080×1350 고정.
 */
export async function renderSlidesToPng(htmlStrings: string[]): Promise<Buffer[]> {
  const browser = await chromium.launch({ headless: true })
  const results: Buffer[] = []

  try {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1080, height: 1350 })

    for (const html of htmlStrings) {
      await page.setContent(html, { waitUntil: 'networkidle', timeout: 15000 })
      const screenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } })
      results.push(Buffer.from(screenshot))
    }
  } finally {
    await browser.close()
  }

  return results
}
