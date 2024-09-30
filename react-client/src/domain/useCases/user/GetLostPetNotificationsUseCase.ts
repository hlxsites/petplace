import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { LostPetUpdateModel } from "../../models/user/UserModels";
import { GetLostPetNotificationsRepository } from "../../repository/user/GetLostPetNotificationsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { logError } from "~/infrastructure/telemetry/logUtils";

export class GetLostPetNotificationsUseCase
  implements GetLostPetNotificationsRepository
{
  private httpClient: HttpClientRepository;
  private categoryId: number = 1;
  private endpoint: string = `/api/Alert/category/${this.categoryId}`;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(): Promise<LostPetUpdateModel[]> {
    try {
      const result = await this.httpClient.get(this.endpoint);
      if (result.data) return convertToLostPetHistoryModel(result.data);

      return [];
    } catch (error) {
      logError("GetUserUseCase query error", error);
      return [];
    }
  }
}

function convertToLostPetHistoryModel(data: unknown): LostPetUpdateModel[] {
  if (!data || !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    AnimalId: z.string().nullish(),
    CommunicationDate: z.string().nullish(),
    Description: z.string().nullish(),
    FinderContactNo: z.string().nullish(),
    FinderName: z.string().nullish(),
    FinderOrgName: z.string().nullish(),
    CommunicationGroupId: z.string().nullish(),
    NotificationRequestId: z.string().nullish(),
    PetName: z.string().nullish(),
    RequestDate: z.string().nullish(),
    Type: z.string().nullish(),
  });

  const notifications: LostPetUpdateModel[] = [];

  data.forEach((serverUpdate) => {
    const update = parseData(serverResponseSchema, serverUpdate);
    if (!update) return;

    const {
      AnimalId,
      CommunicationDate,
      CommunicationGroupId,
      Description,
      FinderName,
      FinderOrgName,
      FinderContactNo,
      NotificationRequestId,
      PetName,
      RequestDate,
      Type,
    } = update;

    notifications.push({
      communicationId: CommunicationGroupId ?? "",
      date: RequestDate ? new Date(RequestDate).getTime() : 0,
      foundedBy: {
        contact: [],
        finderName: FinderName ?? undefined,
        finderOrganization: FinderOrgName ?? undefined,
        finderPhoneNumber: FinderContactNo ?? undefined,
      },
      id: NotificationRequestId ?? "",
      note: Description ?? "",
      petId: AnimalId ?? "",
      petName: PetName ?? "",
      status: Type === "FoundPet" ? "found" : "missing",
      update: CommunicationDate ? new Date(CommunicationDate).getTime() : 0,
    });
  });

  return notifications;
}
