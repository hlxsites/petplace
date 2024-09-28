import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetCountriesUseCase } from "./GetCountriesUseCase";
import getCountriesMock from "./mocks/getCountriesMock.json";

jest.mock("~/util/authUtil", () => ({
  readJwtClaim: jest.fn(),
}));

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetCountriesUseCase", () => {
  it("should return empty array whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });

  it("should return an array of countries", async () => {
    const httpClient = new MockHttpClient({ data: getCountriesMock });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual( ["CA", "US", "USA"]);
  });

  it("should return empty array when the data doesn't match the schema", async () => {
    const invalidMockData = [2];
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([]);
  });

  it("should return empty array when there is an error", async () => {
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
  return new GetCountriesUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
