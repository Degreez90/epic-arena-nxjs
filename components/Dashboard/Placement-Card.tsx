import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface PlacementCardProps {
  title: string
  count: number
  total: number
  icon: 'trophy' | 'medal' | 'award'
  color: string
  description: string
}

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
}

export function PlacementCard({
  title,
  count,
  total,
  icon,
  color,
  description,
}: PlacementCardProps) {
  const Icon = iconMap[icon]
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
          <Icon className={`h-4 w-4 ${color.replace('text-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='text-2xl font-bold'>{count}</div>
          <Badge variant='secondary'>{percentage.toFixed(1)}% of total</Badge>
        </div>
        <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        <Progress value={percentage} className='mt-4' />
      </CardContent>
    </Card>
  )
}
