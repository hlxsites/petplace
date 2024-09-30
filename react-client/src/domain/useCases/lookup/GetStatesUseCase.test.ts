import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetStatesUseCase } from "./GetStatesUseCase";
import getStatesMock from "./mocks/getStatesMock.json";

const DEFAULT_COUNTRY = "CA";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetStatesUseCase", () => {
  it("should return empty array whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);
    expect(result).toStrictEqual([]);
  });

  it("should return an array of states", async () => {
    const httpClient = new MockHttpClient({ data: getStatesMock });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);

    expect(result).toStrictEqual([
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Nova Scotia",
      "Northwest Territories",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon",
    ]);
  });

  it("should return empty array when the data doesn't match the schema", async () => {
    const invalidMockData = [7];
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);

    expect(result).toStrictEqual([]);
  });

  it("should return empty array when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetStatesUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
