import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountNotificationsUseCase } from "./GetAccountNotificationsUseCase";
import getAccountNotificationsMock from "./mocks/getAccountNotificationsMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetAccountNotificationsUseCase", () => {
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
      partnerOffer: true,
      signedCatNewsletter: true,
      signedDogNewsletter: true,
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
  return new GetAccountNotificationsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
