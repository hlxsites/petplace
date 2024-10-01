import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PostPetImageUseCase } from "./PostPetImageUseCase";

import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { PetImageMutationInput } from "~/domain/models/pet/PetImage";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_ARGS: PetImageMutationInput = {
  petId: "pet-id",
  petImage: new File(["file-bits"], "pet-image"),
};

describe("PostPetImageUseCase", () => {
  it("should return null when it fails", async () => {
    const sut = makeSut();
    expect(await sut.mutate(DEFAULT_ARGS)).toBeNull();
  });

  it("should return true when it succeeds", async () => {
    const httpClient = new MockHttpClient({ data: true });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_ARGS);
    expect(result).toBe(true);
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_ARGS);
    expect(result).toBeNull();
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new PostPetImageUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: false,
      })
  );
}
