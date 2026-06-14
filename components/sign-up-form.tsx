'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // 비밀번호 일치 여부 확인
    if (password !== repeatPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 이메일 인증 리다이렉트 제거 — Supabase 대시보드에서 "Confirm email"을 OFF로 설정해야 즉시 로그인됩니다
          emailRedirectTo: undefined,
        },
      })
      if (error) throw error

      // 세션이 바로 생성된 경우 (이메일 인증 비활성화 상태) → 즉시 리다이렉트
      if (data.session) {
        router.push('/products/research')
      } else {
        // 이메일 인증이 활성화된 경우 → 안내 페이지로 이동
        router.push('/auth/sign-up-success')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const msg = error.message
        if (msg.includes('User already registered')) {
          setError('이미 가입된 이메일입니다. 로그인을 시도해주세요.')
        } else if (msg.includes('Password should be at least')) {
          setError('비밀번호는 최소 6자 이상이어야 합니다.')
        } else if (msg.includes('Unable to validate email address')) {
          setError('유효하지 않은 이메일 형식입니다.')
        } else if (msg.includes('rate limit')) {
          setError('잠시 후 다시 시도해주세요. (이메일 발송 한도 초과)')
        } else {
          setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='6자 이상 입력하세요'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='repeat-password'>비밀번호 확인</Label>
                </div>
                <Input
                  id='repeat-password'
                  type='password'
                  placeholder='비밀번호를 다시 입력하세요'
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className='text-sm text-red-500'>{error}</p>}
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              이미 계정이 있으신가요?{' '}
              <Link href='/auth/login' className='underline underline-offset-4'>
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
