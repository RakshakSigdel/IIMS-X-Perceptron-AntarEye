import { errorResponse, successResponse } from "@/lib/api/response";
import { ValidationError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, loginService } from "@/modules/auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Parse and validate using Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(
        "Validation failed",
        z.treeifyError(result.error),
      );
    }

    const supabase = await createClient();
    const userSession = await loginService(supabase, result.data);

    return successResponse(userSession);
  } catch (error) {
    return errorResponse(error);
  }
}
