import { SupabaseClient } from "@supabase/supabase-js";
import { UnauthorizedError, NotFoundError } from "@/lib/errors";
import { AUTH_ERROR_MESSAGES } from "../constants";
import { mapToUserSession } from "../mappers/user-profile.mapper";
import { TABLES } from "@/lib/constants";
import { UserSessionDto } from "../dto/user-session.dto";

export async function getCurrentUserService(
  supabase: SupabaseClient,
): Promise<UserSessionDto> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new UnauthorizedError(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
  }

  const { data: profile, error: dbError } = await supabase
    .from(TABLES.USER_PROFILES)
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (dbError || !profile) {
    throw new NotFoundError(AUTH_ERROR_MESSAGES.PROFILE_NOT_FOUND);
  }

  return mapToUserSession(profile);
}
