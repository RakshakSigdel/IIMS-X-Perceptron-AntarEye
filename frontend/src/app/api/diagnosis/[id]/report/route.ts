import { errorResponse, successResponse } from "@/lib/api/response";
import { ForbiddenError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { downloadReportService, generateReportService } from "@/modules/reports";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
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
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role !== "doctor") throw new ForbiddenError();

    const result = await downloadReportService(supabase, id, userSession.id);
    
    // Redirect the client directly to the signed URL to download
    return NextResponse.redirect(result.reportUrl);
  } catch (error) {
    return errorResponse(error);
  }
}
