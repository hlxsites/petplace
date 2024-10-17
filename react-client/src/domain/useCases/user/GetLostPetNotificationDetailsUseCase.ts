import { z } from "zod";
import { ContactDone, LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { GetLostPetNotificationDetailsRepository } from "~/domain/repository/user/GetLostPetNotificationDetailsRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

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
      date: EmailDate ?? "",
    });
  });

  const foundedBy: LostPetUpdateModel["foundedBy"] = {
    ...notification.foundedBy,
    contact,
  };

  return { ...notification, foundedBy };
}
