import { z } from 'zod';

export const transactionSchema = z.object({
  item_id: z.coerce.number()
    .min(1, { message: "Target asset selection is required" }),
  quantity: z.coerce.number()
    .int()
    .min(1, { message: "Quantity must be at least 1 unit" }),
  reference_id: z.string()
    .min(1, { message: "Reference ID (Recipient or Source) is required" })
    .max(100, { message: "Reference ID is too long" }),
  notes: z.string().optional(),
});
