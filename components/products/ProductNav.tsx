'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/products/research', label: 'Research 제품' },
  { href: '/products/my', label: 'My 제품' },
  { href: '/products/guide', label: '피팅 가이드' },
]

export function ProductNav() {
  const pathname = usePathname()

  return (
    <nav className='flex gap-1'>
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === href
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
