import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountNotificationsUseCase } from "./AccountNotificationsUseCase";
import getAccountNotificationsMock from "./mocks/getAccountNotificationsMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("AccountNotificationsUseCase", () => {
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
