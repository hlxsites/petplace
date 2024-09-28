import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountNotificationsUseCase } from "./AccountNotificationsUseCase";
import getAccountNotificationsMock from "./mocks/getAccountNotificationsMock.json";
import * as authUtil from '~/util/authUtil';

jest.mock('~/util/authUtil', () => ({
  readJwtClaim: jest.fn(),
}));

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("AccountNotificationsUseCase", () => {
  describe("GET", () => {
    it("should return null whenever it finds no data", async () => {
      const httpClient = new MockHttpClient({ data: null });
      const sut = makeSut(httpClient);
      const result = await sut.query();
      expect(result).toBeNull();
    });
  
    it("should return account notifications preferences", async () => {
      const httpClient = new MockHttpClient({
        data: getAccountNotificationsMock,
      });
      const sut = makeSut(httpClient);
      const result = await sut.query();
  
      expect(result).toStrictEqual({
        emailAlert: true,
        petPlaceOffer: true,
        partnerOffer: true,
        signedCatNewsletter: true,
        signedDogNewsletter: true,
        smsAlert: false,
      });
    });
  
    it("should return null when the data doesn't match the schema", async () => {
      const invalidMockData = {
        DogNewsletterOptIn: "true",
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
  })


  describe("PUT", () => {
    const validAccountNotifications = {
      emailAlert: true,
      petPlaceOffer: true,
      partnerOffer: true,
      signedCatNewsletter: true,
      signedDogNewsletter: true,
      smsAlert: true,
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should update successfully without data returning", async () => {
      (authUtil.readJwtClaim as jest.Mock).mockReturnValue({
        postalCode: "12345",
      });
      const httpClient = new MockHttpClient({ statusCode: 204 });
      const sut = makeSut(httpClient);
      const result = await sut.mutate(validAccountNotifications);
      expect(result).toBe(true);
    });

    it("should return false when data contains invalid characters", async () => {
      const invalidDetails = { ...validAccountNotifications, emailAlert: "True" };
      const sut = makeSut();
      // @ts-expect-error the test aims to stop wrong type values 
      const result = await sut.mutate(invalidDetails);
      expect(result).toBe(false);
    });

    it("should handle a server error correctly", async () => {
      const httpClient = new MockHttpClient({
        error: new Error("Server error"),
      });
      const sut = makeSut(httpClient);
      const result = await sut.mutate(validAccountNotifications);
      expect(result).toBe(false);
    });
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new AccountNotificationsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
