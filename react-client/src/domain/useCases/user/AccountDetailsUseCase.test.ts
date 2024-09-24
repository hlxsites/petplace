import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountDetailsUseCase } from "./AccountDetailsUseCase";
import getAccountDetailsMock from "./mocks/getAccountDetailsMock.json";

jest.mock("~/util/authUtil", () => ({
  readJwtClaim: jest.fn(),
}));

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("AccountDetailsUseCase", () => {
  describe("query", () => {
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
      });
    });

    it("should return null when the data doesn't match the schema", async () => {
      const invalidMockData = {
        FirstName: 2,
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

  describe("mutate", () => {
    const validAccountDetails = {
      name: "Jane",
      surname: "Doe",
      email: "jane.doe@example.com",
      phoneNumber: "555-1234|Home",
    };

    it("should update successfully without data returning", async () => {
      const httpClient = new MockHttpClient({ statusCode: 204 });
      const sut = makeSut(httpClient);
      const result = await sut.mutate(validAccountDetails);
      expect(result).toBe(true);
    });

    it("should return false when data contains invalid characters", async () => {
      const invalidDetails = { ...validAccountDetails, name: "Invalid#Name" };
      const sut = makeSut();
      const result = await sut.mutate(invalidDetails);
      expect(result).toBe(false);
    });

    it("should handle a server error correctly", async () => {
      const httpClient = new MockHttpClient({
        error: new Error("Server error"),
      });
      const sut = makeSut(httpClient);
      const result = await sut.mutate(validAccountDetails);
      expect(result).toBe(false);
    });
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new AccountDetailsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
