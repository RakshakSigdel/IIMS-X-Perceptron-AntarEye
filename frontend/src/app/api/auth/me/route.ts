import { errorResponse, successResponse } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserService } from "@/modules/auth";
import { type NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const userSession = await getCurrentUserService(supabase);

    return successResponse(userSession);
  } catch (error) {
    return errorResponse(error);
  }
}
