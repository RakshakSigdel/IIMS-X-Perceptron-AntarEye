import { errorResponse, successResponse } from "@/lib/api/response";
import { ForbiddenError, ValidationError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { createPatientSchema, createPatientService, listPatientsService } from "@/modules/patients";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") {
      throw new ForbiddenError("Only doctors can access patients.");
    }

    const patients = await listPatientsService(supabase, userSession.id);
    
    return successResponse(patients);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") {
      throw new ForbiddenError("Only doctors can create patients.");
    }

    const body = await request.json();
    
    const result = createPatientSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError("Validation failed", z.treeifyError(result.error));
    }

    const patient = await createPatientService(supabase, result.data, userSession.id);

    return successResponse(patient, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
