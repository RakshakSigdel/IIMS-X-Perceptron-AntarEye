export function extractApiError(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "error" in body) {
    const err = (body as Record<string, unknown>).error;
    if (typeof err === "string") return err;
    if (typeof err === "object" && err !== null && "message" in err) {
      return String((err as Record<string, unknown>).message);
    }
  }
  return fallback;
}
