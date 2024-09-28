import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetInfoUseCase } from "./GetPetInfoUseCase";
import getPetInfoMock from "./mocks/getPetInfoMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetPetsInfoUseCase", () => {
  it("should return null when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");
    expect(result).toBeNull();
  });

  it("should return the correct pet info", async () => {
    const httpClient = new MockHttpClient({ data: getPetInfoMock });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");

    expect(result).toStrictEqual({
      age: "2",
      breed: "Labrador",
      dateOfBirth: "2020-01-01T00:00:00",
      id: "A123",
      img: undefined,
      locale: "US",
      membershipStatus: "Annual member",
      microchip: "123456789",
      mixedBreed: false,
      name: "Buddy",
      policyInsurance: [],
      products: [],
      sex: "Male",
      spayedNeutered: true,
      sourceType: "PetPoint",
      species: "Dog",
    });
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      Age: "2",
      Breed: "Labrador",
      DateOfBirth: "invalid-date",
      Id: "A123",
    };
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");

    expect(result).toBeNull();
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");
    expect(result).toBeNull();
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetPetInfoUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
