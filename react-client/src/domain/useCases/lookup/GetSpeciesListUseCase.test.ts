import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetSpeciesListUseCase } from "./GetSpeciesListUseCase";
import getSpeciesListMock from "./mocks/getSpeciesListMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetSpeciesListUseCase", () => {
  it("should return null when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });

  it("should return the correct pet info", async () => {
    const httpClient = new MockHttpClient({ data: getSpeciesListMock });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([
      { id: 1, name: "Dog" },
      { id: 2, name: "Cat" },
    ]);
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = [{ id: "234" }];
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([]);
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetSpeciesListUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
