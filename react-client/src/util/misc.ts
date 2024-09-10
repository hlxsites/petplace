export const isBrowser = typeof window !== "undefined";

export function safeIdFromText(text: string) {
  return text
    .replace(/[\s\t]/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLocaleLowerCase();
}

export function createNumericArray(quantity: number) {
  return Array.from(Array(quantity).keys());
}
