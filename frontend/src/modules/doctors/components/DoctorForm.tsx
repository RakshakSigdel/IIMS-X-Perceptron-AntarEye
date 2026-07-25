"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES, API_ROUTES } from "@/lib/constants";
import { extractApiError } from "@/lib/api/extract-error";
import { createDoctorSchema, updateDoctorSchema } from "@/modules/doctors";
import { Loader2 } from "lucide-react";

import type { DoctorDto } from "@/modules/doctors";

interface DoctorFormProps {
  doctor?: DoctorDto;
  mode: "create" | "edit";
}

export function DoctorForm({ doctor, mode }: DoctorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [fullName, setFullName] = useState(doctor?.fullName ?? "");
  const [email, setEmail] = useState(doctor?.email ?? "");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const payload =
      mode === "create"
        ? { fullName, email, password }
        : { fullName: fullName || undefined };

    const schema = mode === "create" ? createDoctorSchema : updateDoctorSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const url =
        mode === "create"
          ? API_ROUTES.ADMIN.DOCTORS
          : API_ROUTES.ADMIN.DOCTOR(doctor!.id);

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(extractApiError(body, "Failed to save doctor"));
      }

      router.push(PAGE_ROUTES.ADMIN.DOCTORS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string): string =>
    cn(
      "flex h-10 w-full rounded-lg border bg-background px-3 py-2",
      "text-sm text-foreground placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-colors duration-150",
      fieldErrors[field] ? "border-destructive" : "border-input"
    );

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => void handleSubmit(e)}
      className="max-w-lg space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full Name <span className="text-destructive">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Dr. Jane Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          className={inputClass("fullName")}
        />
        {fieldErrors.fullName && (
          <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
        )}
      </div>

      {/* Email (create only) */}
      {mode === "create" && (
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="doctor@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={inputClass("email")}
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>
      )}

      {/* Password (create only) */}
      {mode === "create" && (
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password <span className="text-destructive">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={inputClass("password")}
          />
          {fieldErrors.password && (
            <p className="text-xs text-destructive">{fieldErrors.password}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving…</span>
            </>
          ) : mode === "create" ? (
            "Create Doctor"
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}
