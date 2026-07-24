"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TriageBadge } from "@/components/shared/TriageBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PAGE_ROUTES } from "@/lib/constants";
import { DiagnosisStatus } from "@/lib/constants";
import { TriageLevel } from "@/modules/triage/constants";
import { Stethoscope } from "lucide-react";

import type { DiagnosisDto, PredictionSummary } from "@/modules/diagnosis";

interface PatientDiagnosisHistoryProps {
  diagnoses: DiagnosisDto[];
}

export function PatientDiagnosisHistory({ diagnoses }: PatientDiagnosisHistoryProps) {
  if (diagnoses.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No diagnosis history"
        description="This patient has no diagnosis sessions yet. Start a new diagnosis to analyze a retinal image."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Prediction</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Confidence</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Triage</th>
          </tr>
        </thead>
        <tbody>
          {diagnoses.map((d) => {
            const pred = d.predictionSummary as PredictionSummary | Record<string, unknown>;
            const predictedClass = ("predictedClass" in pred ? pred.predictedClass : null) as string | null;
            const confidence = ("confidence" in pred ? pred.confidence : null) as number | null;
            const triageLevel = ("triageLevel" in pred ? pred.triageLevel : null) as string | null;

            return (
              <tr
                key={d.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-3">
                  <Link
                    href={PAGE_ROUTES.DOCTOR.DIAGNOSIS(d.id)}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {new Date(d.createdAt).toLocaleDateString()}
                  </Link>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="py-3 px-3 capitalize text-foreground">
                  {predictedClass?.replace(/_/g, " ") ?? "—"}
                </td>
                <td className="py-3 px-3">
                  {confidence !== null ? (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            confidence >= 0.8 ? "bg-destructive" : confidence >= 0.5 ? "bg-warning" : "bg-success"
                          )}
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {(confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 px-3">
                  {triageLevel ? (
                    <TriageBadge level={triageLevel} />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
