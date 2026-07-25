import { SupabaseClient } from "@supabase/supabase-js";
import { LoginRequestDto } from "../schemas/login.schema";
import { UnauthorizedError } from "@/lib/errors";
import { AUTH_ERROR_MESSAGES } from "../constants";
import { mapToUserSession } from "../mappers/user-profile.mapper";
import { TABLES } from "@/lib/constants";
import { UserSessionDto } from "../dto/user-session.dto";

export async function loginService(
  supabase: SupabaseClient,
  dto: LoginRequestDto,
): Promise<UserSessionDto> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: dto.email,
    password: dto.password,
  });

  if (error || !data.user) {
    throw new UnauthorizedError(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  console.log(data.user.id);

  const { data: profile, error: dbError } = await supabase
    .from(TABLES.USER_PROFILES)
    .select("*")
    .eq("auth_user_id", data.user.id)
    .single();

  console.log(dbError);
  console.log(profile);

  if (dbError || !profile) {
    throw new Error("User profile not found.");
  }

  return mapToUserSession(profile);
}
