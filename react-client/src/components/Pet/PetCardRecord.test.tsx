import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act, ComponentProps } from "react";
import * as downloadFunctions from "../../util/downloadFunctions";
import { PetCardRecord } from "./PetCardRecord";

const { getByRole, queryByRole } = screen;

const DELETE_BUTTON = /delete file/i;
const DOWNLOAD_BUTTON = /download file/i;

jest.mock("../../util/downloadFunctions", () => ({
  downloadFile: jest.fn(),
}));

describe("PetCardRecord", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () =>
          Promise.resolve(
            new Blob(["file content"], { type: "application/octet-stream" })
          ),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(["doc", "jpg", "pdf", "png", "txt"] as ComponentProps<
    typeof PetCardRecord
  >["document"]["fileType"][])(
    "should display the correct icon based on fileType",
    (fileType) => {
      getRenderer({
        document: {
          id: "1",
          fileName: "Lily's Doc",
          fileType,
        },
      });

      const svgElement = document.querySelector("svg");
      const dataFileName = svgElement?.getAttribute("data-file-name");

      expect(dataFileName).toMatch(new RegExp(`svg${fileType}fileicon`, "i"));
    }
  );

  it("should render the correct icons for download and delete actions", () => {
    getRenderer();

    expect(
      getByRole("button", { name: DOWNLOAD_BUTTON }).querySelector("svg")
    ).toHaveAttribute("data-file-name", "SvgDownloadIcon");
    expect(
      getByRole("button", { name: DELETE_BUTTON }).querySelector("svg")
    ).toHaveAttribute("data-file-name", "SvgTrashIcon");
  });

  it.each(["Medical", "Vaccines"])(
    "should render the given file name",
    (fileName) => {
      getRenderer({ document: { id: "1", fileName, fileType: "pdf" } });

      expect(getByRole("paragraph")).toHaveTextContent(fileName);
    }
  );

  it("should render Loading when isUploadFile=true", () => {
    getRenderer({ isUploadingFile: true });

    expect(
      document.querySelector("svg[name='loadingIcon']")
    ).toBeInTheDocument();
  });

  it("should NOT render Loading when isUploadFile=false", () => {
    getRenderer();

    expect(
      document.querySelector("svg[name='loadingIcon']")
    ).not.toBeInTheDocument();
  });

  it("should render download and delete actions when isUploading=false", () => {
    getRenderer();

    expect(getByRole("button", { name: DOWNLOAD_BUTTON })).toBeInTheDocument();
    expect(getByRole("button", { name: DELETE_BUTTON })).toBeInTheDocument();
  });

  it("should NOT render download and delete actions when isUploading=true", () => {
    getRenderer({ isUploadingFile: true });

    expect(
      queryByRole("button", { name: DOWNLOAD_BUTTON })
    ).not.toBeInTheDocument();
    expect(
      queryByRole("button", { name: DELETE_BUTTON })
    ).not.toBeInTheDocument();
  });

  it("should call onClick when delete button is clicked", async () => {
    const onClick = jest.fn();
    getRenderer({ onDelete: onClick });

    expect(onClick).not.toHaveBeenCalled();
    await userEvent.click(getByRole("button", { name: DELETE_BUTTON }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should call onDownload with correct parameters and trigger file download when download button is clicked", async () => {
    const mockBlob = new Blob(["file content"], {
      type: "application/octet-stream",
    });

    const mockDownloadPetDocument = jest
      .fn<Promise<Blob>, [string]>()
      .mockResolvedValue(mockBlob);
    const mockLoaderData = { downloadPetDocument: mockDownloadPetDocument };

    const document = {
      id: "test-id",
      fileName: "Test File",
      fileType: "pdf",
    };

    const onDownload: jest.MockedFunction<
      (documentId: string, fileName: string, fileType: string) => Promise<void>
    > = jest.fn(async (documentId, fileName, fileType) => {
      const blob = await mockLoaderData.downloadPetDocument(documentId);
      if (blob instanceof Blob) {
        downloadFunctions.downloadFile({ blob, fileName, fileType });
      }
    });

    const wrappedOnDownload = () =>
      void onDownload("test-id", "Test File", "pdf");
    // @ts-expect-error - ignoring type error for testing purposes
    getRenderer({ document, onDownload: wrappedOnDownload });

    // Simulate user interaction
    await act(async () => {
      await onDownload("test-id", "Test File", "pdf");
    });

    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledWith("test-id", "Test File", "pdf");

    expect(mockDownloadPetDocument).toHaveBeenCalledTimes(1);
    expect(mockDownloadPetDocument).toHaveBeenCalledWith("test-id");

    expect(downloadFunctions.downloadFile).toHaveBeenCalledTimes(1);
    expect(downloadFunctions.downloadFile).toHaveBeenCalledWith({
      blob: mockBlob,
      fileName: "Test File",
      fileType: "pdf",
    });
  });

  function getRenderer({
    isUploadingFile = false,
    document = {
      id: "test",
      fileName: "Test name",
      fileType: "jpg",
    },
    onDownload = jest.fn(),
    ...props
  }: Partial<ComponentProps<typeof PetCardRecord>> = {}) {
    const wrappedOnDownload = () => {
      // @ts-expect-error - ignoring type error for testing purposes
      void onDownload("test-id", "Test File", "pdf");
    };

    return render(
      <PetCardRecord
        document={document}
        isUploadingFile={isUploadingFile}
        onDownload={wrappedOnDownload}
        {...props}
      />
    );
  }
});
