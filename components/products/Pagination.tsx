'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className='flex items-center justify-center gap-3'>
      <Button
        variant='outline'
        size='icon'
        disabled={currentPage <= 1}
        onClick={() => handlePage(currentPage - 1)}
      >
        <ChevronLeft />
      </Button>
      <span className='text-sm text-muted-foreground'>
        {currentPage} / {totalPages}
      </span>
      <Button
        variant='outline'
        size='icon'
        disabled={currentPage >= totalPages}
        onClick={() => handlePage(currentPage + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
