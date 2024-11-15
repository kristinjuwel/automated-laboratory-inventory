import { z } from "zod";

export const laboratorySchema = z.object({
  labId: z.number().int().optional(),
  labName: z.string(),
  location: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const categorySchema = z.object({
  categoryId: z.number().optional(),
  labId: z.number(),
  shortName: z.string().min(1),
  subcategory: z.string().min(1),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const supplierSchema = z.object({
  supplierId: z.number().optional(),
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  phoneNumber: z.string().min(1),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type Category = z.infer<typeof categorySchema>;
