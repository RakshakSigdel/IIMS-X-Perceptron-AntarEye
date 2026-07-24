export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  public readonly errors?: Record<string, unknown>;

  constructor(message: string = "Validation failed", errors?: Record<string, unknown>) {
    super(message, 400);
    this.errors = errors;
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = "External service failed") {
    super(message, 502);
  }
}
