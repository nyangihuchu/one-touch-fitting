import { GoogleGenAI } from '@google/genai'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { ProductJSON } from '@/lib/superfix/types'

function getGenAIClient(): GoogleGenAI {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY })
}

function getStorageClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function buildImagePrompt(product: ProductJSON): string {
  const { product: p } = product
  return `Professional industrial product usage photo for ${p.model} pneumatic fitting. ` +
    `${p.type} type, tube size ${p.tubeSize}, thread ${p.threadSize}. ` +
    `Shown installed in industrial automation equipment with pneumatic cylinder or solenoid valve. ` +
    `Clean factory background, professional lighting, high quality product photography, ` +
    `photorealistic, 4K resolution, white and gray industrial setting.`
}

export async function generateUsageImage(
  product: ProductJSON,
  productId: string
): Promise<string> {
  const ai = getGenAIClient()

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: buildImagePrompt(product),
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  })

  const imageData = response.generatedImages?.[0]?.image?.imageBytes
  if (!imageData) {
    throw new Error('이미지 생성에 실패했습니다.')
  }

  // base64 → Buffer → Supabase Storage 업로드
  const buffer = Buffer.from(imageData, 'base64')
  const storagePath = `usage-images/${productId}.png`

  const supabase = getStorageClient()
  const { error } = await supabase.storage
    .from('superfix')
    .upload(storagePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (error) {
    throw new Error(`Storage 업로드 실패: ${error.message}`)
  }

  const { data } = supabase.storage.from('superfix').getPublicUrl(storagePath)
  return data.publicUrl
}
