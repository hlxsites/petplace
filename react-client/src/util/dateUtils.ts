import { format, isValid, parseISO } from "date-fns";

const USA_DATE_FORMAT = "MM/dd/yyyy";

export type DateInput = Date | string;

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

export function parseDateToFormat(
  date: DateInput,
  toFormat: string = USA_DATE_FORMAT
): string {
  if (typeof date === "string") {
    const parsed = parseISO(date);
    if (!isValid(parsed)) {
      return "";
    }

    return format(parsed, toFormat);
  }
  if (!isValid(date)) {
    return "";
  }

  return format(date, toFormat);
}
