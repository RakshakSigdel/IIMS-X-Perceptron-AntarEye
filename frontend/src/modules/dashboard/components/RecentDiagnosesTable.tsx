"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PAGE_ROUTES } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DiagnosisStatus } from "@/lib/constants";

import type { RecentDiagnosisItem } from "@/modules/dashboard";

interface RecentDiagnosesTableProps {
  diagnoses: RecentDiagnosisItem[];
}

export function RecentDiagnosesTable({ diagnoses }: RecentDiagnosesTableProps) {
  if (diagnoses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No recent diagnoses yet.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">
              Patient
            </th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">
              Date
            </th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">
              Status
            </th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">
              Prediction
            </th>
          </tr>
        </thead>
        <tbody>
          {diagnoses.map((diagnosis) => {
            const patientName = diagnosis.patient?.[0]
              ? `${diagnosis.patient[0].first_name} ${diagnosis.patient[0].last_name}`
              : "Unknown";

            const prediction = diagnosis.prediction_summary as Record<string, unknown> | null;
            const predictedClass = (prediction?.predictedClass as string) ?? "—";
            const confidence = prediction?.confidence as number | undefined;

            return (
              <tr
                key={diagnosis.id}
                className={cn(
                  "border-b border-border/50 last:border-0",
                  "hover:bg-muted/50 transition-colors cursor-pointer"
                )}
              >
                <td className="py-3 px-3">
                  <Link
                    href={PAGE_ROUTES.DOCTOR.DIAGNOSIS(diagnosis.id)}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {patientName}
                  </Link>
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  {new Date(diagnosis.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={diagnosis.status as DiagnosisStatus} />
                </td>
                <td className="py-3 px-3">
                  <span className="text-foreground capitalize">
                    {predictedClass.replace(/_/g, " ")}
                  </span>
                  {confidence !== undefined && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      ({(confidence * 100).toFixed(0)}%)
                    </span>
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
