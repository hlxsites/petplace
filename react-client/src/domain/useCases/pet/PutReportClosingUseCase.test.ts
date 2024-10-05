import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";

import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { ReportPetFoundMutationInput } from "~/domain/models/pet/ReportClosingModel";
import { PutReportClosingUseCase } from "./PutReportClosingUseCase";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_ARGS: ReportPetFoundMutationInput = {
  microchip: "",
  petId: "pet-id",
  reason: 1,
};

describe("PutReportClosingUseCase", () => {
  it("should return null when it fails", async () => {
    const sut = makeSut();
    expect(await sut.mutate(DEFAULT_ARGS)).toBe(false);
  });

  it("should return true when it succeeds", async () => {
    const httpClient = new MockHttpClient({ data: true, statusCode: 204 });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_ARGS);
    expect(result).toBe(true);
  });

  it("should return false when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_ARGS);
    expect(result).toBe(false);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new PutReportClosingUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: false,
      })
  );
}
