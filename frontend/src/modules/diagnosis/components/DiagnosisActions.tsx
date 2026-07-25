"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/constants";
import { Download, Loader2 } from "lucide-react";
import { extractApiError } from "@/lib/api/extract-error";
import { toast } from "sonner";

import { ReportViewerModal } from "@/modules/reports/components/ReportViewerModal";

interface DiagnosisActionsProps {
  diagnosisId: string;
  hasReport: boolean;
}

export function DiagnosisActions({ diagnosisId, hasReport }: DiagnosisActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const handleViewReport = async (): Promise<void> => {
    setIsLoading(true);
    setIsModalOpen(true); // Open modal immediately in loading state

    try {
      // If it has a report, we GET the URL. If not, we POST to generate it.
      const method = hasReport ? "GET" : "POST";
      
      const response = await fetch(
        API_ROUTES.DOCTOR.DIAGNOSIS_REPORT(diagnosisId),
        { method }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(extractApiError(body, "Failed to load report"));
      }

      const body = await response.json();
      const url = body.data?.reportUrl;
      
      if (!url) {
        throw new Error("No URL returned from server");
      }

      setReportUrl(url);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load report"
      );
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => void handleViewReport()}
          disabled={isLoading && !isModalOpen}
        >
          {isLoading && !isModalOpen ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              {hasReport ? "Loading…" : "Generating…"}
            </>
          ) : (
            <>
              <Download className="size-4 mr-2" />
              {hasReport ? "View Report" : "Generate Report"}
            </>
          )}
        </Button>
      </div>

      <ReportViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportUrl={reportUrl}
      />
    </>
  );
}
