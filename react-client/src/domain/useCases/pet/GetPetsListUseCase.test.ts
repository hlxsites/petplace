import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetPetsListUseCase } from "./getPetsListUseCase";

import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import getPetsListMock from "./mocks/getPetsListMock.json";
import getPetsListMock2 from "./mocks/getPetsListMock2.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetPetsListUseCase", () => {
  it("should return an empty array", async () => {
    const sut = makeSut();
    expect(await sut.query()).toStrictEqual([]);
  });

  it("should return the correct pets list", async () => {
    const httpClient = new MockHttpClient({ data: getPetsListMock });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([
      {
        id: "AUN19624033",
        isProtected: true,
        microchip: "948594034F",
        name: "Delilah",
      },
    ]);
  });

  it("should return the correct pets list 2", async () => {
    const httpClient = new MockHttpClient({ data: getPetsListMock2 });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([
      {
        id: "lili",
        isProtected: true,
        microchip: "81238123A",
        name: "Lili",
      },
      {
        id: "bob",
        isProtected: false,
        microchip: "D118123",
        name: "Bob",
      },
    ]);
  });

  it("should return an empty array when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetPetsListUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
