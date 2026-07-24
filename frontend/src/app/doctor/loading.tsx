import { StatsGridSkeleton, TableSkeleton } from "@/components/shared/LoadingSkeleton";

export default function DoctorDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-48 rounded-lg bg-muted animate-pulse" />
      </div>
      <StatsGridSkeleton count={4} />
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="h-4 w-32 rounded-lg bg-muted animate-pulse mb-4" />
        <TableSkeleton rows={5} cols={4} />
      </div>
    </div>
  );
}
