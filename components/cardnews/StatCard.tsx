import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  variant?: 'default' | 'success' | 'warning'
}

const iconVariantClass: Record<NonNullable<StatCardProps['variant']>, string> = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-500 dark:text-orange-400',
}

export function StatCard({ title, value, description, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        <Icon className={cn('h-5 w-5 shrink-0', iconVariantClass[variant])} />
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-bold'>{value}</p>
        {description && (
          <p className='mt-1 text-xs text-muted-foreground line-clamp-2'>{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
