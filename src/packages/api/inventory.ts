import { z } from "zod";
import { categorySchema, laboratorySchema, supplierSchema } from "./lab";
import { userSchema } from "./user";

// Material Schema remains the same
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

// InventoryLog Schema
export const inventoryLogSchema = z.object({
  inventoryLogId: z.number().optional(),
  userId: z.number(),
  user: userSchema.optional(),
  materialId: z.number(),
  material: materialSchema.optional(),
  date: z.string(),
  quantity: z.number(),
  source: z.string().optional(),
  remarks: z.string().optional(),
});
