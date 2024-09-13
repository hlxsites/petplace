export function parseDate(date?: string) {
  if (typeof date === "string") {
    return new Date(date).toLocaleDateString();
  }
  return "";
}
