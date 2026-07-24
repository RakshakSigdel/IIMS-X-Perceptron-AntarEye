import { errorResponse, successResponse } from "@/lib/api/response";
import { ForbiddenError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { getDiagnosisService } from "@/modules/diagnosis";
import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const diagnosis = await getDiagnosisService(supabase, id, userSession.id);
    
    return successResponse(diagnosis);
  } catch (error) {
    return errorResponse(error);
  }
}
