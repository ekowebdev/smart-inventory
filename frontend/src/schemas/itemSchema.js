import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name is too long" }),
  sku: z.string()
    .min(1, { message: "SKU code is required" })
    .max(50, { message: "SKU is too long" }),
  category: z.string()
    .min(1, { message: "Category is required" }),
  description: z.string().optional(),
  price: z.coerce.number()
    .min(1, { message: "Price must be at least 1.00" }),
  physical_stock: z.coerce.number()
    .int()
    .min(0, { message: "Physical stock cannot be negative" }),
});
