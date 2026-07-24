import { cn } from "@/lib/utils";
import { TriageLevel } from "@/modules/triage/constants";

const TRIAGE_CONFIG: Record<TriageLevel, { label: string; className: string }> = {
  [TriageLevel.CRITICAL]: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  [TriageLevel.HIGH]: {
    label: "High",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  [TriageLevel.MEDIUM]: {
    label: "Medium",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  [TriageLevel.LOW]: {
    label: "Low",
    className: "bg-success/10 text-success border-success/20",
  },
};

interface TriageBadgeProps {
  level: TriageLevel | string;
  className?: string;
}

export function TriageBadge({ level, className }: TriageBadgeProps) {
  const config = TRIAGE_CONFIG[level as TriageLevel] ?? {
    label: level,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
