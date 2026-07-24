import { TableSkeleton } from "@/components/shared/LoadingSkeleton";

export default function DoctorsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-40 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-muted animate-pulse" />
      </div>
      <TableSkeleton rows={5} cols={4} />
    </div>
  );
}
