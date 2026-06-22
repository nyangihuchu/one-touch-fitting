import Link from 'next/link'
import { Package, Image, ImageOff, BarChart3, Layers } from 'lucide-react'
import { getCardNewsDashboardStats } from '@/lib/supabase/server'
import { StatCard } from '@/components/cardnews/StatCard'
import { Button } from '@/components/ui/button'

export async function CardNewsDashboardContent() {
  const { total, withImage, withoutImage, imageRate } = await getCardNewsDashboardStats()

  return (
    <div className='space-y-8'>
      {/* 헤더: 모바일에서 세로 배치, 데스크톱에서 가로 배치 */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-bold sm:text-2xl'>카드뉴스 대시보드</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            SUPERFIX 카드뉴스 생성 현황을 한눈에 확인하세요.
          </p>
        </div>
        <Button asChild className='w-full sm:w-auto'>
          <Link href='/cardnews/generate'>
            <Layers className='mr-2 h-4 w-4' />
            카드뉴스 생성 시작
          </Link>
        </Button>
      </div>

      {/* 통계 카드 4개 */}
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        <StatCard
          title='총 상품 수'
          value={total.toLocaleString()}
          description='my_products 전체 등록 상품'
          icon={Package}
        />
        <StatCard
          title='이미지 보유 수'
          value={withImage.toLocaleString()}
          description='image_path가 있는 상품'
          icon={Image}
          variant='success'
        />
        <StatCard
          title='이미지 누락 수'
          value={withoutImage.toLocaleString()}
          description='이미지가 없는 상품'
          icon={ImageOff}
          variant='warning'
        />
        <StatCard
          title='이미지 보유율'
          value={`${imageRate}%`}
          description='전체 대비 이미지 보유 비율'
          icon={BarChart3}
          variant={imageRate >= 80 ? 'success' : 'warning'}
        />
      </div>

      {/* 최근 생성 이력 */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>최근 생성 이력</h2>
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center'>
          <Layers className='mb-3 h-10 w-10 text-muted-foreground/40' />
          <p className='text-sm font-medium text-muted-foreground'>아직 생성된 카드뉴스가 없습니다.</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            상품을 선택하고 카드뉴스를 생성해보세요.
          </p>
          <Button asChild variant='outline' size='sm' className='mt-4'>
            <Link href='/cardnews/generate'>카드뉴스 생성 시작하기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
