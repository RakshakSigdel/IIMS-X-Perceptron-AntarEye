"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TriageBadge } from "@/components/shared/TriageBadge";
import { Activity } from "lucide-react";

import type { PredictionSummary } from "@/modules/diagnosis";

const DISEASE_LABELS: Record<string, string> = {
  normal: "Normal",
  diabetic_retinopathy: "Diabetic Retinopathy",
  glaucoma: "Glaucoma",
  hypertensive_retinopathy: "Hypertensive Retinopathy",
};

const DISEASE_COLORS: Record<string, string> = {
  normal: "bg-success",
  diabetic_retinopathy: "bg-destructive",
  glaucoma: "bg-warning",
  hypertensive_retinopathy: "bg-accent",
};

interface PredictionCardProps {
  prediction: PredictionSummary;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const confidencePercent = Math.round(prediction.confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          AI Prediction
        </h3>
        <TriageBadge level={prediction.triageLevel} />
      </div>

      {/* Predicted class */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground mb-1">Predicted Disease</p>
        <p className="text-xl font-bold text-foreground capitalize">
          {DISEASE_LABELS[prediction.predictedClass] ??
            prediction.predictedClass.replace(/_/g, " ")}
        </p>
      </div>

      {/* Confidence gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">Overall Confidence</p>
          <p className="text-sm font-bold text-foreground">{confidencePercent}%</p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className={cn(
              "h-full rounded-full",
              confidencePercent >= 80
                ? "bg-destructive"
                : confidencePercent >= 50
                  ? "bg-warning"
                  : "bg-success"
            )}
          />
        </div>
      </div>

      {/* Per-class probabilities */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">
          Class Probabilities
        </p>
        {Object.entries(prediction.probabilities).map(([cls, prob]) => {
          const percent = Math.round((prob as number) * 100);
          return (
            <div key={cls}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-foreground capitalize">
                  {DISEASE_LABELS[cls] ?? cls.replace(/_/g, " ")}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {percent}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  className={cn(
                    "h-full rounded-full",
                    DISEASE_COLORS[cls] ?? "bg-muted-foreground"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
