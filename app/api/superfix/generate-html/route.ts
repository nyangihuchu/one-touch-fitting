import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDetailPageHTML } from '@/lib/superfix/html-generator'
import type { DetailPageData } from '@/lib/superfix/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  let body: { data?: DetailPageData; templateType?: 'A' | 'B' }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  if (!body.data) {
    return NextResponse.json({ error: 'data가 필요합니다.' }, { status: 400 })
  }

  try {
    const html = await generateDetailPageHTML(body.data, {
      templateType: body.templateType ?? 'A',
    })
    return NextResponse.json({ html })
  } catch (error) {
    console.error('[generate-html] HTML 생성 오류:', error)
    return NextResponse.json(
      { error: 'HTML 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
