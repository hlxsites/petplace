import { simplifyFileType } from "./fileUtil";

describe("simplifyFileType", () => {
  it.each([
    ["png", "image/png"],
    ["jpg", "image/jpeg"],
    ["pdf", "application/pdf"],
    ["txt", "text/plain"],
    ["doc", "application/msword"],
    [
      "docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  ])("should return %s for a file of type %s", (expected, fileType) => {
    expect(simplifyFileType(fileType)).toEqual(expected);
  });

  it("should return undefined for an unsupported file type", () => {
    const unsupportedFileType = "application/zip";
    expect(simplifyFileType(unsupportedFileType)).toBeUndefined();
  });

  it("should return undefined for an empty string", () => {
    expect(simplifyFileType("")).toBeUndefined();
  });
});
