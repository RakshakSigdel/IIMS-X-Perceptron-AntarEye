import { z } from "zod";

// We don't define a create schema because create happens via multipart/form-data upload.
// This schema is just for potential validation if we needed it, but usually Route Handler 
// will extract the File directly from FormData.

export const uploadDiagnosisSchema = z.object({
  patientId: z.uuid(),
  // Note: File validation (size, type) happens in the route handler before calling service
});
