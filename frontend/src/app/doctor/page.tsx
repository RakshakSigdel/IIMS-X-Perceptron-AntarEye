"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES } from "@/lib/constants";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/modules/dashboard/components/StatsGrid";
import { RecentDiagnosesTable } from "@/modules/dashboard/components/RecentDiagnosesTable";
import { StatsGridSkeleton, TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Users, Activity, AlertTriangle, Stethoscope } from "lucide-react";

import type { DoctorDashboardDto } from "@/modules/dashboard";

export default function DoctorDashboardPage() {
  const { data, isLoading } = useApiQuery<DoctorDashboardDto>(API_ROUTES.DASHBOARD);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Welcome back, Doctor" />
        <StatsGridSkeleton count={4} />
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Patients",
      value: data?.totalPatients ?? 0,
      icon: Users,
      accentClass: "text-primary",
    },
    {
      title: "Total Diagnoses",
      value: data?.totalDiagnoses ?? 0,
      icon: Stethoscope,
      accentClass: "text-accent",
    },
    {
      title: "High Priority",
      value: data?.highPriorityPatients ?? 0,
      icon: AlertTriangle,
      accentClass: "text-warning",
    },
    {
      title: "Recent Activity",
      value: data?.recentDiagnoses?.length ?? 0,
      icon: Activity,
      accentClass: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your practice activity"
      />

      <StatsGrid stats={stats} />

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Recent Diagnoses
        </h3>
        <RecentDiagnosesTable diagnoses={data?.recentDiagnoses ?? []} />
      </div>
    </div>
  );
}
