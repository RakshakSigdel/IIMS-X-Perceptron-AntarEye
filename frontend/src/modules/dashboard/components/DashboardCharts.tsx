"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface DashboardChartsProps {
  diagnosisDistribution?: Record<string, number>;
}

const DISEASE_COLORS: Record<string, string> = {
  normal: "var(--success)",
  diabetic_retinopathy: "var(--destructive)",
  glaucoma: "var(--warning)",
  hypertensive_retinopathy: "var(--accent)",
};

const DISEASE_LABELS: Record<string, string> = {
  normal: "Normal",
  diabetic_retinopathy: "Diabetic Retinopathy",
  glaucoma: "Glaucoma",
  hypertensive_retinopathy: "Hypertensive Retinopathy",
};

export function DashboardCharts({ diagnosisDistribution }: DashboardChartsProps) {
  // If no distribution data, show placeholder
  if (!diagnosisDistribution || Object.keys(diagnosisDistribution).length === 0) {
    return null;
  }

  const chartData = Object.entries(diagnosisDistribution).map(([key, value]) => ({
    name: DISEASE_LABELS[key] ?? key,
    value,
    color: DISEASE_COLORS[key] ?? "var(--muted-foreground)",
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Diagnosis Distribution
      </h3>

      <div className="flex items-center gap-6">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={64}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
              <span className={cn("text-xs font-medium text-foreground ml-auto")}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
