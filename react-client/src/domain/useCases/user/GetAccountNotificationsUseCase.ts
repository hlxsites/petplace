import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountNotificationModel } from "../../models/user/UserModels";
import { GetAccountNotificationRepository } from "../../repository/user/GetAccountNotificationRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

export class GetAccountNotificationsUseCase implements GetAccountNotificationRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(): Promise<AccountNotificationModel | null> {
    try {
      const result = await this.httpClient.get("User");
      if (result.data) return convertToAccountNotificationModel(result.data);

      return null;
    } catch (error) {
      console.error("GetUserUseCase query error", error);
      return null;
    }
  }
}

function convertToAccountNotificationModel(data: unknown): AccountNotificationModel | null {
  if (!data) return null;

  const serverResponseSchema = z.object({
    CatNewsletterOptIn: z.boolean(),
    DogNewsletterOptIn: z.boolean(),
    EmailOptIn: z.boolean(),
    PartnerOffer: z.boolean(),
    PetPlaceOffer: z.boolean(),
    SmsOptIn: z.boolean(),
  });

  const parseUserData = (userData: unknown) => {
    const { data, error, success } = serverResponseSchema.safeParse(userData);
    if (success) return data;

    console.error("Error parsing user data", { userData, error });
    return null;
  };

  const user = parseUserData(data);
  if (!user) return null;
  return {
    emailAlert: user.EmailOptIn,
    petPlaceOffer: user.PetPlaceOffer,
    partnerOffer: user.PartnerOffer,
    signedCatNewsletter: user.CatNewsletterOptIn,
    signedDogNewsletter: user.DogNewsletterOptIn,
    smsAlert: user.SmsOptIn,
  };
}
