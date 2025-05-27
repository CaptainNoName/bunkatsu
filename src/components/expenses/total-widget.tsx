import { useQuery } from '@tanstack/react-query'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import type { DateRange } from 'react-day-picker'
import { getReceiptsTotalQueryOptions } from '@/server/receipt'

export const TotalWidget = ({ dateRange }: { dateRange?: DateRange }) => {
  const { data, isLoading } = useQuery(getReceiptsTotalQueryOptions(dateRange))
  return (
    <Card>
      <CardHeader>
        <CardDescription>Wydano</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {isLoading ? (
            <Skeleton className="w-30 h-[30px]" />
          ) : (
            <span>{data} zł</span>
          )}
        </CardTitle>
        <div className="text-muted-foreground text-sm">
          Podsumowanie wydatków z wybranego zakresu
        </div>
      </CardHeader>
    </Card>
  )
}
