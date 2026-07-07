import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  icon?: React.ReactNode
  className?: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
  trend,
}: StatCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon && <div className='text-muted-foreground'>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-xs text-muted-foreground'>{description}</p>
        )}
        {trend && (
          <div className='flex items-center pt-2'>
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
            <span className='text-xs text-muted-foreground ml-2'>
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
