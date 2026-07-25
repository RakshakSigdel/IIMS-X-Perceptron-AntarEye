import { errorResponse, successResponse } from "@/lib/api/response";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { getAdminDashboardService, getDoctorDashboardService } from "@/modules/dashboard";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    // Use the user-scoped client for auth check
    const supabase = await createClient();
    const userSession = await getCurrentUserService(supabase);
    
    if (userSession.role === "admin") {
      // Admin dashboard requires service client since it queries audit logs which might be RLS protected
      const serviceClient = await createServiceClient();
      const adminStats = await getAdminDashboardService(serviceClient);
      return successResponse(adminStats);
    }
    
    if (userSession.role === "doctor") {
      // Doctor dashboard uses the user-scoped client
      const doctorStats = await getDoctorDashboardService(supabase, userSession.id);
      return successResponse(doctorStats);
    }
    
    return NextResponse.json({ error: "Invalid role" }, { status: 403 });
  } catch (error) {
    return errorResponse(error);
  }
}
