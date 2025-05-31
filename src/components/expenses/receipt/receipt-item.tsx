import type { ReceiptItem as ReceiptItemType } from '@/db/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type ReceiptItemProps = {
  item: ReceiptItemType
}

export const ReceiptItem = ({ item }: ReceiptItemProps) => {
  return (
    <div className="flex justify-between items-center pb-2">
      <div>
        <p className="text-sm font-bold">{item.name}</p>
        <p className="text-xs text-foreground-muted">{item.code}</p>
      </div>
      <div>
        <p className="text-sm font-bold">{item.price} zł</p>
        <p className="text-xs text-foreground-muted text-right">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-2">
            <Avatar className="size-5">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="size-5">
              <AvatarImage src="https://github.com/leerob.png" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar className="size-5">
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
        </p>
      </div>
    </div>
  )
}
