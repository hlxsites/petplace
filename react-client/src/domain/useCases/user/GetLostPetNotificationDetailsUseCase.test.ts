import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostPetNotificationDetailsUseCase } from "./GetLostPetNotificationDetailsUseCase";
import getLostPetNotificationDetailsMock from "./mocks/getLostPetNotificationDetailsMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_NOTIFICATION: LostPetUpdateModel = {
  communicationId: "5e8ad486",
  foundedBy: {
    contact: [],
  },
  date: "2024-07-17T10:08:41.857",
  id: "",
  petId: "",
  petName: "",
  status: "found",
  update: "",
};

describe("GetLostPetNotificationDetailsUseCase", () => {
  it("should return null whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_NOTIFICATION);
    expect(result).toBeNull();
  });

  it("should return lost pet notification details", async () => {
    const httpClient = new MockHttpClient({
      data: getLostPetNotificationDetailsMock,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_NOTIFICATION);

    expect(result).toStrictEqual({
      communicationId: "5e8ad486",
      date: "2024-07-17T10:08:41.857",
      foundedBy: {
        contact: [
          {
            date: "2024-07-17T10:08:47.89",
            email: "yilan.cao@pethealthinc.com",
          },
        ],
      },
      id: "",
      petId: "",
      petName: "",
      status: "found",
      update: "",
    });
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      Communications: [{ EmailDate: true }],
    };
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_NOTIFICATION);

    expect(result).toBeNull();
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_NOTIFICATION);
    expect(result).toBeNull();
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetLostPetNotificationDetailsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
