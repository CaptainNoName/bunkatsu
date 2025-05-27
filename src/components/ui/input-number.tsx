import * as React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface InputNumberProps
  extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  financialMode?: boolean
  decimalPlaces?: number
  maxDigits?: number
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      value = '',
      onChange,
      placeholder = '0',
      financialMode = false,
      decimalPlaces = 2,
      maxDigits = 10,
      ...props
    },
    ref,
  ) => {
    const formatFinancialValue = (numericValue: string): string => {
      if (!numericValue) return ''
      if (numericValue.length === 0) return ''

      const paddedValue = numericValue.padStart(decimalPlaces + 1, '0')
      const integerPart = paddedValue.slice(0, -decimalPlaces)
      const decimalPart = paddedValue.slice(-decimalPlaces)
      const cleanIntegerPart = integerPart.replace(/^0+/, '') || '0'

      return decimalPlaces > 0
        ? `${cleanIntegerPart}.${decimalPart}`
        : cleanIntegerPart
    }

    const formatRegularValue = (inputValue: string): string => {
      const validPattern = new RegExp(`^[0-9]*\\.?[0-9]{0,${decimalPlaces}}$`)

      if (validPattern.test(inputValue)) {
        const dotCount = (inputValue.match(/\./g) || []).length
        if (dotCount <= 1) {
          return inputValue
        }
      }
      return value
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      if (financialMode) {
        const numericOnly = inputValue.replace(/[^0-9]/g, '')

        if (numericOnly.length <= maxDigits) {
          const displayValue = formatFinancialValue(numericOnly)
          onChange?.(displayValue)
        }
      } else {
        const formattedValue = formatRegularValue(inputValue)
        onChange?.(formattedValue)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ]

      if (e.ctrlKey || e.metaKey) return
      if (allowedKeys.includes(e.key)) return
      if (/^[0-9]$/.test(e.key)) return

      if (
        !financialMode &&
        e.key === '.' &&
        !value.includes('.') &&
        decimalPlaces > 0
      ) {
        return
      }

      e.preventDefault()
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(className)}
        {...props}
      />
    )
  },
)

InputNumber.displayName = 'InputNumber'

export { InputNumber }
