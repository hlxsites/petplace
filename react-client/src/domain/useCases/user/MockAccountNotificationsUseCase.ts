import { AccountNotificationsModel } from "~/domain/models/user/UserModels";
import { AccountNotificationRepository } from "../../repository/user/AccountNotificationRepository";

export class MockAccountNotificationsUseCase
  implements AccountNotificationRepository
{
  async query(): Promise<AccountNotificationsModel> {
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

  async mutate(data: AccountNotificationsModel): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log({ data });
    return true;
  }
}
