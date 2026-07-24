import { z } from "zod";

export const aiResponseSchema = z.object({
  prediction: z.record(z.string(), z.number()), // e.g. { "glaucoma": 0.85, "normal": 0.15 }
  predicted_class: z.string(),
  confidence: z.number().min(0).max(1),
  heatmap: z.string(), // base64 encoded image
  llm_patient_recommendation: z.string(),
  llm_doctor_recommendation: z.string(),
});

export type AiResponseDto = z.infer<typeof aiResponseSchema>;
