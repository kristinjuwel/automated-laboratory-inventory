import { z } from "zod";
import { laboratorySchema } from "./lab";

export const userSchema = z.object({
  userId: z.number().int().optional(),
  username: z.string(),
  email: z.string().email().optional(),
  password: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  designation: z.string(),
  status: z.string(),
  laboratory: laboratorySchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  otp: z.string().optional(),
  labId: z.number().int().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
