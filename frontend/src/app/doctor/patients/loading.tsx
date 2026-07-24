import { TableSkeleton } from "@/components/shared/LoadingSkeleton";

export default function PatientsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-40 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
