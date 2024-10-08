import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetBreedListUseCase } from "./GetBreedListUseCase";
import getBreedListMock from "./mocks/getBreedListMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_ID = 1

describe("GetBreedListUseCase", () => {
  it("should return null when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);
    expect(result).toStrictEqual([]);
  });

  it("should return the breed list", async () => {
    const httpClient = new MockHttpClient({ data: getBreedListMock });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);

    expect(result).toStrictEqual([
      { id: 1, name: "Poodle" },
      { id: 2, name: "Golden Retriever" },
      { id: 3, name: "Labrador" },
      { id: 4, name: "Pug" },
      { id: 5, name: "Beagle" },
    ]);
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = [{ id: "234" }];
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);

    expect(result).toStrictEqual([]);
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetBreedListUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
