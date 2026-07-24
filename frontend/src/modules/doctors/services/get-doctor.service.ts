import { SupabaseClient } from "@supabase/supabase-js";
import { TABLES, UserRole } from "@/lib/constants";
import { mapToDoctorDto } from "../mappers/doctor.mapper";
import { DoctorDto } from "../dto/doctor.dto";
import { NotFoundError } from "@/lib/errors";
import { DOCTOR_ERROR_MESSAGES } from "../constants";

export async function getDoctorService(
  supabase: SupabaseClient,
  doctorId: string
): Promise<DoctorDto> {
  const { data, error } = await supabase
    .from(TABLES.USER_PROFILES)
    .select("*")
    .eq("id", doctorId)
    .eq("role", UserRole.DOCTOR)
    .single();

  if (error || !data) {
    throw new NotFoundError(DOCTOR_ERROR_MESSAGES.NOT_FOUND);
  }

  return mapToDoctorDto(data);
}
