import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetProductsUseCase } from "./GetProductsUseCase";
import getProductsMock from "./mocks/getProductsMock.json";
// Make sure this has descriptions for item1 and item2

jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetProductsUseCase", () => {
  it("should return null when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "lifetime");
    expect(result).toBeNull();
  });

  it("should return the correct products", async () => {
    const httpClient = new MockHttpClient({ data: getProductsMock });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "lifetime");

    expect(result).toStrictEqual([
      {
        description: undefined,
        id: "item1",
        images: [],
        price: "$20.00",
        title: "Product 1",
      },
      {
        description: undefined,
        id: "item2",
        images: [],
        price: "$30.00",
        title: "Product 2",
      },
      {
        availableColors: ["green"],
        availableSizes: ["S/M"],
        id: "item3",
        images: [],
        price: "$15.00",
        title: "Product 3",
      },
      {
        availableColors: ["yellow"],
        availableSizes: ["L"],
        id: "item4",
        images: [],
        price: "$25.00",
        title: "Product 4",
      },
    ]);
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      MembershipProducts: "invalid data structure",
    };
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "lifetime");

    expect(result).toBeNull();
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "lifetime");
    expect(result).toBeNull();
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetProductsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
