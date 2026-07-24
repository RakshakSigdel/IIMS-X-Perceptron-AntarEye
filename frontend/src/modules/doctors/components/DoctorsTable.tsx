"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PAGE_ROUTES, API_ROUTES } from "@/lib/constants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { MoreHorizontal, Pencil, UserX, Stethoscope } from "lucide-react";

import type { DoctorDto } from "@/modules/doctors";

interface DoctorsTableProps {
  doctors: DoctorDto[];
  onDisabled?: () => void;
}

export function DoctorsTable({ doctors, onDisabled }: DoctorsTableProps) {
  const router = useRouter();
  const [disableTarget, setDisableTarget] = useState<DoctorDto | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const { mutate: disableDoctor, isLoading: isDisabling } = useApiMutation(
    disableTarget ? API_ROUTES.ADMIN.DOCTOR(disableTarget.id) : "",
    "DELETE",
    {
      successMessage: "Doctor disabled successfully",
      onSuccess: () => {
        setDisableTarget(null);
        onDisabled?.();
      },
    }
  );

  if (doctors.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No doctors yet"
        description="Create the first doctor account to get started."
      />
    );
  }

  return (
    <>
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
                Email
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">
                Created
              </th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-foreground">
                  {doctor.fullName}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                  {doctor.email}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenActionId(
                          openActionId === doctor.id ? null : doctor.id
                        )
                      }
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>

                    {openActionId === doctor.id && (
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
                              router.push(PAGE_ROUTES.ADMIN.EDIT_DOCTOR(doctor.id));
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionId(null);
                              setDisableTarget(doctor);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <UserX className="size-3.5" /> Disable
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
      </motion.div>

      <ConfirmDialog
        open={disableTarget !== null}
        onOpenChange={(open) => !open && setDisableTarget(null)}
        title="Disable Doctor"
        description={`Are you sure you want to disable ${disableTarget?.fullName}? They will no longer be able to sign in.`}
        confirmLabel="Disable"
        isLoading={isDisabling}
        onConfirm={() => void disableDoctor({})}
      />
    </>
  );
}
