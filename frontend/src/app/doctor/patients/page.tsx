"use client";

import Link from "next/link";
import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";
import { PageHeader } from "@/components/shared/PageHeader";
import { PatientsTable } from "@/modules/patients/components/PatientsTable";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import type { PatientDto } from "@/modules/patients";

export default function PatientsPage() {
  const { data, isLoading, refetch } = useApiQuery<PatientDto[]>(
    API_ROUTES.DOCTOR.PATIENTS
  );

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage your patient records"
      >
        <Link href={PAGE_ROUTES.DOCTOR.NEW_PATIENT}>
          <Button>
            <Plus className="size-4" />
            New Patient
          </Button>
        </Link>
      </PageHeader>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <PatientsTable
          patients={data ?? []}
          onArchived={() => void refetch()}
        />
      )}
    </div>
  );
}
