import { errorResponse, successResponse } from "@/lib/api/response";
import { ForbiddenError, ValidationError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import {
  getPatientService,
  updatePatientSchema,
  updatePatientService
} from "@/modules/patients";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const patient = await getPatientService(supabase, id, userSession.id);
    
    return successResponse(patient);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const body = await request.json();
    
    const result = updatePatientSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError("Validation failed", z.treeifyError(result.error));
    }

    const patient = await updatePatientService(supabase, id, result.data, userSession.id);

    return successResponse(patient);
  } catch (error) {
    return errorResponse(error);
  }
}
