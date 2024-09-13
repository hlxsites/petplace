import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetDocumentsUseCase } from "./GetPetDocumentsUseCase";
import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import getPetDocumentsMock from "./mocks/getPetDocumentsMock.json";
import getPetDocumentsMock2 from "./mocks/getPetDocumentsMock2.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetPetDocumentsUseCase", () => {
  it("should return an empty array when no documents are found", async () => {
    const sut = makeSut();
    expect(await sut.query("pet-id")).toStrictEqual([]);
  });

  it("should return the correct pet documents list", async () => {
    const httpClient = new MockHttpClient({ data: getPetDocumentsMock });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id");
    expect(result).toStrictEqual([
      {
        downloadPath: "doc-1",
        fileName: "Vaccine Record.pdf",
        fileType: "pdf",
        id: "doc-1",
        recordType: "vaccines",
      },
    ]);
  });

  it("should return the correct pet documents list 2", async () => {
    const httpClient = new MockHttpClient({ data: getPetDocumentsMock2 });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id2");
    expect(result).toStrictEqual([
      {
        downloadPath: "doc-2",
        fileName: "Adoption Paper.pdf",
        fileType: "pdf",
        id: "doc-2",
        recordType: "other",
      },
      {
        downloadPath: "doc-3",
        fileName: "Medical Report.pdf",
        fileType: "pdf",
        id: "doc-3",
        recordType: "medical-records",
      },
    ]);
  });

  it("should return an empty array when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("pet-id");
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetPetDocumentsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
