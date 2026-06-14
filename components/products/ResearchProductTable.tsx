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
    /* 모바일에서 테이블 가로 스크롤 허용 */
    <div className='w-full overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            {/* 항상 표시 */}
            <TableHead>제품명</TableHead>
            <TableHead>카테고리</TableHead>
            {/* sm(640px) 이상만 표시 */}
            <TableHead className='hidden sm:table-cell'>모델</TableHead>
            <TableHead className='hidden sm:table-cell'>형태</TableHead>
            {/* md(768px) 이상만 표시 */}
            <TableHead className='hidden md:table-cell'>옵션명</TableHead>
            <TableHead className='hidden md:table-cell'>튜브규격</TableHead>
            <TableHead className='hidden md:table-cell'>나사규격</TableHead>
            <TableHead className='hidden md:table-cell'>추천용도</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {/* 항상 표시 */}
              <TableCell className='font-medium'>{item.product_name ?? '-'}</TableCell>
              <TableCell>{item.category ?? '-'}</TableCell>
              {/* sm(640px) 이상만 표시 */}
              <TableCell className='hidden sm:table-cell'>{item.model ?? '-'}</TableCell>
              <TableCell className='hidden sm:table-cell'>{item.shape ?? '-'}</TableCell>
              {/* md(768px) 이상만 표시 */}
              <TableCell className='hidden md:table-cell'>{item.option_name ?? '-'}</TableCell>
              <TableCell className='hidden md:table-cell'>{item.tube_spec ?? '-'}</TableCell>
              <TableCell className='hidden md:table-cell'>{item.thread_spec ?? '-'}</TableCell>
              <TableCell className='hidden md:table-cell max-w-xs truncate'>{item.recommended_use ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
