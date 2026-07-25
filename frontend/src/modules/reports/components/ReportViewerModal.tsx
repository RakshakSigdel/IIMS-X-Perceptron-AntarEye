"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface ReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportUrl: string | null;
}

export function ReportViewerModal({ isOpen, onClose, reportUrl }: ReportViewerModalProps) {
  const handleDownload = () => {
    if (!reportUrl) return;
    // We can just trigger a download by creating a temporary anchor tag
    const a = document.createElement("a");
    a.href = reportUrl;
    // Providing a download attribute suggests the browser to download instead of navigate
    // Though for signed S3 urls, Content-Disposition headers usually control this.
    a.download = "medical-report.pdf"; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-row justify-between items-center space-y-0">
          <DialogTitle>Diagnosis Report</DialogTitle>
          <div className="flex items-center space-x-2 mr-6">
            <Button size="sm" onClick={handleDownload} disabled={!reportUrl}>
              <Download className="size-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-muted/20 relative">
          {!reportUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-sm">Generating report...</p>
            </div>
          ) : (
            <iframe
              src={reportUrl}
              className="w-full h-full border-none"
              title="Diagnosis Report PDF"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
