import { AccountNotificationModel } from "~/domain/models/user/UserModels";
import { GetAccountNotificationRepository } from "../../repository/user/GetAccountNotificationRepository";

export class MockGetAccountNotificationsUseCase implements GetAccountNotificationRepository {
  async query(): Promise<AccountNotificationModel> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      emailAlert: true,
      petPlaceOffer: true,
      partnerOffer: true,
      signedCatNewsletter: true,
      signedDogNewsletter: true,
      smsAlert: true,
    };
  }
}
