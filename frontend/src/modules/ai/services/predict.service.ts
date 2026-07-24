import { ExternalServiceError } from "@/lib/errors";
import { aiResponseSchema, AiResponseDto } from "../schemas/ai-response.schema";
import { env } from "@/lib/env";
import { z } from "zod";

export async function predictService(imageBuffer: Buffer, fileName: string): Promise<AiResponseDto> {
  const baseUrl = env.AI_API_BASE_URL || "http://localhost:8000";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer]);
    formData.append("image", blob, fileName);

    const response = await fetch(`${baseUrl}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ExternalServiceError(`AI service returned ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response shape
    const result = aiResponseSchema.safeParse(data);
    if (!result.success) {
      console.error("AI service validation error:", z.treeifyError(result.error));
      throw new ExternalServiceError("AI service returned invalid data format");
    }

    return result.data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new ExternalServiceError("AI service request timed out after 30 seconds");
    }
    throw new ExternalServiceError(`AI prediction failed: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
