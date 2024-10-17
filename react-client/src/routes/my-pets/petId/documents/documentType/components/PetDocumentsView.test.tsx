import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { PetDocumentsView } from "./PetDocumentsView";

const MOCK_DOCUMENTS: Props["documents"] = [
  { fileName: "Test", fileType: "doc", id: "9090" },
  { fileName: "Vaccine 2024", fileType: "pdf", id: "8080" },
  { fileName: "MEDICAL RECORDS", fileType: "txt", id: "7070" },
];
const UPLOAD_DOCUMENT_LABEL = /WIP - testing purposes/i;

const { getByText, getAllByRole, queryByText, getByRole } = screen;

describe("PetDocumentsView", () => {
  it.each(["medical", "vaccines", "test"] as Props["documentType"][])(
    "should render text message containing the %s documentType",
    (documentType) => {
      getRenderer({ documentType });

      expect(
        getByText(`View, download and manage all ${documentType} records.`)
      ).toBeInTheDocument();
    }
  );

  it("should render all pet records already uploaded", () => {
    getRenderer();

    const petRecords = getAllByRole("listitem");
    expect(petRecords.length).toBe(MOCK_DOCUMENTS.length);
  });

  it("should render paragraph indicating the area for attach files", () => {
    getRenderer();
    expect(getByText("Upload and attach files")).toBeInTheDocument();
  });

  it("should render the correct icon on the upload area", () => {
    getRenderer();

    expect(
      getByRole("button", { name: /Upload pet documents/i }).querySelector(
        "svg"
      )
    ).toHaveAttribute("data-file-name", "SvgUploadCloudIcon");
  });

  it("should render the message indicating how to upload file and its accepted types", () => {
    getRenderer();

    expect(getByText("Click to upload or drag and drop")).toBeInTheDocument();
    expect(
      getByText(/^PNG, JPG, JPEG, PDF, TXT, DOC, DOCX/i)
    ).toBeInTheDocument();
  });

  it("should render the message indicating how to upload file and the accepted size", () => {
    getRenderer();

    expect(getByText("Click to upload or drag and drop")).toBeInTheDocument();
    expect(getByText(/^\(max 10Mb\)$/i)).toBeInTheDocument();
  });

  it("should NOT render record file with loading view when isUploading=false", () => {
    getRenderer();

    expect(queryByText(UPLOAD_DOCUMENT_LABEL)).not.toBeInTheDocument();
  });

  // TODO: 81832 implement the test bellow after setting up the file upload
  it.skip("should render record file with loading view when user clicks to upload document", async () => {
    getRenderer();

    const uploadArea = getByRole("button", { name: /upload pet documents/i });
    await userEvent.click(uploadArea);

    expect(getByText(UPLOAD_DOCUMENT_LABEL)).toBeInTheDocument();
  });

  it("should call onDelete when user clicks to delete an item", async () => {
    const onDelete = jest.fn();
    getRenderer({ onDelete: () => onDelete });

    expect(onDelete).not.toHaveBeenCalled();

    const petRecords = getAllByRole("listitem");

    await userEvent.click(
      within(petRecords[0]).getByRole("button", {
        name: /delete file/i,
      })
    );
    // belongs to confirm deletion dialog
    await userEvent.click(getByRole("button", { name: /yes, delete/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("should not render error dialog when there's no download error", () => {
    getRenderer({ downloadError: null });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render error dialog when there's a download error", () => {
    getRenderer({ downloadError: "Failed to download file" });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText("Document Download Failed")
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /We're having trouble downloading your pet's document/
      )
    ).toBeInTheDocument();
  });

  it("should not render error dialog after clearing the download error", async () => {
    const clearDownloadError = jest.fn();
    const { rerender } = getRenderer({
      downloadError: "Failed to download file",
      clearDownloadError,
    });

    const dialog = screen.getByRole("dialog");
    const dismissButton = within(dialog).getByRole("button", {
      name: /dismiss/i,
    });

    await userEvent.click(dismissButton);

    rerender(
      <PetDocumentsView
        clearDownloadError={clearDownloadError}
        documents={MOCK_DOCUMENTS}
        downloadError={null}
        onDelete={jest.fn()}
        onDownload={jest.fn()}
        onUpload={jest.fn()}
        documentType="tests"
        uploadingNamesList={[]}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should close the error dialog when dismissing it", async () => {
    const clearDownloadError = jest.fn();
    getRenderer({
      downloadError: "Failed to download file",
      clearDownloadError,
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const dismissButton = within(dialog).getByRole("button", {
      name: /dismiss/i,
    });
    await userEvent.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should call clearDownloadError when dismissing the error dialog", async () => {
    const clearDownloadError = jest.fn();
    getRenderer({
      downloadError: "Failed to download file",
      clearDownloadError,
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const dismissButton = within(dialog).getByRole("button", {
      name: /dismiss/i,
    });
    await userEvent.click(dismissButton);

    await waitFor(() => {
      expect(clearDownloadError).toHaveBeenCalledTimes(1);
    });
  });
});

// Test utils
type Props = ComponentProps<typeof PetDocumentsView>;
function getRenderer({
  clearDownloadError = jest.fn(),
  documents = MOCK_DOCUMENTS,
  documentType = "tests",
  downloadError = null,
  onDelete = jest.fn(),
  onDownload = jest.fn(),
  onUpload = jest.fn(),
  uploadingNamesList = [],
}: Partial<Props> = {}) {
  return render(
    <PetDocumentsView
      clearDownloadError={clearDownloadError}
      documents={documents}
      downloadError={downloadError}
      onDelete={onDelete}
      onDownload={onDownload}
      onUpload={onUpload}
      documentType={documentType}
      uploadingNamesList={uploadingNamesList}
    />
  );
}
