import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetProductsUseCase } from "./GetProductsUseCase";
import getProductsMock from "./mocks/getProductsMock.json";

jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetProductsUseCase", () => {
  it("should return null when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "PLH_000007");
    expect(result).toBeNull();
  });

  it("should return the correct products", async () => {
    const httpClient = new MockHttpClient({ data: getProductsMock });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "AnnualProduct");

    expect(result).toStrictEqual([
      {
        availableColors: [],
        availableSizes: [],
        availableOptions: {
          default: {
            id: "item1",
            price: "20.00",
          },
        },
        description: undefined,
        id: "item1",
        images: [],
        title: "Product 1",
      },
      {
        availableColors: [],
        availableOptions: {
          default: {
            id: "item2",
            price: "30.00",
          },
        },
        availableSizes: [],
        description: undefined,
        id: "item2",
        images: [],
        title: "Product 2",
      },
      {
        availableColors: ["green"],
        availableOptions: {
          "green|S/M": {
            id: "item3",
            price: "15.00",
          },
        },
        availableSizes: ["S/M"],
        id: "Product 3",
        images: [],
        title: "Product 3",
      },
      {
        availableColors: ["yellow"],
        availableOptions: {
          "yellow|L": {
            id: "item4",
            price: "25.00",
          },
        },
        availableSizes: ["L"],
        id: "Product 4",
        images: [],
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
    const result = await sut.query("petId", "PLH_000007");

    expect(result).toBeNull();
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId", "PLH_000007");
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
