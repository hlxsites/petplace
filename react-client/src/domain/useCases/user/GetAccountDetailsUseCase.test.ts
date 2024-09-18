import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import * as authUtil from '../../../util/authUtil';
import { GetAccountDetailsUseCase } from "./GetAccountDetailsUseCase";
import getAccountDetailsMock from "./mocks/getAccountDetailsMock.json";
import getAccountDetailsMock2 from "./mocks/getAccountDetailsMock2.json";

jest.mock('../../../util/authUtil', () => ({
  ...jest.requireActual('../../../util/authUtil'),
  checkIsExternalLogin: jest.fn(),
}));

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_INTERNAL_LOGIN = {
  defaultPhone: "71 988776655|Home",
  email: "augustus.ok@email.com",
  name: "Augustus",
  surname: "Waters",
}

const DEFAULT_EXTERNAL_LOGIN = {
  ...DEFAULT_INTERNAL_LOGIN,
  address: {
    address1: "808 Benninghaus Rd",
    address2: "",
    city: "Baltimore",
    country: "US",
    intersection: "",
    state: "MD",
    zipCode: "21212-3943",
  },
  contactConsent: true,
  defaultPhone: "71 988776655|Work",
  informationConsent: false,
  secondaryPhone: "416-709-5781|Home",
}

describe("GetAccountDetailsUseCase", () => {
  beforeEach(() => {
    (authUtil.checkIsExternalLogin as jest.Mock)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false)
  })

  it.each([
    DEFAULT_EXTERNAL_LOGIN,
    DEFAULT_INTERNAL_LOGIN,
  ])("should return account details", async (expected) => {
    const httpClient = new MockHttpClient({ data: getAccountDetailsMock });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual(expected);
  });

  it("should return account details with different phone composition", async () => {
    const httpClient = new MockHttpClient({ data: getAccountDetailsMock2 });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toStrictEqual({
      ...DEFAULT_EXTERNAL_LOGIN,
      defaultPhone: "21 33426754|Home",
      secondaryPhone: ""
    });
  });

  it("should return null whenever it finds no data", async () => {
    const httpClient = new MockHttpClient({ data: null });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toBeNull();
  });

  it("should return null when the data doesn't match the schema", async () => {
    const invalidMockData = {
      FirstName: 2,
    };
    const httpClient = new MockHttpClient({ data: invalidMockData });
    const sut = makeSut(httpClient);
    const result = await sut.query();

    expect(result).toBeNull();
  });

  it("should return null when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query();
    expect(result).toBeNull();
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetAccountDetailsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: {},
      })
  );
}
