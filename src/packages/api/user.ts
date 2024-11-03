import { z } from "zod";
import { laboratorySchema } from "./lab";

export const userSchema = z.object({
  userId: z.number().int(),
  username: z.string(),
  email: z.string().email().nullable(), // Allow null values
  password: z.string(),
  firstName: z.string(),
  middleName: z.string().nullable(), // Allow null values
  lastName: z.string(),
  designation: z.string(),
  status: z.string(),
  laboratory: laboratorySchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  otp: z.string().nullable(), // Allow null values
  labId: z.number().int(),
});

export type UserSchema = z.infer<typeof userSchema>;
