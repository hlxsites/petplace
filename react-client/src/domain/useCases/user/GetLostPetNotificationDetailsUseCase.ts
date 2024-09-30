import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ContactDone, LostPetUpdateModel } from "../../models/user/UserModels";
import { GetLostPetNotificationDetailsRepository } from "../../repository/user/GetLostPetNotificationDetailsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";
import { logError } from "~/infrastructure/telemetry/logUtils";

export class GetLostPetNotificationDetailsUseCase
  implements GetLostPetNotificationDetailsRepository
{
  private httpClient: HttpClientRepository;
  private endpoint: (id: string) => string = (id: string) =>
    `/api/Alert/communication/${id}`;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(
    notification: LostPetUpdateModel
  ): Promise<LostPetUpdateModel | null> {
    try {
      const result = await this.httpClient.get(
        this.endpoint(notification.communicationId)
      );
      if (result.data)
        return convertToLostPetDetailedNotificationModel(
          result.data,
          notification
        );

      return null;
    } catch (error) {
      logError("GetLostPetNotificationDetailsUseCase query error", error);
      return null;
    }
  }
}

function convertToLostPetDetailedNotificationModel(
  data: unknown,
  notification: LostPetUpdateModel
): LostPetUpdateModel | null {
  if (!data) return null;

  const serverResponseSchema = z.object({
    Communications: z
      .array(
        z.object({
          EmailDate: z.string().nullish(),
          EmailId: z.string().nullish(),
        })
      )
      .nullish(),
  });

  const contact: ContactDone[] = [];

  const notificationDetails = parseData(serverResponseSchema, data);
  if (!notificationDetails) return null;

  notificationDetails.Communications?.forEach(({ EmailId, EmailDate }) => {
    contact.push({
      email: EmailId ?? "",
      date: EmailDate ? new Date(EmailDate).getTime() : 0,
    });
  });

  const foundedBy: LostPetUpdateModel["foundedBy"] = {
    ...notification.foundedBy,
    contact,
  };

  return { ...notification, foundedBy };
}
