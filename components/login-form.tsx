'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const REMEMBER_EMAIL_KEY = 'otf_remember_email'
const REMEMBER_FLAG_KEY = 'otf_auto_login'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()

      // 이미 로그인된 세션이 있으면 제품 페이지로 자동 이동
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/products/research')
        return
      }

      // 저장된 이메일 및 자동 로그인 설정 불러오기
      const savedFlag = localStorage.getItem(REMEMBER_FLAG_KEY)
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY)
      if (savedFlag === 'true' && savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      }

      setIsChecking(false)
    }
    init()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // 자동 로그인 체크 여부에 따라 이메일 저장 또는 삭제
      if (rememberMe) {
        localStorage.setItem(REMEMBER_FLAG_KEY, 'true')
        localStorage.setItem(REMEMBER_EMAIL_KEY, email)
      } else {
        localStorage.removeItem(REMEMBER_FLAG_KEY)
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }

      router.push('/products/research')
    } catch (error: unknown) {
      if (error instanceof Error) {
        const msg = error.message
        if (msg.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else if (msg.includes('Email not confirmed')) {
          setError('이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.')
        } else {
          setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 세션 확인 중에는 빈 화면 (깜빡임 방지)
  if (isChecking) return null

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>로그인</CardTitle>
          <CardDescription>이메일과 비밀번호를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>이메일</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>비밀번호</Label>
                  <Link
                    href='/auth/forgot-password'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  id='remember-me'
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='h-4 w-4 rounded border-input accent-primary cursor-pointer'
                />
                <Label htmlFor='remember-me' className='cursor-pointer font-normal'>
                  자동 로그인
                </Label>
              </div>
              {error && <p className='text-sm text-red-500'>{error}</p>}
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              계정이 없으신가요?{' '}
              <Link href='/auth/sign-up' className='underline underline-offset-4'>
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
