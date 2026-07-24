import { use } from "react";

export default function EditDoctorPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const { doctorId } = use(params);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Doctor ({doctorId})</h1>
      <p className="text-muted-foreground">Frontend teammate will implement this UI.</p>
    </div>
  );
}
