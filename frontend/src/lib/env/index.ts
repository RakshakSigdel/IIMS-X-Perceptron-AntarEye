import { serverEnv } from "./server";
import { clientEnv } from "./client";

// Expose env based on where it's being used. Server can access all, client only public.
export const env = {
  ...clientEnv,
  // Ensure server variables are not bundled into the client
  ...(typeof window === "undefined" ? serverEnv : {}),
} as typeof clientEnv & typeof serverEnv;
