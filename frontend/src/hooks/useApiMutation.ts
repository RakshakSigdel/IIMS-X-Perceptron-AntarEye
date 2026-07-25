"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/extract-error";
import type { ApiResponse } from "@/lib/api/types";

interface UseApiMutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  isLoading: boolean;
  error: string | null;
}

export function useApiMutation<TData, TVariables = unknown>(
  url: string,
  method: "POST" | "PATCH" | "DELETE" = "POST",
  options?: UseApiMutationOptions<TData>
): UseApiMutationResult<TData, TVariables> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const isFormData = variables instanceof FormData;

        const response = await fetch(url, {
          method,
          headers: isFormData ? undefined : { "Content-Type": "application/json" },
          body: isFormData ? variables : JSON.stringify(variables),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(extractApiError(body, `Request failed with status ${response.status}`));
        }

        const envelope = (await response.json()) as ApiResponse<TData>;
        const data = envelope.data;

        if (options?.successMessage) {
          toast.success(options.successMessage);
        }

        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        toast.error(options?.errorMessage ?? message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, options]
  );

  return { mutate, isLoading, error };
}
