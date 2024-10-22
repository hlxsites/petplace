import { logError } from "~/infrastructure/telemetry/logUtils";

export type DownloadFileProps = {
  blob?: Blob;
  url?: string;
  fileName: string;
  fileType?: string;
};

export function downloadFile({
  blob,
  url,
  fileName,
  fileType,
}: DownloadFileProps) {
  if (!blob && !url) return;

  try {
    if (url) {
      window.open(url, "_blank");
      return;
    }

    if (blob) {
      if (!fileType) return;
      const downloadUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.style.display = "none";
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;

      // for Firefox browsers
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the object URL if it was created
      URL.revokeObjectURL(downloadUrl);
    }
  } catch (error) {
    logError("Error downloading the file: ", error);
  }
}
