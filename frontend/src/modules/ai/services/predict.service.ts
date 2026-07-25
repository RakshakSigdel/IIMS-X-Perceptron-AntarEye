import { ExternalServiceError } from "@/lib/errors";
import { aiResponseSchema, AiResponseDto } from "../schemas/ai-response.schema";
import { env } from "@/lib/env";
import { z } from "zod";

export async function predictService(
  imageBuffer: Buffer,
  fileName: string,
): Promise<AiResponseDto> {
  const baseUrl = env.AI_API_BASE_URL || "http://localhost:8000";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    // 1. Explicitly map and validate allowed MIME types based on file extension
    const ext = fileName.toLowerCase().split(".").pop();
    let mimeType = "application/octet-stream";

    if (ext === "jpg" || ext === "jpeg") {
      mimeType = "image/jpeg";
    } else if (ext === "png") {
      mimeType = "image/png";
    } else {
      throw new ExternalServiceError("Unsupported file type. Only JPEG and PNG are allowed.");
    }

    const formData = new FormData();
    
    // 2. Convert Buffer to Uint8Array to satisfy TypeScript's BlobPart definition
    const uint8Array = new Uint8Array(imageBuffer);
    const file = new File([uint8Array], fileName, { type: mimeType });

    formData.append("image", file);

    const response = await fetch(`${baseUrl}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI service error (${response.status}):`, errorText);
      throw new ExternalServiceError(`AI service returned ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    // 3. Validate response shape
    const result = aiResponseSchema.safeParse(data);
    if (!result.success) {
      console.error(
        "AI service validation error:",
        z.treeifyError(result.error),
      );
      throw new ExternalServiceError("AI service returned invalid data format");
    }

    console.log(result);
    console.log(result.data);

    return result.data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ExternalServiceError(
        "AI service request timed out after 30 seconds",
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    // If it's already an ExternalServiceError, rethrow it directly
    if (error instanceof ExternalServiceError) {
      throw error;
    }

    throw new ExternalServiceError(`AI prediction failed: ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}