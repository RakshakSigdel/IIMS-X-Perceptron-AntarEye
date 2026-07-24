import { DiagnosisStatus, STORAGE_BUCKETS, TABLES } from "@/lib/constants";
import { ExternalServiceError } from "@/lib/errors";
import { getDiagnosisService } from "@/modules/diagnosis";
import { getPatientService } from "@/modules/patients";
import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
// import ReactPDF from '@react-pdf/renderer'; // Will be used by frontend/backend to generate
// For now we implement the service structure that calls a dummy generation or standard logic

export async function generateReportService(
  supabase: SupabaseClient,
  diagnosisId: string,
  doctorId: string
): Promise<{ reportUrl: string }> {
  // 1. Fetch data needed for report
  const diagnosis = await getDiagnosisService(supabase, diagnosisId, doctorId);
  const patient = await getPatientService(supabase, diagnosis.patientId, doctorId);
  
  if (diagnosis.status !== DiagnosisStatus.COMPLETED) {
    throw new ExternalServiceError("Cannot generate report for incomplete diagnosis");
  }

  try {
    // 2. Generate PDF (Placeholder for actual @react-pdf/renderer logic)
    // Normally we'd do: const pdfStream = await ReactPDF.renderToStream(<ReportDocument data={...} />);
    // For now we create a dummy text file to represent the PDF since we don't have the React component here.
    const pdfBuffer = Buffer.from(`AntarEye Diagnosis Report for ${patient.firstName} ${patient.lastName}\nDiagnosis ID: ${diagnosisId}\nStatus: ${diagnosis.status}\nPredicted Class: ${diagnosis.predictionSummary.predictedClass}\nConfidence: ${diagnosis.predictionSummary.confidence}`);
    
    // 3. Upload to storage
    const fileName = `${patient.id}/report_${diagnosisId}_${randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.REPORTS)
      .upload(fileName, pdfBuffer, { contentType: "application/pdf" });

    if (uploadError) {
      throw new ExternalServiceError("Failed to upload report to storage");
    }

    // 4. Update diagnosis record
    await supabase
      .from(TABLES.DIAGNOSIS_SESSIONS)
      .update({ report_storage_path: fileName })
      .eq("id", diagnosisId)
      .eq("doctor_id", doctorId);

    // 5. Generate signed URL for immediate download
    const { data: signedData } = await supabase.storage
      .from(STORAGE_BUCKETS.REPORTS)
      .createSignedUrl(fileName, 3600);

    return { reportUrl: signedData?.signedUrl || "" };
  } catch (error: any) {
    throw new ExternalServiceError(`Failed to generate report: ${error.message}`);
  }
}
