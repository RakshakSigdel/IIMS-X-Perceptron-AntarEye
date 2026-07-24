import { SupabaseClient } from "@supabase/supabase-js";
import { CreateDoctorRequestDto } from "../schemas/doctor.schema";
import { ExternalServiceError, ConflictError } from "@/lib/errors";
import { DOCTOR_ERROR_MESSAGES } from "../constants";
import { TABLES, UserRole } from "@/lib/constants";
import { mapToDoctorDto } from "../mappers/doctor.mapper";
import { DoctorDto } from "../dto/doctor.dto";

// NOTE: This service MUST be called with the Supabase Service Role client,
// because it interacts with the Supabase Auth Admin API to create users.
export async function createDoctorService(
  serviceClient: SupabaseClient,
  dto: CreateDoctorRequestDto
): Promise<DoctorDto> {
  // 1. Create auth user
  const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
    email: dto.email,
    password: dto.password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      throw new ConflictError(DOCTOR_ERROR_MESSAGES.ALREADY_EXISTS);
    }
    throw new ExternalServiceError(DOCTOR_ERROR_MESSAGES.CREATION_FAILED);
  }

  const authUserId = authData.user.id;

  // 2. Create profile
  const { data: profile, error: dbError } = await serviceClient
    .from(TABLES.USER_PROFILES)
    .insert({
      auth_user_id: authUserId,
      email: dto.email,
      full_name: dto.fullName,
      role: UserRole.DOCTOR,
    })
    .select()
    .single();

  if (dbError) {
    // Attempt rollback of auth user if profile fails
    await serviceClient.auth.admin.deleteUser(authUserId);
    throw new ExternalServiceError(DOCTOR_ERROR_MESSAGES.CREATION_FAILED);
  }

  // 3. Log to audit_logs (System action since admin is acting)
  await serviceClient.from(TABLES.AUDIT_LOGS).insert({
    actor_id: authUserId, // In a real system, track the acting admin's ID
    entity_type: "user_profile",
    entity_id: profile.id,
    action: "create",
  });

  return mapToDoctorDto(profile);
}
