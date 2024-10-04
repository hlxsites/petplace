import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostPetNotificationsUseCase } from "./GetLostPetNotificationsUseCase";
import getLostPetNotificationsMock from "./mocks/getLostPetNotificationsMock.json";
import getLostPetNotificationsMock2 from "./mocks/getLostPetNotificationsMock2.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetLostPetNotificationsUseCase", () => {
  it("should return null whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });

  it("should return lost pet notifications 1", async () => {
    const httpClient = new MockHttpClient({
      data: getLostPetNotificationsMock,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([
      {
        communicationId: "5e8ad486",
        date: "2024-07-17T10:08:41.857",
        foundedBy: {
          contact: [],
          finderName: "Test",
          finderOrganization: undefined,
          finderPhoneNumber: "123-456-7890",
        },
        id: "99ff6bba",
        note: "Pet No_chip is found by Test.",
        petId: "AUN19623526",
        petName: "No_chip",
        status: "found",
        update: "2024-07-19T00:03:07.17",
      },
      {
        communicationId: "f79edb4c",
        date: "2024-07-17T10:08:41.857",
        foundedBy: {
          contact: [],
          finderName: "Test",
          finderOrganization: "Joseph King CO.",
          finderPhoneNumber: "123-456-7890",
        },
        id: "99ff6bba",
        note: "Pet No_chip is found by Test.",
        petId: "AUN19623526",
        petName: "No_chip",
        status: "found",
        update: "2024-09-03T00:00:06.767",
      },
    ]);
  });

  it("should return lost pet notifications 2", async () => {
    const httpClient = new MockHttpClient({
      data: getLostPetNotificationsMock2,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([
      {
        communicationId: "dba9ae21-764f-43cb-90a1-b020bbfea796",
        date: "2024-07-17T10:08:41.857",
        foundedBy: {
          contact: [],
          finderName: "Test",
          finderOrganization: "AlaskaSummer.ltda",
          finderPhoneNumber: "123-456-7890",
        },
        id: "99ff6bba-66f0-4bc0-b5a6-3cee7ad39b20",
        note: "Pet No_chip is found by Test.",
        petId: "AUN19623526",
        petName: "No_chip",
        status: "found",
        update: "2024-07-17T10:08:47.89",
      },
    ]);
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      DogNewsletterOptIn: "true",
    };
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
  return new GetLostPetNotificationsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
