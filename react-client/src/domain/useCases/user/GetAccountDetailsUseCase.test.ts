import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountDetailsUseCase } from "./GetAccountDetailsUseCase";
import getAccountDetailsMock from "./mocks/getAccountDetailsMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetAccountDetailsUseCase", () => {
  it("should return null whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toBeNull();
  });

  it("should return account details", async () => {
    const httpClient = new MockHttpClient({ data: getAccountDetailsMock });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual({
      name: "Augustus",
      surname: "Waters",
      email: "augustus.ok@email.com",
      phoneNumber: "(234) 345 6876",
      zipCode: "23456",
    });
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      name: "Samantha",
      surname: "Kingston",
    };
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toBeNull();
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toBeNull();
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetAccountDetailsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
