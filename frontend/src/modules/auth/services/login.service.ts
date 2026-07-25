import { SupabaseClient } from "@supabase/supabase-js";
import { LoginRequestDto } from "../schemas/login.schema";
import { UnauthorizedError } from "@/lib/errors";
import { AUTH_ERROR_MESSAGES } from "../constants";

export async function loginService(
  supabase: SupabaseClient,
  dto: LoginRequestDto,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: dto.email,
    password: dto.password,
  });

  if (error) {
    throw new UnauthorizedError(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Once authenticated, fetching the current user profile handles the session return
  // This will be called by the route handler if needed, or the route handler can just return success
  return { success: true };
}
