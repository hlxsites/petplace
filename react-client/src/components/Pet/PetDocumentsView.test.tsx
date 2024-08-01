import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { PetDocumentsView } from "./PetDocumentsView";

const MOCK_DOCUMENTS: Props["documents"] = [
  { fileName: "Test", fileType: "doc" },
  { fileName: "Vaccine 2024", fileType: "pdf" },
  { fileName: "MEDICAL RECORDS", fileType: "txt" },
];
const UPLOAD_DOCUMENT_LABEL = /WIP - testing purposes/i;

const { getByText, getAllByRole, queryByText, getByRole } = screen;

describe("PetDocumentsView", () => {
  it.each(["medical", "vaccines", "test"] as Props["recordType"][])(
    "should render text message containing the %s recordType",
    (recordType) => {
      getRenderer({ recordType });

      expect(
        getByText(`View, download and manage all ${recordType} records.`)
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
      getByRole("button", { name: /Upload document/i }).querySelector("svg")
    ).toHaveAttribute("data-file-name", "SvgUploadCloudIcon");
  });

  it("should render the message indicating how to upload file and its accepted types and size", () => {
    getRenderer();

    expect(getByText("Click to upload or drag and drop")).toBeInTheDocument();
    expect(
      getByText(/^PNG, JPG, PDF, TXT, DOC, DOCX \(max 10Mb\)$/i)
    ).toBeInTheDocument();
  });

  it("should NOT render record file with loading view when isUploading=false", () => {
    getRenderer();

    expect(queryByText(UPLOAD_DOCUMENT_LABEL)).not.toBeInTheDocument();
  });

  // TODO: 81832 Improve the test bellow after your changes
  it("should render record file with loading view when user clicks to upload document", async () => {
    getRenderer();

    const uploadArea = getByRole("button", { name: /upload document/i });
    await userEvent.click(uploadArea);

    expect(getByText(UPLOAD_DOCUMENT_LABEL)).toBeInTheDocument();
  });

  it("should call onDelete when user clicks to delete an item", async () => {
    const onDelete = jest.fn();
    getRenderer({ onDelete });

    expect(onDelete).not.toHaveBeenCalled();

    const petRecords = getAllByRole("listitem");

    await userEvent.click(
      within(petRecords[0]).getByRole("button", {
        name: /delete file/i,
      })
    );
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

// Test utils
type Props = ComponentProps<typeof PetDocumentsView>;
function getRenderer({
  documents = MOCK_DOCUMENTS,
  onDelete = jest.fn(),
  recordType = "test",
}: Partial<Props> = {}) {
  return render(
    <PetDocumentsView
      documents={documents}
      onDelete={onDelete}
      recordType={recordType}
    />
  );
}
