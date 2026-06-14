import { Suspense } from 'react'
import { ProductNav } from '@/components/products/ProductNav'

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b'>
        <div className='mx-auto flex h-14 max-w-7xl items-center px-6'>
          <Suspense fallback={null}>
            <ProductNav />
          </Suspense>
        </div>
      </header>
      <main className='mx-auto w-full max-w-7xl flex-1 p-6'>{children}</main>
    </div>
  )
}
