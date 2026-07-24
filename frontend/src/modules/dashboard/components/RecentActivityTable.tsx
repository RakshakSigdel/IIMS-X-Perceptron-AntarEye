"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import type { RecentActivityItem } from "@/modules/dashboard";

interface RecentActivityTableProps {
  activities: RecentActivityItem[];
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-success/10 text-success",
  update: "bg-accent/10 text-accent",
  delete: "bg-destructive/10 text-destructive",
  login: "bg-primary/10 text-primary",
  logout: "bg-muted text-muted-foreground",
};

export function RecentActivityTable({ activities }: RecentActivityTableProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No recent activity.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Action</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Entity</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Actor</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => {
            const actorEmail = activity.actor?.[0]?.email ?? "System";
            const actionColor = ACTION_COLORS[activity.action] ?? "bg-muted text-muted-foreground";

            return (
              <tr
                key={activity.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
                      actionColor
                    )}
                  >
                    {activity.action}
                  </span>
                </td>
                <td className="py-3 px-3 text-foreground capitalize">
                  {activity.entity_type.replace(/_/g, " ")}
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  {actorEmail}
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  {new Date(activity.created_at).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
