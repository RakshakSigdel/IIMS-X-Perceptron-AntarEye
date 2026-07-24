import { errorResponse, successResponse } from "@/lib/api/response";
import { createServiceClient } from "@/lib/supabase/server";
import { logoutService } from "@/modules/auth";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient();
    await logoutService(supabase);

    return successResponse({ message: "Successfully logged out" });
  } catch (error) {
    return errorResponse(error);
  }
}
