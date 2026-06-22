import { Suspense } from 'react'
import { ProductNav } from '@/components/products/ProductNav'
import { CardNewsSidebar } from '@/components/cardnews/CardNewsSidebar'

export default function CardNewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b'>
        <div className='mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6'>
          <Suspense fallback={null}>
            <ProductNav />
          </Suspense>
        </div>
      </header>
      <div className='mx-auto flex w-full max-w-7xl flex-1'>
        <CardNewsSidebar />
        {/* 모바일에서 하단 탭 바(h-16) 높이만큼 패딩 추가 */}
        <main className='flex-1 min-w-0 p-4 pb-20 sm:p-6 md:pb-6'>{children}</main>
      </div>
    </div>
  )
}
