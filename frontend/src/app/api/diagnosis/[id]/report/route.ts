import { errorResponse, successResponse } from "@/lib/api/response";
import { ForbiddenError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { downloadReportService, generateReportService } from "@/modules/reports";
import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const result = await generateReportService(supabase, id, userSession.id);
    
    return successResponse(result, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const result = await downloadReportService(supabase, id, userSession.id);
    
    // Return the signed URL so the frontend can display it in a modal
    return successResponse(result, 200);
  } catch (error) {
    return errorResponse(error);
  }
}
