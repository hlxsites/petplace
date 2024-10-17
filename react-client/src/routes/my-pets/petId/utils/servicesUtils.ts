export function copyTextToClipboard(text: string) {
  void (async function () {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  })();
}

export const acrobatReaderUrl = "https://www.adobe.com/acrobat/pdf-reader.html";
