import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetCheckoutAvailableProductsUseCase } from "./GetCheckoutAvailableProductsUseCase";
import getCheckoutAvailableProductsMock from "./mocks/getCheckoutAvailableProductsMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetCheckoutAvailableProductsUseCase", () => {
  it("should return null when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");
    expect(result).toBeNull();
  });

  it("should return the correct pet info", async () => {
    const httpClient = new MockHttpClient({
      data: getCheckoutAvailableProductsMock,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");

    expect(result).toStrictEqual({
      membershipProducts: {
        annualMembership: {
          itemId: "Test item id",
          itemName: "Test item name",
          itemType: "Test item type",
          renewPrice: "9.99",
          salesPrice: "29.99",
          additionalProductList: [
            {
              itemName: "Test additional product name",
              itemId: "Test additional product id",
              itemType: "Test additional product item type",
              price: "39.99",
              uiName: "Test ui name",
            },
          ],
        },
        lifetimeMembership: undefined,
        lifetimePlusMembership: undefined,
        subscriptions: null,
        tags: null,
      },
    });
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      membershipProducts: {
        annualMembership: {
          itemName: "Test item",
          itemId: "CWKL56",
          itemType: null,
          price: 45,
        },
      },
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
  return new GetCheckoutAvailableProductsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
