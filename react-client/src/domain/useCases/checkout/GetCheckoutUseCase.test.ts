import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";

import { GetCheckoutUseCase } from "./GetCheckoutUseCase";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetCheckoutUseCase", () => {
  it("should return empty plans list when there is no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");
    expect(result).toStrictEqual({ plans: [] });
  });

  it("should return empty plans list when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");
    expect(result).toStrictEqual({ plans: [] });
  });

  it("should return correct data for US locale", async () => {
    const mockData = {
      Country: "US",
      MembershipProducts: {
        AnnualMembership: { SalesPrice: "45.95" },
        LPMMembership: { ItemPrice: "99.95" },
        LPMPlusMembership: { ItemPrice: "199.95" },
      },
    };
    const httpClient = new MockHttpClient({ data: mockData });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");

    expect(result).not.toBeNull();
    expect(result?.plans).toHaveLength(3);
  });

  it("should return correct data for CA locale", async () => {
    const mockData = {
      Country: "CA",
      MembershipProducts: {
        LPMMembership: { ItemPrice: "99.95" },
        LPMPlusMembership: { ItemPrice: "199.95" },
      },
    };
    const httpClient = new MockHttpClient({ data: mockData });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");

    expect(result).not.toBeNull();
    expect(result?.plans).toHaveLength(2);
  });

  it("should default to US locale when Country is not provided", async () => {
    const mockData = {
      MembershipProducts: {
        AnnualMembership: { SalesPrice: "45.95" },
        LPMMembership: { ItemPrice: "99.95" },
        LPMPlusMembership: { ItemPrice: "199.95" },
      },
    };
    const httpClient = new MockHttpClient({ data: mockData });
    const sut = makeSut(httpClient);
    const result = await sut.query("petId");

    expect(result).not.toBeNull();
    expect(result?.plans).toHaveLength(3);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetCheckoutUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
