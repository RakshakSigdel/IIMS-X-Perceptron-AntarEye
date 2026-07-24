"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-destructive/10 mb-5">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => reset()} variant="outline">
          <RotateCcw className="size-4" />
          Try Again
        </Button>
        <a href="/">
          <Button variant="ghost">
            <Home className="size-4" />
            Go Home
          </Button>
        </a>
      </div>
    </div>
  );
}
