export const DIAGNOSIS_ERROR_MESSAGES = {
  NOT_FOUND: "Diagnosis session not found or you do not have permission to view it.",
  CREATION_FAILED: "Failed to initialize diagnosis session.",
  UPLOAD_FAILED: "Failed to upload image to storage.",
  AI_FAILED: "AI processing failed.",
  INVALID_IMAGE: "Invalid image format or size.",
} as const;
