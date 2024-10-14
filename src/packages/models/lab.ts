import { z } from "zod";

export const laboratorySchema = z.object({
  labId: z.number().int().optional(),
  labName: z.string(),
  location: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
