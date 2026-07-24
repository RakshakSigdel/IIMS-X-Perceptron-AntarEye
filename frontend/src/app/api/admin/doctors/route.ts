import { errorResponse, successResponse } from "@/lib/api/response";
import { ValidationError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import { createDoctorSchema, createDoctorService, listDoctorsService } from "@/modules/doctors";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient();
    
    // Auth guard is handled by proxy.ts, but we still need the user for some services
    // if required. Here we just query.
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

    // Creating doctors requires Service Role
    const serviceClient = await createServiceClient();
    const doctor = await createDoctorService(serviceClient, result.data);

    return successResponse(doctor, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
