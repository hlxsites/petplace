import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetStatesUseCase } from "./GetStatesUseCase";
import getStatesMock from "./mocks/getStatesMock.json";

const DEFAULT_COUNTRY = "CA";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

describe("GetStatesUseCase", () => {
  it("should return empty array whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);
    expect(result).toStrictEqual([]);
  });

  it("should return an array of states", async () => {
    const httpClient = new MockHttpClient({ data: getStatesMock });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);

    expect(result).toStrictEqual([
      {
        id: "AK",
        title: "Alaska",
      },
      {
        id: "AL",
        title: "Alabama",
      },
      {
        id: "AR",
        title: "Arkansas",
      },
      {
        id: "AZ",
        title: "Arizona",
      },
      {
        id: "CA",
        title: "California",
      },
      {
        id: "CO",
        title: "Colorado",
      },
      {
        id: "CT",
        title: "Connecticut",
      },
      {
        id: "DC",
        title: "District of Columbia",
      },
      {
        id: "DE",
        title: "Delaware",
      },
      {
        id: "FL",
        title: "Florida",
      },
      {
        id: "GA",
        title: "Georgia",
      },
      {
        id: "HI",
        title: "Hawaii",
      },
      {
        id: "IA",
        title: "Iowa",
      },
      {
        id: "ID",
        title: "Idaho",
      },
      {
        id: "IL",
        title: "Illinois",
      },
      {
        id: "IN",
        title: "Indiana",
      },
      {
        id: "KS",
        title: "Kansas",
      },
      {
        id: "KY",
        title: "Kentucky",
      },
      {
        id: "LA",
        title: "Louisiana",
      },
      {
        id: "MA",
        title: "Massachusetts",
      },
      {
        id: "MD",
        title: "Maryland",
      },
      {
        id: "ME",
        title: "Maine",
      },
      {
        id: "MI",
        title: "Michigan",
      },
      {
        id: "MN",
        title: "Minnesota",
      },
      {
        id: "MO",
        title: "Missouri",
      },
      {
        id: "MS",
        title: "Mississippi",
      },
      {
        id: "MT",
        title: "Montana",
      },
      {
        id: "NC",
        title: "North Carolina",
      },
      {
        id: "ND",
        title: "North Dakota",
      },
      {
        id: "NE",
        title: "Nebraska",
      },
      {
        id: "NH",
        title: "New Hampshire",
      },
      {
        id: "NJ",
        title: "New Jersey",
      },
      {
        id: "NM",
        title: "New Mexico",
      },
      {
        id: "NV",
        title: "Nevada",
      },
      {
        id: "NY",
        title: "New York",
      },
      {
        id: "OH",
        title: "Ohio",
      },
      {
        id: "OK",
        title: "Oklahoma",
      },
      {
        id: "OR",
        title: "Oregon",
      },
      {
        id: "PA",
        title: "Pennsylvania",
      },
      {
        id: "RI",
        title: "Rhode Island",
      },
      {
        id: "SC",
        title: "South Carolina",
      },
      {
        id: "SD",
        title: "South Dakota",
      },
      {
        id: "TN",
        title: "Tennessee",
      },
      {
        id: "TX",
        title: "Texas",
      },
      {
        id: "UT",
        title: "Utah",
      },
      {
        id: "VA",
        title: "Virginia",
      },

      {
        id: "VT",
        title: "Vermont",
      },
      {
        id: "WA",
        title: "Washington",
      },
      {
        id: "WI",
        title: "Wisconsin",
      },
      {
        id: "WV",
        title: "West Virginia",
      },
      {
        id: "WY",
        title: "Wyoming",
      },
    ]);
  });

  it("should return empty array when the data doesn't match the schema", async () => {
    const invalidMockData = [7];
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);

    expect(result).toStrictEqual([]);
  });

  it("should return empty array when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_COUNTRY);
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetStatesUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
