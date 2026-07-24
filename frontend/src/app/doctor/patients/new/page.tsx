import { PageHeader } from "@/components/shared/PageHeader";
import { PatientForm } from "@/modules/patients/components/PatientForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Patient — AntarEye",
};

export default function NewPatientPage() {
  return (
    <div>
      <PageHeader
        title="New Patient"
        description="Create a new patient record"
      />
      <PatientForm mode="create" />
    </div>
  );
}
