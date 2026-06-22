import { NextResponse } from 'next/server'
import { createClient as createBrowserlessClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { renderSlideToHtml } from '@/lib/cardnews/slide-renderer'
import { renderSlidesToPng } from '@/lib/cardnews/playwright'
import type { SlideData, CardNewsProduct, CardNewsTemplateType } from '@/lib/cardnews/types'

/* Vercel 등 서버리스 환경에서 최대 실행 시간 60초 허용 */
export const maxDuration = 60

/* 서비스 롤 클라이언트 — Storage 버킷 생성 및 파일 업로드에 사용 */
function createServiceClient() {
  return createBrowserlessClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BUCKET = 'card-news'

interface RenderBody {
  productId: number
  templateType: CardNewsTemplateType
  slideCopies: SlideData[]
}

export async function POST(request: Request) {
  /* 인증 확인 */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  let body: RenderBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { productId, templateType, slideCopies } = body

  if (!productId || !templateType || !slideCopies?.length) {
    return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 })
  }

  /* 제품 정보 서버에서 직접 조회 */
  const { data: product, error: productError } = await supabase
    .from('my_products')
    .select('id, product_name, model, category, image_path, tube_spec, thread_spec, shape')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    return NextResponse.json({ error: '제품 정보를 찾을 수 없습니다.' }, { status: 404 })
  }

  /* card_news_jobs 생성 (processing 상태) */
  const { data: job, error: jobError } = await supabase
    .from('card_news_jobs')
    .insert({
      product_id: productId,
      template_type: templateType,
      slide_copies: JSON.parse(JSON.stringify(slideCopies)),
      status: 'processing',
      created_by: user.id,
    })
    .select('id')
    .single()

  if (jobError || !job) {
    return NextResponse.json({ error: '작업 생성에 실패했습니다.' }, { status: 500 })
  }

  const jobId = job.id

  try {
    /* 슬라이드 HTML 생성 */
    const htmlStrings = slideCopies.map((slide) =>
      renderSlideToHtml(slide, product as CardNewsProduct, templateType)
    )

    /* Playwright PNG 렌더링 */
    const pngBuffers = await renderSlidesToPng(htmlStrings)

    /* Supabase Storage 업로드 */
    const serviceClient = createServiceClient()

    /* 버킷 없으면 생성 */
    await serviceClient.storage.createBucket(BUCKET, { public: false }).catch(() => null)

    const uploadPaths: string[] = []

    for (let i = 0; i < pngBuffers.length; i++) {
      const path = `${user.id}/${jobId}/slide-${i}.png`
      const { error: uploadError } = await serviceClient.storage
        .from(BUCKET)
        .upload(path, pngBuffers[i], {
          contentType: 'image/png',
          upsert: true,
        })

      if (uploadError) throw new Error(`슬라이드 ${i + 1} 업로드 실패: ${uploadError.message}`)
      uploadPaths.push(path)
    }

    /* Signed URL 생성 (24시간 유효) */
    const { data: signedData, error: signedError } = await serviceClient.storage
      .from(BUCKET)
      .createSignedUrls(uploadPaths, 86400)

    if (signedError) throw new Error('Signed URL 생성 실패')

    const outputUrls = signedData?.map((d) => d.signedUrl) ?? []

    /* 작업 상태 업데이트 — done */
    await supabase
      .from('card_news_jobs')
      .update({
        status: 'done',
        output_urls: outputUrls,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)

    return NextResponse.json({ success: true, jobId, urls: outputUrls })
  } catch (err) {
    /* 에러 시 실패 상태 기록 */
    await supabase
      .from('card_news_jobs')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', jobId)

    console.error('[cardnews/render] PNG 렌더링 오류:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'PNG 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
