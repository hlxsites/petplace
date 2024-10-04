import { GetCountriesUseCase } from "./GetCountriesUseCase";

describe("GetCountriesUseCase", () => {
  it("should return an array of countries", () => {
    const sut = makeSut();
    const result = sut.query();

    expect(result).toStrictEqual([
      {
        id: "CA",
        title: "Canada",
      },
      {
        id: "US",
        title: "United States",
      },
    ]);
  });
});

// Test helpers
function makeSut() {
  return new GetCountriesUseCase();
}
