import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { GetLostPetNotificationDetailsRepository } from "~/domain/repository/user/GetLostPetNotificationDetailsRepository";

export class MockGetLostPetNotificationDetailsUseCase
  implements GetLostPetNotificationDetailsRepository
{
  async query(): Promise<LostPetUpdateModel | null> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      communicationId: "1234567",
      date: "2024-07-17T10:08:41.857",
      id: "1234567",
      note: "Lost report from submitted",
      status: "missing",
      petId: "AUN19623620",
      petName: "Billy",
      update: "2024-07-19T00:03:07.17",
      foundedBy: {
        finderName: "Nico",
        finderPhoneNumber: "987-666-5432",
        finderOrganization: "Lucico",
        contact: [{ date: "2024-07-21T00:03:07.17", email: "Hellen Badu" }],
      },
    };
  }
}
