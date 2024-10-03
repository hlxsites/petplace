import { MockHttpClient } from "~/domain/mocks/MockHttpClient";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostAndFoundNotificationsUseCase } from "./GetLostAndFoundNotificationsUseCase";

import getLostAndFoundNotificationsMock from "./mocks/getLostAndFoundNotificationsMock.json";
import getLostAndFoundNotificationsMock2 from "./mocks/getLostAndFoundNotificationsMock2.json";

// We don't care about the implementation while running those tests
jest.mock("../PetPlaceHttpClientUseCase", () => {});

const DEFAULT_ID = "test-id"

describe("GetLostAndFoundNotificationsUseCase", () => {
  it("should return an empty array", async () => {
    const sut = makeSut();
    expect(await sut.query(DEFAULT_ID)).toStrictEqual([]);
  });

  it("should return the notifications list", async () => {
    const httpClient = new MockHttpClient({
      data: getLostAndFoundNotificationsMock,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);
    expect(result).toStrictEqual([
      {
        date: "2023-06-28T00:00:00",
        id: 3872783,
        note: "",
        status: "missing",
        update: "2023-06-28T00:01:00",
      },
      {
        date: "2023-06-28T00:10:00",
        id: 5098734,
        note: "Found by the fair market",
        status: "found",
        update: "2023-06-28T00:11:00",
      },
    ]);
  });

  it("should return the notifications list 2", async () => {
    const httpClient = new MockHttpClient({
      data: getLostAndFoundNotificationsMock2,
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);
    expect(result).toStrictEqual([
      {
        date: "2023-06-28T00:13:00",
        id: 209897,
        note: "",
        status: "missing",
        update: "2023-06-28T00:22:00",
      },
    ]);
  });

  it("should return an empty array when there is an error", async () => {
    const httpClient = new MockHttpClient({
      error: new Error("Error"),
    });
    const sut = makeSut(httpClient);
    const result = await sut.query(DEFAULT_ID);
    expect(result).toStrictEqual([]);
  });
});

// Test helpers
function makeSut(httpClient?: HttpClientRepository) {
  return new GetLostAndFoundNotificationsUseCase(
    "token",
    httpClient ||
      new MockHttpClient({
        data: [],
      })
  );
}
