import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { readJwtClaim } from "~/util/authUtil";
import { AccountNotificationPreferencesModel } from "../../models/user/UserModels";
import { AccountNotificationPreferencesRepository } from "../../repository/user/AccountNotificationRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { logError } from "~/infrastructure/telemetry/logUtils";

const serverSchema = z.object({
  CatNewsletterOptIn: z.boolean().nullish(),
  DogNewsletterOptIn: z.boolean().nullish(),
  EmailOptIn: z.boolean().nullish(),
  PartnerOffer: z.boolean().nullish(),
  PetPlaceOffer: z.boolean().nullish(),
  SmsOptIn: z.boolean().nullish(),
});

export type MutationInput = z.infer<typeof serverSchema>;

export class AccountNotificationPreferencesUseCase
  implements AccountNotificationPreferencesRepository
{
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<AccountNotificationPreferencesModel | null> => {
    try {
      const result = await this.httpClient.get("adopt/api/User");
      if (result.data) return convertToAccountNotificationsModel(result.data);

      return null;
    } catch (error) {
      logError("GetUserUseCase query error", error);
      return null;
    }
  };

  mutate = async (
    data: AccountNotificationPreferencesModel
  ): Promise<boolean> => {
    const zipCode = readJwtClaim()?.postalCode;
    if (!zipCode) return false;
    const body = convertToMutationInput(data);

    try {
      if (serverSchema.safeParse(body).success) {
        const result = await this.httpClient.put("adopt/api/User", {
          body: JSON.stringify({ ...body, ZipCode: zipCode }),
        });

        if (result.statusCode === 204) return true;
      }

      return false;
    } catch (error) {
      logError("AccountDetailsUseCase mutation error", error);
      return false;
    }
  };
}

function convertToAccountNotificationsModel(
  data: unknown
): AccountNotificationPreferencesModel | null {
  if (!data) return null;

  const parseUserData = (userData: unknown) => {
    const { data, error, success } = serverSchema.safeParse(userData);
    if (success) return data;

    logError("Error parsing user data", { userData, error });
    return null;
  };

  const user = parseUserData(data);
  if (!user) return null;
  return {
    emailAlert: !!user.EmailOptIn,
    petPlaceOffer: !!user.PetPlaceOffer,
    partnerOffer: !!user.PartnerOffer,
    signedCatNewsletter: !!user.CatNewsletterOptIn,
    signedDogNewsletter: !!user.DogNewsletterOptIn,
    smsAlert: !!user.SmsOptIn,
  };
}

function convertToMutationInput(
  data: AccountNotificationPreferencesModel
): MutationInput {
  return {
    CatNewsletterOptIn: data.signedCatNewsletter,
    DogNewsletterOptIn: data.signedDogNewsletter,
    EmailOptIn: data.emailAlert,
    PartnerOffer: data.partnerOffer,
    PetPlaceOffer: data.petPlaceOffer,
    SmsOptIn: data.smsAlert,
  };
}
