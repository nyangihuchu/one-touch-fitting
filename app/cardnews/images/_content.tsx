import { getProductImageStatus } from '@/lib/supabase/server'
import { ImageStatusTabs } from '@/components/cardnews/ImageStatusTabs'
import { Badge } from '@/components/ui/badge'

export async function CardNewsImagesContent() {
  const { withImage, withoutImage, total } = await getProductImageStatus()

  const imageRate = total > 0 ? Math.round((withImage.length / total) * 100) : 0

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>이미지 현황</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          카드뉴스 생성에 사용할 제품 이미지 현황을 확인하세요.
        </p>
      </div>

      {/* 통계 배지 */}
      <div className='flex flex-wrap gap-2'>
        <Badge variant='secondary'>총 {total.toLocaleString()}개 상품</Badge>
        <Badge variant='secondary'>이미지 보유 {withImage.length.toLocaleString()}개</Badge>
        <Badge variant='outline'>이미지 누락 {withoutImage.length.toLocaleString()}개</Badge>
        <Badge
          variant={imageRate >= 80 ? 'secondary' : 'outline'}
          className={imageRate >= 80 ? 'text-green-700 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}
        >
          이미지 보유율 {imageRate}%
        </Badge>
      </div>

      {/* 탭 + 그리드 */}
      <ImageStatusTabs withImage={withImage} withoutImage={withoutImage} />
    </div>
  )
}
