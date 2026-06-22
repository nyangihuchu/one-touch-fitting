'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageGrid } from '@/components/cardnews/ImageGrid'

interface ImageItem {
  id: number
  product_name: string | null
  image_path: string | null
}

interface WithoutImageItem {
  id: number
  product_name: string | null
}

interface ImageStatusTabsProps {
  withImage: ImageItem[]
  withoutImage: WithoutImageItem[]
}

export function ImageStatusTabs({ withImage, withoutImage }: ImageStatusTabsProps) {
  const total = withImage.length + withoutImage.length

  // withoutImage 아이템을 ImageGrid가 받는 형식으로 변환
  const withoutImageItems: ImageItem[] = withoutImage.map((p) => ({
    ...p,
    image_path: null,
  }))

  const allItems: ImageItem[] = [...withImage, ...withoutImageItems]

  return (
    <Tabs defaultValue='all'>
      <TabsList>
        <TabsTrigger value='all'>전체 ({total})</TabsTrigger>
        <TabsTrigger value='with'>이미지 있음 ({withImage.length})</TabsTrigger>
        <TabsTrigger value='without'>이미지 누락 ({withoutImage.length})</TabsTrigger>
      </TabsList>

      <TabsContent value='all'>
        <ImageGrid items={allItems} />
      </TabsContent>

      <TabsContent value='with'>
        <ImageGrid items={withImage} />
      </TabsContent>

      <TabsContent value='without'>
        <ImageGrid items={withoutImageItems} />
      </TabsContent>
    </Tabs>
  )
}
