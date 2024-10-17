import { logError } from "~/infrastructure/telemetry/logUtils";

type DialPhoneNumberProps = {
  href: string;
};

export function dialPhoneNumber({ href }: DialPhoneNumberProps) {
  try {
    const phoneLink = document.createElement("a");
    phoneLink.style.display = "none";
    phoneLink.href = href;

    // for firefox browsers
    document.body.appendChild(phoneLink);
    phoneLink.click();
    document.body.removeChild(phoneLink);
  } catch (error) {
    logError("Dialing error: ", error);
  }
}
