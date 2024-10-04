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

export function disableAemBaseMarkup() {
  // Hide the AEM header and footer
  ["header.header-wrapper", "footer.footer-wrapper"].forEach((selector) => {
    queryElement(selector)?.classList.add("hidden");
  });

  // Remove padding from the main container
  queryElement("main div.react-container")?.classList.add("!p-0");

  // Remove margin and width styles from the react wrapper
  queryElement("div.react-wrapper")?.classList.add(
    "!m-0",
    "!w-full",
    "!max-w-[100dvw]"
  );
}

export function enableAemBaseMarkup() {
  ["header.header-wrapper", "footer.footer-wrapper"].forEach((selector) => {
    queryElement(selector)?.classList.remove("hidden");
  });

  queryElement("main div.react-container")?.classList.remove("!p-0");

  queryElement("div.react-wrapper")?.classList.remove(
    "!m-0",
    "!w-full",
    "!max-w-[100dvw]"
  );
}

function queryElement(selector: string) {
  return document.querySelector(selector);
}
