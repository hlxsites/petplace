import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetAccountEmergencyContactsUseCase } from "./GetAccountEmergencyContactsUseCase";
import getAccountEmergencyContactsMock from "./mocks/getAccountEmergencyContactsMock.json";
import getAccountEmergencyContactsMock2 from "./mocks/getAccountEmergencyContactsMock2.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetAccountEmergencyContactsUseCase", () => {
  it("should return an empty array whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });

  it("should return account emergencyContacts", async () => {
    const httpClient = new MockHttpClient({
      data: getAccountEmergencyContactsMock,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([
      {
        email: "moana.r@email.com",
        id: "000000",
        name: "Moana",
        phoneNumber: "989 765 4321",
        surname: "Right",
      },
    ]);
  });

  it("should return account emergencyContacts 2", async () => {
    const httpClient = new MockHttpClient({
      data: getAccountEmergencyContactsMock2,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([
      {
        email: "becker.r@email.com",
        id: "000001",
        name: "Rudy",
        phoneNumber: "989 765 4321",
        surname: "Becker",
      },
      {
        email: "h-grace@email.com",
        id: "000000",
        name: "Hazel",
        phoneNumber: "989 345 4321",
        surname: "Grace",
      },
    ]);
  });

  it("should return an empty array when the data doesn't match the schema", async () => {
    const invalidMockData = {
      ContactPersonId: 2,
    };
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([]);
  });

  it("should return an empty array when there is an error", async () => {
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
  return new GetAccountEmergencyContactsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
