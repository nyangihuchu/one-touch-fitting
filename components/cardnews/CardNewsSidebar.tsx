'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Image, Layers, Download, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/cardnews/dashboard', label: '대시보드', shortLabel: '홈', icon: LayoutDashboard },
  { href: '/cardnews/products', label: '상품 관리', shortLabel: '상품', icon: Package },
  { href: '/cardnews/images', label: '이미지 현황', shortLabel: '이미지', icon: Image },
  { href: '/cardnews/generate', label: '카드뉴스 생성', shortLabel: '생성', icon: Layers },
  { href: '/cardnews/download', label: '다운로드', shortLabel: '다운로드', icon: Download },
  { href: '/cardnews/settings', label: '브랜드 설정', shortLabel: '설정', icon: Settings },
]

export function CardNewsSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* 데스크톱: 좌측 사이드바 */}
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

      {/* 모바일: 하단 고정 탭 바 */}
      <nav
        className='fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-background md:hidden'
        aria-label='카드뉴스 하단 네비게이션'
      >
        {navItems.map(({ href, shortLabel, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className='absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-foreground' />
              )}
              <Icon className='h-5 w-5 shrink-0' />
              <span className='leading-none'>{shortLabel}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
