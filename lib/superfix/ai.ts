import OpenAI from 'openai'
import type { ProductJSON, AIGeneratedContent } from '@/lib/superfix/types'

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

const SYSTEM_PROMPT = `당신은 산업용 부품 전문 온라인 쇼핑몰 마케터입니다.
제품 데이터를 받아 한국 쇼핑몰(쿠팡, 스마트스토어, 카페24)에 최적화된 콘텐츠를 생성합니다.
반드시 JSON 형식으로만 응답하며, 모든 텍스트는 한국어로 작성합니다.`

function buildUserPrompt(json: ProductJSON): string {
  const { brand, product } = json
  return `다음 산업용 부품 데이터를 기반으로 쇼핑몰 콘텐츠를 생성하세요.

브랜드명: ${brand.name}
제품명: ${product.title}
모델명: ${product.model}
튜브규격: ${product.tubeSize}
나사규격: ${product.threadSize}
형태: ${product.type}
추천용도: ${product.recommendedUse}
카테고리: ${product.category}

다음 JSON 형식으로 응답하세요:
{
  "productName": "쇼핑몰 최적화 상품명 (브랜드명, 제품유형, 모델명, 규격 포함, 50자 이내)",
  "summary": "3줄 이내 요약설명 (규격 중심, 줄바꿈 없이 한 문장으로)",
  "features": ["특징1", "특징2", "특징3", "특징4"],
  "checkBeforeBuy": ["확인사항1", "확인사항2", "확인사항3"],
  "seoKeywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5", "키워드6"]
}

규칙:
- productName: 모델명(${product.model})과 튜브규격(${product.tubeSize}), 나사규격(${product.threadSize}) 반드시 포함
- features: 정확히 4개, 산업용 부품 특성 강조 (원터치 연결, 밀폐성, 내구성, 재질 등)
- checkBeforeBuy: 구매 전 확인해야 할 실용적 내용 (규격 확인, 호환성 등)
- seoKeywords: 모델명, 브랜드명, 제품유형, 규격 관련 검색어 포함`
}

interface RawAIResponse {
  productName?: string
  summary?: string
  features?: string[]
  checkBeforeBuy?: string[]
  seoKeywords?: string[]
}

function validateAndParse(raw: RawAIResponse): AIGeneratedContent {
  const features = raw.features ?? []
  const padded = [...features, '', '', '', ''].slice(0, 4) as [string, string, string, string]

  return {
    productName: raw.productName ?? '',
    summary: raw.summary ?? '',
    features: padded,
    checkBeforeBuy: raw.checkBeforeBuy ?? [],
    seoKeywords: raw.seoKeywords ?? [],
  }
}

export async function generateProductContent(json: ProductJSON): Promise<AIGeneratedContent> {
  const client = getClient()

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(json) },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content ?? '{}'
  const parsed = JSON.parse(content) as RawAIResponse
  return validateAndParse(parsed)
}
