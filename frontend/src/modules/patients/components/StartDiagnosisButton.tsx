"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { API_ROUTES, PAGE_ROUTES } from "@/lib/constants";
import { extractApiError } from "@/lib/api/extract-error";
import type { ApiResponse } from "@/lib/api/types";
import { Upload, X, Loader2, Eye } from "lucide-react";

interface StartDiagnosisButtonProps {
  patientId: string;
}

export function StartDiagnosisButton({ patientId }: StartDiagnosisButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are accepted.");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("patientId", patientId);

      const response = await fetch(API_ROUTES.DOCTOR.DIAGNOSIS, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(extractApiError(body, "Diagnosis failed"));
      }

      const envelope = (await response.json()) as ApiResponse<{ id: string }>;
      const result = envelope.data;
      router.push(PAGE_ROUTES.DOCTOR.DIAGNOSIS(result.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsUploading(false);
    }
  };

  const reset = (): void => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setIsOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Eye className="size-4" />
        Start Diagnosis
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isUploading && reset()}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative z-50 w-full max-w-md rounded-xl border border-border",
                "bg-card p-6 shadow-lg mx-4"
              )}
            >
              <h2 className="text-lg font-semibold text-foreground">
                Start New Diagnosis
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a retinal fundus image to begin AI analysis.
              </p>

              {/* Upload area */}
              <div className="mt-4">
                {!preview ? (
                  <label
                    htmlFor="fundus-image"
                    className={cn(
                      "flex flex-col items-center justify-center gap-2",
                      "h-48 rounded-xl border-2 border-dashed border-border",
                      "bg-muted/30 cursor-pointer",
                      "hover:border-primary/40 hover:bg-muted/50",
                      "transition-colors duration-200"
                    )}
                  >
                    <Upload className="size-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload fundus image
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      JPG, JPEG or PNG (max 10MB)
                    </span>
                    <input
                      ref={fileInputRef}
                      id="fundus-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border w-full h-48">
                    <Image
                      src={preview}
                      alt="Fundus image preview"
                      fill
                      className="object-cover"
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                        <Loader2 className="size-8 text-primary animate-spin mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          Analyzing image…
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This may take up to 30 seconds
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-3 text-sm text-destructive">{error}</p>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={reset}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => void handleUpload()}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    "Start Analysis"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
