import { errorResponse, successResponse } from "@/lib/api/response";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient();
    const userSession = await getCurrentUserService(supabase);

    return successResponse(userSession);
  } catch (error) {
    return errorResponse(error);
  }
}
