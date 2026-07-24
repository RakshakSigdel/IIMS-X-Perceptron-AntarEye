"use client";

import { use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PatientForm } from "@/modules/patients/components/PatientForm";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES } from "@/lib/constants";

import type { PatientDto } from "@/modules/patients";

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const { data: patient, isLoading } = useApiQuery<PatientDto>(
    API_ROUTES.DOCTOR.PATIENT(patientId)
  );

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Patient not found.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Patient"
        description={`${patient.firstName} ${patient.lastName}`}
      />
      <PatientForm patient={patient} mode="edit" />
    </div>
  );
}
