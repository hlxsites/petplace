import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNames(...inputs: ClassValue[]): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return twMerge(clsx(inputs));
}
