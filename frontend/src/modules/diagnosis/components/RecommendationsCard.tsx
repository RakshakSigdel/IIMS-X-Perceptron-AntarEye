"use client";

import { motion } from "motion/react";
import { MessageSquare, Stethoscope } from "lucide-react";

/**
 * The AI backend occasionally stores the raw LLM output (e.g. a JSON string
 * like `{"doctor": "...", "patient": "..."}`) instead of the extracted plain
 * text.  This helper detects that case and returns only the relevant string.
 */
function extractRecommendationText(
  raw: string | null,
  key: "doctor" | "patient"
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && typeof parsed[key] === "string") {
        return parsed[key] as string;
      }
    } catch {
      // Not valid JSON — fall through and return raw
    }
  }
  return raw;
}

interface RecommendationsCardProps {
  doctorRecommendation: string | null;
  patientRecommendation: string | null;
}

export function RecommendationsCard({
  doctorRecommendation,
  patientRecommendation,
}: RecommendationsCardProps) {
  const doctorText = extractRecommendationText(doctorRecommendation, "doctor");
  const patientText = extractRecommendationText(patientRecommendation, "patient");

  if (!doctorText && !patientText) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="rounded-xl border border-border bg-card p-6 space-y-5"
    >
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <MessageSquare className="size-4 text-primary" />
        AI Recommendations
      </h3>

      {doctorText && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Stethoscope className="size-3.5 text-accent" />
            <p className="text-xs font-semibold text-accent uppercase tracking-wide">
              For Doctor
            </p>
          </div>
          <div className="rounded-lg bg-accent/5 border border-accent/10 p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {doctorText}
            </p>
          </div>
        </div>
      )}

      {patientText && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="size-3.5 text-primary" />
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              For Patient
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {patientText}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
