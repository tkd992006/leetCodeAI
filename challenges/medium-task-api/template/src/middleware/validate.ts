import type { Context, Next } from "hono";
import { ZodSchema, ZodError } from "zod";

/**
 * Hono middleware that validates request body against a Zod schema.
 * On success, sets validated data on c.set("validated", data).
 * On failure, returns 400 with validation error details.
 */
export function validate(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const data = schema.parse(body);
      c.set("validated", data);
      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        return c.json(
          { success: false, error: { code: "VALIDATION_ERROR", message } },
          400,
        );
      }
      throw err;
    }
  };
}
