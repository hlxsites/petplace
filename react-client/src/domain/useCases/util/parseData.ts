import { ZodSchema } from "zod";
import { logError } from "~/infrastructure/telemetry/logUtils";

// Generic function to parse data using any Zod schema
export function parseData<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    logError("Error parsing data", { data, error: result.error });
    return null;
  }
}
