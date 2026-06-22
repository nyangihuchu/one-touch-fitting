import type { Tables } from '@/lib/supabase/database.types'

export type CardNewsProduct = Pick<
  Tables<'my_products'>,
  'id' | 'product_name' | 'model' | 'category' | 'image_path' | 'tube_spec' | 'thread_spec' | 'shape'
>

export type CardNewsTemplateType = 'A' | 'B' | 'C'

export type CardNewsTemplate = Tables<'card_news_templates'>

export type CopyRule = Tables<'copy_rules'>

export type CardNewsJob = Tables<'card_news_jobs'>

export interface SlideData {
  index: number
  title: string
  body: string
  imageUrl?: string
}

export interface CardNewsFilterParams {
  category?: string
}

export interface CardNewsPaginationParams {
  page: number
  pageSize: number
}
