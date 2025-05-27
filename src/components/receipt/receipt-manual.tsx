import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Card } from '../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { InputNumber } from '../ui/input-number'
import { Button } from '../ui/button'
import { DatePicker } from '../date-picker'
import { createReceipt } from '@/server/receipt'

export const ReceiptManual = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const createReceiptFn = useServerFn(createReceipt)

  const createReceiptMutation = useMutation({
    mutationFn: createReceiptFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] })
      navigate({ to: '/dashboard/expenses' })
      toast.success('Paragon został pomyślnie zapisany!')
      form.reset()
    },
    onError: (error) => {
      console.error('Błąd podczas zapisywania paragonu:', error)
      toast.error('Nie udało się zapisać paragonu. Spróbuj ponownie.')
    },
  })

  const receiptWithItemsSchema = z.object({
    business_name: z.string().min(1, 'Nazwa firmy jest wymagana'),
    date: z.date({ required_error: 'Data jest wymagana' }),
    total: z.string().min(1, 'Suma jest wymagana'),
    items: z
      .array(
        z.object({
          name: z.string().min(1, 'Nazwa produktu jest wymagana'),
          quantity: z.string().min(1, 'Ilość jest wymagana'),
          price: z.string().min(1, 'Cena jest wymagana'),
          unit_price: z.string().min(1, 'Cena jednostkowa jest wymagana'),
          code: z.string().optional(),
        }),
      )
      .min(1, 'Przynajmniej jeden produkt jest wymagany'),
  })

  const form = useForm<z.infer<typeof receiptWithItemsSchema>>({
    resolver: zodResolver(receiptWithItemsSchema),
    defaultValues: {
      business_name: '',
      date: new Date(),
      total: '',
      items: [
        {
          name: '',
          quantity: '',
          price: '',
          unit_price: '',
          code: '',
        },
      ],
    },
  })

  const addItem = (index: number) => {
    const currentItems = form.getValues('items')
    const newItems = [...currentItems]
    newItems.splice(index + 1, 0, {
      name: '',
      quantity: '',
      price: '',
      unit_price: '',
      code: '',
    })
    form.setValue('items', newItems)
  }

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items')
    if (currentItems.length > 1) {
      const newItems = currentItems.filter((_, i) => i !== index)
      form.setValue('items', newItems)
    }
  }

  const onSubmit = (data: z.infer<typeof receiptWithItemsSchema>) => {
    createReceiptMutation.mutate({
      data: {
        businessName: data.business_name,
        date: data.date.toISOString().split('T')[0],
        total: parseFloat(data.total),
        items: data.items.map((item) => ({
          name: item.name,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          unitPrice: parseFloat(item.unit_price),
          code: item.code || undefined,
        })),
      },
    })
  }

  return (
    <Card className="h-[1000px] p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <div className="grid grid-rows-[auto_1fr_auto] h-full space-y-4">
            <div className="grid grid-cols-3 gap-4 ">
              <p className="text-2xl font-bold col-span-3">Dane paragonu</p>
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa firmy</FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwa firmy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suma</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="0.00"
                        financialMode={true}
                        decimalPlaces={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="overflow-auto">
              <div className="space-y-4 content-start">
                <p className="text-2xl font-bold">Towary</p>

                {form.watch('items').map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Nazwa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Kod" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputNumber
                              placeholder="Ilość"
                              financialMode={true}
                              decimalPlaces={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.unit_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputNumber
                              placeholder="Cena jednostkowa"
                              financialMode={true}
                              decimalPlaces={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputNumber
                              placeholder="Cena"
                              financialMode={true}
                              decimalPlaces={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItem(index)}
                        className="h-9 w-9 p-0"
                      >
                        +
                      </Button>
                      {form.watch('items').length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="h-9 w-9 p-0"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={createReceiptMutation.isPending}>
              {createReceiptMutation.isPending
                ? 'Zapisywanie...'
                : 'Zapisz paragon'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
