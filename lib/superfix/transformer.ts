import type { MyProduct } from '@/lib/products/types'
import type { ProductJSON } from '@/lib/superfix/types'

const BRAND_NAME = 'SUPERFIX'
const BRAND_SUBTITLE = 'PNEUMATIC SOLUTION'

function parseKeywords(raw: string | null): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

export function transformMyProductToJSON(product: MyProduct): ProductJSON {
  return {
    brand: {
      name: BRAND_NAME,
      subtitle: BRAND_SUBTITLE,
    },
    product: {
      title: product.product_name ?? '',
      model: product.model ?? '',
      tubeSize: product.tube_spec ?? '',
      threadSize: product.thread_spec ?? '',
      type: product.shape ?? '',
      recommendedUse: product.recommended_use ?? '',
      category: product.category ?? '',
      mainImage: product.image_path ?? '',
      options: product.option_name ?? '',
    },
    seo: {
      keywords: parseKeywords(product.search_keywords),
    },
  }
}

export function transformBatch(products: MyProduct[]): ProductJSON[] {
  return products.map(transformMyProductToJSON)
}
