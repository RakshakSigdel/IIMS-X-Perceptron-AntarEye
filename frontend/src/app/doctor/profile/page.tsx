"use client";

import { motion } from "motion/react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" />
        <div className="animate-pulse space-y-4 max-w-lg">
          <div className="h-20 rounded-xl bg-muted" />
          <div className="h-20 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  const profileFields = [
    { icon: User, label: "Full Name", value: user.fullName },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Shield, label: "Role", value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
  ];

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your account information"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg rounded-xl border border-border bg-card p-6"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary text-xl font-bold">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {profileFields.map((field) => (
            <div key={field.label} className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted shrink-0">
                <field.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
