'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFilterProps {
  label: string
  options: string[]
  paramKey: string
}

const ALL_VALUE = '__all__'

export function ProductFilter({ label, options, paramKey }: ProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get(paramKey) ?? ALL_VALUE

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== ALL_VALUE) {
      params.set(paramKey, value)
    } else {
      params.delete(paramKey)
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className='w-40'>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>전체</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
