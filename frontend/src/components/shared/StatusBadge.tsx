import { cn } from "@/lib/utils";
import { DiagnosisStatus } from "@/lib/constants";

const STATUS_CONFIG: Record<DiagnosisStatus, { label: string; className: string }> = {
  [DiagnosisStatus.CREATED]: {
    label: "Created",
    className: "bg-muted text-muted-foreground",
  },
  [DiagnosisStatus.UPLOADED]: {
    label: "Uploaded",
    className: "bg-accent/10 text-accent",
  },
  [DiagnosisStatus.PROCESSING]: {
    label: "Processing",
    className: "bg-warning/10 text-warning",
  },
  [DiagnosisStatus.COMPLETED]: {
    label: "Completed",
    className: "bg-success/10 text-success",
  },
  [DiagnosisStatus.FAILED]: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive",
  },
};

interface StatusBadgeProps {
  status: DiagnosisStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {status === DiagnosisStatus.PROCESSING && (
        <span className="mr-1.5 size-1.5 rounded-full bg-current animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
