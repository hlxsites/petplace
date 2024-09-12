import { ZodSchema } from "zod";

// Generic function to parse data using any Zod schema
export function parseData<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    console.error("Error parsing data", { data, error: result.error });
    return null;
  }
}
