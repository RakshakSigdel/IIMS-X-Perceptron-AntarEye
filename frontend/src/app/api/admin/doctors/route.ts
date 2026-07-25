import { errorResponse, successResponse } from "@/lib/api/response";
import { ValidationError } from "@/lib/errors";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createDoctorSchema, createDoctorService, listDoctorsService } from "@/modules/doctors";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function GET(_request: NextRequest) {
  try {
    // User-scoped client — proxy.ts already guards admin access
    const supabase = await createClient();
    const doctors = await listDoctorsService(supabase);
    
    return successResponse(doctors);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = createDoctorSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError("Validation failed", z.treeifyError(result.error));
    }

    // Creating doctors requires Service Role (Auth Admin API)
    const serviceClient = await createServiceClient();
    const doctor = await createDoctorService(serviceClient, result.data);

    return successResponse(doctor, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
