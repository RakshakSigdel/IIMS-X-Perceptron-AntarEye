import { DiagnosisStatus, STORAGE_BUCKETS, TABLES } from "@/lib/constants";
import { ExternalServiceError } from "@/lib/errors";
import { getDiagnosisService, PredictionSummary } from "@/modules/diagnosis";
import { getPatientService } from "@/modules/patients";
import { getDoctorService } from "@/modules/doctors/services/get-doctor.service";
import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { DiagnosisReportDocument } from "../templates/DiagnosisReportDocument";
import { ReportDataDto } from "../dto/report-data.dto";
import { REPORT_CONSTANTS } from "../constants";
// Helper to download a file from Supabase storage and convert to base64
async function downloadFileAsBase64(
  supabase: SupabaseClient,
  bucket: string,
  path: string
): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error || !data) return null;
  const buffer = Buffer.from(await data.arrayBuffer());
  return `data:${data.type};base64,${buffer.toString("base64")}`;
}

export async function generateReportService(
  supabase: SupabaseClient,
  diagnosisId: string,
  doctorId: string,
): Promise<{ reportUrl: string }> {
  // 1. Fetch data needed for report
  const diagnosis = await getDiagnosisService(supabase, diagnosisId, doctorId);
  const patient = await getPatientService(
    supabase,
    diagnosis.patientId,
    doctorId,
  );

  if (diagnosis.status !== DiagnosisStatus.COMPLETED) {
    throw new ExternalServiceError(
      "Cannot generate report for incomplete diagnosis",
    );
  }

  try {
    // 2. Fetch Doctor
    const doctor = await getDoctorService(supabase, doctorId);

    // 3. Fetch images as base64 for PDF embedding
    const originalBase64 = await downloadFileAsBase64(
      supabase,
      STORAGE_BUCKETS.FUNDUS_IMAGES,
      diagnosis.originalImageStoragePath
    );
    let heatmapBase64 = null;
    if (diagnosis.heatmapStoragePath) {
      heatmapBase64 = await downloadFileAsBase64(
        supabase,
        STORAGE_BUCKETS.HEATMAPS,
        diagnosis.heatmapStoragePath
      );
    }

    // 4. Assemble Report Data
    const predictionSummary = diagnosis.predictionSummary as PredictionSummary;
    
    // Calculate Age
    const dob = new Date(patient.dateOfBirth);
    const age = Math.floor((new Date().getTime() - dob.getTime()) / 31557600000);

    const reportData: ReportDataDto = {
      reportId: diagnosisId,
      generatedAt: new Date().toISOString(),
      clinicName: REPORT_CONSTANTS.CLINIC_NAME,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        age,
        gender: patient.gender,
        phone: patient.phone,
      },
      doctor: {
        fullName: doctor.fullName,
        email: doctor.email,
      },
      diagnosis: {
        predictedClass: predictionSummary.predictedClass,
        confidence: predictionSummary.confidence,
        triageLevel: predictionSummary.triageLevel,
        probabilities: predictionSummary.probabilities,
      },
      recommendations: {
        doctor: diagnosis.llmDoctorRecommendation,
        patient: diagnosis.llmPatientRecommendation,
      },
      images: {
        originalBase64,
        heatmapBase64,
      },
    };

    // 5. Generate PDF Buffer via @react-pdf/renderer
    const pdfStream = await ReactPDF.renderToStream(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(DiagnosisReportDocument, { data: reportData }) as any
    );

    // Convert NodeJS stream to Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    throw new ExternalServiceError(`Failed to generate report: ${message}`);
  }
}
