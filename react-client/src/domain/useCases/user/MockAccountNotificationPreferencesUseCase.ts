import { AccountNotificationPreferencesModel } from "~/domain/models/user/UserModels";
import { AccountNotificationPreferencesRepository } from "../../repository/user/AccountNotificationRepository";

export class MockAccountNotificationPreferencesUseCase
  implements AccountNotificationPreferencesRepository
{
  async query(): Promise<AccountNotificationPreferencesModel> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      emailAlert: true,
      petPlaceOffer: true,
      partnerOffer: false,
      signedCatNewsletter: false,
      signedDogNewsletter: true,
      smsAlert: false,
    };
  }

  async mutate(): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
