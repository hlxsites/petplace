import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetInfoUseCase } from "./PetInfoUseCase";
import getPetInfoMock from "./mocks/getPetInfoMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("PetInfoUseCase", () => {
  describe("GET", () => {
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
        insuranceUrl: "www.insurance-url.co",
        locale: "US",
        membershipStatus: "Annual member",
        microchip: "123456789",
        mixedBreed: false,
        name: "Buddy",
        policyInsurance: [],
        products: [],
        sex: "Male",
        spayedNeutered: true,
        sourceType: "MyPetHealth",
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


  describe("PUT", () => {
    const validPetInfo = {
      Id: "AU234NOUH76",
      Name: "Zion",
      Sex: "1",
      DateOfBirth: "2023-06-28T00:00:00",
      Neutered: true,
      SpeciesId: 1,
      BreedId: 5654345,
      MixedBreed: false,
    };

    it("should update successfully without data returning", async () => {
      const httpClient = new MockHttpClient({ statusCode: 204 });
      const sut = makeSut(httpClient);
      const result = await sut.mutate(validPetInfo);
      expect(result).toBe(true);
    });

    it("should return false when data contains invalid characters", async () => {
      const invalidDetails = { ...validPetInfo, MixedBreed: "True" };
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
      const result = await sut.mutate(validPetInfo);
      expect(result).toBe(false);
    });
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new PetInfoUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
