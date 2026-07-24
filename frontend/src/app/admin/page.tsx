"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { API_ROUTES } from "@/lib/constants";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/modules/dashboard/components/StatsGrid";
import { RecentActivityTable } from "@/modules/dashboard/components/RecentActivityTable";
import { StatsGridSkeleton, TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Stethoscope, Activity } from "lucide-react";

import type { AdminDashboardDto } from "@/modules/dashboard";

export default function AdminDashboardPage() {
  const { data, isLoading } = useApiQuery<AdminDashboardDto>(API_ROUTES.DASHBOARD);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" />
        <StatsGridSkeleton count={2} />
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Doctors",
      value: data?.totalDoctors ?? 0,
      icon: Stethoscope,
      accentClass: "text-primary",
    },
    {
      title: "Total Diagnoses",
      value: data?.totalDiagnoses ?? 0,
      icon: Activity,
      accentClass: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and administration"
      />

      <StatsGrid stats={stats} />

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        <RecentActivityTable activities={data?.recentActivity ?? []} />
      </div>
    </div>
  );
}
