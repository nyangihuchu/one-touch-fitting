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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제품명</TableHead>
          <TableHead>모델</TableHead>
          <TableHead>옵션명</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>튜브규격</TableHead>
          <TableHead>나사규격</TableHead>
          <TableHead>형태</TableHead>
          <TableHead>추천용도</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className='font-medium'>{item.product_name ?? '-'}</TableCell>
            <TableCell>{item.model ?? '-'}</TableCell>
            <TableCell>{item.option_name ?? '-'}</TableCell>
            <TableCell>{item.category ?? '-'}</TableCell>
            <TableCell>{item.tube_spec ?? '-'}</TableCell>
            <TableCell>{item.thread_spec ?? '-'}</TableCell>
            <TableCell>{item.shape ?? '-'}</TableCell>
            <TableCell className='max-w-xs truncate'>{item.recommended_use ?? '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
