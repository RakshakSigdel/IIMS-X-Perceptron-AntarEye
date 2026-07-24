import { z } from "zod";

const serverEnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  AI_API_BASE_URL: z.url().optional(), // Optional depending on how it's used locally vs prod
});

const parsedServerEnv = serverEnvSchema.safeParse({
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  AI_API_BASE_URL: process.env.AI_API_BASE_URL,
});

if (!parsedServerEnv.success) {
  console.error("Invalid server environment variables:", z.treeifyError(parsedServerEnv.error));
  throw new Error("Invalid server environment variables");
}

export const serverEnv = parsedServerEnv.data;
