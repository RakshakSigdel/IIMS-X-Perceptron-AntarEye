import { TriageLevel } from "../constants";

export function calculateTriageLevel(
  predictedClass: string,
  confidence: number
): TriageLevel {
  // Rules (evaluated in order):
  // 1. predicted_class = "diabetic_retinopathy" AND confidence >= 0.8  → CRITICAL
  // 2. predicted_class = "glaucoma"             AND confidence >= 0.8  → CRITICAL
  if (["diabetic_retinopathy", "glaucoma"].includes(predictedClass) && confidence >= 0.8) {
    return TriageLevel.CRITICAL;
  }

  // 3. predicted_class = "diabetic_retinopathy" AND confidence >= 0.5  → HIGH
  // 4. predicted_class = "glaucoma"             AND confidence >= 0.5  → HIGH
  if (["diabetic_retinopathy", "glaucoma"].includes(predictedClass) && confidence >= 0.5) {
    return TriageLevel.HIGH;
  }

  // 5. predicted_class = "hypertensive_retinopathy" AND confidence >= 0.7  → HIGH
  if (predictedClass === "hypertensive_retinopathy" && confidence >= 0.7) {
    return TriageLevel.HIGH;
  }

  // 6. predicted_class = "hypertensive_retinopathy" AND confidence >= 0.4  → MEDIUM
  if (predictedClass === "hypertensive_retinopathy" && confidence >= 0.4) {
    return TriageLevel.MEDIUM;
  }

  // 7. predicted_class = "normal"               AND confidence >= 0.8  → LOW
  if (predictedClass === "normal" && confidence >= 0.8) {
    return TriageLevel.LOW;
  }

  // 8. Any remaining case                                              → MEDIUM
  return TriageLevel.MEDIUM;
}
