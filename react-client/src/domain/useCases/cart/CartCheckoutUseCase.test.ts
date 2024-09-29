import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { CommonCartItem } from "~/domain/models/cart/CartModel";
import { CartCheckoutUseCase } from "./CartCheckoutUseCase";

jest.mock("../PetPlaceHttpClientUseCase", () => {});

const VALID_CART_ITEM: CommonCartItem = {
  autoRenew: false,
  id: "item1",
  name: "Pet Toy",
  price: "$10.00",
  quantity: 2,
  type: "toy",
};

const PET_ID = "animal1";

describe("CartCheckoutUseCase", () => {
  describe("post", () => {
    it("should return true for a successful post", async () => {
      const httpClient = new MockHttpClient({ statusCode: 200 });
      const sut = makeSut(httpClient);
      const result = await sut.post([VALID_CART_ITEM], PET_ID);
      expect(result).toBe(true);
    });

    it("should return false for an unsuccessful post", async () => {
      const httpClient = new MockHttpClient({ statusCode: 400 });
      const sut = makeSut(httpClient);
      const result = await sut.post([VALID_CART_ITEM], PET_ID);
      expect(result).toBe(false);
    });

    it("should return false when CartItem or AnimalInfo is missing", async () => {
      const httpClient = new MockHttpClient({ statusCode: 200 });
      const sut = makeSut(httpClient);

      // Test when CartItem is missing
      let result = await sut.post([], PET_ID);
      expect(result).toBe(false);

      // Test when AnimalInfo is missing
      result = await sut.post([VALID_CART_ITEM], "");
      expect(result).toBe(false);
    });

    it("should return false when there is an error", async () => {
      const httpClient = new MockHttpClient({ error: new Error("Error") });
      const sut = makeSut(httpClient);
      const result = await sut.post([VALID_CART_ITEM], PET_ID);
      expect(result).toBe(false);
    });

    it("should handle missing required fields and log an error", async () => {
      const httpClient = new MockHttpClient({ statusCode: 200 });
      const sut = makeSut(httpClient);

      // @ts-expect-error for testing purpose
      const incompleteCartItem: CommonCartItem = {
        id: "item1",
        quantity: 2,
        price: "$10.00",
      };

      const result = await sut.post([incompleteCartItem], PET_ID);

      expect(result).toBe(false);
    });
  });
});

function makeSut(httpClient?: MockHttpClient) {
  return new CartCheckoutUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        statusCode: 200,
      })
  );
}
