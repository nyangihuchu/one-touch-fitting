'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Image, Layers, Download, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/cardnews/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/cardnews/products', label: '상품 관리', icon: Package },
  { href: '/cardnews/images', label: '이미지', icon: Image },
  { href: '/cardnews/generate', label: '생성', icon: Layers },
  { href: '/cardnews/download', label: '다운로드', icon: Download },
  { href: '/cardnews/settings', label: '설정', icon: Settings },
]

export function CardNewsSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* 데스크톱: 좌측 사이드바 (md 이상에서만 표시) */}
      <aside className='hidden md:flex flex-col w-56 border-r shrink-0'>
        <nav className='flex flex-col gap-1 p-3'>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname.startsWith(href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className='h-4 w-4 shrink-0' />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 모바일: 하단 고정 탭 바 (md 미만에서만 표시) */}
      <nav
        className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t bg-background md:hidden'
        aria-label='카드뉴스 하단 네비게이션'
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* 활성 탭 상단 인디케이터 */}
              <span
                className={cn(
                  'absolute top-0 h-0.5 w-8 rounded-full transition-colors',
                  isActive ? 'bg-foreground' : 'bg-transparent'
                )}
              />
              <Icon className='h-5 w-5 shrink-0' />
              <span className='leading-none'>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
