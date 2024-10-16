import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { LostAndFountNotification } from "../../models/pet/PetModel";
import { GetLostAndFoundNotificationsRepository } from "../../repository/pet/GetLostAndFoundNotificationsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetLostAndFoundNotificationsUseCase
  implements GetLostAndFoundNotificationsRepository
{
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (id: string): Promise<LostAndFountNotification[]> => {
    try {
      const result = await this.httpClient.get(
        `api/Pet/${id}/lost-found-status`
      );
      if (result.data) {
        return convertToLostAndFoundNotificationModel(result.data);
      }
    } catch (error) {
      logError("GetLostAndFoundNotificationsUseCase query error", error);
    }
    return [];
  };
}

function convertToLostAndFoundNotificationModel(
  data: unknown
): LostAndFountNotification[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.array(
    z.object({
      Id: z.number().nullish(),
      LastUpdate: z.string().nullish(),
      Note: z.string().nullish(),
      Opened: z.string().nullish(),
      Status: z.string().nullish(),
    })
  );

  const parsedData = parseData(serverResponseSchema, data);
  if (!parsedData) return [];

  const petHistory: LostAndFountNotification[] = [];

  parsedData.forEach((item) => {
    const { Opened, LastUpdate, Status, Note, Id } = item;

    // If any of the required fields is missing, we can't use this data
    if (!Id || !LastUpdate || !Status) return;

    const status = (() => {
      const lowercaseStatus = Status.toLowerCase();

      // Very fragile implementation, server should give us that information
      if (lowercaseStatus.includes("missing")) {
        return "missing";
      }

      return "found";
    })();

    petHistory.push({
      date: Opened ?? "",
      id: Id,
      note: Note ?? "",
      status,
      statusMessage: Status,
      update: LastUpdate,
    });
  });

  return petHistory;
}
