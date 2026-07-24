"use client";

import Link from "next/link";
import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";
import { PageHeader } from "@/components/shared/PageHeader";
import { DoctorsTable } from "@/modules/doctors/components/DoctorsTable";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import type { DoctorDto } from "@/modules/doctors";

export default function DoctorsListPage() {
  const { data, isLoading, refetch } = useApiQuery<DoctorDto[]>(
    API_ROUTES.ADMIN.DOCTORS
  );

  return (
    <div>
      <PageHeader title="Doctors" description="Manage doctor accounts">
        <Link href={PAGE_ROUTES.ADMIN.NEW_DOCTOR}>
          <Button>
            <Plus className="size-4" />
            Create Doctor
          </Button>
        </Link>
      </PageHeader>

      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : (
        <DoctorsTable
          doctors={data ?? []}
          onDisabled={() => void refetch()}
        />
      )}
    </div>
  );
}
