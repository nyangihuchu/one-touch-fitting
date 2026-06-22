const STORAGE_KEY = 'cardnews_brand'

export interface BrandSettings {
  primaryColor: string
  secondaryColor: string
  companyName: string
  tagline: string
  logoUrl: string
}

export const DEFAULT_BRAND: BrandSettings = {
  primaryColor: '#FF6A00',
  secondaryColor: '#111111',
  companyName: 'SUPERFIX',
  tagline: '공압 전문 브랜드',
  logoUrl: '',
}

export function getBrandSettings(): BrandSettings {
  if (typeof window === 'undefined') return DEFAULT_BRAND
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_BRAND
    return { ...DEFAULT_BRAND, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_BRAND
  }
}

export function saveBrandSettings(settings: BrandSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
