import { z } from "zod";
import { categorySchema, laboratorySchema, supplierSchema } from "./lab";

export const materialSchema = z.object({
  materialId: z.number().optional(),
  labId: z.number(),
  laboratory: laboratorySchema,
  category: categorySchema,
  supplier: supplierSchema,
  categoryId: z.number(),
  supplierId: z.number(),
  itemCode: z.string().min(1),
  itemName: z.string().min(1),
  unit: z.string().min(1),
  location: z.string().min(1),
  expiryDate: z.string().datetime(),
  cost: z.number().positive(),
  description: z.string().optional(),
  notes: z.string().optional(),
  quantityAvailable: z.number().int().nonnegative(),
  reorderThreshold: z.number().int().nonnegative(),
  maxThreshold: z.number().int().nonnegative(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Material = z.infer<typeof materialSchema>;

export const validateMaterial = (data: any) => {
  try {
    const parsedData = materialSchema.parse(data);
    return { valid: true, parsedData };
  } catch (error) {
    return { valid: false, errors: error };
  }
};
