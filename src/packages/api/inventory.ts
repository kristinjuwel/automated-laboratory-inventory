import { z } from "zod";
import { categorySchema, laboratorySchema, supplierSchema } from "./lab";
import { userSchema } from "./user";

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
  expiryDate: z.string().datetime().optional(),
  cost: z.number().positive(),
  description: z.string().optional(),
  notes: z.string().optional(),
  quantityAvailable: z.number().int().nonnegative().optional(),
  reorderThreshold: z.number().int().nonnegative().optional(),
  maxThreshold: z.number().int().nonnegative().optional(),
  lotNo: z.string().optional(),
  totalNoContainers: z.number().optional(),
});

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

export const borrowSchema = z.object({
  borrowId: z.number().optional(),
  userId: z.number(),
  user: userSchema,
  materialId: z.number(),
  material: materialSchema.optional(),
  dateBorrowed: z.string().optional(),
  detailsOfBorrowed: z.string().optional(),
  equipment: z.string().optional(),
  qty: z.number().optional(),
  unit: z.string().optional(),
  borrowerDetail: z.string().optional(),
  department: z.string().optional(),
  timeBorrowed: z.string().optional(),
  dateReturned: z.string().optional(),
  timeReturned: z.string().optional(),
  remarks: z.string().optional(),
  damageMaterials: z.string().optional(),
  status: z.string().optional(),
});

export const dispositionSchema = z.object({
  dispositionId: z.number().optional(),
  userId: z.number(),
  user: userSchema,
  materialId: z.number(),
  material: materialSchema,
  itemDescription: z.string().optional(),
  qty: z.number().optional(),
  reasonForDisposal: z.string().optional(),
  disposalMethod: z.string().optional(),
  disposedBy: z.string().optional(),
  dateDisposed: z.string().optional(),
  comments: z.string().optional(),
});

export const calibrationSchema = z.object({
  calibrationId: z.number().optional(),
  userId: z.number(),
  user: userSchema,
  materialId: z.number(),
  material: materialSchema,
  calibrationDate: z.string(),
  nextCalibration: z.string(),
  notes: z.string().optional(),
  file: z.string(),
  attachments: z.string(),
  fileType: z.string().optional(),
});

export type DispositionSchema = z.infer<typeof dispositionSchema>;
export type BorrowSchema = z.infer<typeof borrowSchema>;
export type InventoryLogSchema = z.infer<typeof inventoryLogSchema>;
export type MaterialSchema = z.infer<typeof materialSchema>;
export type CalibrationSchema = z.infer<typeof calibrationSchema>;
