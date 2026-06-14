import type { ResearchProduct } from '@/lib/products/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ResearchProductTableProps {
  data: ResearchProduct[]
}

export function ResearchProductTable({ data }: ResearchProductTableProps) {
  if (data.length === 0) {
    return (
      <div className='py-16 text-center text-sm text-muted-foreground'>
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <>
      {/* 모바일 카드 목록 — sm(640px) 미만에서만 표시 */}
      <div className='divide-y border rounded-lg sm:hidden'>
        {data.map((item) => (
          <div key={item.id} className='rounded-lg border p-4 space-y-1.5'>
            {/* 제품명 */}
            <p className='font-medium text-sm'>{item.product_name ?? '-'}</p>

            {/* 카테고리 · 형태 */}
            <p className='text-xs text-muted-foreground'>
              {item.category ?? '-'}
              {item.shape ? ` · ${item.shape}` : ''}
            </p>

            {/* 상세 정보 — 2열 그리드 */}
            <div className='grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs'>
              <span className='text-muted-foreground'>
                모델: <span className='text-foreground'>{item.model ?? '-'}</span>
              </span>
              <span className='text-muted-foreground'>
                옵션: <span className='text-foreground'>{item.option_name ?? '-'}</span>
              </span>
              <span className='text-muted-foreground'>
                튜브: <span className='text-foreground'>{item.tube_spec ?? '-'}</span>
              </span>
              <span className='text-muted-foreground'>
                나사: <span className='text-foreground'>{item.thread_spec ?? '-'}</span>
              </span>
              {item.recommended_use && (
                <span className='col-span-2 text-muted-foreground'>
                  추천용도: <span className='text-foreground'>{item.recommended_use}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 — sm(640px) 이상에서만 표시 */}
      <div className='hidden sm:block w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>모델</TableHead>
              <TableHead>형태</TableHead>
              <TableHead>옵션명</TableHead>
              <TableHead>튜브규격</TableHead>
              <TableHead>나사규격</TableHead>
              <TableHead>추천용도</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.product_name ?? '-'}</TableCell>
                <TableCell>{item.category ?? '-'}</TableCell>
                <TableCell>{item.model ?? '-'}</TableCell>
                <TableCell>{item.shape ?? '-'}</TableCell>
                <TableCell>{item.option_name ?? '-'}</TableCell>
                <TableCell>{item.tube_spec ?? '-'}</TableCell>
                <TableCell>{item.thread_spec ?? '-'}</TableCell>
                <TableCell className='max-w-xs truncate'>{item.recommended_use ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
