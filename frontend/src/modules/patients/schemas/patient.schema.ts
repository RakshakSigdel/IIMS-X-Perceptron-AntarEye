import { z } from "zod";
import { Gender } from "@/lib/constants";

export const createPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date("Must be a valid date (YYYY-MM-DD)"),
  gender: z.enum(Gender),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientRequestDto = z.infer<typeof createPatientSchema>;
export type UpdatePatientRequestDto = z.infer<typeof updatePatientSchema>;
