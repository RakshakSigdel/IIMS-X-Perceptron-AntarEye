"use client";

import { use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DoctorForm } from "@/modules/doctors/components/DoctorForm";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES } from "@/lib/constants";

import type { DoctorDto } from "@/modules/doctors";

export default function EditDoctorPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const { doctorId } = use(params);

  const { data: doctor, isLoading } = useApiQuery<DoctorDto>(
    API_ROUTES.ADMIN.DOCTOR(doctorId)
  );

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Doctor not found.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Doctor"
        description={doctor.fullName}
      />
      <DoctorForm doctor={doctor} mode="edit" />
    </div>
  );
}
