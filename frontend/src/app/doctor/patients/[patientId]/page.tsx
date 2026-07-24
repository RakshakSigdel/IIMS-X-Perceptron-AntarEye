"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { PatientDiagnosisHistory } from "@/modules/patients/components/PatientDiagnosisHistory";
import { StartDiagnosisButton } from "@/modules/patients/components/StartDiagnosisButton";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";
import { Pencil, Calendar, User, Phone, MapPin } from "lucide-react";

import type { PatientDto } from "@/modules/patients";
import type { DiagnosisDto } from "@/modules/diagnosis";

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const { data: patient, isLoading: loadingPatient } = useApiQuery<PatientDto>(
    API_ROUTES.DOCTOR.PATIENT(patientId)
  );

  const { data: diagnoses, isLoading: loadingDiagnoses } = useApiQuery<DiagnosisDto[]>(
    API_ROUTES.DOCTOR.DIAGNOSIS
  );

  if (loadingPatient) {
    return <DetailSkeleton />;
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Patient not found.</p>
      </div>
    );
  }

  // Filter diagnoses for this patient
  const patientDiagnoses = (diagnoses ?? []).filter(
    (d) => d.patientId === patientId
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={`Patient since ${new Date(patient.createdAt).toLocaleDateString()}`}
      >
        <Link href={PAGE_ROUTES.DOCTOR.EDIT_PATIENT(patientId)}>
          <Button variant="outline">
            <Pencil className="size-4" />
            Edit
          </Button>
        </Link>
        <StartDiagnosisButton patientId={patientId} />
      </PageHeader>

      {/* Patient Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Patient Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-muted shrink-0">
              <Calendar className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(patient.dateOfBirth).toLocaleDateString()}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({calculateAge(patient.dateOfBirth)} yrs)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-muted shrink-0">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {patient.gender}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-muted shrink-0">
              <Phone className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">
                {patient.phone ?? "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-muted shrink-0">
              <MapPin className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium text-foreground">
                {patient.address ?? "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Diagnosis History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Diagnosis History
        </h3>
        {loadingDiagnoses ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading diagnoses…
          </div>
        ) : (
          <PatientDiagnosisHistory diagnoses={patientDiagnoses} />
        )}
      </motion.div>
    </div>
  );
}
