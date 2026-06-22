'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/products/research', label: 'Research 제품' },
  { href: '/products/my', label: 'My 제품' },
  { href: '/products/guide', label: '피팅 가이드' },
  { href: '/superfix', label: '상세페이지 생성' },
  { href: '/cardnews/dashboard', label: '카드뉴스' },
]

export function ProductNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  // 모바일 햄버거 메뉴 열림/닫힘 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    // relative: 모바일 드롭다운의 absolute 포지션 기준점
    <div className='relative flex w-full items-center justify-between'>

      {/* 데스크탑 가로 네비게이션 (md 이상에서만 표시) */}
      <nav className='hidden md:flex gap-1'>
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              (pathname === href || (href !== '/' && pathname.startsWith(href)))
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* 모바일 햄버거 토글 버튼 (md 미만에서만 표시) */}
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden'
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <X className='h-5 w-5' />
        ) : (
          <Menu className='h-5 w-5' />
        )}
      </Button>

      {/* 테마 전환 및 로그아웃 버튼 (항상 표시) */}
      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='icon' onClick={toggleTheme} aria-label='테마 전환'>
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleLogout} aria-label='로그아웃'>
          <LogOut className='h-4 w-4' />
        </Button>
      </div>

      {/* 모바일 드롭다운 메뉴 (isMenuOpen일 때 + md 미만에서만 표시) */}
      {isMenuOpen && (
        <div
          className='absolute left-0 right-0 top-14 z-50 border-b bg-background shadow-sm md:hidden'
          role='menu'
          aria-label='모바일 네비게이션 메뉴'
        >
          <nav className='flex flex-col py-2'>
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                role='menuitem'
                // 링크 클릭 시 드롭다운 닫기
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  (pathname === href || (href !== '/' && pathname.startsWith(href)))
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
