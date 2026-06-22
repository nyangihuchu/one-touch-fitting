import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  /* 인증 확인 */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json({ error: 'jobId가 필요합니다.' }, { status: 400 })
  }

  /* 작업 조회 */
  const { data: job, error } = await supabase
    .from('card_news_jobs')
    .select('*, my_products(product_name)')
    .eq('id', jobId)
    .single()

  if (error || !job) {
    return NextResponse.json({ error: '작업을 찾을 수 없습니다.' }, { status: 404 })
  }

  /* 본인 작업 여부 확인 */
  if (job.created_by !== user.id) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  if (job.status !== 'done') {
    return NextResponse.json({ error: '아직 생성이 완료되지 않았습니다.' }, { status: 400 })
  }

  const outputUrls = Array.isArray(job.output_urls) ? (job.output_urls as string[]) : []

  if (outputUrls.length === 0) {
    return NextResponse.json({ error: '다운로드할 파일이 없습니다.' }, { status: 400 })
  }

  /* PNG 파일 fetch → ZIP 생성 */
  const zip = new JSZip()
  const productName = (job as { my_products?: { product_name?: string | null } | null }).my_products?.product_name ?? 'product'
  const safeProductName = productName.replace(/[/\\?%*:|"<>]/g, '_')

  const fetchResults = await Promise.allSettled(
    outputUrls.map((url, i) =>
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.arrayBuffer()
        })
        .then((buf) => ({ index: i, buffer: buf }))
    )
  )

  for (const result of fetchResults) {
    if (result.status === 'fulfilled') {
      const { index, buffer } = result.value
      zip.file(`${safeProductName}_${job.template_type}_slide${index + 1}.png`, buffer)
    }
  }

  const zipUint8 = await zip.generateAsync({ type: 'uint8array' })
  const zipArrayBuffer = zipUint8.buffer.slice(
    zipUint8.byteOffset,
    zipUint8.byteOffset + zipUint8.byteLength
  )
  const filename = `${safeProductName}_${job.template_type}.zip`

  return new Response(zipArrayBuffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Length': String(zipUint8.byteLength),
    },
  })
}
