import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { CartCheckoutUseCase } from "./CartCheckoutUseCase";
import { CartItem, AnimalInfo } from "~/domain/models/cart/CartModel";

jest.mock("../PetPlaceHttpClientUseCase", () => {});

const VALID_CART_ITEM: CartItem = {
  description: "A fun toy for pets",
  id: "item1",
  name: "Pet Toy",
  price: "$10.00",
  quantity: 2,
  type: "toy",
};

const VALID_ANIMAL_INFO: AnimalInfo = {
  id: "animal1",
  name: "Buddy",
};

describe("CartCheckoutUseCase", () => {
  describe("post", () => {
    it("should return true for a successful post", async () => {
      const httpClient = new MockHttpClient({ statusCode: 200 });
      const sut = makeSut(httpClient);
      const result = await sut.post(VALID_CART_ITEM, VALID_ANIMAL_INFO);
      expect(result).toBe(true);
    });

    it("should return false for an unsuccessful post", async () => {
      const httpClient = new MockHttpClient({ statusCode: 400 });
      const sut = makeSut(httpClient);
      const result = await sut.post(VALID_CART_ITEM, VALID_ANIMAL_INFO);
      expect(result).toBe(false);
    });

    it("should return false when CartItem or AnimalInfo is missing", async () => {
      const httpClient = new MockHttpClient({ statusCode: 200 });
      const sut = makeSut(httpClient);

      // Test when CartItem is missing
      let result = await sut.post(undefined, VALID_ANIMAL_INFO);
      expect(result).toBe(false);

      // Test when AnimalInfo is missing
      result = await sut.post(VALID_CART_ITEM, undefined);
      expect(result).toBe(false);
    });

    it("should return false when there is an error", async () => {
      const httpClient = new MockHttpClient({ error: new Error("Error") });
      const sut = makeSut(httpClient);
      const result = await sut.post(VALID_CART_ITEM, VALID_ANIMAL_INFO);
      expect(result).toBe(false);
    });

    it("should handle missing required fields and log an error", async () => {
      const httpClient = new MockHttpClient({ statusCode: 200 });
      const sut = makeSut(httpClient);

      // @ts-expect-error for testing purpose
      const incompleteCartItem: CartItem = {
        id: "item1",
        quantity: 2,
        price: "$10.00",
      };

      const result = await sut.post(incompleteCartItem, VALID_ANIMAL_INFO);

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
