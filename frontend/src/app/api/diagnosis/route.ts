import { errorResponse, successResponse } from "@/lib/api/response";
import { ForbiddenError, ValidationError } from "@/lib/errors";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { createDiagnosisService, listDiagnosisService } from "@/modules/diagnosis";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const url = new URL(request.url);
    const patientId = url.searchParams.get("patientId");

    const diagnoses = await listDiagnosisService(supabase, userSession.id, patientId || undefined);
    
    return successResponse(diagnoses);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const formData = await request.formData();
    const patientId = formData.get("patientId") as string;
    const imageFile = formData.get("image") as File;

    if (!patientId || !imageFile) {
      throw new ValidationError("patientId and image are required");
    }

    // Basic file validation
    if (!["image/jpeg", "image/png"].includes(imageFile.type)) {
      throw new ValidationError("Only JPEG and PNG images are supported");
    }

    const supabaseService = await createServiceClient();

    const diagnosis = await createDiagnosisService(supabaseService, patientId, userSession.id, imageFile);

    return successResponse(diagnosis, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
