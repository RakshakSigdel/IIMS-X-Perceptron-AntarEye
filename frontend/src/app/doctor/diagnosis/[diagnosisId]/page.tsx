"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { FundusImageViewer } from "@/modules/diagnosis/components/FundusImageViewer";
import { PredictionCard } from "@/modules/diagnosis/components/PredictionCard";
import { RecommendationsCard } from "@/modules/diagnosis/components/RecommendationsCard";
import { DiagnosisActions } from "@/modules/diagnosis/components/DiagnosisActions";
import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";
import { DiagnosisStatus } from "@/lib/constants";
import { ArrowLeft, AlertTriangle } from "lucide-react";

import type { DiagnosisDto, PredictionSummary } from "@/modules/diagnosis";

/** Returns the highest probability value (0–1) across all classes. */
function getMaxProbability(probabilities: Record<string, number>): number {
  const values = Object.values(probabilities);
  if (values.length === 0) return 0;
  return Math.max(...values);
}

export default function DiagnosisDetailPage({
  params,
}: {
  params: Promise<{ diagnosisId: string }>;
}) {
  const { diagnosisId } = use(params);
  const router = useRouter();

  const { data: diagnosis, isLoading } = useApiQuery<DiagnosisDto>(
    API_ROUTES.DOCTOR.DIAGNOSIS_DETAIL(diagnosisId)
  );

  const isCompleted = diagnosis?.status === DiagnosisStatus.COMPLETED;
  const prediction =
    isCompleted && diagnosis
      ? (diagnosis.predictionSummary as PredictionSummary)
      : null;

  // Check for low-quality / non-fundus image once the diagnosis is completed
  const isLowQuality =
    prediction != null &&
    getMaxProbability(prediction.probabilities) < 0.6;

  const handleLowQualityDismiss = () => {
    router.push(PAGE_ROUTES.DOCTOR.PATIENTS);
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!diagnosis) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Diagnosis not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Low-quality / non-fundus image warning dialog */}
      <Dialog open={isLowQuality} onOpenChange={() => {}} disablePointerDismissal>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Image Quality Warning
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              Given image is either not fundus or low quality fundus image,
              Please upload again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button onClick={handleLowQualityDismiss} className="w-full">
              Go Back to Patients
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <PageHeader
          title="Diagnosis Results"
          description={`Session ${diagnosisId.slice(0, 8)}… • ${new Date(
            diagnosis.createdAt
          ).toLocaleDateString()}`}
        >
          <StatusBadge status={diagnosis.status} />
          {isCompleted && !isLowQuality && (
            <DiagnosisActions
              diagnosisId={diagnosisId}
              hasReport={diagnosis.reportStoragePath !== null}
            />
          )}
        </PageHeader>

        {/* Back to patient */}
        <Link href={PAGE_ROUTES.DOCTOR.PATIENT_DETAIL(diagnosis.patientId)}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Patient
          </Button>
        </Link>

        {isCompleted && prediction && !isLowQuality ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Images */}
            <div className="space-y-6">
              <FundusImageViewer
                originalImageUrl={diagnosis.originalImageUrl}
                heatmapUrl={diagnosis.heatmapUrl}
              />
            </div>

            {/* Right: Prediction + Recommendations */}
            <div className="space-y-6">
              <PredictionCard prediction={prediction} />
              <RecommendationsCard
                doctorRecommendation={diagnosis.llmDoctorRecommendation}
                patientRecommendation={diagnosis.llmPatientRecommendation}
              />
            </div>
          </div>
        ) : !isLowQuality ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            {diagnosis.status === DiagnosisStatus.PROCESSING ? (
              <>
                <div className="flex justify-center mb-4">
                  <span className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  AI is analyzing the image…
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This may take up to 30 seconds. Please wait.
                </p>
              </>
            ) : diagnosis.status === DiagnosisStatus.FAILED ? (
              <>
                <p className="text-lg font-semibold text-destructive">
                  Diagnosis Failed
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The AI service was unable to process this image. Please try again.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-foreground">
                  Diagnosis In Progress
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current status: {diagnosis.status}
                </p>
              </>
            )}
          </motion.div>
        ) : null}
      </div>
    </>
  );
}
