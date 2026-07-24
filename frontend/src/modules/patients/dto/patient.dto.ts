import { Gender } from "@/lib/constants";

export interface PatientDto {
  id: string;
  doctorId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientUpdateDto {
    updated_at: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: Date;
    gender?: string;
    phone?: string | null;
    address?: string | null;
}
