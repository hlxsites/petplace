import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { PetDocumentConsentMutationInput } from "~/domain/models/pet/PetDocument";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PetDocumentConsentUseCase } from "./PetDocumentConsentUseCase";

jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_INPUT: PetDocumentConsentMutationInput = {
  consent: true,
  microchips: ["Ab123", "Cd456"],
};

describe("PetDocumentConsentUseCase", () => {
  it("should return list of successes", async () => {
    const httpClient = new MockHttpClient({ statusCode: 200 });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_INPUT);

    expect(result).toStrictEqual([true, true]);
  });

  it.each([true, false])(
    "should call http client with correct value for consent=%p",
    async (consent) => {
      const mockPost = jest
        .fn()
        .mockResolvedValue({ data: null, success: true, statusCode: 200 });
      const httpClient = { post: mockPost } as unknown as HttpClientRepository;
      const sut = makeSut(httpClient);

      await sut.mutate({ ...DEFAULT_INPUT, consent });

      // Check if the post method was called with the correct values for the first microchip value
      expect(mockPost).toHaveBeenNthCalledWith(
        1,
        "adopt/api/User/pet-document-consent",
        {
          body: JSON.stringify({
            PetId: "Ab123",
            PetIdType: 0,
            ShelterDocumentConsent: consent,
          }),
        }
      );

      // Check if the post method was called with the correct values for the second microchip value
      expect(mockPost).toHaveBeenNthCalledWith(
        2,
        "adopt/api/User/pet-document-consent",
        {
          body: JSON.stringify({
            PetId: "Cd456",
            PetIdType: 0,
            ShelterDocumentConsent: consent,
          }),
        }
      );
    }
  );

  it("should return false for a failed post", async () => {
    const httpClient = new MockHttpClient({ statusCode: 400 });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_INPUT);
    expect(result).toStrictEqual([false, false]);
  });

  it("should return false when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Network error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.mutate(DEFAULT_INPUT);
    expect(result).toStrictEqual([false, false]);
  });
});

// Test helper
function makeSut(httpClient?: HttpClientRepository) {
  return new PetDocumentConsentUseCase(
    "token",
    httpClient || new MockHttpClient({})
  );
}
