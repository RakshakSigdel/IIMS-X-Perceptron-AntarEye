/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ReportDataDto } from "../dto/report-data.dto";
import { REPORT_CONSTANTS } from "../constants";

// Register fonts if needed. For simplicity in this hackathon, we use default fonts,
// but we style them cleanly.
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: REPORT_CONSTANTS.THEME.foreground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: REPORT_CONSTANTS.THEME.primary,
    paddingBottom: 15,
    marginBottom: 20,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: REPORT_CONSTANTS.THEME.primary,
  },
  subTitle: {
    fontSize: 10,
    color: REPORT_CONSTANTS.THEME.mutedForeground,
    marginTop: 2,
  },
  metaText: {
    fontSize: 9,
    textAlign: "right",
    color: REPORT_CONSTANTS.THEME.mutedForeground,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f5f5f5",
    padding: 4,
    marginBottom: 10,
    color: REPORT_CONSTANTS.THEME.primary,
  },
  patientBlock: {
    flexDirection: "row",
    marginBottom: 20,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
    justifyContent: "center",
  },
  rowText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  imageBox: {
    width: "48%",
  },
  fundusImg: {
    width: "100%",
    height: 140,
    objectFit: "contain",
    backgroundColor: "#000",
    borderRadius: 4,
    marginBottom: 5,
  },
  imgLabel: {
    fontSize: 9,
    textAlign: "center",
    color: REPORT_CONSTANTS.THEME.mutedForeground,
  },
  predictionBlock: {
    marginBottom: 20,
  },
  probRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  probLabel: {
    width: "25%",
    fontSize: 9,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: REPORT_CONSTANTS.THEME.border,
    borderRadius: 4,
    marginRight: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  probValue: {
    width: "10%",
    fontSize: 9,
    textAlign: "right",
  },
  recommendationBlock: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: REPORT_CONSTANTS.THEME.border,
    borderRadius: 4,
  },
  recTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: REPORT_CONSTANTS.THEME.primary,
    marginBottom: 5,
  },
  recText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: REPORT_CONSTANTS.THEME.border,
    paddingTop: 10,
  },
  disclaimerText: {
    fontSize: 7,
    color: REPORT_CONSTANTS.THEME.mutedForeground,
    lineHeight: 1.4,
    textAlign: "justify",
  },
});

// A helper to parse bold/italic markdown loosely and render Text components.
// For simplicity in the hackathon, we render simple text. Real markdown parsing in react-pdf
// requires splitting nodes.
const renderMarkdownText = (text: string) => {
  // We just remove the markdown asterisks for the basic implementation to avoid breaking PDF.
  const cleanText = text.replace(/\*\*/g, "").replace(/\*/g, "");
  return cleanText;
};

export const DiagnosisReportDocument = ({ data }: { data: ReportDataDto }) => {
  const formatClass = (cls: string) =>
    cls
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const logoSrc = REPORT_CONSTANTS.IMAGES.getLogo();
  const personSrc = REPORT_CONSTANTS.IMAGES.getPersonPlaceholder();
  const notAvailSrc = REPORT_CONSTANTS.IMAGES.getNotAvailablePlaceholder();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {logoSrc && <Image src={logoSrc} style={styles.logo} />}
            <View>
              <Text style={styles.title}>AntarEye</Text>
              <Text style={styles.subTitle}>AI-Assisted Retinal Screening</Text>
            </View>
          </View>
          <View>
            <Text style={styles.metaText}>{data.clinicName}</Text>
            <Text style={styles.metaText}>
              Date: {new Date(data.generatedAt).toLocaleDateString()}
            </Text>
            <Text style={styles.metaText}>
              Report ID: {data.reportId.slice(0, 8).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* PATIENT INFO */}
        <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>
        <View style={styles.patientBlock}>
          <Image
            src={data.patient.photoBase64 || personSrc}
            style={styles.photo}
          />
          <View style={styles.patientInfo}>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>Name:</Text> {data.patient.firstName}{" "}
              {data.patient.lastName}
            </Text>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>DOB:</Text> {data.patient.dateOfBirth} (
              {data.patient.age} yrs)
            </Text>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>Gender:</Text> {data.patient.gender}
            </Text>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>Patient ID:</Text> {data.patient.id}
            </Text>
          </View>
        </View>

        {/* DIAGNOSIS RESULTS */}
        <Text style={styles.sectionTitle}>DIAGNOSIS RESULTS</Text>

        <View style={styles.imagesRow}>
          <View style={styles.imageBox}>
            <Image
              src={data.images.originalBase64 || notAvailSrc}
              style={styles.fundusImg}
            />
            <Text style={styles.imgLabel}>Original Fundus Image</Text>
          </View>
          <View style={styles.imageBox}>
            <Image
              src={data.images.heatmapBase64 || notAvailSrc}
              style={styles.fundusImg}
            />
            <Text style={styles.imgLabel}>AI Activation Heatmap</Text>
          </View>
        </View>

        <View style={styles.predictionBlock}>
          <Text style={[styles.rowText, { marginBottom: 10 }]}>
            <Text style={styles.bold}>Primary Finding:</Text>{" "}
            {formatClass(data.diagnosis.predictedClass)} (
            {Math.round(data.diagnosis.confidence * 100)}% Confidence)
          </Text>

          {Object.entries(data.diagnosis.probabilities).map(([cls, prob]) => {
            const percent = Math.round(prob * 100);
            let barColor: string = REPORT_CONSTANTS.THEME.success;
            if (cls === "diabetic_retinopathy" || cls === "glaucoma") {
              barColor = REPORT_CONSTANTS.THEME.destructive;
            }
            if (cls === "hypertensive_retinopathy") {
              barColor = REPORT_CONSTANTS.THEME.warning;
            }

            return (
              <View style={styles.probRow} key={cls}>
                <Text style={styles.probLabel}>{formatClass(cls)}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${percent}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
                <Text style={styles.probValue}>{percent}%</Text>
              </View>
            );
          })}
        </View>

        {/* RECOMMENDATIONS */}
        <Text style={styles.sectionTitle}>CLINICAL RECOMMENDATIONS</Text>
        <View style={styles.recommendationBlock}>
          <Text style={styles.recTitle}>For the Examining Physician:</Text>
          <Text style={styles.recText}>
            {data.recommendations.doctor
              ? renderMarkdownText(data.recommendations.doctor)
              : "No clinical recommendation generated."}
          </Text>
        </View>
        <View
          style={[
            styles.recommendationBlock,
            { borderColor: REPORT_CONSTANTS.THEME.success },
          ]}
        >
          <Text style={[styles.recTitle, { color: REPORT_CONSTANTS.THEME.success }]}>
            For the Patient:
          </Text>
          <Text style={styles.recText}>
            {data.recommendations.patient
              ? renderMarkdownText(data.recommendations.patient)
              : "No patient recommendation generated."}
          </Text>
        </View>

        {/* DOCTOR INFO */}
        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
          EXAMINING PHYSICIAN
        </Text>
        <View style={styles.patientBlock}>
          <Image
            src={data.doctor.photoBase64 || personSrc}
            style={styles.photo}
          />
          <View style={styles.patientInfo}>
            <Text style={styles.rowText}>
              <Text style={styles.bold}>Dr. {data.doctor.fullName}</Text>
            </Text>
            <Text style={styles.rowText}>{data.doctor.email}</Text>
          </View>
        </View>

        {/* FOOTER DISCLAIMER */}
        <View style={styles.footer}>
          <Text style={styles.disclaimerText}>
            {REPORT_CONSTANTS.DISCLAIMER_TEXT}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
