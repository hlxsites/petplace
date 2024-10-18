import { z } from "zod";
import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostPetNotificationsRepository } from "~/domain/repository/user/GetLostPetNotificationsRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { sortMostRecentFirst } from "~/util/dateUtils";

// Hardcoded category id for lost pet notifications
const CATEGORY_ID = 1;

export class GetLostPetNotificationsUseCase
  implements GetLostPetNotificationsRepository
{
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<LostPetUpdateModel[]> => {
    try {
      const result = await this.httpClient.get(
        `/api/Alert/category/${CATEGORY_ID}`
      );

      if (result.data) return convertToLostPetHistoryModel(result.data);
    } catch (error) {
      logError("GetUserUseCase query error", error);
    }
    return [];
  };
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
      date: RequestDate ?? "",
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
      update: CommunicationDate ?? "",
    });
  });

  return sortMostRecentFirst(notifications);
}
