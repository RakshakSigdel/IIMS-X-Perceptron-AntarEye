import Link from "next/link";
import { PAGE_ROUTES } from "@/lib/constants";
import {
  Eye,
  ScanEye,
  FileText,
  Activity,
  Shield,
  Upload,
  Brain,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AntarEye — AI-Assisted Retinal Disease Diagnosis",
  description:
    "AI-powered retinal disease screening platform for ophthalmologists. Detect Diabetic Retinopathy, Glaucoma, and Hypertensive Retinopathy from fundus images with confidence.",
};

const FEATURES = [
  {
    icon: ScanEye,
    title: "AI Disease Detection",
    description:
      "Advanced deep learning models detect Diabetic Retinopathy, Glaucoma, and Hypertensive Retinopathy from fundus images.",
    accentClass: "bg-primary/10 text-primary",
  },
  {
    icon: Activity,
    title: "Grad-CAM Heatmaps",
    description:
      "Visualize exactly where the AI found anomalies with gradient-weighted class activation maps overlaid on the original image.",
    accentClass: "bg-warning/10 text-warning",
  },
  {
    icon: FileText,
    title: "Medical Reports",
    description:
      "Auto-generated PDF reports with prediction results, heatmaps, and AI-powered recommendations for both doctors and patients.",
    accentClass: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "Patient Triage",
    description:
      "Intelligent priority classification helps doctors focus on the most critical cases first with a confidence-based triage system.",
    accentClass: "bg-destructive/10 text-destructive",
  },
];

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Fundus Image",
    description: "Upload a retinal fundus image for your patient's examination.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our AI model analyzes the image, detects diseases, and generates a heatmap visualization.",
  },
  {
    step: "03",
    icon: ClipboardCheck,
    title: "Review & Report",
    description:
      "Review results, AI recommendations, and download a comprehensive medical report.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
              <Eye className="size-4 text-primary" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">
              AntarEye
            </span>
          </div>
          <Link
            href={PAGE_ROUTES.PUBLIC.LOGIN}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign In
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-3xl opacity-60" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            AI-Powered Medical Diagnosis
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-[1.1]">
            AI-Assisted{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Retinal Disease
            </span>{" "}
            Diagnosis
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Empowering ophthalmologists with AI-driven screening for Diabetic
            Retinopathy, Glaucoma, and Hypertensive Retinopathy. Faster
            diagnosis. Better outcomes.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={PAGE_ROUTES.PUBLIC.LOGIN}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { value: "3", label: "Diseases Detected" },
              { value: "<30s", label: "Analysis Time" },
              { value: "PDF", label: "Reports Generated" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Powerful Features
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Everything an ophthalmologist needs for AI-assisted retinal screening
            in a single platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center size-10 rounded-lg mb-4 ${feature.accentClass}`}
              >
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Three simple steps from image upload to a comprehensive diagnosis
              report.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}

                <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-card border border-border shadow-xs mb-4">
                  <step.icon className="size-7 text-primary" />
                </div>
                <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2">
                  Step {step.step}
                </p>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-10 sm:p-16">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Ready to transform your practice?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Start using AI-assisted retinal disease diagnosis today. Contact
            your administrator to get started.
          </p>
          <Link
            href={PAGE_ROUTES.PUBLIC.LOGIN}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
          >
            Sign In Now
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">AntarEye</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AntarEye — IIMS × Perceptron. AI-assisted
            decision support. Not a replacement for clinical judgment.
          </p>
        </div>
      </footer>
    </div>
  );
}
