import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const ReceiptDetails = () => {
  const [groupOpen, setGroupOpen] = useState(false)
  const [groupValue, setGroupValue] = useState('')
  const [payerOpen, setPayerOpen] = useState(false)
  const [payerValue, setPayerValue] = useState('')

  const frameworks = [
    {
      value: 'next.js',
      label: 'Next.js',
    },
    {
      value: 'sveltekit',
      label: 'SvelteKit',
    },
    {
      value: 'nuxt.js',
      label: 'Nuxt.js',
    },
    {
      value: 'remix',
      label: 'Remix',
    },
    {
      value: 'astro',
      label: 'Astro',
    },
  ]

  const payers = [
    {
      value: 'jan',
      label: 'Jan Kowalski',
    },
    {
      value: 'anna',
      label: 'Anna Nowak',
    },
    {
      value: 'piotr',
      label: 'Piotr Wiśniewski',
    },
  ]

  return (
    <>
      <p className="text-lg font-bold mb-4">Szczegóły</p>
      <div className="flex justify-between mb-2">
        <div>
          <p className="text-sm font-bold">AUCHAN</p>
          <p className="text-xs text-muted-foreground">Nazwa</p>
        </div>
        <div>
          <p className="text-sm font-bold text-right">2025-05-31</p>
          <p className="text-xs text-muted-foreground text-right">Data</p>
        </div>
      </div>
      <div className="flex justify-between">
        <Popover open={groupOpen} onOpenChange={setGroupOpen}>
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="cursor-pointer hover:bg-muted/50 rounded-sm p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setGroupOpen(true)
                }
              }}
            >
              <p className="text-sm font-bold" aria-expanded={groupOpen}>
                {groupValue
                  ? frameworks.find(
                      (framework) => framework.value === groupValue,
                    )?.label
                  : 'Brak'}
              </p>
              <p className="text-xs text-muted-foreground">Grupa</p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj grupę..." className="h-9" />
              <CommandList>
                <CommandEmpty>Brak grupy</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setGroupValue(
                          currentValue === groupValue ? '' : currentValue,
                        )
                        setGroupOpen(false)
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          groupValue === framework.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={payerOpen} onOpenChange={setPayerOpen}>
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="cursor-pointer hover:bg-muted/50 rounded-sm p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setPayerOpen(true)
                }
              }}
            >
              <p
                className="text-sm font-bold text-right"
                aria-expanded={payerOpen}
              >
                {payerValue
                  ? payers.find((payer) => payer.value === payerValue)?.label
                  : 'Brak'}
              </p>
              <p className="text-xs text-muted-foreground text-right">
                Zapłacił
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj osobę..." className="h-9" />
              <CommandList>
                <CommandEmpty>Brak osoby</CommandEmpty>
                <CommandGroup>
                  {payers.map((payer) => (
                    <CommandItem
                      key={payer.value}
                      value={payer.value}
                      onSelect={(currentValue) => {
                        setPayerValue(
                          currentValue === payerValue ? '' : currentValue,
                        )
                        setPayerOpen(false)
                      }}
                    >
                      {payer.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          payerValue === payer.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button className="w-full mt-2">Rozliczony</Button>
    </>
  )
}
