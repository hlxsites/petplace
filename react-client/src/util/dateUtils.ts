export function parseDate(date?: string) {
  if (typeof date === "string") {
    return new Date(date).toLocaleDateString();
  }
  return "";
}

export function parseDateTime(date?: string) {
  if (typeof date === "string") {
    const dateObject = new Date(date);
    const localDate = dateObject.toLocaleDateString();
    const localTime = dateObject.toTimeString().slice(0, 8);
    return `${localDate} ${localTime}`;
  }
  return "";
}
