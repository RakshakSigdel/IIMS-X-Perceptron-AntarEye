import { use } from "react";

export default function DiagnosisResultPage({
  params,
}: {
  params: Promise<{ diagnosisId: string }>;
}) {
  const { diagnosisId } = use(params);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Diagnosis Result ({diagnosisId})</h1>
      <p className="text-muted-foreground">Frontend teammate will implement this UI (upload, heatmap, AI results, etc.).</p>
    </div>
  );
}
