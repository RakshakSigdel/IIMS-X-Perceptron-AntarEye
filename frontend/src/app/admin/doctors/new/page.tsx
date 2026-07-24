import { PageHeader } from "@/components/shared/PageHeader";
import { DoctorForm } from "@/modules/doctors/components/DoctorForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Doctor — AntarEye",
};

export default function NewDoctorPage() {
  return (
    <div>
      <PageHeader
        title="Create Doctor"
        description="Add a new doctor to the platform"
      />
      <DoctorForm mode="create" />
    </div>
  );
}
