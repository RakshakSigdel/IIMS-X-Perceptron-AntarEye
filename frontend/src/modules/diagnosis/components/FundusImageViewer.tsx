"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";

interface FundusImageViewerProps {
  originalImageUrl?: string;
  heatmapUrl?: string | null;
}

export function FundusImageViewer({
  originalImageUrl,
  heatmapUrl,
}: FundusImageViewerProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const currentUrl = showHeatmap && heatmapUrl ? heatmapUrl : originalImageUrl;

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toggle */}
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
          <button
            type="button"
            onClick={() => setShowHeatmap(false)}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              !showHeatmap
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Original
          </button>
          {heatmapUrl && (
            <button
              type="button"
              onClick={() => setShowHeatmap(true)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                showHeatmap
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Heatmap
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Expand image"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-square bg-muted/20">
          {currentUrl ? (
            <motion.img
              key={showHeatmap ? "heatmap" : "original"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={currentUrl}
              alt={showHeatmap ? "AI Heatmap" : "Fundus image"}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
      </div>

      {/* Expanded modal */}
      {expanded && currentUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={currentUrl}
            alt="Expanded view"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
