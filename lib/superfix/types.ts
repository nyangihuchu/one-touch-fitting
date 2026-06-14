export interface ProductJSON {
  brand: {
    name: string
    subtitle: string
  }
  product: {
    title: string
    model: string
    tubeSize: string
    threadSize: string
    type: string
    recommendedUse: string
    category: string
    mainImage: string
    options: string
  }
  seo: {
    keywords: string[]
  }
}

export type GeneratorJobStatus = 'pending' | 'processing' | 'done' | 'error'

export interface GeneratorJob {
  id: string
  productId: number
  productJson: ProductJSON
  status: GeneratorJobStatus
}

export interface GeneratorBatch {
  batchId: string
  jobs: GeneratorJob[]
  createdAt: string
}

export interface AIGeneratedContent {
  productName: string
  summary: string
  features: [string, string, string, string]
  checkBeforeBuy: string[]
  seoKeywords: string[]
}

export interface DetailPageData {
  productJson: ProductJSON
  aiContent: AIGeneratedContent
  usageImageUrl?: string
}
