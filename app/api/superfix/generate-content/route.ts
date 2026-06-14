import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProductContent } from '@/lib/superfix/ai'
import type { ProductJSON, AIGeneratedContent } from '@/lib/superfix/types'

export async function POST(request: Request) {
  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  // 요청 파싱
  let body: { products?: ProductJSON[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { products } = body

  if (!products || !Array.isArray(products) || products.length === 0) {
    return NextResponse.json(
      { error: 'products 배열이 필요합니다.' },
      { status: 400 }
    )
  }

  // OPENAI_API_KEY 환경변수 확인
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  // 순차 배치 처리
  try {
    const results: { productId: string; content: AIGeneratedContent }[] = []

    for (const [index, product] of products.entries()) {
      const content = await generateProductContent(product)
      results.push({
        productId: product.product.model || String(index),
        content,
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('[generate-content] AI 생성 오류:', error)
    return NextResponse.json(
      { error: 'AI 콘텐츠 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
