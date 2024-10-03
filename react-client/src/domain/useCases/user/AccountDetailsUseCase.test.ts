import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import * as authUtil from "../../../util/authUtil";
import { AccountDetailsUseCase } from "./AccountDetailsUseCase";
import getAccountDetailsMock from "./mocks/getAccountDetailsMock.json";

jest.mock("~/util/authUtil", () => ({
  checkIsExternalLogin: jest.fn(),
  readJwtClaim: jest.fn(),
}));

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

// Mock Rollbar error method
jest.mock("@rollbar/react", () => ({
  useRollbar: jest.fn().mockReturnValue({
    error: jest.fn(),
  }),
}));

describe("AccountDetailsUseCase", () => {
  beforeEach(() => {
    (authUtil.checkIsExternalLogin as jest.Mock).mockReset();
  });

  describe("GET", () => {
    it("should return null whenever it finds no data", async () => {
      (authUtil.checkIsExternalLogin as jest.Mock).mockReturnValue(false);
      const httpClient = new MockHttpClient({ data: null });
      const sut = makeSut(httpClient);
      const result = await sut.query();
      expect(result).toBeNull();
    });

    it("should return internal account details", async () => {
      (authUtil.checkIsExternalLogin as jest.Mock).mockReturnValue(false);
      const httpClient = new MockHttpClient({ data: getAccountDetailsMock });
      const sut = makeSut(httpClient);
      const result = await sut.query();

      expect(result).toStrictEqual({
        name: "Augustus",
        surname: "Waters",
        email: "augustus.ok@email.com",
        defaultPhone: "71 988776655|Home",
      });
    });

    it("should return external account details", async () => {
      (authUtil.checkIsExternalLogin as jest.Mock).mockReturnValue(true);
      const httpClient = new MockHttpClient({ data: getAccountDetailsMock });
      const sut = makeSut(httpClient);
      const result = await sut.query();

      expect(result).toStrictEqual({
        address: {
          address1: "808 Benninghaus Rd",
          address2: "",
          city: "Baltimore",
          country: "US",
          state: "MD",
          zipCode: "21212-3943",
        },
        contactConsent: true,
        defaultPhone: "71 988776655|Work",
        email: "augustus.ok@email.com",
        informationConsent: false,
        name: "Augustus",
        secondaryPhone: "416-709-5781|Home",
        surname: "Waters",
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

  describe("PUT", () => {
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
