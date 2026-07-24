"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { PAGE_ROUTES, API_ROUTES } from "@/lib/constants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { MoreHorizontal, Eye, Pencil, Archive, Search, Users } from "lucide-react";

import type { PatientDto } from "@/modules/patients";

interface PatientsTableProps {
  patients: PatientDto[];
  onArchived?: () => void;
}

export function PatientsTable({ patients, onArchived }: PatientsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [archiveTarget, setArchiveTarget] = useState<PatientDto | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const { mutate: archivePatient, isLoading: isArchiving } = useApiMutation(
    archiveTarget ? API_ROUTES.DOCTOR.PATIENT(archiveTarget.id) : "",
    "DELETE",
    {
      successMessage: "Patient archived successfully",
      onSuccess: () => {
        setArchiveTarget(null);
        onArchived?.();
      },
    }
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return patients;

    const query = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        (p.phone && p.phone.includes(query))
    );
  }, [patients, searchQuery]);

  if (patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No patients yet"
        description="Create your first patient to start diagnosing retinal diseases."
      >
        <Link href={PAGE_ROUTES.DOCTOR.NEW_PATIENT}>
          <Button>Create Patient</Button>
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search patients by name or phone…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full h-10 rounded-lg border border-input bg-background",
            "pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "transition-colors duration-150"
          )}
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto rounded-lg border border-border"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">
                Date of Birth
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">
                Gender
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">
                Phone
              </th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <Link
                    href={PAGE_ROUTES.DOCTOR.PATIENT_DETAIL(patient.id)}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {patient.firstName} {patient.lastName}
                  </Link>
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-muted-foreground capitalize hidden md:table-cell">
                  {patient.gender}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                  {patient.phone ?? "—"}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenActionId(
                          openActionId === patient.id ? null : patient.id
                        )
                      }
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>

                    {openActionId === patient.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenActionId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-border bg-popover shadow-md py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionId(null);
                              router.push(
                                PAGE_ROUTES.DOCTOR.PATIENT_DETAIL(patient.id)
                              );
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Eye className="size-3.5" /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionId(null);
                              router.push(
                                PAGE_ROUTES.DOCTOR.EDIT_PATIENT(patient.id)
                              );
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionId(null);
                              setArchiveTarget(patient);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Archive className="size-3.5" /> Archive
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No patients match your search.
          </div>
        )}
      </motion.div>

      {/* Archive confirm dialog */}
      <ConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Archive Patient"
        description={`Are you sure you want to archive ${archiveTarget?.firstName} ${archiveTarget?.lastName}? This action can be undone by an administrator.`}
        confirmLabel="Archive"
        isLoading={isArchiving}
        onConfirm={() => void archivePatient({})}
      />
    </>
  );
}
