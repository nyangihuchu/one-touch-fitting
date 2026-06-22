'use client'

import { useState } from 'react'
import { Save, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlideWrapper } from '@/components/cardnews/slides/SlideWrapper'
import { getBrandSettings, saveBrandSettings, type BrandSettings } from '@/lib/cardnews/brand'

const PREVIEW_SCALE = 0.28
const PREVIEW_SIZE = Math.round(1080 * PREVIEW_SCALE)

export default function CardNewsSettingsPage() {
  const [settings, setSettings] = useState<BrandSettings>(() => getBrandSettings())
  const [saved, setSaved] = useState(false)

  function handleChange(key: keyof BrandSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    saveBrandSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>브랜드 설정</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          카드뉴스에 적용될 브랜드 색상과 정보를 설정하세요.
        </p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* 왼쪽: 설정 폼 */}
        <div className='flex-1 space-y-6'>
          {/* 색상 설정 */}
          <div className='rounded-lg border p-5 space-y-4'>
            <h2 className='font-semibold text-sm'>색상 설정</h2>

            <div className='space-y-2'>
              <Label htmlFor='primaryColor'>메인 색상</Label>
              <div className='flex items-center gap-3'>
                <input
                  id='primaryColor'
                  type='color'
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className='h-10 w-16 cursor-pointer rounded border'
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  placeholder='#1D4ED8'
                  className='font-mono uppercase'
                />
              </div>
              <p className='text-xs text-muted-foreground'>슬라이드 배경, 버튼, 강조 색상에 사용됩니다.</p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='secondaryColor'>보조 색상</Label>
              <div className='flex items-center gap-3'>
                <input
                  id='secondaryColor'
                  type='color'
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className='h-10 w-16 cursor-pointer rounded border'
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  placeholder='#FFFFFF'
                  className='font-mono uppercase'
                />
              </div>
            </div>
          </div>

          {/* 브랜드 정보 */}
          <div className='rounded-lg border p-5 space-y-4'>
            <h2 className='font-semibold text-sm'>브랜드 정보</h2>

            <div className='space-y-2'>
              <Label htmlFor='companyName'>회사/브랜드명</Label>
              <Input
                id='companyName'
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder='SUPERFIX'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tagline'>태그라인</Label>
              <Input
                id='tagline'
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder='공압 전문 브랜드'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='logoUrl'>로고 URL (선택)</Label>
              <Input
                id='logoUrl'
                value={settings.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder='https://example.com/logo.png'
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <Button onClick={handleSave} className='w-full sm:w-auto'>
            {saved ? (
              <><CheckCircle2 className='mr-2 h-4 w-4 text-green-400' />저장되었습니다!</>
            ) : (
              <><Save className='mr-2 h-4 w-4' />설정 저장</>
            )}
          </Button>
        </div>

        {/* 오른쪽: 실시간 미리보기 — 모바일에서 전체 너비, 중앙 정렬 */}
        <div className='w-full lg:w-80 shrink-0 space-y-3'>
          <h2 className='font-semibold text-sm'>브랜드 바 미리보기</h2>
          <p className='text-xs text-muted-foreground'>슬라이드 하단 브랜드 영역이 실시간으로 반영됩니다.</p>

          {/* 모바일에서 미리보기 박스 중앙 정렬 */}
          <div className='flex justify-center lg:justify-start'>
            <div
              style={{
                width: PREVIEW_SIZE,
                height: PREVIEW_SIZE,
                overflow: 'hidden',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.14)',
              }}
            >
              <div
                style={{
                  transform: `scale(${PREVIEW_SCALE})`,
                  transformOrigin: 'top left',
                  width: 1080,
                  height: 1080,
                }}
              >
                <SlideWrapper
                  slideIndex={0}
                  totalSlides={5}
                  brandColor={settings.primaryColor}
                  companyName={settings.companyName}
                >
                  {/* 미리보기용 더미 콘텐츠 */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 24,
                    }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        backgroundColor: settings.primaryColor,
                        opacity: 0.15,
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 48, fontWeight: 800, color: settings.primaryColor, fontFamily: 'sans-serif' }}>
                        {settings.companyName}
                      </div>
                      <div style={{ fontSize: 28, color: '#64748b', marginTop: 12, fontFamily: 'sans-serif' }}>
                        {settings.tagline}
                      </div>
                    </div>
                  </div>
                </SlideWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
