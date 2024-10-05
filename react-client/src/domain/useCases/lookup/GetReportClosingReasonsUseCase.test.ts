import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetReportClosingReasonsUseCase } from "./GetReportClosingReasonsUseCase";
import getReportClosingReasonsMock from "./mocks/getReportClosingReasonsMock.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetReportClosingReasonsUseCase", () => {
  it("should return empty array whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toStrictEqual([]);
  });

  it("should return an array of states", async () => {
    const httpClient = new MockHttpClient({
      data: getReportClosingReasonsMock,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([
      {
        id: 4,
        reason: "I picked up my pet from the shelter/finder",
      },
      {
        id: 2,
        reason: "I found my pet myself",
      },
      {
        id: 11,
        reason: "I surrendered my pet",
      },
      {
        id: 1,
        reason: "My pet was never lost",
      },
      {
        id: 18,
        reason: "I do not own this pet",
      },
      {
        id: 3,
        reason: "This pet is deceased",
      },
    ]);
  });

  it("should return empty array when the data doesn't match the schema", async () => {
    const invalidMockData = [{ id: "abc" }];
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual([]);
  });

  it("should return empty array when there is an error", async () => {
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
  return new GetReportClosingReasonsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
