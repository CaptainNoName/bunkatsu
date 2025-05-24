import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import zodToJsonSchema from 'zod-to-json-schema'
import Together from 'together-ai'
import { env } from '@/env'

const together = new Together({
  apiKey: env.TOGETHER_API_KEY,
})

const itemSchema = z.object({
  name: z.string().describe('Name of the item'),
  quantity: z.number().describe('Quantity of the item'),
  price: z
    .number()
    .describe(
      'The total cost for the quantity actually purchased, calculated as unit_price × quantity (sometimes called extended price or item total)',
    ),
  unitPrice: z
    .number()
    .describe(
      'The cost of one measurement unit of the item (e.g., price per kilogram, liter, or single piece)',
    ),
  code: z.string().optional().describe('Code of the item'),
})

const schema = z.object({
  businessName: z
    .string()
    .optional()
    .describe('Name of the business on the receipt'),
  date: z.string().optional().describe('Date when the receipt was created'),
  total: z.number().optional().describe('Total amount on the receipt'),
  items: z.array(itemSchema).describe('Items on the receipt'),
})

const systemPrompt = `
  You are an expert at extracting information from receipts.

  Your task:
  1. Analyze the receipt image provided
  2. Extract all relevant billing information
  3. Format the data in a structured way

  Guidelines for extraction:
  - Identify the restaurant/business name and location if available otherwise just return null
  - Find the receipt date or return null, date format should be YYYY-MM-DD but if day it's less than 10 don't add a 0 in front
  - Extract each item with its name, quantity, full price, total price and product code if available
  - unitPrice is the price of one measurement unit of the item (e.g., price per kilogram, liter, or single piece)
  - price is the total cost for the quantity actually purchased, calculated as unit_price * quantity (sometimes called extended price or item total)
  - Ensure all numerical values are accurate
  - Convert all prices to decimal numbers
  
  IMPORTANT: Extract ONLY the information visible in the receipt. Do not make assumptions about missing data.
`

export type ExtractSchemaType = z.infer<typeof schema>

export const scrapeBill = createServerFn({ method: 'POST' })
  .validator((data: string | null) => data)
  .handler(async ({ data }) => {
    if (!data) {
      throw new Error('No data provided')
    }

    const jsonSchema = zodToJsonSchema(schema, {
      target: 'openAi',
    })

    const extract = await together.chat.completions.create({
      model: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            {
              type: 'image_url',
              image_url: {
                url: data,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object', schema: jsonSchema },
    })

    if (extract.choices[0]?.message?.content) {
      const output = JSON.parse(
        extract.choices[0].message.content,
      ) as ExtractSchemaType

      return output
    }
    throw new Error('No content returned from Llama 4 vision')
  })
