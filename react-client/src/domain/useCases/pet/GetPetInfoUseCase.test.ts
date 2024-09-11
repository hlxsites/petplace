import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import getPetInfoMock from "./mocks/getPetInfoMock.json";
import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { GetPetInfoUseCase } from "./GetPetInfoUseCase";

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
      id: "A123",
      microchip: "123456789",
      mixedBreed: false,
      name: "Buddy",
      sex: "Male",
      spayedNeutered: true,
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
