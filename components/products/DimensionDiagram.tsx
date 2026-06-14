import Image from 'next/image'

interface DimensionDiagramProps {
  imageSrc: string | null
  tubeSpec: string | null
  threadSpec: string | null
}

function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function DimensionDiagram({ imageSrc, tubeSpec, threadSpec }: DimensionDiagramProps) {
  if (!tubeSpec && !threadSpec) return null

  const tube = tubeSpec ?? '-'
  const thread = threadSpec ?? '-'
  const hasImage = imageSrc && isValidHttpUrl(imageSrc)

  return (
    <section className='space-y-3 rounded-lg border p-5'>
      <h2 className='text-sm font-semibold text-muted-foreground'>외형 치수도</h2>

      <div className='relative overflow-hidden rounded-md border bg-white' style={{ height: 320 }}>
        {/* 실제 제품 사진 */}
        {hasImage ? (
          <Image
            src={imageSrc}
            alt='제품 외형 치수도'
            fill
            className='object-contain'
            sizes='(max-width: 768px) 100vw, 400px'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
            이미지 없음
          </div>
        )}

        {/* 치수 주석 오버레이 — 제품 사진 위에 직접 그림 */}
        <svg
          className='absolute inset-0 h-full w-full'
          viewBox='0 0 400 320'
          preserveAspectRatio='none'
          aria-hidden='true'
        >
          {/* 상단 치수선: Ø{tubeSpec} — 튜브 헤드 위치 (상단 약 18%) */}
          {tubeSpec && (
            <g>
              {/* 연장선: 좌우 → 아래로 (제품 상단 방향) */}
              <line x1='152' y1='22' x2='152' y2='50' stroke='#111827' strokeWidth='1' />
              <line x1='248' y1='22' x2='248' y2='50' stroke='#111827' strokeWidth='1' />
              {/* 수평 양방향 화살표 */}
              <line x1='165' y1='36' x2='235' y2='36' stroke='#111827' strokeWidth='1.5' />
              <polygon points='152,36 166,30 166,42' fill='#111827' />
              <polygon points='248,36 234,30 234,42' fill='#111827' />
              {/* 라벨 */}
              <rect x='160' y='5' width='80' height='22' fill='white' fillOpacity='0.85' />
              <text
                x='200' y='20' textAnchor='middle' fontSize='15' fontWeight='700'
                fontFamily='ui-sans-serif, system-ui' fill='#111827'
              >{`Ø${tube}`}</text>
            </g>
          )}

          {/* 하단 치수선: {threadSpec} — 나사 위치 (하단 약 82%) */}
          {threadSpec && (
            <g>
              {/* 연장선: 좌우 → 위로 (제품 하단 방향) */}
              <line x1='120' y1='268' x2='120' y2='297' stroke='#111827' strokeWidth='1' />
              <line x1='280' y1='268' x2='280' y2='297' stroke='#111827' strokeWidth='1' />
              {/* 수평 양방향 화살표 */}
              <line x1='134' y1='283' x2='266' y2='283' stroke='#111827' strokeWidth='1.5' />
              <polygon points='120,283 134,277 134,289' fill='#111827' />
              <polygon points='280,283 266,277 266,289' fill='#111827' />
              {/* 라벨 */}
              <rect x='140' y='296' width='120' height='22' fill='white' fillOpacity='0.85' />
              <text
                x='200' y='312' textAnchor='middle' fontSize='15' fontWeight='700'
                fontFamily='ui-sans-serif, system-ui' fill='#111827'
              >{thread}</text>
            </g>
          )}

          {/* 단위 레이블 */}
          <text
            x='392' y='316' textAnchor='end' fontSize='10'
            fill='#6B7280' fontFamily='ui-sans-serif, system-ui'
          >단위 : mm</text>
        </svg>
      </div>
    </section>
  )
}
