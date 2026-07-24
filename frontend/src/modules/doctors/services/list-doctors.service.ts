import { SupabaseClient } from "@supabase/supabase-js";
import { TABLES, UserRole } from "@/lib/constants";
import { mapToDoctorDtoList } from "../mappers/doctor.mapper";
import { DoctorDto } from "../dto/doctor.dto";
import { ExternalServiceError } from "@/lib/errors";

export async function listDoctorsService(
  supabase: SupabaseClient
): Promise<DoctorDto[]> {
  const { data, error } = await supabase
    .from(TABLES.USER_PROFILES)
    .select("*")
    .eq("role", UserRole.DOCTOR)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ExternalServiceError("Failed to fetch doctors");
  }

  return mapToDoctorDtoList(data || []);
}
