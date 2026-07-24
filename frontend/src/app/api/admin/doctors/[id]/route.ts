import { errorResponse, successResponse } from "@/lib/api/response";
import { UnauthorizedError, ValidationError } from "@/lib/errors";
import { createServiceClient } from "@/lib/supabase/server";
import {
  disableDoctorService,
  getDoctorService,
  updateDoctorSchema,
  updateDoctorService
} from "@/modules/doctors";
import { type NextRequest } from "next/server";
import { z } from "zod";

export async function GET(  
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    const doctor = await getDoctorService(supabase, id);
    
    return successResponse(doctor);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const result = updateDoctorSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError("Validation failed", z.treeifyError(result.error));
    }

    const supabase = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const doctor = await updateDoctorService(supabase, id, result.data, user.id);

    return successResponse(doctor);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supabase = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    // Requires service client to disable auth user
    const serviceClient = await createServiceClient();
    await disableDoctorService(serviceClient, id, user.id);

    return successResponse({ message: "Doctor disabled successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
