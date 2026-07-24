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
