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

    // If there is no ID, we can't use this data
    if (!Id) return;

    const status = (() => {
      const lowercaseStatus = Status?.toLowerCase();

      // Very fragile implementation, but this is how the server sends the status
      if (lowercaseStatus === "reunited with my pet") return "found";
      return "missing";
    })();

    petHistory.push({
      date: Opened ?? "",
      update: LastUpdate ?? "",
      status,
      id: Id,
      note: Note ?? "",
    });
  });

  return petHistory;
}