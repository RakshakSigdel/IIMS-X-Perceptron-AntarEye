import { NextResponse } from "next/server";
import { AppError, ValidationError } from "../errors";

export function successResponse<T>(data: T, status: number = 200, meta?: unknown) {
  return NextResponse.json({ data, error: null, meta }, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { data: null, error: { message: error.message, details: error.errors } },
      { status: error.statusCode }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { data: null, error: { message: error.message } },
      { status: error.statusCode }
    );
  }

  // Handle generic / unexpected errors
  console.error("Unhandled error:", error);
  return NextResponse.json(
    { data: null, error: { message: "Internal server error" } },
    { status: 500 }
  );
}
