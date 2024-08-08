import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import * as downloadFunctions from "../../util/downloadFunctions";
import { PetCardRecord } from "./PetCardRecord";

const { getByRole, queryByRole } = screen;

const DELETE_BUTTON = /delete file/i;
const DOWNLOAD_BUTTON = /download file/i;

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
  >["record"]["fileType"][])(
    "should display the correct icon based on fileType",
    (fileType) => {
      getRenderer({
        record: {
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
      getRenderer({ record: { id: "1", fileName } });

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

  it("should download the file with expected values when download button is clicked", async () => {
    const downloadFileSpy = jest
      .spyOn(downloadFunctions, "downloadFile")
      .mockImplementation(() => Promise.resolve());

    getRenderer();
    expect(downloadFileSpy).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: DOWNLOAD_BUTTON }));

    expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    expect(downloadFileSpy).toHaveBeenCalledWith({
      downloadPath: "http://example.com/file.jpg",
      fileName: "Test name",
      fileType: "jpg",
    });
  });
});

function getRenderer({
  isUploadingFile = false,
  record = {
    id: "test",
    downloadPath: "http://example.com/file.jpg",
    fileName: "Test name",
    fileType: "jpg",
  },
  ...props
}: Partial<ComponentProps<typeof PetCardRecord>> = {}) {
  return render(
    <PetCardRecord
      record={record}
      isUploadingFile={isUploadingFile}
      {...props}
    />
  );
}
