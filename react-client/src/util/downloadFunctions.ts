import { PetCardRecordProps } from "../components/Pet/types/PetRecordsTypes";

type DownloadFileProps = Omit<
  PetCardRecordProps,
  "onClick" | "isUploadingFile"
>;

export async function downloadFile({
  downloadPath,
  fileName,
  fileType,
}: DownloadFileProps) {
  if (!downloadPath) return;

  try {
    const response = await fetch(downloadPath);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = url;
    downloadLink.download = `${fileName}.${fileType}`;

    // for firefox browsers
    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file: ", error);
  }
}
