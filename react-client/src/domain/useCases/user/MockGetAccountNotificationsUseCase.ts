import { AccountNotificationModel } from "~/domain/models/user/UserModels";
import { GetAccountNotificationRepository } from "../../repository/user/GetAccountNotificationRepository";

export class MockGetAccountNotificationsUseCase implements GetAccountNotificationRepository {
  async query(): Promise<AccountNotificationModel> {
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
}
