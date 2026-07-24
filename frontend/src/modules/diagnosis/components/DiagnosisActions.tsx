"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/constants";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DiagnosisActionsProps {
  diagnosisId: string;
  hasReport: boolean;
}

export function DiagnosisActions({ diagnosisId, hasReport }: DiagnosisActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async (): Promise<void> => {
    setIsDownloading(true);

    try {
      const response = await fetch(
        API_ROUTES.DOCTOR.DIAGNOSIS_REPORT(diagnosisId),
        { method: "POST" }
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        throw new Error((body.error as string) ?? "Failed to generate report");
      }

      // Try to download as blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `diagnosis-report-${diagnosisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Report downloaded successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to download report"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => void handleDownloadReport()}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Download className="size-4" />
            {hasReport ? "Download Report" : "Generate Report"}
          </>
        )}
      </Button>
    </div>
  );
}
