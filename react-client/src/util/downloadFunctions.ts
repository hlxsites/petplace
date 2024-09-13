export type DownloadFileProps = {
  downloadPath?: string;
  fileName: string;
  fileType?: string;
};

export async function downloadFile({
  downloadPath,
  fileName,
  fileType,
}: DownloadFileProps) {
  if (!downloadPath || !fileType) return;

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
    downloadLink.download = `${fileName ?? "sample"}.${fileType}`;

    // for firefox browsers
    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file: ", error);
  }
}
