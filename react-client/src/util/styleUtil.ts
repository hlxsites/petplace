import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNames(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function resetBodyStyles() {
  document.body.style.display = "block";
  document.body.style.overflow = "visible";
  document.body.style.position = "static";
}
