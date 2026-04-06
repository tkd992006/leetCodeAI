import type { Context } from "hono";
import { AppError } from "../errors";

/**
 * Global error handler middleware.
 * Maps AppError subclasses to structured JSON responses.
 */
export function errorHandler(err: Error, c: Context) {
  if (err instanceof AppError) {
    return c.json(
      { success: false, error: { code: err.code, message: err.message } },
      err.statusCode as 400 | 403 | 404,
    );
  }

  console.error("Unhandled error:", err);
  return c.json(
    { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
    500,
  );
}
