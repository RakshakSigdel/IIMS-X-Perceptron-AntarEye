import { z } from "zod";
import { AUTH_ERROR_MESSAGES } from "../constants";

export const loginSchema = z.object({
  email: z.email({ message: AUTH_ERROR_MESSAGES.INVALID_EMAIL }),
  password: z.string().min(1, { message: AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED }),
});

export type LoginRequestDto = z.infer<typeof loginSchema>;
