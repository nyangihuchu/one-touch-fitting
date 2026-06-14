import type { ProductJSON, AIGeneratedContent } from '@/lib/superfix/types'

export function generateDefaultContent(productJson: ProductJSON): AIGeneratedContent {
  const { product } = productJson
  return {
    productName: product.title,
    summary: `${product.title} (${product.model})`,
    features: [
      `튜브 규격 ${product.tubeSize || '-'} / 나사 규격 ${product.threadSize || '-'} 지원`,
      '내구성 있는 소재로 장기간 안정적인 사용 가능',
      '간편한 원터치 방식으로 빠른 연결 및 분리 가능',
      `${product.recommendedUse || '공압 시스템'}에 최적화된 설계`,
    ],
    checkBeforeBuy: [
      '제품 모델명 및 규격(튜브 규격, 나사 규격)을 반드시 확인하세요.',
      '사용 환경의 최대 압력이 제품 정격 압력 이내인지 확인하세요.',
      '기존 배관 재질 및 접속구 형태와 호환되는지 확인 후 구매하세요.',
    ],
    seoKeywords: productJson.seo?.keywords ?? [],
  }
}
