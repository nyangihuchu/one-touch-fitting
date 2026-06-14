'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  function handleClear() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const isSearchActive = !!searchParams.get('search')

  function handleViewAll() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-1'>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='제품명 또는 모델 검색'
          className='w-56'
        />
        <Button variant='outline' size='icon' onClick={handleSearch}>
          <Search />
        </Button>
        {value && (
          <Button variant='ghost' size='icon' onClick={handleClear}>
            <X />
          </Button>
        )}
      </div>
      {isSearchActive && (
        <Button variant='secondary' size='sm' onClick={handleViewAll}>
          전체보기
        </Button>
      )}
    </div>
  )
}
