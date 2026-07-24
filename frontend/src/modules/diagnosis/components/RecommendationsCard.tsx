"use client";

import { motion } from "motion/react";
import { MessageSquare, Stethoscope } from "lucide-react";

interface RecommendationsCardProps {
  doctorRecommendation: string | null;
  patientRecommendation: string | null;
}

export function RecommendationsCard({
  doctorRecommendation,
  patientRecommendation,
}: RecommendationsCardProps) {
  if (!doctorRecommendation && !patientRecommendation) {
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

      {doctorRecommendation && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Stethoscope className="size-3.5 text-accent" />
            <p className="text-xs font-semibold text-accent uppercase tracking-wide">
              For Doctor
            </p>
          </div>
          <div className="rounded-lg bg-accent/5 border border-accent/10 p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {doctorRecommendation}
            </p>
          </div>
        </div>
      )}

      {patientRecommendation && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="size-3.5 text-primary" />
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              For Patient
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {patientRecommendation}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
