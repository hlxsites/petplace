import { logError } from "~/infrastructure/telemetry/logUtils";

export type DownloadFileProps = {
  blob?: Blob;
  fileName: string;
  fileType?: string;
};

export function downloadFile({ blob, fileName, fileType }: DownloadFileProps) {
  if (!blob || !fileType) return;

  try {
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = url;
    downloadLink.download = `${fileName ?? "sample"}`;

    // for firefox browsers
    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  } catch (error) {
    logError("Error downloading the file: ", error);
  }
}
