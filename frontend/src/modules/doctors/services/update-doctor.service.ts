import { SupabaseClient } from "@supabase/supabase-js";
import { UpdateDoctorRequestDto } from "../schemas/doctor.schema";
import { NotFoundError, ExternalServiceError } from "@/lib/errors";
import { DOCTOR_ERROR_MESSAGES } from "../constants";
import { TABLES, UserRole } from "@/lib/constants";
import { mapToDoctorDto } from "../mappers/doctor.mapper";
import { DoctorDto } from "../dto/doctor.dto";

export async function updateDoctorService(
  supabase: SupabaseClient,
  doctorId: string,
  dto: UpdateDoctorRequestDto,
  adminUserId: string
): Promise<DoctorDto> {
  const { data, error } = await supabase
    .from(TABLES.USER_PROFILES)
    .update({ full_name: dto.fullName, updated_at: new Date().toISOString() })
    .eq("id", doctorId)
    .eq("role", UserRole.DOCTOR)
    .select()
    .single();

  if (error) {
    throw new ExternalServiceError(DOCTOR_ERROR_MESSAGES.UPDATE_FAILED);
  }
  
  if (!data) {
    throw new NotFoundError(DOCTOR_ERROR_MESSAGES.NOT_FOUND);
  }

  // Audit
  await supabase.from(TABLES.AUDIT_LOGS).insert({
    actor_id: adminUserId,
    entity_type: "user_profile",
    entity_id: data.id,
    action: "update",
    metadata: dto
  });

  return mapToDoctorDto(data);
}
