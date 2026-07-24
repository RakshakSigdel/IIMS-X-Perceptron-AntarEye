import { errorResponse, successResponse } from "@/lib/api/response";
import { ValidationError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import { loginSchema, loginService } from "@/modules/auth";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse and validate using Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError("Validation failed", result.error.flatten().fieldErrors);
    }

    const supabase = await createServiceClient();
    await loginService(supabase, result.data);

    return successResponse({ message: "Successfully logged in" });
  } catch (error) {
    return errorResponse(error);
  }
}
