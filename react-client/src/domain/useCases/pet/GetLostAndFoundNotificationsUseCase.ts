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
  private endpoint: (id: string) => string = (id) =>
    `api/Pet/${id}/lost-found-status`;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (id: string): Promise<LostAndFountNotification[]> => {
    try {
      const result = await this.httpClient.get(this.endpoint(id));
      if (result.data)
        return convertToLostAndFoundNotificationModel(result.data);

      return [];
    } catch (error) {
      logError("GetLostAndFoundNotificationsUseCase query error", error);
      return [];
    }
  };
}

function convertToLostAndFoundNotificationModel(
  data: unknown
): LostAndFountNotification[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    Id: z.number().nullish(),
    LastUpdate: z.string().nullish(),
    Note: z.string().nullish(),
    Opened: z.string().nullish(),
    Status: z.string().nullish(),
  });

  const petHistory: LostAndFountNotification[] = [];

  data.forEach((serverUpdate) => {
    const update = parseData(serverResponseSchema, serverUpdate);
    if (!update) return;

    const { Opened, LastUpdate, Status, Note, Id } = update;

    petHistory.push({
      date: Opened ?? "",
      update: LastUpdate ?? "",
      status: Status === "Reunited with my pet" ? "found" : "missing",
      id: Id ?? 0,
      note: Note ?? "",
    });
  });

  return petHistory;
}
