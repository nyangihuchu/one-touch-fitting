import Link from 'next/link'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCardNewsJobsByUser } from '@/lib/supabase/server'
import { DownloadJobCard } from '@/components/cardnews/DownloadJobCard'

export async function CardNewsDownloadContent() {
  const jobs = await getCardNewsJobsByUser()

  /* my_products JOIN 결과에서 product_name 추출 */
  const jobsWithName = jobs.map((job) => {
    const productData = (job as { my_products?: { product_name?: string | null } | null }).my_products
    return {
      ...job,
      my_products: undefined,
      product_name: productData?.product_name ?? null,
    }
  })

  return (
    <div className='space-y-6'>
      {/* 헤더: 모바일에서 세로 배치, 데스크톱에서 가로 배치 */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-bold sm:text-2xl'>생성 결과 다운로드</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            생성된 카드뉴스 PNG를 ZIP 파일로 다운로드하세요.
          </p>
        </div>
        <Button asChild className='w-full sm:w-auto'>
          <Link href='/cardnews/generate'>
            <Layers className='mr-2 h-4 w-4' />
            새로 생성하기
          </Link>
        </Button>
      </div>

      {jobsWithName.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center'>
          <Layers className='mb-3 h-10 w-10 text-muted-foreground/40' />
          <p className='text-sm font-medium text-muted-foreground'>생성된 카드뉴스가 없습니다.</p>
          <p className='mt-1 text-xs text-muted-foreground'>카드뉴스를 생성하면 여기에 표시됩니다.</p>
          <Button asChild variant='outline' size='sm' className='mt-4'>
            <Link href='/cardnews/generate'>카드뉴스 생성 시작하기</Link>
          </Button>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {jobsWithName.map((job) => (
            <DownloadJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
