import { MockHttpClient } from "../../mocks/MockHttpClient";
import { HttpClientRepository } from "../../repository/HttpClientRepository";
import { PetDocumentsUseCase } from "./PetDocumentsUseCase";
import getPetDocumentsMock from "./mocks/getPetDocumentsMock.json";
import getPetDocumentsMock2 from "./mocks/getPetDocumentsMock2.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("PetDocumentsUseCase", () => {
  it("should return an empty array when no documents are found", async () => {
    const sut = makeSut();
    expect(await sut.query("pet-id", "medical")).toStrictEqual([]);
  });

  it("should return the correct pet documents list", async () => {
    const httpClient = new MockHttpClient({ data: getPetDocumentsMock });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id", "vaccines");
    expect(result).toStrictEqual([
      {
        downloadPath: "doc-1",
        fileName: "Vaccine Record.pdf",
        fileType: "pdf",
        id: "doc-1",
        type: "vaccines",
      },
    ]);
  });

  it("should return the correct pet documents list for type other", async () => {
    const httpClient = new MockHttpClient({ data: getPetDocumentsMock2 });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id2", "other");
    expect(result).toStrictEqual([
      {
        downloadPath: "doc-2",
        fileName: "Adoption Paper.pdf",
        fileType: "pdf",
        id: "doc-2",
        type: "other",
      },
    ]);
  });

  it("should return the correct pet documents list for type medical", async () => {
    const httpClient = new MockHttpClient({ data: getPetDocumentsMock2 });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id2", "medical");
    expect(result).toStrictEqual([
      {
        downloadPath: "doc-3",
        fileName: "Medical Report.pdf",
        fileType: "pdf",
        id: "doc-3",
        type: "medical",
      },
    ]);
  });

  it("should return an empty array when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id", "medical");
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new PetDocumentsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
