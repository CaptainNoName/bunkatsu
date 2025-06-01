import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { DateRange } from 'react-day-picker'
import { getReceiptsQueryOptions } from '@/server/receipt'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range'
import { ReceiptWidget } from '@/components/expenses/receipt/receipt-widget'
import { TotalWidget } from '@/components/expenses/total-widget'
import { GroupsWidget } from '@/components/expenses/groups/groups-widget'

const getDefaultDateRange = (): DateRange => ({
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  to: new Date(),
})

export const Route = createFileRoute('/dashboard/expenses/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getReceiptsQueryOptions(getDefaultDateRange()),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getDefaultDateRange(),
  )

  return (
    <>
      <header className="flex h-16 items-center gap-2 border-b px-4 justify-between">
        <p className="text-2xl font-bold">Wydatki</p>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <Button asChild>
            <Link to="/dashboard/expenses/create">Dodaj</Link>
          </Button>
        </div>
      </header>
      <div className="h-full flex divide-x divide-accent-foreground-muted">
        <ReceiptWidget dateRange={dateRange} />
        <div className="min-h-0 p-4 flex-1 grid grid-cols-4 gap-4 auto-rows-min">
          <p className="text-lg font-bold col-span-4">Overview</p>
          <TotalWidget dateRange={dateRange} />
          <GroupsWidget />
        </div>
      </div>
    </>
  )
}
