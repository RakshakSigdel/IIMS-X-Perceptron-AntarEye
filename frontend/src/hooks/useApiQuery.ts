"use client";

import { useCallback, useEffect, useState } from "react";
import { extractApiError } from "@/lib/api/extract-error";
import type { ApiResponse } from "@/lib/api/types";

interface UseApiQueryOptions {
  enabled?: boolean;
}

interface UseApiQueryResult<TData> {
  data: TData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiQuery<TData>(
  url: string | null,
  options?: UseApiQueryOptions
): UseApiQueryResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async (): Promise<void> => {
    if (!url || !enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(extractApiError(body, `Request failed with status ${response.status}`));
      }

      const envelope = (await response.json()) as ApiResponse<TData>;
      setData(envelope.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchData(), 0);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
