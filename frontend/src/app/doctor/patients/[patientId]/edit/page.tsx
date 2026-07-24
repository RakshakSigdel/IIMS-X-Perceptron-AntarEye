import { use } from "react";

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Patient ({patientId})</h1>
      <p className="text-muted-foreground">Frontend teammate will implement this UI.</p>
    </div>
  );
}
