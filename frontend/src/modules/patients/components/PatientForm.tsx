"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES, API_ROUTES, Gender } from "@/lib/constants";
import { extractApiError } from "@/lib/api/extract-error";
import type { ApiResponse } from "@/lib/api/types";
import { createPatientSchema } from "@/modules/patients";
import { Loader2 } from "lucide-react";

import type { PatientDto } from "@/modules/patients";

interface PatientFormProps {
  patient?: PatientDto;
  mode: "create" | "edit";
}

export function PatientForm({ patient, mode }: PatientFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [firstName, setFirstName] = useState(patient?.firstName ?? "");
  const [lastName, setLastName] = useState(patient?.lastName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(patient?.dateOfBirth ?? "");
  const [gender, setGender] = useState<string>(patient?.gender ?? "");
  const [phone, setPhone] = useState(patient?.phone ?? "");
  const [address, setAddress] = useState(patient?.address ?? "");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const payload = {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: gender || undefined,
      phone: phone || null,
      address: address || null,
    };

    const result = createPatientSchema.safeParse(payload);
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
          ? API_ROUTES.DOCTOR.PATIENTS
          : API_ROUTES.DOCTOR.PATIENT(patient!.id);

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(extractApiError(body, "Failed to save patient"));
      }

      const envelope = (await response.json()) as ApiResponse<PatientDto>;
      const saved = envelope.data;
      router.push(PAGE_ROUTES.DOCTOR.PATIENT_DETAIL(saved.id));
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
      className="max-w-2xl space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* First Name */}
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">
            First Name <span className="text-destructive">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            className={inputClass("firstName")}
          />
          {fieldErrors.firstName && (
            <p className="text-xs text-destructive">{fieldErrors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">
            Last Name <span className="text-destructive">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            className={inputClass("lastName")}
          />
          {fieldErrors.lastName && (
            <p className="text-xs text-destructive">{fieldErrors.lastName}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
            Date of Birth <span className="text-destructive">*</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            disabled={isLoading}
            className={inputClass("dateOfBirth")}
          />
          {fieldErrors.dateOfBirth && (
            <p className="text-xs text-destructive">{fieldErrors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label htmlFor="gender" className="text-sm font-medium text-foreground">
            Gender <span className="text-destructive">*</span>
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={isLoading}
            className={inputClass("gender")}
          >
            <option value="">Select gender</option>
            {Object.values(Gender).map((g) => (
              <option key={g} value={g} className="capitalize">
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
          {fieldErrors.gender && (
            <p className="text-xs text-destructive">{fieldErrors.gender}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+977 9800000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            className={inputClass("phone")}
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label htmlFor="address" className="text-sm font-medium text-foreground">
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Kathmandu, Nepal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            className={inputClass("address")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving…</span>
            </>
          ) : mode === "create" ? (
            "Create Patient"
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
