import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShapeImage } from './_image'

const shapeItems = [
  {
    name: 'PC (Straight)',
    desc: '일직선으로 호스와 나사를 연결하는 가장 기본적인 형태',
    icon: '━',
    models: ['PC'],
    imageUrl: 'https://www.sanga2000.com/upload_data/image_data/copy2_category3_1560384887.PNG',
  },
  {
    name: 'PL (Elbow)',
    desc: '한쪽은 나사, 한쪽은 호스로 연결되며 90도 각도로 꺾여 공간 효율이 좋음',
    icon: '┗',
    models: ['PL'],
    imageUrl: 'https://www.sanga2000.com/upload_data/image_data/copy2_category3_1560391267.PNG',
  },
  {
    name: 'PT / PST (Tee)',
    desc: 'T자 모양으로 하나의 라인을 두 개로 분기하거나 교차시킬 때 사용',
    icon: '┳',
    models: ['PT', 'PST'],
    imageUrl: 'https://www.sanga2000.com/upload_data/image_data/copy2_category3_1560384897.PNG',
  },
  {
    name: 'PY (Y형)',
    desc: 'Y자 형태로 공기나 유체를 두 갈래로 매끄럽게 갈라지게 함',
    icon: '┤',
    models: ['PY'],
    imageUrl: 'https://www.sanga2000.com/upload_data/image_data/category3_21557900860.PNG',
  },
  {
    name: 'PUC (Union)',
    desc: '나사산 없이 양쪽 모두 호스(튜브) 대 호스를 직선으로 연결하는 부품',
    icon: '⬡',
    models: ['PUC'],
    imageUrl: 'https://www.sanga2000.com/upload_data/image_data/copy2_category3_1560384959.PNG',
  },
]

const popularProducts = [
  {
    rank: '1',
    name: '에어피팅 혼합 세트 (키트)',
    reason: '다양한 형태 구비, 단품 대비 비용 절감',
    spec: '6mm 위주 직선·엘보·T형 혼합',
  },
  {
    rank: '2',
    name: '직선형 단품 (10~20개입)',
    reason: '가장 범용적인 규격, 소모품 성격',
    spec: 'φ6mm · PT1/4"',
  },
  {
    rank: '3',
    name: '엘보형 단품',
    reason: '공간이 좁은 배관 코너 처리',
    spec: 'φ6mm · PT1/4"',
  },
  {
    rank: '4',
    name: '소형 직선/엘보 세트',
    reason: '소형 자동화 장비·센서 배관용',
    spec: 'φ4mm · PT1/8"',
  },
  {
    rank: '5',
    name: '수나사-튜브형 (Male Connector)',
    reason: '실린더·밸브 포트에서 튜브로 인출',
    spec: 'φ6mm · PT1/4" 수나사',
  },
]

const selectionSteps = [
  {
    step: '1',
    title: '튜브 외경 확인',
    body: '사용 중인 호스/튜브의 바깥 지름(φ)을 확인합니다. 버니어캘리퍼스로 측정하거나 구매 사양서를 확인하세요.',
    tip: '국내 가장 흔한 규격: φ4mm, φ6mm, φ8mm',
  },
  {
    step: '2',
    title: '포트(나사) 규격 확인',
    body: '연결할 장비·실린더·밸브의 나사 규격을 확인합니다. 보통 몸체에 "PT1/4"나 "G1/8" 등으로 각인되어 있습니다.',
    tip: 'PT=Rc (한국/일본), G=PF (영국), NPT (미국)',
  },
  {
    step: '3',
    title: '형태 선택',
    body: '배관 경로와 공간에 따라 형태를 결정합니다. 직선으로 연장하면 직선형, 방향 전환이 필요하면 엘보형, 분기가 필요하면 T형을 선택합니다.',
    tip: '좁은 공간에서 엘보형을 쓰면 배선 정리가 깔끔해집니다',
  },
  {
    step: '4',
    title: '재질 선택',
    body: '일반 공압 환경(0.8MPa 이하)에는 수지(POM)가 경제적입니다. 고압·고온·절삭유 접촉 환경이라면 황동을 선택하세요.',
    tip: '재질 인기 순: 수지(POM) > 황동 > 스테인리스',
  },
]

export function FittingGuideContent() {
  return (
    <div className='mx-auto max-w-5xl space-y-14 p-6'>

      {/* 섹션 1: 원터치 피팅이란? */}
      <section className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold'>원터치 피팅(에어피팅) 가이드</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            초보자도 바로 이해할 수 있는 공압 배관 부품 안내서
          </p>
        </div>

        <div className='rounded-lg border bg-muted/30 p-6 space-y-4'>
          <h2 className='text-lg font-semibold'>원터치 피팅이란?</h2>
          <p className='text-sm leading-relaxed'>
            <strong>공압(에어) 배관 시스템</strong>에서 튜브(호스)를 연결하는 이음 부품입니다.
            이름 그대로 <strong>공구 없이 튜브를 밀어 넣는 동작 하나</strong>로 연결이 완료됩니다.
            분리 시에는 링을 손가락으로 누르면서 당기면 됩니다.
          </p>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            {[
              { label: '공구 불필요', desc: '드라이버·렌치 없이 손으로만 연결' },
              { label: '반복 탈착 가능', desc: '링을 누르고 당기면 즉시 분리' },
              { label: '에어 누설 방지', desc: '내부 실(Seal)이 기밀을 유지' },
            ].map(({ label, desc }) => (
              <div key={label} className='rounded-md border bg-background p-4'>
                <p className='text-sm font-semibold'>{label}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 2: 주요 형태별 종류 */}
      <section className='space-y-4'>
        <div className='border-b pb-2'>
          <h2 className='text-lg font-semibold'>주요 형태별 종류</h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            배관이 꺾이는 방향과 분기되는 형태에 따라 모델명이 구분됩니다 (상아뉴매틱 부품 기호 기준)
          </p>
        </div>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
          {shapeItems.map(({ name, desc, icon, models, imageUrl }) => (
            <div key={name} className='rounded-lg border overflow-hidden'>
              <ShapeImage src={imageUrl} alt={name} />
              <div className='p-4 space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-xl'>{icon}</span>
                  <p className='text-sm font-semibold'>{name}</p>
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed'>{desc}</p>
                <div className='flex flex-wrap gap-1'>
                  {models.map((m) => (
                    <span
                      key={m}
                      className='rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-medium'
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 섹션 3: 규격 및 사이즈 선택법 */}
      <section className='space-y-4'>
        <div className='border-b pb-2'>
          <h2 className='text-lg font-semibold'>규격 및 사이즈 선택법</h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            호스의 외경(두께)과 연결할 기계의 나사산 크기를 반드시 정확하게 확인해야 합니다
          </p>
        </div>

        <div className='space-y-4'>
          {/* ① 호스 외경 */}
          <div className='rounded-lg border p-5 space-y-3'>
            <h3 className='text-sm font-semibold'>① 호스(튜브) 외경 사이즈</h3>
            <p className='text-sm text-muted-foreground'>
              국내 공압 라인에서는 주로 <strong>mm 단위</strong>를 사용하며,
              정수기나 일부 수입 장비에서는 <strong>인치(Inch) 단위</strong>를 씁니다.
            </p>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='space-y-2'>
                <p className='text-xs font-medium text-muted-foreground'>미리(mm) 규격</p>
                <div className='flex flex-wrap gap-1.5'>
                  {['Ø4', 'Ø6', 'Ø8', 'Ø10', 'Ø12', 'Ø16'].map((s) => (
                    <span key={s} className='rounded-full border px-3 py-1 text-xs font-medium'>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-xs font-medium text-muted-foreground'>인치(Inch) 규격</p>
                <div className='flex flex-wrap gap-1.5'>
                  {[{ label: '1/4"', sub: '≈6.35mm' }, { label: '3/8"', sub: '≈9.52mm' }].map(({ label, sub }) => (
                    <span key={label} className='rounded-full border px-3 py-1 text-xs font-medium'>
                      {label} <span className='text-muted-foreground'>({sub})</span>
                    </span>
                  ))}
                </div>
                <p className='text-xs text-muted-foreground'>정수기 호스는 대부분 1/4" 사용</p>
              </div>
            </div>
          </div>

          {/* ② 나사산 규격 */}
          <div className='rounded-lg border p-5 space-y-3'>
            <h3 className='text-sm font-semibold'>② 나사산 규격 (PT, R, G, M 나사)</h3>
            <p className='text-sm text-muted-foreground'>
              기계 장치나 에어 컴프레서에 돌려 끼우는 나사부 규격입니다.
              일반적으로 <strong>파이프 테이퍼 나사(PT 또는 R)</strong> 규격을 가장 많이 씁니다.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-20'>모델 표기</TableHead>
                  <TableHead>규격</TableHead>
                  <TableHead>나사 외경</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { code: 'M5', spec: 'M5 미터 나사 (초소형)', dia: '약 5mm' },
                  { code: 'M6', spec: 'M6 미터 나사 (소형 기전용)', dia: '약 6mm' },
                  { code: '01', spec: 'PT 1/8" 테이퍼 나사', dia: '약 9.7mm' },
                  { code: '02', spec: 'PT 1/4" 테이퍼 나사', dia: '약 13.1mm' },
                  { code: '03', spec: 'PT 3/8" 테이퍼 나사', dia: '약 16.6mm' },
                  { code: '04', spec: 'PT 1/2" 테이퍼 나사', dia: '약 20.9mm' },
                ].map(({ code, spec, dia }) => (
                  <TableRow key={code}>
                    <TableCell>
                      <span className='rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold'>
                        {code}
                      </span>
                    </TableCell>
                    <TableCell className='text-sm'>{spec}</TableCell>
                    <TableCell className='text-sm text-muted-foreground'>{dia}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 모델명 읽기 예시 */}
          <div className='rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-3'>
            <h3 className='text-sm font-semibold'>모델명 읽는 예시</h3>
            <div className='flex flex-wrap items-center gap-2 text-sm'>
              <span className='rounded bg-primary text-primary-foreground px-2.5 py-1 font-mono font-bold text-base'>
                PL 06-02
              </span>
              <span className='text-muted-foreground'>=</span>
              <div className='flex flex-wrap gap-2'>
                {[
                  { code: 'PL', label: '90도 꺾인 엘보 형태' },
                  { code: '06', label: '에어 호스 외경 6mm' },
                  { code: '02', label: '나사산 규격 PT 1/4"' },
                ].map(({ code, label }) => (
                  <span key={code} className='flex items-center gap-1'>
                    <span className='rounded bg-muted px-1.5 py-0.5 font-mono font-semibold text-xs'>{code}</span>
                    <span className='text-xs text-muted-foreground'>{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 4: 온라인 마켓 인기 구성 */}
      <section className='space-y-4'>
        <div className='border-b pb-2'>
          <h2 className='text-lg font-semibold'>온라인 마켓 인기 구성</h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            네이버스토어·쿠팡 판매 트렌드 기준 — 수요가 높은 구성을 먼저 갖추면 회전율이 올라갑니다
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>순위</TableHead>
              <TableHead>구성</TableHead>
              <TableHead>대표 규격</TableHead>
              <TableHead>인기 이유</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popularProducts.map(({ rank, name, spec, reason }) => (
              <TableRow key={rank}>
                <TableCell className='font-bold text-primary'>{rank}</TableCell>
                <TableCell className='font-medium'>{name}</TableCell>
                <TableCell className='text-muted-foreground text-sm'>{spec}</TableCell>
                <TableCell className='text-sm'>{reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className='text-xs text-muted-foreground'>
          * 재질 수요: 수지(POM) &gt; 황동 &gt; 스테인리스 순으로 많이 팔립니다.
        </p>
      </section>

      {/* 섹션 5: 초보자 선택 4단계 */}
      <section className='space-y-4'>
        <div className='border-b pb-2'>
          <h2 className='text-lg font-semibold'>초보자 선택 가이드 4단계</h2>
          <p className='mt-0.5 text-sm text-muted-foreground'>
            이 순서대로 확인하면 잘못된 규격 주문을 방지할 수 있습니다
          </p>
        </div>
        <div className='space-y-3'>
          {selectionSteps.map(({ step, title, body, tip }) => (
            <div key={step} className='flex gap-4 rounded-lg border p-4'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold'>
                {step}
              </div>
              <div className='space-y-1'>
                <p className='font-semibold text-sm'>{title}</p>
                <p className='text-sm text-muted-foreground leading-relaxed'>{body}</p>
                <p className='text-xs text-primary font-medium'>Tip: {tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
