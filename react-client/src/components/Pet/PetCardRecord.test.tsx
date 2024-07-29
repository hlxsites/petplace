import { render, screen } from "@testing-library/react";
import { PetCardRecord } from "./PetCardRecord";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

const { getByRole, queryByRole, getByLabelText, queryByLabelText } = screen;

describe("PetCardRecord", () => {
  it.each(["doc", "jpg", "pdf", "png", "txt"] as ComponentProps<
    typeof PetCardRecord
  >["fileType"][])(
    "should display the correct icon based on fileType",
    (fileType) => {
      getRenderer({
        fileType,
      });

      const svgElement = document.querySelector("svg");
      const dataFileName = svgElement?.getAttribute("data-file-name");

      expect(dataFileName).toMatch(new RegExp(`svg${fileType}fileicon`, "i"));
    }
  );

  it("should render the correct icons for download and delete actions", () => {
    getRenderer();

    expect(
      getByLabelText(/download file/i).querySelector("svg")
    ).toHaveAttribute("data-file-name", "SvgDownloadIcon");
    expect(
      getByRole("button", { name: /delete file/i }).querySelector("svg")
    ).toHaveAttribute("data-file-name", "SvgTrashIcon");
  });

  it.each(["Medical", "Vaccines"])(
    "should render the given file name",
    (fileName) => {
      getRenderer({ fileName });

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

    expect(getByLabelText("download file")).toBeInTheDocument();
    expect(getByRole("button", { name: "delete file" })).toBeInTheDocument();
  });

  it("should NOT render download and delete actions when isUploading=true", () => {
    getRenderer({ isUploadingFile: true });

    expect(queryByLabelText("download file")).not.toBeInTheDocument();
    expect(
      queryByRole("button", { name: "delete file" })
    ).not.toBeInTheDocument();
  });

  it("should call onClick when delete button is clicked", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });

    expect(onClick).not.toHaveBeenCalled();
    await userEvent.click(getByRole("button", { name: "delete file" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each(["Test records", "Lily Medical Records"])(
    "should download the file with its own name",
    (fileName) => {
      getRenderer({ fileName });

      expect(getByLabelText("download file")).toHaveAttribute(
        "download",
        fileName
      );
    }
  );

  it.each(["/medical/download/", "vaccine/download"])(
    "should get download file from given path",
    (downloadPath) => {
      getRenderer({ downloadPath });

      expect(getByLabelText("download file")).toHaveAttribute(
        "href",
        downloadPath
      );
    }
  );

  it("should render download action with noopener and noreferrer options to provide extra layer of security when downloading external files", () => {
    getRenderer();

    expect(getByLabelText("download file")).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });
});

function getRenderer({
  fileName = "Test name",
  fileType = "doc",
  isUploadingFile = false,
  ...props
}: Partial<ComponentProps<typeof PetCardRecord>> = {}) {
  return render(
    <PetCardRecord
      fileName={fileName}
      fileType={fileType}
      isUploadingFile={isUploadingFile}
      {...props}
    />
  );
}
