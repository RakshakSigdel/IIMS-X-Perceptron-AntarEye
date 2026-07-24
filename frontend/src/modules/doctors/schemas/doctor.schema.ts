import { z } from "zod";

export const createDoctorSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export const updateDoctorSchema = z.object({
  fullName: z.string().min(2).optional(),
});

export type CreateDoctorRequestDto = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorRequestDto = z.infer<typeof updateDoctorSchema>;
