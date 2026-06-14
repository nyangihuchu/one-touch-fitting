import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUsageImage } from '@/lib/superfix/imagen'
import type { ProductJSON } from '@/lib/superfix/types'

export async function POST(request: Request) {
  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  // 환경변수 확인
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json(
      { error: 'GOOGLE_AI_API_KEY가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  // 요청 파싱
  let body: { productId?: string; json?: ProductJSON }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { productId, json } = body

  if (!productId || !json) {
    return NextResponse.json(
      { error: 'productId와 json이 필요합니다.' },
      { status: 400 }
    )
  }

  // 이미지 생성 및 Storage 업로드
  try {
    const imageUrl = await generateUsageImage(json, productId)
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('[generate-image] 이미지 생성 오류:', error)
    return NextResponse.json(
      { error: '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
