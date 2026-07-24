"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accentClass?: string;
  index?: number;
}

function StatCard({ title, value, icon: Icon, accentClass = "text-primary", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        "shadow-xs hover:shadow-sm transition-shadow duration-200"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("flex items-center justify-center size-9 rounded-lg bg-muted", accentClass)}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: Array<{
    title: string;
    value: number | string;
    icon: LucideIcon;
    accentClass?: string;
  }>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
}
