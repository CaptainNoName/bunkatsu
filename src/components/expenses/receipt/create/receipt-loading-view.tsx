import { Button } from '../../../ui/button'
import { Separator } from '../../../ui/separator'
import { Skeleton } from '../../../ui/skeleton'

export const ReceiptLoadingView = () => {
  return (
    <div className="w-full min-h-full max-h-full grid grid-rows-[auto_1fr_auto] gap-5">
      <div>
        <Skeleton className="w-[200px] h-8 mb-2" />
        <Skeleton className="w-[120px] h-5" />
        <Separator className="my-2" />
      </div>
      <div className="overflow-y-auto ">
        {Array.from({ length: 10 }).map((_) => (
          <div className="flex justify-between mb-2">
            <div>
              <Skeleton className="w-[120px] h-[24px] mb-1" />
              <Skeleton className="w-[80px] h-[20px] mb-1" />
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="w-[120px] h-[24px] mb-1" />
              <Skeleton className="w-[80px] h-[20px] mb-1" />
            </div>
          </div>
        ))}
      </div>
      <Button disabled>Zatwierdź</Button>
    </div>
  )
}
