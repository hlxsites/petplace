import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PostRenewMembershipUseCase } from "./PostRenewMembershipUseCase";
import { RenewMembershipModel } from "~/domain/models/renew/RenewMembershipModel";

jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("PostRenewMembershipUseCase", () => {
  describe("post", () => {
    const validRenewMembershipModel: RenewMembershipModel = {
      petId: "123",
      autoRenew: true,
      id: "456",
    };

    it("should return true for a successful request", async () => {
      const mockPost = jest.fn().mockResolvedValue({ statusCode: 200 });
      const httpClient = { post: mockPost } as unknown as HttpClientRepository;

      const sut = new PostRenewMembershipUseCase("fakeToken", httpClient);

      const result = await sut.post(validRenewMembershipModel);

      expect(result).toBe(true);
      expect(mockPost).toHaveBeenCalledWith("api/Checkout/renew", {
        body: JSON.stringify({
          AnimalId: "123",
          AutoRenew: true,
          ItemId: "456",
        }),
      });
    });

    it("should return false for a failed post", async () => {
      const httpClient = new MockHttpClient({ statusCode: 400 });
      const sut = makeSut(httpClient);
      const result = await sut.post(validRenewMembershipModel);
      expect(result).toBe(false);
    });

    it("should return false when there is no status code", async () => {
      const httpClient = new MockHttpClient({});
      const sut = makeSut(httpClient);
      const result = await sut.post(validRenewMembershipModel);
      expect(result).toBe(false);
    });

    it("should return false when there is an error", async () => {
      const httpClient = new MockHttpClient({
        error: new Error("Network error"),
      });
      const sut = makeSut(httpClient);
      const result = await sut.post(validRenewMembershipModel);
      expect(result).toBe(false);
    });
  });
});

// Test helper
function makeSut(httpClient?: HttpClientRepository) {
  return new PostRenewMembershipUseCase(
    "token",
    httpClient || new MockHttpClient({})
  );
}
