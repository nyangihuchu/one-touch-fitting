'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/products/research', label: 'Research 제품' },
  { href: '/products/my', label: 'My 제품' },
  { href: '/products/guide', label: '피팅 가이드' },
]

export function ProductNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className='flex w-full items-center justify-between'>
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

      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='icon' onClick={toggleTheme} aria-label='테마 전환'>
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleLogout} aria-label='로그아웃'>
          <LogOut className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
